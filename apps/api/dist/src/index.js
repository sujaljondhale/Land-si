"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
const corsMiddleware = require('cors');
app.use(corsMiddleware({
    origin: process.env.CORS_ORIGIN || '*',
}));
app.use(express_1.default.json());
// Request ID middleware (as requested in guide)
app.use((req, res, next) => {
    req.headers['x-request-id'] = req.headers['x-request-id'] || `req-${Date.now()}`;
    next();
});
const documents_1 = __importDefault(require("./routes/documents"));
const search_1 = __importDefault(require("./routes/search"));
const gis_1 = __importDefault(require("./routes/gis"));
const analytics_1 = __importDefault(require("./routes/analytics"));
const workspace_1 = __importDefault(require("./routes/workspace"));
const simulator_1 = __importDefault(require("./routes/simulator"));
const public_1 = __importDefault(require("./routes/public"));
app.use('/auth', auth_1.default);
app.use('/documents', documents_1.default);
app.use('/search', search_1.default);
app.use('/gis', gis_1.default);
app.use('/analytics', analytics_1.default);
app.use('/workspace', workspace_1.default);
app.use('/simulator', simulator_1.default);
app.use('/public', public_1.default);
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Generic Error Handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        },
        requestId: req.headers['x-request-id']
    });
});
app.listen(PORT, () => {
    console.log(`API Server running on port ${PORT}`);
});
