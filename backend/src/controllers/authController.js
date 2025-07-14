const { getConnection } = require('../config/db'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { JWT_SECRET } = require('../config/constants')

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Veuillez fournir l\'email et le mot de passe.' });
    }

    let connection; 
    try {
        connection = await getConnection(); 
        const [rows] = await connection.execute('SELECT id_agentsDGI, email, password FROM agentsdgi WHERE email = ?', [email]);                                                                    
        if (rows.length === 0) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
        }
        const agent = rows[0];
        const isPasswordValid = await bcrypt.compare(password, agent.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
        }

        const token = jwt.sign(
            { id: agent.id_agentDGI, email: agent.email }, 
            JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.json({ token, user: { id: agent.id_agentDGI, nom: agent.nom, email: agent.email } });

    } catch (error) {
        console.error('Erreur lors de la connexion de l\'agent:', error);
        res.status(500).json({ message: 'Erreur serveur interne lors de la tentative de connexion.' });
    } finally {
     
        if (connection) {
            connection.end();
            console.log('Connexion MySQL fermée.');
        }
    }
};