# AURA-AI

AURA-AI is a modern space and Earth intelligence landing page built with Vite, React 19, Tailwind CSS, Framer-style motion, and Three.js-powered visual effects.

This project is structured as an interactive showcase of live intelligence sections, including satellite tracking, launch monitoring, disaster response, air traffic, asteroid surveillance, space weather, lunar exploration, astronomy, and Earth observation analytics.

---

## What’s Inside

- `src/App.tsx` – application entrypoint
- `src/components/ThemeLandingPage.tsx` – landing page layout, hero section, main navigation, and ordered section rendering
- `src/components/sections/` – modular feature sections, including:
  - `SatelliteTrackingSection.tsx`
  - `LaunchMonitoringSection.tsx`
  - `DisasterIntelligenceSection.tsx`
  - `AirTrafficSection.tsx`
  - `AsteroidMonitoringSection.tsx`
  - `SpaceWeatherSection.tsx`
  - `LunarExplorationSection.tsx`
  - `AstronomyGallerySection.tsx`
  - `EOAnalystSection.tsx`
  - plus supporting sections for AI, Earth observation, weather intelligence, orbit visualization, and mission prediction
- `src/components/BlurText.tsx` – animated headline text component
- `src/components/ui/woven-light-hero.tsx` – immersive hero background visuals
- `src/index.css` – global styling and Tailwind base styles
- `app/` – auxiliary scripts and experimental utilities
- `public/` – static public assets served by Vite

---

## Tech Stack

- React 19
- Vite 6
- TypeScript
- Tailwind CSS 4
- motion/react animation library
- Three.js for interactive canvas visuals
- dotenv for environment configuration

---

## Quick Start

**Prerequisites**

- Node.js installed
- npm available

**Local development**

1. Install dependencies

```bash
npm install
```

2. Add your environment variables

Create a `.env` file in the project root with at least:

```env
GEMINI_API_KEY=your_api_key_here
```

3. Start the development server

```bash
npm run dev
```

4. Open the local development URL shown by Vite.

---

## Build & Preview

Build the production bundle:

```bash
npm run build
```

Preview the build locally:

```bash
npm run preview
```

---

## Folder Overview

- `src/` — main React application source
- `src/components/` — reusable UI components and page sections
- `src/components/sections/` — content-driven page sections for the intelligence dashboard
- `src/components/ui/` — custom UI utilities and canvas backgrounds
- `app/` — backend or tooling scripts
- `public/` — static assets served by Vite
- `dist/` — production output after building

---

## Notes

- `package-lock.json` is included to lock dependency versions.
- `.gitignore` is configured to exclude `node_modules`, build output, logs, and environment files.
- The landing page is a polished, story-driven showcase of AI-enabled Earth and space intelligence.

Enjoy exploring and extending the AURA-AI platform!