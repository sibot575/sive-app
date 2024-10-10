import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Play, Clock, Settings, FileText, Edit, Plane, MoreHorizontal, PlusCircle, X } from 'lucide-react';

const NouveauScenarioComponent = ({ onClose, onSave }) => {
  const [bubbles, setBubbles] = useState([]);
  const [connections, setConnections] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedBubbleId, setDraggedBubbleId] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedBubbleId, setSelectedBubbleId] = useState(null);
  const [zoom, setZoom] = useState(1);
  const mainRef = useRef(null);

  const menuItems = [
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

  useEffect(() => {
    if (mainRef.current) {
      const mainRect = mainRef.current.getBoundingClientRect();
      setBubbles([{
        id: 1,
        x: mainRect.width / 2 - 40,
        y: mainRect.height / 2 - 40,
        size: 80,
        type: null,
        icon: '➕'
      }]);
    }
  }, []);

  const handleMouseDown = (e, bubbleId) => {
    setIsDragging(true);
    setDraggedBubbleId(bubbleId);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const { clientX, clientY } = e;
      setBubbles(prevBubbles => 
        prevBubbles.map(bubble => 
          bubble.id === draggedBubbleId 
            ? { ...bubble, x: clientX - bubble.size / 2, y: clientY - bubble.size / 2 }
            : bubble
        )
      );
      setConnections(prevConnections => 
        prevConnections.map(conn => {
          if (conn.from === draggedBubbleId) {
            return { ...conn, startX: clientX, startY: clientY };
          } else if (conn.to === draggedBubbleId) {
            return { ...conn, endX: clientX, endY: clientY };
          }
          return conn;
        })
      );
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedBubbleId(null);
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
    setSelectedBubbleId(null);
  };

  const handleBubbleClick = (bubbleId) => {
    const bubble = bubbles.find(b => b.id === bubbleId);
    if (!bubble.type) {
      setSelectedBubbleId(bubbleId);
      setShowMenu(true);
      setMenuPosition({ x: bubble.x + bubble.size, y: bubble.y });
    }
  };

  const handleMenuItemClick = (category, subItem) => {
    if (selectedBubbleId) {
      setBubbles(prevBubbles => 
        prevBubbles.map(bubble => 
          bubble.id === selectedBubbleId 
            ? { ...bubble, type: subItem.name, icon: subItem.icon }
            : bubble
        )
      );
    } else {
      const newBubble = {
        id: Date.now(),
        x: menuPosition.x,
        y: menuPosition.y,
        size: 80,
        type: subItem.name,
        icon: subItem.icon
      };
      setBubbles(prevBubbles => [...prevBubbles, newBubble]);
    }
    setShowMenu(false);
    setSelectedBubbleId(null);
  };

  const handlePlusClick = (bubbleId, e) => {
    e.stopPropagation();
    const startBubble = bubbles.find(b => b.id === bubbleId);
    const newBubbleId = Date.now();
    const newBubble = {
      id: newBubbleId,
      x: startBubble.x + 150,
      y: startBubble.y,
      size: 80,
      type: null,
      icon: '➕'
    };
    setBubbles(prevBubbles => [...prevBubbles, newBubble]);
    setConnections(prevConnections => [...prevConnections, {
      id: Date.now(),
      from: bubbleId,
      to: newBubbleId,
      startX: startBubble.x + startBubble.size / 2,
      startY: startBubble.y + startBubble.size / 2,
      endX: startBubble.x + 150 + 40,
      endY: startBubble.y + 40
    }]);
    setSelectedBubbleId(newBubbleId);
    setShowMenu(true);
    setMenuPosition({ x: startBubble.x + 230, y: startBubble.y });
  };

  const handleDeleteConnection = (connectionId) => {
    setConnections(prevConnections => 
      prevConnections.filter(conn => conn.id !== connectionId)
    );
  };

  const isBubbleConnected = (bubbleId) => {
    return connections.some(conn => conn.from === bubbleId || conn.to === bubbleId);
  };

  const isLastConnectedBubble = (bubbleId) => {
    const outgoingConnections = connections.filter(conn => conn.from === bubbleId);
    return outgoingConnections.length === 0 && isBubbleConnected(bubbleId);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 text-gray-800 font-sans flex flex-col">
      {/* Header */}
      <header className="flex items-center p-4 bg-white border-b border-gray-200">
        <button onClick={onClose} className="mr-4">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-xl font-semibold text-gray-700">Nouveau scénario</h1>
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
                stroke="gray"
                strokeWidth="2"
                className="pointer-events-auto"
                onContextMenu={(e) => {
                  e.preventDefault();
                  handleDeleteConnection(conn.id);
                }}
              />
            </svg>
          ))}
          {bubbles.map(bubble => (
            <div
              key={bubble.id}
              className="absolute cursor-move bg-purple-600 rounded-full flex items-center justify-center shadow-md hover:bg-purple-700 transition-colors"
              style={{
                left: `${bubble.x}px`,
                top: `${bubble.y}px`,
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
              }}
              onMouseDown={(e) => handleMouseDown(e, bubble.id)}
              onClick={() => handleBubbleClick(bubble.id)}
            >
              <span className="text-2xl text-white">{bubble.icon}</span>
              {bubble.type && (
                <div
                  className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 bg-purple-500 rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
                  onClick={(e) => handlePlusClick(bubble.id, e)}
                >
                  {!isBubbleConnected(bubble.id) || isLastConnectedBubble(bubble.id) ? (
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
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white p-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <button className="bg-purple-600 text-white px-6 py-3 rounded-md flex items-center shadow-md hover:bg-purple-700 transition-colors">
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
            <MoreHorizontal className="w-5 h-5 text-gray-400 cursor-pointer" />
          </div>
        </div>
      </footer>

      {/* AI Beta button */}
      <div className="absolute top-4 right-4">
        <button className="bg-purple-600 text-white px-3 py-1 rounded-md text-sm flex items-center shadow-md hover:bg-purple-700 transition-colors">
          AI <span className="ml-1 px-1 bg-white text-purple-600 text-xs rounded font-medium">BÊTA</span>
        </button>
      </div>
    </div>
  );
};

export default NouveauScenarioComponent;