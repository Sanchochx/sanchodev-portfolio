// Shared open/close lifecycle for windows launched from a desktop icon.
// Convention: #<name>-icon opens #<name>-window and #<name>-close closes it.
// Not used by the welcome window (#terminal-window), which has its own sequence in welcome.ts.

export interface AppWindowHooks {
  /** Runs once the open animation has finished: start heavy content here. */
  onOpened?: () => void;
  /** Runs as soon as closing starts: stop heavy content here. */
  onClosing?: () => void;
}

export interface AppWindow {
  open(): void;
  close(): void;
  /** True while opening or open: async work started in onOpened should check it before attaching. */
  isOpen(): boolean;
}

type State = 'closed' | 'opening' | 'open' | 'closing';

const OPEN_MS = 250;
const POP_MS = 200;
const CLOSE_MS = 200;
// Scale the window starts from when it grows out of its icon, and when it can't (plain pop-up)
const FROM_ICON_SCALE = 0.2;
const POP_SCALE = 0.92;
// Above the static z-40/z-50 window classes and below the CRT overlay (z-100)
let topZ = 50;

const reduceMotion = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Restarting a CSS animation needs the class removed and a reflow before adding it again.
// The class is dropped when it ends: left on a hidden window it would replay on the next display.
function replay(el: HTMLElement, cls: string): void {
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
  const done = (e: AnimationEvent): void => {
    if (e.target !== el) return;
    el.classList.remove(cls);
    el.removeEventListener('animationend', done);
  };
  el.addEventListener('animationend', done);
}

export function registerAppWindow(name: string, hooks: AppWindowHooks = {}): AppWindow {
  const win = document.getElementById(`${name}-window`);
  const icon = document.getElementById(`${name}-icon`);
  let state: State = win && !win.classList.contains('hidden') ? 'open' : 'closed';
  let cancelWait: (() => void) | null = null;
  let openMs = OPEN_MS;

  const bringToFront = (): void => {
    if (!win) return;
    topZ = Math.min(topZ + 1, 99);
    win.style.zIndex = String(topZ);
  };

  // Points transform-origin at the icon's center; returns false when there is no usable icon rect
  const aimAtIcon = (): boolean => {
    if (!win || !icon) return false;
    const i = icon.getBoundingClientRect();
    const w = win.getBoundingClientRect();
    if (!i.width || !i.height || !w.width || !w.height) return false;
    win.style.transformOrigin = `${i.left + i.width / 2 - w.left}px ${i.top + i.height / 2 - w.top}px`;
    return true;
  };

  // Resolves on the window's own transform transition, with a timeout in case transitionend never fires
  const waitFor = (ms: number, done: () => void): void => {
    cancelWait?.();
    const onEnd = (e: TransitionEvent): void => {
      if (e.target === win && e.propertyName === 'transform') finish();
    };
    const timer = window.setTimeout(() => finish(), ms + 80);
    const finish = (): void => {
      cancel();
      done();
    };
    const cancel = (): void => {
      window.clearTimeout(timer);
      win?.removeEventListener('transitionend', onEnd);
      cancelWait = null;
    };
    win?.addEventListener('transitionend', onEnd);
    cancelWait = cancel;
  };

  const open = (): void => {
    if (!win) return;
    if (icon && !reduceMotion()) replay(icon, 'app-icon-press');
    bringToFront();

    if (state === 'open' || state === 'opening') {
      if (state === 'open' && !reduceMotion()) replay(win, 'app-win-focus');
      return;
    }

    const wasClosing = state === 'closing';
    state = 'opening';
    cancelWait?.();

    if (reduceMotion()) {
      win.classList.remove('hidden', 'app-win-opening', 'app-win-closing', 'app-win-collapsed');
      state = 'open';
      hooks.onOpened?.();
      return;
    }

    // Reopening mid-close keeps the current origin and simply transitions back from where it is
    if (!wasClosing) {
      win.classList.remove('hidden', 'app-win-closing');
      // Measured before collapsing: a scaled window would report a scaled rect
      const fromIcon = aimAtIcon();
      if (!fromIcon) win.style.transformOrigin = '';
      openMs = fromIcon ? OPEN_MS : POP_MS;
      win.style.setProperty('--app-win-from', String(fromIcon ? FROM_ICON_SCALE : POP_SCALE));
      win.style.setProperty('--app-win-open-ms', `${openMs}ms`);
      win.classList.add('app-win-collapsed');
      void win.offsetWidth;
    }
    win.classList.remove('app-win-closing', 'app-win-collapsed');
    win.classList.add('app-win-opening');

    waitFor(openMs, () => {
      win.classList.remove('app-win-opening');
      state = 'open';
      hooks.onOpened?.();
    });
  };

  const close = (): void => {
    if (!win || state === 'closed' || state === 'closing') return;
    const wasOpening = state === 'opening';
    state = 'closing';
    cancelWait?.();
    hooks.onClosing?.();

    if (reduceMotion()) {
      win.classList.remove('app-win-opening', 'app-win-closing', 'app-win-collapsed');
      win.classList.add('hidden');
      state = 'closed';
      return;
    }

    // The window may have been dragged since it opened; mid-open it is scaled, so keep that origin
    if (!wasOpening) {
      const toIcon = aimAtIcon();
      if (!toIcon) win.style.transformOrigin = '';
      win.style.setProperty('--app-win-from', String(toIcon ? FROM_ICON_SCALE : POP_SCALE));
    }
    win.classList.remove('app-win-opening');
    win.classList.add('app-win-closing', 'app-win-collapsed');

    waitFor(CLOSE_MS, () => {
      win.classList.add('hidden');
      win.classList.remove('app-win-closing', 'app-win-collapsed');
      state = 'closed';
    });
  };

  icon?.addEventListener('dblclick', open);
  icon?.addEventListener('keydown', (e) => { if (e.key === 'Enter') open(); });
  document.getElementById(`${name}-close`)?.addEventListener('click', close);

  return { open, close, isOpen: () => state === 'opening' || state === 'open' };
}
