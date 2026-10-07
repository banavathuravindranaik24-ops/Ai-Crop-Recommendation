const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { getDBStatus } = require('./config/db');
const mlModel = require('./services/mlModel');

const predictRoutes = require('./routes/predictRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const cropRoutes = require('./routes/cropRoutes');
const historyRoutes = require('./routes/historyRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = getDBStatus();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      connected: dbStatus.connected,
      readyState: dbStatus.readyState,
      host: dbStatus.host
    },
    mlModel: {
      loaded: mlModel.isLoaded,
      totalSamples: mlModel.samples.length,
      supportedCropsCount: mlModel.uniqueCrops.length
    }
  });
});

// API Routes
app.use('/api/predict', predictRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/history', historyRoutes);

// Compatibility routes for existing clients (matching original app.py exactly)
app.use('/predict', predictRoutes);
app.use('/weather', weatherRoutes);

const path = require('path');
const fs = require('fs');
const distPath = path.join(__dirname, '../../frontend/dist');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/predict') || req.path.startsWith('/weather')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // Fallback Root route when frontend build is not yet generated
  app.get('/', (req, res) => {
    res.json({
      name: 'AI Crop Recommendation API',
      version: '1.0.0',
      description: 'Express.js & MongoDB backend for agricultural crop recommendation',
      endpoints: {
        predict: 'POST /api/predict',
        weather: 'GET /api/weather/:city',
        crops: 'GET /api/crops',
        history: 'GET /api/history',
        health: 'GET /api/health'
      }
    });
  });
}

// 404 handler for unmatched API routes
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route not found: ${req.originalUrl}` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

module.exports = app;
