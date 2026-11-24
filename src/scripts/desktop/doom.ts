import type { DosCommandInterface, DosFactory } from './dosTypes';
import { registerAppWindow } from './appWindow';

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

// Boots only after the open animation so the emulator doesn't stutter it
function bootDoom(): void {
  const canvas = document.getElementById('jsdos') as HTMLCanvasElement | null;
  const Dos = (window as unknown as { Dos?: DosFactory }).Dos;
  if (!canvas) return;

  if (dosInstance || booting || !Dos) return;
  booting = true;
  Dos(canvas, { wdosboxUrl: 'https://js-dos.com/6.22/current/wdosbox.js' }).ready((fs, main) => {
    fs.extract('https://js-dos.com/cdn/upload/DOOM-@evilution.zip')
      .then(() => main(['-c', 'cd DOOM', '-c', 'DOOM.EXE']))
      .then((ci) => {
        // La ventana pudo cerrarse mientras cargaba
        if (!doomWindow.isOpen()) void ci.exit();
        else dosInstance = ci;
      })
      .catch((err) => console.error('DOOM failed to start', err))
      .finally(() => { booting = false; });
  });
}

function stopDoom(): void {
  const container = document.getElementById('dos-container');
  if (!dosInstance || !container) return;
  void dosInstance.exit();
  dosInstance = null;
  container.innerHTML = '<canvas id="jsdos" class="!w-full !h-full block object-contain"></canvas>';
}

const doomWindow = registerAppWindow('doom', { onOpened: bootDoom, onClosing: stopDoom });
export {};
