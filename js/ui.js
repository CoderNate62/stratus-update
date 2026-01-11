/**
 * UI rendering and DOM manipulation
 * Coded by Nate
 */

import { State } from './state.js';
import { formatTemp, formatDate, formatDay, formatWind, highlightMatch, getIconUrl } from './utils.js';

// DOM element references
export const elements = {};

/**
 * Initialize DOM element references
 */
export function init() {
    elements.searchInput = document.getElementById('search-input');
    elements.clearSearch = document.getElementById('clear-search');
    elements.autocomplete = document.getElementById('autocomplete-list');
    elements.locationBtn = document.getElementById('location-btn');
    elements.unitF = document.getElementById('unit-f');
    elements.unitC = document.getElementById('unit-c');
    elements.themeToggle = document.getElementById('theme-toggle');
    elements.errorContainer = document.getElementById('error-container');
    elements.errorText = document.getElementById('error-text');
    elements.errorRetry = document.getElementById('error-retry');
    elements.weatherAlerts = document.getElementById('weather-alerts');
    elements.alertText = document.getElementById('alert-text');
    elements.dismissAlert = document.getElementById('dismiss-alert');
    elements.setupInstructions = document.getElementById('setup-instructions');
    elements.appContent = document.getElementById('app-content');
    elements.loadingSkeleton = document.getElementById('loading-skeleton');
    elements.weatherContent = document.getElementById('weather-content');
    elements.forecastContent = document.getElementById('forecast-content');
    elements.cityName = document.getElementById('city-name');
    elements.currentDate = document.getElementById('current-date');
    elements.currentTemp = document.getElementById('current-temp');
    elements.tempUnit = document.getElementById('temp-unit');
    elements.weatherIcon = document.getElementById('weather-icon');
    elements.weatherAnimation = document.getElementById('weather-animation');
    elements.conditionText = document.getElementById('condition-text');
    elements.feelsLike = document.getElementById('feels-like');
    elements.tempHigh = document.getElementById('temp-high');
    elements.tempLow = document.getElementById('temp-low');
    elements.humidity = document.getElementById('humidity');
    elements.wind = document.getElementById('wind');
    elements.precipitation = document.getElementById('precipitation');
    elements.forecastCards = document.getElementById('forecast-cards');
    elements.recentSearches = document.getElementById('recent-searches');
    elements.recentChips = document.getElementById('recent-chips');
    elements.clearRecent = document.getElementById('clear-recent');
    elements.lastUpdated = document.getElementById('last-updated');

    // Initialize theme from localStorage
    initTheme();
}

/**
 * Initialize theme from localStorage
 */
