const Crop = require('../models/Crop');
const fs = require('fs');
const path = require('path');
const { getDBStatus } = require('../config/db');

// In-memory fallback dataset
const loadLocalCrops = () => {
  const c1 = path.join(__dirname, '../data/cropsData.json');
  const c2 = path.join(__dirname, '../../data/cropsData.json');
  const filePath = fs.existsSync(c1) ? c1 : c2;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const localCropsData = loadLocalCrops();

// Seed database if connected and empty
const seedCropsIfEmpty = async () => {
  try {
    const status = getDBStatus();
    if (!status.connected) return;

    const count = await Crop.countDocuments();
    if (count === 0) {
      console.log('[Crop Seeder] Crop collection is empty. Seeding 22 crops from cropsData.json...');
      await Crop.insertMany(localCropsData);
      console.log('[Crop Seeder] Successfully seeded all crops into MongoDB!');
    }
  } catch (err) {
    console.warn('[Crop Seeder] Could not seed crops into MongoDB:', err.message);
  }
};

const getAllCrops = async (req, res) => {
  try {
    const { search } = req.query;
    const status = getDBStatus();

    let crops;
    if (status.connected) {
      let query = {};
      if (search) {
        query = {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { fertilizer: { $regex: search, $options: 'i' } }
          ]
        };
      }
      crops = await Crop.find(query).sort({ name: 1 });
    }

    // Fallback to local data if DB offline or empty
    if (!crops || crops.length === 0) {
      crops = localCropsData;
      if (search) {
        const s = search.toLowerCase();
        crops = crops.filter(
          c =>
            c.name.toLowerCase().includes(s) ||
            c.description.toLowerCase().includes(s) ||
            c.fertilizer.toLowerCase().includes(s)
        );
      }
    }

    res.json({
      success: true,
      count: crops.length,
      data: crops
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getCropById = async (req, res) => {
  try {
    const { id } = req.params;
    const cropKey = id.toLowerCase().trim();
    const status = getDBStatus();

    let crop = null;
    if (status.connected) {
      crop = await Crop.findOne({ id: cropKey });
    }

    if (!crop) {
      crop = localCropsData.find(c => c.id === cropKey || c.crop === cropKey);
    }

    if (!crop) {
      return res.status(404).json({ success: false, error: `Crop '${id}' not found` });
    }

    res.json({ success: true, data: crop });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getLocalCropInfo = (cropName) => {
  const cropKey = (cropName || '').toLowerCase().trim();
  return (
    localCropsData.find(c => c.id === cropKey || c.crop === cropKey) || {
      id: cropKey,
      name: cropKey.charAt(0).toUpperCase() + cropKey.slice(1),
      crop: cropKey,
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600',
      description: 'Healthy agricultural crop well suited for given climatic conditions.',
      fertilizer: 'Standard Balanced NPK',
      fertilizer_reason: 'Provides essential macro and micro nutrients.'
    }
  );
};

module.exports = {
  getAllCrops,
  getCropById,
  seedCropsIfEmpty,
  getLocalCropInfo,
  localCropsData
};
