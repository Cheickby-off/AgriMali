const express = require('express');
const router  = express.Router();
const db      = require('../config/db');
const { authenticate } = require('../middleware/auth');
const statutsAutorises = ['En attente', 'Confirmée', 'En livraison', 'Livrée', 'Annulée'];

router.get('/', authenticate, (req, res) => {
  let sql = 'SELECT * FROM Commande ORDER BY dateCommande DESC';
  let params = [];
  if (req.user.type === 'Acheteur') {
    sql = 'SELECT * FROM Commande WHERE acheteur_id = ? ORDER BY dateCommande DESC';
    params = [req.user.id];
  } else if (req.user.type === 'Agriculteur') {
    sql = `SELECT DISTINCT c.* FROM Commande c
           JOIN Commande_Produit cp ON cp.commande_id = c.id
           JOIN Produit p ON p.id = cp.produit_id
           WHERE p.agriculteur_id = ?
           ORDER BY c.dateCommande DESC`;
    params = [req.user.id];
  } else if (req.user.type !== 'Administrateur') {
    return res.status(403).json({ erreur: 'Rôle utilisateur invalide.' });
  }

  db.query(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ erreur: err.message });
    res.json(rows);
  });
});

router.post('/', authenticate, (req, res) => {
  if (req.user.type !== 'Acheteur') {
    return res.status(403).json({ erreur: 'Seuls les acheteurs peuvent passer commande.' });
  }

  if (!req.body || !Array.isArray(req.body.produits) || req.body.produits.length === 0 || req.body.produits.length > 100) {
    return res.status(400).json({ erreur: 'Le panier est vide ou invalide.' });
  }

  const quantites = new Map();
  for (const article of req.body.produits) {
    const produitId = Number(article?.id);
    const quantite = Number(article?.quantite);
    if (!Number.isSafeInteger(produitId) || produitId < 1 ||
        !Number.isSafeInteger(quantite) || quantite < 1 || quantite > 2147483647) {
      return res.status(400).json({ erreur: 'Un article du panier est invalide.' });
    }
    const totalQuantite = (quantites.get(produitId) || 0) + quantite;
    if (!Number.isSafeInteger(totalQuantite) || totalQuantite > 2147483647) {
      return res.status(400).json({ erreur: 'La quantité demandée est trop élevée.' });
    }
    quantites.set(produitId, totalQuantite);
  }

  const produitIds = [...quantites.keys()];
  db.getConnection((connectionError, connection) => {
    if (connectionError) {
      console.error('Erreur de connexion pour créer une commande :', connectionError);
      return res.status(500).json({ erreur: 'Impossible de créer la commande.' });
    }

    connection.beginTransaction(transactionError => {
      if (transactionError) {
        connection.release();
        console.error('Erreur de transaction de commande :', transactionError);
        return res.status(500).json({ erreur: 'Impossible de créer la commande.' });
      }

      const annuler = (status, message, error) => {
        if (error) console.error('Erreur de création de commande :', error);
        connection.rollback(rollbackError => {
          connection.release();
          if (rollbackError) console.error('Erreur d’annulation de commande :', rollbackError);
          if (!res.headersSent) res.status(status).json({ erreur: message });
        });
      };

      connection.query(
        'SELECT id, prix, quantite FROM Produit WHERE id IN (?) FOR UPDATE',
        [produitIds],
        (productsError, products) => {
          if (productsError) return annuler(500, 'Impossible de vérifier le stock.', productsError);
          if (products.length !== produitIds.length) {
            return annuler(400, 'Un produit du panier n’existe plus.');
          }

          let montantTotal = 0;
          for (const product of products) {
            const quantite = quantites.get(product.id);
            const prix = Number(product.prix);
            if (!Number.isSafeInteger(prix) || prix <= 0) {
              return annuler(409, `Prix invalide pour le produit #${product.id}.`);
            }
            if (Number(product.quantite) < quantite) {
              return annuler(409, `Stock insuffisant pour le produit #${product.id}.`);
            }
            montantTotal += prix * quantite;
            if (!Number.isSafeInteger(montantTotal)) {
              return annuler(400, 'Le montant total de la commande est trop élevé.');
            }
          }

          connection.query(
            'INSERT INTO Commande (montantTotal, acheteur_id) VALUES (?, ?)',
            [montantTotal, req.user.id],
            (orderError, order) => {
              if (orderError) return annuler(500, 'Impossible de créer la commande.', orderError);

              const details = products.map(product => [
                order.insertId,
                product.id,
                quantites.get(product.id),
                product.prix
              ]);
              connection.query(
                'INSERT INTO Commande_Produit (commande_id, produit_id, quantite, prixUnitaire) VALUES ?',
                [details],
                detailsError => {
                  if (detailsError) return annuler(500, 'Impossible d’enregistrer les articles de la commande.', detailsError);

                  const decrementerStock = index => {
                    if (index === products.length) {
                      return connection.commit(commitError => {
                        if (commitError) return annuler(500, 'Impossible de finaliser la commande.', commitError);
                        connection.release();
                        res.status(201).json({ message: 'Commande créée !', id: order.insertId });
                      });
                    }

                    const product = products[index];
                    const quantite = quantites.get(product.id);
                    connection.query(
                      'UPDATE Produit SET quantite = quantite - ? WHERE id = ? AND quantite >= ?',
                      [quantite, product.id, quantite],
                      (stockError, result) => {
                        if (stockError) return annuler(500, 'Impossible de mettre à jour le stock.', stockError);
                        if (result.affectedRows !== 1) {
                          return annuler(409, `Stock insuffisant pour le produit #${product.id}.`);
                        }
                        decrementerStock(index + 1);
                      }
                    );
                  };

                  decrementerStock(0);
                }
              );
            }
          );
        }
      );
    });
  });
});

