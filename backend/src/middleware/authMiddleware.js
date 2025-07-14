const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/constants'); 

const authMiddleware = (req, res, next) => {
  
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Accès refusé. Aucun jeton fourni ou format invalide.' });
    }

   
    const token = authHeader.split(' ')[1];

    try {
  
        const decoded = jwt.verify(token, JWT_SECRET); 

        req.user = decoded;
        next(); 
    } catch (error) {
       
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Accès refusé. Jeton expiré.' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Accès refusé. Jeton invalide.' });
        } else {
            console.error('Erreur de vérification du jeton:', error);
            return res.status(500).json({ message: 'Erreur serveur lors de la vérification du jeton.' });
        }
    }
};

module.exports = authMiddleware;
