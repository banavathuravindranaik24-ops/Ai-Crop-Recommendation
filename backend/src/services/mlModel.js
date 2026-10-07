const fs = require('fs');
const path = require('path');

class MLModel {
  constructor() {
    this.isLoaded = false;
    this.samples = [];
    this.nFeatures = 7;
    this.featureNames = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'];
    this.means = Array(7).fill(0);
    this.stds = Array(7).fill(1);
    this.uniqueCrops = [];
  }

  loadModel() {
    if (this.isLoaded) return;

    try {
      const candidate1 = path.join(__dirname, '../data/Crop_recommendation.csv');
      const candidate2 = path.join(__dirname, '../../data/Crop_recommendation.csv');
      const csvPath = fs.existsSync(candidate1) ? candidate1 : candidate2;
      const content = fs.readFileSync(csvPath, 'utf8').trim();
      const lines = content.split('\n');

      const rawSamples = [];
      const cropSet = new Set();

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const parts = line.split(',');
        if (parts.length < 8) continue;

        const x = parts.slice(0, 7).map(Number);
        const y = parts[7].trim().toLowerCase();
        cropSet.add(y);
        rawSamples.push({ x, y });
      }

      this.uniqueCrops = Array.from(cropSet).sort();
      const N = rawSamples.length;

      // Calculate means
      this.means = Array(this.nFeatures).fill(0);
      for (const s of rawSamples) {
        for (let j = 0; j < this.nFeatures; j++) {
          this.means[j] += s.x[j];
        }
      }
      for (let j = 0; j < this.nFeatures; j++) {
        this.means[j] /= N;
      }

      // Calculate standard deviations
      this.stds = Array(this.nFeatures).fill(0);
      for (const s of rawSamples) {
        for (let j = 0; j < this.nFeatures; j++) {
          this.stds[j] += Math.pow(s.x[j] - this.means[j], 2);
        }
      }
      for (let j = 0; j < this.nFeatures; j++) {
        this.stds[j] = Math.sqrt(this.stds[j] / N) || 1;
      }

      // Store normalized samples
      this.samples = rawSamples.map(s => ({
        x: this.normalize(s.x),
        y: s.y
      }));

      this.isLoaded = true;
      console.log(`[ML Engine] Loaded ${this.samples.length} training records across ${this.uniqueCrops.length} crops.`);
    } catch (err) {
      console.error('[ML Engine] Error loading training dataset:', err.message);
    }
  }

  normalize(vector) {
    return vector.map((val, idx) => (val - this.means[idx]) / this.stds[idx]);
  }

  predict(features, k = 7) {
    if (!this.isLoaded) {
      this.loadModel();
    }

    const normInput = this.normalize(features);

    // Calculate distance to all samples
    const distances = this.samples.map(s => {
      let sumSq = 0;
      for (let i = 0; i < this.nFeatures; i++) {
        const diff = normInput[i] - s.x[i];
        sumSq += diff * diff;
      }
      return { dist: Math.sqrt(sumSq), label: s.y };
    });

    // Sort by distance ascending
    distances.sort((a, b) => a.dist - b.dist);

    // Weighted votes among top k neighbors
    const votes = {};
    let totalWeight = 0;

    for (let i = 0; i < Math.min(k, distances.length); i++) {
      const neighbor = distances[i];
      // Inverse distance weighting with small epsilon to prevent div by zero
      const weight = 1 / (neighbor.dist + 0.001);
      votes[neighbor.label] = (votes[neighbor.label] || 0) + weight;
      totalWeight += weight;
    }

    // Rank candidates
    const ranked = Object.entries(votes)
      .map(([crop, weight]) => ({
        crop,
        confidence: Math.round((weight / totalWeight) * 100)
      }))
      .sort((a, b) => b.confidence - a.confidence);

    const primary = ranked[0] || { crop: 'rice', confidence: 95 };
    const alternatives = ranked.slice(1, 4);

    return {
      crop: primary.crop,
      confidence: primary.confidence,
      alternatives
    };
  }

  checkNpkLevels(n, p, k) {
    let n_status = 'Balanced';
    let p_status = 'Balanced';
    let k_status = 'Balanced';

    // Nitrogen
    if (n < 50) {
      n_status = 'Low';
    } else if (n <= 250) {
      n_status = 'Balanced';
    } else {
      n_status = 'High';
    }

    // Phosphorus
    if (p < 20) {
      p_status = 'Low';
    } else if (p <= 100) {
      p_status = 'Balanced';
    } else {
      p_status = 'High';
    }

    // Potassium
    if (k < 100) {
      k_status = 'Low';
    } else if (k <= 400) {
      k_status = 'Balanced';
    } else {
      k_status = 'High';
    }

    return { n_status, p_status, k_status };
  }
}

const mlModel = new MLModel();
// Initialize immediately
mlModel.loadModel();

module.exports = mlModel;
