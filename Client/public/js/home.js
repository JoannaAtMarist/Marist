/* Home page script */
// using DOM loader, may not have worked without it


document.addEventListener('DOMContentLoaded', () => { // makes sure the page is loaded

    /* DOM Elements */
    const zipForm = document.getElementById('zipForm');
    const zipInput = document.getElementById('zipInput');
    const weatherByZip = document.getElementById('weatherByZip');
    const allWeatherData = document.getElementById('allWeatherData');

    /* Fetch & Display All Weather Data */
    async function fetchAllData() {
        try {
            console.log('Fetching session status...');

            // Check if user is logged in & get their preferred ZIP code
            const sessionResponse = await fetch('/api/session/status');
            const sessionStatus = await sessionResponse.json();

            let zipCode = '12601'; // default ZIP code: Violet Ave, Poughkeepsie
            if (sessionStatus.loggedIn && sessionStatus.user.zipCodePref) {
                zipCode = sessionStatus.user.zipCodePref; // if user logged in, use their preferred zip code
            }

            // Zip Code data fetch
            console.log(`Fetching weather data for ZIP Code: ${zipCode}...`); 
            const weatherResponse = await fetch(`/api/data/${zipCode}`);
            if (!weatherResponse.ok) {
                throw new Error('Failed to fetch weather data.');
            }

            allWeatherData.innerHTML = ""; // clear the box

            const weatherData = await weatherResponse.json();

            // Update weather display
            allWeatherData.innerHTML = `<h1>Weather for Your Area (ZIP Code: ${zipCode}):</h1>`;
            const dayHeaders = ["Today", "Tomorrow", "Day After Tomorrow"];

            weatherData.days.forEach((day, index) => {
                const header = dayHeaders[index] || `Day ${index + 1}`;
                const moonPhaseDescription = getMoonPhaseDescription(day.moonphase);
                allWeatherData.innerHTML += `
                    <h3>${header}</h3>
                    <p>Conditions: ${day.conditions}</p>
                    <p>Description: ${day.description}</p>
                    <p>Temp: ${day.temp}</p>
                    <p>High: ${day.tempmax}, Low: ${day.tempmin}</p>
                    <p>Sunrise: ${day.sunrise}, Sunset: ${day.sunset}</p>
                    <p>Moonphase: ${moonPhaseDescription}</p>
                    <hr>`;
            });

            console.log('All weather data updated successfully.'); // successful update?
        } catch (error) {
            console.error('Error fetching all weather data:', error);
            allWeatherData.innerHTML = '<p>Error fetching all weather data.</p>';
        }
    }

    // Fetch all weather data on page load
    fetchAllData();

    console.log('Weather data auto-refresh enabled.');

    // Refresh weather data every 5 minutes
    setInterval(() => {
        console.log('Auto-refreshing weather data...');
        fetchAllData();
    }, 300000);


    // Fetch & Display Weather Data by ZIP Code
    zipForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        const zipCode = zipInput.value.trim();

        // check the zip code entered
        if (!zipCode) {
            weatherByZip.innerHTML = '<p>Please enter a valid ZIP code.</p>';
            return;
        }

        try {
            console.log(`Fetching weather data for ZIP Code: ${zipCode}...`);
            const response = await fetch(`/api/data/${zipCode}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch weather data for ZIP Code ${zipCode}`);
            }

            const data = await response.json();
            console.log('Fetched weather data:', data); // what is happening?

            weatherByZip.innerHTML = `
                    <h3>Weather for ZIP Code ${zipCode}:</h3>
                    <p>Conditions: ${data.days[0].conditions}</p>
                    <p>Description: ${data.days[0].description}</p>
                    <p>Temp: ${data.days[0].temp}</p>
                    <p>High: ${data.days[0].tempmax}, Low: ${data.days[0].tempmin}</p>
                    <p>Sunrise: ${data.days[0].sunrise}, Sunset: ${data.days[0].sunset}</p>`;
        } catch (error) {
            console.error('Error fetching weather data by ZIP code:', error);
            weatherByZip.innerHTML = '<p>Error fetching weather data by ZIP code.</p>';
        }
    });
});

/* Moon Phase Helper Function */
function getMoonPhaseDescription(moonPhase) {
    if (moonPhase === 0 || moonPhase === 1) return "New Moon";
    if (moonPhase > 0 && moonPhase < 0.25) return "Waxing Crescent";
    if (moonPhase === 0.25) return "First Quarter";
    if (moonPhase > 0.25 && moonPhase < 0.5) return "Waxing Gibbous";
    if (moonPhase === 0.5) return "Full Moon";
    if (moonPhase > 0.5 && moonPhase < 0.75) return "Waning Gibbous";
    if (moonPhase === 0.75) return "Last Quarter";
    if (moonPhase > 0.75 && moonPhase < 1) return "Waning Crescent";
    return "Unknown Phase... Is something wrong with the moon?!";
}