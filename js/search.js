/**
 * Search and autocomplete controller
 */

import { CONFIG } from './config.js';
import { State } from './state.js';
import * as API from './api.js';
import * as UI from './ui.js';
import * as Storage from './storage.js';

/**
 * Handle search input (called after debounce)
 */
export async function handleInput(query) {
    if (query.length < CONFIG.MIN_SEARCH_CHARS) {
        UI.hideAutocomplete();
        return;
    }

    try {
        const results = await API.geocode(query);
        UI.renderAutocomplete(results, query);
    } catch (error) {
        handleError(error);
    }
}

/**
 * Handle keyboard navigation in autocomplete
 */
export function handleKeyDown(e) {
    const items = UI.elements.autocomplete.querySelectorAll('.autocomplete-item[data-lat]');
    if (!items.length) return;

    switch (e.key) {
        case 'ArrowDown':
            e.preventDefault();
            State.selectedIndex = Math.min(State.selectedIndex + 1, items.length - 1);
            UI.updateAutocompleteSelection(State.selectedIndex);
            break;
        case 'ArrowUp':
            e.preventDefault();
            State.selectedIndex = Math.max(State.selectedIndex - 1, 0);
            UI.updateAutocompleteSelection(State.selectedIndex);
            break;
        case 'Enter':
            e.preventDefault();
            if (State.selectedIndex >= 0) {
                const selected = items[State.selectedIndex];
                selectCity(selected.dataset);
            }
            break;
        case 'Escape':
            UI.hideAutocomplete();
            break;
    }
}

/**
 * Select a city and fetch weather
 */
export async function selectCity(data) {
    UI.hideAutocomplete();
    UI.elements.searchInput.value = data.name;
    UI.hideError();
    UI.showLoading();

    const city = {
        name: data.name,
        state: data.state || '',
        country: data.country,
        lat: parseFloat(data.lat),
        lon: parseFloat(data.lon)
    };

    try {
        State.isLoading = true;
        const weatherData = await API.getWeatherByCoords(city.lat, city.lon);
        State.currentWeather = weatherData.current;
        State.forecast = weatherData.forecast;

        UI.renderCurrentWeather(weatherData);
        UI.renderForecast(weatherData.forecast);
        Storage.addSearch(city);
    } catch (error) {
        handleError(error);
        UI.hideLoading();
    } finally {
        State.isLoading = false;
    }
}

/**
 * Handle errors with user-friendly messages
 */
export function handleError(error) {
    const messages = {
        'INVALID_API_KEY': 'Invalid API key. Please check your configuration.',
        'RATE_LIMITED': 'Too many requests. Please try again in a moment.',
        'NETWORK_ERROR': 'Unable to connect. Please check your internet connection.',
        'GEOLOCATION_DENIED': 'Location access denied. Please search for a city instead.',
        'GEOLOCATION_NOT_SUPPORTED': 'Geolocation is not supported by your browser.',
        'GEOLOCATION_ERROR': 'Unable to get your location. Please try again.'
    };

    const message = messages[error.message] || 'An unexpected error occurred.';
    const showRetry = ['NETWORK_ERROR', 'RATE_LIMITED'].includes(error.message);
    UI.showError(message, showRetry);
    console.error('Weather app error:', error);
}
