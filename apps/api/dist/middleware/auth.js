"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'hackathon-secret-key';
// Authenticate JWT token
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'No token provided' } });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ error: { code: 'INVALID_TOKEN', message: 'Token is invalid or expired' } });
        return;
    }
};
exports.authenticate = authenticate;
// Role-based access control middleware
const authorize = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Insufficient permissions' } });
            return;
        }
        next();
    };
};
exports.authorize = authorize;
