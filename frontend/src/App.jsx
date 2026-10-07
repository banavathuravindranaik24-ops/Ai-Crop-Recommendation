import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import RecommendPage from './pages/RecommendPage';
import CatalogPage from './pages/CatalogPage';
import HistoryPage from './pages/HistoryPage';
import { checkHealth } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [health, setHealth] = useState(null);
  const [selectedCropForCatalog, setSelectedCropForCatalog] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      const data = await checkHealth();
      setHealth(data);
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectCrop = (cropName) => {
    setSelectedCropForCatalog(cropName);
    setActiveTab('catalog');
  };

  return (
    <div className="app-layout">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        health={health}
      />

      <main className="main-content">
        {activeTab === 'home' && (
          <HomePage setActiveTab={setActiveTab} />
        )}

        {activeTab === 'recommend' && (
          <RecommendPage onSelectCrop={handleSelectCrop} />
        )}

        {activeTab === 'catalog' && (
          <CatalogPage
            selectedCropName={selectedCropForCatalog}
            clearSelectedCrop={() => setSelectedCropForCatalog(null)}
          />
        )}

        {activeTab === 'history' && (
          <HistoryPage onSelectCrop={handleSelectCrop} />
        )}
      </main>
    </div>
  );
}
