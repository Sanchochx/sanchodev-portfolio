// Typed-text effect shared by the welcome window and the About Me notepad: lines are typed one
// after another behind a blinking block cursor, then restored to their original markup.

const DEFAULT_TYPE_MS = 30;
const CURSOR_BLINK_MS = 500;

export interface Typewriter {
  /** Reserves each line's final height and empties it. Call while the lines are laid out. */
  prepare(): void;
  /** Types every line in order, then calls onDone. */
  run(onDone?: () => void): void;
  /** Cancels typing and leaves every line in its final, static state. Safe to call anytime. */
  finish(): void;
}

/** `typeMs` is the delay per character; the welcome window uses the default. */
export function createTypewriter(lines: readonly HTMLElement[], typeMs = DEFAULT_TYPE_MS): Typewriter {
  // The original nodes are kept (not just their text) so links inside a line survive the effect
  const originals = new Map(lines.map((el) => [el, Array.from(el.childNodes)]));
  const texts = new Map(lines.map((el) => [el, (el.textContent ?? '').replace(/\s+/g, ' ').trim()]));
  const timers = new Set<number>();
  let cursorTimer: number | undefined;

  const cursor = document.createElement('span');
  cursor.setAttribute('aria-hidden', 'true');
  cursor.textContent = '█';

  const later = (fn: () => void, ms: number): void => {
    const id = window.setTimeout(() => {
      timers.delete(id);
      fn();
    }, ms);
    timers.add(id);
  };

  const restore = (el: HTMLElement): void => {
    el.replaceChildren(...(originals.get(el) ?? []));
    el.style.minHeight = '';
  };

  const stopCursor = (): void => {
    window.clearInterval(cursorTimer);
    cursorTimer = undefined;
    cursor.remove();
  };

  const typeLine = (i: number, onDone: () => void): void => {
    const el = lines[i];
    if (!el) return onDone();
    const text = texts.get(el) ?? '';
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
      if (n < text.length) return later(tick, typeMs);
      restore(el);
      typeLine(i + 1, onDone);
    };
    later(tick, typeMs);
  };

  return {
    prepare() {
      // Measured while laid out (even if invisible or scaled): keeps typing from shifting the layout
      lines.forEach((el) => {
        el.style.minHeight = `${el.offsetHeight}px`;
        el.replaceChildren();
      });
    },
    run(onDone) {
      cursorTimer = window.setInterval(() => {
        // Toggled as text (not opacity) so it also blinks inside gradient-clipped text
        cursor.textContent = cursor.textContent === '█' ? ' ' : '█';
      }, CURSOR_BLINK_MS);
      typeLine(0, () => {
        stopCursor();
        onDone?.();
      });
    },
    finish() {
      timers.forEach((id) => window.clearTimeout(id));
      timers.clear();
      stopCursor();
      lines.forEach(restore);
    },
  };
}
