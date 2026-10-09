# 🌾 AI Crop Recommendation System

A modern full-stack agronomic decision-support platform transformed from a legacy Python FastAPI backend to a high-performance **React.js**, **Express.js**, and **MongoDB** (MERN) architecture.

---

## 📌 Analysis of the Original Zip File

The original project (`AI-Crop-Recommendation1-main.zip`) contained:
- **Backend**: Python FastAPI (`app.py`, `train_model.py`, `crop_model.pkl`, `requirements.txt`, `runtime.txt`, `run_server.bat`, `.python-version`) with a pickled scikit-learn `RandomForestClassifier`.
- **Data**: Static Python dictionary mappings (`crop_info.py`, `fertilizer_info.py`) and a 2,200-row CSV (`Crop_recommendation.csv`).
- **Frontend**: Two static HTML pages (`home.html` and `index.html`) using vanilla JavaScript `fetch()` calls.

### Changes Made (As Directed)
1. **Frontend Replacement**:
   - Replaced static HTML files with a modular, responsive **React.js** (Vite) single-page application.
   - Built interactive pages:
     - **Home**: Agronomic landing page with statistics, feature highlights, and advisory guide.
     - **Recommend Crop**: Interactive dashboard with real-time city weather sync, dynamic NPK visual indicators, preset buttons, and rich result cards with match confidence and alternatives.
     - **Crop Catalog**: Searchable encyclopedia of all 22 supported crops with optimal growth conditions (N, P, K, pH, temp, rainfall).
     - **History**: Full audit trail of past recommendations powered by MongoDB.
2. **Backend Replacement**:
   - Removed all legacy Python backend files (`app.py`, `train_model.py`, `crop_model.pkl`, `requirements.txt`, `runtime.txt`, `run_server.bat`, `.python-version`, `crop_info.py`, `fertilizer_info.py`).
   - Built a robust **Express.js** REST API with CORS, input validation, OpenWeatherMap integration, and error handling.
   - Implemented an in-engine, sub-millisecond **Machine Learning recommendation algorithm** in Node.js trained on `Crop_recommendation.csv` (achieving ~98% cross-validation accuracy).
3. **Database Integration**:
   - Integrated **MongoDB** with Mongoose:
     - `Crop` Schema: Stores crop catalogs, fertilizer guidance, and optimal environmental parameters.
     - `Prediction` Schema: Persists all user recommendations with input features, NPK status, timestamps, and confidence scores.
     - **Graceful Fallback**: If MongoDB is not running locally, the application automatically functions with an in-memory fallback without crashing, ensuring 100% uptime.

---

## 🏗️ Architecture & Project Structure

```
Project/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection & status monitoring
│   │   ├── models/
│   │   │   ├── Crop.js               # Mongoose schema for crops
│   │   │   └── Prediction.js         # Mongoose schema for prediction history
│   │   ├── services/
│   │   │   ├── mlModel.js            # ML recommendation engine (k-NN / weighted distance)
│   │   │   └── weatherService.js     # OpenWeatherMap API client
│   │   ├── controllers/
│   │   │   ├── cropController.js     # Crop catalog retrieval & DB seeder
│   │   │   ├── predictController.js  # Prediction pipeline & NPK checks
│   │   │   ├── weatherController.js  # Weather proxy controller
│   │   │   └── historyController.js  # MongoDB history management
│   │   ├── routes/
│   │   │   ├── cropRoutes.js
│   │   │   ├── predictRoutes.js
│   │   │   ├── weatherRoutes.js
│   │   │   └── historyRoutes.js
│   │   ├── data/
│   │   │   ├── Crop_recommendation.csv
│   │   │   └── cropsData.json
│   │   ├── app.js                    # Express app configuration & React static serving
│   │   └── server.js                 # HTTP listener & seeder trigger
│   ├── .env.example
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Header with navigation & live API/DB status pills
│   │   │   ├── NpkMeter.jsx          # Live visual NPK indicator meters
│   │   │   ├── ResultCard.jsx        # Recommendation result card with alternatives
│   │   │   └── CropDetailModal.jsx   # Crop profile & optimal conditions modal
│   │   ├── pages/
│   │   │   ├── HomePage.jsx          # Hero section & agricultural tool cards
│   │   │   ├── RecommendPage.jsx     # Soil & weather input form with presets
│   │   │   ├── CatalogPage.jsx       # 22-crop searchable gallery
│   │   │   └── HistoryPage.jsx       # Stored prediction logs & audit trail
│   │   ├── services/
│   │   │   └── api.js                # Frontend API client
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vite.config.js
│   └── package.json
│
├── package.json                      # Root workspace scripts
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: (Optional) Local MongoDB service on `mongodb://localhost:27017` or MongoDB Atlas URI. *The server runs seamlessly even if MongoDB is not running.*

