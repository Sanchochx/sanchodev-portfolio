# portfolio_pro

## Description
Personal portfolio of Santiago Sánchez Márquez (full-stack developer) for recruiters and potential clients. Showcases projects, stack and contact info, and includes a chatbot that answers as Santiago. Production: https://sanchodev-portfolio.vercel.app

## Stack
- Astro 5, `output: 'server'` (SSR) with `@astrojs/vercel`
- TypeScript `strict`
- Tailwind CSS 3, tokens in `tailwind.config.mjs` (source of truth: `DESIGN.md`, "Cyber-Refined Narrative", dark theme)
- astro-icon + material-symbols, self-hosted fonts (Inter, Space Grotesk)
- Chatbot: OpenAI `gpt-4o-mini` via `src/pages/api/chat.ts`
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
  components/   ← Nav, Hero, SkillsBento, Projects, Contact, Footer, ChatWidget
  data/         ← projects.ts (Projects section), me.ts (chatbot context)
  layouts/      ← BaseLayout.astro (SEO, OG, mounts ChatWidget)
  pages/        ← index.astro, api/chat.ts
  styles/       ← global.css
public/         ← images, logo, CV (PDF)
```

## Conventions
- Code, file names and variables in English; components `PascalCase.astro`, data in `camelCase`.
- Projects are added in `src/data/projects.ts`; if they should appear in the chatbot, also update `LINKEDIN` in `src/data/me.ts`.
- Commits: Conventional Commits (`feat(chat): ...`, `fix(nav): ...`, `docs(readme): ...`).
- Branches: `main` is production; larger changes go in `feature/...` or `fix/...`.

## Important rules
1. Never hardcode credentials. `OPENAI_API_KEY` lives in `.env` (git-ignored) and in Vercel's environment variables.
2. `/api/chat` keeps its limits (message length, history, `max_tokens`, rate limit); don't relax them without reason, every call costs money.
3. Don't use `innerHTML` with user or model content; use `textContent`.
4. `me.ts` contains contact data sent to the model: review before adding sensitive information.
5. Follow `DESIGN.md` for colors, typography and spacing; don't introduce loose values outside the Tailwind tokens.
6. Review with the `code-review` skill before merging.

## Environment variables
```env
OPENAI_API_KEY=   # required for /api/chat
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
