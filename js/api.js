/**
 * API service layer for OpenWeatherMap
 */

import { CONFIG } from './config.js';

/**
 * Search for cities by name (geocoding)
 */
export async function geocode(query) {
    const url = `${CONFIG.GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=${CONFIG.MAX_RESULTS}&appid=${CONFIG.API_KEY}`;
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
    const url = `${CONFIG.BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${CONFIG.API_KEY}`;
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
    const url = `${CONFIG.BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${CONFIG.API_KEY}`;
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
