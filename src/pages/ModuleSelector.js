import React from 'react';
import { X } from 'lucide-react';

const ModuleSelector = ({ isOpen, onClose, onSelectModule }) => {
  const modules = [
    { name: 'Gestion RH', icon: '👥', category: 'Entreprise' },
    { name: 'Comptabilité', icon: '💼', category: 'Entreprise' },
    { name: 'Marketing', icon: '📢', category: 'Entreprise' },
    { name: 'Veille', icon: '🔍', category: 'Actualités' },
    { name: 'Agrégateur', icon: '📰', category: 'Actualités' },
    { name: 'Analyse', icon: '📊', category: 'Actualités' },
    { name: 'Sibot', icon: '🤖', category: 'Utilitaire' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-lg p-6 h-1/2 overflow-y-auto transition-transform duration-300 transform translate-y-0">
      <button 
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        onClick={onClose}
      >
        <X className="w-6 h-6" />
      </button>
      <h2 className="text-2xl font-bold mb-4">Sélectionnez un module</h2>
      <div className="grid grid-cols-3 gap-4">
        {modules.map((module, index) => (
          <button
            key={index}
            className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            onClick={() => onSelectModule(module)}
          >
            <span className="text-3xl mb-2">{module.icon}</span>
            <span className="text-sm font-medium">{module.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModuleSelector;