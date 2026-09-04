"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gisController_1 = require("../controllers/gisController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// GIS access depends on role (public can see some, researchers see all). 
// Here we just authenticate for simplicity, but we could add authorize() checks.
router.get('/layers', auth_1.authenticate, gisController_1.getMapLayers);
router.get('/layers/:layerId/features', auth_1.authenticate, gisController_1.getFeatures);
exports.default = router;
