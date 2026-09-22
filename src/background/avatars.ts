import type { NamedSlug } from "../lib/format";

const MAX_EDGE = 480;
const JPEG_QUALITY = 0.82;

function firstHttpsUrl(value: unknown): string | null {
  if (typeof value === "string" && /^https:\/\//i.test(value)) return value;
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = firstHttpsUrl(item);
      if (found) return found;
    }
  }
  return null;
}

async function downscaleToJpeg(buffer: ArrayBuffer, mime = "image/png"): Promise<string | null> {
  if (typeof OffscreenCanvas === "undefined" || typeof createImageBitmap !== "function") {
    return null;
  }
  const bitmap = await createImageBitmap(new Blob([buffer], { type: mime }));
  try {
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(bitmap, 0, 0, width, height);
    const blob = await canvas.convertToBlob({ type: "image/jpeg", quality: JPEG_QUALITY });
    const bytes = new Uint8Array(await blob.arrayBuffer());
    let binary = "";
    const step = 0x8000;
    for (let i = 0; i < bytes.length; i += step) {
      binary += String.fromCharCode(...bytes.subarray(i, i + step));
    }
    return `data:image/jpeg;base64,${btoa(binary)}`;
  } finally {
    bitmap.close();
  }
}

async function fetchTinyAvatar(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, { credentials: "omit" });
    if (!response.ok) return null;
    const mime = response.headers.get("content-type") || "image/png";
    const buffer = await response.arrayBuffer();
    if (!buffer.byteLength) return null;
    return await downscaleToJpeg(buffer, mime);
  } catch {
    return null;
  }
}

export async function embedIcons(people: NamedSlug[]): Promise<Record<string, string>> {
  const icons: Record<string, string> = {};
  for (const person of people) {
    const name = person.name;
    const url = firstHttpsUrl(person.icon_url);
    if (!name || !url || icons[name]) continue;
    const dataUri = await fetchTinyAvatar(url);
    if (dataUri) icons[name] = dataUri;
  }
  return icons;
}
