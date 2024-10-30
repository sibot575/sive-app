import React, { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Tag, Clock, Bookmark, X } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { depechesService } from '../services/airtableDepechesService';

const ads = [
  "Découvrez notre nouvelle gamme de produits locaux",
  "Investissez dans l'avenir avec notre banque partenaire",
  "Participez à notre grand concours national",
  "Nouveaux forfaits téléphoniques disponibles"
];

const AdBanner = () => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-blue-50 p-2 text-blue-800 overflow-hidden mb-4 rounded-md">
      <div className="whitespace-nowrap animate-scroll text-sm">
        {ads[currentAdIndex]}
      </div>
    </div>
  );
};

const DepecheCard = ({ depeche, isSaved, onToggleBookmark, onSelect }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'DEPECHE',
    item: { id: depeche.id, depeche },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const formattedDate = new Date(depeche.date_parution).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div
      ref={drag}
      className={`bg-white rounded-md shadow p-3 cursor-move hover:shadow-md transition-shadow duration-200 border border-gray-100
      ${isDragging ? 'opacity-50' : ''}`}
      onClick={() => onSelect(depeche)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-base font-semibold text-blue-700">{depeche.journal}</h3>
        <button 
          className={`${isSaved ? 'text-red-500' : 'text-gray-400'} hover:text-blue-600 transition-colors duration-200`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(depeche.id);
          }}
        >
          {isSaved ? <X size={14} /> : <Bookmark size={14} />}
        </button>
      </div>
      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{depeche.journal_ai}</p>
      <div className="flex flex-wrap items-center text-xs text-gray-500 gap-2">
        <span className="flex items-center"><MapPin size={10} className="mr-1" />{depeche.source}</span>
        <span className="flex items-center"><Tag size={10} className="mr-1" />{depeche.credit}</span>
        <span className="flex items-center"><Clock size={10} className="mr-1" />{depeche.heure_parution}</span>
      </div>
      <div className="mt-2 text-xs text-gray-400">
        Publié le {formattedDate}
      </div>
    </div>
  );
};

