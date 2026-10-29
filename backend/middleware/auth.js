const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith('Bearer ')) {
    return res.status(401).json({ erreur: 'Authentification requise.' });
  }
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET doit être configuré pour protéger les routes.');
    return res.status(500).json({ erreur: 'Le service d’authentification est indisponible.' });
  }

  try {
    req.user = jwt.verify(authorization.slice(7), process.env.JWT_SECRET);
    return next();
  } catch (error) {
    if (error.name !== 'JsonWebTokenError' && error.name !== 'TokenExpiredError') throw error;
    return res.status(401).json({ erreur: 'Session invalide ou expirée.' });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (req.user.type !== role) {
      return res.status(403).json({ erreur: `Action réservée au rôle ${role}.` });
    }
    return next();
  };
}

module.exports = { authenticate, requireRole };
