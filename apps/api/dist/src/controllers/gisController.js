"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFeatures = exports.getMapLayers = void 0;
const getMapLayers = async (req, res) => {
    try {
        // For MVP, return mock layers that the frontend map will render.
        // In production, this would query PostGIS for spatial layer definitions.
        const layers = [
            { id: 'l1', name: 'Land Use Zones', type: 'polygon', source: 'Bhuvan' },
            { id: 'l2', name: 'Dispute Hotspots', type: 'point', source: 'NJDG' },
        ];
        res.json({
            data: layers,
            requestId: req.headers['x-request-id']
        });
    }
    catch (error) {
        res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to load GIS layers' } });
    }
};
exports.getMapLayers = getMapLayers;
const getFeatures = async (req, res) => {
    try {
        const { layerId } = req.params;
        // Return mock GeoJSON for the requested layer
        let features = { type: 'FeatureCollection', features: [] };
        if (layerId === 'l2') {
            // Mock dispute points (New Delhi area)
            features.features = [
                { type: 'Feature', geometry: { type: 'Point', coordinates: [77.2090, 28.6139] }, properties: { type: 'Dispute', severity: 'High' } },
                { type: 'Feature', geometry: { type: 'Point', coordinates: [77.2200, 28.6200] }, properties: { type: 'Dispute', severity: 'Medium' } }
            ];
        }
        else {
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
        res.json({
            data: features,
            requestId: req.headers['x-request-id']
        });
    }
    catch (error) {
        res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to load spatial features' } });
    }
};
exports.getFeatures = getFeatures;