function initTheme() {
    const savedTheme = localStorage.getItem('stratus_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

/**
 * Toggle between dark and light theme
 */
export function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('stratus_theme', newTheme);
    updateThemeIcon(newTheme);
}

/**
 * Update theme toggle icon
 */
function updateThemeIcon(theme) {
    const icon = elements.themeToggle?.querySelector('.theme-icon');
    if (icon) {
        icon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
}

/**
 * Show loading skeleton
 */
export function showLoading() {
    if (elements.loadingSkeleton) {
        elements.loadingSkeleton.classList.remove('hidden');
    }
    if (elements.weatherContent) {
        elements.weatherContent.style.opacity = '0.5';
    }
    if (elements.forecastContent) {
        elements.forecastContent.style.opacity = '0.5';
    }
}

/**
 * Hide loading skeleton
 */
export function hideLoading() {
    if (elements.loadingSkeleton) {
        elements.loadingSkeleton.classList.add('hidden');
    }
    if (elements.weatherContent) {
        elements.weatherContent.style.opacity = '1';
    }
    if (elements.forecastContent) {
        elements.forecastContent.style.opacity = '1';
    }
}

/**
 * Show error message
 */
export function showError(message, showRetry = false) {
    elements.errorText.textContent = message;
    elements.errorRetry.classList.toggle('hidden', !showRetry);
    elements.errorContainer.classList.add('active');
}

/**
 * Hide error message
 */
export function hideError() {
    elements.errorContainer.classList.remove('active');
}

/**
 * Show weather alert
 */
export function showWeatherAlert(alertMessage) {
    if (elements.weatherAlerts && alertMessage) {
        elements.alertText.textContent = alertMessage;
        elements.weatherAlerts.classList.remove('hidden');
    }
}

/**
 * Hide weather alert
 */
export function hideWeatherAlert() {
    if (elements.weatherAlerts) {
        elements.weatherAlerts.classList.add('hidden');
    }
}

/**
 * Show API key setup instructions
 */
export function showSetupInstructions() {
    elements.setupInstructions.classList.remove('hidden');
    elements.appContent.classList.add('hidden');
}

/**
 * Render autocomplete dropdown
 */
export function renderAutocomplete(results, query) {
    if (!results.length) {
        elements.autocomplete.innerHTML = '<div class="autocomplete-item">No results found</div>';
        elements.autocomplete.classList.add('active');
        return;
    }

    elements.autocomplete.innerHTML = results.map((r, i) => {
        const name = r.name;
        const state = r.state ? `${r.state}, ` : '';
        const country = r.country;
        const displayName = `${name}, ${state}${country}`;

        return `
            <div class="autocomplete-item" 
                 role="option" 
                 data-index="${i}"
                 data-lat="${r.lat}" 
                 data-lon="${r.lon}"
                 data-name="${name}"
                 data-state="${r.state || ''}"
                 data-country="${country}">
                <span class="location-icon">📍</span>
                <span>${highlightMatch(displayName, query)}</span>
            </div>
        `;
    }).join('');

    elements.autocomplete.classList.add('active');
    State.selectedIndex = -1;
}

/**
 * Hide autocomplete dropdown
 */
export function hideAutocomplete() {
    elements.autocomplete.classList.remove('active');
    State.selectedIndex = -1;
}

/**
 * Update selected item in autocomplete
 */
export function updateAutocompleteSelection(index) {
    const items = elements.autocomplete.querySelectorAll('.autocomplete-item');
    items.forEach((item, i) => {
        item.classList.toggle('selected', i === index);
    });
    State.selectedIndex = index;
}

/**
 * Set loading state for location button
 */
export function setLocationLoading(loading) {
    const btn = elements.locationBtn;
    const text = btn.querySelector('.btn-text');
    const icon = btn.querySelector('.location-icon');

    if (loading) {
        btn.disabled = true;
        icon.innerHTML = '<div class="spinner"></div>';
        text.textContent = 'Locating...';
    } else {
        btn.disabled = false;
        icon.textContent = '📍';
        text.textContent = 'My Location';
    }
}

/**
 * Get animation class based on weather condition
 */
function getWeatherAnimationClass(weatherMain) {
    const main = weatherMain.toLowerCase();
    if (main.includes('clear') || main.includes('sun')) return 'sunny';
    if (main.includes('rain') || main.includes('drizzle')) return 'rainy';
    if (main.includes('snow')) return 'snowy';
    if (main.includes('thunder') || main.includes('storm')) return 'stormy';
    if (main.includes('cloud')) return 'cloudy';
    if (main.includes('wind')) return 'windy';
    if (main.includes('mist') || main.includes('fog') || main.includes('haze')) return 'cloudy';
    return '';
}

/**
 * Update background based on weather condition
 */
function updateWeatherBackground(weatherMain, isDay = true) {
    // Remove all weather classes
    document.body.classList.remove(
        'weather-clear', 'weather-clear-day', 'weather-clouds',
        'weather-rain', 'weather-drizzle', 'weather-thunderstorm',
        'weather-snow', 'weather-mist', 'weather-fog', 'weather-haze'
    );

    const main = weatherMain.toLowerCase();

    if (main.includes('clear')) {
        document.body.classList.add(isDay ? 'weather-clear-day' : 'weather-clear');
    } else if (main.includes('cloud')) {
        document.body.classList.add('weather-clouds');
    } else if (main.includes('rain') || main.includes('drizzle')) {
        document.body.classList.add('weather-rain');
    } else if (main.includes('thunder') || main.includes('storm')) {
        document.body.classList.add('weather-thunderstorm');
    } else if (main.includes('snow')) {
        document.body.classList.add('weather-snow');
    } else if (main.includes('mist') || main.includes('fog') || main.includes('haze')) {
        document.body.classList.add('weather-mist');
    }
}

/**
 * Render current weather display
 */
export function renderCurrentWeather(data) {
    const { current, forecast } = data;

    // City and date
    elements.cityName.textContent = current.name;
    elements.currentDate.textContent = formatDate(current.dt, current.timezone);

    // Temperature
    const temp = formatTemp(current.main.temp);
    const feelsLike = formatTemp(current.main.feels_like);
    const high = formatTemp(current.main.temp_max);
    const low = formatTemp(current.main.temp_min);

    elements.currentTemp.textContent = temp;
    elements.tempUnit.textContent = State.unit === 'imperial' ? '°F' : '°C';
    elements.feelsLike.textContent = `${feelsLike}°`;
    elements.tempHigh.textContent = `${high}°`;
    elements.tempLow.textContent = `${low}°`;

    // Weather icon and condition
    const weatherInfo = current.weather[0];
    elements.weatherIcon.src = getIconUrl(weatherInfo.icon, '4x');
    elements.weatherIcon.alt = weatherInfo.description;
    elements.weatherIcon.style.display = 'block';
    elements.conditionText.textContent = weatherInfo.description;

    // Add weather animation
    if (elements.weatherAnimation) {
        elements.weatherAnimation.className = 'weather-animation ' + getWeatherAnimationClass(weatherInfo.main);
    }

    // Update background based on weather
    const isDay = weatherInfo.icon.includes('d');
    updateWeatherBackground(weatherInfo.main, isDay);

    // Details
    elements.humidity.textContent = `${current.main.humidity}%`;
    elements.wind.textContent = formatWind(current.wind.speed, current.wind.deg);

    // Precipitation (from forecast if available)
    const pop = forecast?.list?.[0]?.pop;
    elements.precipitation.textContent = pop !== undefined ? `${Math.round(pop * 100)}%` : 'N/A';

    // Last updated
    elements.lastUpdated.textContent = new Date().toLocaleTimeString();

    // Add fade-in effect
    document.querySelector('.current-weather').classList.add('fade-in');

    // Hide loading
    hideLoading();
}

/**
 * Extract daily forecasts from 5-day data (noon readings)
 */
function extractDailyForecasts(list) {
    const dailyMap = new Map();
    const today = new Date().toDateString();

    list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dateStr = date.toDateString();

        // Skip today
        if (dateStr === today) return;

        // Prefer noon readings (12:00)
        const hour = date.getHours();
        const existing = dailyMap.get(dateStr);

        if (!existing || Math.abs(hour - 12) < Math.abs(new Date(existing.dt * 1000).getHours() - 12)) {
            dailyMap.set(dateStr, item);
        }
    });

    // Return first 3 days
    return Array.from(dailyMap.values()).slice(0, 3);
}

