import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Play, Clock, Settings, FileText, Edit, Plane, MoreHorizontal, PlusCircle, X, Layout } from 'lucide-react';

const NouveauScenarioComponent = ({ onClose, onSave }) => {
  const [modules, setModules] = useState([]);
  const [connections, setConnections] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedModuleId, setDraggedModuleId] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [showModuleSelector, setShowModuleSelector] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedModuleItem, setSelectedModuleItem] = useState(null);
  const mainRef = useRef(null);

  const moduleItems = [
    { 
      category: 'Entreprise', 
      subItems: [
        { name: 'Gestion RH', icon: '👥' },
        { name: 'Comptabilité', icon: '💼' },
        { name: 'Marketing', icon: '📢' }
      ]
    },
    { 
      category: 'Actualités', 
      subItems: [
        { name: 'Veille', icon: '🔍' },
        { name: 'Agrégateur', icon: '📰' },
        { name: 'Analyse', icon: '📊' }
      ]
    },
    { 
      category: 'Utilitaire', 
      subItems: [
        { name: 'Sibot', icon: '🤖' }
      ]
    }
  ];

  const menuItems = [...moduleItems];

  useEffect(() => {
    if (mainRef.current) {
      const mainRect = mainRef.current.getBoundingClientRect();
      setModules([{
        id: 1,
        x: mainRect.width / 2 - 75,
        y: mainRect.height / 2 - 50,
        width: 150,
        height: 100,
        type: null,
        icon: '+'
      }]);
    }
  }, []);

  const handleMouseDown = (e, moduleId) => {
    setIsDragging(true);
    setDraggedModuleId(moduleId);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const { clientX, clientY } = e;
      setModules(prevModules => 
        prevModules.map(module => 
          module.id === draggedModuleId 
            ? { ...module, x: clientX - module.width / 2, y: clientY - module.height / 2 }
            : module
        )
      );
      setConnections(prevConnections => 
        prevConnections.map(conn => {
          if (conn.from === draggedModuleId) {
            return { ...conn, startX: clientX, startY: clientY };
          } else if (conn.to === draggedModuleId) {
            return { ...conn, endX: clientX, endY: clientY };
          }
          return conn;
        })
      );
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedModuleId(null);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const newZoom = zoom - e.deltaY * 0.001;
    setZoom(Math.max(0.5, Math.min(2, newZoom)));
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    setShowMenu(true);
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setSelectedModuleId(null);
  };

  const handleModuleClick = (moduleId) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module.type) {
      setSelectedModuleId(moduleId);
      setShowMenu(true);
      setMenuPosition({ x: module.x + module.width, y: module.y });
    }
  };

  const getRandomPosition = (mainRect) => {
    const padding = 100;
    return {
      x: Math.random() * (mainRect.width - 2 * padding) + padding - 75,
      y: Math.random() * (mainRect.height - 2 * padding) + padding - 50
    };
  };

  const addNewModule = (subItem) => {
    if (!mainRef.current) return null;
    
    const mainRect = mainRef.current.getBoundingClientRect();
    const position = getRandomPosition(mainRect);
    
    const newModule = {
      id: Date.now(),
      x: position.x,
      y: position.y,
      width: 150,
      height: 100,
      type: subItem.name,
      icon: subItem.icon
    };
    
    setModules(prevModules => [...prevModules, newModule]);
    return newModule;
  };

  const handleMenuItemClick = (category, subItem) => {
    if (selectedModuleId) {
      setModules(prevModules => 
        prevModules.map(module => 
          module.id === selectedModuleId 
            ? { ...module, type: subItem.name, icon: subItem.icon }
            : module
        )
      );
    } else {
      setSelectedModuleItem(subItem);
      setShowConfirmation(true);
    }
    setShowMenu(false);
    setSelectedModuleId(null);
  };

  const handleModuleConfirmation = (confirmed) => {
    if (confirmed && selectedModuleItem) {
      const newModule = addNewModule(selectedModuleItem);
      if (newModule && modules.length > 0) {
        const lastModule = modules.find(m => isLastConnectedModule(m.id));
        if (lastModule) {
          setConnections(prevConnections => [...prevConnections, {
            id: Date.now(),
            from: lastModule.id,
            to: newModule.id,
            startX: lastModule.x + lastModule.width / 2,
            startY: lastModule.y + lastModule.height / 2,
            endX: newModule.x + newModule.width / 2,
            endY: newModule.y + newModule.height / 2
          }]);
        }
      }
    }
    setShowConfirmation(false);
    setSelectedModuleItem(null);
    setShowModuleSelector(false);
  };

  const handlePlusClick = (moduleId, e) => {
    e.stopPropagation();
    const startModule = modules.find(m => m.id === moduleId);
    const newModuleId = Date.now();
    const newModule = {
      id: newModuleId,
      x: startModule.x + 200,
      y: startModule.y,
      width: 150,
      height: 100,
      type: null,
      icon: '+'
    };
    setModules(prevModules => [...prevModules, newModule]);
    setConnections(prevConnections => [...prevConnections, {
      id: Date.now(),
      from: moduleId,
      to: newModuleId,
      startX: startModule.x + startModule.width / 2,
      startY: startModule.y + startModule.height / 2,
      endX: startModule.x + 200 + 75,
      endY: startModule.y + 50
    }]);
    setSelectedModuleId(newModuleId);
    setShowMenu(true);
    setMenuPosition({ x: startModule.x + 350, y: startModule.y });
  };

  const handleDeleteConnection = (connectionId) => {
    setConnections(prevConnections => 
      prevConnections.filter(conn => conn.id !== connectionId)
    );
  };

  const isModuleConnected = (moduleId) => {
    return connections.some(conn => conn.from === moduleId || conn.to === moduleId);
  };

  const isLastConnectedModule = (moduleId) => {
    const outgoingConnections = connections.filter(conn => conn.from === moduleId);
    return outgoingConnections.length === 0 && isModuleConnected(moduleId);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-100 text-gray-900 font-sans flex flex-col">
      {/* Header */}
      <header className="flex items-center p-4 bg-white border-b border-gray-200">
        <button onClick={onClose} className="mr-4">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">Nouveau scénario</h1>
      </header>

      {/* Main content */}
      <main 
        ref={mainRef} 
        className="flex-grow relative overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onContextMenu={handleContextMenu}
      >
        <div style={{ transform: `scale(${zoom})`, transformOrigin: 'center', height: '100%', width: '100%' }}>
          {connections.map(conn => (
            <svg key={conn.id} className="absolute inset-0 w-full h-full pointer-events-none">
              <line
                x1={conn.startX}
                y1={conn.startY}
                x2={conn.endX}
                y2={conn.endY}
                stroke="#4A5568"
                strokeWidth="2"
                className="pointer-events-auto"
                onContextMenu={(e) => {
                  e.preventDefault();
                  handleDeleteConnection(conn.id);
                }}
              />
            </svg>
          ))}
          {modules.map(module => (
            <div
              key={module.id}
              className="absolute cursor-move bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
              style={{
                left: `${module.x}px`,
                top: `${module.y}px`,
                width: `${module.width}px`,
                height: `${module.height}px`,
              }}
              onMouseDown={(e) => handleMouseDown(e, module.id)}
              onClick={() => handleModuleClick(module.id)}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <span className="text-2xl mb-2">{module.icon}</span>
                <span className="text-sm font-medium">{module.type || 'Nouveau module'}</span>
              </div>
              {module.type && (
                <div
                  className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center cursor-pointer shadow-sm"
                  onClick={(e) => handlePlusClick(module.id, e)}
                >
                  {!isModuleConnected(module.id) || isLastConnectedModule(module.id) ? (
                    <PlusCircle className="w-4 h-4 text-white" />
                  ) : (
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {showMenu && (
          <div 
            className="absolute bg-white rounded-lg shadow-lg p-4" 
            style={{ left: `${menuPosition.x}px`, top: `${menuPosition.y}px`, zIndex: 1000 }}
          >
            <button 
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowMenu(false)}
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-medium mb-2 text-sm uppercase text-gray-500">Sélectionnez une action</h3>
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={index} className="relative group">
                  <div className="flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2 rounded">
                    <span>{item.category}</span>
                    <span className="text-gray-400">▶</span>
                  </div>
                  <ul className="absolute left-full top-0 bg-white rounded-lg shadow-lg p-2 hidden group-hover:block min-w-[150px]">
                    {item.subItems.map((subItem, subIndex) => (
                      <li 
                        key={subIndex} 
                        className="cursor-pointer hover:bg-gray-100 p-2 rounded flex items-center"
                        onClick={() => handleMenuItemClick(item.category, subItem)}
                      >
                        <span className="mr-2">{subItem.icon}</span>
                        <span>{subItem.name}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Module Selector */}
        <div 
          className={`fixed top-0 right-0 bg-white shadow-lg transition-transform duration-300 ease-in-out transform ${showModuleSelector ? 'translate-x-0' : 'translate-x-full'}`}
          style={{ width: '50%', height: '100%', zIndex: 1001 }}
        >
          <div className="p-4 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Sélectionnez un module</h3>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowModuleSelector(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-grow overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                {moduleItems.flatMap(category => 
                  category.subItems.map((subItem, index) => (
                    <div
                      key={`${category.category}-${index}`}
                      className="bg-gray-100 p-4 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors flex flex-col items-center"
                      onClick={() => handleMenuItemClick(category.category, subItem)}
                    >
                      <span className="text-3xl mb-2">{subItem.icon}</span>
                      <span className="text-sm font-medium">{subItem.name}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 1002 }}>
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <h3 className="text-lg font-semibold mb-4">Confirmer l'ajout du module</h3>
              <p>Voulez-vous ajouter le module "{selectedModuleItem?.name}" ?</p>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                  onClick={() => handleModuleConfirmation(false)}
                >
                  Annuler
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  onClick={() => handleModuleConfirmation(true)}
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white p-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-md flex items-center shadow-md hover:bg-blue-700 transition-colors">
            <Play className="w-5 h-5 mr-2" />
            <span className="font-medium">Exécuter une fois</span>
          </button>

          <div className="flex items-center">
            <span className="mr-4 text-xs font-medium text-gray-500">PLANIFICATION</span>
            <div className="flex items-center bg-gray-100 rounded-full p-1">
              <span className="px-3 py-1 text-sm text-gray-500">DÉSACTIVÉ</span>
              <div className="flex items-center bg-white rounded-full px-3 py-1 ml-1 shadow-sm">
                <Clock className="w-4 h-4 mr-2 text-gray-400" />
                <span className="text-sm">Toutes les 15 minutes</span>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <span className="mr-4 text-xs font-medium text-gray-500">CONTRÔLES</span>
            <Settings className="w-5 h-5 mr-4 text-gray-400 cursor-pointer" />
            <FileText className="w-5 h-5 mr-4 text-gray-400 cursor-pointer" />
            <Edit className="w-5 h-5 mr-4 text-gray-400 cursor-pointer" />
            <Plane className="w-5 h-5 mr-4 text-gray-400 cursor-pointer" />
            <Layout 
              className="w-5 h-5 mr-4 text-gray-400 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => setShowModuleSelector(!showModuleSelector)}
            />
            <MoreHorizontal className="w-5 h-5 text-gray-400 cursor-pointer" />
          </div>
        </div>
      </footer>

      {/* AI Beta button */}
      <div className="absolute top-4 right-4">
        <button className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center shadow-md hover:bg-blue-700 transition-colors">
          AI <span className="ml-1 px-1 bg-white text-blue-600 text-xs rounded font-medium">BÊTA</span>
        </button>
      </div>
    </div>
  );
};

export default NouveauScenarioComponent;