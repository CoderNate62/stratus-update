/**
 * Centralized application state
 */

export const State = {
    unit: 'imperial', // 'imperial' (°F) or 'metric' (°C)
    currentWeather: null,
    forecast: null,
    recentSearches: [],
    selectedIndex: -1,
    isLoading: false
};
