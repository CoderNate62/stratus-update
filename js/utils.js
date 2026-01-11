/**
 * Utility functions for formatting and data manipulation
 */

import { CONFIG } from './config.js';
import { State } from './state.js';

/**
 * Creates a debounced version of a function
 */
export function debounce(fn, ms) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), ms);
    };
}

/**
 * Convert Kelvin to Fahrenheit or Celsius
 */
export function formatTemp(kelvin, unit = State.unit) {
    if (unit === 'imperial') {
        return Math.round((kelvin - 273.15) * 9 / 5 + 32);
    }
    return Math.round(kelvin - 273.15);
}

/**
 * Format timestamp to readable date string
 */
export function formatDate(timestamp, timezone = 0) {
    const date = new Date((timestamp + timezone) * 1000);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });
}

/**
 * Format timestamp to day name (Tomorrow, Wed, Thu, etc.)
 */
export function formatDay(timestamp) {
    const date = new Date(timestamp * 1000);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
    }
    return date.toLocaleDateString('en-US', { weekday: 'short' });
}

/**
 * Convert wind degrees to compass direction
 */
export function getWindDirection(degrees) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
}

/**
 * Format wind speed with direction
 */
export function formatWind(speed, deg, unit = State.unit) {
    const direction = getWindDirection(deg);
    const unitLabel = unit === 'imperial' ? 'mph' : 'km/h';
    const convertedSpeed = unit === 'imperial' ? speed : speed * 3.6;
    return `${Math.round(convertedSpeed)} ${unitLabel} ${direction}`;
}

/**
 * Highlight matching text in search results
 */
export function highlightMatch(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}

/**
 * Get weather icon URL from OpenWeatherMap
 */
export function getIconUrl(code, size = '2x') {
    return `${CONFIG.ICON_URL}/${code}@${size}.png`;
}