/**
 * Render 3-day forecast
 */
export function renderForecast(forecastData) {
    const dailyForecasts = extractDailyForecasts(forecastData.list);

    elements.forecastCards.innerHTML = dailyForecasts.map(day => `
        <div class="forecast-card fade-in">
            <span class="forecast-day">${formatDay(day.dt)}</span>
            <img class="forecast-icon" src="${getIconUrl(day.weather[0].icon)}" alt="${day.weather[0].description}">
            <span class="forecast-precip">💧 ${Math.round(day.pop * 100)}%</span>
            <div class="forecast-temps">
                <span class="forecast-high">${formatTemp(day.main.temp_max)}°</span>
                <span class="forecast-low">${formatTemp(day.main.temp_min)}°</span>
            </div>
        </div>
    `).join('');
}

/**
 * Render recent searches chips
 */
export function renderRecentSearches() {
    if (!State.recentSearches.length) {
        elements.recentSearches.classList.add('hidden');
        return;
    }

    elements.recentSearches.classList.remove('hidden');
    elements.recentChips.innerHTML = State.recentSearches.map(city => {
        const display = city.state
            ? `${city.name}, ${city.state}`
            : `${city.name}, ${city.country}`;
        return `
            <button class="recent-chip" 
                    data-lat="${city.lat}" 
                    data-lon="${city.lon}"
                    data-name="${city.name}">
                ${display}
            </button>
        `;
    }).join('');
}

/**
 * Update temperature display with current unit
 */
export function updateTemperatureDisplay() {
    if (!State.currentWeather) return;
    renderCurrentWeather({
        current: State.currentWeather,
        forecast: State.forecast
    });
    if (State.forecast) {
        renderForecast(State.forecast);
    }
}

// Export as namespace for compatibility
export const UI = {
    elements,
    init,
    toggleTheme,
    showLoading,
    hideLoading,
    showError,
    hideError,
    showWeatherAlert,
    hideWeatherAlert,
    showSetupInstructions,
    renderAutocomplete,
    hideAutocomplete,
    updateAutocompleteSelection,
    setLocationLoading,
    renderCurrentWeather,
    renderForecast,
    renderRecentSearches,
    updateTemperatureDisplay
};
