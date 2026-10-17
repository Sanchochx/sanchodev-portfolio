# US-UI-002: Implementar animaciones Cyber Blur Reveal

## Descripción
Añadir animaciones de aparición fluida a los elementos de la interfaz. Para los elementos iniciales (Hero, Nav, Chat), la animación debe ocurrir en cascada al cargar. Para el contenido inferior (Bio, Bento, Contacto, Footer), la animación debe activarse mediante scroll. Para respetar el performance, se usará CSS para las transiciones y un `IntersectionObserver` ligero y nativo.

## Criterios de Aceptación
- [x] **CA1: Clases CSS Globales.** En `src/styles/global.css`, crear las clases `.reveal-hidden` (estado inicial: `opacity: 0`, `transform: translateY(30px)`, `filter: blur(10px)`) y `.reveal-visible` (estado final: todo a su valor original), junto con una transición suave (`cubic-bezier(0.2, 0.8, 0.2, 1)` de unos `0.8s`). Añadir también clases utilitarias para delays (`.delay-100`, `.delay-200`, etc.). Respetar `prefers-reduced-motion` anulando transform y blur si está activo.
- [x] **CA2: Lógica de Scroll (JS).** En `src/layouts/BaseLayout.astro`, justo antes de cerrar el `<body>`, añadir un `<script>` puro que instancie un `IntersectionObserver`. Este debe buscar todos los elementos con `.reveal-hidden` y añadirles la clase `.reveal-visible` cuando crucen el threshold (ej. 10% visible). Una vez revelado, debe dejar de observar el elemento (`unobserve`).
- [x] **CA3: Aplicación en Componentes (Load).** En `src/components/Hero.astro`, añadir `.reveal-hidden` y `.reveal-visible` directamente al contenedor del nombre y subtítulos (para que aparezcan de inmediato al cargar). Añadir delays escalonados a sus elementos internos. Añadir también estas clases al contenedor del Chat Widget.
- [x] **CA4: Aplicación en Componentes (Scroll).** En `Bio.astro`, `SkillsBento.astro`, `Contact.astro` y `Footer.astro`, envolver o añadir la clase `.reveal-hidden` a los contenedores principales para que el observer del BaseLayout los intercepte al hacer scroll.

## Notas de implementación
- Sustituye el sistema previo `[data-reveal]` / `.revealed`; `Projects.astro` también se migró para no mantener dos sistemas.
- Con ambas clases en el markup no hay cambio de estado que transicionar, por lo que `.reveal-hidden.reveal-visible` reproduce un `@keyframes reveal-in`.
- Al terminar la animación el script retira las clases `reveal-*` y `delay-*` para no pisar las transiciones de hover (`glass-hover`).
- `Nav.astro` no se modificó (no está en los CA).
