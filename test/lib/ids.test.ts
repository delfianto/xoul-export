import { expect, test } from "bun:test";
import { chatUrlFromDetails, parseChatTab, safeFilename } from "../../src/lib/ids";

const ID = "96c44245-0818-42e6-b2b2-3319a14bb824";

test("parses 1:1 chat URLs", () => {
  const chat = parseChatTab(`https://xoul.ai/chats/${ID}?foo=1`);
  expect(chat?.conversationId).toBe(ID);
  expect(chat?.isGroup).toBe(false);
  expect(chat?.url).toBe(`https://xoul.ai/chats/${ID}`);
});

test("parses group chat URLs", () => {
  const chat = parseChatTab(`https://xoul.ai/chats/gp/${ID}/`);
  expect(chat?.isGroup).toBe(true);
  expect(chat?.path).toBe(`/chats/gp/${ID}`);
});

test("parses legacy @chat routes and story host", () => {
  const id = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee";
  expect(parseChatTab(`https://xoul.ai/chats/@chat/${id}`)?.conversationId).toBe(id);
  expect(parseChatTab(`https://story.xoul.ai/chats/@chat/gp/${id}`)?.isGroup).toBe(true);
});

test("rejects non-chat tabs", () => {
  expect(parseChatTab("https://xoul.ai/explore")).toBeNull();
  expect(parseChatTab(`https://example.com/chats/${ID}`)).toBeNull();
  expect(parseChatTab("not a url")).toBeNull();
});

test("chatUrlFromDetails prefers group path when multiple xouls", () => {
  expect(chatUrlFromDetails(ID, { xouls: [{ name: "A" }, { name: "B" }] })).toBe(
    `https://xoul.ai/chats/gp/${ID}`,
  );
});

test("safeFilename strips reserved characters", () => {
  expect(safeFilename('Relon\'aer: "king"?')).toBe("Relon'aer_ _king__");
  expect(safeFilename("")).toBe("xoul-chat");
});
