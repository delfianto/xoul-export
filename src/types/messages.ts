import type { ChatTab } from "../lib/ids";
import type { ExportFormat } from "../lib/format";

export type { ExportFormat };

export type ExportProgress = {
  stage: "session" | "details" | "memories" | "history";
  page?: number;
  messages?: number;
};

export type UserSelf = {
  name?: string;
  slug?: string;
  email?: string;
};

export type SessionResult = { ok: true; user: UserSelf } | { ok: false; user: null; error: string };

export type ParseTabRequest = { type: "parseTab"; url: string };
export type SessionRequest = { type: "session" };
export type ExportRequest = {
  type: "export";
  conversationId: string;
};
export type ProgressEvent = { type: "export-progress"; progress: ExportProgress };

export type ExtensionRequest = ParseTabRequest | SessionRequest | ExportRequest;

export type ParseTabResponse = { ok: true; chat: ChatTab | null };
export type ExportResponse =
  | {
      ok: true;
      filenames: string[];
      downloadId: number;
      messageCount: number;
      title: string;
    }
  | { ok: false; error: string };
