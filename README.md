# Langogo Demo

Interactive, full-screen demo deck for [Langogo](https://langogo-v3.vercel.app), built with React.

## Structure
- `src/app.jsx` – all slides and logic (edit this)
- `site/` – the deployable page: `index.html`, `styles.css`, `app.js` (built), `beef-a.mp4`, `beef-b.mp4`

## Run locally
```
npm install
npm start
```
`site/app.js` is already built, so `site/index.html` also works from any static server without installing anything.
After editing `src/app.jsx`, run `npm run build`.

## Controls
Right arrow / Space: next. Left arrow: back. F: full screen.

## Deploy (Vercel)
Import the repo, set Framework Preset to "Other", leave Build Command empty, and set Output Directory to `site`.
