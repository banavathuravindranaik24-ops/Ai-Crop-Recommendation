const express = require('express');
const router = express.Router();
const { predictCrop } = require('../controllers/predictController');

router.post('/', predictCrop);

module.exports = router;
