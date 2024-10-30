//ScenarioHeader.js
import React, { useState, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import BubbleCanvas from './BubbleCanvas';
import ScenarioFooter from './ScenarioFooter';

const ScenarioHeader = ({ onClose, onSave }) => {
  const [zoom, setZoom] = useState(1);
  const mainRef = useRef(null);

  const handleWheel = (e) => {
    e.preventDefault();
    const newZoom = zoom - e.deltaY * 0.001;
    setZoom(Math.max(0.5, Math.min(2, newZoom)));
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
        onWheel={handleWheel}
      >
        <BubbleCanvas zoom={zoom} />
      </main>

      <ScenarioFooter />

      {/* AI Beta button */}
      <div className="absolute top-4 right-4">
        <button className="bg-purple-600 text-white px-3 py-1 rounded-md text-sm flex items-center shadow-md hover:bg-purple-700 transition-colors">
          AI <span className="ml-1 px-1 bg-white text-purple-600 text-xs rounded font-medium">BÊTA</span>
        </button>
      </div>
    </div>
  );
};

export default ScenarioHeader;