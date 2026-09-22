import { allFormatsSelected, normalizeSettings, type Settings } from "../settings/schema";
import { loadSettings, saveSettings } from "../settings/storage";
import { previewPattern } from "../lib/path-pattern";

function $(id: string): HTMLElement {
  const el = document.getElementById(id);
  if (!el) throw new Error(`#${id} missing`);
  return el;
}

const dirInput = $("downloadDirectory") as HTMLInputElement;
const patternInput = $("filenamePattern") as HTMLInputElement;
const previewEl = $("pattern-preview");
const fmtJson = $("fmt-json") as HTMLInputElement;
const fmtMarkdown = $("fmt-markdown") as HTMLInputElement;
const fmtHtml = $("fmt-html") as HTMLInputElement;
const fmtAll = $("fmt-all") as HTMLInputElement;
const statusEl = $("status");

let saveTimer: number | undefined;

function readForm(): Settings {
  return normalizeSettings({
    downloadDirectory: dirInput.value,
    filenamePattern: patternInput.value,
    formats: {
      json: fmtJson.checked,
      markdown: fmtMarkdown.checked,
      html: fmtHtml.checked,
    },
  });
}

function updatePreview(settings: Settings): void {
  previewEl.textContent = `Preview: ${previewPattern(settings.downloadDirectory, settings.filenamePattern)}`;
}

function applyForm(settings: Settings): void {
  dirInput.value = settings.downloadDirectory;
  patternInput.value = settings.filenamePattern;
  fmtJson.checked = settings.formats.json;
  fmtMarkdown.checked = settings.formats.markdown;
  fmtHtml.checked = settings.formats.html;
  fmtAll.checked = allFormatsSelected(settings);
  updatePreview(settings);
}

function flash(text: string): void {
  statusEl.textContent = text;
}

async function persist(): Promise<void> {
  const settings = readForm();
  applyForm(settings);
  await saveSettings(settings);
  flash("Saved");
}

function schedulePersist(): void {
  window.clearTimeout(saveTimer);
  updatePreview(readForm());
  saveTimer = window.setTimeout(() => {
    void persist();
  }, 250);
}

fmtAll.addEventListener("change", () => {
  const on = fmtAll.checked;
  fmtJson.checked = on;
  fmtMarkdown.checked = on;
  fmtHtml.checked = on;
  void persist();
});

for (const box of [fmtJson, fmtMarkdown, fmtHtml]) {
  box.addEventListener("change", () => {
    fmtAll.checked = fmtJson.checked && fmtMarkdown.checked && fmtHtml.checked;
    void persist();
  });
}

dirInput.addEventListener("input", schedulePersist);
patternInput.addEventListener("input", schedulePersist);
dirInput.addEventListener("change", () => {
  void persist();
});
patternInput.addEventListener("change", () => {
  void persist();
});

void loadSettings().then(applyForm);
