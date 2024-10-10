import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {ArrowUp, ArrowDown, DollarSign, Briefcase, TrendingUp } from 'lucide-react';

const mockEconomicData = [
  { date: '2024-01', pib: 2800, inflation: 1.8, chomage: 7.2 },
  { date: '2024-02', pib: 2850, inflation: 1.9, chomage: 7.1 },
  { date: '2024-03', pib: 2900, inflation: 2.0, chomage: 7.0 },
  { date: '2024-04', pib: 2950, inflation: 2.1, chomage: 6.9 },
  { date: '2024-05', pib: 3000, inflation: 2.2, chomage: 6.8 },
  { date: '2024-06', pib: 3050, inflation: 2.3, chomage: 6.7 },
];

const mockNews = [
  { id: 1, title: "La croissance économique dépasse les attentes au deuxième trimestre", date: "7 Oct, 2024" },
  { id: 2, title: "Nouvelle politique monétaire annoncée par la Banque Centrale", date: "6 Oct, 2024" },
  { id: 3, title: "Le secteur technologique continue de stimuler l'emploi", date: "5 Oct, 2024" },
];

const Card = ({ children, className }) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`}>
    {children}
  </div>
);

const StatCard = ({ title, value, change, icon: Icon }) => (
  <Card className="p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="text-gray-500">{title}</div>
      <Icon className="text-blue-500" size={24} />
    </div>
    <div className="text-3xl font-bold mb-2">{value}</div>
    <div className={`flex items-center ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
      {change >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
      <span className="ml-1">{Math.abs(change)}%</span>
    </div>
  </Card>
);

export default function InfoEcoPage() {
  const [selectedIndicator, setSelectedIndicator] = useState('pib');

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Informations Économiques</h1>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <StatCard title="PIB (en milliards €)" value="3050" change={1.64} icon={DollarSign} />
        <StatCard title="Taux de chômage" value="6.7%" change={-0.15} icon={Briefcase} />
        <StatCard title="Inflation" value="2.3%" change={0.1} icon={TrendingUp} />
      </div>

      <Card className="mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Évolution des indicateurs économiques</h2>
          <div className="flex items-center space-x-4 mb-4">
            <select
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedIndicator}
              onChange={(e) => setSelectedIndicator(e.target.value)}
            >
              <option value="pib">PIB</option>
              <option value="inflation">Inflation</option>
              <option value="chomage">Taux de chômage</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockEconomicData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey={selectedIndicator} stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Dernières actualités économiques</h2>
          <ul className="space-y-4">
            {mockNews.map((news) => (
              <li key={news.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                <h3 className="font-medium mb-1">{news.title}</h3>
                <p className="text-sm text-gray-500">{news.date}</p>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
}