// Lógica común de /api/chat y /api/pactasis: validación de entrada, límites de coste y
// llamada a OpenAI. Mantener un único sitio evita que los límites diverjan entre bots.

type Role = 'system' | 'user' | 'assistant';

type ChatMessage = {
  role: Role;
  content: string;
};

type ChatOptions = {
  request: Request;
  clientAddress: string | undefined;
  systemPrompt: string;
  maxReplyTokens: number;
  // Respuesta de sustitución si el modelo devuelve un bloque de código pese al prompt
  blockCodeFences?: string;
};

const MAX_BODY_CHARS = 20_000;
const MAX_MESSAGE_LENGTH = 1000;
const MAX_HISTORY_MESSAGES = 6;
const MAX_HISTORY_TOTAL_CHARS = 6000;

// Best-effort limiter: state is per serverless instance, so it curbs bursts
// from one client but is not a hard global quota. Se comparte entre ambos
// endpoints porque viven en el mismo módulo.
const RATE_LIMITS = [
  { windowMs: 60_000, max: 8 },
  { windowMs: 3_600_000, max: 60 },
] as const;
const LONGEST_WINDOW_MS = 3_600_000;
const hits = new Map<string, number[]>();

const isRateLimited = (key: string): boolean => {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < LONGEST_WINDOW_MS);
  const limited = RATE_LIMITS.some(
    ({ windowMs, max }) => recent.filter((t) => now - t < windowMs).length >= max
  );
  if (!limited) recent.push(now);
  hits.set(key, recent);
  if (hits.size > 1000) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= LONGEST_WINDOW_MS)) hits.delete(k);
    }
  }
  return limited;
};

// En Vercel el edge fija estas cabeceras; x-forwarded-for solo es fiable como último recurso.
const getClientKey = (request: Request, clientAddress: string | undefined): string =>
  request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() ||
  request.headers.get('x-real-ip')?.trim() ||
  clientAddress ||
  request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
  'unknown';

export const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

const parseBody = async (
  request: Request
): Promise<{ message: string; history: ChatMessage[] } | Response> => {
  const declared = Number(request.headers.get('content-length') ?? 0);
  if (declared > MAX_BODY_CHARS) return json({ error: 'Request too large' }, 413);

  const raw = await request.text();
  if (raw.length > MAX_BODY_CHARS) return json({ error: 'Request too large' }, 413);

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }
  if (typeof payload !== 'object' || payload === null) return json({ error: 'Invalid JSON' }, 400);

  const { message, history } = payload as { message?: unknown; history?: unknown };
  if (typeof message !== 'string') return json({ error: 'Message is required' }, 400);
  const text = message.trim();
  if (!text) return json({ error: 'Message is required' }, 400);
  if (text.length > MAX_MESSAGE_LENGTH) return json({ error: 'Message too long' }, 400);

  const valid: ChatMessage[] = [];
  if (Array.isArray(history)) {
    for (const m of history.slice(-MAX_HISTORY_MESSAGES)) {
      const item = m as { role?: unknown; content?: unknown } | null;
      if (
        item &&
        (item.role === 'user' || item.role === 'assistant') &&
        typeof item.content === 'string'
      ) {
        valid.push({ role: item.role, content: item.content });
      }
    }
  }

  // Recorta desde los mensajes más antiguos hasta entrar en el presupuesto de caracteres
  let total = 0;
  const kept: ChatMessage[] = [];
  for (const m of valid.reverse()) {
    total += m.content.length;
    if (total > MAX_HISTORY_TOTAL_CHARS) break;
    kept.unshift(m);
  }
  return { message: text, history: kept };
};

export const handleChat = async ({
  request,
  clientAddress,
  systemPrompt,
  maxReplyTokens,
  blockCodeFences,
}: ChatOptions): Promise<Response> => {
  const apiKey = process.env.OPENAI_API_KEY ?? import.meta.env.OPENAI_API_KEY;
  if (!apiKey) return json({ error: 'Server is not configured' }, 500);

  if (isRateLimited(getClientKey(request, clientAddress))) {
    return json({ error: 'Too many requests' }, 429);
  }

  try {
    const parsed = await parseBody(request);
    if (parsed instanceof Response) return parsed;

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...parsed.history,
      { role: 'user', content: parsed.message },
    ];

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: maxReplyTokens,
      }),
      signal: AbortSignal.timeout(20_000),
    });

    if (!res.ok) {
      console.error('OpenAI error', res.status, await res.text());
      return json({ error: 'Upstream error' }, 502);
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) return json({ error: 'Empty reply' }, 502);
    if (blockCodeFences && reply.includes('```')) return json({ reply: blockCodeFences });
    return json({ reply });
  } catch (err) {
    console.error('Chat error', err);
    return json({ error: 'Internal server error' }, 500);
  }
};
