import browser from "webextension-polyfill";
import { exportConversation, getSession } from "./api";
import {
  buildExportPayload,
  mimeFor,
  renderExport,
  toHtml,
  type ExportFormat,
  type ExportPayload,
} from "../lib/format";
import { chatUrlFromDetails, parseChatTab } from "../lib/ids";
import { contextFromPayload, expandPattern } from "../lib/path-pattern";
import { embedIcons } from "./avatars";
import { selectedFormats } from "../settings/schema";
import { loadSettings } from "../settings/storage";
import type { ExtensionRequest, ExportProgress } from "../types/messages";

function textToDataUrl(mime: string, text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  const step = 0x8000;
  for (let i = 0; i < bytes.length; i += step) {
    binary += String.fromCharCode(...bytes.subarray(i, i + step));
  }
  return `data:${mime};base64,${btoa(binary)}`;
}

function downloadPath(directory: string, filename: string): string {
  const dir = directory.replace(/\/+$/, "");
  return dir ? `${dir}/${filename}` : filename;
}

function serialize(
  payload: ExportPayload,
  format: ExportFormat,
  icons: Record<string, string>,
): string {
  if (format === "html") return toHtml(payload, { icons });
  return renderExport(payload, format);
}

function isRequest(msg: unknown): msg is ExtensionRequest {
  if (!msg || typeof msg !== "object") return false;
  const type = (msg as { type?: unknown }).type;
  return type === "parseTab" || type === "session" || type === "export";
}

async function handle(msg: ExtensionRequest): Promise<unknown> {
  if (msg.type === "parseTab") {
    return { ok: true, chat: parseChatTab(msg.url) };
  }
  if (msg.type === "session") {
    return getSession();
  }
  if (msg.type === "export") {
    if (!msg.conversationId) {
      return { ok: false, error: "No conversation id." };
    }
    const settings = await loadSettings();
    const formats = selectedFormats(settings);
    const { details, memories, messages } = await exportConversation(
      msg.conversationId,
      (progress: ExportProgress) => {
        void browser.runtime
          .sendMessage({ type: "export-progress", progress })
          .catch(() => undefined);
      },
    );
    const payload = buildExportPayload({
      conversationId: msg.conversationId,
      url: chatUrlFromDetails(msg.conversationId, details),
      details,
      memories,
      messages,
    });
    const icons = formats.includes("html")
      ? await embedIcons([...(details.xouls ?? []), ...(details.personas ?? [])])
      : {};
    const filenames: string[] = [];
    let lastId = 0;
    for (const format of formats) {
      const filename = downloadPath(
        settings.downloadDirectory,
        expandPattern(settings.filenamePattern, contextFromPayload(payload, format)),
      );
      lastId = await browser.downloads.download({
        url: textToDataUrl(mimeFor(format), serialize(payload, format, icons)),
        filename,
        saveAs: false,
        conflictAction: "uniquify",
      });
      filenames.push(filename);
    }
    return {
      ok: true,
      filenames,
      downloadId: lastId,
      messageCount: payload.messages.length,
      title: payload.title,
    };
  }
  return { ok: false, error: "Unknown message." };
}

browser.runtime.onMessage.addListener((msg: unknown) => {
  if (!isRequest(msg)) return;
  return handle(msg).catch((error: unknown) => ({
    ok: false,
    error: error instanceof Error ? error.message : String(error),
  }));
});
