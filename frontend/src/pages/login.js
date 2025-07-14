import React, { useState } from 'react';
import './LoginPage.css';
import loginImage from '../assets/logo DGI.jpg';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');

        if (!email || !password) {
            setError('Veuillez entrer votre email et mot de passe.');
            return;
        }

        try {
           
            const response = await fetch('http://localhost:5000/api/auth/login', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Connexion réussie:', data);
                localStorage.setItem('jwtToken', data.token);
                navigate('/DashboardPage');
            } else {
                console.error('Erreur de connexion:', data.message);
                setError(data.message || 'Échec de la connexion. Veuillez réessayer.');
            }
        } catch (err) {
            console.error('Erreur lors de l\'envoi de la requête de connexion:', err);
            setError('Erreur réseau. Impossible de se connecter au serveur.');
        }
    };

    return (
        <div className="login-page-container">
            <div className="header-bar">
                <div className="logo-section">
                    <img src={loginImage} alt="Direction Générale des Impôts Logo" className="logo" />
                    <div className="logo-text-arabic">
                        المديرية العامة للضرائب
                    </div>
                    <div className="logo-text-french">
                        DIRECTION GÉNÉRALE DES IMPÔTS
                    </div>
                </div>
                <div className="title-section">
                    <h1 className="main-title">Direction Générale des Impôts</h1>
                    <p className="subtitle">Portail de Déclarations Sociales</p>
                </div>
            </div>

            <div className="login-form-wrapper">
                <div className="login-box">
                    <div className="login-box-header">
                        <span className="lock-icon">🔒</span>
                        Connexion à votre espace BackOffice:
                    </div>
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Mot de passe:</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        
                        <button type="submit" className="submit-button">
                            Se connecter
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

