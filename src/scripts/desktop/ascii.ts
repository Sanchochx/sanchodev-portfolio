import { KIRBY, ORANGE, BLUE, PURPLE, WHITE, RED, SILHOUETTE, PENGUIN, PURPLE_FIGURE, GREEN } from '../../data/asciiArts';

// ASCII stage of the welcome window. welcome.ts decides when to reveal, spin and stop it.
type AsciiArt = { colorClass: string; content: string; theme?: string };

const REVEAL_MS = 1000;
const FADE_MS = 300;
// Switch to the next art every N full turns of the CSS spin
const TURNS_PER_ART = 2;

const pre = document.getElementById('ascii-content');
const spinner = document.getElementById('ascii-spinner');
const terminalWindow = document.getElementById('terminal-window');
const stage = pre?.closest<HTMLElement>('.perspective-container') ?? null;

// The first art is the one already in the HTML
const arts: AsciiArt[] = [
  { colorClass: 'rainbow-text', content: pre?.textContent ?? '' },
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

let index = 0;
let turns = 0;
let spinning = false;
let revealTimer: number | undefined;
let fadeTimer: number | undefined;

// Sizes the font so each art fills the stage without clipping (line-height is 1, see the <pre>)
function fit(text: string): void {
  if (!pre || !stage || !stage.clientWidth) return;
  const lines = text.split('\n');
  const cols = Math.max(...lines.map((l) => l.length));
  const byWidth = (stage.clientWidth - 8) / (cols * 0.62);
  const byHeight = (stage.clientHeight - 8) / lines.length;
  pre.style.fontSize = `${Math.max(6, Math.min(14, byWidth, byHeight))}px`;
}

function applyArt(art: AsciiArt): void {
  if (!pre) return;
  pre.classList.remove(...new Set(arts.map((a) => a.colorClass)));
  pre.classList.add(art.colorClass);
  pre.textContent = art.content;
  fit(art.content);
  if (!terminalWindow) return;
  if (art.theme) terminalWindow.dataset.theme = art.theme;
  else delete terminalWindow.dataset.theme;
}

function clearTimers(): void {
  window.clearInterval(revealTimer);
  window.clearTimeout(fadeTimer);
  revealTimer = undefined;
  fadeTimer = undefined;
}

// Blank lines of the same width keep the art's box fixed while it is revealed
const blank = (line: string): string => ' '.repeat(line.length);

/** Shows the first art with every line blanked, ready for revealAscii(). */
export function prepareAsciiReveal(): void {
  stopAsciiLoop();
  index = 0;
  applyArt(arts[0]);
  if (pre) pre.textContent = arts[0].content.split('\n').map(blank).join('\n');
}

/** Reveals the first art line by line, top to bottom, then calls onDone. */
export function revealAscii(onDone: () => void): void {
  if (!pre) return onDone();
  clearTimers();
  const lines = arts[0].content.split('\n');
  let shown = 0;
  revealTimer = window.setInterval(() => {
    shown += 1;
    pre.textContent = lines.map((l, i) => (i < shown ? l : blank(l))).join('\n');
    if (shown < lines.length) return;
    window.clearInterval(revealTimer);
    revealTimer = undefined;
    onDone();
  }, REVEAL_MS / lines.length);
}

/** Starts spinning the current art and cycling designs. */
export function startAsciiLoop(): void {
  if (!pre || !spinner || spinning) return;
  clearTimers();
  applyArt(arts[index]);
  pre.style.opacity = '1';
  spinning = true;
  turns = 0;
  spinner.classList.add('animate-spin-y');
  spinner.style.animationPlayState = document.hidden ? 'paused' : '';
}

/** Stops the spin, the design cycle and any pending reveal; leaves the current art fully visible. */
export function stopAsciiLoop(): void {
  const wasRevealing = revealTimer !== undefined;
  clearTimers();
  spinning = false;
  spinner?.classList.remove('animate-spin-y');
  if (pre) pre.style.opacity = '1';
  if (wasRevealing || pre?.textContent !== arts[index].content) applyArt(arts[index]);
}

/** Shows the first art without motion (reduced-motion). */
export function showStaticAscii(): void {
  stopAsciiLoop();
  index = 0;
  applyArt(arts[0]);
}

/** Re-measures after the window was hidden (display: none measures 0px). */
export function refitAscii(): void {
  fit(arts[index].content);
}

// Each finished turn of the CSS spin counts; a paused animation fires none, so the cycle pauses with it
spinner?.addEventListener('animationiteration', (e) => {
  // The <pre>'s own rainbow animation bubbles up here too; only the spinner's turns count
  if (e.target !== spinner || !spinning || !pre) return;
  turns += 1;
  if (turns % TURNS_PER_ART !== 0) return;
  index = (index + 1) % arts.length;
  pre.style.opacity = '0';
  fadeTimer = window.setTimeout(() => {
    applyArt(arts[index]);
    pre.style.opacity = '1';
  }, FADE_MS);
});

document.addEventListener('visibilitychange', () => {
  if (spinner) spinner.style.animationPlayState = document.hidden ? 'paused' : '';
});

window.addEventListener('resize', refitAscii);
fit(arts[0].content);
