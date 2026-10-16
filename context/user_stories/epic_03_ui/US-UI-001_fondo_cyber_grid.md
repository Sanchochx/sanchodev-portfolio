# US-UI-001: Implementar fondo animado Cyber-Grid 3D (Suelo y Techo)

## Descripción
El usuario ha solicitado un fondo animado en color verde que muestre una cuadrícula en perspectiva (tanto en el suelo como en el techo, fugando hacia el centro de la pantalla), simulando un avance continuo hacia adelante en bucle infinito. 
Restricción técnica estricta: NO usar JavaScript (ni canvas ni librerías de 3D). Todo debe resolverse con CSS puro usando `perspective`, `rotateX`, pseudo-elementos, `linear-gradient` para dibujar la cuadrícula y `@keyframes` para animar el `background-position`.

## Criterios de Aceptación
- [x] **CA1: Crear Componente.** Crear `src/components/CyberGrid.astro`. Este componente contendrá el markup base (un contenedor principal oscuro con posición fija `z-[-1]` y dos planos, uno superior y uno inferior).
- [x] **CA2: Estilos y Cuadrícula (CSS).** Dibujar la cuadrícula verde (color tipo neón, ej. `#0f0` o `rgba(0, 255, 0, 0.4)`) usando `background-image: linear-gradient(...)` para líneas horizontales y verticales.
- [x] **CA3: Perspectiva 3D.** Aplicar `transform: perspective(1000px) rotateX(60deg)` al plano del suelo y `rotateX(-60deg)` al techo para lograr el efecto de la imagen de referencia. Un difuminado (mask-image o gradiente radial) en el centro/horizonte es ideal para suavizar el punto de fuga.
- [x] **CA4: Animación hacia adelante.** Crear una animación CSS con `@keyframes` que mueva el `background-position-y` de `0` a `[tamaño-de-celda]` en bucle lineal (`infinite linear`) para crear la ilusión de movimiento constante hacia adelante.
- [x] **CA5: Integración.** Importar e instanciar `<CyberGrid />` dentro de `src/layouts/BaseLayout.astro` justo al principio del `<body>` para que se aplique a todo el sitio.
