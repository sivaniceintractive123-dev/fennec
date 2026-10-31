# FENNEC — Self-Driving Workflows

A cinematic, interactive 3D hero section built with **Three.js** and ambient HTML5 video for a fictional AI automation brand called **FENNEC**.

![FENNEC Hero](images/hero-fallback.png)

## ✨ Features
- **3D Interactive Fox Character**: 3D GLB model with floating bob hover animation, warm studio lighting, ACESFilmic tone mapping, and responsive mouse parallax easing.
- **Cinematic Ambient Video**: Seamless 1080p looped autumn background video with responsive gradient shading.
- **Dynamic Hamburger Navigation**: Expanding morphing pill menu with smooth clip-path transitions, superscript labels, and animated hover effects.
- **Accessible & Responsive**: Fully responsive across mobile, tablet, and desktop viewports, with reduced motion support (`prefers-reduced-motion`).
- **Zero Build Tools**: Works right out of the box with vanilla HTML, modern CSS, and modular Three.js.

## 📁 Project Structure
```
fennec/
├── index.html              # Main output page
├── css/
│   └── style.css           # Layout, typography, transitions, clip-path effects
├── js/
│   ├── menu.js             # Menu open/close & interactive animations
│   └── fox.js              # Three.js 3D character, lighting & parallax logic
└── images/
    ├── hero-fallback.png   # Video poster & CSS fallback background
    ├── hero-video.mp4      # Ambient autumn background video
    └── fox.glb             # 3D cute fox character model
```

## 🚀 Getting Started
Simply clone the repository and open `index.html` in your browser:
```bash
git clone https://github.com/sivaniceintractive123-dev/fennec.git
cd fennec
```
You can also run a local static server:
```bash
npx serve .
# or
python -m http.server 8000
```
