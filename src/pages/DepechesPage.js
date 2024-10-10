import React, { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Tag, Clock, Bookmark, ThumbsUp, MessageSquare, X } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Mock ads data
const ads = [
  "Découvrez notre nouvelle gamme de produits locaux",
  "Investissez dans l'avenir avec notre banque partenaire",
  "Participez à notre grand concours national",
  "Nouveaux forfaits téléphoniques disponibles"
];
const mockDepeches = [
  {
    id: 1,
    title: "Lancement d'un programme national pour l'agriculture durable",
    content: "Le gouvernement ivoirien a annoncé aujourd'hui le lancement d'un vaste programme national visant à promouvoir des pratiques agricoles durables dans tout le pays. Cette initiative vise à renforcer la sécurité alimentaire tout en préservant l'environnement...",
    date: "8 Oct, 2024",
    time: "09:30",
    category: "Agriculture",
    region: "National",
    author: "Kouassi Kouadio",
    readTime: "5 min",
    likes: 142,
    comments: 28
  },
  {
    id: 2,
    title: "Abidjan accueille un sommet international sur l'éducation",
    content: "La capitale économique ivoirienne, Abidjan, s'apprête à accueillir un sommet international majeur sur l'éducation en Afrique. Des représentants de plus de 30 pays africains sont attendus pour discuter des défis et des opportunités dans le secteur éducatif...",
    date: "8 Oct, 2024",
    time: "11:45",
    category: "Éducation",
    region: "Abidjan",
    author: "Aminata Touré",
    readTime: "4 min",
    likes: 98,
    comments: 15
  },
  {
    id: 3,
    title: "Découverte d'un nouveau site archéologique près de Yamoussoukro",
    content: "Une équipe d'archéologues ivoiriens et internationaux a annoncé la découverte d'un important site archéologique à proximité de Yamoussoukro. Les premières fouilles suggèrent la présence d'une ancienne cité datant de plusieurs siècles...",
    date: "7 Oct, 2024",
    time: "14:20",
    category: "Culture",
    region: "Yamoussoukro",
    author: "Dr. Aka N'Guessan",
    readTime: "6 min",
    likes: 175,
    comments: 42
  },
  {
    id: 4,
    title: "Lancement d'une nouvelle ligne ferroviaire reliant Abidjan à Bouaké",
    content: "Le ministre des Transports a inauguré aujourd'hui une nouvelle ligne ferroviaire moderne reliant Abidjan à Bouaké. Ce projet d'infrastructure majeur vise à dynamiser les échanges économiques entre les deux plus grandes villes du pays...",
    date: "6 Oct, 2024",
    time: "10:00",
    category: "Infrastructure",
    region: "National",
    author: "Sékou Koné",
    readTime: "5 min",
    likes: 210,
    comments: 55
  },
  {
    id: 5,
    title: "La Côte d'Ivoire renforce sa coopération économique avec l'Union Européenne",
    content: "Une délégation ivoirienne de haut niveau s'est rendue à Bruxelles pour des discussions visant à renforcer les liens économiques entre la Côte d'Ivoire et l'Union Européenne. De nouveaux accords commerciaux sont en cours de négociation...",
    date: "5 Oct, 2024",
    time: "16:30",
    category: "Économie",
    region: "International",
    author: "Marie-Claire Diallo",
    readTime: "4 min",
    likes: 87,
    comments: 19
  },
  {
    id: 6,
    title: "Inauguration d'un nouveau parc technologique à Abidjan",
    content: "Le Premier Ministre a inauguré aujourd'hui un nouveau parc technologique à Abidjan, destiné à devenir un hub pour les startups et les entreprises innovantes. Cette initiative s'inscrit dans la volonté du gouvernement de faire de la Côte d'Ivoire un leader régional dans le domaine des nouvelles technologies...",
    date: "9 Oct, 2024",
    time: "10:15",
    category: "Technologie",
    region: "Abidjan",
    author: "Yao Koffi",
    readTime: "5 min",
    likes: 120,
    comments: 33
  },
  {
    id: 7,
    title: "Lancement d'une campagne nationale de reboisement",
    content: "Le Ministère de l'Environnement et du Développement Durable a lancé aujourd'hui une vaste campagne nationale de reboisement. L'objectif est de planter plus de 5 millions d'arbres à travers le pays d'ici la fin de l'année, dans le cadre de la lutte contre le changement climatique et la déforestation...",
    date: "9 Oct, 2024",
    time: "14:45",
    category: "Environnement",
    region: "National",
    author: "Assata Bamba",
    readTime: "4 min",
    likes: 185,
    comments: 47
  },
  {
    id: 8,
    title: "Succès du festival international de cinéma d'Abidjan",
    content: "Le festival international de cinéma d'Abidjan s'est clôturé hier soir avec un record d'affluence. Plus de 50 000 spectateurs ont assisté aux projections pendant les cinq jours de l'événement, qui a mis en lumière le talent des cinéastes africains...",
    date: "9 Oct, 2024",
    time: "09:00",
    category: "Culture",
    region: "Abidjan",
    author: "Léon Coulibaly",
    readTime: "3 min",
    likes: 132,
    comments: 28
  },
  {
    id: 9,
    title: "Nouvelle découverte médicale à l'Université Félix Houphouët-Boigny",
    content: "Une équipe de chercheurs de l'Université Félix Houphouët-Boigny a annoncé une avancée majeure dans le traitement du paludisme. Leur découverte pourrait mener au développement d'un nouveau médicament plus efficace contre cette maladie qui touche des millions de personnes en Afrique...",
    date: "9 Oct, 2024",
    time: "11:30",
    category: "Santé",
    region: "Abidjan",
    author: "Dr. Aisha Konaté",
    readTime: "6 min",
    likes: 215,
    comments: 52
  },
  {
    id: 10,
    title: "Grand succès pour la foire agricole de Korhogo",
    content: "La foire agricole annuelle de Korhogo a connu un succès retentissant cette année, attirant plus de 100 000 visiteurs en trois jours. L'événement a mis en valeur les innovations dans le secteur agricole et a permis de nombreux échanges entre producteurs et acheteurs...",
    date: "9 Oct, 2024",
    time: "16:00",
    category: "Agriculture",
    region: "Korhogo",
    author: "Mamadou Sanogo",
    readTime: "4 min",
    likes: 178,
    comments: 39
  },
  {
    id: 11,
    title: "Lancement d'un programme de formation professionnelle pour les jeunes",
    content: "Le Ministère de l'Emploi et de la Protection Sociale a lancé aujourd'hui un ambitieux programme de formation professionnelle visant à équiper 50 000 jeunes Ivoiriens de compétences recherchées sur le marché du travail. Ce programme couvrira des domaines tels que la technologie, l'agriculture moderne et l'entrepreneuriat...",
    date: "9 Oct, 2024",
    time: "13:20",
    category: "Éducation",
    region: "National",
    author: "Fanta Cissé",
    readTime: "5 min",
    likes: 203,
    comments: 61
  },
  {
    id: 12,
    title: "Inauguration d'un nouveau complexe sportif à San Pedro",
    content: "Le Ministre des Sports a inauguré aujourd'hui un nouveau complexe sportif ultramoderne à San Pedro. Cette installation, qui comprend un stade de football, des courts de tennis et une piscine olympique, vise à promouvoir le sport et à former la prochaine génération d'athlètes ivoiriens de haut niveau...",
    date: "9 Oct, 2024",
    time: "17:45",
    category: "Sport",
    region: "San Pedro",
    author: "Olivier Drogba",
    readTime: "4 min",
    likes: 156,
    comments: 34
  },
  {
    id: 13,
    title: "Accord historique pour la protection de la biodiversité en Côte d'Ivoire",
    content: "Le gouvernement ivoirien a signé aujourd'hui un accord historique avec plusieurs ONG internationales pour la protection de la biodiversité dans le pays. Ce partenariat prévoit la création de nouvelles aires protégées et le renforcement des mesures de conservation de la faune et de la flore...",
    date: "9 Oct, 2024",
    time: "18:30",
    category: "Environnement",
    region: "National",
    author: "Esther Konan",
    readTime: "6 min",
    likes: 227,
    comments: 58
  }
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
    <div className="w-full bg-blue-100 p-2 text-blue-800 overflow-hidden mb-4">
      <div className="whitespace-nowrap animate-scroll">
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

  return (
    <div
      ref={drag}
      className={`bg-white rounded-lg shadow-lg p-4 cursor-move ${isDragging ? 'opacity-50' : ''}`}
      onClick={() => onSelect(depeche)}
    >
      <h3 className="text-lg font-bold text-blue-600 mb-2">{depeche.title}</h3>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{depeche.content}</p>
      <div className="flex items-center text-xs text-gray-500 mb-2 space-x-2">
        <span className="flex items-center"><MapPin size={12} className="mr-1" />{depeche.region}</span>
        <span className="flex items-center"><Tag size={12} className="mr-1" />{depeche.category}</span>
        <span className="flex items-center"><Clock size={12} className="mr-1" />{depeche.time}</span>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <button className="text-gray-500 hover:text-blue-600 flex items-center">
            <ThumbsUp size={12} className="mr-1" />
            <span className="text-xs">{depeche.likes}</span>
          </button>
          <button className="text-gray-500 hover:text-blue-600 flex items-center">
            <MessageSquare size={12} className="mr-1" />
            <span className="text-xs">{depeche.comments}</span>
          </button>
        </div>
        <button 
          className={`${isSaved ? 'text-red-600' : 'text-gray-400'} hover:text-blue-800`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(depeche.id);
          }}
        >
          {isSaved ? <X size={16} /> : <Bookmark size={16} />}
        </button>
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
      className={`p-4 border-2 border-dashed rounded-lg bg-white ${
        isActive ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
      }`}
      style={{ minHeight: '100px' }}
    >
      <h2 className="text-lg font-bold text-blue-600 mb-2">Dépêches sauvegardées</h2>
      {savedDepeches.length === 0 ? (
        <p className="text-gray-500 text-center text-sm">Faites glisser des dépêches ici pour les sauvegarder</p>
      ) : (
        <div className="space-y-2">
          {savedDepeches.map(depeche => (
            <div key={depeche.id} className="bg-white p-2 rounded shadow flex justify-between items-center">
              <span className="text-sm font-semibold truncate cursor-pointer" onClick={() => onSelectDepeche(depeche)}>{depeche.title}</span>
              <button 
                className="text-red-500 hover:text-red-700"
                onClick={() => onRemoveDepeche(depeche.id)}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DepecheDetailView = ({ depeche, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full m-4">
        <button onClick={onClose} className="float-right text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4">{depeche.title}</h2>
        <p className="mb-4">{depeche.content}</p>
        <div className="flex items-center text-sm mb-4 space-x-4">
          <span className="flex items-center"><MapPin size={16} className="mr-1" />{depeche.region}</span>
          <span className="flex items-center"><Tag size={16} className="mr-1" />{depeche.category}</span>
          <span className="flex items-center"><Clock size={16} className="mr-1" />{depeche.readTime}</span>
        </div>
        <p className="text-sm">Par {depeche.author} - {depeche.date} à {depeche.time}</p>
        <div className="mt-4 flex items-center space-x-4">
          <button className="text-gray-500 hover:text-blue-600 flex items-center">
            <ThumbsUp size={16} className="mr-1" />
            <span>{depeche.likes}</span>
          </button>
          <button className="text-gray-500 hover:text-blue-600 flex items-center">
            <MessageSquare size={16} className="mr-1" />
            <span>{depeche.comments}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default function TimelineDepeches() {
  const [currentDate, setCurrentDate] = useState(mockDepeches[0].date);
  const [savedDepeches, setSavedDepeches] = useState([]);
  const [selectedDepeche, setSelectedDepeche] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);

  // Group depeches by date
  const depechesByDate = mockDepeches.reduce((acc, depeche) => {
    if (!acc[depeche.date]) {
      acc[depeche.date] = [];
    }
    acc[depeche.date].push(depeche);
    return acc;
  }, {});

  const dates = Object.keys(depechesByDate).sort((a, b) => new Date(b) - new Date(a));

  // Calculate total number of pages across all dates
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
        const depecheToAdd = mockDepeches.find(d => d.id === depecheId);
        return [...prev, depecheToAdd];
      }
    });
  }, []);

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

  const currentDepeches = depechesByDate[currentDate].slice(currentPage * 6, (currentPage + 1) * 6);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4">
        <AdBanner />
        <div className="flex">
          <div className="w-1/4 mr-4">
            <div className="bg-blue-600 text-white rounded-lg shadow p-4 mb-4">
              <h2 className="text-xl font-bold mb-2">Dépêches de Côte d'Ivoire</h2>
              <p className="text-sm mb-4">Suivez l'actualité ivoirienne en temps réel avec nos dépêches.</p>
              <button className="text-blue-200 hover:text-white text-sm">En savoir plus →</button>
            </div>
            <SavedDepechesArea 
              savedDepeches={savedDepeches}
              onAddDepeche={addDepeche}
              onRemoveDepeche={removeDepeche}
              onSelectDepeche={setSelectedDepeche}
            />
          </div>
          
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-4">
              <button 
                onClick={() => navigate('left')} 
                className="bg-blue-600 text-white rounded-full p-2 shadow hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={currentDate === dates[dates.length - 1] && currentPage === 0}
              >
                <ChevronLeft size={24} />
              </button>
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mb-2 mx-auto">
                  {depechesByDate[currentDate].length}
                </div>
                <div className="text-sm font-semibold text-blue-600">{currentDate}</div>
              </div>
              <button 
                onClick={() => navigate('right')} 
                className="bg-blue-600 text-white rounded-full p-2 shadow hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={currentDate === dates[0] && currentPage === Math.ceil(depechesByDate[currentDate].length / 6) - 1}
              >
                <ChevronRight size={24} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
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

            <div className="mt-6">
              <input
                type="range"
                min="0"
                max={totalPages - 1}
                value={sliderValue}
                onChange={handleSliderChange}
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  backgroundImage: 'linear-gradient(to right, #2563eb 0%, #2563eb ' + (sliderValue / (totalPages - 1) * 100) + '%, #dbeafe ' + (sliderValue / (totalPages - 1) * 100) + '%, #dbeafe 100%)'
                }}
              />
              <style jsx>{`
                input[type='range']::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  appearance: none;
                  width: 16px;
                  height: 16px;
                  background: #2563eb;
                  border-radius: 50%;
                  cursor: pointer;
                  transition: all 0.15s ease-in-out;
                }
                input[type='range']::-webkit-slider-thumb:hover {
                  width: 20px;
                  height: 20px;
                  background: #1d4ed8;
                }
                input[type='range']::-moz-range-thumb {
                  width: 16px;
                  height: 16px;
                  background: #2563eb;
                  border-radius: 50%;
                  cursor: pointer;
                  border: none;
                  transition: all 0.15s ease-in-out;
                }
                input[type='range']::-moz-range-thumb:hover {
                  width: 20px;
                  height: 20px;
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