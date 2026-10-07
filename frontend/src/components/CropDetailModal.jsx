import React, { useState } from 'react';
import { X, Sprout, FlaskConical, Thermometer, Droplets, CloudRain, Activity } from 'lucide-react';

export default function CropDetailModal({ crop, onClose }) {
  const [imgError, setImgError] = useState(false);

  if (!crop) return null;

  const fallbackImg = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600';
  const opt = crop.optimalConditions || {};

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="modal-hero">
          <img
            src={imgError ? fallbackImg : crop.image}
            alt={crop.name}
            onError={() => setImgError(true)}
            className="modal-image"
          />
          <div className="modal-title-overlay">
            <span className="modal-badge">Crop Profile</span>
            <h2>{crop.name}</h2>
          </div>
        </div>

        <div className="modal-body">
          <p className="modal-description">{crop.description}</p>

          <div className="modal-section">
            <h4>
              <FlaskConical size={18} color="#16a34a" /> Recommended Fertilizer
            </h4>
            <div className="modal-fertilizer-box">
              <strong>{crop.fertilizer}</strong>
              <p>{crop.fertilizer_reason}</p>
            </div>
          </div>

          <div className="modal-section">
            <h4>
              <Activity size={18} color="#0284c7" /> Optimal Environmental Conditions
            </h4>
            <div className="conditions-grid">
              <div className="condition-cell">
                <span className="cond-label">Nitrogen (N)</span>
                <span className="cond-val">{opt.n ?? '--'} mg/kg</span>
              </div>
              <div className="condition-cell">
                <span className="cond-label">Phosphorus (P)</span>
                <span className="cond-val">{opt.p ?? '--'} mg/kg</span>
              </div>
              <div className="condition-cell">
                <span className="cond-label">Potassium (K)</span>
                <span className="cond-val">{opt.k ?? '--'} mg/kg</span>
              </div>
              <div className="condition-cell">
                <span className="cond-label">Temperature</span>
                <span className="cond-val">{opt.temperature ?? '--'} °C</span>
              </div>
              <div className="condition-cell">
                <span className="cond-label">Humidity</span>
                <span className="cond-val">{opt.humidity ?? '--'} %</span>
              </div>
              <div className="condition-cell">
                <span className="cond-label">Soil pH</span>
                <span className="cond-val">{opt.ph ?? '--'}</span>
              </div>
              <div className="condition-cell full-width">
                <span className="cond-label">Rainfall</span>
                <span className="cond-val">{opt.rainfall ?? '--'} mm</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
