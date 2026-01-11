/**
 * Main application entry point
 * Initializes the app and binds all event listeners
 * 
 * Coded by Nate
 */

import { CONFIG } from './config.js';
import { State } from './state.js';
import { debounce } from './utils.js';
import * as UI from './ui.js';
import * as API from './api.js';
import * as Storage from './storage.js';
import * as Search from './search.js';
import * as Geolocation from './geolocation.js';

/**
 * Initialize the application
 */
function init() {
    // Initialize UI elements first (needed for all paths)
    UI.init();

    // Check for API key
    if (CONFIG.API_KEY === 'YOUR_API_KEY_HERE') {
        UI.showSetupInstructions();
        return;
    }

    Storage.load();
    UI.renderRecentSearches();
    bindEvents();
}

/**
 * Bind all event listeners
 */
function bindEvents() {
    // Debounced search
    const debouncedSearch = debounce(
        query => Search.handleInput(query),
        CONFIG.DEBOUNCE_MS
    );

    UI.elements.searchInput.addEventListener('input', e => {
        debouncedSearch(e.target.value.trim());
    });

    // Keyboard navigation
    UI.elements.searchInput.addEventListener('keydown', e => {
        Search.handleKeyDown(e);
    });

    // Clear search
    UI.elements.clearSearch.addEventListener('click', () => {
        UI.elements.searchInput.value = '';
        UI.hideAutocomplete();
        UI.elements.searchInput.focus();
    });

    // Autocomplete click
    UI.elements.autocomplete.addEventListener('click', e => {
        const item = e.target.closest('.autocomplete-item[data-lat]');
        if (item) {
            Search.selectCity(item.dataset);
        }
    });

    // Click outside to close autocomplete
    document.addEventListener('click', e => {
        if (!e.target.closest('.search-container')) {
            UI.hideAutocomplete();
        }
    });

    // Theme toggle
    if (UI.elements.themeToggle) {
        UI.elements.themeToggle.addEventListener('click', () => {
            UI.toggleTheme();
        });
    }

    // Dismiss weather alert
    if (UI.elements.dismissAlert) {
        UI.elements.dismissAlert.addEventListener('click', () => {
            UI.hideWeatherAlert();
        });
    }

    // Location button
    UI.elements.locationBtn.addEventListener('click', async () => {
        UI.setLocationLoading(true);
        UI.showLoading();
        UI.hideError();

        try {
            const coords = await Geolocation.getCurrentPosition();
            const weatherData = await API.getWeatherByCoords(coords.lat, coords.lon);
            State.currentWeather = weatherData.current;
            State.forecast = weatherData.forecast;

            UI.renderCurrentWeather(weatherData);
            UI.renderForecast(weatherData.forecast);

            // Save to recent
            Storage.addSearch({
                name: weatherData.current.name,
                state: '',
                country: weatherData.current.sys.country,
                lat: coords.lat,
                lon: coords.lon
            });
        } catch (error) {
            Search.handleError(error);
            UI.hideLoading();
        } finally {
            UI.setLocationLoading(false);
        }
    });

    // Unit toggle - Fahrenheit
    UI.elements.unitF.addEventListener('click', () => {
        State.unit = 'imperial';
        UI.elements.unitF.classList.add('active');
        UI.elements.unitF.setAttribute('aria-pressed', 'true');
        UI.elements.unitC.classList.remove('active');
        UI.elements.unitC.setAttribute('aria-pressed', 'false');
        UI.updateTemperatureDisplay();
    });

    // Unit toggle - Celsius
    UI.elements.unitC.addEventListener('click', () => {
        State.unit = 'metric';
        UI.elements.unitC.classList.add('active');
        UI.elements.unitC.setAttribute('aria-pressed', 'true');
        UI.elements.unitF.classList.remove('active');
        UI.elements.unitF.setAttribute('aria-pressed', 'false');
        UI.updateTemperatureDisplay();
    });

    // Recent searches click
    UI.elements.recentChips.addEventListener('click', async e => {
        const chip = e.target.closest('.recent-chip');
        if (chip) {
            const { lat, lon, name } = chip.dataset;
            UI.elements.searchInput.value = name;
            UI.showLoading();

            try {
                const weatherData = await API.getWeatherByCoords(
                    parseFloat(lat),
                    parseFloat(lon)
                );
                State.currentWeather = weatherData.current;
                State.forecast = weatherData.forecast;
                UI.renderCurrentWeather(weatherData);
                UI.renderForecast(weatherData.forecast);
            } catch (error) {
                Search.handleError(error);
                UI.hideLoading();
            }
        }
    });

    // Clear recent searches
    UI.elements.clearRecent.addEventListener('click', () => {
        Storage.clear();
    });

    // Error retry
    UI.elements.errorRetry.addEventListener('click', () => {
        UI.hideError();
        const query = UI.elements.searchInput.value.trim();
        if (query) {
            Search.handleInput(query);
        }
    });
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', init);
