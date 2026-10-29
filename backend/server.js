const express    = require('express');
const cors       = require('cors');
const rateLimit  = require('express-rate-limit');
const helmet     = require('helmet');
require('dotenv').config();

const app = express();
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

// ── SÉCURITÉ ──
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origine non autorisée par la configuration CORS.'));
  }
}));
app.use(express.json());

// Protection contre les attaques par force brute
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { erreur: 'Trop de requêtes, réessayez dans 15 minutes.' }
});

// Limite spéciale pour la connexion
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { erreur: 'Trop de tentatives de connexion.' }
});

app.use('/api/', limiter);
app.use('/api/utilisateurs/connexion', loginLimiter);

// ── ROUTES ──
app.use('/api/utilisateurs', require('./routes/utilisateurs'));
app.use('/api/produits',     require('./routes/produits'));
app.use('/api/commandes',    require('./routes/commandes'));
app.use('/api/messages',     require('./routes/messages'));

app.get('/', (req, res) => {
  res.json({ message: 'API AgriMali opérationnelle ! 🌱', version: '2.0' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serveur AgriMali démarré sur le port ${port}`);
});