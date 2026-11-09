function openNotepad(): void {
  document.getElementById('notepad-window')?.classList.remove('hidden');
}

function closeNotepad(): void {
  document.getElementById('notepad-window')?.classList.add('hidden');
}

const notepadIcon = document.getElementById('notepad-icon');
notepadIcon?.addEventListener('dblclick', openNotepad);
notepadIcon?.addEventListener('keydown', (e) => { if (e.key === 'Enter') openNotepad(); });
document.getElementById('notepad-close')?.addEventListener('click', closeNotepad);

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
document.getElementById('terminal-close')?.addEventListener('click', () => {
  document.getElementById('terminal-window')?.classList.add('hidden');
});
function openAscii(): void {
  document.getElementById('terminal-window')?.classList.remove('hidden');
}
const asciiIcon = document.getElementById('ascii-icon');
asciiIcon?.addEventListener('dblclick', openAscii);
asciiIcon?.addEventListener('keydown', (e) => { if (e.key === 'Enter') openAscii(); });

// Cinema (Letterboxd/TMDB)
makeDraggable(document.getElementById('cine-window'), document.getElementById('cine-titlebar'));
function openCine(): void {
  document.getElementById('cine-window')?.classList.remove('hidden');
}
const cineIcon = document.getElementById('cine-icon');
cineIcon?.addEventListener('dblclick', openCine);
cineIcon?.addEventListener('keydown', (e) => { if (e.key === 'Enter') openCine(); });
document.getElementById('cine-close')?.addEventListener('click', () => {
  document.getElementById('cine-window')?.classList.add('hidden');
});

// Videogames
makeDraggable(document.getElementById('games-window'), document.getElementById('games-titlebar'));
function openGames(): void {
  document.getElementById('games-window')?.classList.remove('hidden');
}
const gamesIcon = document.getElementById('games-icon');
gamesIcon?.addEventListener('dblclick', openGames);
gamesIcon?.addEventListener('keydown', (e) => { if (e.key === 'Enter') openGames(); });
document.getElementById('games-close')?.addEventListener('click', () => {
  document.getElementById('games-window')?.classList.add('hidden');
});
