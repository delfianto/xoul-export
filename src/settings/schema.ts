import type { ExportFormat } from "../lib/format";
import { DEFAULT_FILENAME_PATTERN, sanitizeFilenamePattern } from "../lib/path-pattern";

export type Settings = {
  downloadDirectory: string;
  filenamePattern: string;
  formats: {
    json: boolean;
    markdown: boolean;
    html: boolean;
  };
};

export const DEFAULT_SETTINGS: Settings = {
  downloadDirectory: "Xoul.ai",
  filenamePattern: DEFAULT_FILENAME_PATTERN,
  formats: { json: true, markdown: true, html: true },
};

export function sanitizeDownloadDir(raw: string): string {
  let value = raw.trim().replace(/\\/g, "/");
  value = value.replace(/^~\/(?:Downloads|downloads)\//, "");
  value = value.replace(/^~\//, "");
  const afterDownloads = value.match(/\/(?:Downloads|downloads)\/(.+)$/);
  if (afterDownloads?.[1]) value = afterDownloads[1];
  value = value.replace(/^\/+/, "").replace(/\/+$/, "");
  const parts = value.split("/").filter((part) => part !== "" && part !== "." && part !== "..");
  const joined = parts.join("/") || DEFAULT_SETTINGS.downloadDirectory;
  return joined.slice(0, 180);
}

export function normalizeSettings(raw: unknown): Settings {
  const obj = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const formatsRaw =
    obj["formats"] && typeof obj["formats"] === "object"
      ? (obj["formats"] as Record<string, unknown>)
      : {};
  const json = formatsRaw["json"] !== false;
  const markdown = formatsRaw["markdown"] !== false;
  const html = formatsRaw["html"] !== false;
  const any = json || markdown || html;
  return {
    downloadDirectory: sanitizeDownloadDir(
      typeof obj["downloadDirectory"] === "string"
        ? obj["downloadDirectory"]
        : DEFAULT_SETTINGS.downloadDirectory,
    ),
    filenamePattern: sanitizeFilenamePattern(
      typeof obj["filenamePattern"] === "string"
        ? obj["filenamePattern"]
        : DEFAULT_SETTINGS.filenamePattern,
    ),
    formats: any ? { json, markdown, html } : { json: true, markdown: true, html: true },
  };
}

export function selectedFormats(settings: Settings): ExportFormat[] {
  const out: ExportFormat[] = [];
  if (settings.formats.json) out.push("json");
  if (settings.formats.markdown) out.push("markdown");
  if (settings.formats.html) out.push("html");
  return out.length ? out : ["json", "markdown", "html"];
}

export function allFormatsSelected(settings: Settings): boolean {
  return settings.formats.json && settings.formats.markdown && settings.formats.html;
}
