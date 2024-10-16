import React, { useState } from 'react';
import { Play, Clock, Settings, FileText, Edit, Plane, Layout, MoreHorizontal, Search, X } from 'lucide-react';

const Footer = ({ setShowModuleSelector }) => {
  const [showSearch, setShowSearch] = useState(false);

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  return (
    <footer className="relative mx-auto block w-[800px] -top-5 rounded-[51px] bg-[#2e4160] p-3 overflow-hidden">
      <div className={`flex justify-between items-center transition-all duration-300 ease-in-out ${showSearch ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-[60px] flex items-center shadow-md hover:bg-blue-700 transition-colors text-sm">
          <Play className="w-4 h-4 mr-1" />
          <span className="font-medium">Exécuter une fois</span>
        </button>
        
        <div className="flex items-center bg-white rounded-full p-1 text-xs">
          <span className="px-2 py-1 font-medium text-gray-500">DÉSACTIVÉ</span>
          <div className="flex items-center rounded-full px-2 py-1 shadow-sm">
            <Clock className="w-3 h-3 mr-1 text-gray-400" />
            <span className="text-gray-500">Toutes les 15 minutes</span>
          </div>
        </div>
        
        <div className="flex items-center">
          <Settings className="w-4 h-4 mr-3 text-gray-300 cursor-pointer" />
          <FileText className="w-4 h-4 mr-3 text-gray-300 cursor-pointer" />
          <Edit className="w-4 h-4 mr-3 text-gray-300 cursor-pointer" />
          <Plane className="w-4 h-4 mr-3 text-gray-300 cursor-pointer" />
          <Layout 
            className="w-4 h-4 mr-3 text-gray-300 cursor-pointer hover:text-blue-400 transition-colors"
            onClick={() => setShowModuleSelector(prev => !prev)}
          />
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="w-4 h-4 mr-3 text-gray-300 cursor-pointer"
            onClick={toggleSearch}
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <circle cx="12" cy="5" r="2"></circle>
            <path d="M12 7v4"></path>
            <line x1="8" y1="16" x2="8" y2="16"></line>
            <line x1="16" y1="16" x2="16" y2="16"></line>
          </svg>
          <MoreHorizontal className="w-4 h-4 text-gray-300 cursor-pointer" />
        </div>
      </div>

      <div className={`absolute inset-0 flex items-center justify-between bg-[#2e4160] p-3 transition-all duration-300 ease-in-out ${showSearch ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex-grow flex items-center bg-white rounded-full px-3 py-2 mr-3">
          <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
          <input 
            type="text" 
            placeholder="Rechercher..." 
            className="bg-transparent outline-none text-gray-700 w-full text-sm"
          />
        </div>
        <X 
          className="w-4 h-4 text-gray-300 cursor-pointer flex-shrink-0" 
          onClick={toggleSearch}
        />
      </div>
    </footer>
  );
};

export default Footer;