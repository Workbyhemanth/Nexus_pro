import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import apiRoutes from './routes/api';
import { getDb } from './db/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050; // Use 5050 to avoid any port 5000 collisions

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Locate frontend build folder dynamically
const candidatePaths = [
  path.resolve(process.cwd(), 'client/dist'),
  path.resolve(process.cwd(), 'dist'),
  path.resolve(__dirname, '../../client/dist'),
  path.resolve(__dirname, '../client/dist'),
];

let clientDistPath: string | null = null;
for (const p of candidatePaths) {
  if (fs.existsSync(p) && fs.existsSync(path.join(p, 'index.html'))) {
    clientDistPath = p;
    break;
  }
}

if (clientDistPath) {
  console.log(`📂 Serving static frontend assets from: ${clientDistPath}`);
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath!, 'index.html'));
  });
} else {
  console.warn('⚠️ Frontend dist directory not found in candidate paths.');
}

// Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

async function startServer() {
  try {
    // Initialize DB
    await getDb();
    console.log('✅ SQLite Database & Hindsight Memory engine loaded successfully');

    app.listen(PORT, () => {
      console.log(`🚀 Smart Meeting Memory Agent Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
