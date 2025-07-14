const express = require('express');
const router = express.Router();
const declarationController = require('../controllers/declarationController');
const authMiddleware = require('../middleware/authMiddleware'); 

router.use(authMiddleware);


router.get('/', declarationController.getAllDeclarations);

router.get('/:id', declarationController.getDeclarationById);

module.exports = router;