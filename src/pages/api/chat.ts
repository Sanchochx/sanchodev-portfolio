import type { APIRoute } from 'astro';
import { SYSTEM_PROMPT } from '../../data/me';
import { handleChat } from '../../lib/chat-guard';

export const prerender = false;

const MAX_REPLY_TOKENS = 400;

export const POST: APIRoute = ({ request, clientAddress }) =>
  handleChat({
    request,
    clientAddress,
    systemPrompt: SYSTEM_PROMPT,
    maxReplyTokens: MAX_REPLY_TOKENS,
  });
