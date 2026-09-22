const UUID = "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}";

const CHAT_PATH = new RegExp(`^/chats/(?:@chat/)?(?<group>gp/)?(?<id>${UUID})/?$`, "i");

const HOSTS = new Set(["xoul.ai", "www.xoul.ai", "story.xoul.ai"]);

export type ChatTab = {
  conversationId: string;
  isGroup: boolean;
  path: string;
  url: string;
};

export type DetailsForUrl = {
  isMulti?: boolean;
  xouls?: readonly unknown[];
};

export function parseChatTab(urlString: string | null | undefined): ChatTab | null {
  if (!urlString) return null;
  let url: URL;
  try {
    url = new URL(urlString);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  if (!HOSTS.has(url.hostname)) return null;
  const match = CHAT_PATH.exec(url.pathname);
  const id = match?.groups?.["id"];
  if (!id) return null;
  const conversationId = id.toLowerCase();
  const isGroup = Boolean(match.groups?.["group"]);
  const path = isGroup ? `/chats/gp/${conversationId}` : `/chats/${conversationId}`;
  return {
    conversationId,
    isGroup,
    path,
    url: `https://xoul.ai${path}`,
  };
}

export function chatUrlFromDetails(conversationId: string, details: DetailsForUrl | null): string {
  const group = details?.isMulti === true || (details?.xouls?.length ?? 0) > 1;
  const path = group ? `/chats/gp/${conversationId}` : `/chats/${conversationId}`;
  return `https://xoul.ai${path}`;
}

export function safeFilename(name: string | null | undefined): string {
  const cleaned = String(name ?? "")
    .replace(/[<>:"/\\|?*]/g, "_")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
  return cleaned || "xoul-chat";
}
