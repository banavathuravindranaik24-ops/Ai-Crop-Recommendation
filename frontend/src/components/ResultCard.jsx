import React, { useState } from 'react';
import { Sprout, CheckCircle2, FlaskConical, Award, HelpCircle, Layers, ArrowRight } from 'lucide-react';

export default function ResultCard({ result, onSelectCrop }) {
  const [imgError, setImgError] = useState(false);

  if (!result) return null;

  const fallbackImg = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600';

  const formatStatusClass = (status) => {
    if (!status) return 'status-balanced';
    const s = status.toLowerCase();
    if (s.includes('low')) return 'status-low';
    if (s.includes('high')) return 'status-high';
    return 'status-balanced';
  };

  return (
    <div className="result-card-container">
      <div className="result-header">
        <div className="badge-pill">
          <Award size={15} />
          <span>Optimal Match</span>
        </div>
        {result.confidence && (
          <div className="confidence-pill">
            <span>{result.confidence}% Match Confidence</span>
          </div>
        )}
      </div>

      <div className="result-crop-title">
        <Sprout size={28} className="crop-leaf-icon" />
        <h2>{result.crop?.toUpperCase()}</h2>
      </div>

      <div className="result-image-wrapper">
        <img
          src={imgError ? fallbackImg : result.image}
          alt={result.crop}
          onError={() => setImgError(true)}
          className="crop-image"
        />
      </div>

      <p className="crop-description">{result.description}</p>

      <div className="soil-status-card">
        <div className="section-subtitle">
          <Layers size={16} />
          <span>Nutrient Analysis (NPK)</span>
        </div>
        <div className="soil-tags">
          <div className={`soil-tag ${formatStatusClass(result.n_status)}`}>
            <strong>N (Nitrogen):</strong> {result.n_status}
          </div>
          <div className={`soil-tag ${formatStatusClass(result.p_status)}`}>
            <strong>P (Phosphorus):</strong> {result.p_status}
          </div>
          <div className={`soil-tag ${formatStatusClass(result.k_status)}`}>
            <strong>K (Potassium):</strong> {result.k_status}
          </div>
        </div>
      </div>

      <div className="fertilizer-card">
        <div className="fertilizer-header">
          <FlaskConical size={20} className="fert-icon" />
          <div>
            <span className="fertilizer-label">Recommended Fertilizer</span>
            <h4 className="fertilizer-name">{result.fertilizer}</h4>
          </div>
        </div>
        <p className="fertilizer-reason">{result.fertilizer_reason}</p>
      </div>

      {result.alternatives && result.alternatives.length > 0 && (
        <div className="alternatives-section">
          <span className="alt-title">Alternative Viable Crops:</span>
          <div className="alt-chips">
            {result.alternatives.map((alt, idx) => (
              <span
                key={idx}
                className="alt-chip"
                onClick={() => onSelectCrop && onSelectCrop(alt.crop)}
              >
                {alt.crop} ({alt.confidence}%)
              </span>
            ))}
          </div>
        </div>
      )}

      {onSelectCrop && (
        <button
          className="view-catalog-btn"
          onClick={() => onSelectCrop(result.crop)}
        >
          <span>View {result.crop} in Catalog</span>
          <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
}
