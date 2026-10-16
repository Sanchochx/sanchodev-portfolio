import type { APIRoute } from 'astro';
import { SYSTEM_PROMPT } from '../../data/me';

export const prerender = false;

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type ChatRequest = {
  message?: string;
  history?: ChatMessage[];
};

const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_MESSAGES = 20;
const MAX_HISTORY_CONTENT_LENGTH = 2000;
const MAX_REPLY_TOKENS = 500;

// Best-effort limiter: state is per serverless instance, so it curbs bursts
// from one client but is not a hard global quota.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;
const hits = new Map<string, number[]>();

const isRateLimited = (key: string): boolean => {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 1000) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) hits.delete(k);
    }
  }
  return false;
};

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? import.meta.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    return json({ error: 'Server is not configured' }, 500);
  }

  const clientKey =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || clientAddress || 'unknown';
  if (isRateLimited(clientKey)) return json({ error: 'Too many requests' }, 429);

  let payload: ChatRequest;
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const message = (payload.message ?? '').trim();
  const history = Array.isArray(payload.history) ? payload.history : [];
  if (!message) return json({ error: 'Message is required' }, 400);

  if (message.length > MAX_MESSAGE_LENGTH) return json({ error: 'Message too long' }, 400);
  const trimmedHistory = history
    .filter(
      (m) =>
        m &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string'
    )
    .slice(-MAX_HISTORY_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_HISTORY_CONTENT_LENGTH) }));

  const messages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...trimmedHistory,
    { role: 'user', content: message },
  ];

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: MAX_REPLY_TOKENS,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('OpenAI error', res.status, text);
      return json({ error: 'Upstream error' }, 502);
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) return json({ error: 'Empty reply' }, 502);
    return json({ reply });
  } catch (err) {
    console.error('Chat error', err);
    return json({ error: 'Internal server error' }, 500);
  }
};
