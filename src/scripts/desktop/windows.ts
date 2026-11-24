import { registerAppWindow } from './appWindow';
import { createTypewriter } from './typewriter';

// About Me: the text and specs are typed like the welcome window (a bit faster: it is longer).
// Only on the first open of each visit, and never under reduced motion (onOpening doesn't run then).
const NOTEPAD_TYPE_MS = 18;
const notepad = document.getElementById('notepad-window');
const notepadTyper = createTypewriter(notepad ? Array.from(notepad.querySelectorAll<HTMLElement>('[data-type]')) : [], NOTEPAD_TYPE_MS);
let notepadTypedOnce = false;
let notepadTyping = false;

registerAppWindow('notepad', {
  onOpening: () => {
    if (notepadTypedOnce) return;
    notepadTypedOnce = true;
    notepadTyping = true;
    notepadTyper.prepare();
  },
  onOpened: () => {
    if (!notepadTyping) return;
    notepadTyper.run(() => {
      notepadTyping = false;
    });
  },
  onClosing: () => {
    if (!notepadTyping) return;
    notepadTyping = false;
    notepadTyper.finish();
  },
});

export function makeDraggable(win: HTMLElement | null, bar: HTMLElement | null): void {
  if (!win || !bar) return;
  let offsetX = 0;
  let offsetY = 0;

  const move = (e: PointerEvent): void => {
    const maxX = Math.max(0, window.innerWidth - win.offsetWidth);
    const maxY = Math.max(0, window.innerHeight - win.offsetHeight);
    win.style.left = `${Math.min(Math.max(0, e.clientX - offsetX), maxX)}px`;
    win.style.top = `${Math.min(Math.max(0, e.clientY - offsetY), maxY)}px`;
  };

  bar.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || (e.target as HTMLElement).closest('button')) return;
    // Pasa del posicionamiento por CSS a posición explícita al primer arrastre
    const rect = win.getBoundingClientRect();
    win.style.inset = 'auto';
    win.style.margin = '0';
    win.style.left = `${rect.left}px`;
    win.style.top = `${rect.top}px`;
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    bar.setPointerCapture(e.pointerId);
    bar.addEventListener('pointermove', move);
  });

  const stop = (e: PointerEvent): void => {
    bar.removeEventListener('pointermove', move);
    if (bar.hasPointerCapture(e.pointerId)) bar.releasePointerCapture(e.pointerId);
  };
  bar.addEventListener('pointerup', stop);
  bar.addEventListener('pointercancel', stop);
}
makeDraggable(document.getElementById('notepad-window'), document.getElementById('notepad-titlebar'));
makeDraggable(document.getElementById('terminal-window'), document.getElementById('terminal-titlebar'));
// The ASCII icon that reopens the welcome window is handled in welcome.ts

// Cinema (Letterboxd/TMDB)
makeDraggable(document.getElementById('cine-window'), document.getElementById('cine-titlebar'));
registerAppWindow('cine');

// Videogames
makeDraggable(document.getElementById('games-window'), document.getElementById('games-titlebar'));
registerAppWindow('games');
