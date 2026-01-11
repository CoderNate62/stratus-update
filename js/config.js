/**
 * Configuration constants for the weather app
 * ⚠️ Replace API_KEY with your OpenWeatherMap API key
 */

export const CONFIG = {
    // ⚠️ REPLACE WITH YOUR OPENWEATHERMAP API KEY
    // Get one free at: https://openweathermap.org/api
    API_KEY: 'YOUR_API_KEY_HERE',

    BASE_URL: 'https://api.openweathermap.org',
    GEO_URL: 'https://api.openweathermap.org/geo/1.0',
    ICON_URL: 'https://openweathermap.org/img/wn',
    DEBOUNCE_MS: 300,
    MIN_SEARCH_CHARS: 2,
    MAX_RESULTS: 5,
    MAX_RECENT: 5
};
