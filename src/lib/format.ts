import { toHtml } from "./html-export";

export type ExportFormat = "json" | "markdown" | "html";

export type NamedSlug = {
  name?: string | null;
  slug?: string | null;
  icon_url?: string | null;
};

export type XoulCard = NamedSlug & {
  age?: string | number | null;
  gender?: string | null;
  tagline?: string | null;
  bio?: string | null;
  backstory?: string | null;
  definition?: string | null;
  samples?: string | null;
  creator_slug?: string | null;
};

export type ConversationDetails = {
  name?: string | null;
  icon_url?: string | null;
  isMulti?: boolean;
  xouls?: XoulCard[];
  personas?: NamedSlug[];
  greeting?: string | null;
};

export type ChatMessage = {
  role?: string | null;
  author_type?: string | null;
  author_name?: string | null;
  name?: string | null;
  turn_id?: number | string | null;
  timestamp?: string | null;
  content?: string | null;
  metadata?: unknown;
  message_id?: string | number | null;
};

export type Memories =
  | string
  | {
      content?: string | null;
      text?: string | null;
      memory?: string | null;
    };

export type NormalizedMessage = {
  role: string;
  name: string;
  turn_id: number | string | null;
  timestamp: string | null;
  content: string;
  metadata: unknown;
};

export type ExportPayload = {
  exported_at: string;
  source: "xoul.ai";
  conversation_id: string;
  url: string;
  title: string;
  details: ConversationDetails | null;
  memories: Memories | null;
  messages: NormalizedMessage[];
  raw_messages: ChatMessage[];
};

export type BuildExportArgs = {
  conversationId: string;
  url: string;
  details: ConversationDetails | null;
  memories: Memories | null;
  messages: ChatMessage[];
  exportedAt?: string;
};

function isBlank(value: unknown): boolean {
  return value == null || value === "";
}

export function asMessageList(payload: unknown): ChatMessage[] {
  if (Array.isArray(payload)) return payload as ChatMessage[];
  if (!payload || typeof payload !== "object") return [];
  const obj = payload as Record<string, unknown>;
  for (const key of ["history", "items", "messages", "data"] as const) {
    const value = obj[key];
    if (Array.isArray(value)) return value as ChatMessage[];
  }
  return [];
}

export function messageRole(message: ChatMessage): string {
  const raw = String(message.role ?? message.author_type ?? "").toLowerCase();
  if (raw === "user") return "user";
  if (raw === "assistant" || raw === "llm") return "assistant";
  if (raw === "system") return "system";
  if (raw === "channel") return "channel";
  return raw || "unknown";
}

export function speakerName(message: ChatMessage, details: ConversationDetails | null): string {
  const explicit = message.author_name ?? message.name;
  if (!isBlank(explicit)) return String(explicit);
  const role = messageRole(message);
  if (role === "user") return details?.personas?.[0]?.name || "User";
  if (role === "assistant") return details?.xouls?.[0]?.name || "Xoul";
  if (role === "system") return "System";
  return role;
}

export function titleFromDetails(
  details: ConversationDetails | null,
  fallback = "xoul-chat",
): string {
  if (!isBlank(details?.name)) return String(details?.name);
  const xoul = details?.xouls?.[0]?.name;
  if (!isBlank(xoul)) return String(xoul);
  return fallback;
}

function messageKey(message: ChatMessage): string {
  return `${messageRole(message)}:${message.turn_id ?? ""}:${message.timestamp ?? ""}:${message.message_id ?? ""}`;
}

export function dedupeMessages(messages: ChatMessage[]): ChatMessage[] {
  const seen = new Set<string>();
  const out: ChatMessage[] = [];
  for (const message of messages) {
    const key = messageKey(message);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(message);
  }
  return out;
}

export function chronological(messages: ChatMessage[]): ChatMessage[] {
  const copy = messages.slice().reverse();
  copy.sort((a, b) => {
    const ta = Date.parse(a.timestamp ?? "") || 0;
    const tb = Date.parse(b.timestamp ?? "") || 0;
    if (ta && tb && ta !== tb) return ta - tb;
    const ua = Number(a.turn_id);
    const ub = Number(b.turn_id);
    if (Number.isFinite(ua) && Number.isFinite(ub) && ua !== ub) return ua - ub;
    return 0;
  });
  return copy;
}

