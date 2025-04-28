# Seoul Tourism Dashboard System - Frontend

This project is a visualized dashboard for real-time monitoring of major tourist attractions in Seoul.  
It displays key information such as floating population, weather, congestion levels, and more in an interactive, responsive interface.

# ⚙️ Tech Stack

| Category | Stack |
|----------|-------|
| Framework | **React 19.0.0** (with **Vite 6.2.0**) |
| Language | **TypeScript 5.7.2** |
| Styling | **Tailwind CSS 3.4.17** + PostCSS + Autoprefixer |
| Map | **Mapbox GL JS** |
| Charts | **Recharts** |
| Animations | **Framer Motion** |
| Fullpage Scroll | **FullPage.js** |
| Count Animation | **CountUp.js** |

# 🧪 Environment

| Tool | Version |
|-----|-----|
| Node.js | v22.14.0 (LTS) |
| npm | 10.9.2 |
| Vite | 6.2.0 |

# 📦 Library Installation Guide
## ✅ Tailwind CSS
```bash
npm install -D tailwindcss@^3.4.17 postcss autoprefixer
npx tailwindcss init -p
```

## ✅ Mapbox GL
```bash
npm install mapbox-gl
npm install --save-dev @types/mapbox-gl
```

## ✅ FullPage.js
```bash
npm install @fullpage/react-fullpage fullpage.js
npm install -D @types/fullpage.js
```

## ✅ Framer Motion
```bash
npm install framer-motion
```

## ✅ Recharts
```bash
npm install recharts
```

# 🔐 Environment Variables (.env)
Create a .env file at the root of the project and add the following:

```env
VITE_MAPBOX_TOKEN=your_mapbox_access_token
VITE_OPENWEATHER_API_KEY=your_openweather_api_key
```

# 🏁 Run !
```bash
npm run dev
```
