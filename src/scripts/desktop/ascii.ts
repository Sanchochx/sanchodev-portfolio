import { KIRBY, ORANGE, BLUE, PURPLE, WHITE, RED, SILHOUETTE, PENGUIN, PURPLE_FIGURE, GREEN } from '../../data/asciiArts';

const asciiContent = document.getElementById('ascii-content');

if (asciiContent) {
  type AsciiArt = { colorClass: string; content: string; theme?: string };

  // El primer arte es el que ya viene en el HTML
  const arts: AsciiArt[] = [
    { colorClass: 'rainbow-text', content: asciiContent.textContent ?? '' },
    { colorClass: 'theme-text', content: PURPLE, theme: 'purple' },
    { colorClass: 'theme-text', content: WHITE, theme: 'white' },
    { colorClass: 'theme-text', content: GREEN, theme: 'green' },
    { colorClass: 'theme-text', content: KIRBY, theme: 'pink' },
    { colorClass: 'theme-text', content: RED, theme: 'red' },
    { colorClass: 'theme-text', content: BLUE, theme: 'blue' },
    { colorClass: 'theme-text', content: PENGUIN, theme: 'orange' },
    { colorClass: 'theme-text', content: PURPLE_FIGURE, theme: 'purple' },
    { colorClass: 'theme-text', content: ORANGE, theme: 'orange' },
    { colorClass: 'theme-text', content: SILHOUETTE, theme: 'white' },
  ];

  const terminalWindow = document.getElementById('terminal-window');
  const stage = asciiContent.closest('.perspective-container');

  // Ajusta el tamaño de fuente para que cada arte llene la ventana pequeña sin recortarse
  const fit = (text: string): void => {
    if (!stage) return;
    const lines = text.split('\n');
    const cols = Math.max(...lines.map((l) => l.length));
    const byWidth = (stage.clientWidth - 8) / (cols * 0.65);
    const byHeight = (stage.clientHeight - 8) / (lines.length * 1.25);
    asciiContent.style.fontSize = `${Math.max(6, Math.min(14, byWidth, byHeight))}px`;
  };
  let index = 0;

  const show = (): void => {
    const art = arts[index];
    asciiContent.classList.remove(...arts.map((a) => a.colorClass));
    asciiContent.classList.add(art.colorClass);
    asciiContent.textContent = art.content;
    fit(art.content);
    if (!terminalWindow) return;
    if (art.theme) terminalWindow.dataset.theme = art.theme;
    else delete terminalWindow.dataset.theme;
  };

  fit(arts[0].content);
  window.addEventListener('resize', () => fit(arts[index].content));

  setInterval(() => {
    index = (index + 1) % arts.length;
    asciiContent.style.opacity = '0';
    setTimeout(() => {
      show();
      asciiContent.style.opacity = '1';
    }, 300);
  }, 5000);
}

export {};
