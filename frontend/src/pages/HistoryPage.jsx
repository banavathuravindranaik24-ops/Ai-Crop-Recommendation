import React, { useState, useEffect } from 'react';
import { History, Trash2, Sprout, Loader2, Database, Calendar, MapPin, FlaskConical } from 'lucide-react';
import { fetchHistory, deleteHistoryItem, clearAllHistory } from '../services/api';

export default function HistoryPage({ onSelectCrop }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const res = await fetchHistory();
      if (res.data) {
        setHistory(res.data);
      }
    } catch (err) {
      console.error('Failed to load prediction history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteHistoryItem(id);
      setHistory((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear all prediction history?')) {
      return;
    }
    setClearing(true);
    try {
      await clearAllHistory();
      setHistory([]);
    } catch (err) {
      console.error('Failed to clear history:', err);
    } finally {
      setClearing(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recent';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="history-page">
      <div className="history-header">
        <div>
          <h1>
            <History size={26} /> Prediction Records & Audit Trail
          </h1>
          <p>
            Review previous soil analyses and recommendations stored in the database.
          </p>
        </div>

        {history.length > 0 && (
          <button
            className="btn-clear-history"
            onClick={handleClearAll}
            disabled={clearing}
          >
            <Trash2 size={16} />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="history-loading">
          <Loader2 size={36} className="spinner" />
          <p>Loading prediction logs...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="history-empty-card">
          <Database size={48} />
          <h3>No Predictions Recorded Yet</h3>
          <p>Go to the "Recommend Crop" tab and submit your field parameters to generate and save recommendations.</p>
        </div>
      ) : (
        <div className="history-list">
          {history.map((item) => (
            <div key={item._id} className="history-card">
              <div className="history-card-header">
                <div className="history-crop-badge" onClick={() => onSelectCrop && onSelectCrop(item.crop)}>
                  <Sprout size={18} />
                  <strong>{item.crop?.toUpperCase()}</strong>
                </div>

                <div className="history-meta">
                  {item.city && (
                    <span className="meta-tag">
                      <MapPin size={13} /> {item.city}
                    </span>
                  )}
                  <span className="meta-tag">
                    <Calendar size={13} /> {formatDate(item.createdAt)}
                  </span>
                  <button
                    className="history-del-btn"
                    onClick={() => handleDelete(item._id)}
                    title="Delete this record"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div className="history-details-grid">
                <div className="h-spec">
                  <span className="h-spec-label">N-P-K Values</span>
                  <span className="h-spec-val">
                    N: {item.n} | P: {item.p} | K: {item.k}
                  </span>
                </div>
                <div className="h-spec">
                  <span className="h-spec-label">NPK Status</span>
                  <span className="h-spec-val">
                    N:{item.n_status} | P:{item.p_status} | K:{item.k_status}
                  </span>
                </div>
                <div className="h-spec">
                  <span className="h-spec-label">Climate</span>
                  <span className="h-spec-val">
                    {item.temperature}°C · {item.humidity}% hum
                  </span>
                </div>
                <div className="h-spec">
                  <span className="h-spec-label">pH & Rain</span>
                  <span className="h-spec-val">
                    pH {item.ph} · {item.rainfall}mm
                  </span>
                </div>
              </div>

              {item.fertilizer && (
                <div className="history-fert-row">
                  <FlaskConical size={14} color="#16a34a" />
                  <span>
                    <strong>Fertilizer:</strong> {item.fertilizer} — {item.fertilizer_reason}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
