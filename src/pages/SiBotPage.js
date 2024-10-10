import React, { useState } from 'react';
import { Plus, ChevronDown, Settings, Clock, Folder, Copy, Trash2, X } from 'lucide-react';
import NouveauScenarioComponent from './NouveauScenarioComponent';

const SibotMainPage = () => {
  const [ongletActif, setOngletActif] = useState('TOUS');
  const [trierPar, setTrierPar] = useState('A-Z');
  const [scenarios, setScenarios] = useState([
    { id: 1, nom: 'Analyse concurrentielle', statut: 'actif', icone: '🏢', miseajours: 2, taille: '1.5 Ko', auteur: 'AI_analyst', date: '30 sept. 2024' },
    { id: 2, nom: 'Prévisions sectorielles', statut: 'inactif', icone: '📊', miseajours: 0, taille: '2.3 Ko', auteur: 'market_expert', date: '15 oct. 2024' },
    { id: 3, nom: 'Analyse de sentiment', statut: 'actif', icone: '😊', miseajours: 5, taille: '3.1 Ko', auteur: 'sentiment_ai', date: '22 oct. 2024' },
    { id: 4, nom: 'Prévisions de ventes', statut: 'inactif', icone: '💼', miseajours: 1, taille: '1.8 Ko', auteur: 'sales_forecaster', date: '5 nov. 2024' },
    { id: 5, nom: 'Analyse de risques', statut: 'actif', icone: '⚠️', miseajours: 3, taille: '2.7 Ko', auteur: 'risk_analyst', date: '12 nov. 2024' },
  ]);
  const [afficherModaleDeplacement, setAfficherModaleDeplacement] = useState(false);
  const [scenarioSelectionne, setScenarioSelectionne] = useState(null);
  const [afficherNouveauScenario, setAfficherNouveauScenario] = useState(false);

  const changerStatut = (id) => {
    setScenarios(scenarios.map(scenario => 
      scenario.id === id ? {...scenario, statut: scenario.statut === 'actif' ? 'inactif' : 'actif'} : scenario
    ));
  };

  const trier = (critere) => {
    let scenariosTries = [...scenarios];
    switch (critere) {
      case 'A-Z':
        scenariosTries.sort((a, b) => a.nom.localeCompare(b.nom));
        break;
      case 'Date':
        scenariosTries.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'Taille':
        scenariosTries.sort((a, b) => parseFloat(b.taille) - parseFloat(a.taille));
        break;
      default:
        break;
    }
    setScenarios(scenariosTries);
  };

  const supprimer = (id) => {
    setScenarios(scenarios.filter(scenario => scenario.id !== id));
  };

  const cloner = (scenario) => {
    const nouveauScenario = {...scenario, id: scenarios.length + 1, nom: `${scenario.nom} (copie)`};
    setScenarios([...scenarios, nouveauScenario]);
  };

  const ouvrirModaleDeplacement = (scenario) => {
    setScenarioSelectionne(scenario);
    setAfficherModaleDeplacement(true);
  };

  const fermerModaleDeplacement = () => {
    setAfficherModaleDeplacement(false);
    setScenarioSelectionne(null);
  };

  const deplacer = () => {
    console.log(`Déplacement du scénario : ${scenarioSelectionne.nom}`);
    fermerModaleDeplacement();
  };

  const scenariosFiltres = scenarios.filter(scenario => {
    if (ongletActif === 'TOUS') return true;
    if (ongletActif === 'ACTIFS') return scenario.statut === 'actif';
    if (ongletActif === 'INACTIFS') return scenario.statut === 'inactif';
    return false;
  });

  return (
    <div className="p-8 w-full h-screen">
      <div className="mx-auto">
        {afficherNouveauScenario ? (
          <NouveauScenarioComponent
            onClose={() => setAfficherNouveauScenario(false)}
            onSave={(nouveauScenario) => {
              setScenarios([...scenarios, { 
                id: scenarios.length + 1, 
                ...nouveauScenario, 
                statut: 'actif',
                icone: '🆕',
                miseajours: 0,
                taille: '0 Ko',
                auteur: 'Utilisateur Actuel',
                date: new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' })
              }]);
              setAfficherNouveauScenario(false);
            }}
          />
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Tous les scénarios SIBOT</h1>
              <button 
                className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-purple-700 transition-colors"
                onClick={() => setAfficherNouveauScenario(true)}
              >
                <Plus size={20} className="mr-2" />
                Créer un nouveau scénario
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-md">
              <div className="flex border-b">
                {['TOUS', 'ACTIFS', 'INACTIFS'].map((onglet) => (
                  <button
                    key={onglet}
                    className={`px-6 py-4 font-medium ${ongletActif === onglet ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setOngletActif(onglet)}
                  >
                    {onglet}
                    <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                      {scenariosFiltres.filter(s => onglet === 'TOUS' || (onglet === 'ACTIFS' && s.statut === 'actif') || (onglet === 'INACTIFS' && s.statut === 'inactif')).length}
                    </span>
                  </button>
                ))}
              </div>

              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="relative w-48">
                    <select
                      className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-purple-500 w-full"
                      value={trierPar}
                      onChange={(e) => {
                        setTrierPar(e.target.value);
                        trier(e.target.value);
                      }}
                    >
                      <option>Trier par : A-Z</option>
                      <option>Trier par : Date</option>
                      <option>Trier par : Taille</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>

                <ul className="space-y-4">
                  {scenariosFiltres.map((scenario) => (
                    <li key={scenario.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:shadow-lg transition-shadow">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl mr-4">
                          {scenario.icone}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-800">{scenario.nom}</h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Settings size={16} className="mr-1" />
                            <span className="mr-3">{scenario.miseajours} mises à jour</span>
                            <span className="mr-3">{scenario.taille}</span>
                            <span className="mr-3">{scenario.auteur}</span>
                            <Clock size={16} className="mr-1" />
                            <span>{scenario.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <label className="relative inline-flex items-center cursor-pointer mr-4">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={scenario.statut === 'actif'}
                            onChange={() => changerStatut(scenario.id)}
                          />
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-purple-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                        <div className="relative">
                          <button className="text-gray-400 hover:text-gray-600" onClick={() => document.getElementById(`dropdown-${scenario.id}`).classList.toggle('hidden')}>
                            <ChevronDown size={20} />
                          </button>
                          <div id={`dropdown-${scenario.id}`} className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden z-10">
                            <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full" onClick={() => ouvrirModaleDeplacement(scenario)}>
                              <Folder size={16} className="mr-2" />
                              Déplacer vers...
                            </button>
                            <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full" onClick={() => cloner(scenario)}>
                              <Copy size={16} className="mr-2" />
                              Cloner
                            </button>
                            <button className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full" onClick={() => supprimer(scenario.id)}>
                              <Trash2 size={16} className="mr-2" />
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}

        {afficherModaleDeplacement && scenarioSelectionne && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Déplacer vers...</h2>
                <button onClick={fermerModaleDeplacement} className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>
              <p className="mb-4 text-gray-600">Déplacement du scénario : {scenarioSelectionne.nom}</p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom du dossier</label>
                <select className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500">
                  <option>-- aucun dossier --</option>
                  {/* Ajoutez ici les options de dossiers */}
                </select>
              </div>
              <div className="flex justify-end">
                <button onClick={fermerModaleDeplacement} className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                  Annuler
                </button>
                <button onClick={deplacer} className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700">
                  Déplacer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SibotMainPage;