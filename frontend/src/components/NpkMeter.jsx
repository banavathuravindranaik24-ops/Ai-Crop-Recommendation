import React from 'react';

export default function NpkMeter({ n, p, k }) {
  const getNStatus = (val) => {
    if (val === '' || val === null || val === undefined) return { label: '--', class: 'neutral' };
    const num = Number(val);
    if (num < 50) return { label: 'Low (<50)', class: 'low' };
    if (num <= 250) return { label: 'Balanced (50-250)', class: 'balanced' };
    return { label: 'High (>250)', class: 'high' };
  };

  const getPStatus = (val) => {
    if (val === '' || val === null || val === undefined) return { label: '--', class: 'neutral' };
    const num = Number(val);
    if (num < 20) return { label: 'Low (<20)', class: 'low' };
    if (num <= 100) return { label: 'Balanced (20-100)', class: 'balanced' };
    return { label: 'High (>100)', class: 'high' };
  };

  const getKStatus = (val) => {
    if (val === '' || val === null || val === undefined) return { label: '--', class: 'neutral' };
    const num = Number(val);
    if (num < 100) return { label: 'Low (<100)', class: 'low' };
    if (num <= 400) return { label: 'Balanced (100-400)', class: 'balanced' };
    return { label: 'High (>400)', class: 'high' };
  };

  const nStat = getNStatus(n);
  const pStat = getPStatus(p);
  const kStat = getKStatus(k);

  return (
    <div className="npk-live-meter">
      <div className="meter-header">
        <span className="meter-title">Real-time Soil N-P-K Indicators</span>
      </div>
      <div className="meter-grid">
        <div className={`meter-item ${nStat.class}`}>
          <div className="meter-label">Nitrogen (N)</div>
          <div className="meter-val">{n !== '' ? n : '--'}</div>
          <span className="meter-badge">{nStat.label}</span>
        </div>

        <div className={`meter-item ${pStat.class}`}>
          <div className="meter-label">Phosphorus (P)</div>
          <div className="meter-val">{p !== '' ? p : '--'}</div>
          <span className="meter-badge">{pStat.label}</span>
        </div>

        <div className={`meter-item ${kStat.class}`}>
          <div className="meter-label">Potassium (K)</div>
          <div className="meter-val">{k !== '' ? k : '--'}</div>
          <span className="meter-badge">{kStat.label}</span>
        </div>
      </div>
    </div>
  );
}
