# Personal Portfolio — Santiago Sánchez Márquez

Portfolio built with Astro in server mode (SSR) and deployed on Vercel. It includes a chatbot that answers as Santiago using the OpenAI API.

---

## Stack

- **Astro 5** with `output: 'server'` and the `@astrojs/vercel` adapter
- **TypeScript** in `strict` mode
- **Tailwind CSS 3** — "Cyber-Refined Narrative" design system (see `DESIGN.md`), tokens in `tailwind.config.mjs`
- **astro-icon** + `@iconify-json/material-symbols` — icons inlined as SVG at build time
- **@fontsource/space-grotesk** + **@fontsource/inter** — self-hosted fonts
- **@astrojs/sitemap** — automatic sitemap
- **OpenAI `gpt-4o-mini`** — chatbot model, called from `src/pages/api/chat.ts`

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

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | **Required.** Used by `/api/chat`. Locally it goes in `.env` (git-ignored); on Vercel, in *Settings → Environment Variables*. |

---

## Deploying to Vercel

1. Import the repository in Vercel (`Astro` preset).
2. Set `OPENAI_API_KEY` for Production and Preview.
3. The domain is configured in `SITE_URL` in `astro.config.mjs` (affects canonical, OG and sitemap).

---

## Structure

```
src/
├── components/     # Nav, Hero, SkillsBento, Projects, Contact, Footer, ChatWidget, CyberGrid
├── data/
│   ├── projects.ts # Projects shown in the Projects section
│   └── me.ts       # Chatbot context and system prompt
├── layouts/
│   └── BaseLayout.astro  # <head>, SEO, OG, Twitter Card, ChatWidget
├── pages/
│   ├── index.astro       # RED LODGE: interactive desktop (home page)
│   ├── portfolio.astro   # Portfolio: assembles the sections
│   ├── 404.astro         # Custom error page
│   └── api/chat.ts       # Chatbot POST endpoint
└── styles/global.css     # Fonts, Tailwind directives, .glass utilities
public/                   # Images (projects, 404), logo and CV (PDF)
DESIGN.md                 # Design system
```

## Chatbot (`/api/chat`)

- Receives `{ message, history }`; limits of 2000 characters per message, 20 history messages and 500 response tokens.
- In-memory rate limit of 10 requests per minute per IP. It is *best-effort*: state is per serverless instance, not a global quota.
- The context (experience, projects, stack) lives in `src/data/me.ts`; changing it requires a redeploy.

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
