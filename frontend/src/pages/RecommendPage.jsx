import React, { useState } from 'react';
import {
  CloudSun,
  Search,
  Sprout,
  Loader2,
  AlertCircle,
  HelpCircle,
  Zap,
  RotateCcw,
  Thermometer,
  Droplets,
  CloudRain,
  Activity,
  Maximize2,
  MapPin
} from 'lucide-react';
import NpkMeter from '../components/NpkMeter';
import ResultCard from '../components/ResultCard';
import { fetchWeather, predictCrop } from '../services/api';

const PRESETS = [
  {
    label: '🌶️ Chilli Preset (Guntur)',
    desc: 'Warm, moderate rain, balanced NPK',
    data: { n: 100, p: 60, k: 55, temperature: 28.5, humidity: 67, ph: 6.5, rainfall: 85, city: 'Guntur', area: 2, areaUnit: 'acres' }
  },
  {
    label: 'Rice Preset',
    desc: 'High rain, humid',
    data: { n: 90, p: 42, k: 43, temperature: 21, humidity: 82, ph: 6.5, rainfall: 203, city: 'Cuttack', area: 3, areaUnit: 'acres' }
  },
  {
    label: 'Maize Preset',
    desc: 'Warm, moderate rain',
    data: { n: 78, p: 48, k: 20, temperature: 22, humidity: 65, ph: 6.2, rainfall: 85, city: 'Indore', area: 2, areaUnit: 'acres' }
  },
  {
    label: 'Chickpea Preset',
    desc: 'Cool, low humidity',
    data: { n: 40, p: 68, k: 80, temperature: 19, humidity: 17, ph: 7.3, rainfall: 80, city: 'Jaipur', area: 2, areaUnit: 'acres' }
  },
  {
    label: 'Apple Preset',
    desc: 'Cool climate, high K',
    data: { n: 21, p: 134, k: 200, temperature: 22, humidity: 92, ph: 6.0, rainfall: 110, city: 'Shimla', area: 1, areaUnit: 'acres' }
  },
  {
    label: 'Cotton Preset',
    desc: 'Warm, moderate N',
    data: { n: 117, p: 46, k: 19, temperature: 24, humidity: 80, ph: 6.8, rainfall: 80, city: 'Nagpur', area: 4, areaUnit: 'acres' }
  }
];

