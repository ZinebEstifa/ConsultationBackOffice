const bcrypt = require('bcryptjs');
    const { getConnection } = require('./src/config/db'); 

    async function seedAgents() {
        const agents = [
            { email: 'ahmed.larbi@dgi.ma', password: 'pass123' },
            { email: 'fatima.zahra@dgi.ma', password: 'testpass' },
            { email: 'omar.alami@dgi.ma', password: 'secret1' },
            { email: 'sara.bj@dgi.ma', password: 'userpass' },
            { email: 'karim.mansour@dgi.ma', password: '123456' },
            { email: 'nadia.elfassi@dgi.ma', password: 'dgi@2025' },
            { email: 'youssef.bouzid@dgi.ma', password: 'monsieur' },
          
        ];

        const saltRounds = 10;
        let connection; 

        try {
            connection = await getConnection(); 
            console.log('Début de l\'insertion/mise à jour des agents...');

            for (const agent of agents) {
                const hashedPassword = await bcrypt.hash(agent.password, saltRounds);
           
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
                connection.end(); 
                console.log('Connexion MySQL fermée après seeding.');
            }
        }
    }

    seedAgents();
    