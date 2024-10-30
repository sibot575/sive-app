import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AuthPage from './components/AuthPage';
import DépêchesPage from './pages/DepechesPage';
import CartographiePage from './pages/CartographiePage';
import InfoEcoPage from './pages/InfoEcoPage';
import WebTVPage from './pages/WebTVPage';
import SiBotPage from './pages/SibotPage';
import './App.css';

const DashboardLayout = ({ isAuthenticated }) => {
  const navigate = useNavigate();

  const handlePageChange = (pageName) => {
    switch (pageName) {
      case 'Dépêches':
        navigate('/dashboard/depeches');
        break;
      case 'Cartographie':
        navigate('/dashboard/cartographie');
        break;
      case 'Info Éco':
        navigate('/dashboard/info-eco');
        break;
      case 'WebTV':
        navigate('/dashboard/webtv');
        break;
      case 'SiBot':
        navigate('/dashboard/sibot');
        break;
      case 'Accueil':
        navigate('/dashboard');
        break;
      default:
        navigate('/dashboard');
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="App">
      <Dashboard onPageChange={handlePageChange}>
        <Routes>
          <Route path="/" element={null} /> {/* Page d'accueil du dashboard */}
          <Route path="/depeches" element={<DépêchesPage />} />
          <Route path="/cartographie" element={<CartographiePage />} />
          <Route path="/info-eco" element={<InfoEcoPage />} />
          <Route path="/webtv" element={<WebTVPage />} />
          <Route path="/sibot" element={<SiBotPage />} />
        </Routes>
      </Dashboard>
    </div>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthPage onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/dashboard/*"
          element={<DashboardLayout isAuthenticated={isAuthenticated} />}
        />
      </Routes>
    </Router>
  );
}

export default App;