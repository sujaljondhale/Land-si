import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Layers } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';

// Fix Leaflet's default icon path issues in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function UserLocationMarker() {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      map.flyTo(e.latlng, map.getZoom());
    });
  }, [map]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );
}

export function MapExplorer() {
  const [layers, setLayers] = useState<any[]>([]);
  const [activeLayers, setActiveLayers] = useState<Set<string>>(new Set(['l2'])); // Default to disputes
  const [features, setFeatures] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchLayers = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('mockUser') || '{}')?.token;
        const res = await fetch('http://localhost:3000/gis/layers', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setLayers(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch GIS layers');
      }
      
      // Fallback in case of API/auth failure
      setLayers([
        { id: 'l1', name: 'Land Use Zones', type: 'polygon', source: 'Bhuvan' },
        { id: 'l2', name: 'Dispute Hotspots', type: 'point', source: 'NJDG' },
      ]);
    };
    fetchLayers();
  }, []);

  useEffect(() => {
    const fetchFeatures = async (layerId: string) => {
      if (features[layerId]) return; // Already cached
      try {
        const token = JSON.parse(localStorage.getItem('mockUser') || '{}')?.token;
        const res = await fetch(`http://localhost:3000/gis/layers/${layerId}/features`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setFeatures(prev => ({ ...prev, [layerId]: data.data }));
        }
      } catch (error) {
        console.error(`Failed to fetch features for layer ${layerId}`);
      }
      
      // Fallback GeoJSON
      let fallbackFeatures: any = { type: 'FeatureCollection', features: [] };
      if (layerId === 'l2') {
        fallbackFeatures.features = [
          { type: 'Feature', geometry: { type: 'Point', coordinates: [77.2090, 28.6139] }, properties: { type: 'Dispute', severity: 'High' } },
          { type: 'Feature', geometry: { type: 'Point', coordinates: [77.2200, 28.6200] }, properties: { type: 'Dispute', severity: 'Medium' } }
        ];
      } else {
        fallbackFeatures.features = [
          { 
            type: 'Feature', 
            geometry: { type: 'Polygon', coordinates: [[[77.2, 28.6], [77.3, 28.6], [77.3, 28.7], [77.2, 28.7], [77.2, 28.6]]] }, 
            properties: { zone: 'Agricultural' } 
          }
        ];
      }
      setFeatures(prev => ({ ...prev, [layerId]: fallbackFeatures }));
    };

    activeLayers.forEach(layerId => {
      fetchFeatures(layerId);
    });
  }, [activeLayers]);

  const toggleLayer = (id: string) => {
    const newLayers = new Set(activeLayers);
    if (newLayers.has(id)) {
      newLayers.delete(id);
    } else {
      newLayers.add(id);
    }
    setActiveLayers(newLayers);
  };

  return (
    <div className="flex h-full gap-4">
      {/* Map Control Sidebar */}
      <Card className="w-80 flex flex-col overflow-hidden hidden md:flex border-gray-200 dark:border-neutral-800">
        <div className="p-4 border-b border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900/50 flex items-center">
          <Layers className="h-5 w-5 mr-2 text-[#2A7C13] dark:text-[#76C457]" />
          <h2 className="font-bold text-gray-800 dark:text-gray-100">Map Layers</h2>
        </div>
        <CardContent className="p-4 flex-1 overflow-y-auto bg-white dark:bg-neutral-900">
          <div className="space-y-4">
            {layers.map(layer => (
              <div key={layer.id} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id={`layer-${layer.id}`}
                  checked={activeLayers.has(layer.id)}
                  onChange={() => toggleLayer(layer.id)}
                  className="h-4 w-4 rounded border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-[#2A7C13] focus:ring-[#2A7C13]"
                />
                <label htmlFor={`layer-${layer.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-200">
                  {layer.name}
                  <span className="block text-xs text-gray-500 dark:text-gray-400 font-normal mt-0.5">Source: {layer.source}</span>
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Map Area */}
      <div className="flex-1 rounded-xl overflow-hidden border shadow-sm relative z-0">
        <MapContainer 
          center={[28.6139, 77.2090]} // New Delhi Center
          zoom={12} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <UserLocationMarker />
          
          {/* Render Active Features */}
          {Array.from(activeLayers).map(layerId => {
            const layerData = features[layerId];
            if (!layerData) return null;

            return layerData.features.map((feature: any, i: number) => {
              if (feature.geometry.type === 'Point') {
                return (
                  <Marker key={`${layerId}-${i}`} position={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]}>
                    <Popup>
                      <strong>{feature.properties.type}</strong><br/>
                      Severity: {feature.properties.severity}
                    </Popup>
                  </Marker>
                );
              }
              if (feature.geometry.type === 'Polygon') {
                // Leaflet expects [lat, lng], GeoJSON is [lng, lat]
                const positions = feature.geometry.coordinates[0].map((coord: number[]) => [coord[1], coord[0]]);
                return (
                  <Polygon 
                    key={`${layerId}-${i}`} 
                    positions={positions} 
                    pathOptions={{ color: '#2A7C13', fillColor: '#76C457', fillOpacity: 0.4 }} 
                  >
                    <Popup>Zone: {feature.properties.zone}</Popup>
                  </Polygon>
                );
              }
              return null;
            });
          })}
        </MapContainer>
      </div>
    </div>
  );
}
