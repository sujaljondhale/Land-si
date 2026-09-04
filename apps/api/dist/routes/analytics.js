"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analyticsController_1 = require("../controllers/analyticsController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Analytics is mostly for Policymakers and Admins, but researchers may see some.
router.get('/indicators', auth_1.authenticate, analyticsController_1.getIndicators);
exports.default = router;
