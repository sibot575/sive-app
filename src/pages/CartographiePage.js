import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Search, Filter, Download, Share2, Palette } from 'lucide-react';

// Remplacez par votre token Mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoiZWdheiIsImEiOiJjbHBwOXBndW4weGJvMnNtczFuYzFkMHMwIn0.HvfIGGG3Nd4hm0d9hZSHNA';

const Card = ({ children, className }) => (
  <div className={`bg-white rounded-lg shadow ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className }) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
);

const MapLegendItem = ({ color, label, value }) => (
  <div className="flex items-center justify-between py-1">
    <div className="flex items-center space-x-2">
      <div className={`w-4 h-4 rounded ${color}`} />
      <span className="text-sm text-gray-600">{label}</span>
    </div>
    {value && <span className="text-sm font-medium">{value}</span>}
  </div>
);

const RegionCard = ({ name, data }) => (
  <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
    <CardContent>
      <h3 className="font-semibold mb-2">{name}</h3>
      <div className="space-y-1">
        <p className="text-sm text-gray-600">Population: {data.population}</p>
        <p className="text-sm text-gray-600">PIB: {data.gdp} FCFA</p>
        <p className="text-sm text-gray-600">Taux de chômage: {data.unemployment}%</p>
      </div>
    </CardContent>
  </Card>
);

const StatCard = ({ title, value, change }) => (
  <Card className="bg-gradient-to-br from-white to-gray-50">
    <CardContent>
      <h3 className="text-sm text-gray-500 mb-1">{title}</h3>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold">{value}</span>
        <span className={`text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {change >= 0 ? '+' : ''}{change}%
        </span>
      </div>
    </CardContent>
  </Card>
);

const mockRegions = [
  { 
    id: 'abidjan',
    name: "District d'Abidjan",
    data: { population: "5.4M", gdp: "12.7T", unemployment: "9.4" },
    coordinates: [-4.0167, 5.3167]
  },
  {
    id: 'yamoussoukro',
    name: "District de Yamoussoukro",
    data: { population: "355K", gdp: "892B", unemployment: "7.2" },
    coordinates: [-5.2767, 6.8206]
  },
  {
    id: 'bouake',
    name: "Bouaké",
    data: { population: "542K", gdp: "567B", unemployment: "8.1" },
    coordinates: [-5.0338, 7.6906]
  }
];

export default function CartographiePage() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [activeLayer, setActiveLayer] = useState('Économie');

  const layers = [
    { id: 'Économie', color: '#ef4444' },
    { id: 'Démographie', color: '#3b82f6' },
    { id: 'Emploi', color: '#10b981' },
    { id: 'Éducation', color: '#f59e0b' }
  ];

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-5.54708, 7.53999],
      zoom: 6
    });

    map.current.on('load', () => {
      // Ajout des marqueurs pour chaque région
      mockRegions.forEach(region => {
        const marker = document.createElement('div');
        marker.className = 'region-marker';
        marker.style.backgroundColor = '#ef4444';
        marker.style.width = '12px';
        marker.style.height = '12px';
        marker.style.borderRadius = '50%';
        marker.style.border = '2px solid white';
        marker.style.cursor = 'pointer';

        new mapboxgl.Marker(marker)
          .setLngLat(region.coordinates)
          .setPopup(new mapboxgl.Popup().setHTML(`
            <h3 class="font-bold">${region.name}</h3>
            <p>Population: ${region.data.population}</p>
            <p>PIB: ${region.data.gdp}</p>
          `))
          .addTo(map.current);
      });
    });

    // Ajout des contrôles de navigation
    map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

  }, []);

  const handleMapDownload = () => {
    const mapCanvas = map.current.getCanvas();
    const mapImage = mapCanvas.toDataURL();
    const link = document.createElement('a');
    link.href = mapImage;
    link.download = 'carte-cote-divoire.png';
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-800">Cartographie SIVE - Côte d'Ivoire</h1>
          <div className="flex space-x-2">
            <button 
              onClick={handleMapDownload}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Télécharger la carte"
            >
              <Download size={20} className="text-gray-600" />
            </button>
            <button 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Partager"
            >
              <Share2 size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher une région..."
              className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="bg-white p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <Filter size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-8">
        {/* Map Section */}
        <div className="col-span-2 space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard title="Population Totale" value="26.38M" change={2.3} />
            <StatCard title="PIB National" value="70.99B" change={4.7} />
            <StatCard title="Taux de Chômage" value="7.2%" change={-0.5} />
            <StatCard title="Croissance" value="6.8%" change={0.3} />
          </div>

          {/* Map */}
          <Card className="relative">
            <div ref={mapContainer} className="h-[500px] rounded-lg" />
            
            {/* Layer Controls */}
            <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-2 z-10">
              <div className="flex space-x-2">
                {layers.map(layer => (
                  <button
                    key={layer.id}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      activeLayer === layer.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveLayer(layer.id)}
                  >
                    {layer.id}
                  </button>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 z-10">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-700">Légende</h4>
                <Palette size={16} className="text-gray-400" />
              </div>
              <div className="space-y-2">
                <MapLegendItem color="bg-red-700" label="Niveau élevé" value=">75%" />
                <MapLegendItem color="bg-red-500" label="Niveau moyen" value="25-75%" />
                <MapLegendItem color="bg-red-300" label="Niveau faible" value="<25%" />
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Filtres */}
          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold mb-4">Filtres</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Période
                  </label>
                  <select className="w-full rounded-md border border-gray-300 p-2">
                    <option>2024</option>
                    <option>2023</option>
                    <option>2022</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Indicateur
                  </label>
                  <select className="w-full rounded-md border border-gray-300 p-2">
                    <option>Tous les indicateurs</option>
                    <option>Population</option>
                    <option>PIB</option>
                    <option>Chômage</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Regions List */}
          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold mb-4">Régions sélectionnées</h2>
              <div className="space-y-4">
                {mockRegions.map((region) => (
                  <RegionCard key={region.id} name={region.name} data={region.data} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}