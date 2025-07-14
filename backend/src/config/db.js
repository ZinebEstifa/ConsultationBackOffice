const mysql = require('mysql2/promise');


async function getConnection() {
    try {
        const connection = await mysql.createConnection({
            
            host: 'localhost',         
            user: 'root',              
            password: 'admin', 
            database: 'consultationbackoffice', 
            port: 3307,              
        });
        console.log('Connexion MySQL établie via createConnection !');
        return connection;
    } catch (error) {
        console.error('Échec de la connexion à MySQL via createConnection:', error);
        throw error; 
    }
}


module.exports = {
    getConnection
};
