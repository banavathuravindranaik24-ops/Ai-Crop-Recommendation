import React from 'react';
import {
  Sparkles,
  Sprout,
  Check,
  ArrowRight,
  Database,
  BookOpen,
  History,
  CloudSun,
  ShieldCheck,
  Cpu
} from 'lucide-react';

export default function HomePage({ setActiveTab }) {
  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-pill">
          <Sparkles size={14} />
          <span>Machine Learning · Agriculture · Full Stack</span>
        </div>

        <h1 className="hero-title">
          Grow smarter with <span>AI insights</span>
        </h1>

        <p className="hero-description">
          Data-driven crop recommendations to help farmers and agronomists select the optimal crop
          for your soil composition, temperature, humidity, pH, and precipitation.
        </p>

        <div className="hero-actions">
          <button
            className="btn-primary"
            onClick={() => setActiveTab('recommend')}
          >
            <span>Start Recommendation</span>
            <ArrowRight size={18} />
          </button>
          <button
            className="btn-secondary"
            onClick={() => setActiveTab('catalog')}
          >
            <BookOpen size={18} />
            <span>Explore 22 Crops</span>
          </button>
        </div>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-number">22</div>
          <div className="stat-label">Crops Supported</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">98%</div>
          <div className="stat-label">Model Accuracy</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">7</div>
          <div className="stat-label">Soil & Climate Factors</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">MERN</div>
          <div className="stat-label">Modern Stack</div>
        </div>
      </div>

      <div className="tools-section">
        <div className="section-header">
          <span className="section-pill">Platform Tools</span>
          <h2>Intelligent Agronomy Features</h2>
        </div>

        <div className="cards-grid">
          {/* Card 1: Crop Recommendation */}
          <div className="tool-card feature-highlight" onClick={() => setActiveTab('recommend')}>
            <div className="card-top">
              <div className="tool-icon">
                <Sprout size={28} />
              </div>
              <span className="tool-tag">Core Engine</span>
            </div>
            <h3>Crop Recommendation</h3>
            <p>
              Input real-time soil chemistry and meteorological conditions to discover the highest-yielding crop.
            </p>
            <ul className="tool-features">
              <li>
                <Check size={16} color="#16a34a" /> Soil nutrient analysis (N, P, K)
              </li>
              <li>
                <Check size={16} color="#16a34a" /> Live city weather sync via OpenWeather
              </li>
              <li>
                <Check size={16} color="#16a34a" /> Fertilizer advisory with chemical rationale
              </li>
            </ul>
            <button className="card-action-btn">
              <span>Get Recommendation</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Card 2: Crop Catalog */}
          <div className="tool-card" onClick={() => setActiveTab('catalog')}>
            <div className="card-top">
              <div className="tool-icon icon-blue">
                <BookOpen size={28} />
              </div>
              <span className="tool-tag tag-blue">Encyclopedia</span>
            </div>
            <h3>Crop Catalog</h3>
            <p>
              Browse our agronomic database of 22 supported cereals, pulses, fruits, and cash crops with growth profiles.
            </p>
            <ul className="tool-features">
              <li>
                <Check size={16} color="#0284c7" /> Ideal N-P-K thresholds per crop
              </li>
              <li>
                <Check size={16} color="#0284c7" /> Temperature, humidity & rainfall specs
              </li>
              <li>
                <Check size={16} color="#0284c7" /> Instant search and filter by category
              </li>
            </ul>
            <button className="card-action-btn btn-blue">
              <span>View Catalog</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Card 3: Prediction History */}
          <div className="tool-card" onClick={() => setActiveTab('history')}>
            <div className="card-top">
              <div className="tool-icon icon-purple">
                <History size={28} />
              </div>
              <span className="tool-tag tag-purple">MongoDB Powered</span>
            </div>
            <h3>Prediction History</h3>
            <p>
              Review previous field recommendations, compare input parameters, and track soil evolution over time.
            </p>
            <ul className="tool-features">
              <li>
                <Check size={16} color="#9333ea" /> Persisted to MongoDB database
              </li>
              <li>
                <Check size={16} color="#9333ea" /> Full parameter audit trail
              </li>
              <li>
                <Check size={16} color="#9333ea" /> Timestamped field records
              </li>
            </ul>
            <button className="card-action-btn btn-purple">
              <span>Review History</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <footer className="home-footer">
        <p>Results are advisory only — consult local agricultural extension services for critical planting decisions.</p>
      </footer>
    </div>
  );
}
