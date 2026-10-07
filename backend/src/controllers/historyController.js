const Prediction = require('../models/Prediction');
const { getDBStatus } = require('../config/db');
const { memoryHistory, saveHistoryToFile } = require('./predictController');

const getHistory = async (req, res) => {
  try {
    const status = getDBStatus();
    let records = [];

    if (status.connected) {
      records = await Prediction.find().sort({ createdAt: -1 }).limit(50);
    } else {
      records = memoryHistory;
    }

    res.json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const deleteHistoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const status = getDBStatus();

    if (status.connected) {
      await Prediction.findByIdAndDelete(id);
    } else {
      const idx = memoryHistory.findIndex(m => m._id === id);
      if (idx !== -1) {
        memoryHistory.splice(idx, 1);
        saveHistoryToFile(memoryHistory);
      }
    }

    res.json({ success: true, message: 'Record deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const clearHistory = async (req, res) => {
  try {
    const status = getDBStatus();

    if (status.connected) {
      await Prediction.deleteMany({});
    }
    memoryHistory.length = 0;
    saveHistoryToFile(memoryHistory);

    res.json({ success: true, message: 'All prediction history cleared' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getHistory,
  deleteHistoryItem,
  clearHistory
};
