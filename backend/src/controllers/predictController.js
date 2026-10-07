const mlModel = require('../services/mlModel');
const Prediction = require('../models/Prediction');
const { getLocalCropInfo } = require('./cropController');
const { getDBStatus } = require('../config/db');

const fs = require('fs');
const path = require('path');

const getHistoryFilePath = () => {
  const p1 = path.join(__dirname, '../data/history.json');
  const p2 = path.join(__dirname, '../../data/history.json');
  return fs.existsSync(p1) ? p1 : (fs.existsSync(p2) ? p2 : p1);
};

const loadHistoryFromFile = () => {
  try {
    const f = getHistoryFilePath();
    if (fs.existsSync(f)) {
      return JSON.parse(fs.readFileSync(f, 'utf8'));
    }
  } catch (e) {}
  return [];
};

const saveHistoryToFile = (data) => {
  try {
    const f = getHistoryFilePath();
    fs.writeFileSync(f, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {}
};

// In-memory + JSON file fallback history for when MongoDB is in offline mode
const memoryHistory = loadHistoryFromFile();

const predictCrop = async (req, res) => {
  try {
    const data = req.body;
    const requiredFields = ['n', 'p', 'k', 'temperature', 'humidity', 'ph', 'rainfall'];

    // Validation
    for (const field of requiredFields) {
      if (data[field] === undefined || data[field] === null || data[field] === '') {
        return res.status(400).json({
          success: false,
          error: `${field.toUpperCase()} is required`
        });
      }
    }

    const n = parseFloat(data.n);
    const p = parseFloat(data.p);
    const k = parseFloat(data.k);
    const temperature = parseFloat(data.temperature);
    const humidity = parseFloat(data.humidity);
    const ph = parseFloat(data.ph);
    const rainfall = parseFloat(data.rainfall);
    const city = (data.city || '').trim();

    if ([n, p, k, temperature, humidity, ph, rainfall].some(isNaN)) {
      return res.status(400).json({
        success: false,
        error: 'All agricultural parameters must be valid numbers'
      });
    }

    // 1. Check NPK Levels
    const { n_status, p_status, k_status } = mlModel.checkNpkLevels(n, p, k);

    // 2. ML Prediction
    const predictionResult = mlModel.predict([n, p, k, temperature, humidity, ph, rainfall]);
    const crop = predictionResult.crop.toLowerCase();

    // 3. Retrieve crop information & fertilizer
    const cropInfo = getLocalCropInfo(crop);

    const predictionPayload = {
      n,
      p,
      k,
      temperature,
      humidity,
      ph,
      rainfall,
      city,
      crop,
      n_status,
      p_status,
      k_status,
      image: cropInfo.image,
      description: cropInfo.description,
      fertilizer: cropInfo.fertilizer,
      fertilizer_reason: cropInfo.fertilizer_reason,
      confidence: predictionResult.confidence,
      alternatives: predictionResult.alternatives
    };

    // 4. Save to MongoDB if available, else in-memory cache
    let savedRecord = null;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      try {
        savedRecord = await Prediction.create(predictionPayload);
      } catch (dbErr) {
        console.warn('[Prediction] Warning saving to MongoDB:', dbErr.message);
      }
    }

    if (!savedRecord) {
      const mockId = 'mem_' + Date.now();
      savedRecord = {
        _id: mockId,
        ...predictionPayload,
        createdAt: new Date().toISOString()
      };
      memoryHistory.unshift(savedRecord);
      if (memoryHistory.length > 50) memoryHistory.pop();
      saveHistoryToFile(memoryHistory);
    }

    // Return response adhering strictly to original contract + enhanced metadata
    res.json({
      success: true,
      crop,
      n_status,
      p_status,
      k_status,
      image: cropInfo.image,
      description: cropInfo.description,
      fertilizer: cropInfo.fertilizer,
      fertilizer_reason: cropInfo.fertilizer_reason,
      confidence: predictionResult.confidence,
      alternatives: predictionResult.alternatives,
      predictionId: savedRecord._id,
      createdAt: savedRecord.createdAt
    });
  } catch (err) {
    console.error('[Predict Error]', err);
    res.status(500).json({ success: false, error: err.message || 'Server error during prediction' });
  }
};

module.exports = {
  predictCrop,
  memoryHistory,
  saveHistoryToFile
};
