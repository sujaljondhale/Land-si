"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const workspaceController_1 = require("../controllers/workspaceController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Workspaces are for Researchers and Institutions
router.get('/', auth_1.authenticate, (0, auth_1.authorize)(['researcher', 'institution', 'admin']), workspaceController_1.getWorkspaces);
exports.default = router;
