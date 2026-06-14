# Portafolio Personal — Santiago Sánchez Márquez

Portafolio estático construido con Astro. Sin backend, sin formularios, sin runtime JS más allá del estrictamente necesario.

---

## Stack

- **Astro 5** (output estático)
- **TypeScript** en modo `strict`
- **Tailwind CSS 3** — sistema de diseño "Cyber-Refined Narrative" mapeado 1:1 en `tailwind.config.mjs`
- **astro-icon** + `@iconify-json/material-symbols` — íconos resueltos a SVG inline en build
- **@fontsource/space-grotesk** + **@fontsource/inter** — tipografías self-hosted
- **@astrojs/sitemap** — sitemap generado automáticamente

Sin React, sin CDN de Google Fonts, sin Tailwind CDN.

---

## Comandos

| Comando | Descripción |
|---------|-------------|
| `npm install` | Instala dependencias |
| `npm run dev` | Levanta el dev server en `http://localhost:4321` |
| `npm run build` | Genera el build estático en `dist/` |
| `npm run preview` | Sirve el build localmente para verificar producción |
| `npm run check` | Ejecuta `astro check` (TypeScript + diagnostics) |

**Requisito**: Node.js ≥ 20.3 (Astro 5).

---

## Deploy a Cloudflare Pages

1. Conectar el repositorio en el dashboard de Cloudflare Pages.
2. Configurar el proyecto con:
   - **Framework preset**: `Astro`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node version**: `20` (variable de entorno `NODE_VERSION=20`)
3. Variables de entorno:
   - `OPENAI_API_KEY` — **obligatoria**. Usada por la Pages Function `functions/api/chat.ts` que alimenta el chat widget (modelo `gpt-4o-mini`). Configurar en *Settings → Environment variables* de Cloudflare Pages, scope **Production** y **Preview**.

Referencia oficial: [Cloudflare Pages — Astro framework guide](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/).

---

## Pendientes de edición manual

Antes del deploy, completar los siguientes `// TODO:` para evitar publicar con datos placeholder:

| Archivo | Ubicación | Qué editar |
|---------|-----------|------------|
| `src/components/Contact.astro` | `emailHref` / `emailDisplay` | Correo electrónico real |
| `src/components/Contact.astro` | `githubHref` | URL absoluta del perfil de GitHub |
| `src/components/Contact.astro` | `linkedinHref` | URL absoluta del perfil de LinkedIn |
| `src/components/Footer.astro` | `sourceHref` | URL del repositorio fuente del portafolio |
| `src/components/Nav.astro` | `<a>` "RESUME" | URL del PDF del CV |
| `src/components/Bio.astro` | `portraitSrc` | Ruta a la imagen del retrato (e.g. `/images/portrait.jpg` en `public/`) |
| `astro.config.mjs` | `SITE_URL` | Dominio definitivo (afecta canonical, OG y sitemap) |
| `public/og-default.png` | — | Imagen Open Graph por defecto (1200×630 recomendado) |

Una vez editados, los hrefs `// TODO:` literales causarán enlaces visiblemente rotos hasta que se reemplacen — esto es intencional para impedir un deploy descuidado.

---

## Estructura del proyecto

```
portfolio_pro/
├── src/
│   ├── components/         # 6 componentes .astro del portafolio
│   │   ├── Nav.astro       # Navegación glassmorphism flotante
│   │   ├── Hero.astro      # Presentación centrada
│   │   ├── Bio.astro       # Grid asimétrico 7/5 con retrato
│   │   ├── SkillsBento.astro  # Bento de 9 celdas con material-symbols
│   │   ├── Contact.astro   # Bloque de contacto con glow lateral
│   │   └── Footer.astro    # Footer minimalista con año dinámico
│   ├── content/
│   │   ├── config.ts       # Schema Zod de la Collection `projects`
│   │   └── projects/       # Vacío — añadir .md/.mdx con title, slug, tech[], etc.
│   ├── layouts/
│   │   └── BaseLayout.astro  # <html>, <head>, SEO, OG, Twitter Card
│   ├── pages/
│   │   └── index.astro     # Orquesta Nav + Hero + Bio + SkillsBento + Contact + Footer
│   └── styles/
│       └── global.css      # @fontsource imports, Tailwind directives, .glass utilities
├── astro.config.mjs         # Integraciones: tailwind, sitemap, astro-icon
├── tailwind.config.mjs      # Tokens 1:1 con DESIGN.md
├── DESIGN.md                # Sistema de diseño completo
├── INITIAL_SETUP.txt        # Brief funcional original
├── IMPLEMENTATION_PLAN.md   # Plan maestro con progreso por épica
└── user_stories/            # Historias de usuario detalladas por épica
```

### Cómo añadir un proyecto a la Collection

Crear `src/content/projects/<slug>.md` con frontmatter:

```yaml
---
title: "Mi Proyecto"
slug: "mi-proyecto"
description: "Descripción breve."
tech: ["Astro", "TypeScript", "Tailwind"]
github: "https://github.com/usuario/repo"
demo: "https://demo.example.com"
featured: true
order: 1
---

Cuerpo del proyecto en Markdown.
```

El schema Zod en `src/content/config.ts` valida la estructura en build.

---

## Comando para empezar

```bash
npm install && npm run dev
```

Abre http://localhost:4321 — Astro recargará en caliente al editar componentes o estilos.
