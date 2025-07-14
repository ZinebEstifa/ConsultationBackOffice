const bcrypt = require('bcryptjs');

async function generateHashes() {
    const passwords = {
        'agent_ahmed': 'pass123',
        'agent_fatima': 'testpass',
        'agent_omar': 'secret1',
        'agent_sara': 'userpass',
        'agent_karim': '123456',
        'agent_nadia': 'dgi@2025',
        'agent_youssef': 'monsieur',
        'agent_amina': 'madame'
    };

    const saltRounds = 10;
    const hashedPasswords = {};

    for (const [key, plainPassword] of Object.entries(passwords)) {
        const hash = await bcrypt.hash(plainPassword, saltRounds);
        hashedPasswords[key] = hash;
        console.log(`Hash for '${plainPassword}' (${key}): ${hash}`);
    }
    console.log('\nCopy these hashes into your SQL UPDATE statements.');
    console.log(hashedPasswords);
}

generateHashes();