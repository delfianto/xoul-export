export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function inlineMd(escaped: string): string {
  return escaped
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, '<em class="act">$1</em>')
    .replace(/_([^_]+)_/g, "<em>$1</em>")
    .replace(/&quot;(.+?)&quot;/g, '<span class="say">&quot;$1&quot;</span>');
}

export function renderBubbleHtml(raw: string): string {
  const text = raw.replace(/\s+$/g, "");
  if (!text) return "<em>(empty)</em>";
  return inlineMd(escapeHtml(text)).replace(/\n/g, "<br>");
}

export function renderMemoHtml(raw: string): string {
  const blocks = raw
    .replace(/\r\n/g, "\n")
    .trim()
    .split(/\n{2,}/);
  if (!blocks.length || (blocks.length === 1 && !blocks[0])) return "";
  return blocks
    .map((block) => {
      const lines = block.trim();
      const heading = lines.match(/^(#{1,3})\s+([\s\S]+)$/);
      if (heading) {
        const level = Math.min(heading[1]?.length ?? 3, 3) + 2;
        return `<h${level}>${inlineMd(escapeHtml(heading[2] ?? ""))}</h${level}>`;
      }
      return `<p>${inlineMd(escapeHtml(lines)).replace(/\n/g, "<br>")}</p>`;
    })
    .join("");
}
