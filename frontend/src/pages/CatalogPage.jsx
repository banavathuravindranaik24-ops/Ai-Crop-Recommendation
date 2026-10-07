import React, { useState, useEffect } from 'react';
import { Search, Sprout, FlaskConical, Loader2, ArrowUpRight } from 'lucide-react';
import { fetchCrops } from '../services/api';
import CropDetailModal from '../components/CropDetailModal';

export default function CatalogPage({ selectedCropName, clearSelectedCrop }) {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeModalCrop, setActiveModalCrop] = useState(null);

  useEffect(() => {
    loadCrops();
  }, []);

  useEffect(() => {
    if (selectedCropName && crops.length > 0) {
      const match = crops.find(
        (c) => c.crop.toLowerCase() === selectedCropName.toLowerCase() || c.name.toLowerCase() === selectedCropName.toLowerCase()
      );
      if (match) {
        setActiveModalCrop(match);
      }
    }
  }, [selectedCropName, crops]);

  const loadCrops = async () => {
    setLoading(true);
    try {
      const res = await fetchCrops();
      if (res.data) {
        setCrops(res.data);
      }
    } catch (err) {
      console.error('Failed to load crops catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCrops = crops.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.fertilizer.toLowerCase().includes(q)
    );
  });

  return (
    <div className="catalog-page">
      <div className="catalog-header">
        <div className="catalog-header-text">
          <h1>🌱 Agricultural Crop Catalog</h1>
          <p>
            Explore optimal growth parameters, recommended fertilizers, and climatic profiles for all 22 supported crops.
          </p>
        </div>

        <div className="catalog-search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search crops, fertilizers, soils..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {loading ? (
        <div className="catalog-loading">
          <Loader2 size={36} className="spinner" />
          <p>Loading crop encyclopedia...</p>
        </div>
      ) : filteredCrops.length === 0 ? (
        <div className="catalog-empty">
          <Sprout size={48} />
          <h3>No crops match your search</h3>
          <p>Try searching for rice, maize, coffee, DAP, or urea.</p>
        </div>
      ) : (
        <div className="catalog-grid">
          {filteredCrops.map((crop) => (
            <div
              key={crop.id}
              className="catalog-card"
              onClick={() => setActiveModalCrop(crop)}
            >
              <div className="catalog-img-wrap">
                <img
                  src={crop.image}
                  alt={crop.name}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src =
                      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600';
                  }}
                />
                <span className="catalog-fert-tag">
                  <FlaskConical size={12} />
                  <span>{crop.fertilizer}</span>
                </span>
              </div>

              <div className="catalog-card-body">
                <div className="catalog-card-title">
                  <h3>{crop.name}</h3>
                  <ArrowUpRight size={18} className="open-icon" />
                </div>
                <p className="catalog-card-desc">{crop.description}</p>
                <div className="catalog-quick-specs">
                  {crop.optimalConditions && (
                    <>
                      <span>🌡 {crop.optimalConditions.temperature}°C</span>
                      <span>💧 {crop.optimalConditions.rainfall}mm</span>
                      <span>pH {crop.optimalConditions.ph}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeModalCrop && (
        <CropDetailModal
          crop={activeModalCrop}
          onClose={() => {
            setActiveModalCrop(null);
            if (clearSelectedCrop) clearSelectedCrop();
          }}
        />
      )}
    </div>
  );
}
