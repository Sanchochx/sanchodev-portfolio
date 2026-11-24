import { makeDraggable } from './windows';
import { registerAppWindow } from './appWindow';

makeDraggable(document.getElementById('chaos-window'), document.getElementById('chaos-titlebar'));
// Ruffle starts only after the open animation so loading it doesn't stutter the animation
function startChaos(): void {
  const container = document.getElementById('chaos-container');
  if (!container) return;
  if (container.firstElementChild) return;

  // Ruffle se descarga solo la primera vez que se abre la ventana
  loadRuffle().then((ruffle) => {
    if (container.firstElementChild || !chaosWindow.isOpen()) return;
    const player = ruffle.newest().createPlayer();
    player.style.width = '100%';
    player.style.height = '100%';
    container.appendChild(player);
    void player.load('/games/chaos_faction_2.swf');
  }).catch((err) => console.error('Ruffle failed to load', err));
}

interface RufflePlayerElement extends HTMLElement { load(url: string): Promise<void>; }
interface RuffleApi { newest(): { createPlayer(): RufflePlayerElement }; }
let rufflePromise: Promise<RuffleApi> | null = null;
function loadRuffle(): Promise<RuffleApi> {
  const get = (): RuffleApi | undefined => (window as unknown as { RufflePlayer?: RuffleApi }).RufflePlayer;
  rufflePromise ??= new Promise((resolve, reject) => {
    const existing = get();
    if (existing) { resolve(existing); return; }
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@ruffle-rs/ruffle@0.7.1/ruffle.js';
    script.onload = () => {
      const api = get();
      if (api) resolve(api); else reject(new Error('RufflePlayer missing'));
    };
    script.onerror = () => { rufflePromise = null; reject(new Error('Ruffle script blocked')); };
    document.head.appendChild(script);
  });
  return rufflePromise;
}
function stopChaos(): void {
  // Quitar el reproductor apaga el audio y libera memoria
  document.getElementById('chaos-container')?.replaceChildren();
}
const chaosWindow = registerAppWindow('chaos', { onOpened: startChaos, onClosing: stopChaos });

export {};
