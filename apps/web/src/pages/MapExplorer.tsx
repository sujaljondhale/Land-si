import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Layers, MapPin } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

// Fix Leaflet's default icon path issues in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function UserLocationMarker({ position }: { position: [number, number] | null }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 13);
    }
  }, [position, map]);

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
  
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [initialCenter, setInitialCenter] = useState<[number, number] | null>(null);

  useEffect(() => {
    // Get initial location before rendering map to prevent jumping from Delhi
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setUserLocation(loc);
          setInitialCenter(loc);
        },
        (err) => {
          console.warn("Geolocation denied or failed, defaulting to Delhi", err);
          setInitialCenter([28.6139, 77.2090]); // Fallback
        },
        { timeout: 5000 }
      );
    } else {
      setInitialCenter([28.6139, 77.2090]);
    }
  }, []);

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
  }, [activeLayers, features]);

  const toggleLayer = (id: string) => {
    const newLayers = new Set(activeLayers);
    if (newLayers.has(id)) {
      newLayers.delete(id);
    } else {
      newLayers.add(id);
    }
    setActiveLayers(newLayers);
  };

  const handleLocateMe = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        }
      );
    }
  };

  if (!initialCenter) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-140px)] gap-4">
      {/* Map Control Sidebar */}
      <Card className="w-80 flex flex-col overflow-hidden hidden md:flex">
        <div className="p-5 border-b border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/50 flex items-center justify-between">
          <div className="flex items-center">
            <Layers className="h-5 w-5 mr-2 text-primary" />
            <h2 className="font-bold text-gray-800 dark:text-gray-100">Map Layers</h2>
          </div>
        </div>
        <CardContent className="p-5 flex-1 overflow-y-auto">
          <div className="space-y-4">
            {layers.map(layer => (
              <div key={layer.id} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id={`layer-${layer.id}`}
                  checked={activeLayers.has(layer.id)}
                  onChange={() => toggleLayer(layer.id)}
                  className="h-4 w-4 rounded border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-primary focus:ring-primary"
                />
                <label htmlFor={`layer-${layer.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-200">
                  {layer.name}
                  <span className="block text-xs text-gray-500 dark:text-gray-400 font-normal mt-1">Source: {layer.source}</span>
                </label>
              </div>
            ))}
          </div>
        </CardContent>
        <div className="p-4 border-t border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/50">
           <Button variant="outline" className="w-full" onClick={handleLocateMe}>
             <MapPin className="h-4 w-4 mr-2" /> Center on Me
           </Button>
        </div>
      </Card>

      {/* Map Area */}
      <div className="flex-1 rounded-[1.5rem] overflow-hidden border border-gray-200 dark:border-neutral-800 shadow-sm relative z-0">
        <MapContainer 
          center={initialCenter}
          zoom={12} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <UserLocationMarker position={userLocation} />
          
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
