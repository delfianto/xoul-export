import browser from "webextension-polyfill";
import { DEFAULT_SETTINGS, normalizeSettings, type Settings } from "./schema";

export async function loadSettings(): Promise<Settings> {
  try {
    const stored = await browser.storage.local.get(DEFAULT_SETTINGS);
    return normalizeSettings(stored);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: Settings): Promise<void> {
  const next = normalizeSettings(settings);
  await browser.storage.local.set(next);
}
