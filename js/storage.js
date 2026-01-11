/**
 * localStorage handling for recent searches
 */

import { CONFIG } from './config.js';
import { State } from './state.js';
import { UI } from './ui.js';

const STORAGE_KEY = 'stratus_recent_searches';

/**
 * Load recent searches from localStorage
 */
export function load() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        State.recentSearches = data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Error loading recent searches:', e);
        State.recentSearches = [];
    }
}

/**
 * Save recent searches to localStorage
 */
export function save() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(State.recentSearches));
    } catch (e) {
        console.error('Error saving recent searches:', e);
    }
}

/**
 * Add a city to recent searches
 */
export function addSearch(city) {
    // Remove duplicate if exists
    State.recentSearches = State.recentSearches.filter(
        s => !(s.lat === city.lat && s.lon === city.lon)
    );
    // Add to beginning
    State.recentSearches.unshift(city);
    // Keep only max
    State.recentSearches = State.recentSearches.slice(0, CONFIG.MAX_RECENT);
    save();
    UI.renderRecentSearches();
}

/**
 * Clear all recent searches
 */
export function clear() {
    State.recentSearches = [];
    save();
    UI.renderRecentSearches();
}
