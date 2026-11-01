import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '') : '';
const API_BASE = `${BASE_URL}/api`;

export const checkHealth = async () => {
  try {
    const res = await axios.get(`${API_BASE}/health`);
    return res.data;
  } catch (err) {
    return { status: 'offline', error: err.message };
  }
};

export const fetchWeather = async (city) => {
  const res = await axios.get(`${API_BASE}/weather/${encodeURIComponent(city)}`);
  return res.data;
};

export const predictCrop = async (params) => {
  const res = await axios.post(`${API_BASE}/predict`, params);
  return res.data;
};

export const fetchCrops = async (search = '') => {
  const url = search ? `${API_BASE}/crops?search=${encodeURIComponent(search)}` : `${API_BASE}/crops`;
  const res = await axios.get(url);
  return res.data;
};

export const fetchCropById = async (id) => {
  const res = await axios.get(`${API_BASE}/crops/${id}`);
  return res.data;
};

export const fetchHistory = async () => {
  const res = await axios.get(`${API_BASE}/history`);
  return res.data;
};

export const deleteHistoryItem = async (id) => {
  const res = await axios.delete(`${API_BASE}/history/${id}`);
  return res.data;
};

export const clearAllHistory = async () => {
  const res = await axios.delete(`${API_BASE}/history`);
  return res.data;
};
