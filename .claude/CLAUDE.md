# portfolio_pro

## Descripción
Portafolio personal de Santiago Sánchez Márquez (desarrollador full-stack) para reclutadores y clientes potenciales. Muestra proyectos, stack y contacto, e incluye un chatbot que responde como Santiago. Producción: https://sanchodev-portfolio.vercel.app

## Stack
- Astro 5, `output: 'server'` (SSR) con `@astrojs/vercel`
- TypeScript `strict`
- Tailwind CSS 3, tokens en `tailwind.config.mjs` (fuente de verdad: `DESIGN.md`, "Cyber-Refined Narrative", tema oscuro)
- astro-icon + material-symbols, fuentes self-hosted (Inter, Space Grotesk)
- Chatbot: OpenAI `gpt-4o-mini` vía `src/pages/api/chat.ts`
- Sin base de datos, sin auth, sin tests ni linter configurados

## Comandos clave
```bash
npm install
npm run dev        # http://localhost:4321
npm run build
npm run preview
npm run check      # astro check (TypeScript)
```

## Estructura
```
src/
  components/   ← Nav, Hero, SkillsBento, Projects, Contact, Footer, ChatWidget
  data/         ← projects.ts (sección Projects), me.ts (contexto del chatbot)
  layouts/      ← BaseLayout.astro (SEO, OG, monta ChatWidget)
  pages/        ← index.astro, api/chat.ts
  styles/       ← global.css
public/         ← imágenes, logo, CV (PDF)
```

## Convenciones
- Código, nombres de archivos y variables en inglés; componentes `PascalCase.astro`, datos en `camelCase`.
- Los proyectos se agregan en `src/data/projects.ts`; si deben aparecer en el chatbot, actualizar también `LINKEDIN` en `src/data/me.ts`.
- Commits: Conventional Commits (`feat(chat): ...`, `fix(nav): ...`, `docs(readme): ...`).
- Ramas: `main` es producción; cambios grandes en `feature/...` o `fix/...`.

## Reglas importantes
1. Nunca hardcodear credenciales. `OPENAI_API_KEY` vive en `.env` (ignorado) y en las variables de Vercel.
2. `/api/chat` mantiene sus límites (longitud de mensaje, historial, `max_tokens`, rate limit); no relajarlos sin motivo, cada llamada cuesta dinero.
3. No usar `innerHTML` con contenido del usuario o del modelo; usar `textContent`.
4. `me.ts` contiene datos de contacto enviados al modelo: revisar antes de añadir información sensible.
5. Seguir `DESIGN.md` para colores, tipografía y espaciado; no introducir valores sueltos fuera de los tokens de Tailwind.
6. Revisar con el skill `code-review` antes de hacer merge.

## Variables de entorno
```env
OPENAI_API_KEY=   # obligatoria para /api/chat
```

## Frontend Standards (resumen aplicable a este proyecto)
- Accesibilidad no negociable: navegación por teclado, `alt` en imágenes, contraste WCAG AA, `focus-visible` estilizado (nunca `outline: none` sin reemplazo).
- Respetar `prefers-reduced-motion`.
- Animar solo `transform`, `opacity`, `filter`; transiciones de 150–200 ms en micro-interacciones.
- Mobile-first; `clamp()` para tipografía y espaciado fluidos.
- Imágenes con dimensiones explícitas (CLS = 0), `loading="lazy"` salvo above-the-fold; preferir WebP/AVIF.
- TypeScript sin `any`; tipar returns de funciones públicas.
- Sin `console.log` de depuración en producción (los `console.error` del servidor son aceptables).
- Comentarios solo para el *por qué*.

## Contexto adicional
- [README.md](../README.md) · [DESIGN.md](../DESIGN.md)
- Repositorio: https://github.com/Sanchochx
