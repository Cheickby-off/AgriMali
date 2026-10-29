const express = require('express');
const router  = express.Router();
const db      = require('../config/db');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const { authenticate, requireRole } = require('../middleware/auth');

router.post('/inscription', (req, res) => {
  const { nom, email, motDePasse, telephone, type } = req.body;

  if (!nom?.trim() || !email?.trim() || typeof motDePasse !== 'string' || motDePasse.length < 8) {
    return res.status(400).json({ erreur: 'Nom, email et mot de passe de 8 caractères minimum requis.' });
  }
  if (!['Agriculteur', 'Acheteur'].includes(type)) {
    return res.status(400).json({ erreur: 'Type de compte invalide.' });
  }

  const hash = bcrypt.hashSync(motDePasse, 10);
  const sql  = 'INSERT INTO Utilisateur (nom,email,motDePasse,telephone,type) VALUES (?,?,?,?,?)';
  db.query(sql, [nom, email, hash, telephone, type], (err, result) => {
    if (err) return res.status(500).json({ erreur: err.message });
    const tableProfil = type === 'Agriculteur' ? 'Agriculteur' : 'Acheteur';
    db.query(`INSERT INTO ${tableProfil} (id) VALUES (?)`, [result.insertId], (profileError) => {
      if (profileError) {
        db.query('DELETE FROM Utilisateur WHERE id = ?', [result.insertId], (cleanupError) => {
          if (cleanupError) console.error('Erreur de nettoyage après inscription :', cleanupError);
          console.error('Erreur de création du profil :', profileError);
          res.status(500).json({ erreur: 'Impossible de créer le profil du compte.' });
        });
        return;
      }
      res.json({ message: 'Compte créé !', id: result.insertId });
    });
  });
});

router.post('/connexion', (req, res) => {
  const { email, motDePasse } = req.body;
  db.query('SELECT * FROM Utilisateur WHERE email = ?', [email], (err, rows) => {
    if (err || rows.length === 0)
      return res.status(401).json({ erreur: 'Email ou mot de passe incorrect' });
    const user = rows[0];
    const ok   = bcrypt.compareSync(motDePasse, user.motDePasse);
    if (!ok) return res.status(401).json({ erreur: 'Mot de passe incorrect' });
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET doit être configuré pour activer la connexion.');
      return res.status(500).json({ erreur: 'Le service de connexion est momentanément indisponible.' });
    }
    const token = jwt.sign(
      { id: user.id, type: user.type },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, user: { id: user.id, nom: user.nom, type: user.type } });
  });
});

router.get('/', authenticate, requireRole('Administrateur'), (req, res) => {
  db.query('SELECT id, nom, email, telephone, type FROM Utilisateur', (err, rows) => {
    if (err) return res.status(500).json({ erreur: err.message });
    res.json(rows);
  });
});

module.exports = router;