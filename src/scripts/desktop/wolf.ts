import type { DosCommandInterface, DosFactory } from './dosTypes';

const WOLF_BUNDLE_URL = '/games/wolf3d.zip';
let wolfInstance: DosCommandInterface | null = null;
let wolfBooting = false;

function openWolf(): void {
  const win = document.getElementById('wolf-window');
  const canvas = document.getElementById('jsdos-wolf') as HTMLCanvasElement | null;
  const Dos = (window as unknown as { Dos?: DosFactory }).Dos;
  if (!win || !canvas) return;
  win.classList.remove('hidden');

  if (wolfInstance || wolfBooting || !Dos) return;
  wolfBooting = true;
  Dos(canvas, { wdosboxUrl: 'https://js-dos.com/6.22/current/wdosbox.js' }).ready((fs, main) => {
    fs.extract(WOLF_BUNDLE_URL)
      .then(() => main(['-c', 'WOLF3D.EXE']))
      .then((ci) => {
        // La ventana pudo cerrarse mientras cargaba
        if (win.classList.contains('hidden')) void ci.exit();
        else wolfInstance = ci;
      })
      .catch((err) => console.error('Wolfenstein 3D failed to start', err))
      .finally(() => { wolfBooting = false; });
  });
}

function closeWolf(): void {
  document.getElementById('wolf-window')?.classList.add('hidden');
  const container = document.getElementById('wolf-container');
  if (!wolfInstance || !container) return;
  void wolfInstance.exit();
  wolfInstance = null;
  container.innerHTML = '<canvas id="jsdos-wolf" class="!w-full !h-full block object-contain"></canvas>';
}

const wolfIcon = document.getElementById('wolf-icon');
wolfIcon?.addEventListener('dblclick', openWolf);
wolfIcon?.addEventListener('keydown', (e) => { if (e.key === 'Enter') openWolf(); });
document.getElementById('wolf-close')?.addEventListener('click', closeWolf);

export {};
