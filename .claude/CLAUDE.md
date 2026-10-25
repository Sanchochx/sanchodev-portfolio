# portfolio_pro

## Description
Personal portfolio of Santiago Sánchez Márquez (full-stack developer) for recruiters and potential clients. The home page (`/`) is an interactive retro desktop ("RED LODGE") with mini-apps and games; the conventional portfolio lives at `/portfolio` and includes a chatbot that answers as Santiago. Production: https://sanchodev-portfolio.vercel.app

## Stack
- Astro 5, `output: 'server'` (SSR) with `@astrojs/vercel`
- TypeScript `strict`
- Tailwind CSS 3, tokens in `tailwind.config.mjs` (source of truth: `DESIGN.md`, "Cyber-Refined Narrative", dark theme)
- astro-icon + material-symbols, self-hosted fonts (Inter, Space Grotesk)
- Two OpenAI `gpt-4o-mini` bots sharing `src/lib/chat-guard.ts`: `/api/chat` (Santiago) and `/api/pactasis` (P.A.C.T.A.S.I.S terminal bot)
- `rss-parser` (Letterboxd feed) + TMDB API (Cinema app); js-dos 6.22 from CDN (DOOM, Wolfenstein 3D)
- `vercel.json` sets security headers (X-Frame-Options DENY, nosniff, HSTS, Permissions-Policy)
- No database, no auth, no tests or linter configured

## Key commands
```bash
npm install
npm run dev        # http://localhost:4321
npm run build
npm run preview
npm run check      # astro check (TypeScript)
```

## Structure
```
src/
  components/   ← /portfolio: Nav, Hero, SkillsBento, Projects, Contact, Footer, ChatWidget, CyberGrid
                  desktop apps: LetterboxdApp (Cinema), GamesApp (Videogames shelf)
  data/         ← projects.ts (Projects section), me.ts (chatbot context)
  layouts/      ← BaseLayout.astro (SEO, OG, mounts ChatWidget)
  lib/          ← chat-guard.ts (validation, rate limit, OpenAI call for both bots)
  pages/        ← index.astro (RED LODGE desktop), portfolio.astro, 404.astro,
                  api/chat.ts, api/pactasis.ts
  styles/       ← global.css
public/         ← images (logo, avatar, desktop icons, projects, 404, videogame_covers/), games/wolf3d.zip
```

## RED LODGE desktop (`src/pages/index.astro`)
- Hides Nav/Footer/ChatWidget via global CSS; CRT power-on animation; draggable windows; taskbar clock; ASCII terminal that rotates arts and sets a color theme (`data-theme`).
- Icons: My Portfolio (→ `/portfolio`), P.A.C.T.A.S.I.S, About Me (notepad), MS Paint, Cinema, Videogames, DOOM, 3D Pinball (iframe injected on open, removed on close), Wolfenstein 3D.
- Response is cached at the edge (`s-maxage=3600`) because Cinema queries Letterboxd/TMDB at render time.
- Videogames: add `{ id }` to `localGames` in `GamesApp.astro` plus `<id>.*` and `<id>-spine.*` in `public/images/videogame_covers/`.

## Conventions
- Code, file names and variables in English; components `PascalCase.astro`, data in `camelCase`.
- Projects are added in `src/data/projects.ts`; if they should appear in the chatbot, also update `LINKEDIN` in `src/data/me.ts`.
- Commits: Conventional Commits (`feat(chat): ...`, `fix(nav): ...`, `docs(readme): ...`).
- Branches: `main` is production; larger changes go in `feature/...` or `fix/...`.

## Important rules
1. Never hardcode credentials. `OPENAI_API_KEY` lives in `.env` (git-ignored) and in Vercel's environment variables.
2. Both bots keep their limits in `chat-guard.ts` (1000-char message, 6-message/6000-char history, 8 req/min and 60 req/h per IP) and `max_tokens` (400 `/api/chat`, 300 `/api/pactasis`); don't relax them without reason, every call costs money. P.A.C.T.A.S.I.S must keep refusing code, images and ASCII art.
3. Don't use `innerHTML` with user or model content; use `textContent`.
4. `me.ts` contains contact data sent to the model: review before adding sensitive information.
5. Follow `DESIGN.md` for colors, typography and spacing; don't introduce loose values outside the Tailwind tokens.
6. Review with the `code-review` skill before merging.

## Environment variables
```env
OPENAI_API_KEY=   # required for /api/chat and /api/pactasis
TMDB_API_KEY=     # optional; Cinema omits favorite posters without it
```

## Frontend Standards (summary applicable to this project)
- Accessibility is non-negotiable: keyboard navigation, `alt` on images, WCAG AA contrast, styled `focus-visible` (never `outline: none` without a replacement).
- Respect `prefers-reduced-motion`.
- Animate only `transform`, `opacity`, `filter`; 150–200 ms transitions for micro-interactions.
- Mobile-first; `clamp()` for fluid typography and spacing.
- Images with explicit dimensions (CLS = 0), `loading="lazy"` except above the fold; prefer WebP/AVIF.
- TypeScript without `any`; type the returns of public functions.
- No debugging `console.log` in production (server-side `console.error` is acceptable).
- Comments only for the *why*.

## Additional context
- [README.md](../README.md) · [DESIGN.md](../DESIGN.md)
- Repository: https://github.com/Sanchochx
