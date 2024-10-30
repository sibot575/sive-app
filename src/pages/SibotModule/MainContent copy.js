import React, { useState } from 'react';
import { PlusCircle, Clock } from 'lucide-react';
import ModuleManager from './ModuleManager';

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
  const [isDraggingClock, setIsDraggingClock] = useState(false);
  const [isDraggingConnection, setIsDraggingConnection] = useState(false);
  const [draggedConnectionStart, setDraggedConnectionStart] = useState(null);
  const [tempConnection, setTempConnection] = useState(null);
  const [isDraggingEmptyCircle, setIsDraggingEmptyCircle] = useState(false);
  const [draggedEmptyCircleStart, setDraggedEmptyCircleStart] = useState(null);

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
    } else if (isDraggingEmptyCircle) {
      const { clientX, clientY } = e;
      setTempConnection({
        startX: draggedEmptyCircleStart.x,
        startY: draggedEmptyCircleStart.y,
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
    } else if (isDraggingEmptyCircle) {
      const { clientX, clientY } = e;
      const targetModule = modules.find(module => 
        clientX >= module.x && 
        clientX <= module.x + module.width && 
        clientY >= module.y && 
        clientY <= module.y + module.height &&
        module.id !== draggedEmptyCircleStart.moduleId
      );

      if (targetModule && targetModule.isMain) {
        createRouterAndConnect(draggedEmptyCircleStart.moduleId, targetModule.id);
      } else if (targetModule && targetModule.type === 'Router') {
        connectToExistingRouter(draggedEmptyCircleStart.moduleId, targetModule.id);
      } else if (targetModule) {
        createNewRouterAndConnect(draggedEmptyCircleStart.moduleId, targetModule.id);
      }
    }

    setIsDragging(false);
    setDraggedModuleId(null);
    setIsDraggingClock(false);
    setIsDraggingConnection(false);
    setDraggedConnectionStart(null);
    setIsDraggingEmptyCircle(false);
    setDraggedEmptyCircleStart(null);
    setTempConnection(null);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const newZoom = zoom - e.deltaY * 0.001;
    setZoom(Math.max(0.5, Math.min(2, newZoom)));
  };

  const handleClockMouseDown = (e) => {
    e.stopPropagation();
    setIsDraggingClock(true);
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

  const handleEmptyCircleMouseDown = (e, moduleId) => {
    e.stopPropagation();
    setIsDraggingEmptyCircle(true);
    const module = modules.find(m => m.id === moduleId);
    setDraggedEmptyCircleStart({
      moduleId,
      x: module.x,
      y: module.y + module.height / 2
    });
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

  const shouldShowRightConnector = (module) => {
    return module.type !== 'Router' && (!isModuleConnected(module.id) || isLastConnectedModule(module.id));
  };

  const shouldShowLeftConnector = (module) => {
    if (module.id === mainModuleId || module.type === 'Router') {
      return false;
    }
    return !connections.some(conn => conn.to === module.id);
  };

  const isModuleConnected = (moduleId) => {
    return connections.some(conn => conn.from === moduleId || conn.to === moduleId);
  };

  const isLastConnectedModule = (moduleId) => {
    const outgoingConnections = connections.filter(conn => conn.from === moduleId);
    return outgoingConnections.length === 0 && isModuleConnected(moduleId);
  };

  const createRouterAndConnect = (fromModuleId, toModuleId) => {
    const fromModule = modules.find(m => m.id === fromModuleId);
    const toModule = modules.find(m => m.id === toModuleId);
  
    // Vérifier si un routeur existe déjà pour le module de destination
    const existingRouter = modules.find(m => 
      m.type === 'Router' && 
      connections.some(conn => conn.from === toModuleId && conn.to === m.id)
    );
  
    if (existingRouter) {
      // Si un routeur existe déjà, créer un nouveau routeur à côté
      createAdjacentRouter(fromModuleId, existingRouter.id);
    } else {
      // Logique existante pour créer un nouveau routeur
      // Identifier toutes les connexions existantes de la bulle avec l'horloge
      const existingConnections = connections.filter(conn => 
        conn.from === toModuleId || conn.to === toModuleId
      );
    
      // Calculer la position moyenne de toutes les connexions
      let totalX = fromModule.x + toModule.x;
      let totalY = fromModule.y + toModule.y;
      let connectionCount = 2; // Commencer à 2 pour inclure fromModule et toModule
    
      existingConnections.forEach(conn => {
        const connectedModule = modules.find(m => 
          m.id === (conn.from === toModuleId ? conn.to : conn.from)
        );
        if (connectedModule) {
          totalX += connectedModule.x;
          totalY += connectedModule.y;
          connectionCount++;
        }
      });
    
      const avgX = totalX / connectionCount;
      const avgY = totalY / connectionCount;
    
      const routerModule = {
        id: Date.now(),
        x: avgX - 40, // Centrer le routeur (80x80)
        y: avgY - 40,
        width: 80,
        height: 80,
        type: 'Router',
        icon: '🔀',
        isMain: false,
        description: 'Module de routage',
        status: 'configured',
        searchTerm: '',
        advancedSettings: {}
      };
    
      onAddModule(routerModule);
    
      // Connecter le routeur à la bulle avec l'horloge
      onAddConnection({
        id: Date.now(),
        from: toModuleId,
        to: routerModule.id,
        startX: toModule.x + toModule.width / 2,
        startY: toModule.y + toModule.height / 2,
        endX: routerModule.x + routerModule.width / 2,
        endY: routerModule.y + routerModule.height / 2
      });
    
      // Connecter le routeur à la bulle d'origine
      onAddConnection({
        id: Date.now(),
        from: routerModule.id,
        to: fromModuleId,
        startX: routerModule.x + routerModule.width / 2,
        startY: routerModule.y + routerModule.height / 2,
        endX: fromModule.x + fromModule.width / 2,
        endY: fromModule.y + fromModule.height / 2
      });
    
      // Connecter le routeur aux autres bulles existantes
      existingConnections.forEach(conn => {
        const connectedModuleId = conn.from === toModuleId ? conn.to : conn.from;
        if (connectedModuleId !== fromModuleId) {
          const connectedModule = modules.find(m => m.id === connectedModuleId);
          onAddConnection({
            id: Date.now(),
            from: routerModule.id,
            to: connectedModuleId,
            startX: routerModule.x + routerModule.width / 2,
            startY: routerModule.y + routerModule.height / 2,
            endX: connectedModule.x + connectedModule.width / 2,
            endY: connectedModule.y + connectedModule.height / 2
          });
        }
      });
    
      // Supprimer les connexions directes existantes avec la bulle horloge
      existingConnections.forEach(conn => {
        onDeleteConnection(conn.id);
      });
    }
  }; 

  const createAdjacentRouter = (fromModuleId, existingRouterId) => {
    const fromModule = modules.find(m => m.id === fromModuleId);
    const existingRouter = modules.find(m => m.id === existingRouterId);

    // Créer un nouveau routeur à côté de l'existant
    const newRouter = {
      id: Date.now(),
      x: existingRouter.x - 100, // Positionner à gauche du routeur existant
      y: existingRouter.y,
      width: 80,
      height: 80,
      type: 'Router',
      icon: '🔀',
      isMain: false,
      description: 'Module de routage',
      status: 'configured',
      searchTerm: '',
      advancedSettings: {}
    };

    onAddModule(newRouter);

    // Connecter le nouveau routeur au routeur existant
    onAddConnection({
      id: Date.now(),
      from: newRouter.id,
      to: existingRouterId,
      startX: newRouter.x + newRouter.width,
      startY: newRouter.y + newRouter.height / 2,
      endX: existingRouter.x,
      endY: existingRouter.y + existingRouter.height / 2
    });

    // Connecter le nouveau routeur à la bulle d'origine
    onAddConnection({
      id: Date.now(),
      from: newRouter.id,
      to: fromModuleId,
      startX: newRouter.x + newRouter.width / 2,
      startY: newRouter.y + newRouter.height / 2,
      endX: fromModule.x + fromModule.width / 2,
      endY: fromModule.y + fromModule.height / 2
    });
  };
    const connectToExistingRouter = (fromModuleId, routerId) => {
    const fromModule = modules.find(m => m.id === fromModuleId);
    const routerModule = modules.find(m => m.id === routerId);

    onAddConnection({
      id: Date.now(),
      from: routerId,
      to: fromModuleId,
      startX: routerModule.x + routerModule.width / 2,
      startY: routerModule.y + routerModule.height / 2,
      endX: fromModule.x + fromModule.width / 2,
      endY: fromModule.y + fromModule.height / 2
    });
  };

  const createNewRouterAndConnect = (fromModuleId, toModuleId) => {
    const fromModule = modules.find(m => m.id === fromModuleId);
    const toModule = modules.find(m => m.id === toModuleId);

    const routerModule = {
      id: Date.now(),
      x: (fromModule.x + toModule.x) / 2,
      y: (fromModule.y + toModule.y) / 2,
      width: 80,
      height: 80,
      type: 'Router',
      icon: '🔀',
      isMain: false,
      description: 'Module de routage',
      status: 'configured',
      searchTerm: '',
      advancedSettings: {}
    };

    onAddModule(routerModule);

    onAddConnection({
      id: Date.now(),
      from: routerModule.id,
      to: fromModuleId,
      startX: routerModule.x + routerModule.width / 2,
      startY: routerModule.y + routerModule.height / 2,
      endX: fromModule.x + fromModule.width / 2,
      endY: fromModule.y + fromModule.height / 2
    });

    onAddConnection({
      id: Date.now(),
      from: routerModule.id,
      to: toModuleId,
      startX: routerModule.x + routerModule.width / 2,
      startY: routerModule.y + routerModule.height / 2,
      endX: toModule.x + toModule.width / 2,
      endY: toModule.y + toModule.height / 2
    });
  };
  return (
    <main 
      ref={mainRef} 
      className="flex-grow relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
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
                    onMouseDown={(e) => handleConnectionStart(e, module.id)}
                  >
                    <PlusCircle className="w-4 h-4 text-white" />
                  </div>
                )}
                {shouldShowLeftConnector(module) && (
                  <div
                    className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center cursor-pointer shadow-sm"
                    style={{ top: `${module.height / 2}px` }}
                    onMouseDown={(e) => handleEmptyCircleMouseDown(e, module.id)}
                  >
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <ModuleManager
        modules={modules}
        setModules={setModules}
        connections={connections}
        setConnections={setConnections}
        onAddModule={onAddModule}
        onUpdateModule={onUpdateModule}
        onDeleteModule={onDeleteModule}
        onAddConnection={onAddConnection}
        showModuleSelector={showModuleSelector}
        setShowModuleSelector={setShowModuleSelector}
      />
    </main>
  );
};

export default MainContent;