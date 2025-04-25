# ✨ Seoul Tourism Dashboard System - Frontend

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

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
