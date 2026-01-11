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
- **Weather Alerts** - Display severe weather warnings when available

---

## 🚀 Getting Started

### 1. Get an API Key

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Copy your API key

### 2. Configure the App

Open `js/config.js` and replace the placeholder:

```javascript
API_KEY: 'YOUR_API_KEY_HERE',  // ← Replace with your key
```

### 3. Run Locally

Since the app uses ES modules, you need a local server:

**Using Node.js:**
```bash
npx serve .
```

**Using Python:**
```bash
python -m http.server 3000
```

Then open http://localhost:3000 in your browser.

---

## 📁 Project Structure

```
stratus-update/
├── index.html          # Main HTML file
├── styles.css          # All styling (themes, animations)
├── README.md           # This file
└── js/
    ├── config.js       # API key & constants
    ├── state.js        # Application state
    ├── utils.js        # Helper functions
    ├── storage.js      # localStorage handling
    ├── api.js          # OpenWeatherMap API calls
    ├── geolocation.js  # Browser geolocation
    ├── ui.js           # DOM manipulation & rendering
    ├── search.js       # Search & autocomplete
    └── app.js          # Main entry point
```

---

## 🎨 Customization

### Themes

The app supports dark and light themes. Colors are defined as CSS custom properties in `styles.css`:

```css
[data-theme="dark"] {
    --color-bg: #0f172a;
    --color-text: #f1f5f9;
    /* ... */
}

[data-theme="light"] {
    --color-bg: #f0f9ff;
    --color-text: #0f172a;
    /* ... */
}
```

### Weather Backgrounds

Dynamic backgrounds change based on weather conditions. Modify the `.weather-*` classes in `styles.css` to customize.

---

## 🛠️ Technologies

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, animations, flexbox/grid
- **JavaScript (ES Modules)** - Modern async/await, fetch API
- **OpenWeatherMap API** - Weather data

---

## 📝 API Endpoints Used

| Endpoint | Purpose |
|----------|---------|
| `/geo/1.0/direct` | City name geocoding |
| `/data/2.5/weather` | Current weather |
| `/data/2.5/forecast` | 5-day forecast |

---

## 📄 License

MIT License - Feel free to use and modify!
