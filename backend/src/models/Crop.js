const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    name: {
      type: String,
      required: true
    },
    crop: {
      type: String,
      required: true,
      lowercase: true
    },
    image: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    fertilizer: {
      type: String,
      required: true
    },
    fertilizer_reason: {
      type: String,
      required: true
    },
    optimalConditions: {
      n: { type: Number, default: 0 },
      p: { type: Number, default: 0 },
      k: { type: Number, default: 0 },
      temperature: { type: Number, default: 0 },
      humidity: { type: Number, default: 0 },
      ph: { type: Number, default: 0 },
      rainfall: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Crop', cropSchema);
