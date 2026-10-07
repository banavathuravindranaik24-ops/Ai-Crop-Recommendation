import React from 'react';
import { Sprout, Sparkles, Database, BookOpen, History, Home, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, health }) {
  const isDbConnected = health?.database?.connected;
  const isServerOnline = health?.status === 'ok';

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand" onClick={() => setActiveTab('home')}>
          <div className="brand-icon">
            <Sprout size={24} color="#15803d" />
          </div>
          <div className="brand-text">
            <span className="brand-title">Smart Crop AI</span>
            <span className="brand-sub">React · Express · MongoDB</span>
          </div>
        </div>

        <div className="nav-links">
          <button
            className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <Home size={17} />
            <span>Home</span>
          </button>
          <button
            className={`nav-link ${activeTab === 'recommend' ? 'active' : ''}`}
            onClick={() => setActiveTab('recommend')}
          >
            <Sparkles size={17} />
            <span>Recommend Crop</span>
          </button>
          <button
            className={`nav-link ${activeTab === 'catalog' ? 'active' : ''}`}
            onClick={() => setActiveTab('catalog')}
          >
            <BookOpen size={17} />
            <span>Crop Catalog</span>
          </button>
          <button
            className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <History size={17} />
            <span>History</span>
          </button>
        </div>

        <div className="nav-status">
          <div
            className={`status-pill ${isServerOnline ? 'pill-online' : 'pill-offline'}`}
            title={isServerOnline ? 'Express backend connected' : 'Backend offline'}
          >
            <span className="status-dot"></span>
            <span>API {isServerOnline ? 'Online' : 'Offline'}</span>
          </div>

          <div
            className={`status-pill ${isDbConnected ? 'pill-db-online' : 'pill-db-fallback'}`}
            title={
              isDbConnected
                ? 'MongoDB connected and active'
                : 'MongoDB offline (in-memory mode active)'
            }
          >
            <Database size={13} />
            <span>{isDbConnected ? 'MongoDB' : 'Memory Cache'}</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
