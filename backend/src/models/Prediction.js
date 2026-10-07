const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema(
  {
    n: { type: Number, required: true },
    p: { type: Number, required: true },
    k: { type: Number, required: true },
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    ph: { type: Number, required: true },
    rainfall: { type: Number, required: true },
    city: { type: String, default: '' },
    crop: { type: String, required: true },
    n_status: { type: String, required: true },
    p_status: { type: String, required: true },
    k_status: { type: String, required: true },
    image: { type: String, default: '' },
    description: { type: String, default: '' },
    fertilizer: { type: String, default: '' },
    fertilizer_reason: { type: String, default: '' },
    confidence: { type: Number, default: 0 },
    alternatives: [
      {
        crop: String,
        confidence: Number
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Prediction', predictionSchema);
