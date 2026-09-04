"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const publicController_1 = require("../controllers/publicController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// These endpoints are accessible by the Public role
router.post('/grievance', auth_1.authenticate, publicController_1.submitGrievance);
router.post('/innovation', auth_1.authenticate, publicController_1.submitInnovation);
exports.default = router;
