import { expect, test } from "bun:test";
import {
  DEFAULT_SETTINGS,
  normalizeSettings,
  sanitizeDownloadDir,
  selectedFormats,
} from "../../src/settings/schema";

test("sanitizeDownloadDir maps ~/Downloads/Xoul.ai to Xoul.ai", () => {
  expect(sanitizeDownloadDir("~/Downloads/Xoul.ai")).toBe("Xoul.ai");
  expect(sanitizeDownloadDir("Xoul.ai")).toBe("Xoul.ai");
  expect(sanitizeDownloadDir("/home/geist/Downloads/Xoul.ai/chats")).toBe("Xoul.ai/chats");
  expect(sanitizeDownloadDir("../etc")).toBe("etc");
  expect(sanitizeDownloadDir("")).toBe(DEFAULT_SETTINGS.downloadDirectory);
});

test("normalizeSettings defaults to all formats", () => {
  expect(normalizeSettings(null)).toEqual(DEFAULT_SETTINGS);
  expect(normalizeSettings({ formats: { json: false, markdown: false, html: false } })).toEqual(
    DEFAULT_SETTINGS,
  );
});

test("selectedFormats respects checkboxes", () => {
  expect(
    selectedFormats({
      downloadDirectory: "Xoul.ai",
      filenamePattern: "{char}-{date_yymmdd}/{iso_date_time}.{ext}",
      formats: { json: true, markdown: false, html: true },
    }),
  ).toEqual(["json", "html"]);
});
