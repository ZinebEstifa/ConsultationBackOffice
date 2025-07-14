const mysql = require('mysql2/promise');

// Utilisation de createConnection - Attention, non recommandé pour un serveur en production
async function getConnection() {
    try {
        const connection = await mysql.createConnection({
            // --- Informations de connexion MySQL insérées directement ---
            host: 'localhost',         // Hôte de votre base de données
            user: 'root',              // Nom d'utilisateur de votre base de données
            password: 'admin', // REMPLACEZ CECI PAR LE MOT DE PASSE EXACT DE VOTRE UTILISATEUR MYSQL 'root'
            database: 'consultationbackoffice', // Nom exact de votre base de données
            port: 3307,                // Port de votre base de données MySQL
            // -----------------------------------------------------------
        });
        console.log('Connexion MySQL établie via createConnection !');
        return connection;
    } catch (error) {
        console.error('Échec de la connexion à MySQL via createConnection:', error);
        throw error; // Propage l'erreur pour qu'elle soit gérée plus haut
    }
}


module.exports = {
    getConnection
};
