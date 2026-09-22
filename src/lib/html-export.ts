import type { ExportPayload, XoulCard } from "./format";
import { escapeHtml, renderBubbleHtml, renderMemoHtml } from "./markup";

export type HtmlOptions = {
  icons?: Record<string, string>;
};

export function avatarClass(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (Math.imul(hash, 31) + name.charCodeAt(i)) | 0;
  }
  return `av-${(hash >>> 0).toString(16)}`;
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

function memoryText(memories: ExportPayload["memories"]): string | null {
  if (memories == null) return null;
  if (typeof memories === "string") return memories.trim() || null;
  const text = memories.content ?? memories.text ?? memories.memory ?? null;
  return text && text.trim() ? text : null;
}

function fact(label: string, value: unknown): string {
  if (value == null || value === "") return "";
  return `<div class="fact"><span>${escapeHtml(label)}</span><b>${escapeHtml(String(value))}</b></div>`;
}

function speakerIconKey(
  name: string,
  role: string,
  icons: Record<string, string>,
  xouls: XoulCard[],
): string | null {
  if (icons[name]) return name;
  if (role === "assistant") {
    const fallback = xouls[0]?.name;
    if (fallback && icons[fallback]) return fallback;
  }
  return null;
}

function characterCard(xoul: XoulCard, icons: Record<string, string>): string {
  const name = xoul.name || xoul.slug || "Xoul";
  const slug = xoul.slug || "";
  const hasIcon = Boolean(xoul.name && icons[xoul.name]);
  const portrait = hasIcon
    ? `<div class="portrait ${avatarClass(xoul.name || "")}" role="img" aria-label="${escapeHtml(name)}"></div>`
    : `<div class="portrait fallback">${escapeHtml(name.slice(0, 1) || "?")}</div>`;
  const handle = slug ? `<p class="handle">@${escapeHtml(slug)}</p>` : "";
  const facts = [
    fact("Age", xoul.age),
    fact("Gender", xoul.gender),
    fact("Tagline", xoul.tagline),
  ].join("");
  const memo = xoul.bio
    ? `<details open class="block"><summary>Creator Memo</summary><div class="prose">${renderMemoHtml(xoul.bio)}</div></details>`
    : "";
  const backstory = xoul.backstory
    ? `<details class="block"><summary>Backstory</summary><div class="prose">${renderMemoHtml(xoul.backstory)}</div></details>`
    : "";
  const definition = xoul.definition
    ? `<details class="block"><summary>Definition</summary><div class="prose">${renderMemoHtml(xoul.definition)}</div></details>`
    : "";
  return `<article class="card">
  ${portrait}
  <h2>${escapeHtml(name)}</h2>
  ${handle}
  <div class="facts">${facts}</div>
  ${memo}
  ${backstory}
  ${definition}
</article>`;
}

