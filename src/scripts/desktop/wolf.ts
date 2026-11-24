import type { DosCommandInterface, DosFactory } from './dosTypes';
import { registerAppWindow } from './appWindow';

const WOLF_BUNDLE_URL = '/games/wolf3d.zip';
let wolfInstance: DosCommandInterface | null = null;
let wolfBooting = false;

// Boots only after the open animation so the emulator doesn't stutter it
function bootWolf(): void {
  const canvas = document.getElementById('jsdos-wolf') as HTMLCanvasElement | null;
  const Dos = (window as unknown as { Dos?: DosFactory }).Dos;
  if (!canvas) return;

  if (wolfInstance || wolfBooting || !Dos) return;
  wolfBooting = true;
  Dos(canvas, { wdosboxUrl: 'https://js-dos.com/6.22/current/wdosbox.js' }).ready((fs, main) => {
    fs.extract(WOLF_BUNDLE_URL)
      .then(() => main(['-c', 'WOLF3D.EXE']))
      .then((ci) => {
        // La ventana pudo cerrarse mientras cargaba
        if (!wolfWindow.isOpen()) void ci.exit();
        else wolfInstance = ci;
      })
      .catch((err) => console.error('Wolfenstein 3D failed to start', err))
      .finally(() => { wolfBooting = false; });
  });
}

function stopWolf(): void {
  const container = document.getElementById('wolf-container');
  if (!wolfInstance || !container) return;
  void wolfInstance.exit();
  wolfInstance = null;
  container.innerHTML = '<canvas id="jsdos-wolf" class="!w-full !h-full block object-contain"></canvas>';
}

const wolfWindow = registerAppWindow('wolf', { onOpened: bootWolf, onClosing: stopWolf });

export {};
