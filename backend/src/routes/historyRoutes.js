const express = require('express');
const router = express.Router();
const {
  getHistory,
  deleteHistoryItem,
  clearHistory
} = require('../controllers/historyController');

router.get('/', getHistory);
router.delete('/:id', deleteHistoryItem);
router.delete('/', clearHistory);

module.exports = router;
