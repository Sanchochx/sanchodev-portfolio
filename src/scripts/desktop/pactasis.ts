import { makeDraggable } from './windows';
import { registerAppWindow } from './appWindow';

makeDraggable(document.getElementById('pactasis-window'), document.getElementById('pactasis-titlebar'));
const pactasisInput = document.getElementById('pactasis-input') as HTMLInputElement | null;
const pactasisLog = document.getElementById('pactasis-chat-log');
const pactasisHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [];
let pactasisBusy = false;

registerAppWindow('pactasis', { onOpened: () => pactasisInput?.focus() });

function pactasisPrint(kind: 'user' | 'sys', tag: string, text: string): void {
  if (!pactasisLog) return;
  const line = document.createElement('div');
  line.className = kind === 'user' ? 'log-user' : 'log-sys mt-2';
  const label = document.createElement('span');
  label.className = kind === 'user' ? 'opacity-50' : 'opacity-70';
  label.textContent = `[${tag}]`;
  line.append(label, ` ${text}`);
  pactasisLog.appendChild(line);
  pactasisLog.scrollTop = pactasisLog.scrollHeight;
}

document.getElementById('pactasis-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = pactasisInput?.value.trim() ?? '';
  if (!pactasisInput || !text || pactasisBusy) return;
  pactasisInput.value = '';
  pactasisBusy = true;
  pactasisPrint('user', 'X', text);

  try {
    const res = await fetch('/api/pactasis', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message: text, history: pactasisHistory }),
    });
    if (res.status === 429) {
      pactasisPrint('sys', 'P.A.C.T.A.S.I.S', 'ERROR: demasiadas solicitudes. Espera un minuto e intenta de nuevo.');
      return;
    }
    const data = (await res.json()) as { reply?: string; error?: string };
    if (!res.ok || !data.reply) throw new Error(`${res.status} ${data.error ?? 'Error desconocido'}`);
    pactasisHistory.push({ role: 'user', content: text }, { role: 'assistant', content: data.reply });
    pactasisPrint('sys', 'P.A.C.T.A.S.I.S', data.reply);
  } catch (err) {
    console.error('P.A.C.T.A.S.I.S request failed', err);
    pactasisPrint('sys', 'P.A.C.T.A.S.I.S', 'ERROR: enlace interrumpido. Intenta de nuevo.');
  } finally {
    pactasisBusy = false;
  }
});

export {};
