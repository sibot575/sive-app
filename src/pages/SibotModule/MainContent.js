import React, { useState } from 'react';
import { PlusCircle, Clock, X, Trash2, Settings, Play, Copy } from 'lucide-react';

const MainContent = ({
  modules,
  setModules,
  connections,
  setConnections,
  zoom,
  setZoom,
  mainModuleId,
  setMainModuleId,
  mainRef,
  onAddModule,
  onUpdateModule,
  onDeleteModule,
  onAddConnection,
  onDeleteConnection,
  showModuleSelector,
  setShowModuleSelector
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedModuleId, setDraggedModuleId] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [isDraggingClock, setIsDraggingClock] = useState(false);
  const [isDraggingConnection, setIsDraggingConnection] = useState(false);
  const [draggedConnectionStart, setDraggedConnectionStart] = useState(null);
  const [tempConnection, setTempConnection] = useState(null);
  const [showConfigureModal, setShowConfigureModal] = useState(false);
  const [configureSearchTerm, setConfigureSearchTerm] = useState('');
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [showDataContainer, setShowDataContainer] = useState(false);
  const [containerPosition, setContainerPosition] = useState({ x: 0, y: 0 });
  const [selectedData, setSelectedData] = useState([]);

  const moduleItems = [
    { 
      category: 'Entreprise', 
      subItems: [
        { name: 'Recherche d\'entreprise', icon: '🔍', description: 'Recherche d\'informations sur les entreprises' },
        { name: 'Données d\'entreprise', icon: '📊', description: 'Collecte et analyse des données d\'entreprise' },
        { name: 'Connexions inter-entreprises', icon: '🔗', description: 'Analyse des relations entre entreprises' },
        { name: 'Prédictions de collaborations', icon: '🔮', description: 'Prévisions de futures collaborations' },
        { name: 'Rapports d\'analyse d\'entreprise', icon: '📑', description: 'Génération de rapports détaillés' }
      ]
    },
    { 
      category: 'Actualités', 
      subItems: [
        { name: 'Veille stratégique', icon: '👀', description: 'Surveillance des tendances et actualités' },
        { name: 'Agrégateur de contenu', icon: '📰', description: 'Collecte et organisation du contenu' },
        { name: 'Analyse d\'actualités', icon: '📊', description: 'Analyse approfondie des actualités' },
        { name: 'Alertes d\'actualité', icon: '🚨', description: 'Notifications en temps réel' },
        { name: 'Filtres d\'actualités', icon: '🔍', description: 'Personnalisation des flux d\'actualités' }
      ]
    },
    { 
      category: 'Utilitaire', 
      subItems: [
        { name: 'Sibot', icon: '🤖', description: 'Assistant virtuel intelligent' }
      ]
    }
  ];

  const handleMouseDown = (e, moduleId) => {
    e.preventDefault();
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
    } else if (isDraggingClock) {
      const { clientX, clientY } = e;
      const targetModule = modules.find(module => 
        clientX >= module.x && 
        clientX <= module.x + module.width && 
        clientY >= module.y && 
        clientY <= module.y + module.height
      );

      if (targetModule && targetModule.id !== mainModuleId && isModuleEligibleForClock(targetModule.id)) {
        setMainModuleId(targetModule.id);
        setModules(prevModules => 
          prevModules.map(module => ({
            ...module,
            isMain: module.id === targetModule.id
          }))
        );
      }
    } else if (isDraggingConnection) {
      const { clientX, clientY } = e;
      setTempConnection({
        startX: draggedConnectionStart.x,
        startY: draggedConnectionStart.y,
        endX: clientX,
        endY: clientY
      });
    }
  };

  const handleMouseUp = (e) => {
    if (isDraggingConnection) {
      const { clientX, clientY } = e;
      const targetModule = modules.find(module => 
        clientX >= module.x && 
        clientX <= module.x + module.width && 
        clientY >= module.y && 
        clientY <= module.y + module.height &&
        module.id !== draggedConnectionStart.moduleId
      );

      if (targetModule) {
        onAddConnection({
          id: Date.now(),
          from: draggedConnectionStart.moduleId,
          to: targetModule.id,
          startX: draggedConnectionStart.x,
          startY: draggedConnectionStart.y,
          endX: targetModule.x + targetModule.width / 2,
          endY: targetModule.y + targetModule.height / 2
        });
      }
    }

    setIsDragging(false);
    setDraggedModuleId(null);
    setIsDraggingClock(false);
    setIsDraggingConnection(false);
    setDraggedConnectionStart(null);
    setTempConnection(null);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const newZoom = zoom - e.deltaY * 0.001;
    setZoom(Math.max(0.5, Math.min(2, newZoom)));
  };

  const handleContextMenu = (e, moduleId = null) => {
    e.preventDefault();
    e.stopPropagation();
    if (moduleId) {
      const parentModule = modules.find(m => m.id === moduleId);
      const newModuleId = Date.now();
      const newModule = {
        id: newModuleId,
        x: parentModule.x + 200,
        y: parentModule.y,
        width: 100,
        height: 100,
        type: 'Nouveau module',
        icon: '+',
        isMain: false,
        description: 'Nouveau module',
        status: 'no-data',
        searchTerm: '',
        advancedSettings: {}
      };
      onAddModule(newModule);
      onAddConnection({
        id: Date.now(),
        from: moduleId,
        to: newModuleId,
        startX: parentModule.x + parentModule.width / 2,
        startY: parentModule.y + parentModule.height / 2,
        endX: parentModule.x + 200 + newModule.width / 2,
        endY: parentModule.y + newModule.height / 2
      });
      setSelectedModuleId(newModuleId);
      setShowMenu(true);
      setMenuPosition({ x: parentModule.x + 350, y: parentModule.y });
    } else {
      setShowMenu(true);
      setMenuPosition({ x: e.clientX, y: e.clientY });
      setSelectedModuleId(null);
    }
  };

  const handleModuleClick = (moduleId) => {
    const module = modules.find(m => m.id === moduleId);
    if (module.type === 'Nouveau module' || (module.type && module.type !== 'Main')) {
      setSelectedModuleId(moduleId);
      setShowMenu(true);
      setMenuPosition({ x: module.x + module.width, y: module.y });
    }
  };

  const handleMenuItemClick = (category, subItem) => {
    if (selectedModuleId) {
      onUpdateModule({
        ...modules.find(m => m.id === selectedModuleId),
        type: subItem.name,
        icon: subItem.icon,
        description: subItem.description,
        status: 'no-data',
        searchTerm: '',
        advancedSettings: {}
      });
    } else {
      const newModule = {
        id: Date.now(),
        x: menuPosition.x,
        y: menuPosition.y,
        width: 100,
        height: 100,
        type: subItem.name,
        icon: subItem.icon,
        isMain: false,
        description: subItem.description,
        status: 'no-data',
        searchTerm: '',
        advancedSettings: {}
      };
      onAddModule(newModule);
    }
    setShowMenu(false);
    setSelectedModuleId(null);
  };

  const handlePlusClick = (moduleId, e) => {
    e.stopPropagation();
    const startModule = modules.find(m => m.id === moduleId);
    const newModuleId = Date.now();
    const newModule = {
      id: newModuleId,
      x: startModule.x + 200,
      y: startModule.y,
      width: 100,
      height: 100,
      type: 'Nouveau module',
      icon: '+',
      isMain: false,
      description: 'Nouveau module',
      status: 'no-data',
      searchTerm: '',
      advancedSettings: {}
    };
    onAddModule(newModule);
    onAddConnection({
      id: Date.now(),
      from: moduleId,
      to: newModuleId,
      startX: startModule.x + startModule.width / 2,
      startY: startModule.y + startModule.height / 2,
      endX: startModule.x + 200 + newModule.width / 2,
      endY: startModule.y + newModule.height / 2
    });
    setSelectedModuleId(newModuleId);
    setShowMenu(true);
    setMenuPosition({ x: startModule.x + 350, y: startModule.y });
  };

  const handleClockMouseDown = (e) => {
    e.stopPropagation();
    setIsDraggingClock(true);
  };

  const isModuleEligibleForClock = (moduleId) => {
    const incomingConnections = connections.filter(conn => conn.to === moduleId);
    if (incomingConnections.length === 0) {
      return true;
    }
    const outgoingConnections = connections.filter(conn => conn.from === moduleId);
    if (outgoingConnections.length > 0) {
      return !connections.some(conn => conn.to === moduleId);
    }
    return false;
  };

  const handleConnectionStart = (e, moduleId) => {
    e.stopPropagation();
    setIsDraggingConnection(true);
    const module = modules.find(m => m.id === moduleId);
    setDraggedConnectionStart({
      moduleId,
      x: module.x + module.width / 2,
      y: module.y + module.height / 2
    });
  };

  const shouldShowLeftConnector = (module) => {
    if (module.id === mainModuleId) {
      return false;
    }
    return !connections.some(conn => conn.to === module.id);
  };

  const shouldShowRightConnector = (module) => {
    return !isModuleConnected(module.id) || isLastConnectedModule(module.id);
  };

  const isModuleConnected = (moduleId) => {
    return connections.some(conn => conn.from === moduleId || conn.to === moduleId);
  };

  const isLastConnectedModule = (moduleId) => {
    const outgoingConnections = connections.filter(conn => conn.from === moduleId);
    return outgoingConnections.length === 0 && isModuleConnected(moduleId);
  };

  const handleConfigure = () => {
    const selectedModule = modules.find(m => m.id === selectedModuleId);
    setConfigureSearchTerm(selectedModule.searchTerm || '');
    setShowAdvancedSettings(Object.keys(selectedModule.advancedSettings || {}).length > 0);
    setShowConfigureModal(true);
  };

  // Modified canExecuteModule function
  const canExecuteModule = (moduleId) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) {
      return false; // Return false if the module doesn't exist
    }
    if (module.status === 'no-data') {
      return false;
    }

    const incomingConnections = connections.filter(conn => conn.to === moduleId);
    for (let conn of incomingConnections) {
      const sourceModule = modules.find(m => m.id === conn.from);
      if (!sourceModule || sourceModule.status !== 'executed') {
        return false;
      }
    }

    return true;
  };

  const handleExecute = () => {
    if (canExecuteModule(selectedModuleId)) {
      // Simulate data generation
      const generatedData = ['Data 1', 'Data 2', 'Data 3'];
      
      setModules(prevModules =>
        prevModules.map(module =>
          module.id === selectedModuleId
            ? { ...module, status: 'executed', executionData: generatedData }
            : module
        )
      );
      setShowMenu(false);
    } else {
      alert("Ce module ne peut pas être exécuté. Assurez-vous qu'il a des données et que tous les modules précédents ont été exécutés.");
    }
  };
  const handleSearchFocus = (moduleId, event) => {
    const connectedModules = connections
      .filter(conn => conn.to === moduleId)
      .map(conn => modules.find(m => m.id === conn.from))
      .filter(m => m && m.status === 'executed');

    if (connectedModules.length > 0) {
      const rect = event.target.getBoundingClientRect();
      setContainerPosition({ x: rect.left, y: rect.bottom });
      setShowDataContainer(true);
      setSelectedData(connectedModules.flatMap(m => m.executionData || []));
    }
  };

  const handleDataSelect = (data) => {
    setConfigureSearchTerm(prevTerm => prevTerm + ' ' + data);
    setShowDataContainer(false);
  };

  const handleClone = () => {
    const moduleToClone = modules.find(m => m.id === selectedModuleId);
    const newModule = {
      ...moduleToClone,
      id: Date.now(),
      x: moduleToClone.x + 50,
      y: moduleToClone.y + 50,
      status: 'no-data',
      searchTerm: moduleToClone.searchTerm,
      advancedSettings: { ...moduleToClone.advancedSettings }
    };
    onAddModule(newModule);
    setShowMenu(false);
  };

  const handleConfigureSubmit = () => {
    setModules(prevModules =>
      prevModules.map(module =>
        module.id === selectedModuleId
          ? { 
              ...module, 
              status: 'configured', 
              searchTerm: configureSearchTerm,
              advancedSettings: showAdvancedSettings ? { ...module.advancedSettings } : {}
            }
          : module
      )
    );
    setShowConfigureModal(false);
    setShowMenu(false);
  };

  return (
    <main 
      ref={mainRef} 
      className="flex-grow relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      onContextMenu={(e) => handleContextMenu(e)}
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
      }}
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
              strokeWidth="8"
              strokeOpacity="0.1"
              className="pointer-events-auto cursor-pointer"
              onContextMenu={(e) => {
                e.preventDefault();
                onDeleteConnection(conn.id);
              }}
            />
            <line
              x1={conn.startX}
              y1={conn.startY}
              x2={conn.endX}
              y2={conn.endY}
              stroke="#4A5568"
              strokeWidth="2"
            />
          </svg>
        ))}
        {tempConnection && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <line
              x1={tempConnection.startX}
              y1={tempConnection.startY}
              x2={tempConnection.endX}
              y2={tempConnection.endY}
              stroke="#4A5568"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          </svg>
        )}
        {modules.map(module => (
          <div
            key={module.id}
            className="absolute"
            style={{
              left: `${module.x}px`,
              top: `${module.y}px`,
              width: `${module.width}px`,
              height: `${module.height + 40}px`,
            }}
          >
            <div
              className="cursor-move bg-white rounded-full shadow-md hover:shadow-lg transition-shadow border border-gray-200 flex flex-col items-center justify-center relative"
              style={{
                width: `${module.width}px`,
                height: `${module.height}px`,
              }}
              onMouseDown={(e) => handleMouseDown(e, module.id)}
              onClick={() => handleModuleClick(module.id)}
              onContextMenu={(e) => handleContextMenu(e, module.id)}
            >
              <span className="text-2xl">{module.icon}</span>
              <div
                className={`absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${
                  module.status === 'no-data' ? 'bg-red-500' :
                  module.status === 'configured' ? 'bg-yellow-500' :
                  module.status === 'executed' ? 'bg-green-500' : ''
                }`}
              >
                {module.status === 'no-data' && <span className="text-white font-bold">!</span>}
                {module.status === 'configured' && <span className="text-white">⚙️</span>}
                {module.status === 'executed' && <span className="text-white">✓</span>}
              </div>
              {module.isMain && (
                <div
                  className="absolute -bottom-2 -left-2 bg-blue-500 rounded-full p-1 cursor-move border-2 border-white"
                  onMouseDown={handleClockMouseDown}
                  style={{ width: '24px', height: '24px' }}
                >
                  <Clock className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <div className="mt-2 text-center">
              <span className="text-sm font-medium">{module.type}</span>
              <p className="text-xs text-gray-500">{module.description}</p>
            </div>
            {(module.type !== 'Nouveau module' || !module.isMain) && (
              <>
                {shouldShowRightConnector(module) && (
                  <div
                    className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center cursor-pointer shadow-sm"
                    style={{ top: `${module.height / 2}px` }}
                    onClick={(e) => handlePlusClick(module.id, e)}
                    onMouseDown={(e) => handleConnectionStart(e, module.id)}
                  >
                    <PlusCircle className="w-4 h-4 text-white" />
                  </div>
                )}
                {shouldShowLeftConnector(module) && (
                  <div
                    className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center cursor-pointer shadow-sm"
                    style={{ top: `${module.height / 2}px` }}
                  >
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                )}
              </>
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
            {moduleItems.map((item, index) => (
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
            {selectedModuleId && (
              <>
                <li 
                  className="cursor-pointer hover:bg-gray-100 p-2 rounded flex items-center"
                  onClick={handleConfigure}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  <span>Paramétrer</span>
                </li>
                <li 
                  className={`cursor-pointer p-2 rounded flex items-center ${
                    canExecuteModule(selectedModuleId) ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'
                  }`}
                  onClick={handleExecute}
                >
                  <Play className="w-4 h-4 mr-2" />
                  <span>Exécuter</span>
                </li>
                <li 
                  className="cursor-pointer hover:bg-gray-100 p-2 rounded flex items-center"
                  onClick={handleClone}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  <span>Cloner</span>
                </li>
                <li 
                  className="cursor-pointer hover:bg-gray-100 p-2 rounded flex items-center text-red-500"
                  onClick={() => onDeleteModule(selectedModuleId)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  <span>Supprimer le module</span>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
  
      {showConfigureModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 1100 }}>
          <div className="bg-white p-6 rounded-lg shadow-lg" style={{ width: '400px' }}>
            <h2 className="text-xl font-bold mb-4">Configurer le module</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Recherche</label>
              <input
                type="text"
                value={configureSearchTerm}
                onChange={(e) => setConfigureSearchTerm(e.target.value)}
                onFocus={(e) => handleSearchFocus(selectedModuleId, e)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Entrez votre terme de recherche"
              />
            </div>
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="advancedSettings"
                checked={showAdvancedSettings}
                onChange={(e) => setShowAdvancedSettings(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="advancedSettings" className="text-sm text-gray-700">Afficher les paramètres avancés</label>
            </div>
            {showAdvancedSettings && (
              <div className="mb-4">
                <p className="text-sm text-gray-500">Paramètres avancés à implémenter</p>
              </div>
            )}
            <div className="flex justify-between">
              <button
                onClick={() => setShowConfigureModal(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
              >
                Annuler
              </button>
              <button
                onClick={handleConfigureSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
  
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
  
      {showDataContainer && (
        <div 
          className="absolute bg-white rounded-lg shadow-lg p-4"
          style={{ 
            left: `${containerPosition.x}px`, 
            top: `${containerPosition.y}px`, 
            zIndex: 1200,
            maxHeight: '200px',
            overflowY: 'auto'
          }}
        >
          <h3 className="font-medium mb-2">Données disponibles</h3>
          <ul>
            {selectedData.map((data, index) => (
              <li 
                key={index}
                className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                onClick={() => handleDataSelect(data)}
              >
                {data}
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
};

export default MainContent;