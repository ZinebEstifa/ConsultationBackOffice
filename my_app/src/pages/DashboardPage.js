import React, { useState, useEffect } from 'react';
import './DashboardPage.css';
import backgroundImage from '../assets/background-DGI.jpg';
import { useNavigate } from 'react-router-dom';


const declarationsPerPage = 5;

const DashboardPage = () => {
    const [declarations, setDeclarations] = useState([]);
    const [filteredDeclarations, setFilteredDeclarations] = useState([]);
    const [filterStatus, setFilterStatus] = useState('Tous');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const fetchDeclarations = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('jwtToken');

            if (!token) {
                navigate('/login');
                return;
            }

            let url = `http://localhost:5000/api/declarations?`;
            if (filterStatus !== 'Tous') {
                url += `status=${filterStatus}&`;
            }
            if (searchQuery) {
                url += `if=${searchQuery}&`;
            }
            url = url.endsWith('&') ? url.slice(0, -1) : url;

            const response = await fetch(url, {
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
            setDeclarations(data);
            setFilteredDeclarations(data);
            setCurrentPage(1);
        } catch (err) {
            setError(err.message);
            console.error('Erreur lors de la récupération des déclarations:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeclarations();
    }, [filterStatus, searchQuery, navigate]);

    const brouillonCount = declarations.filter(d => d.statut === 'Brouillon').length;
    const valideCount = declarations.filter(d => d.statut === 'Validé').length;
    const deposeCount = declarations.filter(d => d.statut === 'Déposé').length;

    const totalPages = Math.ceil(filteredDeclarations.length / declarationsPerPage);
    const indexOfLastDeclaration = currentPage * declarationsPerPage;
    const indexOfFirstDeclaration = indexOfLastDeclaration - declarationsPerPage;
    const currentDeclarations = filteredDeclarations.slice(indexOfFirstDeclaration, indexOfLastDeclaration);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const getStatusClass = (status) => {
        switch (status) {
            case 'Brouillon':
                return 'status-brouillon';
            case 'Validé':
                return 'status-valide';
            case 'Déposé':
                return 'status-depose';
            default:
                return '';
        }
    };

    const handleRowClick = (declarationId) => {
        navigate(`/declarations/${declarationId}`);
    };

    return (
        <div className="dashboard-page-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
            {/* Header */}
            <div className="dashboard-header">
                <button className="header-button active">Déclaration</button>
                <div className="header-text-right">Formulaire</div>
            </div>

            {/* Main Content Area */}
            <div className="dashboard-content-wrapper">
                <div className="dashboard-card-section">
                    <h2 className="dashboard-title">Tableau de Bord des Déclarations:</h2>

                    <div className="dashboard-cards">
                        <div className="dashboard-card status-brouillon-card">
                            <span className="icon">📝</span>
                            <span className="text">Brouillon</span>
                            <span className="count">{brouillonCount}</span>
                        </div>
                        <div className="dashboard-card status-valide-card">
                            <span className="icon">✅</span>
                            <span className="text">Validé</span>
                            <span className="count">{valideCount}</span>
                        </div>
                        <div className="dashboard-card status-depose-card">
                            <span className="icon">📥</span>
                            <span className="text">Déposé</span>
                            <span className="count">{deposeCount}</span>
                        </div>
                    </div>

                    <div className="filter-search-row">
                        <div className="filter-group">
                            <label htmlFor="filterStatus">Filtrer par statut</label>
                            <select
                                id="filterStatus"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="filter-select"
                            >
                                <option value="Tous">Tous</option>
                                <option value="Brouillon">Brouillon</option>
                                <option value="Validé">Validé</option>
                                <option value="Déposé">Déposé</option>
                            </select>
                        </div>
                        <div className="search-group">
                            <label htmlFor="searchQuery">Rechercher par IF</label>
                            <input
                                type="text"
                                id="searchQuery"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Saisir l'IF..."
                                className="search-input"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '20px' }}>Chargement des données...</div>
                    ) : error ? (
                        <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>{error}</div>
                    ) : (
                        <div className="declarations-table-container">
                            <table className="declarations-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>IF Société</th>
                                        <th>Raison Sociale</th>
                                        <th>Statut</th>
                                        <th>Date de dépôt</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentDeclarations.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                                Aucune déclaration trouvée.
                                            </td>
                                        </tr>
                                    ) : (
                                        currentDeclarations.map((declaration) => {
                                            // --- AJOUT DU CONSOLE.LOG ICI ---
                                            console.log('Valeur brute de dateDepot:', declaration.date_depot);
                                            // ---------------------------------
                                            return (
                                                <tr key={declaration.id_declaration} onClick={() => handleRowClick(declaration.id_declaration)} style={{ cursor: 'pointer' }}>
                                                    <td>{declaration.id_declaration}</td>
                                                    <td>{declaration.IF_groupe_société || 'N/A'}</td>
                                                    <td>{declaration.raison_sociale}</td>
                                                    <td>
                                                        <span className={`status-badge ${getStatusClass(declaration.statut)}`}>
                                                            {declaration.statut === 'Brouillon' && '📝 '}
                                                            {declaration.statut === 'Validé' && '✅ '}
                                                            {declaration.statut === 'Déposé' && '📥 '}
                                                            {declaration.statut}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {declaration.date_depot ?
                                                            new Intl.DateTimeFormat('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(declaration.date_depot))
                                                            : 'N/A'}
                                                    </td>
                                                    <td>
                                                        <button className="action-button" onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRowClick(declaration.id_declaration);
                                                        }}>consulter</button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}


                    <div className="pagination">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => paginate(i + 1)}
                                className={`page-button ${currentPage === i + 1 ? 'active' : ''}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="page-button next-button"
                        >
                            Suivant ▶
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;