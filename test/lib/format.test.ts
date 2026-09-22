import { expect, test } from "bun:test";
import {
  asMessageList,
  buildExportPayload,
  chronological,
  messageRole,
  speakerName,
  suggestedFilename,
  titleFromDetails,
  toHtml,
  toMarkdown,
} from "../../src/lib/format";

test("asMessageList accepts a bare array or wrapped payloads", () => {
  expect(asMessageList([{ turn_id: 1 }])).toEqual([{ turn_id: 1 }]);
  expect(asMessageList({ history: [1, 2] })).toEqual([1, 2]);
  expect(asMessageList({ items: [3] })).toEqual([3]);
  expect(asMessageList({ nope: true })).toEqual([]);
});

test("roles map llm to assistant", () => {
  expect(messageRole({ role: "llm" })).toBe("assistant");
  expect(messageRole({ author_type: "user" })).toBe("user");
});

test("speaker names fall back to persona / xoul", () => {
  const details = {
    xouls: [{ name: "Relon'aer" }],
    personas: [{ name: "Anon" }],
  };
  expect(speakerName({ role: "user" }, details)).toBe("Anon");
  expect(speakerName({ role: "assistant" }, details)).toBe("Relon'aer");
  expect(speakerName({ role: "assistant", author_name: "Narrator" }, details)).toBe("Narrator");
});

test("newest-first pages become chronological", () => {
  const ordered = chronological([
    { turn_id: 2, timestamp: "2025-04-16T11:26:00Z", content: "later" },
    { turn_id: 1, timestamp: "2025-04-16T11:25:00Z", content: "earlier" },
  ]);
  expect(ordered[0]?.content).toBe("earlier");
  expect(ordered[1]?.content).toBe("later");
});

test("markdown export includes speakers and memories", () => {
  const payload = buildExportPayload({
    conversationId: "96c44245-0818-42e6-b2b2-3319a14bb824",
    url: "https://xoul.ai/chats/96c44245-0818-42e6-b2b2-3319a14bb824",
    details: {
      name: "Castle chat",
      xouls: [{ name: "Relon'aer" }],
      personas: [{ name: "Anon" }],
    },
    memories: { content: "The prisoner arrived at dusk." },
    messages: [
      {
        role: "assistant",
        turn_id: 1,
        timestamp: "2025-04-16T11:26:00.000Z",
        content: "Do not be rash.",
      },
      {
        role: "user",
        turn_id: 1,
        timestamp: "2025-04-16T11:25:00.000Z",
        content: "Let me go.",
      },
    ],
    exportedAt: "2026-09-22T12:00:00.000Z",
  });
  expect(payload.messages[0]?.role).toBe("user");
  const md = toMarkdown(payload);
  expect(md).toMatch(/^# Castle chat/m);
  expect(md).toContain("## Memories");
  expect(md).toContain("The prisoner arrived at dusk");
  expect(md).toContain("### Anon");
  expect(md).toContain("Let me go");
  expect(md).toContain("### Relon'aer");
  expect(titleFromDetails(payload.details)).toBe("Castle chat");
  expect(suggestedFilename(payload, "markdown")).toBe("xoul-Castle chat-2026-09-22.md");
});

test("html export is self-contained and escapes markup", () => {
  const payload = buildExportPayload({
    conversationId: "96c44245-0818-42e6-b2b2-3319a14bb824",
    url: "https://xoul.ai/chats/96c44245-0818-42e6-b2b2-3319a14bb824",
    details: { name: "Castle chat", xouls: [{ name: "Relon'aer" }], personas: [{ name: "Anon" }] },
    memories: { content: "Keep the <gate> shut." },
    messages: [
      {
        role: "user",
        turn_id: 1,
        timestamp: "2025-04-16T11:25:00.000Z",
        content: "Hello <script>alert(1)</script>",
      },
    ],
    exportedAt: "2026-09-22T12:00:00.000Z",
  });
  const html = toHtml(payload);
  expect(html.startsWith("<!DOCTYPE html>")).toBe(true);
  expect(html).toContain("<style>");
  expect(html).not.toContain("<script>alert(1)</script>");
  expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
  expect(html).toContain("Keep the &lt;gate&gt; shut.");
  expect(html).not.toContain("http://fonts");
  expect(html).toContain("Hide character");
  expect(suggestedFilename(payload, "html")).toBe("xoul-Castle chat-2026-09-22.html");
});

test("html pane includes character card fields", () => {
  const payload = buildExportPayload({
    conversationId: "96c44245-0818-42e6-b2b2-3319a14bb824",
    url: "https://xoul.ai/chats/96c44245-0818-42e6-b2b2-3319a14bb824",
    details: {
      xouls: [
        {
          name: "Anna",
          slug: "Annapranksbro.xo",
          age: 20,
          gender: "female",
          tagline: "caught you looking",
          bio: "Creator memo goes here.",
          backstory: "### Profile\n\nShe lives at home.",
        },
      ],
    },
    memories: null,
    messages: [{ role: "assistant", content: '*Anna grins.*\n\n"Hey."' }],
    exportedAt: "2026-09-22T12:00:00.000Z",
  });
  const html = toHtml(payload);
  expect(html).toContain("Creator Memo");
  expect(html).toContain("@Annapranksbro.xo");
  expect(html).toContain("Age");
  expect(html).toContain("20");
  expect(html).toContain("Backstory");
  expect(html).toContain('<em class="act">Anna grins.</em>');
  expect(html).toContain('class="say"');
});

test("html embeds each avatar data URI once", () => {
  const payload = buildExportPayload({
    conversationId: "96c44245-0818-42e6-b2b2-3319a14bb824",
    url: "https://xoul.ai/chats/96c44245-0818-42e6-b2b2-3319a14bb824",
    details: { name: "Castle chat", xouls: [{ name: "Relon'aer" }] },
    memories: null,
    messages: [
      { role: "assistant", turn_id: 1, content: "one" },
      { role: "assistant", turn_id: 2, content: "two" },
      { role: "assistant", turn_id: 3, content: "three" },
    ],
    exportedAt: "2026-09-22T12:00:00.000Z",
  });
  const uri = "data:image/jpeg;base64,/9j/abc";
  const html = toHtml(payload, { icons: { "Relon'aer": uri } });
  expect(html.split(uri).length - 1).toBe(1);
  expect(html).toContain("background-image:url(");
});
