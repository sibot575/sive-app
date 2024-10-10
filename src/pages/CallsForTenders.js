import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, BookmarkPlus, X } from 'lucide-react';

const mockCalls = [
  {
    id: 1,
    title: 'Bienvenue sur notre nouveau site Internet !',
    description: 'Nous sommes heureux de vous compter parmi nos dernières nouvelles.',
    image: 'https://via.placeholder.com/400x300/16a34a/ffffff?text=Site+Internet',
    date: '14 Oct'
  },
  {
    id: 2,
    title: 'Nouveau club de basket sur Cissé',
    description: 'Club de basket pour enfants et adultes. Pour la compétition ou tout simplement pour le plaisir de jouer.',
    image: 'https://via.placeholder.com/400x300/16a34a/ffffff?text=Club+Basket',
    date: '23 Oct'
  },
  {
    id: 3,
    title: 'Animation bibliothèque',
    description: 'Venez découvrir nos nouvelles animations.',
    image: 'https://via.placeholder.com/400x300/16a34a/ffffff?text=Bibliothèque',
    date: '12 Nov'
  }
];

const CallCard = ({ call, onSave, isSaved }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(call));
  };

  return (
    <div 
      className="bg-white rounded-lg overflow-hidden shadow-sm h-full"
      draggable
      onDragStart={handleDragStart}
    >
      <img 
        src={call.image} 
        alt={call.title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">{call.title}</h3>
          <button 
            onClick={() => onSave(call)}
            className="text-green-700 hover:text-green-900"
          >
            {isSaved ? (
              <X className="w-5 h-5" />
            ) : (
              <BookmarkPlus className="w-5 h-5" />
            )}
          </button>
        </div>
        <p className="text-gray-600 mb-4 line-clamp-2">{call.description}</p>
        <div className="flex justify-between items-center">
          <button className="text-green-700 hover:text-green-900 text-sm font-medium">
            EN SAVOIR PLUS
          </button>
          <span className="text-gray-500 text-sm">{call.date}</span>
        </div>
      </div>
    </div>
  );
};

const CallsForTenders = () => {
  const [savedCalls, setSavedCalls] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

  const handleSave = (call) => {
    if (savedCalls.some(saved => saved.id === call.id)) {
      setSavedCalls(savedCalls.filter(saved => saved.id !== call.id));
    } else {
      setSavedCalls([...savedCalls, call]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    try {
      const call = JSON.parse(e.dataTransfer.getData('text'));
      if (!savedCalls.some(savedCall => savedCall.id === call.id)) {
        setSavedCalls([...savedCalls, call]);
      }
    } catch (error) {
      console.error('Error parsing dropped data:', error);
    }
  };

  const totalPages = Math.ceil(mockCalls.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const visibleCalls = mockCalls.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {visibleCalls.map(call => (
          <CallCard 
            key={call.id} 
            call={call}
            onSave={handleSave}
            isSaved={savedCalls.some(saved => saved.id === call.id)}
          />
        ))}
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage === totalPages - 1}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <button className="text-green-700 hover:text-green-900 font-medium">
          TOUT L'ACTU
        </button>
      </div>

      {/* Zone de dépôt pour les appels sauvegardés */}
      <div 
        className="mt-8 bg-gray-50 rounded-lg p-4"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <h2 className="text-xl font-semibold mb-4">Appels d'offres sauvegardés</h2>
        {savedCalls.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
            Faites glisser des appels d'offres ici pour les sauvegarder
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {savedCalls.map(call => (
              <CallCard 
                key={call.id} 
                call={call}
                onSave={handleSave}
                isSaved={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CallsForTenders;