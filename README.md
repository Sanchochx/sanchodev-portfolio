# Personal Portfolio — Santiago Sánchez Márquez

Portfolio built with Astro in server mode (SSR) and deployed on Vercel. It has two faces:

- **`/` — RED LODGE**: an interactive retro desktop (CRT boot animation, draggable windows, taskbar clock) with small apps: About Me notepad, MS Paint, Cinema, Videogames, the P.A.C.T.A.S.I.S terminal bot and playable DOOM, Wolfenstein 3D and 3D Pinball.
- **`/portfolio`**: the conventional software-engineer portfolio (Hero, Skills, Projects, Contact) with a chatbot that answers as Santiago.

Production: https://sanchodev-portfolio.vercel.app

---

## Stack

- **Astro 5** with `output: 'server'` and the `@astrojs/vercel` adapter
- **TypeScript** in `strict` mode
- **Tailwind CSS 3** — "Cyber-Refined Narrative" design system (see `DESIGN.md`), tokens in `tailwind.config.mjs`
- **astro-icon** + `@iconify-json/material-symbols` — icons inlined as SVG at build time
- **@fontsource/space-grotesk** + **@fontsource/inter** — self-hosted fonts
- **@astrojs/sitemap** — automatic sitemap
- **OpenAI `gpt-4o-mini`** — model behind both bots, called from `src/lib/chat-guard.ts`
- **rss-parser** — reads the Letterboxd RSS feed
- **TMDB API** — posters for favorite movies
- **js-dos 6.22** (CDN) — runs DOOM and Wolfenstein 3D in the browser

---

## Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Dev server at `http://localhost:4321` |
| `npm run build` | Production build |
| `npm run preview` | Serve the build locally |
| `npm run check` | `astro check` (TypeScript + diagnostics) |

**Requirement**: Node.js ≥ 20.3.

---

## Environment variables

Copy `.env.example` to `.env` (git-ignored).

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | **Required.** Used by `/api/chat` and `/api/pactasis`. On Vercel, set it in *Settings → Environment Variables*. |
| `TMDB_API_KEY` | Optional. Without it the Cinema app simply omits the favorite-movie posters. |

---

## Deploying to Vercel

1. Import the repository in Vercel (`Astro` preset).
2. Set `OPENAI_API_KEY` (and optionally `TMDB_API_KEY`) for Production and Preview.
3. The domain is configured in `SITE_URL` in `astro.config.mjs` (affects canonical, OG and sitemap).
4. `vercel.json` adds security headers (`X-Frame-Options: DENY`, `nosniff`, HSTS, `Referrer-Policy`, restrictive `Permissions-Policy`).

---

## Structure

```
src/
├── components/
│   ├── Nav, Hero, SkillsBento, Projects, Contact, Footer   # /portfolio sections
│   ├── ChatWidget.astro      # Floating chatbot (calls /api/chat)
│   ├── CyberGrid.astro       # Background grid
│   ├── LetterboxdApp.astro   # Cinema window: favorites (TMDB) + last 10 watched (Letterboxd RSS)
│   └── GamesApp.astro        # Videogames window: shelf of game spines, click for the cover
├── data/
│   ├── projects.ts   # Projects shown in the Projects section
│   └── me.ts         # Chatbot context and system prompt
├── layouts/
│   └── BaseLayout.astro  # <head>, SEO, OG, Twitter Card, ChatWidget
├── lib/
│   └── chat-guard.ts     # Shared validation, rate limit and OpenAI call for both bots
├── pages/
│   ├── index.astro       # RED LODGE: interactive desktop (home page)
│   ├── portfolio.astro   # Portfolio: assembles the sections
│   ├── 404.astro         # Custom error page
│   └── api/
│       ├── chat.ts       # Portfolio chatbot (answers as Santiago)
│       └── pactasis.ts   # P.A.C.T.A.S.I.S terminal bot
└── styles/global.css     # Fonts, Tailwind directives, .glass utilities
public/
├── images/               # Logo, avatar, desktop icons, projects, 404 art, videogame_covers/
└── games/wolf3d.zip      # Wolfenstein 3D bundle for js-dos
DESIGN.md                 # Design system
```

