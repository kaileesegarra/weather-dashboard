// OpenWeather API Key
const apiKey = 'a892f352031dadbaf8419dcd15db947d';

// Selectors
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentWeather = document.getElementById('current-weather');
const forecast = document.getElementById('forecast');
const searchHistory = document.getElementById('search-history');

// Event listener for form submission
searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
        addToSearchHistory(city);
        cityInput.value = '';
    }
});

// Get weather data
function getWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => displayCurrentWeather(data))
        .catch(error => console.error('Error fetching current weather:', error));
    
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => displayForecast(data))
        .catch(error => console.error('Error fetching forecast:', error));
}

// Display current weather
function displayCurrentWeather(data) {
    currentWeather.innerHTML = `
        <div class="weather-card">
            <h2>${data.name} (${new Date().toLocaleDateString()})</h2>
            <p><img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="${data.weather[0].description}"> ${data.weather[0].description}</p>
            <p>Temperature: ${data.main.temp} °C</p>
            <p>Humidity: ${data.main.humidity} %</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
        </div>
    `;
}

// Display 5-day forecast
function displayForecast(data) {
    forecast.innerHTML = '<h2>5-Day Forecast:</h2>';
    for (let i = 0; i < data.list.length; i += 8) {
        const day = data.list[i];
        forecast.innerHTML += `
            <div class="weather-card">
                <h3>${new Date(day.dt_txt).toLocaleDateString()}</h3>
                <p><img src="http://openweathermap.org/img/w/${day.weather[0].icon}.png" alt="${day.weather[0].description}"> ${day.weather[0].description}</p>
                <p>Temperature: ${day.main.temp} °C</p>
                <p>Wind Speed: ${day.wind.speed} m/s</p>
                <p>Humidity: ${day.main.humidity} %</p>
            </div>
        `;
    }
}

// Add city to search history
function addToSearchHistory(city) {
    const historyItem = document.createElement('button');
    historyItem.textContent = city;
    historyItem.addEventListener('click', function () {
        getWeather(city);
    });
    searchHistory.appendChild(historyItem);
    saveToLocalStorage(city);
}

// Save search history to localStorage
function saveToLocalStorage(city) {
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(history));
    }
}

// Load search history from localStorage
function loadSearchHistory() {
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    history.forEach(city => addToSearchHistory(city));
}

// Initialize
loadSearchHistory();