export function toHtml(payload: ExportPayload, options: HtmlOptions = {}): string {
  const title = payload.title || payload.conversation_id;
  const notes = memoryText(payload.memories);
  const xouls = payload.details?.xouls ?? [];
  const personas = payload.details?.personas ?? [];
  const icons = options.icons ?? {};

  const iconCss = Object.entries(icons)
    .map(([name, uri]) => `.${avatarClass(name)}{background-image:url("${uri}")}`)
    .join("");

  const messages = payload.messages
    .map((message) => {
      const stamp = formatStamp(message.timestamp);
      const iconKey = speakerIconKey(message.name, message.role, icons, xouls);
      const avatar = iconKey
        ? `<span class="avatar ${avatarClass(iconKey)}" aria-hidden="true"></span>`
        : `<span class="avatar fallback" aria-hidden="true">${escapeHtml(message.name.slice(0, 1) || "?")}</span>`;
      return `<article class="msg ${escapeHtml(message.role)}">
  ${avatar}
  <div class="bubble">
    <header><span class="who">${escapeHtml(message.name)}</span>${stamp ? `<time>${escapeHtml(stamp)}</time>` : ""}</header>
    <div class="body">${renderBubbleHtml(message.content)}</div>
  </div>
</article>`;
    })
    .join("\n");

  const memoryBlock = notes
    ? `<section class="memories"><h3>Memories</h3><div class="prose">${renderMemoHtml(notes)}</div></section>`
    : "";

  const paneCards = xouls.map((xoul) => characterCard(xoul, icons)).join("");
  const personaLine = personas.length
    ? `<p class="you">You: ${escapeHtml(personas.map((p) => p.name || p.slug || "").join(", "))}</p>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark">
<title>${escapeHtml(title)} — Xoul export</title>
<style>
:root {
  --bg: #0b0d11;
  --surface: #14161c;
  --ink: #ececec;
  --muted: #9aa0ab;
  --line: #262a33;
  --mint: #6ee7c4;
  --user: #1c2433;
  --assistant: #181b22;
  --act: #b8c0cc;
  --pane: 320px;
}
* { box-sizing: border-box; }
html, body {
  margin: 0; padding: 0; height: 100%; width: 100%;
  background: var(--bg); color: var(--ink); overflow: hidden;
}
body {
  font: 16px/1.5 ui-sans-serif, system-ui, "Segoe UI", sans-serif;
  display: flex; flex-direction: column;
}
.bar {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 16px; border-bottom: 1px solid var(--line);
  background: var(--bg); z-index: 2; flex: 0 0 auto;
}
.bar h1 { font-size: 1.05rem; margin: 0; letter-spacing: -0.02em; flex: 1; }
.bar .meta { color: var(--muted); font-size: 12px; }
.toggle {
  appearance: none; border: 1px solid var(--line); background: var(--surface);
  color: var(--ink); border-radius: 999px; padding: 6px 12px; font: inherit;
  font-size: 13px; font-weight: 650; cursor: pointer;
}
.shell {
  display: grid; grid-template-columns: 1fr var(--pane);
  flex: 1; min-height: 0; overflow: hidden;
}
.chat {
  padding: 20px 18px 48px; max-width: 52rem; width: 100%;
  margin: 0 auto; height: 100%; min-height: 0;
}
.chat, .pane {
  overflow-x: hidden;
  overflow-y: scroll;
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}
.chat:hover, .pane:hover, .chat.is-scrolling, .pane.is-scrolling {
  scrollbar-color: rgba(255,255,255,.28) transparent;
}
.chat::-webkit-scrollbar, .pane::-webkit-scrollbar { width: 8px; height: 8px; }
.chat::-webkit-scrollbar-corner, .pane::-webkit-scrollbar-corner { background: transparent; }
.chat::-webkit-scrollbar-track, .pane::-webkit-scrollbar-track { background: transparent; }
.chat::-webkit-scrollbar-thumb, .pane::-webkit-scrollbar-thumb {
  background: transparent; border-radius: 99px;
  border: 2px solid transparent; background-clip: padding-box;
}
.chat:hover::-webkit-scrollbar-thumb, .pane:hover::-webkit-scrollbar-thumb,
.chat.is-scrolling::-webkit-scrollbar-thumb, .pane.is-scrolling::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,.28); background-clip: padding-box;
}
.transcript { display: flex; flex-direction: column; gap: 14px; }
.msg { display: flex; gap: 10px; align-items: flex-start; }
.msg.user { flex-direction: row-reverse; }
.avatar, .portrait {
  background: var(--line) center/cover no-repeat;
}
.avatar {
  width: 36px; height: 36px; border-radius: 50%; flex: 0 0 auto;
}
.avatar.fallback, .portrait.fallback {
  display: grid; place-items: center; font-weight: 700; color: var(--mint);
}
.bubble {
  background: var(--assistant); border: 1px solid var(--line);
  border-radius: 14px; padding: 10px 14px 12px; min-width: 0;
  max-width: min(40rem, 100%);
}
.msg.user .bubble { background: var(--user); }
.bubble header { display: flex; gap: 8px; align-items: baseline; margin-bottom: 6px; font-size: 0.82rem; }
.who { font-weight: 700; }
time { color: var(--muted); }
.body { overflow-wrap: anywhere; }
.body .act { color: var(--act); font-style: italic; }
.body .say { color: var(--ink); }
.memories {
  background: var(--surface); border: 1px solid var(--line);
  border-radius: 12px; padding: 12px 14px; margin-bottom: 18px;
}
.memories h3 { margin: 0 0 8px; font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); }
.pane {
  border-left: 1px solid var(--line); background: #0e1015;
  padding: 18px 16px 32px; overflow: auto; height: 100%; min-height: 0;
}
.card { margin-bottom: 22px; }
.portrait {
  width: 100%; aspect-ratio: 1; border-radius: 16px; margin-bottom: 14px;
}
.portrait.fallback { aspect-ratio: 1; font-size: 3rem; }
.card h2 { margin: 0; font-size: 1.35rem; text-align: center; }
.handle { margin: 4px 0 12px; text-align: center; color: var(--muted); }
.facts { display: grid; gap: 6px; margin-bottom: 14px; }
.fact { display: flex; justify-content: space-between; gap: 10px; font-size: 13px; color: var(--muted); }
.fact b { color: var(--ink); font-weight: 650; text-align: right; }
.block { border-top: 1px solid var(--line); padding: 10px 0; }
.block summary {
  cursor: pointer; color: var(--muted); font-size: 12px; letter-spacing: .06em;
  text-transform: uppercase; font-weight: 650; list-style: none;
}
.block summary::-webkit-details-marker { display: none; }
.prose p { margin: 0 0 10px; }
.prose h3, .prose h4, .prose h5 { margin: 12px 0 6px; font-size: 14px; }
.prose .act { font-style: italic; color: var(--act); }
.you { color: var(--muted); font-size: 13px; margin-top: 8px; }
#pane-toggle {
  position: fixed; width: 1px; height: 1px; margin: 0; padding: 0;
  overflow: hidden; clip: rect(0,0,0,0); border: 0;
}
#pane-toggle:not(:checked) ~ .shell { grid-template-columns: 1fr; }
#pane-toggle:not(:checked) ~ .shell .pane { display: none; }
#pane-toggle:not(:checked) ~ .bar .toggle span.on { display: none; }
#pane-toggle:checked ~ .bar .toggle span.off { display: none; }
@media (max-width: 860px) {
  .shell { grid-template-columns: 1fr; overflow: auto; }
  .pane { border-left: 0; border-top: 1px solid var(--line); height: auto; }
}
@media print {
  .bar, .toggle { display: none; }
  .shell { display: block; }
  .pane { position: static; height: auto; border: 0; }
  .bubble, .card { break-inside: avoid; }
}
${iconCss}
</style>
</head>
<body>
<input id="pane-toggle" type="checkbox" checked>
<header class="bar">
  <h1>${escapeHtml(title)}</h1>
  <span class="meta">${payload.messages.length} messages</span>
  <label class="toggle" for="pane-toggle"><span class="on">Hide character</span><span class="off">Show character</span></label>
</header>
<div class="shell">
  <section class="chat">
    ${memoryBlock}
    <div class="transcript">
${messages}
    </div>
  </section>
  <aside class="pane">
    ${paneCards || "<p class='you'>No character card on this chat.</p>"}
    ${personaLine}
  </aside>
</div>
<script>
(() => {
  const show = (el) => {
    el.classList.add("is-scrolling");
    clearTimeout(el._sb);
    el._sb = setTimeout(() => el.classList.remove("is-scrolling"), 800);
  };
  for (const el of document.querySelectorAll(".chat, .pane, .shell")) {
    el.addEventListener("scroll", () => show(el), { passive: true });
  }
})();
</script>
</body>
</html>
`;
}
