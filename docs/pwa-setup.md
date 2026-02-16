# PWA Setup — NucleuX Academy

**Date:** 2026-02-16

## What Was Added

### 1. Web App Manifest (`src/app/manifest.ts`)
- Next.js native manifest route (generates `/manifest.webmanifest`)
- Name: "NucleuX Academy", short: "NucleuX"
- Theme: deep purple `#7C3AED`, background: dark `#0F172A`
- Standalone display, portrait orientation
- Placeholder icons at `/public/icons/icon-{192,512}.png`

### 2. Service Worker (`public/sw.js`)
Vanilla JS service worker (no build tool dependency):
- **App shell precaching:** `/` cached on install
- **API/YAML routes:** Network-first with cache fallback (offline access to content)
- **Static assets:** Cache-first for JS/CSS/images/fonts
- **Navigation:** Network-first, falls back to cached page or `/`

### 3. Install Prompt (`src/components/pwa/InstallPrompt.tsx`)
- Listens for `beforeinstallprompt` event
- Shows floating banner on mobile: "Install NucleuX Academy"
- Dismissible, styled to match app theme

### 4. SW Registration (`src/components/pwa/ServiceWorkerRegistration.tsx`)
- Client component that registers `/sw.js` on mount

### 5. Meta Tags (in `layout.tsx`)
- `theme-color: #7C3AED`
- `viewport` with `user-scalable=no` for mobile
- `apple-mobile-web-app-capable` via Next.js `appleWebApp` metadata
- `mobile-web-app-capable`

## Why Not Serwist?
Serwist (`@serwist/next`) uses a webpack plugin. Next.js 16 defaults to Turbopack and the webpack build was hanging/OOM. A vanilla service worker in `public/` works with any bundler and is simpler to maintain.

## Files Changed
- `src/app/manifest.ts` (new)
- `src/app/layout.tsx` (modified — meta tags, InstallPrompt, SW registration)
- `src/components/pwa/InstallPrompt.tsx` (new)
- `src/components/pwa/ServiceWorkerRegistration.tsx` (new)
- `public/sw.js` (new)
- `public/icons/icon-192.png` (new — placeholder)
- `public/icons/icon-512.png` (new — placeholder)

## Cache Versioning
Bump `CACHE_NAME` in `public/sw.js` (e.g., `nucleux-v2`) to force cache refresh on deploy.
