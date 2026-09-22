import { expect, test } from "bun:test";
import {
  contextFromPayload,
  DEFAULT_FILENAME_PATTERN,
  expandPattern,
  previewPattern,
  sanitizeFilenamePattern,
  type PatternContext,
} from "../../src/lib/path-pattern";
import { buildExportPayload } from "../../src/lib/format";

const now = new Date("2026-09-14T17:12:52.484Z");

const ctx: PatternContext = {
  char: "Alicia",
  chars: "Alicia",
  persona: "Bjorn Hansen",
  user: "Bjorn Hansen",
  title: "Alicia",
  id: "aaaebd6f-77e9-4358-a9cd-29dc01f75e24",
  ext: "html",
  now,
};

test("default pattern makes a session subdirectory", () => {
  expect(expandPattern(DEFAULT_FILENAME_PATTERN, ctx)).toBe(
    "Alicia-260914/2026-09-14T17-12-52Z.html",
  );
});

test("unknown tokens stay in the pattern", () => {
  expect(expandPattern("{char}/{nope}.{ext}", ctx)).toBe("Alicia/{nope}.html");
});

test("iso_date_time has no colons", () => {
  const path = expandPattern("{iso_date_time}.{ext}", ctx);
  expect(path).toBe("2026-09-14T17-12-52Z.html");
  expect(path.includes(":")).toBe(false);
});

test("parent segments are stripped", () => {
  expect(sanitizeFilenamePattern("{char}/../secret/{ext}")).toBe("{char}/secret/{ext}");
});

test("contextFromPayload uses xoul name and export time", () => {
  const payload = buildExportPayload({
    conversationId: "aaaebd6f-77e9-4358-a9cd-29dc01f75e24",
    url: "https://xoul.ai/chats/aaaebd6f-77e9-4358-a9cd-29dc01f75e24",
    details: { xouls: [{ name: "Alicia" }], personas: [{ name: "Bjørn Hansen" }] },
    memories: null,
    messages: [],
    exportedAt: "2026-09-14T17:12:52.484Z",
  });
  const built = contextFromPayload(payload, "json");
  expect(built.char).toBe("Alicia");
  expect(built.ext).toBe("json");
  expect(expandPattern("{char}-{date_yymmdd}/{iso_date_time}.{ext}", built)).toBe(
    "Alicia-260914/2026-09-14T17-12-52Z.json",
  );
});

test("preview shows Downloads root plus pattern", () => {
  expect(previewPattern("Xoul.ai", DEFAULT_FILENAME_PATTERN, now)).toBe(
    "~/Downloads/Xoul.ai/Alicia-260914/2026-09-14T17-12-52Z.html",
  );
});
