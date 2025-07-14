const bcrypt = require('bcryptjs');
    const { getConnection } = require('./src/config/db'); // Assurez-vous que ce chemin est correct

    async function seedAgents() {
        const agents = [
            { email: 'ahmed.larbi@dgi.ma', password: 'pass123' },
            { email: 'fatima.zahra@dgi.ma', password: 'testpass' },
            { email: 'omar.alami@dgi.ma', password: 'secret1' },
            { email: 'sara.bj@dgi.ma', password: 'userpass' },
            { email: 'karim.mansour@dgi.ma', password: '123456' },
            { email: 'nadia.elfassi@dgi.ma', password: 'dgi@2025' },
            { email: 'youssef.bouzid@dgi.ma', password: 'monsieur' },
            // Ajoutez d'autres agents ici si vous en avez plus
            // { email: 'amina.chk@dgi.ma', password: 'madame' },
        ];

        const saltRounds = 10;
        let connection; // Déclarer la connexion ici

        try {
            connection = await getConnection(); // Obtenir la connexion
            console.log('Début de l\'insertion/mise à jour des agents...');

            for (const agent of agents) {
                const hashedPassword = await bcrypt.hash(agent.password, saltRounds);
                // Utilisation de INSERT ... ON DUPLICATE KEY UPDATE pour mettre à jour si l'email existe déjà
                const sql = `
                    INSERT INTO agentsdgi (email, password)
                    VALUES (?, ?)
                    ON DUPLICATE KEY UPDATE password = VALUES(password);
                `;
                await connection.execute(sql, [agent.email, hashedPassword]);
                console.log(`Agent ${agent.email} inséré/mis à jour avec succès.`);
            }
            console.log('Toutes les agents ont été insérés/mis à jour.');
        } catch (error) {
            console.error('Erreur lors du seeding:', error);
        } finally {
            if (connection) {
                connection.end(); // Fermer la connexion
                console.log('Connexion MySQL fermée après seeding.');
            }
        }
    }

    seedAgents();
    