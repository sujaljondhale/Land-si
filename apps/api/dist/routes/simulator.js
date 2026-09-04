"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const simulatorController_1 = require("../controllers/simulatorController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Simulator is highly restricted to Policymakers and Admins
router.post('/run', auth_1.authenticate, (0, auth_1.authorize)(['policymaker', 'admin']), simulatorController_1.runSimulation);
exports.default = router;
