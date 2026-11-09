import { makeDraggable } from './windows';

makeDraggable(document.getElementById('paint-window'), document.getElementById('paint-titlebar'));

type PaintTool = 'brush' | 'pencil' | 'eraser' | 'fill' | 'picker';
const PAINT_TOOLS: PaintTool[] = ['brush', 'pencil', 'eraser', 'fill', 'picker'];

let paintCanvas: HTMLCanvasElement | null = null;
let paintCtx: CanvasRenderingContext2D | null = null;
let paintColor = '#000000';
let paintTool: PaintTool = 'brush';
let isDrawing = false;

function clearPaint(): void {
  if (!paintCtx || !paintCanvas) return;
  paintCtx.fillStyle = '#ffffff';
  paintCtx.fillRect(0, 0, paintCanvas.width, paintCanvas.height);
}

function paintPoint(e: PointerEvent): { x: number; y: number } {
  const rect = paintCanvas!.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

function updatePaintToolUI(): void {
  PAINT_TOOLS.forEach((t) => {
    const btn = document.getElementById(`paint-tool-${t}`);
    if (!btn) return;
    const active = t === paintTool;
    btn.setAttribute('aria-pressed', String(active));
    btn.className = active
      ? 'paint-tool p-1.5 bg-[#000080] text-white border border-black flex items-center justify-center text-xs'
      : 'paint-tool p-1.5 bg-[#c0c0c0] text-black border border-transparent hover:border-black active:border-t-black active:border-l-black flex items-center justify-center text-xs';
  });
}

function setPaintTool(tool: PaintTool): void {
  paintTool = tool;
  updatePaintToolUI();
}

function setPaintColor(color: string): void {
  paintColor = color;
  const active = document.getElementById('paint-active-color');
  if (active) active.style.backgroundColor = color;
}

function applyPaintStyle(): void {
  if (!paintCtx) return;
  const size = document.getElementById('paint-size') as HTMLSelectElement | null;
  const width = size ? parseInt(size.value, 10) : 3;
  paintCtx.lineWidth = paintTool === 'pencil' ? 1 : width;
  paintCtx.lineCap = 'round';
  paintCtx.lineJoin = 'round';
  paintCtx.strokeStyle = paintTool === 'eraser' ? '#ffffff' : paintColor;
}

// Relleno por inundación: sustituye la región contigua del color clicado
function floodFill(startX: number, startY: number): void {
  if (!paintCtx || !paintCanvas) return;
  const w = paintCanvas.width;
  const h = paintCanvas.height;
  const x0 = Math.floor(startX);
  const y0 = Math.floor(startY);
  if (x0 < 0 || y0 < 0 || x0 >= w || y0 >= h) return;

  const img = paintCtx.getImageData(0, 0, w, h);
  const data = img.data;
  const idx = (y0 * w + x0) * 4;
  const target: [number, number, number] = [data[idx], data[idx + 1], data[idx + 2]];
  const fill = hexToRgb(paintColor);
  if (target[0] === fill[0] && target[1] === fill[1] && target[2] === fill[2]) return;

  const matches = (i: number): boolean =>
    data[i] === target[0] && data[i + 1] === target[1] && data[i + 2] === target[2];

  const stack: number[] = [x0, y0];
  while (stack.length) {
    const y = stack.pop()!;
    let x = stack.pop()!;
    while (x >= 0 && matches((y * w + x) * 4)) x--;
    x++;
    let spanUp = false;
    let spanDown = false;
    while (x < w && matches((y * w + x) * 4)) {
      const i = (y * w + x) * 4;
      data[i] = fill[0];
      data[i + 1] = fill[1];
      data[i + 2] = fill[2];
      data[i + 3] = 255;
      if (y > 0) {
        const up = matches(((y - 1) * w + x) * 4);
        if (up && !spanUp) { stack.push(x, y - 1); spanUp = true; }
        else if (!up) spanUp = false;
      }
      if (y < h - 1) {
        const down = matches(((y + 1) * w + x) * 4);
        if (down && !spanDown) { stack.push(x, y + 1); spanDown = true; }
        else if (!down) spanDown = false;
      }
      x++;
    }
  }
  paintCtx.putImageData(img, 0, 0);
}

function pickColor(x: number, y: number): void {
  if (!paintCtx) return;
  const [r, g, b] = paintCtx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
  setPaintColor(rgbToHex(r, g, b));
  setPaintTool('brush');
}

function initPaintCanvas(): void {
  paintCanvas = document.getElementById('paint-canvas') as HTMLCanvasElement | null;
  const wrap = document.getElementById('paint-canvas-wrap');
  if (!paintCanvas || !wrap) return;
  paintCtx = paintCanvas.getContext('2d', { willReadFrequently: true });
  paintCanvas.width = wrap.clientWidth;
  paintCanvas.height = wrap.clientHeight;
  clearPaint();

  paintCanvas.addEventListener('pointerdown', (e) => {
    if (!paintCtx || !paintCanvas || e.button !== 0) return;
    const { x, y } = paintPoint(e);
    if (paintTool === 'fill') { floodFill(x, y); return; }
    if (paintTool === 'picker') { pickColor(x, y); return; }
    isDrawing = true;
    paintCanvas.setPointerCapture(e.pointerId);
    applyPaintStyle();
    paintCtx.beginPath();
    paintCtx.moveTo(x, y);
    // Un clic sin arrastre deja un punto
    paintCtx.lineTo(x + 0.01, y);
    paintCtx.stroke();
  });
  paintCanvas.addEventListener('pointermove', (e) => {
    if (!isDrawing || !paintCtx) return;
    const { x, y } = paintPoint(e);
    paintCtx.lineTo(x, y);
    paintCtx.stroke();
  });
  const stopDrawing = (): void => { isDrawing = false; };
  paintCanvas.addEventListener('pointerup', stopDrawing);
  paintCanvas.addEventListener('pointercancel', stopDrawing);
}

function openPaint(): void {
  document.getElementById('paint-window')?.classList.remove('hidden');
  if (!paintCanvas) {
    initPaintCanvas();
    updatePaintToolUI();
  }
}

const paintIcon = document.getElementById('paint-icon');
paintIcon?.addEventListener('dblclick', openPaint);
paintIcon?.addEventListener('keydown', (e) => { if (e.key === 'Enter') openPaint(); });
document.getElementById('paint-close')?.addEventListener('click', () => {
  document.getElementById('paint-window')?.classList.add('hidden');
});
document.getElementById('paint-clear')?.addEventListener('click', clearPaint);

const fileBtn = document.getElementById('paint-file-btn');
const fileDropdown = document.getElementById('paint-file-dropdown');
function toggleFileMenu(open: boolean): void {
  fileDropdown?.classList.toggle('hidden', !open);
  fileBtn?.setAttribute('aria-expanded', String(open));
}
fileBtn?.addEventListener('click', () => toggleFileMenu(fileDropdown?.classList.contains('hidden') ?? false));
document.addEventListener('pointerdown', (e) => {
  if (!(e.target as HTMLElement).closest('#paint-file-menu')) toggleFileMenu(false);
});
document.getElementById('paint-window')?.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') toggleFileMenu(false);
});
document.getElementById('paint-save')?.addEventListener('click', () => {
  toggleFileMenu(false);
  if (!paintCanvas) return;
  const link = document.createElement('a');
  link.download = 'paint.jpg';
  link.href = paintCanvas.toDataURL('image/jpeg', 0.92);
  link.click();
});
document.querySelectorAll<HTMLElement>('.paint-tool').forEach((btn) => {
  btn.addEventListener('click', () => setPaintTool(btn.dataset.tool as PaintTool));
});
document.getElementById('paint-palette')?.addEventListener('click', (e) => {
  const color = (e.target as HTMLElement).closest<HTMLElement>('[data-color]')?.dataset.color;
  if (!color) return;
  setPaintColor(color);
  if (paintTool === 'eraser' || paintTool === 'picker') setPaintTool('brush');
});

export {};