router.put('/:id/statut', authenticate, (req, res) => {
  const { statut } = req.body || {};
  const commandeId = Number(req.params.id);
  const transitions = {
    'En attente': ['Confirmée', 'Annulée'],
    'Confirmée': ['En livraison', 'Annulée'],
    'En livraison': ['Livrée']
  };
  if (!Number.isInteger(commandeId) || commandeId < 1) {
    return res.status(400).json({ erreur: 'Identifiant de commande invalide.' });
  }
  if (!statutsAutorises.includes(statut)) {
    return res.status(400).json({ erreur: 'Statut de commande invalide.' });
  }
  if (!['Agriculteur', 'Acheteur', 'Administrateur'].includes(req.user.type)) {
    return res.status(403).json({ erreur: 'Rôle utilisateur invalide.' });
  }

  const commandeSql = req.user.type === 'Agriculteur'
    ? `SELECT c.statut,
              EXISTS (SELECT 1 FROM Commande_Produit cp
                      JOIN Produit p ON p.id = cp.produit_id
                      WHERE cp.commande_id = c.id AND p.agriculteur_id = ?) AS proprietaire
       FROM Commande c WHERE c.id = ?`
    : 'SELECT statut, acheteur_id FROM Commande WHERE id = ?';
  const commandeParams = req.user.type === 'Agriculteur'
    ? [req.user.id, commandeId]
    : [commandeId];

  db.query(commandeSql, commandeParams, (selectError, rows) => {
    if (selectError) return res.status(500).json({ erreur: selectError.message });
    if (rows.length === 0) return res.status(404).json({ erreur: 'Commande introuvable.' });

    const commande = rows[0];
    if (req.user.type === 'Agriculteur' && !commande.proprietaire) {
      return res.status(404).json({ erreur: 'Commande introuvable.' });
    }
    if (req.user.type === 'Acheteur' && commande.acheteur_id !== req.user.id) {
      return res.status(404).json({ erreur: 'Commande introuvable.' });
    }

    const autorise = req.user.type === 'Administrateur' ||
      (req.user.type === 'Agriculteur' && transitions[commande.statut]?.includes(statut)) ||
      (req.user.type === 'Acheteur' && commande.statut === 'En attente' && statut === 'Annulée');
    if (!autorise) {
      return res.status(403).json({ erreur: 'Cette transition de commande n’est pas autorisée.' });
    }

    db.query('UPDATE Commande SET statut = ? WHERE id = ?', [statut, commandeId], err => {
      if (err) return res.status(500).json({ erreur: err.message });
      res.json({ message: 'Statut mis à jour !' });
    });
  });
});

module.exports = router;