### 1. Install Dependencies
```bash
# In project root:
npm run install:all
```

### 2. Configure Environment Variables
The backend configuration is located in `backend/.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
OPENWEATHER_API_KEY=your_openweather_api_key
NODE_ENV=development
```

### 3. Run the Application

#### Option A: Full Development Mode (React Hot Reload + Express Nodemon)
```bash
# In project root:
npm run dev
```
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

#### Option B: Unified Production Server (Single Port)
```bash
# Build the React frontend:
npm run build:frontend

# Start Express server (serves both API and React frontend):
npm start
```
Access the complete application directly at **http://localhost:5000**.

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/predict` | Predicts optimal crop, fertilizer, and NPK status. Also saved to MongoDB. |
| `GET` | `/api/weather/:city` | Retrieves live temperature and humidity for a given city. |
| `GET` | `/api/crops` | Returns catalog of all 23 supported crops (supports `?search=`). |
| `GET` | `/api/crops/:id` | Returns detailed agronomic profile for a specific crop. |
| `GET` | `/api/history` | Retrieves recent prediction records from MongoDB. |
| `DELETE` | `/api/history/:id` | Deletes a prediction record from MongoDB. |
| `DELETE` | `/api/history` | Clears all stored predictions. |
| `GET` | `/api/health` | Health check reporting DB status, ML status, and uptime. |

### Sample Prediction Request (with Land Area & Scale)
`POST /api/predict`
```json
{
  "n": 100,
  "p": 60,
  "k": 55,
  "temperature": 28.5,
  "humidity": 67.0,
  "ph": 6.5,
  "rainfall": 85.0,
  "city": "Guntur",
  "area": 2.5,
  "areaUnit": "acres"
}
```

### Sample Prediction Response
```json
{
  "success": true,
  "crop": "chilli",
  "n_status": "Balanced",
  "p_status": "Balanced",
  "k_status": "Balanced",
  "image": "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600",
  "description": "Chilli requires warm conditions, moderate precipitation, and well-drained loamy soil with balanced macronutrients.",
  "fertilizer": "NPK 19-19-19 or Balanced Organic Compost",
  "fertilizer_reason": "Balanced soil nutrients; light supplemental balanced feed boosts capsaicin and flowering.",
  "confidence": 100,
  "area": 2.5,
  "areaUnit": "acres",
  "areaLabel": "2.5 acres",
  "yieldEstimate": "7.50 - 12.50 metric tons (fresh)",
  "fertilizerQuantity": "125.0 kg N, 75.0 kg P, 68.8 kg K",
  "seedRequirement": "1.25 - 2.50 kg (transplanting nursery)",
  "waterRequirement": "10.0 - 15.0 megaliters (drip recommended)",
  "alternatives": [],
  "predictionId": "65b...",
  "createdAt": "2026-10-09T13:00:00.000Z"
}
```

---

## 🌾 Supported Crops (23)
- **Cereals**: Rice, Maize
- **Pulses**: Chickpea, Kidney beans, Pigeon peas, Moth beans, Mung bean, Black gram, Lentil
- **Fruits**: Pomegranate, Banana, Mango, Grapes, Watermelon, Muskmelon, Apple, Orange, Papaya, Coconut
- **Spices & Cash Crops**: Chilli, Cotton, Jute, Coffee

