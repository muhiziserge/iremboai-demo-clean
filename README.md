# IremboAI Chatbot Demo

An interactive Angular demo of the IremboAI chatbot assistant, focused on the **driving-test slot booking** conversation flow. Built from the [IremboAI Chatbot Figma file](https://www.figma.com/design/S53GsYeZrP7JQOVlwnO3N9/IremboAI-Chatbot).

## What's in here

A landing page mocking up the iremboGov portal, with a floating **Ask IremboAI** button. Clicking it opens a chatbot modal pre-seeded with the prompt _"I want to view available driving test slots."_ — hit send to walk through the full guided conversation:

1. Bot greets and asks for your **license category** (chip choices: A, B, C, D)
2. You pick one → bot asks for your **district** (Gasabo, Kicukiro, Nyarugenge)
3. You pick one → bot returns an inline **slot list** with seat-availability badges
4. You tap a slot → bot **confirms** the reservation

The modal mirrors the V1 (Guided) variant from the Figma file, with the V2 (Inline-form) slot list rendered as the final step.

## Tech

- **Angular 18** with standalone components and signals
- **TypeScript 5.5** with strict mode
- **SCSS** with design tokens matched to the Figma file
- No CSS framework — every style is hand-tuned to the design

> Note: The original request mentioned "AngularJS" — that's the legacy 1.x framework, end-of-life since January 2022. This project uses **modern Angular** (v18), which is what is meant in 99% of cases today. If you specifically need AngularJS 1.x, let me know and I'll port it.

## Run locally

```bash
npm install
npm start
```

Then open <http://localhost:4200>.

## Build for production

```bash
npm run build
```

The build output ends up in `dist/iremboai-demo/browser/`.

## Deploy

### Push to GitHub

```bash
# from inside the project folder
git init
git add .
git commit -m "Initial commit: IremboAI chatbot demo"
git branch -M main

# create the repo on github.com first (e.g. iremboai-demo), then:
git remote add origin https://github.com/<YOUR_USERNAME>/iremboai-demo.git
git push -u origin main
```

### Deploy to Vercel

The simplest path:

1. Go to <https://vercel.com/new>
2. Import the GitHub repo you just pushed
3. Vercel auto-detects Angular. Confirm these settings (the included `vercel.json` sets them, but verify):
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist/iremboai-demo/browser`
   - **Install Command:** `npm install`
4. Click **Deploy**. First build takes ~90 seconds.

Or via the CLI:

```bash
npm i -g vercel
vercel        # walks you through the first deploy
vercel --prod # promotes to production
```

## File map

```
src/
├── app/
│   ├── app.component.ts                 # root composition
│   ├── components/
│   │   ├── ask-button/                  # floating "Ask IremboAI" button
│   │   └── chatbot-modal/               # the conversation modal
│   │       ├── chat.types.ts            # message + slot models
│   │       ├── slot.service.ts          # mock slot data
│   │       ├── chatbot-modal.component.ts
│   │       ├── chatbot-modal.component.html
│   │       └── chatbot-modal.component.scss
│   └── pages/landing/                   # iremboGov landing page
├── styles.scss                          # global tokens
└── index.html
```

## Design fidelity notes

- Brand colors and the hero gradient match the Figma tokens (`--primary-600: #0063CF`, `--primary-500: #0097E7`).
- Seat badges color-code by availability — orange for ≤5 (low), green for ≥20 (high), brand blue for the middle band — matching the original UI.
- The chat modal uses Plus Jakarta Sans throughout; the iremboGov portal uses Nunito Sans for headings, both loaded from Google Fonts.
- Sample slot data (Kanombe – Rubirizi center, dates in early May 2026) is taken directly from the reference screenshot.

## License

Demo / prototype — not for production use.
