# Portafolio Personal — Santiago Sánchez Márquez

Portafolio construido con Astro en modo servidor (SSR) y desplegado en Vercel. Incluye un chatbot que responde como Santiago usando la API de OpenAI.

---

## Stack

- **Astro 5** con `output: 'server'` y adaptador `@astrojs/vercel`
- **TypeScript** en modo `strict`
- **Tailwind CSS 3** — sistema de diseño "Cyber-Refined Narrative" (ver `DESIGN.md`), tokens en `tailwind.config.mjs`
- **astro-icon** + `@iconify-json/material-symbols` — íconos como SVG inline en build
- **@fontsource/space-grotesk** + **@fontsource/inter** — tipografías self-hosted
- **@astrojs/sitemap** — sitemap automático
- **OpenAI `gpt-4o-mini`** — modelo del chatbot, llamado desde `src/pages/api/chat.ts`

---

## Comandos

| Comando | Descripción |
|---------|-------------|
| `npm install` | Instala dependencias |
| `npm run dev` | Dev server en `http://localhost:4321` |
| `npm run build` | Build de producción |
| `npm run preview` | Sirve el build localmente |
| `npm run check` | `astro check` (TypeScript + diagnostics) |

**Requisito**: Node.js ≥ 20.3.

---

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `OPENAI_API_KEY` | **Obligatoria.** Usada por `/api/chat`. En local va en `.env` (ignorado por git); en Vercel, en *Settings → Environment Variables*. |

---

## Deploy en Vercel

1. Importar el repositorio en Vercel (preset `Astro`).
2. Definir `OPENAI_API_KEY` para Production y Preview.
3. El dominio se configura en `SITE_URL` de `astro.config.mjs` (afecta canonical, OG y sitemap).

---

## Estructura

```
src/
├── components/     # Nav, Hero, SkillsBento, Projects, Contact, Footer, ChatWidget
├── data/
│   ├── projects.ts # Proyectos mostrados en la sección Projects
│   └── me.ts       # Contexto y system prompt del chatbot
├── layouts/
│   └── BaseLayout.astro  # <head>, SEO, OG, Twitter Card, ChatWidget
├── pages/
│   ├── index.astro       # Orquesta las secciones
│   └── api/chat.ts       # Endpoint POST del chatbot
├── content/config.ts     # Schema de la collection `projects` (sin entradas todavía)
└── styles/global.css     # Fuentes, directivas Tailwind, utilidades .glass
public/                   # Imágenes de proyectos, logo y CV (PDF)
DESIGN.md                 # Sistema de diseño
```

## Chatbot (`/api/chat`)

- Recibe `{ message, history }`; límite de 2000 caracteres por mensaje, 20 mensajes de historial y 500 tokens de respuesta.
- Rate limit en memoria de 10 peticiones por minuto por IP. Es *best-effort*: el estado es por instancia serverless, no una cuota global.
- El contexto (experiencia, proyectos, stack) vive en `src/data/me.ts`; al cambiarlo hay que redesplegar.

## Cómo añadir un proyecto

Agregar un objeto a `src/data/projects.ts` (con su imagen en `public/images/projects/`) y, si debe aparecer en el chatbot, actualizar también la sección *Projects* de `LINKEDIN` en `src/data/me.ts`.
