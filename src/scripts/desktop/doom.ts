import type { DosCommandInterface, DosFactory } from './dosTypes';

let dosInstance: DosCommandInterface | null = null;
let booting = false;

// js-dos reescribe document.title al arrancar/cerrar; lo restauramos.
const pageTitle = document.title;
const titleEl = document.querySelector('title');
if (titleEl) {
  new MutationObserver(() => {
    if (document.title !== pageTitle) document.title = pageTitle;
  }).observe(titleEl, { childList: true, characterData: true, subtree: true });
}

function openDoom(): void {
  const win = document.getElementById('doom-window');
  const canvas = document.getElementById('jsdos') as HTMLCanvasElement | null;
  const Dos = (window as unknown as { Dos?: DosFactory }).Dos;
  if (!win || !canvas) return;
  win.classList.remove('hidden');

  if (dosInstance || booting || !Dos) return;
  booting = true;
  Dos(canvas, { wdosboxUrl: 'https://js-dos.com/6.22/current/wdosbox.js' }).ready((fs, main) => {
    fs.extract('https://js-dos.com/cdn/upload/DOOM-@evilution.zip')
      .then(() => main(['-c', 'cd DOOM', '-c', 'DOOM.EXE']))
      .then((ci) => {
        // La ventana pudo cerrarse mientras cargaba
        if (win.classList.contains('hidden')) void ci.exit();
        else dosInstance = ci;
      })
      .catch((err) => console.error('DOOM failed to start', err))
      .finally(() => { booting = false; });
  });
}

function closeDoom(): void {
  document.getElementById('doom-window')?.classList.add('hidden');
  const container = document.getElementById('dos-container');
  if (!dosInstance || !container) return;
  void dosInstance.exit();
  dosInstance = null;
  container.innerHTML = '<canvas id="jsdos" class="!w-full !h-full block object-contain"></canvas>';
}

const icon = document.getElementById('doom-icon');
icon?.addEventListener('dblclick', openDoom);
icon?.addEventListener('keydown', (e) => { if (e.key === 'Enter') openDoom(); });
document.getElementById('doom-close')?.addEventListener('click', closeDoom);
export {};
