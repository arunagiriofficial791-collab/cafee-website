# Lumina — 3D Artisanal Café & Specialty Roastery

A complete, production-ready frontend for a modern café featuring **Spline 3D web experiences**, an interactive 360° drink customizer, single-origin menu exploration with live search, ambient Web Audio soundscapes, and a visual table reservation system.

![Lumina Café](assets/hero_coffee.png)

---

## 🌟 Key Features

- **3D Spline & Canvas Integration**: Embedded `@splinetool/viewer` 3D scene paired with a custom HTML5 3D Canvas drink lab.
- **360° Interactive Drink Customizer**: Rotate the 3D coffee cup model, change roast profiles (*Ethiopia, Colombia, Sumatra*), adjust milk foam density, and pick latte art (*Rosetta, Heart, Tulip*) with real-time flavor radar calculations.
- **Web Audio Ambient Soundscape**: Toggleable ambient coffee shop audio synth (*soft rain, warm vinyl crackle, espresso machine hum*).
- **Time-of-Day Ambiance Themes**: Instant switching between *Morning Espresso*, *Sunset Gold*, and *Midnight Roast*.
- **Signature Menu & Flavor Explorer**: Categorized filtering (*Espresso Bar, Cold Brew Drafts, Specialty Teas, Bakery*) and instant search with tasting notes popups.
- **Interactive Table Reservation**: Visual floor plan map with seat selection (*Window, Barista Counter, Lounge Nook, Patio*) and reservation form.
- **Live Roastery Hours**: Auto-calculating open/closed status badge based on local time.

---

## 📁 Repository Structure

```text
├── index.html          # Semantic HTML5 layout & 3D viewports
├── style.css           # Modern design system, dark roast palette & glassmorphism
├── app.js              # 3D canvas engine, soundscape synth, menu & reservation logic
└── assets/             # High quality café imagery & asset files
    ├── hero_coffee.png
    ├── ambiance.png
    ├── cold_brew.png
    └── pastry.png
```

---

## 🚀 How to Run Locally

1. Clone or download this repository.
2. Serve the static directory with any web server:
   ```bash
   python -m http.server 8080
   ```
3. Open `http://localhost:8080` in your web browser.

---

## 🛠️ Built With

- **HTML5 & CSS3**: Vanilla CSS with glassmorphism, responsive grid/flexbox, custom properties.
- **JavaScript (ES6+)**: Custom 3D rendering engine, particle systems, Web Audio API.
- **Spline**: `@splinetool/viewer` 3D web component.
- **Google Fonts & FontAwesome**: Playfair Display, Outfit, Plus Jakarta Sans, FontAwesome icons.

---

© 2026 Lumina Artisanal Roastery & Café. Crafted with 3D Web Technology.
