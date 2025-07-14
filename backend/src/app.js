const express = require('express');
const cors = require('cors');

const { JWT_SECRET } = require('./config/constants');
const authMiddleware = require('./middleware/authMiddleware');

const authRoutes = require('./routes/authRoutes');
const declarationRoutes = require('./routes/declarationRoutes');

const app = express();
const port = 5000;

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json()); 
app.use('/api/auth', authRoutes);
app.use('/api/declarations', authMiddleware, declarationRoutes);

app.use((req, res, next) => {
    res.status(404).json({ message: 'Route non trouv\u00e9e. Veuillez v\u00e9rifier l\'URL et la m\u00e9thode.' });
});

app.use((err, req, res, next) => {
    console.error('Erreur serveur:', err.stack);
    res.status(500).json({ message: 'Erreur interne du serveur. Veuillez consulter les logs.' });
});

app.listen(port, () => {
    console.log(`Serveur backend Node.js d\u00e9marr\u00e9 sur http://localhost:${port}`);
    console.log(`Tentative de connexion \u00e0 la base de donn\u00e9es: consultationbackoffice sur localhost (Port MySQL: 3307)`);
});





