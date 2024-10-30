import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BookmarkPlus, X, Calendar, Clock, FileText, Building, Bookmark } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { airtableService } from '../services/airtableService';

// Composant pour l'image avec fallback
const CallImage = ({ imageUrl, title }) => {
  const [hasError, setHasError] = useState(false);
  
  return (
    <div className="relative w-full h-36 bg-gray-100 rounded-t-lg overflow-hidden">
      {!hasError ? (
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200">
          <Building className="w-12 h-12 text-gray-400" />
          <span className="absolute bottom-2 text-sm text-gray-600">Image non disponible</span>
        </div>
      )}
    </div>
  );
};

// Composant pour les détails temporels
const TimeInfo = ({ date, icon: Icon, label }) => (
  <div className="flex items-center gap-1 text-xs text-gray-600">
    <Icon className="w-3 h-3" />
    <span>{date}</span>
    <span className="text-xs text-gray-500">{label}</span>
  </div>
);

// Composant Badge
const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

// Composant SavedCallsPanel
const SavedCallsPanel = ({ isOpen, onClose, savedCalls, onSave, onDragOver, onDrop }) => {
  return (
    <div 
      className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } z-50`}
    >
      <div className="h-full flex flex-col">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-green-700" />
            <h2 className="text-lg font-semibold">Appels sauvegardés</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div 
          className="flex-grow overflow-y-auto p-4"
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          {savedCalls.length === 0 ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mt-4">
              <Building className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                Glissez des appels d'offres ici pour les sauvegarder
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {savedCalls.map(call => (
                <CallCard
                  key={call.id}
                  call={call}
                  onSave={onSave}
                  isSaved={true}
                  compact={true}
                />
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t bg-gray-50">
          <p className="text-sm text-gray-500 text-center">
            {savedCalls.length} appel{savedCalls.length !== 1 ? 's' : ''} sauvegardé{savedCalls.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>
  );
};

// Composant CallCard modifié
const CallCard = ({ call, onSave, isSaved, compact = false }) => {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: fr });
    } catch {
      return 'Date non spécifiée';
    }
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(call));
  };

  const getRemainingDays = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const remainingDays = getRemainingDays(call.deadline_date);

  const cardClasses = compact 
    ? "bg-white rounded-lg shadow-sm hover:shadow transition-shadow flex flex-col h-auto"
    : "bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col h-full";

  return (
    <div
      className={cardClasses}
      draggable
      onDragStart={handleDragStart}
    >
      {!compact && <CallImage imageUrl={call.image_url} title={call.title} />}
      
      <div className="p-3 flex-grow flex flex-col">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className={`font-semibold leading-tight line-clamp-2 flex-grow ${compact ? 'text-sm' : 'text-base'}`}>
            {call.title}
          </h3>
          <button
            onClick={() => onSave(call)}
            className="text-green-700 hover:text-green-900 flex-shrink-0"
            aria-label={isSaved ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            {isSaved ? (
              <X className="w-4 h-4" />
            ) : (
              <BookmarkPlus className="w-4 h-4" />
            )}
          </button>
        </div>

        <div className="space-y-2 mb-3">
          {!compact && (
            <p className="text-gray-600 text-xs line-clamp-2">{call.resume}</p>
          )}
          
          <div className="flex flex-wrap gap-1">
            <Badge variant="default">{call.categorie}</Badge>
            {call.status === "True" && <Badge variant="success">Actif</Badge>}
            {remainingDays <= 5 && remainingDays > 0 && <Badge variant="warning">Urgent</Badge>}
            {remainingDays <= 0 && <Badge variant="danger">Expiré</Badge>}
          </div>
        </div>

        <div className="space-y-1 text-xs mb-3">
          <TimeInfo 
            date={formatDate(call.publication_date)}
            icon={Calendar}
            label="Publication"
          />
          <TimeInfo 
            date={formatDate(call.deadline_date)}
            icon={Clock}
            label="Date limite"
          />
        </div>

        <div className="mt-auto flex justify-between items-center pt-2 border-t border-gray-100">
          <div className="flex gap-2">
            {call.pdf_links && (
              <a
                href={call.pdf_links}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-green-700 hover:text-green-900 text-xs font-medium"
              >
                <FileText className="w-3 h-3" />
                <span>PDF</span>
              </a>
            )}
            {call.link && (
              <a
                href={call.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-700 hover:text-green-900 text-xs font-medium"
              >
                Détails
              </a>
            )}
          </div>
          <span className="text-xs text-gray-500">
            {call.source ? new URL(call.source).hostname : 'Non spécifiée'}
          </span>
        </div>
      </div>
    </div>
  );
};

// État initial pour les filtres
const initialFilters = {
  search: '',
  category: '',
  status: '',
  dateRange: '',
};

// Composant principal CallsForTenders
const CallsForTenders = () => {
  const [calls, setCalls] = useState([]);
  const [savedCalls, setSavedCalls] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [isSavedPanelOpen, setIsSavedPanelOpen] = useState(false);
  const itemsPerPage = 6;

  // Charger les appels d'offres depuis Airtable
  useEffect(() => {
    const fetchCalls = async () => {
      setLoading(true);
      try {
        const records = await airtableService.fetchRecords();
        setCalls(records);
        
        const savedCallIds = JSON.parse(localStorage.getItem('savedCallIds') || '[]');
        const savedCallsData = JSON.parse(localStorage.getItem('savedCalls') || '[]');
        
        const updatedSavedCalls = savedCallIds.map(savedId => {
          const updatedCall = records.find(record => record.id === savedId);
          return updatedCall || savedCallsData.find(saved => saved.id === savedId);
        }).filter(call => call !== null);
        
        setSavedCalls(updatedSavedCalls);
        localStorage.setItem('savedCalls', JSON.stringify(updatedSavedCalls));
        setError(null);
      } catch (error) {
        console.error('Erreur lors de la récupération des appels d\'offres:', error);
        setError('Impossible de charger les appels d\'offres. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchCalls();
  }, []);

  useEffect(() => {
    const savedCallsData = localStorage.getItem('savedCalls');
    if (savedCallsData) {
      setSavedCalls(JSON.parse(savedCallsData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('savedCalls', JSON.stringify(savedCalls));
  }, [savedCalls]);

  const filteredCalls = calls.filter(call => {
    const matchesSearch = call.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         call.resume.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = !filters.category || call.categorie === filters.category;
    const matchesStatus = !filters.status || call.status === filters.status;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleSave = (call) => {
    let updatedSavedCalls;
    const callExists = savedCalls.some(saved => saved.id === call.id);

    if (callExists) {
      updatedSavedCalls = savedCalls.filter(saved => saved.id !== call.id);
    } else {
      updatedSavedCalls = [...savedCalls, call];
      setIsSavedPanelOpen(true);
    }
    
    setSavedCalls(updatedSavedCalls);
    localStorage.setItem('savedCalls', JSON.stringify(updatedSavedCalls));
    localStorage.setItem('savedCallIds', JSON.stringify(updatedSavedCalls.map(saved => saved.id)));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    try {
      const call = JSON.parse(e.dataTransfer.getData('text'));
      if (!savedCalls.some(saved => saved.id === call.id)) {
        const updatedSavedCalls = [...savedCalls, call];
        setSavedCalls(updatedSavedCalls);
        localStorage.setItem('savedCalls', JSON.stringify(updatedSavedCalls));
        localStorage.setItem('savedCallIds', JSON.stringify(updatedSavedCalls.map(saved => saved.id)));
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données déposées:', error);
    }
  };

  const totalPages = Math.ceil(filteredCalls.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const visibleCalls = filteredCalls.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 px-4">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* En-tête avec bouton de sauvegarde */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Appels d'offres</h1>
        <button
          onClick={() => setIsSavedPanelOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
        >
          <Bookmark className="w-5 h-5" />
          <span className="font-medium">
            {savedCalls.length} sauvegarde{savedCalls.length !== 1 ? 's' : ''}
          </span>
        </button>
      </div>

      {/* Filtres */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Rechercher..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          />
          
          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          >
            <option value="">Toutes les catégories</option>
            {Array.from(new Set(calls.map(call => call.categorie))).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          >
            <option value="">Tous les statuts</option>
            <option value="True">Actif</option>
            <option value="False">Inactif</option>
          </select>

          <button
            onClick={() => setFilters(initialFilters)}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Réinitialiser les filtres
          </button>
        </div>
      </div>
      
      {/* Grille des appels d'offres */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {visibleCalls.map(call => (
          <CallCard
            key={call.id}
            call={call}
            onSave={handleSave}
            isSaved={savedCalls.some(saved => saved.id === call.id)}
          />
        ))}
      </div>

      {/* Message si aucun résultat */}
      {visibleCalls.length === 0 && (
        <div className="text-center py-8">
          <Building className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Aucun appel d'offres ne correspond à vos critères</p>
        </div>
      )}

      {/* Pagination */}
      {visibleCalls.length > 0 && (
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage + 1} sur {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage === totalPages - 1}
              className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <span className="text-sm text-gray-500">
            {filteredCalls.length} résultat{filteredCalls.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Panneau des appels sauvegardés */}
      <SavedCallsPanel
        isOpen={isSavedPanelOpen}
        onClose={() => setIsSavedPanelOpen(false)}
        savedCalls={savedCalls}
        onSave={handleSave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />

      {/* Footer avec statistiques */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total des appels d'offres</h3>
          <p className="text-2xl font-bold text-gray-900">{calls.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Appels d'offres actifs</h3>
          <p className="text-2xl font-bold text-green-600">
            {calls.filter(call => call.status === "True").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Appels sauvegardés</h3>
          <p className="text-2xl font-bold text-blue-600">{savedCalls.length}</p>
        </div>
      </div>
    </div>
  );
};

export default CallsForTenders;