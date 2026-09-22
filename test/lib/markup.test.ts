import { expect, test } from "bun:test";
import { renderBubbleHtml, renderMemoHtml } from "../../src/lib/markup";

test("bubble renders actions, speech, and bold", () => {
  const html = renderBubbleHtml(
    '*Anna grins.*\n\n"Don\'t be an asshole."\n\nShe **points** at him.',
  );
  expect(html).toContain('<em class="act">Anna grins.</em>');
  expect(html).toContain('<span class="say">&quot;Don&#39;t be an asshole.&quot;</span>');
  expect(html).toContain("<strong>points</strong>");
  expect(html).toContain("<br>");
});

test("bubble escapes raw HTML", () => {
  const html = renderBubbleHtml("Hello <script>alert(1)</script>");
  expect(html).not.toContain("<script>alert(1)</script>");
  expect(html).toContain("&lt;script&gt;");
});

test("memo renders headings and paragraphs", () => {
  const html = renderMemoHtml("### Character Profile\n\n**Name:** Anna\n\nShe lives at home.");
  expect(html).toContain("<h5>");
  expect(html).toContain("Character Profile");
  expect(html).toContain("<strong>Name:</strong>");
  expect(html).toContain("<p>");
});
