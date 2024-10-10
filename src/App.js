import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import DépêchesPage from './pages/DepechesPage';
import CartographiePage from './pages/CartographiePage';
import InfoEcoPage from './pages/InfoEcoPage';
import WebTVPage from './pages/WebTVPage';
import SiBotPage from './pages/SiBotPage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('Accueil');

  const renderPage = () => {
    switch (currentPage) {
      case 'Dépêches':
        return <DépêchesPage />;
      case 'Cartographie':
        return <CartographiePage />;
      case 'Info Éco':
        return <InfoEcoPage />;
      case 'WebTV':
        return <WebTVPage />;
      case 'SiBot':
        return <SiBotPage />;
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <Dashboard onPageChange={setCurrentPage}>
        {renderPage()}
      </Dashboard>
    </div>
  );
}

export default App;