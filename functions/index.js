/**
 * Firebase Cloud Functions - Weather API Proxy
 * Keeps the OpenWeatherMap API key secure on the server side
 * 
 * Coded by Nate
 */

const functions = require('firebase-functions');
const fetch = require('node-fetch');

// Get API key from environment variable (.env file)
const API_KEY = process.env.OPENWEATHER_API_KEY;

const BASE_URL = 'https://api.openweathermap.org';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// CORS headers for cross-origin requests
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
};

/**
 * Handle CORS preflight requests
 */
function handleCors(req, res) {
    if (req.method === 'OPTIONS') {
        res.set(corsHeaders);
        res.status(204).send('');
        return true;
    }
    res.set(corsHeaders);
    return false;
}

/**
 * Check if API key is configured
 */
function checkApiKey(res) {
    if (!API_KEY) {
        res.status(500).json({
            error: 'API key not configured. Add OPENWEATHER_API_KEY to functions/.env file'
        });
        return false;
    }
    return true;
}

/**
 * Geocoding endpoint - search for cities
 * GET /api/geocode?q=London&limit=5
 */
exports.geocode = functions.https.onRequest(async (req, res) => {
    if (handleCors(req, res)) return;
    if (!checkApiKey(res)) return;

    try {
        const { q, limit = 5 } = req.query;

        if (!q) {
            return res.status(400).json({ error: 'Query parameter "q" is required' });
        }

        const url = `${GEO_URL}/direct?q=${encodeURIComponent(q)}&limit=${limit}&appid=${API_KEY}`;
        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Geocoding error:', response.status, errorText);
            return res.status(response.status).json({ error: 'Geocoding failed' });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Geocode error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * Current weather endpoint
 * GET /api/weather?lat=51.5&lon=-0.12
 */
exports.weather = functions.https.onRequest(async (req, res) => {
    if (handleCors(req, res)) return;
    if (!checkApiKey(res)) return;

    try {
        const { lat, lon } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({ error: 'Parameters "lat" and "lon" are required' });
        }

        const url = `${BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Weather error:', response.status, errorText);
            return res.status(response.status).json({ error: 'Weather fetch failed' });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Weather error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * Forecast endpoint
 * GET /api/forecast?lat=51.5&lon=-0.12
 */
exports.forecast = functions.https.onRequest(async (req, res) => {
    if (handleCors(req, res)) return;
    if (!checkApiKey(res)) return;

    try {
        const { lat, lon } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({ error: 'Parameters "lat" and "lon" are required' });
        }

        const url = `${BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Forecast error:', response.status, errorText);
            return res.status(response.status).json({ error: 'Forecast fetch failed' });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Forecast error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * Combined API endpoint for simpler routing
 * GET /api?endpoint=geocode&q=London
 * GET /api?endpoint=weather&lat=51.5&lon=-0.12
 * GET /api?endpoint=forecast&lat=51.5&lon=-0.12
 */
exports.api = functions.https.onRequest(async (req, res) => {
    if (handleCors(req, res)) return;
    if (!checkApiKey(res)) return;

    try {
        const { endpoint, q, lat, lon, limit = 5 } = req.query;
        let url;

        switch (endpoint) {
            case 'geocode':
                if (!q) return res.status(400).json({ error: 'Query "q" required' });
                url = `${GEO_URL}/direct?q=${encodeURIComponent(q)}&limit=${limit}&appid=${API_KEY}`;
                break;
            case 'weather':
                if (!lat || !lon) return res.status(400).json({ error: 'lat/lon required' });
                url = `${BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
                break;
            case 'forecast':
                if (!lat || !lon) return res.status(400).json({ error: 'lat/lon required' });
                url = `${BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
                break;
            default:
                return res.status(400).json({ error: 'Invalid endpoint. Use: geocode, weather, forecast' });
        }

        const response = await fetch(url);
        if (!response.ok) {
            return res.status(response.status).json({ error: 'API request failed' });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