const SavedDepechesArea = ({ savedDepeches, onAddDepeche, onRemoveDepeche, onSelectDepeche }) => {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: 'DEPECHE',
    drop: (item) => onAddDepeche(item.depeche),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = canDrop && isOver;

  return (
    <div
      ref={drop}
      className={`p-3 border border-dashed rounded-md bg-white ${
        isActive ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
      }`}
      style={{ minHeight: '100px' }}
    >
      <h2 className="text-sm font-semibold text-blue-700 mb-2">Dépêches sauvegardées</h2>
      {savedDepeches.length === 0 ? (
        <p className="text-gray-400 text-center text-xs">Glissez des dépêches ici</p>
      ) : (
        <div className="space-y-2">
          {savedDepeches.map(depeche => (
            <div key={depeche.id} className="bg-gray-50 p-2 rounded-md text-xs flex justify-between items-center">
              <span className="font-medium truncate cursor-pointer hover:text-blue-600 transition-colors duration-200" 
                    onClick={() => onSelectDepeche(depeche)}>
                {depeche.journal}
              </span>
              <button 
                className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                onClick={() => onRemoveDepeche(depeche.id)}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DepecheDetailView = ({ depeche, onClose }) => {
  const formattedDate = new Date(depeche.date_parution).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-md p-4 max-w-lg w-full shadow-lg">
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-lg font-semibold text-blue-700">{depeche.journal}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
            <X size={20} />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-3">{depeche.journal_ai}</p>
        <div className="flex flex-wrap items-center text-xs text-gray-500 gap-3 mb-2">
          <span className="flex items-center"><MapPin size={12} className="mr-1" />{depeche.source}</span>
          <span className="flex items-center"><Tag size={12} className="mr-1" />{depeche.credit}</span>
          <span className="flex items-center"><Clock size={12} className="mr-1" />{depeche.heure_parution}</span>
        </div>
        <p className="text-xs text-gray-400">Publié le {formattedDate}</p>
      </div>
    </div>
  );
};

export default function TimelineDepeches() {
  const [depeches, setDepeches] = useState([]);
  const [currentDate, setCurrentDate] = useState('');
  const [savedDepeches, setSavedDepeches] = useState(() => {
    const saved = localStorage.getItem('savedDepeches');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedDepeche, setSelectedDepeche] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    localStorage.setItem('savedDepeches', JSON.stringify(savedDepeches));
  }, [savedDepeches]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await depechesService.fetchDepeches();
        setDepeches(result);
        if (result.length > 0) {
          const firstDate = new Date(result[0].date_parution).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          });
          setCurrentDate(firstDate);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const depechesByDate = depeches.reduce((acc, depeche) => {
    const date = new Date(depeche.date_parution).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(depeche);
    return acc;
  }, {});

  const dates = Object.keys(depechesByDate).sort((a, b) => 
    new Date(b.split(' ').reverse().join(' ')) - new Date(a.split(' ').reverse().join(' '))
  );

  const totalPages = dates.reduce((acc, date) => {
    return acc + Math.ceil(depechesByDate[date].length / 6);
  }, 0);

  const handleSliderChange = (event) => {
    const newValue = parseInt(event.target.value);
    setSliderValue(newValue);

    let pagesCount = 0;
    let targetDate = dates[0];
    let targetPage = 0;

    for (let date of dates) {
      const datePages = Math.ceil(depechesByDate[date].length / 6);
      if (pagesCount + datePages > newValue) {
        targetDate = date;
        targetPage = newValue - pagesCount;
        break;
      }
      pagesCount += datePages;
    }

    setCurrentDate(targetDate);
    setCurrentPage(targetPage);
  };

  const toggleBookmark = useCallback((depecheId) => {
    setSavedDepeches(prev => {
      const isAlreadySaved = prev.some(d => d.id === depecheId);
      if (isAlreadySaved) {
        return prev.filter(d => d.id !== depecheId);
      } else {
        const depecheToAdd = depeches.find(d => d.id === depecheId);
        return [...prev, depecheToAdd];
      }
    });
  }, [depeches]);

  const addDepeche = useCallback((depeche) => {
    setSavedDepeches(prev => {
      if (!prev.some(d => d.id === depeche.id)) {
        return [...prev, depeche];
      }
      return prev;
    });
  }, []);

  const removeDepeche = useCallback((depecheId) => {
    setSavedDepeches(prev => prev.filter(d => d.id !== depecheId));
  }, []);

  const navigate = (direction) => {
    const currentDateDepeches = depechesByDate[currentDate];
    const totalPages = Math.ceil(currentDateDepeches.length / 6);

    if (direction === 'right') {
      if (currentPage < totalPages - 1) {
        setCurrentPage(currentPage + 1);
        setSliderValue(sliderValue + 1);
      } else {
        const currentIndex = dates.indexOf(currentDate);
        if (currentIndex > 0) {
          setCurrentDate(dates[currentIndex - 1]);
          setCurrentPage(0);
          setSliderValue(sliderValue + 1);
        }
      }
    } else {
      if (currentPage > 0) {
        setCurrentPage(currentPage - 1);
        setSliderValue(sliderValue - 1);
      } else {
        const currentIndex = dates.indexOf(currentDate);
        if (currentIndex < dates.length - 1) {
          setCurrentDate(dates[currentIndex + 1]);
          setCurrentPage(0);
          setSliderValue(sliderValue - 1);
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4 text-sm">Erreur: {error}</div>;
  }

  const currentDepeches = depechesByDate[currentDate]?.slice(currentPage * 6, (currentPage + 1) * 6) || [];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4 max-w-6xl mx-auto">
        <AdBanner />
        <div className="flex gap-4">
          <div className="w-64">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-md shadow-sm p-3 mb-3">
              <h2 className="text-base font-semibold mb-2">Dépêches de Côte d'Ivoire</h2>
              <p className="text-xs text-blue-100 mb-3">Suivez l'actualité ivoirienne en temps réel.</p>
              <button className="text-xs text-blue-200 hover:text-white transition-colors duration-200">
                En savoir plus →
              </button>
            </div>
            <SavedDepechesArea 
              savedDepeches={savedDepeches}
              onAddDepeche={addDepeche}
              onRemoveDepeche={removeDepeche}
              onSelectDepeche={setSelectedDepeche}
            />
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <button 
                onClick={() => navigate('left')} 
                className="bg-blue-600 text-white rounded-full p-1.5 shadow-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                disabled={currentDate === dates[dates.length - 1] && currentPage === 0}
              >
                <ChevronLeft size={20} />
              </button>
              <div className="text-center">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium mb-1 mx-auto">
                  {depechesByDate[currentDate]?.length || 0}
                </div>
                <div className="text-xs font-medium text-gray-600">{currentDate}</div>
              </div>
              <button 
                onClick={() => navigate('right')}
                className="bg-blue-600 text-white rounded-full p-1.5 shadow-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                disabled={currentDate === dates[0] && currentPage === Math.ceil(depechesByDate[currentDate].length / 6) - 1}
              >
                <ChevronRight size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {currentDepeches.map(depeche => (
                <DepecheCard 
                  key={depeche.id}
                  depeche={depeche}
                  isSaved={savedDepeches.some(d => d.id === depeche.id)}
                  onToggleBookmark={toggleBookmark}
                  onSelect={setSelectedDepeche}
                />
              ))}
            </div>

            <div className="mt-4 px-2">
              <input
                type="range"
                min="0"
                max={totalPages - 1}
                value={sliderValue}
                onChange={handleSliderChange}
                className="w-full h-1 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                style={{
                  backgroundImage: `linear-gradient(to right, #2563eb 0%, #2563eb ${(sliderValue / (totalPages - 1) * 100)}%, #dbeafe ${(sliderValue / (totalPages - 1) * 100)}%, #dbeafe 100%)`
                }}
              />
              <style jsx>{`
                input[type='range']::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  appearance: none;
                  width: 12px;
                  height: 12px;
                  background: #2563eb;
                  border-radius: 50%;
                  cursor: pointer;
                  transition: all 0.15s ease-in-out;
                }
                input[type='range']::-webkit-slider-thumb:hover {
                  width: 14px;
                  height: 14px;
                  background: #1d4ed8;
                }
                input[type='range']::-moz-range-thumb {
                  width: 12px;
                  height: 12px;
                  background: #2563eb;
                  border-radius: 50%;
                  cursor: pointer;
                  border: none;
                  transition: all 0.15s ease-in-out;
                }
                input[type='range']::-moz-range-thumb:hover {
                  width: 14px;
                  height: 14px;
                  background: #1d4ed8;
                }
                .animate-scroll {
                  animation: scroll 15s linear infinite;
                }
                @keyframes scroll {
                  0% {
                    transform: translateX(100%);
                  }
                  100% {
                    transform: translateX(-100%);
                  }
                }
              `}</style>
            </div>
          </div>

          {selectedDepeche && (
            <DepecheDetailView 
              depeche={selectedDepeche} 
              onClose={() => setSelectedDepeche(null)}
            />
          )}
        </div>
      </div>
    </DndProvider>
  );
}