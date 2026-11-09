document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('crt-overlay');
  const beam = document.getElementById('crt-beam');
  if (!overlay || !beam) return;

  // Con reduced-motion se descubre el escritorio sin animación
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    overlay.style.display = 'none';
    return;
  }

  // Pequeña pausa negra inicial para crear expectación
  window.setTimeout(() => {
    beam.classList.add('animate-crt-beam');

    // Al 60% de la animación el rayo ya llena la pantalla: se quita el negro para revelar el escritorio
    window.setTimeout(() => overlay.classList.remove('bg-black'), 350);

    // Se retira del flujo para que los iconos del escritorio sean clickeables
    window.setTimeout(() => { overlay.style.display = 'none'; }, 800);
  }, 250);
});

export {};
