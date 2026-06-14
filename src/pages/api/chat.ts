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

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

export const POST: APIRoute = async ({ request }) => {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? import.meta.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    return json({ error: 'Server is not configured' }, 500);
  }

  let payload: ChatRequest;
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const message = (payload.message ?? '').trim();
  const history = Array.isArray(payload.history) ? payload.history : [];
  if (!message) return json({ error: 'Message is required' }, 400);

  if (message.length > 2000) return json({ error: 'Message too long' }, 400);
  const trimmedHistory = history
    .filter(
      (m) =>
        m &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string'
    )
    .slice(-20);

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
