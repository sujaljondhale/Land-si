import { Request, Response } from 'express';

import { query } from '../config/db';
import { globalGisLayers } from '../services/SeedService';

export const getMapLayers = async (req: Request, res: Response): Promise<void> => {
  try {
    let layers = [
      { id: 'l1', name: 'Land Use Zones', type: 'polygon', source: 'Bhuvan' },
      { id: 'l2', name: 'Dispute Hotspots', type: 'point', source: 'NJDG' },
    ];
    
    if (globalGisLayers && globalGisLayers.length > 0) {
      layers = globalGisLayers.map(l => ({ id: l.id, name: l.name, type: l.type, source: l.source }));
    } else {
      try {
        const dbRes = await query('SELECT id, name, type, source FROM gis_layers');
        if (dbRes.rows.length > 0) {
          layers = dbRes.rows;
        }
      } catch (e) {
        // ignore
      }
    }

    res.json({
      data: layers,
      requestId: req.headers['x-request-id']
    });
  } catch (error) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to load GIS layers' } });
  }
};

export const getFeatures = async (req: Request, res: Response): Promise<void> => {
  try {
    const { layerId } = req.params;
    
    let features: any = { type: 'FeatureCollection', features: [] };
    let dbSuccess = false;

    try {
      if (globalGisLayers && globalGisLayers.length > 0) {
        const layer = globalGisLayers.find(l => l.id === layerId);
        if (layer) {
          features = layer.raw_data;
          dbSuccess = true;
        }
      }
      
      if (!dbSuccess) {
        const dbRes = await query('SELECT raw_data FROM gis_layers WHERE id = $1', [layerId]);
        if (dbRes.rows.length > 0) {
          features = dbRes.rows[0].raw_data;
          dbSuccess = true;
        }
      }
    } catch (e) {
      // ignore
    }
    
    if (!dbSuccess) {
      if (layerId === 'l2') {
        // Mock dispute points (New Delhi area)
        features.features = [
          { type: 'Feature', geometry: { type: 'Point', coordinates: [77.2090, 28.6139] }, properties: { type: 'Dispute', severity: 'High' } },
          { type: 'Feature', geometry: { type: 'Point', coordinates: [77.2200, 28.6200] }, properties: { type: 'Dispute', severity: 'Medium' } }
        ];
      } else {
        // Mock polygon for land use
        features.features = [
          { 
            type: 'Feature', 
            geometry: { 
              type: 'Polygon', 
              coordinates: [[[77.2, 28.6], [77.3, 28.6], [77.3, 28.7], [77.2, 28.7], [77.2, 28.6]]] 
            }, 
            properties: { zone: 'Agricultural' } 
          }
        ];
      }
    }

    res.json({
      data: features,
      requestId: req.headers['x-request-id']
    });
  } catch (error) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to load spatial features' } });
  }
};
