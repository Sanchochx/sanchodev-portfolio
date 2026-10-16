# TASK_EXECUTION — flujo de trabajo por Historia de Usuario

Contexto: portafolio en Astro 5 + Tailwind. Las mejoras visuales no añaden JS de runtime (CSS puro cuando sea posible).

## Flujo
1. Tomar la siguiente US `[ ]` de `IMPLEMENTATION_PLAN.md` y marcarla `[~]`.
2. Leer su archivo en `context/user_stories/` y los criterios de aceptación (CA).
3. Implementar CA por CA, respetando `DESIGN.md` y los tokens de `tailwind.config.mjs` (sin valores sueltos).
4. Verificar: `npm run check` y `npm run build` sin errores; revisión visual en `npm run dev` (móvil y escritorio).
5. Marcar los CA cumplidos `[x]` en la US; al cumplirlos todos, marcar la US `[x]` en el plan.
6. Revisar con el skill `code-review` antes de merge. Commit con Conventional Commits (`feat(ui): ...`).

## Reglas de calidad
- Accesibilidad: decoración con `aria-hidden="true"`, `pointer-events: none`, contraste AA del contenido intacto.
- Respetar `prefers-reduced-motion`.
- Sin `console.log`, sin `any`, comentarios solo para el *por qué*.
