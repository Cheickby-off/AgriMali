const express = require('express');
const router  = express.Router();
const db      = require('../config/db');
const { authenticate, requireRole } = require('../middleware/auth');

router.get('/', (req, res) => {
  db.query('SELECT * FROM Produit', (err, rows) => {
    if (err) return res.status(500).json({ erreur: err.message });
    res.json(rows);
  });
});

router.get('/:id', (req, res) => {
  db.query('SELECT * FROM Produit WHERE id = ?', [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ erreur: err.message });
    if (rows.length === 0) return res.status(404).json({ erreur: 'Produit introuvable.' });
    res.json(rows[0]);
  });
});

router.post('/', authenticate, requireRole('Agriculteur'), (req, res) => {
  const { nom, description, prix, quantite, categorie } = req.body || {};
  const prixProduit = Number(prix);
  const quantiteProduit = Number(quantite);
  if (typeof nom !== 'string' || !nom.trim() || nom.trim().length > 150 ||
      typeof categorie !== 'string' || !categorie.trim() || categorie.trim().length > 100 ||
      !Number.isSafeInteger(prixProduit) || prixProduit <= 0 ||
      !Number.isSafeInteger(quantiteProduit) || quantiteProduit < 0 || quantiteProduit > 2147483647 ||
      (description != null && typeof description !== 'string')) {
    return res.status(400).json({ erreur: 'Informations produit invalides.' });
  }

  const sql = 'INSERT INTO Produit (nom,description,prix,quantite,categorie,agriculteur_id) VALUES (?,?,?,?,?,?)';
  db.query(sql, [
    nom.trim(),
    typeof description === 'string' ? description.trim() : '',
    prixProduit,
    quantiteProduit,
    categorie.trim(),
    req.user.id
  ], (err, result) => {
    if (err) return res.status(500).json({ erreur: err.message });
    res.status(201).json({ message: 'Produit ajouté !', id: result.insertId });
  });
});

router.put('/:id', authenticate, requireRole('Agriculteur'), (req, res) => {
  const { nom, prix, quantite } = req.body || {};
  const prixProduit = Number(prix);
  const quantiteProduit = Number(quantite);
  if (typeof nom !== 'string' || !nom.trim() || nom.trim().length > 150 ||
      !Number.isSafeInteger(prixProduit) || prixProduit <= 0 ||
      !Number.isSafeInteger(quantiteProduit) || quantiteProduit < 0 || quantiteProduit > 2147483647) {
    return res.status(400).json({ erreur: 'Informations produit invalides.' });
  }
  db.query(
    'UPDATE Produit SET nom=?, prix=?, quantite=? WHERE id=? AND agriculteur_id=?',
    [nom.trim(), prixProduit, quantiteProduit, req.params.id, req.user.id],
    (err, result) => {
    if (err) return res.status(500).json({ erreur: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ erreur: 'Produit introuvable.' });
    res.json({ message: 'Produit modifié !' });
  });
});

router.delete('/:id', authenticate, requireRole('Agriculteur'), (req, res) => {
  db.query('DELETE FROM Produit WHERE id = ? AND agriculteur_id = ?', [req.params.id, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ erreur: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ erreur: 'Produit introuvable.' });
    res.json({ message: 'Produit supprimé !' });
  });
});

module.exports = router;