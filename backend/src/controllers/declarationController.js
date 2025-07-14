const { getConnection } = require('../config/db');

// Récupérer toutes les déclarations avec options de filtrage et tri
exports.getAllDeclarations = async (req, res) => {
    const { status, 'if': ifNumber } = req.query;

    let connection;
    try {
        connection = await getConnection();

        let sql = 'SELECT id_declaration, IF_groupe_société, raison_sociale, statut, date_depot, exercice_debut, exercice_fin FROM declaration WHERE 1=1';
        const params = [];

        if (status && status !== 'Tous') {
            sql += ' AND statut = ?';
            params.push(status);
        }

        if (ifNumber) {
            sql += ' AND IF_groupe_société LIKE ?';
            params.push(`%${ifNumber}%`);
        }

        sql += ' ORDER BY date_depot DESC, id_declaration DESC';

        const [declarations] = await connection.execute(sql, params);
        res.json(declarations);
    } catch (error) {
        console.error('Erreur lors de la récupération des déclarations:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des déclarations.' });
    } finally {
        if (connection) {
            connection.end();
            console.log('Connexion MySQL fermée après getAllDeclarations.');
        }
    }
};

// Récupérer une déclaration spécifique par son ID, incluant toutes ses lignes de déclaration
exports.getDeclarationById = async (req, res) => {
    const declarationId = req.params.id;

    let connection;
    try {
        connection = await getConnection();

        // 1. Récupérer les détails de la déclaration principale
   
        const [declarationRows] = await connection.execute(`
            SELECT 
                id_declaration, 
                IF_groupe_société, 
                raison_sociale, 
                statut, 
                date_depot, 
                adresse_siège_social, 
                exercice_debut, 
                exercice_fin,
                lieu_signature,     
                date_signature,     
                nom_signataire      
            FROM declaration 
            WHERE id_declaration = ?`, 
            [declarationId]
        );

        if (declarationRows.length === 0) {
            return res.status(404).json({ message: 'Déclaration non trouvée.' });
        }

        const declaration = declarationRows[0];

        // 2. Récupérer toutes les lignes de déclaration associées à cette déclaration
        const [ligneDeclarationRows] = await connection.execute(`
            SELECT 
                id_ligne,
                id_declaration,
                IF_de_la_societe_du_groupe_ayant_beneficie_du_transfert AS if_societe_beneficiaire,
                Nature_de_l_evenement AS nature_evenement,
                Date_de_l_evenement AS date_evenement,
                Nature_des_immobilisations AS nature_immobilisations,
                Identification AS identification,
                Valeur_nette_comptable_au_jour_du_transfert AS valeur_nette_comptable,
                Valeur_reelle_au_jour_du_transfert AS valeur_reelle,
                Montant_impot_sursis_paiement AS montant_impot_sursis,
                Pourcentage_de_cession AS pourcentage_cession,
                Droits_exigibles AS droits_exigibles,
                Designation_de_la_societe_du_groupe_ayant_beneficie_du_transfert AS designation_societe,
                date_de_transfert AS date_transfert
            FROM ligne_declaration 
            WHERE id_declaration = ?`, 
            [declarationId]
        );

        declaration.lignes = ligneDeclarationRows;

        res.json(declaration);

    } catch (error) {
        console.error(`Erreur lors de la récupération de la déclaration ${declarationId}:`, error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération de la déclaration détaillée.' });
    } finally {
        if (connection) {
            connection.end();
            console.log('Connexion MySQL fermée après getDeclarationById.');
        }
    }
};