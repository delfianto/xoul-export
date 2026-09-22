import { formatExtension, type ExportFormat, type ExportPayload } from "./format";

export const DEFAULT_FILENAME_PATTERN = "{char}-{date_yymmdd}/{iso_date_time}.{ext}";

export const PATTERN_TOKENS = [
  "char",
  "chars",
  "persona",
  "user",
  "title",
  "id",
  "ext",
  "date",
  "date_yymmdd",
  "date_yyyymmdd",
  "iso_date",
  "iso_date_time",
  "time",
  "year",
  "month",
  "day",
] as const;

export type PatternContext = {
  char: string;
  chars: string;
  persona: string;
  user: string;
  title: string;
  id: string;
  ext: string;
  now: Date;
};

function pad(value: number, width = 2): string {
  return String(value).padStart(width, "0");
}

export function safeSegment(value: string): string {
  return (
    value
      .replace(/[<>:"/\\|?*]/g, "_")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 80) || "chat"
  );
}

function tokenMap(ctx: PatternContext): Record<string, string> {
  const d = ctx.now;
  const year = d.getUTCFullYear();
  const yy = String(year).slice(-2);
  const month = pad(d.getUTCMonth() + 1);
  const day = pad(d.getUTCDate());
  const hour = pad(d.getUTCHours());
  const minute = pad(d.getUTCMinutes());
  const second = pad(d.getUTCSeconds());
  const isoDate = `${year}-${month}-${day}`;
  const isoDateTime = `${isoDate}T${hour}-${minute}-${second}Z`;
  return {
    char: ctx.char,
    character: ctx.char,
    chars: ctx.chars,
    persona: ctx.persona,
    user: ctx.user,
    title: ctx.title,
    id: ctx.id,
    conversation_id: ctx.id,
    ext: ctx.ext,
    date: isoDate,
    iso_date: isoDate,
    date_yymmdd: `${yy}${month}${day}`,
    date_yyyymmdd: `${year}${month}${day}`,
    time: `${hour}${minute}${second}`,
    time_hms: `${hour}-${minute}-${second}`,
    iso_date_time: isoDateTime,
    iso_datetime: isoDateTime,
    year: String(year),
    month,
    day,
    hour,
    minute,
    second,
  };
}

export function contextFromPayload(payload: ExportPayload, format: ExportFormat): PatternContext {
  const xouls = payload.details?.xouls ?? [];
  const personas = payload.details?.personas ?? [];
  const charNames = xouls.map((x) => x.name || x.slug || "").filter(Boolean);
  const personaName = personas[0]?.name || personas[0]?.slug || "user";
  const now = new Date(payload.exported_at);
  return {
    char: safeSegment(charNames[0] || payload.title || "chat"),
    chars: safeSegment(charNames.join("+") || payload.title || "chat"),
    persona: safeSegment(personaName),
    user: safeSegment(personaName),
    title: safeSegment(payload.title || "chat"),
    id: payload.conversation_id,
    ext: formatExtension(format),
    now: Number.isNaN(now.getTime()) ? new Date() : now,
  };
}

export function sanitizeFilenamePattern(raw: string): string {
  const trimmed = raw.trim().replace(/\\/g, "/");
  const parts = trimmed.split("/").filter((part) => part !== "" && part !== "." && part !== "..");
  const joined = parts.join("/") || DEFAULT_FILENAME_PATTERN;
  return joined.slice(0, 240);
}

export function expandPattern(pattern: string, ctx: PatternContext): string {
  const map = tokenMap(ctx);
  const source = sanitizeFilenamePattern(pattern);
  let expanded = source.replace(/\{([a-z0-9_]+)\}/gi, (match, key: string) => {
    const value = map[key.toLowerCase()];
    return value ?? match;
  });
  expanded = expanded.replace(/\\/g, "/");
  const parts = expanded.split("/").filter((part) => part !== "" && part !== "." && part !== "..");
  const cleaned = parts.map((part) =>
    part
      .replace(/[<>:"\\|?*]/g, "_")
      .replace(/\s+/g, " ")
      .trim(),
  );
  const usable = cleaned.filter(Boolean);
  if (!usable.length) {
    usable.push(`${ctx.char}-${ctx.ext}`);
  }
  const last = usable[usable.length - 1] ?? ctx.ext;
  if (!last.includes(".") && ctx.ext) {
    usable[usable.length - 1] = `${last}.${ctx.ext}`;
  }
  return usable.join("/");
}

export function previewPattern(root: string, pattern: string, now = new Date()): string {
  const sample: PatternContext = {
    char: "Alicia",
    chars: "Alicia",
    persona: "Bjorn",
    user: "Bjorn",
    title: "Alicia",
    id: "aaaebd6f-77e9-4358-a9cd-29dc01f75e24",
    ext: "html",
    now,
  };
  const relative = expandPattern(pattern, sample);
  const base = root.replace(/\/+$/, "") || "Xoul.ai";
  return `~/Downloads/${base}/${relative}`;
}
