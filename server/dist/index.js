"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const api_1 = __importDefault(require("./routes/api"));
const database_1 = require("./db/database");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5050; // Use 5050 to avoid any port 5000 collisions
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// API Routes
app.use('/api', api_1.default);
// Locate frontend build folder dynamically
const candidatePaths = [
    path_1.default.resolve(process.cwd(), 'client/dist'),
    path_1.default.resolve(process.cwd(), 'dist'),
    path_1.default.resolve(__dirname, '../../client/dist'),
    path_1.default.resolve(__dirname, '../client/dist'),
];
let clientDistPath = null;
for (const p of candidatePaths) {
    if (fs_1.default.existsSync(p) && fs_1.default.existsSync(path_1.default.join(p, 'index.html'))) {
        clientDistPath = p;
        break;
    }
}
if (clientDistPath) {
    console.log(`📂 Serving static frontend assets from: ${clientDistPath}`);
    app.use(express_1.default.static(clientDistPath));
    app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api')) {
            return next();
        }
        res.sendFile(path_1.default.join(clientDistPath, 'index.html'));
    });
}
else {
    console.warn('⚠️ Frontend dist directory not found in candidate paths.');
}
// Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
});
async function startServer() {
    try {
        // Initialize DB
        await (0, database_1.getDb)();
        console.log('✅ SQLite Database & Hindsight Memory engine loaded successfully');
        app.listen(PORT, () => {
            console.log(`🚀 Smart Meeting Memory Agent Server running on http://localhost:${PORT}`);
        });
    }
    catch (err) {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    }
}
startServer();
