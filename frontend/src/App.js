import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import DashboardPage from './pages/DashboardPage';
import Formulaire from './pages/formulaire';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/DashboardPage" element={<DashboardPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/declarations/:id" element={<Formulaire />} />
      </Routes>
    </Router>
  );
}

export default App;


