const express = require('express');
const router = express.Router();
const declarationController = require('../controllers/declarationController');
const authMiddleware = require('../middleware/authMiddleware'); 

router.use(authMiddleware);

//Route GET pour récupérer toutes les déclarations
router.get('/', declarationController.getAllDeclarations);

// Route GET pour récupérer une déclaration spécifique par son ID
router.get('/:id', declarationController.getDeclarationById);

module.exports = router;