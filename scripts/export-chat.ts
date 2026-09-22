#!/usr/bin/env bun
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import {
  asMessageList,
  buildExportPayload,
  renderExport,
  type ChatMessage,
  type ConversationDetails,
  type ExportFormat,
  type Memories,
} from "../src/lib/format";
import { chatUrlFromDetails, parseChatTab } from "../src/lib/ids";
import {
  contextFromPayload,
  DEFAULT_FILENAME_PATTERN,
  expandPattern,
} from "../src/lib/path-pattern";

const ROOT = join(import.meta.dir, "..");
const API = "https://api.xoul.ai";

function arg(flag: string, fallback?: string): string | undefined {
  const i = process.argv.indexOf(flag);
  if (i === -1) return fallback;
  return process.argv[i + 1] ?? fallback;
}

function usage(): void {
  console.error(`Usage:
  bun run scripts/export-chat.ts --url https://xoul.ai/chats/<uuid>
  bun run scripts/export-chat.ts --id <uuid>

Options:
  --cookies <path>   Cookie Editor JSON (default: ./cookie.json)
  --out <dir>        Output directory (default: ./exports)
  --format json|md|html|all   (default: all)
  --pattern <pattern>  filename pattern (default: {char}-{date_yymmdd}/{iso_date_time}.{ext})
`);
}

type CookieFile =
  | { name: string; value: string }[]
  | { cookies: { name: string; value: string }[] };

function cookieHeader(cookies: CookieFile): string {
  const list = Array.isArray(cookies) ? cookies : (cookies.cookies ?? []);
  return list
    .filter((c) => c.name && c.value != null)
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
}

async function apiGet(
  path: string,
  params: Record<string, string>,
  cookie: string,
): Promise<unknown> {
  const url = new URL(path, API);
  for (const [k, v] of Object.entries(params)) {
    if (v) url.searchParams.set(k, v);
  }
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      Cookie: cookie,
      "ngrok-skip-browser-warning": "true",
    },
  });
  const text = await response.text();
  let body: unknown = null;
  if (text) {
    try {
      body = JSON.parse(text) as unknown;
    } catch {
      throw new Error(`Non-JSON from ${url.pathname} (${response.status})`);
    }
  }
  if (!response.ok) {
    const rec =
      body && typeof body === "object" ? (body as { detail?: string; error?: string }) : {};
    throw new Error(
      `${url.pathname} ${response.status}: ${rec.detail || rec.error || response.statusText}`,
    );
  }
  return body;
}

async function allHistory(conversationId: string, cookie: string): Promise<ChatMessage[]> {
  const pages: ChatMessage[][] = [];
  let cursor: string | null = null;
  for (let page = 0; page < 400; page += 1) {
    const params: Record<string, string> = { conversation_id: conversationId, limit: "100" };
    if (cursor) params["cursor"] = cursor;
    const batch = asMessageList(await apiGet("/api/v1/chat/history", params, cookie));
    pages.push(batch);
    if (!batch.length) break;
    const turnId = batch.at(-1)?.turn_id;
    if (!(Number(turnId) > 0)) break;
    if (String(turnId) === cursor) break;
    cursor = String(turnId);
  }
  return pages.flat();
}

const urlArg = arg("--url");
const idArg = arg("--id");
const cookiePath = arg("--cookies", join(ROOT, "cookie.json")) ?? join(ROOT, "cookie.json");
const outDir = arg("--out", join(ROOT, "exports")) ?? join(ROOT, "exports");
const format = arg("--format", "all") ?? "all";
const pattern = arg("--pattern", DEFAULT_FILENAME_PATTERN) ?? DEFAULT_FILENAME_PATTERN;

const parsed = urlArg ? parseChatTab(urlArg) : null;
const conversationId = (idArg || parsed?.conversationId || "").toLowerCase();
if (!conversationId) {
  usage();
  process.exit(1);
}

const cookies = JSON.parse(readFileSync(cookiePath, "utf8")) as CookieFile;
const cookie = cookieHeader(cookies);
if (!cookie.includes("xoul_backend_sess_tok=")) {
  console.error("cookie file has no xoul_backend_sess_tok");
  process.exit(1);
}

const who = (await apiGet("/api/v1/user/self", {}, cookie)) as { slug?: string; name?: string };
const details = (await apiGet(
  "/api/v1/conversation/details",
  {
    conversation_id: conversationId,
  },
  cookie,
)) as ConversationDetails;
let memories: Memories | null = null;
try {
  memories = (await apiGet(
    "/api/v1/conversation/manual-memory",
    {
      conversation_id: conversationId,
    },
    cookie,
  )) as Memories;
} catch {
  memories = null;
}
const messages = await allHistory(conversationId, cookie);
const payload = buildExportPayload({
  conversationId,
  url: chatUrlFromDetails(conversationId, details),
  details,
  memories,
  messages,
});

mkdirSync(outDir, { recursive: true });
const written: string[] = [];
const formats: ExportFormat[] =
  format === "all" || format === "both"
    ? ["json", "markdown", "html"]
    : format === "md"
      ? ["markdown"]
      : ([format] as ExportFormat[]);
for (const kind of formats) {
  if (kind !== "json" && kind !== "markdown" && kind !== "html") continue;
  const name = expandPattern(pattern, contextFromPayload(payload, kind));
  const path = join(outDir, name);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, renderExport(payload, kind));
  written.push(name);
}

console.log(`signed in as ${who.slug || who.name || "ok"}`);
console.log(`${payload.messages.length} messages · ${payload.title}`);
for (const name of written) console.log(`wrote ${join(outDir, name)}`);
