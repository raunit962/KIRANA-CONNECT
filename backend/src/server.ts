import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import parcelsRoutes from './routes/parcels.routes';
import storesRoutes from './routes/stores.routes';
import matchingRoutes from './routes/matching.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'KiranaConnect PUDO Logistics API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/parcels', parcelsRoutes);
app.use('/api/stores', storesRoutes);
app.use('/api/matching', matchingRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(`🚀 KiranaConnect API running on port ${PORT}`);
  console.log(`📍 Healthcheck: http://localhost:${PORT}/api/health`);
  console.log(`=============================================`);
});
