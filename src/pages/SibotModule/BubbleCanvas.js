import React, { useState, useRef, useEffect } from 'react';
import Header from './Header';
import MainContent from './MainContent';
import Footer from './Footer';

const NouveauScenarioComponent = ({ onClose, onSave }) => {
  const [modules, setModules] = useState([]);
  const [connections, setConnections] = useState([]);
  const [zoom, setZoom] = useState(1);
  const [mainModuleId, setMainModuleId] = useState(null);
  const [showModuleSelector, setShowModuleSelector] = useState(false);
  const mainRef = useRef(null);

  useEffect(() => {
    if (mainRef.current) {
      const mainRect = mainRef.current.getBoundingClientRect();
      const initialMainModule = {
        id: 1,
        x: mainRect.width / 2 - 50,
        y: mainRect.height / 2 - 50,
        width: 100,
        height: 100,
        type: 'Nouveau module',
        icon: '+',
        isMain: true,
        description: 'Module principal'
      };
      setModules([initialMainModule]);
      setMainModuleId(1);
    }
  }, []);

  const handleAddModule = (newModule) => {
    setModules(prevModules => [...prevModules, newModule]);
  };

  const handleUpdateModule = (updatedModule) => {
    setModules(prevModules => 
      prevModules.map(module => 
        module.id === updatedModule.id ? updatedModule : module
      )
    );
  };

  const handleDeleteModule = (moduleId) => {
    setModules(prevModules => prevModules.filter(module => module.id !== moduleId));
    setConnections(prevConnections => 
      prevConnections.filter(conn => conn.from !== moduleId && conn.to !== moduleId)
    );
    if (moduleId === mainModuleId) {
      const newMainModule = modules.find(module => module.id !== moduleId);
      if (newMainModule) {
        setMainModuleId(newMainModule.id);
        setModules(prevModules => 
          prevModules.map(module => ({
            ...module,
            isMain: module.id === newMainModule.id
          }))
        );
      } else {
        setMainModuleId(null);
      }
    }
  };

  const handleAddConnection = (newConnection) => {
    setConnections(prevConnections => [...prevConnections, newConnection]);
  };

  const handleDeleteConnection = (connectionId) => {
    setConnections(prevConnections => 
      prevConnections.filter(conn => conn.id !== connectionId)
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-100 text-gray-900 font-sans flex flex-col">
      <Header onClose={onClose} />
      <MainContent
        modules={modules}
        setModules={setModules}
        connections={connections}
        setConnections={setConnections}
        zoom={zoom}
        setZoom={setZoom}
        mainModuleId={mainModuleId}
        setMainModuleId={setMainModuleId}
        mainRef={mainRef}
        onAddModule={handleAddModule}
        onUpdateModule={handleUpdateModule}
        onDeleteModule={handleDeleteModule}
        onAddConnection={handleAddConnection}
        onDeleteConnection={handleDeleteConnection}
        showModuleSelector={showModuleSelector}
        setShowModuleSelector={setShowModuleSelector}
      />
      <Footer
        setShowModuleSelector={setShowModuleSelector}
      />
    </div>
  );
};

export default NouveauScenarioComponent;