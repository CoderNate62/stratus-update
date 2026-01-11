/**
 * Configuration constants for the weather app
 * ⚠️ Configure based on your deployment mode
 * 
 * Coded by Nate
 */

export const CONFIG = {
    // ==============================================
    // DEPLOYMENT MODE
    // ==============================================
    // Set to 'proxy' when using Firebase Functions (recommended for production)
    // Set to 'direct' for local development with API key
    MODE: 'proxy', // 'proxy' or 'direct'

    // ==============================================
    // DIRECT MODE - API Key (for local development)
    // ==============================================
    // Only used when MODE is 'direct'
    // Get a free key at: https://openweathermap.org/api
    API_KEY: 'YOUR_API_KEY_HERE',

    // ==============================================
    // PROXY MODE - Firebase Functions URL
    // ==============================================
    // Only used when MODE is 'proxy'
    // After deploying, this will be your Firebase project URL
    // For local emulator: 'http://localhost:5001/YOUR_PROJECT_ID/us-central1'
    PROXY_URL: '',  // Leave empty to use relative URLs (works on Firebase Hosting)

    // ==============================================
    // OpenWeatherMap URLs (used in direct mode only)
    // ==============================================
    BASE_URL: 'https://api.openweathermap.org',
    GEO_URL: 'https://api.openweathermap.org/geo/1.0',
    ICON_URL: 'https://openweathermap.org/img/wn',

    // ==============================================
    // App Settings
    // ==============================================
    DEBOUNCE_MS: 300,
    MIN_SEARCH_CHARS: 2,
    MAX_RESULTS: 5,
    MAX_RECENT: 5
};
