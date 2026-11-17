# wiggle-website

The public Wiggle website at https://wiggle.vet (home page and /legal).

Built with Vite, React and Tailwind CSS. Hosted on Netlify.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build   # output in dist/
```

Netlify settings: build command `npm run build`, publish directory `dist`.
`public/_redirects` sends every path to `index.html`, so direct links such as
`/legal` load.

## Files

- `src/pages/Home.tsx`: home page.
- `src/pages/Legal.tsx`: privacy policy and terms of service. The text comes
  from `public/legal/*.txt`.
- `src/components/LogoEasterEgg.jsx`: the logo. A click plays the dog drawing
  animation (same as the Wiggle web app login screen).
