import browser from "webextension-polyfill";
import {
  asMessageList,
  type ChatMessage,
  type ConversationDetails,
  type Memories,
} from "../lib/format";
import type { ExportProgress, SessionResult, UserSelf } from "../types/messages";

const API_BASE = "https://api.xoul.ai";
const PAGE_SIZE = 100;
const MAX_PAGES = 400;

const SKIP_COOKIES = new Set(["AWSALB", "AWSALBCORS"]);

export type ConversationBundle = {
  details: ConversationDetails;
  memories: Memories | null;
  messages: ChatMessage[];
  user: UserSelf;
};

function queryString(params: Record<string, string | number | null | undefined>): string {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(params)) {
    if (value == null || value === "") continue;
    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  }
  return parts.length ? `?${parts.join("&")}` : "";
}

async function cookieHeader(): Promise<string> {
  const bags = await Promise.all([
    browser.cookies.getAll({ url: "https://api.xoul.ai/" }),
    browser.cookies.getAll({ url: "https://xoul.ai/" }),
  ]);
  const seen = new Set<string>();
  const pairs: string[] = [];
  for (const cookie of bags.flat()) {
    if (!cookie.name || seen.has(cookie.name) || SKIP_COOKIES.has(cookie.name)) continue;
    seen.add(cookie.name);
    pairs.push(`${cookie.name}=${cookie.value}`);
  }
  return pairs.join("; ");
}

async function apiFetch(
  path: string,
  params: Record<string, string | number | null | undefined> = {},
): Promise<Response> {
  const url = `${API_BASE}${path}${queryString(params)}`;
  const headers: Record<string, string> = {
    Accept: "application/json",
    "ngrok-skip-browser-warning": "true",
  };
  const init: RequestInit = { method: "GET", credentials: "include", headers };

  let response = await fetch(url, init);
  if (response.status === 403 || response.status === 401) {
    const cookie = await cookieHeader();
    if (cookie) {
      try {
        response = await fetch(url, {
          ...init,
          headers: { ...headers, Cookie: cookie },
        });
      } catch {
        // Cookie is a forbidden header in some Chrome builds.
      }
    }
  }
  return response;
}

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error(`API returned non-JSON (${response.status})`);
  }
}

function errorDetail(body: unknown): string {
  if (body && typeof body === "object") {
    const rec = body as { detail?: unknown; error?: unknown };
    if (typeof rec.detail === "string") return rec.detail;
    if (typeof rec.error === "string") return rec.error;
  }
  return "Missing authentication credentials.";
}

function authError(body: unknown): Error {
  return new Error(
    `Not signed in (${errorDetail(body)}). Open xoul.ai, log in, then export again.`,
  );
}

export async function getSession(): Promise<SessionResult> {
  const response = await apiFetch("/api/v1/user/self");
  const body = await readJson(response);
  if (response.status === 401 || response.status === 403) {
    return { ok: false, user: null, error: authError(body).message };
  }
  if (!response.ok) {
    return { ok: false, user: null, error: `Session check failed (${response.status}).` };
  }
  return { ok: true, user: (body ?? {}) as UserSelf };
}

export async function getConversationDetails(conversationId: string): Promise<ConversationDetails> {
  const response = await apiFetch("/api/v1/conversation/details", {
    conversation_id: conversationId,
  });
  const body = await readJson(response);
  if (response.status === 401 || response.status === 403) throw authError(body);
  if (response.status === 404) {
    throw new Error("Conversation not found. Open the chat and try again.");
  }
  if (!response.ok) {
    throw new Error(`conversation/details failed (${response.status}).`);
  }
  return body as ConversationDetails;
}

export async function getManualMemory(conversationId: string): Promise<Memories | null> {
  const response = await apiFetch("/api/v1/conversation/manual-memory", {
    conversation_id: conversationId,
  });
  if (response.status === 404 || response.status === 405) return null;
  if (response.status === 401 || response.status === 403) return null;
  if (!response.ok) return null;
  return (await readJson(response)) as Memories;
}

export async function getChatHistory(
  conversationId: string,
  onProgress?: (info: { page: number; messages: number }) => void,
): Promise<ChatMessage[]> {
  const pages: ChatMessage[][] = [];
  let cursor: string | number | null = null;
  let page = 0;

  while (page < MAX_PAGES) {
    const params: Record<string, string | number | null> = {
      conversation_id: conversationId,
      limit: PAGE_SIZE,
    };
    if (cursor != null) params["cursor"] = cursor;
    const response = await apiFetch("/api/v1/chat/history", params);
    const body = await readJson(response);
    if (response.status === 401 || response.status === 403) throw authError(body);
    if (!response.ok) {
      throw new Error(`chat/history failed (${response.status}).`);
    }
    const batch = asMessageList(body);
    pages.push(batch);
    page += 1;
    const total = pages.reduce((sum, list) => sum + list.length, 0);
    onProgress?.({ page, messages: total });

    if (!batch.length) break;
    const last = batch.at(-1);
    const turnId = last?.turn_id;
    if (!(Number(turnId) > 0)) break;
    if (String(turnId) === String(cursor)) break;
    cursor = turnId ?? null;
  }

  return pages.flat();
}

export async function exportConversation(
  conversationId: string,
  onProgress?: (progress: ExportProgress) => void,
): Promise<ConversationBundle> {
  onProgress?.({ stage: "session" });
  const session = await getSession();
  if (!session.ok) {
    throw new Error(session.error);
  }

  onProgress?.({ stage: "details" });
  const details = await getConversationDetails(conversationId);

  onProgress?.({ stage: "memories" });
  const memories = await getManualMemory(conversationId);

  onProgress?.({ stage: "history", page: 0, messages: 0 });
  const messages = await getChatHistory(conversationId, (info) => {
    onProgress?.({ stage: "history", page: info.page, messages: info.messages });
  });

  return { details, memories, messages, user: session.user };
}
