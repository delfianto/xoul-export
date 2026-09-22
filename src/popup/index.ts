import browser from "webextension-polyfill";
import type {
  ExportResponse,
  ParseTabResponse,
  ProgressEvent,
  SessionResult,
} from "../types/messages";

function $(id: string): HTMLElement {
  const el = document.getElementById(id);
  if (!el) throw new Error(`#${id} missing`);
  return el;
}

const statusEl = $("status-text");
const metaEl = $("status-meta");
const btnExport = $("btn-export") as HTMLButtonElement;
const btnSettings = $("btn-settings") as HTMLButtonElement;

let conversationId: string | null = null;
let exporting = false;

function setStatus(text: string, opts: { error?: boolean; meta?: string } = {}): void {
  statusEl.textContent = text;
  statusEl.classList.toggle("error", Boolean(opts.error));
  if (opts.meta) {
    metaEl.hidden = false;
    metaEl.textContent = opts.meta;
  } else {
    metaEl.hidden = true;
    metaEl.textContent = "";
  }
}

function setBusy(busy: boolean): void {
  exporting = busy;
  btnExport.disabled = busy || !conversationId;
  btnExport.classList.toggle("busy", busy);
}

function isProgress(msg: unknown): msg is ProgressEvent {
  return Boolean(
    msg && typeof msg === "object" && (msg as { type?: string }).type === "export-progress",
  );
}

browser.runtime.onMessage.addListener((message: unknown) => {
  if (!isProgress(message) || !exporting) return;
  const p = message.progress;
  if (p.stage === "history") {
    setStatus(`Fetching messages… page ${p.page ?? 1}`, {
      meta: p.messages ? `${p.messages} so far` : (conversationId ?? ""),
    });
  } else if (p.stage === "details") {
    setStatus("Loading conversation…", { meta: conversationId ?? "" });
  } else if (p.stage === "memories") {
    setStatus("Loading memories…", { meta: conversationId ?? "" });
  }
});

async function init(): Promise<void> {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  const parsed = (await browser.runtime.sendMessage({
    type: "parseTab",
    url: tab?.url ?? "",
  })) as ParseTabResponse;
  if (!parsed.chat) {
    setStatus("Open a Xoul chat first.", {
      error: true,
      meta: "Go to xoul.ai and open a conversation, then click the extension again.",
    });
    return;
  }
  conversationId = parsed.chat.conversationId;
  setStatus("Checking your session…", { meta: conversationId });

  const session = (await browser.runtime.sendMessage({ type: "session" })) as SessionResult;
  if (!session.ok) {
    setStatus(session.error || "Not signed in.", { error: true, meta: parsed.chat.url });
    return;
  }
  const who = session.user.name || session.user.slug || "signed in";
  setStatus(`Ready to export (${who}).`, { meta: parsed.chat.url });
  setBusy(false);
}

async function exportChat(): Promise<void> {
  if (!conversationId || exporting) return;
  setBusy(true);
  setStatus("Exporting…", { meta: conversationId });
  try {
    const result = (await browser.runtime.sendMessage({
      type: "export",
      conversationId,
    })) as ExportResponse;
    if (!result.ok) {
      setStatus(result.error || "Export failed.", { error: true, meta: conversationId });
      return;
    }
    const files = result.filenames.join(", ");
    setStatus(`Saved ${result.messageCount} messages.`, { meta: files });
  } catch (error) {
    setStatus(error instanceof Error ? error.message : String(error), { error: true });
  } finally {
    setBusy(false);
  }
}

btnExport.addEventListener("click", () => {
  void exportChat();
});
btnSettings.addEventListener("click", () => {
  void browser.runtime.openOptionsPage();
});

void init().catch((error: unknown) => {
  setStatus(error instanceof Error ? error.message : String(error), { error: true });
});
