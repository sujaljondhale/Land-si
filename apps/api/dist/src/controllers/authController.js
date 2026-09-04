"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'hackathon-secret-key';
const login = (req, res) => {
    const { role } = req.body;
    const validRoles = ['public', 'researcher', 'institution', 'policymaker', 'admin'];
    if (!role || !validRoles.includes(role)) {
        res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Invalid or missing role' } });
        return;
    }
    // Generate a mock user ID for the session
    const userId = `mock-user-${Date.now()}`;
    // Issue JWT
    const token = jsonwebtoken_1.default.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({
        data: {
            token,
            user: {
                id: userId,
                role,
                name: `${role.charAt(0).toUpperCase() + role.slice(1)} User`
            }
        }
    });
};
exports.login = login;
const getMe = (req, res) => {
    res.json({
        data: {
            user: req.user
        }
    });
};
exports.getMe = getMe;
