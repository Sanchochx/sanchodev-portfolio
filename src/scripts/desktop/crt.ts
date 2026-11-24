document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('crt-overlay');
  const beam = document.getElementById('crt-beam');
  // welcome.ts espera a que el escritorio sea visible para abrir su ventana
  const revealed = (): void => { window.dispatchEvent(new Event('crt:revealed')); };
  if (!overlay || !beam) { revealed(); return; }

  // Con reduced-motion se descubre el escritorio sin animación
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    overlay.style.display = 'none';
    revealed();
    return;
  }

  // Pequeña pausa negra inicial para crear expectación
  window.setTimeout(() => {
    beam.classList.add('animate-crt-beam');

    // Al 60% de la animación el rayo ya llena la pantalla: se quita el negro para revelar el escritorio
    window.setTimeout(() => {
      overlay.classList.remove('bg-black');
      revealed();
    }, 350);

    // Se retira del flujo para que los iconos del escritorio sean clickeables
    window.setTimeout(() => { overlay.style.display = 'none'; }, 800);
  }, 250);
});

export {};
