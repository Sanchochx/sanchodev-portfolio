import { registerAppWindow } from './appWindow';

// The iframe is injected only after the open animation so loading it doesn't stutter the animation
function startPinball(): void {
  const container = document.getElementById('pinball-container');
  if (!container) return;

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

function stopPinball(): void {
  // Quitar el iframe apaga el audio y libera memoria
  document.getElementById('pinball-container')?.replaceChildren();
}

registerAppWindow('pinball', { onOpened: startPinball, onClosing: stopPinball });
// Clicks on the title bar or edges would otherwise leave focus outside the game
document.getElementById('pinball-window')?.addEventListener('click', (e) => {
  if ((e.target as HTMLElement).closest('#pinball-close')) return;
  document.querySelector<HTMLIFrameElement>('#pinball-container iframe')?.focus();
});

export {};
