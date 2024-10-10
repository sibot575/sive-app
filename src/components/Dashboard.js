import React, { useState } from 'react';
import CallsForTenders from '../pages/CallsForTenders';

import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts';
import { 
  Bell, Home, Users, Globe, Tv, Settings, HelpCircle, LogOut,
  Search, Newspaper, Building2, ChartBar, ChevronLeft, ChevronRight,
  FileText, Bot
} from 'lucide-react';

const Card = ({ children, className }) => (
  <div className={`bg-white rounded-lg shadow ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className }) => (
  <div className={`p-3 ${className}`}>
    {children}
  </div>
);

const mockData = [
  { month: 'Mar', articles: 150 },
  { month: 'Apr', articles: 180 },
  { month: 'May', articles: 160 },
  { month: 'Jun', articles: 250 },
  { month: 'Jul', articles: 190 },
  { month: 'Aug', articles: 170 },
  { month: 'Sep', articles: 200 },
  { month: 'Oct', articles: 185 },
  { month: 'Nov', articles: 195 }
];

const StatCard = ({ Icon, title, value, trend, color }) => (
  <Card className="p-3 bg-white border-0 shadow-sm">
    <CardContent className="p-0">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
          color === 'red' ? 'bg-red-100' : 
          color === 'green' ? 'bg-green-100' : 
          color === 'blue' ? 'bg-blue-100' : 'bg-purple-100'
        }`}>
          <Icon size={14} className={`${
            color === 'red' ? 'text-red-500' : 
            color === 'green' ? 'text-green-500' : 
            color === 'blue' ? 'text-blue-500' : 'text-purple-500'
          }`} />
        </div>
        {trend && (
          <span className={`text-xs font-medium ${
            trend.startsWith('+') ? 'text-green-500' : 'text-red-500'
          }`}>
            {trend}
          </span>
        )}
      </div>
      <div className="text-lg font-semibold mb-1">{value}</div>
      <div className="text-xs text-gray-500">{title}</div>
    </CardContent>
  </Card>
);

