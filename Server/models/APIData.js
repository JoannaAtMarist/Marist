/**
 * APIData Model - Handles fetching weather data from Visual Crossing API
 */

const https = require('https');

/* API Configuration */

// Define the API base URL and key (Key removed for public repo)
const API_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';
const API_KEY = 'x';


/* Fetch General Weather Data */

/**
 * Fetches weather data for the default ZIP code (12601 - Violet Ave, Poughkeepsie)
 */
function fetchWeatherData() {
    return new Promise((resolve, reject) => {

        // Construct the full URL with query parameters
        const url = `${API_URL}/12601/next2days?key=${API_KEY}&include=next3days&elements=conditions,description,temp,tempmax,tempmin,feelslike,sunrise,sunset,moonphase`;

        // Make the HTTPS request
        https.get(url, (response) => {
            let data = '';

            // Accumulate data chunks
            response.on('data', (chunk) => {
                data += chunk;
            });

            // Process response when it ends
            response.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve(jsonData);
                } catch (error) {
                    reject(new Error('Failed to parse JSON response'));
                }
            });
        }).on('error', (error) => {
            reject(new Error(`HTTPS request failed: ${error.message}`));
        });
    });
}


/* Fetch Weather Data by ZIP Code */

/**
 * Fetches weather data for a specific ZIP code
 * @param {string} zipCode - The ZIP code to retrieve weather data for
 */
function fetchWeatherDataByZip(zipCode) {
    return new Promise((resolve, reject) => {

        // Construct the URL for the specified ZIP code
        const url = `${API_URL}/${zipCode}/next2days?key=${API_KEY}&include=next3days&elements=conditions,description,temp,tempmax,tempmin,feelslike,sunrise,sunset,moonphase`;

        // Make the HTTPS request
        https.get(url, (response) => {
            let data = '';

            // Accumulate data chunks
            response.on('data', (chunk) => {
                data += chunk;
            });

            // Process response when it ends
            response.on('end', () => {
                try {
                    console.log('Raw API response:', data); // Debug log before parsing
                    const jsonData = JSON.parse(data);
                    console.log('Parsed JSON data:', jsonData); // Debug log after parsing
                    resolve(jsonData);
                } catch (error) {
                    reject(new Error('Failed to parse JSON response'));
                }
            });
        }).on('error', (error) => {
            reject(new Error(`HTTPS request failed: ${error.message}`));
        });
    });
}


/* Export Functions */
module.exports = {
    fetchWeatherData,
    fetchWeatherDataByZip
};
