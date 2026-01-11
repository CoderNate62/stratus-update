/**
 * API service layer for OpenWeatherMap
 * Supports both direct API calls and proxy mode (Firebase Functions)
 * 
 * Coded by Nate
 */

import { CONFIG } from './config.js';

/**
 * Build URL based on mode (proxy or direct)
 */
function buildUrl(endpoint, params) {
    if (CONFIG.MODE === 'proxy') {
        // Use Firebase Functions proxy
        const baseUrl = CONFIG.PROXY_URL || '';
        const queryString = new URLSearchParams({ endpoint, ...params }).toString();
        return `${baseUrl}/api?${queryString}`;
    } else {
        // Direct OpenWeatherMap API calls
        return null; // Will be built per-function
    }
}

/**
 * Search for cities by name (geocoding)
 */
export async function geocode(query) {
    let url;

    if (CONFIG.MODE === 'proxy') {
        const baseUrl = CONFIG.PROXY_URL || '';
        url = `${baseUrl}/api?endpoint=geocode&q=${encodeURIComponent(query)}&limit=${CONFIG.MAX_RESULTS}`;
    } else {
        url = `${CONFIG.GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=${CONFIG.MAX_RESULTS}&appid=${CONFIG.API_KEY}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
        if (response.status === 401) throw new Error('INVALID_API_KEY');
        if (response.status === 429) throw new Error('RATE_LIMITED');
        throw new Error('NETWORK_ERROR');
    }

    return response.json();
}

/**
 * Get current weather by coordinates
 */
export async function getCurrentWeather(lat, lon) {
    let url;

    if (CONFIG.MODE === 'proxy') {
        const baseUrl = CONFIG.PROXY_URL || '';
        url = `${baseUrl}/api?endpoint=weather&lat=${lat}&lon=${lon}`;
    } else {
        url = `${CONFIG.BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${CONFIG.API_KEY}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
        if (response.status === 401) throw new Error('INVALID_API_KEY');
        if (response.status === 429) throw new Error('RATE_LIMITED');
        throw new Error('NETWORK_ERROR');
    }

    return response.json();
}

/**
 * Get 5-day forecast by coordinates
 */
export async function getForecast(lat, lon) {
    let url;

    if (CONFIG.MODE === 'proxy') {
        const baseUrl = CONFIG.PROXY_URL || '';
        url = `${baseUrl}/api?endpoint=forecast&lat=${lat}&lon=${lon}`;
    } else {
        url = `${CONFIG.BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${CONFIG.API_KEY}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
        if (response.status === 401) throw new Error('INVALID_API_KEY');
        if (response.status === 429) throw new Error('RATE_LIMITED');
        throw new Error('NETWORK_ERROR');
    }

    return response.json();
}

/**
 * Get both current weather and forecast in parallel
 */
export async function getWeatherByCoords(lat, lon) {
    const [current, forecast] = await Promise.all([
        getCurrentWeather(lat, lon),
        getForecast(lat, lon)
    ]);
    return { current, forecast };
}
