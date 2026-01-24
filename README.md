# ☁️ Stratus Update

A clean, functional weather dashboard built with vanilla JavaScript and ES modules. Features a modern dark/light theme, animated weather effects, and a responsive design.

**Coded by Nate**

---

## ✨ Features

- **City Search** - Autocomplete with 300ms debounce and keyboard navigation
- **Geolocation** - "My Location" button with permission handling
- **Current Weather** - Temperature, feels like, high/low, humidity, wind, precipitation
- **3-Day Forecast** - Daily forecasts with weather icons
- **Temperature Toggle** - Switch between °F and °C
- **Dark/Light Mode** - Toggle with preferences saved to localStorage
- **Recent Searches** - Quick access to last 5 searched cities
- **Dynamic Backgrounds** - Background changes based on weather conditions
- **Animated Weather Icons** - Subtle animations for different weather types
- **Backend Proxy** - Firebase Functions for secure API key storage

---

## �️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (ES Modules) |
| **Styling** | CSS Custom Properties, Flexbox, Grid, Animations |
| **Backend** | Firebase Cloud Functions (Node.js 20) |
| **Hosting** | Firebase Hosting |
| **API** | OpenWeatherMap (Geocoding, Weather, Forecast) |
| **Build** | No build tools required - runs directly in browser |

---

## �🚀 Getting Started

### Option 1: Direct Mode (Local Development)

1. Get an API key from [OpenWeatherMap](https://openweathermap.org/api)
2. Edit `js/config.js`:
   ```javascript
   MODE: 'direct',
   API_KEY: 'your-api-key-here',
   ```
3. Run a local server: `npx serve .`
4. Open http://localhost:3000

### Option 2: Firebase Hosting (Production)

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Create project: `firebase projects:create stratus-update`
4. Set API key securely:
   ```bash
   firebase functions:config:set openweather.key="YOUR_API_KEY"
   ```
5. Install functions dependencies:
   ```bash
   cd functions && npm install && cd ..
   ```
6. Deploy:
   ```bash
   firebase deploy
   ```

---

## 📁 Project Structure

```
stratus-update/
├── index.html          # Main HTML file
├── styles.css          # All styling (themes, animations)
├── firebase.json       # Firebase config
├── README.md           # This file
├── js/
│   ├── config.js       # Mode & API settings
│   ├── api.js          # API calls (supports proxy mode)
│   ├── app.js          # Main entry point
│   └── ...             # Other modules
└── functions/
    ├── index.js        # Cloud Functions (API proxy)
    └── package.json    # Functions dependencies
```

---

## 🔒 Security

The app supports two modes configured in `js/config.js`:

| Mode | API Key Location | Use Case |
|------|------------------|----------|
| `direct` | Client-side (visible) | Local development |
| `proxy` | Server-side (secure) | Production |

In **proxy mode**, the API key is stored in Firebase Functions config and never exposed to the client.

---

## 📝 License

MIT License - Feel free to use and modify!

---
Last Updated: January 24, 2026
