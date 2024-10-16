import React from 'react';
import { ArrowLeft } from 'lucide-react';

const Header = ({ onClose }) => {
  return (
    <header className="flex items-center p-4 bg-white border-b border-gray-200">
      <button onClick={onClose} className="mr-4">
        <ArrowLeft className="w-6 h-6 text-gray-600" />
      </button>
      <h1 className="text-xl font-semibold text-gray-800">Nouveau scénario</h1>
      <div className="ml-auto">
        <button className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center shadow-md hover:bg-blue-700 transition-colors">
          AI <span className="ml-1 px-1 bg-white text-blue-600 text-xs rounded font-medium">BÊTA</span>
        </button>
      </div>
    </header>
  );
};

export default Header;