export default function Dashboard({ onPageChange, children }) {
  const [activePage, setActivePage] = useState('Accueil');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handlePageChange = (pageName) => {
    setActivePage(pageName);
    onPageChange(pageName);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const SidebarItem = ({ Icon, text, active, hasNotification }) => (
    <div 
      className={`flex items-center px-3 py-2 rounded-lg cursor-pointer ${
        active ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
      } ${isSidebarCollapsed ? 'justify-center' : ''}`}
      onClick={() => handlePageChange(text)}
    >
      <Icon size={16} className={isSidebarCollapsed ? '' : 'mr-2'} />
      {!isSidebarCollapsed && <span className="text-xs font-medium flex-grow">{text}</span>}
      {!isSidebarCollapsed && hasNotification && (
        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div 
        className={`bg-white p-3 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'w-16' : 'w-48'
        }`}
      >
        <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'space-x-2'} mb-6 cursor-pointer relative`} onClick={toggleSidebar}>
          <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">S.</span>
          </div>
          {!isSidebarCollapsed && <span className="text-sm font-bold">SIVE</span>}
          {isSidebarCollapsed ? (
            <ChevronRight size={16} className="text-blue-600 absolute right-1" />
          ) : (
            <ChevronLeft size={16} className="text-blue-600 absolute right-1" />
          )}
        </div>
        
        <div className="space-y-1 flex-grow">
          <SidebarItem Icon={Home} text="Accueil" active={activePage === 'Accueil'} />
          <SidebarItem Icon={Newspaper} text="Dépêches" active={activePage === 'Dépêches'} />
          <SidebarItem Icon={Globe} text="Cartographie" active={activePage === 'Cartographie'} />
          <SidebarItem Icon={Building2} text="Info Éco" active={activePage === 'Info Éco'} />
          <SidebarItem Icon={Tv} text="WebTV" active={activePage === 'WebTV'} hasNotification />
          <SidebarItem Icon={FileText} text="Appels d'offres" active={activePage === "Appels d'offres"} />
          <SidebarItem Icon={Bot} text="SiBot" active={activePage === 'SiBot'} />
          <SidebarItem Icon={Settings} text="Paramètres" active={activePage === 'Paramètres'} />
          <SidebarItem Icon={HelpCircle} text="Aide" active={activePage === 'Aide'} />
        </div>

        <SidebarItem Icon={LogOut} text="Déconnexion" />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-auto">
        {activePage === 'Accueil' ? (
          <>
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-64">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Rechercher une information..."
                  className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Bell size={16} className="text-gray-600" />
                  <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                </div>
                <img src="/api/placeholder/24/24" className="w-6 h-6 rounded-full" alt="Profile" />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              <StatCard Icon={Newspaper} title="Articles Publiés" value="2,216" trend="+15%" color="blue" />
              <StatCard Icon={ChartBar} title="Analyses Économiques" value="384" trend="+8%" color="green" />
              <StatCard Icon={Globe} title="Régions Couvertes" value="13" trend="+2" color="red" />
              <StatCard Icon={Users} title="Lecteurs Actifs" value="8.2k" trend="+12%" color="purple" />
            </div>

            {/* Chart and Info Cards Section */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              {/* Chart Card */}
              <Card className="col-span-2 p-4">
                <CardContent className="p-0">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-gray-500 text-xs mb-1">Publications Mensuelles</h3>
                      <div className="text-lg font-semibold">250 articles</div>
                    </div>
                  </div>
                  <div className="h-48 relative">
                    <div className="absolute top-1/3 left-1/3 bg-black text-white px-2 py-0.5 rounded-lg text-xs">
                      250 articles
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mockData}>
                        <XAxis 
                          dataKey="month" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#9CA3AF', fontSize: 10 }}
                        />
                        <Bar 
                          dataKey="articles" 
                          fill="#E5E7EB"
                          radius={[4, 4, 0, 0]}
                        >
                          {mockData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`}
                              fill={index === 3 ? '#3B82F6' : '#E5E7EB'}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Info Card */}
              <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                <CardContent className="p-4">
                  <div className="bg-white/20 inline-block p-1.5 rounded-lg text-xs mb-3">
                    Info
                  </div>
                  <h3 className="text-base font-semibold mb-2">Nouveau module de cartographie disponible!</h3>
                  <p className="text-white/80 text-xs mb-4">
                    Explorez les données économiques régionales avec notre nouvelle interface interactive
                  </p>
                  <button className="bg-white text-blue-600 px-3 py-1.5 rounded-lg text-xs font-medium w-full">
                    Découvrir
                  </button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Articles */}
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-sm">Dernières Publications</h3>
                  <button className="text-blue-600 text-xs">Voir tout</button>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-500 text-xs">
                      <th className="pb-3 font-medium">Titre</th>
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium">Catégorie</th>
                      <th className="pb-3 font-medium">Région</th>
                      <th className="pb-3 font-medium">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs">
                    <tr className="border-t border-gray-100">
                      <td className="py-3">Impact économique des nouvelles réglementations</td>
                      <td>3 Jul, 2024</td>
                      <td>Analyse</td>
                      <td className="font-medium">National</td>
                      <td><span className="text-green-500">Publié</span></td>
                    </tr>
                    <tr className="border-t border-gray-100">
                      <td className="py-3">Innovations dans le secteur agricole</td>
                      <td>21 Mai, 2024</td>
                      <td>Dépêche</td>
                      <td className="font-medium">Bretagne</td>
                      <td><span className="text-blue-500">En révision</span></td>
                    </tr>
                    <tr className="border-t border-gray-100">
                      <td className="py-3">Perspectives du marché de l'emploi</td>
                      <td>14 Mai, 2024</td>
                      <td>Étude</td>
                      <td className="font-medium">Île-de-France</td>
                      <td><span className="text-green-500">Publié</span></td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </>
        ) : activePage === "Appels d'offres" ? (
          <CallsForTenders />
        ) : (
          children
        )}
      </div>
    </div>
  );
}