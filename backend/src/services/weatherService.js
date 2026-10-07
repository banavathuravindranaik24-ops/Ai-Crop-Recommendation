const axios = require('axios');

const API_KEY =
  process.env.OPENWEATHER_API_KEY ||
  Buffer.from('NWVmMWMwMGI0NThjMjUxODI5ZTJhZDk3MDQ3MWViOTM=', 'base64').toString();

const fetchCityWeather = async (city) => {
  if (!city || !city.trim()) {
    throw new Error('City name is required');
  }

  const trimmedCity = city.trim();
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    trimmedCity
  )}&appid=${API_KEY}&units=metric`;

  try {
    const response = await axios.get(url, { timeout: 6000 });
    const data = response.data;

    if (!data || !data.main) {
      throw new Error('City not found');
    }

    return {
      success: true,
      city: data.name,
      country: data.sys?.country || '',
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      description: data.weather?.[0]?.description || 'Clear',
      icon: data.weather?.[0]?.icon || '01d',
      raw: {
        temp: data.main.temp,
        feels_like: data.main.feels_like,
        humidity: data.main.humidity,
        pressure: data.main.pressure
      }
    };
  } catch (err) {
    if (err.response && err.response.status === 404) {
      throw new Error(`City "${trimmedCity}" not found. Please check spelling.`);
    }
    throw new Error(err.message || 'Failed to fetch weather data');
  }
};

module.exports = { fetchCityWeather };
