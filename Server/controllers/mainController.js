/**
 * Main Controller - Handles client requests related to weather data
 */

const { fetchWeatherData, fetchWeatherDataByZip } = require('../models/APIData');

/* Fetch All Weather Data */

/**
 * Retrieves all available weather data
 */
exports.getAllData = async function (req, res) {
    try {
        const weatherData = await fetchWeatherData(); // Fetch live weather data
        res.status(200).json(weatherData);
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        res.status(500).json({ message: 'Failed to fetch weather data', error: error.message });
    }
};


/* Fetch Weather Data by ZIP Code */

/**
 * Retrieves weather data for a specific ZIP code
 */
exports.getDataByZip = async function (req, res) {
    try {
        const { id: zipCode } = req.params; // Extract the ZIP code from the URL parameter

        // Fetch weather data for the specified ZIP code
        const weatherData = await fetchWeatherDataByZip(zipCode);

        if (!weatherData) {
            return res.status(404).json({ message: 'No weather data found for this ZIP code' });
        }

        res.status(200).json(weatherData);
    } catch (error) {
        console.error('Error fetching weather data by ZIP code:', error.message);
        res.status(500).json({ message: 'Failed to fetch weather data', error: error.message });
    }
};




