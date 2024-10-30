//ScenarioFooter.js 
import React from 'react';
import { Play, Clock, Settings, FileText, Edit, Plane, MoreHorizontal } from 'lucide-react';

const ScenarioFooter = () => {
  return (
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
  );
};

export default ScenarioFooter;