export function normalizeMessage(
  message: ChatMessage,
  details: ConversationDetails | null,
): NormalizedMessage {
  return {
    role: messageRole(message),
    name: speakerName(message, details),
    turn_id: message.turn_id ?? null,
    timestamp: message.timestamp ?? null,
    content: message.content ?? "",
    metadata: message.metadata ?? null,
  };
}

function isoNow(): string {
  return new Date().toISOString();
}

function formatStamp(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date
    .toISOString()
    .replace("T", " ")
    .replace(/\.\d{3}Z$/, " UTC");
}

function mdEscapeHeading(text: string): string {
  return String(text).replace(/\s+/g, " ").trim();
}

function memoryText(memories: Memories | null): string | null {
  if (memories == null) return null;
  if (typeof memories === "string") return isBlank(memories) ? null : memories;
  const text = memories.content ?? memories.text ?? memories.memory ?? null;
  return isBlank(text) ? null : String(text);
}

export function buildExportPayload(args: BuildExportArgs): ExportPayload {
  const ordered = chronological(dedupeMessages(args.messages));
  const exportedAt = args.exportedAt ?? isoNow();
  return {
    exported_at: exportedAt,
    source: "xoul.ai",
    conversation_id: args.conversationId,
    url: args.url,
    title: titleFromDetails(args.details, args.conversationId),
    details: args.details,
    memories: args.memories,
    messages: ordered.map((message) => normalizeMessage(message, args.details)),
    raw_messages: ordered,
  };
}

export function toJson(payload: ExportPayload): string {
  return `${JSON.stringify(payload, null, 2)}\n`;
}

export function toMarkdown(payload: ExportPayload): string {
  const lines: string[] = [];
  const title = payload.title || payload.conversation_id;
  lines.push(`# ${mdEscapeHeading(title)}`, "");
  lines.push(`- Conversation ID: \`${payload.conversation_id}\``);
  if (payload.url) lines.push(`- URL: ${payload.url}`);
  lines.push(`- Exported: ${payload.exported_at}`);

  const xouls = payload.details?.xouls ?? [];
  if (xouls.length) {
    lines.push(`- Xouls: ${xouls.map((x) => x.name || x.slug).join(", ")}`);
  }
  const personas = payload.details?.personas ?? [];
  if (personas.length) {
    lines.push(`- Personas: ${personas.map((p) => p.name || p.slug).join(", ")}`);
  }
  lines.push(`- Messages: ${payload.messages.length}`, "");

  const notes = memoryText(payload.memories);
  if (notes) {
    lines.push("## Memories", "", notes.trim(), "");
  }

  lines.push("---", "");

  for (const message of payload.messages) {
    const stamp = formatStamp(message.timestamp);
    const heading = stamp
      ? `### ${mdEscapeHeading(message.name)} · ${stamp}`
      : `### ${mdEscapeHeading(message.name)}`;
    lines.push(heading, "");
    const body = String(message.content).replace(/\s+$/g, "");
    lines.push(body || "_(empty)_", "");
  }

  return lines.join("\n");
}

export function suggestedFilename(payload: ExportPayload, format: ExportFormat): string {
  const date = (payload.exported_at || isoNow()).slice(0, 10);
  const base = safeStem(payload.title || payload.conversation_id);
  return `xoul-${base}-${date}.${formatExtension(format)}`;
}

export function formatExtension(format: ExportFormat): string {
  if (format === "json") return "json";
  if (format === "html") return "html";
  return "md";
}

export function mimeFor(format: ExportFormat): string {
  if (format === "json") return "application/json";
  if (format === "html") return "text/html;charset=utf-8";
  return "text/markdown;charset=utf-8";
}

export function renderExport(payload: ExportPayload, format: ExportFormat): string {
  if (format === "json") return toJson(payload);
  if (format === "html") return toHtml(payload);
  return toMarkdown(payload);
}

export { toHtml, avatarClass } from "./html-export";
export type { HtmlOptions } from "./html-export";

function safeStem(name: string): string {
  return (
    String(name)
      .replace(/[<>:"/\\|?*]/g, "_")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 80) || "chat"
  );
}
