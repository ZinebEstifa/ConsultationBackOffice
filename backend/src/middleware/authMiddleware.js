const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/constants'); // Importe la clé secrète centralisée

const authMiddleware = (req, res, next) => {
    // 1. Vérifier si l'en-tête Authorization est présent
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Accès refusé. Aucun jeton fourni ou format invalide.' });
    }

    // 2. Extraire le jeton (supprimer le préfixe "Bearer ")
    const token = authHeader.split(' ')[1];

    try {
        // 3. Vérifier le jeton
        // jwt.verify(token, secretOrPublicKey, [options, callback])
        const decoded = jwt.verify(token, JWT_SECRET); // Utilise la même clé secrète que pour la signature

        // 4. Attacher les informations de l'utilisateur décodées à l'objet de requête
        // Cela permet aux routes suivantes d'accéder à req.user.id, req.user.email, etc.
        req.user = decoded;
        next(); // Passer au prochain middleware ou à la route
    } catch (error) {
        // 5. Gérer les erreurs de vérification du jeton
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
