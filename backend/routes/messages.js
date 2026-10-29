const express = require('express');
const router  = express.Router();
const db      = require('../config/db');
const { authenticate } = require('../middleware/auth');

router.get('/:id', authenticate, (req, res) => {
  const destinataireId = Number(req.params.id);
  if (!Number.isInteger(destinataireId) || destinataireId < 1) {
    return res.status(400).json({ erreur: 'Identifiant utilisateur invalide.' });
  }
  if (req.user.type !== 'Administrateur' && req.user.id !== destinataireId) {
    return res.status(403).json({ erreur: 'Accès interdit à cette conversation.' });
  }
  const sql = `SELECT m.*, u.nom AS expediteur
               FROM Message m
               JOIN Utilisateur u ON m.expediteur_id = u.id
               WHERE m.destinataire_id = ?
               ORDER BY m.dateEnvoi DESC`;
  db.query(sql, [destinataireId], (err, rows) => {
    if (err) return res.status(500).json({ erreur: err.message });
    res.json(rows);
  });
});

router.post('/', authenticate, (req, res) => {
  const { contenu, destinataire_id } = req.body || {};
  const destinataireId = Number(destinataire_id);
  if (typeof contenu !== 'string' || !contenu.trim() || contenu.trim().length > 5000 ||
      !Number.isInteger(destinataireId) || destinataireId < 1) {
    return res.status(400).json({ erreur: 'Informations de message invalides.' });
  }
  if (destinataireId === req.user.id) {
    return res.status(400).json({ erreur: 'Vous ne pouvez pas vous envoyer un message.' });
  }
  db.query('INSERT INTO Message (contenu,expediteur_id,destinataire_id) VALUES (?,?,?)',
    [contenu.trim(), req.user.id, destinataireId], (err, result) => {
    if (err) return res.status(500).json({ erreur: err.message });
    res.status(201).json({ message: 'Message envoyé !', id: result.insertId });
  });
});

module.exports = router;