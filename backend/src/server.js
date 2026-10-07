const path = require('path');
const fs = require('fs');

// Explicitly load .env from backend or root
const envPath1 = path.join(__dirname, '../.env');
const envPath2 = path.join(__dirname, '../../.env');
const envFile = fs.existsSync(envPath1) ? envPath1 : envPath2;
require('dotenv').config({ path: envFile });
const http = require('http');
const app = require('./app');
const { connectDB } = require('./config/db');
const { seedCropsIfEmpty } = require('./controllers/cropController');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Attempt to connect to MongoDB
  const connected = await connectDB();
  if (connected) {
    await seedCropsIfEmpty();
  }

  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`🌾 AI Crop Recommendation Server running!`);
    console.log(`🚀 Port: ${PORT}`);
    console.log(`🌐 Base URL: http://localhost:${PORT}`);
    console.log(`🌱 Endpoints:`);
    console.log(`   - POST http://localhost:${PORT}/api/predict`);
    console.log(`   - GET  http://localhost:${PORT}/api/weather/:city`);
    console.log(`   - GET  http://localhost:${PORT}/api/crops`);
    console.log(`   - GET  http://localhost:${PORT}/api/history`);
    console.log(`   - GET  http://localhost:${PORT}/api/health`);
    console.log(`===============================================`);
  });

  // Handle termination signals
  const shutdown = () => {
    console.log('\nGracefully shutting down server...');
    server.close(() => {
      console.log('Server stopped.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

startServer();
