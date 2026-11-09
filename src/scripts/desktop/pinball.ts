function openPinball(): void {
  const win = document.getElementById('pinball-window');
  const container = document.getElementById('pinball-container');
  if (!win || !container) return;
  win.classList.remove('hidden');

  const existing = container.querySelector('iframe');
  if (existing) { existing.focus(); return; }
  const frame = document.createElement('iframe');
  frame.src = 'https://pinball.alula.me/';
  frame.title = '3D Pinball - Space Cadet';
  frame.className = 'w-full h-full border-none';
  frame.allow = 'autoplay; fullscreen; gamepad';
  frame.sandbox.add('allow-scripts', 'allow-same-origin', 'allow-pointer-lock');
  frame.referrerPolicy = 'no-referrer';
  // Sin foco en el iframe, las teclas de las paletas se quedan en la página padre
  frame.addEventListener('load', () => frame.focus());
  container.appendChild(frame);
  frame.focus();
}

function closePinball(): void {
  document.getElementById('pinball-window')?.classList.add('hidden');
  // Quitar el iframe apaga el audio y libera memoria
  document.getElementById('pinball-container')?.replaceChildren();
}

const pinballIcon = document.getElementById('pinball-icon');
pinballIcon?.addEventListener('dblclick', openPinball);
pinballIcon?.addEventListener('keydown', (e) => { if (e.key === 'Enter') openPinball(); });
document.getElementById('pinball-close')?.addEventListener('click', closePinball);
// Clicks on the title bar or edges would otherwise leave focus outside the game
document.getElementById('pinball-window')?.addEventListener('click', (e) => {
  if ((e.target as HTMLElement).closest('#pinball-close')) return;
  document.querySelector<HTMLIFrameElement>('#pinball-container iframe')?.focus();
});

export {};
