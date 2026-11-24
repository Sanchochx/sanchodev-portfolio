import { prepareAsciiReveal, refitAscii, revealAscii, showStaticAscii, startAsciiLoop, stopAsciiLoop } from './ascii';

// Welcome window (#terminal-window) sequence: pop-up → typed text → button → ASCII reveal → ASCII loop.
// The pre-paint script in TerminalWindow.astro adds .welcome-pending only when motion is allowed.
const win = document.getElementById('terminal-window');
const cta = document.getElementById('welcome-cta');
const typed = win ? Array.from(win.querySelectorAll<HTMLElement>('[data-type]')) : [];
const fullText = new Map(typed.map((el) => [el, el.textContent?.trim() ?? '']));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const POPUP_DELAY_MS = 400;
const POPUP_MS = 200;
const TYPE_MS = 30;
const CURSOR_BLINK_MS = 500;
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

let cursorTimer: number | undefined;
let closeTimer: number | undefined;

const cursor = document.createElement('span');
cursor.setAttribute('aria-hidden', 'true');
cursor.textContent = '█';

/** Cancels the sequence and leaves the window in its final, static state. */
function finishSequence(): void {
  timers.forEach((id) => window.clearTimeout(id));
  timers.clear();
  window.clearInterval(cursorTimer);
  cursor.remove();
  typed.forEach((el) => {
    el.textContent = fullText.get(el) ?? '';
    el.style.minHeight = '';
  });
  cta?.classList.remove('welcome-cta-pending', 'welcome-cta-in');
  win?.classList.remove('welcome-pending', 'welcome-opening');
}

function typeLine(i: number, onDone: () => void): void {
  const el = typed[i];
  if (!el) return onDone();
  const text = fullText.get(el) ?? '';
  // Screen readers get the whole line at once; the typed copy is decorative
  const sr = document.createElement('span');
  sr.className = 'sr-only';
  sr.textContent = text;
  const out = document.createElement('span');
  out.setAttribute('aria-hidden', 'true');
  el.replaceChildren(sr, out, cursor);

  let n = 0;
  const tick = (): void => {
    n += 1;
    out.textContent = text.slice(0, n);
    if (n < text.length) return later(tick, TYPE_MS);
    el.textContent = text;
    typeLine(i + 1, onDone);
  };
  later(tick, TYPE_MS);
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
    cursorTimer = window.setInterval(() => {
      // Toggled as text (not opacity) so it also blinks inside the gradient-clipped subtitle
      cursor.textContent = cursor.textContent === '█' ? ' ' : '█';
    }, CURSOR_BLINK_MS);
    typeLine(0, () => {
      window.clearInterval(cursorTimer);
      cursor.remove();
      showCta(() => revealAscii(startAsciiLoop));
    });
  }, POPUP_MS);
}

if (win?.classList.contains('welcome-pending')) {
  // Measured while invisible but laid out: reserving the final height keeps typing from shifting the layout
  typed.forEach((el) => {
    el.style.minHeight = `${el.offsetHeight}px`;
    el.textContent = '';
  });
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