## RED LODGE desktop (`/`)

The home page hides the global Nav, Footer and chat widget and renders a full-screen desktop. Everything is in `src/pages/index.astro` plus two components.

| Icon | What it does |
|------|--------------|
| My Portfolio | Link to `/portfolio` |
| P.A.C.T.A.S.I.S v1.0 | Retro terminal chatbot backed by `/api/pactasis` |
| About Me | Read-only Notepad window with bio, hardware specs and avatar |
| MS Paint | Windows 95–style canvas: pencil, brush, eraser, fill, color picker, 28-color palette, line width, save as image, clear |
| Cinema | Favorite movies (TMDB) and recent Letterboxd diary entries |
| Videogames | Shelf of game spines from `public/images/videogame_covers/` |
| DOOM | Shareware DOOM via js-dos |
| 3D Pinball | Space Cadet pinball, embedded as an iframe injected on open (removed on close to free resources) |
| Wolfenstein 3D | Runs `public/games/wolf3d.zip` via js-dos |

Details:

- A CRT power-on animation plays on load; windows (Notepad, Paint, Cinema, Videogames, P.A.C.T.A.S.I.S, terminal) are draggable and close with ✕.
- The terminal window opens by default and cycles through ASCII arts; each one sets a color theme (`pink`, `orange`, `blue`, `purple`, `white`) or the default rainbow frame.
- The page is served with `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400` so Letterboxd/TMDB are not queried on every visit.
- Animations respect `prefers-reduced-motion`.

### Adding a game to the shelf

Add `{ id: '<slug>' }` to `localGames` in `GamesApp.astro` and drop `<slug>.jpg|png|webp` (cover) and `<slug>-spine.png|jpg|webp` in `public/images/videogame_covers/`.

## Chatbots

Both bots share `src/lib/chat-guard.ts`, so limits cannot diverge:

- Input: body ≤ 20,000 chars, message ≤ 1,000 chars, last 6 history messages and ≤ 6,000 history chars.
- Rate limit (in memory, per IP): 8 requests/minute and 60/hour. It is *best-effort*: state is per serverless instance, not a global quota.
- OpenAI call with a 20 s timeout; errors return generic messages and are logged server-side.

| Endpoint | Persona | `max_tokens` |
|----------|---------|--------------|
| `/api/chat` | Santiago, context in `src/data/me.ts` (changing it requires a redeploy) | 400 |
| `/api/pactasis` | P.A.C.T.A.S.I.S: short plain-text answers; refuses code, images and ASCII art, and replaces any reply containing a code fence | 300 |

## Adding a project

Add an object to `src/data/projects.ts` (with its image in `public/images/projects/`) and, if it should appear in the chatbot, also update the *Projects* section of `LINKEDIN` in `src/data/me.ts`.

```text
+============================================================================+
   _____                  __               ____           
  / ___/____ _____  _____/ /_  ____       / __ \___ _   __
  \__ \/ __ `/ __ \/ ___/ __ \/ __ \     / / / / _ \ | / /
 ___/ / /_/ / / / / /__/ / / / /_/ /    / /_/ /  __/ |/ / 
/____/\__,_/_/ /_/\___/_/ /_/\____/____/_____/\___/|___/  
                                 /_____/                  

               .-"""-.
             _/-=-.   \
            (_|a a/   |_
             / "  \   ,_)
        _    \`=' /__/
       / \_  .;--'  `-.
       \___)//      ,  \
        \ \/;        \  \
         \_.|         | |
          .-\ '     _/_/
        .'  _;.    (_  \
       /  .'   `\   \\_/
      |_ /       |  |\\
     /  _)       /  / ||
    /  /       _/  /  //
    \_/       ( `-/  ||
              /  /   \\ .-.
              \_/     \'-'/
                       `"`
+============================================================================+

> _
```
