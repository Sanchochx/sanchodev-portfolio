import { makeDraggable } from './windows';

makeDraggable(document.getElementById('chaos-window'), document.getElementById('chaos-titlebar'));
function openChaos(): void {
  const win = document.getElementById('chaos-window');
  const container = document.getElementById('chaos-container');
  if (!win || !container) return;
  win.classList.remove('hidden');
  if (container.firstElementChild) return;

  // Ruffle se descarga solo la primera vez que se abre la ventana
  loadRuffle().then((ruffle) => {
    if (container.firstElementChild || win.classList.contains('hidden')) return;
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
function closeChaos(): void {
  document.getElementById('chaos-window')?.classList.add('hidden');
  // Quitar el reproductor apaga el audio y libera memoria
  document.getElementById('chaos-container')?.replaceChildren();
}
const chaosIcon = document.getElementById('chaos-icon');
chaosIcon?.addEventListener('dblclick', openChaos);
chaosIcon?.addEventListener('keydown', (e) => { if (e.key === 'Enter') openChaos(); });
document.getElementById('chaos-close')?.addEventListener('click', closeChaos);

export {};
