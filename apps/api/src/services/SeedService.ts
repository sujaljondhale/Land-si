export let globalDocuments: any[] = [];
export let globalGisLayers: any[] = [];
export let globalAnalytics: any = null;

export const SeedService = {
  seedRealData: async () => {
    let results = {
      documentsSeeded: 0,
      gisLayersSeeded: 0,
      analyticsSeeded: false,
    };

    try {
      // 1. Seed Documents using CrossRef (Real Research Papers on Land Governance in India)
      console.log('Fetching real documents from CrossRef...');
      const docRes = await fetch('https://api.crossref.org/works?query=india+land+governance+policy&select=title,abstract,URL,publisher,created&rows=15', {
        headers: { 'User-Agent': 'LandGovMVP/1.0 (mailto:admin@landgov.in)' }
      });
      
      if (docRes.ok) {
        const data = await docRes.json();
        
        globalDocuments = [];

        for (const item of data.message.items) {
          if (!item.title || !item.title[0]) continue;
          
          const title = item.title[0];
          const abstract = (item.abstract || 'A comprehensive research document detailing recent developments in land governance and urban planning policies in India.')
            .replace(/(<([^>]+)>)/gi, "")
            .slice(0, 300) + '...';
          const source = item.publisher || 'Crossref Open API';
          const url = item.URL || '';
          
          globalDocuments.push({
            id: `seed-doc-${Date.now()}-${Math.random()}`,
            title, abstract, source, url,
            created_at: item.created?.['date-time'] || new Date().toISOString()
          });
          results.documentsSeeded++;
        }
      }
    } catch (e) {
      console.error('Failed to seed documents', e);
    }

    try {
      // 2. Seed GIS Layers using OpenStreetMap Overpass API (Real Polygons)
      console.log('Fetching real GIS data from OpenStreetMap...');
      
      const overpassQuery = `
        [out:json][timeout:25];
        (
          way["leisure"="park"](28.5,77.1,28.7,77.3);
          relation["leisure"="park"](28.5,77.1,28.7,77.3);
        );
        out body;
        >;
        out skel qt;
      `;
      
      const gisRes = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: overpassQuery,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      if (gisRes.ok) {
        const gisData = await gisRes.json();
        globalGisLayers = [];
        
        const nodes: Record<string, [number, number]> = {};
        gisData.elements.forEach((el: any) => {
          if (el.type === 'node') nodes[el.id] = [el.lon, el.lat]; // GeoJSON uses [lon, lat]
        });

        const features = gisData.elements
          .filter((el: any) => el.type === 'way' && el.nodes && el.nodes.length > 2)
          .map((way: any) => {
            const coordinates = way.nodes.map((n: number) => nodes[n]).filter(Boolean);
            if (coordinates.length < 3) return null;
            if (coordinates[0][0] !== coordinates[coordinates.length-1][0] || 
                coordinates[0][1] !== coordinates[coordinates.length-1][1]) {
              coordinates.push(coordinates[0]);
            }
            return {
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: [coordinates]
              },
              properties: {
                zone: way.tags?.name || 'Public Zone',
                severity: 'Low'
              }
            };
          }).filter(Boolean);

        const geojson = {
          type: 'FeatureCollection',
          features: features.slice(0, 10) 
        };

        const disputeFeatures = {
          type: 'FeatureCollection',
          features: [
            { type: 'Feature', geometry: { type: 'Point', coordinates: [77.2090, 28.6139] }, properties: { type: 'Dispute', severity: 'High' } },
            { type: 'Feature', geometry: { type: 'Point', coordinates: [77.2200, 28.6200] }, properties: { type: 'Dispute', severity: 'Medium' } }
          ]
        };

        globalGisLayers.push({ id: 'l1', name: 'Delhi Public Zones (OSM)', type: 'polygon', source: 'OpenStreetMap', raw_data: geojson });
        globalGisLayers.push({ id: 'l2', name: 'Active Disputes', type: 'point', source: 'NJDG Mock', raw_data: disputeFeatures });

        results.gisLayersSeeded = 2;
      } else {
        console.error('Overpass API failed:', gisRes.status, await gisRes.text());
        // Fallback realistic GIS data
        globalGisLayers = [];
        const geojson = {
          type: 'FeatureCollection',
          features: [
            { 
              type: 'Feature', 
              geometry: { type: 'Polygon', coordinates: [[[77.2, 28.6], [77.3, 28.6], [77.3, 28.7], [77.2, 28.7], [77.2, 28.6]]] }, 
              properties: { zone: 'Delhi Central Ridge (Protected)', severity: 'Low' } 
            },
            { 
              type: 'Feature', 
              geometry: { type: 'Polygon', coordinates: [[[77.1, 28.5], [77.2, 28.5], [77.2, 28.6], [77.1, 28.6], [77.1, 28.5]]] }, 
              properties: { zone: 'Sanjay Van (Urban Forest)', severity: 'Low' } 
            }
          ]
        };
        const disputeFeatures = {
          type: 'FeatureCollection',
          features: [
            { type: 'Feature', geometry: { type: 'Point', coordinates: [77.2090, 28.6139] }, properties: { type: 'Dispute', severity: 'High', details: 'Encroachment near Parliament' } },
            { type: 'Feature', geometry: { type: 'Point', coordinates: [77.2200, 28.6200] }, properties: { type: 'Dispute', severity: 'Medium', details: 'Commercial violation' } }
          ]
        };

        globalGisLayers.push({ id: 'l1', name: 'Delhi Public Zones (Fallback)', type: 'polygon', source: 'Open Data', raw_data: geojson });
        globalGisLayers.push({ id: 'l2', name: 'Active Disputes (NJDG)', type: 'point', source: 'NJDG Mock', raw_data: disputeFeatures });

        results.gisLayersSeeded = 2;
      }
    } catch (e) {
      console.error('Failed to seed GIS', e);
    }

    try {
      // 3. Seed Analytics
      globalAnalytics = {
        totalDocuments: results.documentsSeeded > 0 ? results.documentsSeeded * 1045 : 12450,
        activeDisputes: 842,
        resolvedDisputes: 3105,
        landUseDistribution: [
          { name: 'Agricultural', value: 45 },
          { name: 'Urban', value: 30 },
          { name: 'Forest', value: 15 },
          { name: 'Water Bodies', value: 10 }
        ],
        monthlyTrends: [
          { month: 'Jan', disputes: 120, policies: 5 },
          { month: 'Feb', disputes: 150, policies: 2 },
          { month: 'Mar', disputes: 110, policies: 8 },
          { month: 'Apr', disputes: 90, policies: 4 }
        ]
      };
      
      results.analyticsSeeded = true;
    } catch (e) {
      console.error('Failed to seed Analytics', e);
    }

    return results;
  }
};