export default function RecommendPage({ onSelectCrop }) {
  const [formData, setFormData] = useState({
    city: '',
    area: '1',
    areaUnit: 'acres',
    n: '',
    p: '',
    k: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: ''
  });

  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [predictLoading, setPredictLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const applyPreset = (preset) => {
    setFormData({
      city: preset.data.city || '',
      area: preset.data.area ? String(preset.data.area) : '1',
      areaUnit: preset.data.areaUnit || 'acres',
      n: preset.data.n,
      p: preset.data.p,
      k: preset.data.k,
      temperature: preset.data.temperature,
      humidity: preset.data.humidity,
      ph: preset.data.ph,
      rainfall: preset.data.rainfall
    });
    setErrorMsg('');
  };

  const resetForm = () => {
    setFormData({
      city: '',
      area: '1',
      areaUnit: 'acres',
      n: '',
      p: '',
      k: '',
      temperature: '',
      humidity: '',
      ph: '',
      rainfall: ''
    });
    setWeatherInfo(null);
    setResult(null);
    setErrorMsg('');
  };

  const handleGetWeather = async (e) => {
    e.preventDefault();
    if (!formData.city.trim()) {
      setErrorMsg('Please enter a city name to fetch weather data.');
      return;
    }

    setWeatherLoading(true);
    setErrorMsg('');
    try {
      const data = await fetchWeather(formData.city);
      if (data.error) {
        setErrorMsg(`Weather Error: ${data.error}`);
      } else {
        setFormData((prev) => ({
          ...prev,
          temperature: data.temperature,
          humidity: data.humidity
        }));
        setWeatherInfo(data);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.error || err.message || 'Could not fetch weather');
    } finally {
      setWeatherLoading(false);
    }
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const { n, p, k, temperature, humidity, ph, rainfall, area, areaUnit } = formData;
    if (
      n === '' ||
      p === '' ||
      k === '' ||
      temperature === '' ||
      humidity === '' ||
      ph === '' ||
      rainfall === ''
    ) {
      setErrorMsg('Please fill all agricultural and climatic fields before requesting recommendation.');
      return;
    }

    setPredictLoading(true);
    try {
      const res = await predictCrop({
        n: parseFloat(n),
        p: parseFloat(p),
        k: parseFloat(k),
        temperature: parseFloat(temperature),
        humidity: parseFloat(humidity),
        ph: parseFloat(ph),
        rainfall: parseFloat(rainfall),
        city: formData.city,
        area: parseFloat(area) || 1,
        areaUnit: areaUnit || 'acres'
      });

      if (res.error) {
        setErrorMsg(res.error);
      } else {
        setResult(res);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.error || err.message || 'Error occurred while generating recommendation');
    } finally {
      setPredictLoading(false);
    }
  };

  return (
    <div className="recommend-page">
      <div className="recommend-header">
        <h1>
          🌾 AI Crop Recommendation Dashboard
        </h1>
        <p>
          Analyze soil chemistry, meteorological conditions, and land area with machine learning to identify the best crop and fertilizer.
        </p>
      </div>

      {/* Quick Presets */}
      <div className="presets-bar">
        <span className="preset-label">
          <Zap size={14} /> Quick Field Presets:
        </span>
        <div className="preset-buttons">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              className="preset-btn"
              onClick={() => applyPreset(p)}
              title={p.desc}
            >
              {p.label}
            </button>
          ))}
          <button type="button" className="preset-reset-btn" onClick={resetForm} title="Reset Form">
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="error-alert">
          <AlertCircle size={20} />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="dashboard-grid">
        {/* Left Column: Form Area */}
        <div className="form-card">
          {/* Weather & Location integration */}
          <div className="form-section">
            <label className="section-label">
              <CloudSun size={17} />
              <span>Location & Weather Sync</span>
            </label>
            <div className="weather-input-row">
              <input
                type="text"
                name="city"
                placeholder="Enter city or area (e.g. Guntur, Bhimavaram, Pune)"
                value={formData.city}
                onChange={handleChange}
                className="input-field"
              />
              <button
                type="button"
                className="btn-weather"
                onClick={handleGetWeather}
                disabled={weatherLoading}
              >
                {weatherLoading ? (
                  <Loader2 size={16} className="spinner" />
                ) : (
                  <>
                    <Search size={16} />
                    <span>Get Weather</span>
                  </>
                )}
              </button>
            </div>

            {weatherInfo && (
              <div className="weather-badge-info">
                <span>
                  📍 {weatherInfo.city} ({weatherInfo.country}) · 🌡 {weatherInfo.temperature}°C · 💧 {weatherInfo.humidity}% Humidity · {weatherInfo.description}
                </span>
              </div>
            )}
          </div>

          <form onSubmit={handlePredict}>
            {/* Land Area and Scale */}
            <div className="form-section">
              <label className="section-label">
                <Maximize2 size={17} />
                <span>Field Land Area & Scale</span>
              </label>

              <div className="fields-2col">
                <div className="input-group">
                  <label htmlFor="area">Land Area Size</label>
                  <input
                    id="area"
                    name="area"
                    type="number"
                    step="0.1"
                    min="0.1"
                    placeholder="e.g. 2.5"
                    value={formData.area}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="areaUnit">Measurement Unit</label>
                  <select
                    id="areaUnit"
                    name="areaUnit"
                    value={formData.areaUnit}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="acres">Acres</option>
                    <option value="hectares">Hectares</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Soil Nutrients */}
            <div className="form-section">
              <label className="section-label">
                <Sprout size={17} />
                <span>Soil Macronutrients (Ratio / mg·kg⁻¹)</span>
              </label>

              <div className="fields-row">
                <div className="input-group">
                  <label htmlFor="n">Nitrogen (N)</label>
                  <input
                    id="n"
                    name="n"
                    type="number"
                    step="any"
                    placeholder="e.g. 90"
                    value={formData.n}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="p">Phosphorus (P)</label>
                  <input
                    id="p"
                    name="p"
                    type="number"
                    step="any"
                    placeholder="e.g. 42"
                    value={formData.p}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="k">Potassium (K)</label>
                  <input
                    id="k"
                    name="k"
                    type="number"
                    step="any"
                    placeholder="e.g. 43"
                    value={formData.k}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              {/* Dynamic Live NPK Meter */}
              <NpkMeter n={formData.n} p={formData.p} k={formData.k} />
            </div>

            {/* Environmental Conditions */}
            <div className="form-section">
              <label className="section-label">
                <Activity size={17} />
                <span>Climatic & Environmental Parameters</span>
              </label>

              <div className="fields-2col">
                <div className="input-group">
                  <label htmlFor="temperature">
                    <Thermometer size={14} /> Temperature (°C)
                  </label>
                  <input
                    id="temperature"
                    name="temperature"
                    type="number"
                    step="0.1"
                    placeholder="e.g. 21.5"
                    value={formData.temperature}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="humidity">
                    <Droplets size={14} /> Humidity (%)
                  </label>
                  <input
                    id="humidity"
                    name="humidity"
                    type="number"
                    step="0.1"
                    placeholder="e.g. 82"
                    value={formData.humidity}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="ph">
                    <Activity size={14} /> Soil pH Level (0 - 14)
                  </label>
                  <input
                    id="ph"
                    name="ph"
                    type="number"
                    step="0.1"
                    placeholder="e.g. 6.5"
                    value={formData.ph}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="rainfall">
                    <CloudRain size={14} /> Rainfall (mm)
                  </label>
                  <input
                    id="rainfall"
                    name="rainfall"
                    type="number"
                    step="0.1"
                    placeholder="e.g. 200"
                    value={formData.rainfall}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn-submit-predict"
              disabled={predictLoading}
            >
              {predictLoading ? (
                <>
                  <Loader2 size={20} className="spinner" />
                  <span>Computing Optimal Recommendation...</span>
                </>
              ) : (
                <>
                  <Sprout size={20} />
                  <span>Recommend Optimal Crop</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Result Presentation */}
        <div className="result-column">
          {predictLoading && (
            <div className="result-loading-card">
              <Loader2 size={44} className="spinner spinner-green" />
              <h3>Analyzing Soil & Weather Data</h3>
              <p>Evaluating features against 2,200 agricultural dataset points...</p>
            </div>
          )}

          {!predictLoading && result && (
            <ResultCard result={result} onSelectCrop={onSelectCrop} />
          )}

          {!predictLoading && !result && (
            <div className="result-placeholder-card">
              <div className="placeholder-icon">
                <Sprout size={50} />
              </div>
              <h3>Ready to Analyze Your Field</h3>
              <p>
                Provide soil and climate metrics on the left, or click any of the quick presets to test real-world crop conditions.
              </p>
              <div className="placeholder-tags">
                <span>Fast ML Inference</span>
                <span>NPK Balance Check</span>
                <span>Fertilizer Advisory</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
