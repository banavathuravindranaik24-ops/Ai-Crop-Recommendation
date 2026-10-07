const { fetchCityWeather } = require('../services/weatherService');

const getWeather = async (req, res) => {
  try {
    const { city } = req.params;
    if (!city) {
      return res.status(400).json({ error: 'City is required' });
    }

    const weatherData = await fetchCityWeather(city);
    // Include both original fields and enhanced fields
    res.json({
      success: true,
      temperature: weatherData.temperature,
      humidity: weatherData.humidity,
      city: weatherData.city,
      country: weatherData.country,
      description: weatherData.description,
      icon: weatherData.icon
    });
  } catch (err) {
    res.status(404).json({
      error: err.message || 'City not found',
      message: err.message
    });
  }
};

module.exports = { getWeather };
