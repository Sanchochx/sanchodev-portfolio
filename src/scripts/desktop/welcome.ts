import { prepareAsciiReveal, refitAscii, revealAscii, showStaticAscii, startAsciiLoop, stopAsciiLoop } from './ascii';
import { createTypewriter } from './typewriter';

// Welcome window (#terminal-window) sequence: pop-up → typed text → button → ASCII reveal → ASCII loop.
// The pre-paint script in TerminalWindow.astro adds .welcome-pending only when motion is allowed.
const win = document.getElementById('terminal-window');
const cta = document.getElementById('welcome-cta');
const typewriter = createTypewriter(win ? Array.from(win.querySelectorAll<HTMLElement>('[data-type]')) : []);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const POPUP_DELAY_MS = 400;
const POPUP_MS = 200;
const CTA_MS = 300;
const CLOSE_MS = 180;
// Safety net in case the CRT never announces the reveal
const FALLBACK_MS = 2500;

// Every step goes through later() so closing the window can cancel the whole sequence
const timers = new Set<number>();
function later(fn: () => void, ms: number): void {
  const id = window.setTimeout(() => {
    timers.delete(id);
    fn();
  }, ms);
  timers.add(id);
}

let closeTimer: number | undefined;

/** Cancels the sequence and leaves the window in its final, static state. */
function finishSequence(): void {
  timers.forEach((id) => window.clearTimeout(id));
  timers.clear();
  typewriter.finish();
  cta?.classList.remove('welcome-cta-pending', 'welcome-cta-in');
  win?.classList.remove('welcome-pending', 'welcome-opening');
}

function showCta(onDone: () => void): void {
  cta?.classList.remove('welcome-cta-pending');
  cta?.classList.add('welcome-cta-in');
  later(() => {
    cta?.classList.remove('welcome-cta-in');
    onDone();
  }, CTA_MS);
}

function runSequence(): void {
  if (!win) return;
  win.classList.remove('welcome-pending');
  win.classList.add('welcome-opening');
  later(() => {
    win.classList.remove('welcome-opening');
    typewriter.run(() => showCta(() => revealAscii(startAsciiLoop)));
  }, POPUP_MS);
}

if (win?.classList.contains('welcome-pending')) {
  typewriter.prepare();
  cta?.classList.add('welcome-cta-pending');
  prepareAsciiReveal();

  let started = false;
  const start = (): void => {
    if (started) return;
    started = true;
    later(runSequence, POPUP_DELAY_MS);
  };
  window.addEventListener('crt:revealed', start, { once: true });
  later(start, FALLBACK_MS);
} else if (win) {
  if (reduceMotion) showStaticAscii();
  else startAsciiLoop();
}

function closeWelcome(): void {
  if (!win || win.classList.contains('hidden')) return;
  finishSequence();
  stopAsciiLoop();
  if (reduceMotion) {
    win.classList.add('hidden');
    return;
  }
  win.classList.add('welcome-closing');
  closeTimer = window.setTimeout(() => {
    win.classList.remove('welcome-closing');
    win.classList.add('hidden');
  }, CLOSE_MS);
}

// The ASCII desktop icon reopens the window directly in its final state
function openWelcome(): void {
  if (!win) return;
  window.clearTimeout(closeTimer);
  finishSequence();
  win.classList.remove('hidden', 'welcome-closing');
  refitAscii();
  if (reduceMotion) showStaticAscii();
  else startAsciiLoop();
}

document.getElementById('terminal-close')?.addEventListener('click', closeWelcome);
const asciiIcon = document.getElementById('ascii-icon');
asciiIcon?.addEventListener('dblclick', openWelcome);
asciiIcon?.addEventListener('keydown', (e) => { if (e.key === 'Enter') openWelcome(); });
