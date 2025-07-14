import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './formulaire.css';
import backgroundImage from '../assets/background-DGI.jpg';
import logoDGI from '../assets/logo DGI.jpg';
import logoMaroc from '../assets/royaume du maroc.jpg';

const Formulaire = () => {
    const { id: declarationId } = useParams();
    const navigate = useNavigate();

    const [declarationData, setDeclarationData] = useState(null);
    const [lignesDeclaration, setLignesDeclaration] = useState([]);

    const [formData, setFormData] = useState({
        nIdentificationFiscale: '',
        raisonSociale: '',
        adresseSiegeSocial: '',
        exercice_debut: '',
        exercice_fin: '',
        lieuSignature: '',
        dateSignature: '',
        nomSignataire: '',
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDeclarationDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('jwtToken');

                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await fetch(`http://localhost:5000/api/declarations/${declarationId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    if (response.status === 401 || response.status === 403) {
                        localStorage.removeItem('jwtToken');
                        navigate('/login');
                    }
                    throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
                }

                const data = await response.json();
                console.log('Données complètes de la déclaration reçues du backend:', data);
                setDeclarationData(data);
                setLignesDeclaration(data.lignes || []);

                setFormData({
                    nIdentificationFiscale: data.IF_groupe_société || '',
                    raisonSociale: data.raison_sociale || '',
                    adresseSiegeSocial: data['adresse_siège_social'] || '',
                    exercice_debut: data.exercice_debut ? new Intl.DateTimeFormat('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(data.exercice_debut)) : '',
                    exercice_fin: data.exercice_fin ? new Intl.DateTimeFormat('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(data.exercice_fin)) : '',
                    lieuSignature: data.lieu_signature || '',
                    dateSignature: data.date_signature ? new Intl.DateTimeFormat('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(data.date_signature)) : '',
                    nomSignataire: data.nom_signataire || '',
                });

            } catch (err) {
                setError(err.message);
                console.error('Erreur lors de la récupération des détails de la déclaration:', err);
            } finally {
                setLoading(false);
            }
        };

        if (declarationId) {
            fetchDeclarationDetails();
        }
    }, [declarationId, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Formulaire soumis:', formData);
    };

    const totalDroitsExigibles = lignesDeclaration.reduce((sum, ligne) => sum + (parseFloat(String(ligne.droits_exigibles || '0').replace(',', '.')) || 0), 0);

    if (loading) {
        return <div className="versement-page-container" style={{ backgroundImage: `url(${backgroundImage})` }}><div style={{ textAlign: 'center', padding: '50px', color: '#fff' }}>Chargement des détails de la déclaration...</div></div>;
    }

    if (error) {
        return <div className="versement-page-container" style={{ backgroundImage: `url(${backgroundImage})` }}><div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Erreur: {error}</div></div>;
    }

    if (!declarationData) {
        return <div className="versement-page-container" style={{ backgroundImage: `url(${backgroundImage})` }}><div style={{ textAlign: 'center', padding: '50px', color: '#fff' }}>Déclaration non trouvée.</div></div>;
    }

    return (
        <div className="versement-page-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="dashboard-header">
                <div className="header-nav-items">
                    <button className="header-button" onClick={() => navigate('/DashboardPage')}>Déclaration</button>
                    <div className="header-text-right active-text-header">Formulaire</div>
                </div>
            </div>

            <div className="form-content-wrapper">
                <div className="form-card-section">
                    <div className="form-header-section">
                        <div className="form-logo-left">
                            <img src={logoDGI} alt="Logo DGI" className="logo-dgi" />
                        </div>
                        <div className="form-title-block">
                            <p className="form-main-title">
                                Versement de l'IS correspondant aux plus-values des éléments transférés ayant fait l'objet du sursis de paiement dans le cadre du régime d'incitation fiscale aux opérations de restructuration des groupes de sociétés et des entreprises
                            </p>
                            <p className="form-subtitle">Bordereau - Avis de versement</p>
                            <p className="exercice-comptable">Exercice comptable</p>
                            <p className="exercice-dates">du {formData.exercice_debut}</p>
                            <p className="exercice-dates">au {formData.exercice_fin}</p>
                        </div>
                        <div className="form-logo-right">
                            <img src={logoMaroc} alt="Logo Maroc" className="logo-maroc" />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="versement-form">

                        <div className="form-section-title-container">
                            <h3 className="form-section-title">Identification de la partie versante</h3>
                            <h3 className="form-section-title align-right">هوية الطرف الدافع</h3>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="nIdentificationFiscale">N°d'identification fiscale</label>
                                <input type="text" id="nIdentificationFiscale" name="nIdentificationFiscale" value={formData.nIdentificationFiscale} onChange={handleChange} readOnly />
                            </div>
                            {/* Les champs non présents dans la table 'declaration' sont commentés */}
                            {/* <div className="form-group rtl-label-input">
                                <label htmlFor="numeroTarifDouanier">رقم التعريف الضريبي</label>
                                <input type="text" id="numeroTarifDouanier" name="numeroTarifDouanier" value={formData.numeroTarifDouanier} onChange={handleChange} readOnly />
                            </div> */}

                            <div className="form-group">
                                <label htmlFor="raisonSociale">Raison sociale</label>
                                <input type="text" id="raisonSociale" name="raisonSociale" value={formData.raisonSociale} onChange={handleChange} readOnly />
                            </div>
                            {/* Les champs non présents dans la table 'declaration' sont commentés */}
                            {/* <div className="form-group rtl-label-input">
                                <label htmlFor="nomCommercial">العنوان التجاري</label>
                                <input type="text" id="nomCommercial" name="nomCommercial" value={formData.nomCommercial} onChange={handleChange} readOnly />
                            </div> */}

                            <div className="form-group">
                                <label htmlFor="adresseSiegeSocial">Adresse du siège social</label>
                                <input type="text" id="adresseSiegeSocial" name="adresseSiegeSocial" value={formData.adresseSiegeSocial} onChange={handleChange} readOnly />
                            </div>
                            {/* Les champs non présents dans la table 'declaration' sont commentés */}
                            {/* <div className="form-group rtl-label-input">
                                <label htmlFor="adresseSiegeSocialAr">عنوان المقر الاجتماعي</label>
                                <input type="text" id="adresseSiegeSocialAr" name="adresseSiegeSocialAr" value={formData.adresseSiegeSocialAr} onChange={handleChange} readOnly />
                            </div> */}
                        </div>

                        {/* Section Droits exigibles */}
                        <div className="form-section-title-container">
                            <h3 className="form-section-title">Droits exigibles</h3>
                            <h3 className="form-section-title align-right">الواجبات المستحقة</h3>
                        </div>

                        <div className="exigible-table-container">
                            <table className="exigible-table">
                                <thead>
                                    <tr>
                                        <th>
                                            <p>تاريخ</p>
                                            <p>التحويل</p>
                                            <p>Date de</p>
                                            <p>Transfert</p>
                                        </th>
                                        <th>
                                            <p>تعبير الشركة التابعة للمجموعة</p>
                                            <p>التي استفادت من التحويل</p>
                                            <p>Désignation de la société</p>
                                            <p>du groupe ayant bénéficié</p>
                                            <p>du transfert</p>
                                        </th>
                                        <th>
                                            <p>رقم التعريف الضريبي للشركة التابعة</p>
                                            <p>للمجموعة التي استفادت من التحويل</p>
                                            <p>IF de la société du groupe</p>
                                            <p>ayant bénéficié du transfert</p>
                                        </th>
                                        <th>
                                            <p>تاريخ الحدث</p>
                                            <p>Date de</p>
                                            <p>l'événement</p>
                                        </th>
                                        <th>
                                            <p>تعريف</p>
                                            <p>Identification</p>
                                        </th>
                                        <th>
                                            <p>طبيعة المستخرات</p>
                                            <p>Nature des</p>
                                            <p>Immobilisations</p>
                                        </th>
                                        <th>
                                            <p>القيمة المحاسبية</p>
                                            <p>الصافية في تاريخ</p>
                                            <p>التحويل</p>
                                            <p>Valeur nette</p>
                                            <p>comptable au jour</p>
                                            <p>du transfert</p>
                                        </th>
                                        <th>
                                            <p>القيمة الحقيقية في تاريخ</p>
                                            <p>التحويل</p>
                                            <p>Valeur réelle au</p>
                                            <p>jour du transfert</p>
                                        </th>
                                        <th>
                                            <p>نسبة التفويت</p>
                                            <p>Pourcentage de</p>
                                            <p>cession</p>
                                        </th>
                                        <th>
                                            <p>المبلغ الضريبي الذي تم</p>
                                            <p>تأجيل أدائه</p>
                                            <p>Montant</p>
                                            <p>de l'impôt ayant fait</p>
                                            <p>l'objet du sursis de</p>
                                            <p>paiement</p>
                                        </th>
                                        <th>
                                            <p>الواجبات</p>
                                            <p>المستحقة</p>
                                            <p>Droits</p>
                                            <p>exigibles</p>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lignesDeclaration.length === 0 ? (
                                        <tr>
                                            <td colSpan="11" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                                Aucune ligne de déclaration trouvée.
                                            </td>
                                        </tr>
                                    ) : (
                                        lignesDeclaration.map((ligne, index) => (
                                            <tr key={index}>
                                                <td><input type="date" value={ligne.date_transfert ? new Date(ligne.date_transfert).toISOString().split('T')[0] : ''} readOnly /></td>
                                                <td><input type="text" value={ligne.designation_societe || ''} readOnly /></td>
                                                <td><input type="text" value={ligne.if_societe_beneficiaire || ''} readOnly /></td>
                                                <td><input type="date" value={ligne.date_evenement ? new Date(ligne.date_evenement).toISOString().split('T')[0] : ''} readOnly /></td>
                                                <td><input type="text" value={ligne.identification || ''} readOnly /></td>
                                                <td><input type="text" value={ligne.nature_immobilisations || ''} readOnly /></td>
                                                <td><input type="number" value={ligne.valeur_nette_comptable || ''} readOnly /></td>
                                                <td><input type="number" value={ligne.valeur_reelle || ''} readOnly /></td>
                                                <td><input type="number" value={ligne.pourcentage_cession || ''} readOnly /></td>
                                                <td><input type="number" value={ligne.montant_impot_sursis || ''} readOnly /></td>
                                                <td><input type="number" value={ligne.droits_exigibles || ''} readOnly /></td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="table-footer-summary">
                            <div className="total-block">
                                <p>المجموع Total</p>
                                <input type="number" className="total-input" value={totalDroitsExigibles.toFixed(2)} readOnly />
                            </div>
                        </div>

                        <div className="signature-block">
                            <div className="signature-item">
                                {/* Remplir avec les données dynamiques */}
                                <p>A {formData.lieuSignature} le {formData.dateSignature}</p>
                                <p>Cachet et signature</p>
                                {formData.nomSignataire && <p>({formData.nomSignataire})</p>}
                            </div>
                            <div className="signature-item rtl-text">
                                {/* Remplir avec les données dynamiques */}
                                <p>بتاريخ {formData.dateSignature} و حرر ب {formData.lieuSignature}</p>
                                <p>خاتم و توقيع</p>
                                {formData.nomSignataire && <p>({formData.nomSignataire})</p>}
                            </div>
                        </div>

                        {/* Footer Buttons */}
                        <div className="form-footer-buttons">
                            <button type="button" className="action-button-red" onClick={() => navigate('/login')}>Annuler</button>
                            {/* --- AJOUT DE L'ÉVÉNEMENT onClick POUR L'IMPRESSION --- */}
                            <button type="button" className="action-button-purple" onClick={() => window.print()}>Imprimer</button>
                            {/* ---------------------------------------------------- */}
                            <button type="submit" className="action-button-green">Valider</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Formulaire;


