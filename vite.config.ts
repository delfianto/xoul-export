import { defineConfig } from "vite-plus";
import webExtension from "vite-plugin-web-extension";

type Browser = "chrome" | "firefox";

const browser = (process.env["BROWSER"] ?? "chrome") as Browser;

function makeManifest(target: Browser): Record<string, unknown> {
  const base: Record<string, unknown> = {
    manifest_version: 3,
    name: "Xoul Export",
    version: "1.0.0",
    description:
      "Export the open Xoul.AI chat to JSON, Markdown, or HTML using your logged-in session.",
    icons: {
      "16": "icons/icon16.png",
      "32": "icons/icon32.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png",
    },
    permissions: ["activeTab", "tabs", "cookies", "downloads", "storage"],
    host_permissions: [
      "https://xoul.ai/*",
      "https://*.xoul.ai/*",
      "https://api.xoul.ai/*",
      "https://*.xoul-media.com/*",
    ],
    background: { service_worker: "src/background/index.ts", type: "module" },
    options_ui: { page: "src/options/index.html", open_in_tab: true },
    action: {
      default_title: "Export this Xoul chat",
      default_popup: "src/popup/index.html",
      default_icon: {
        "16": "icons/icon16.png",
        "32": "icons/icon32.png",
        "48": "icons/icon48.png",
        "128": "icons/icon128.png",
      },
    },
  };

  if (target === "firefox") {
    base["browser_specific_settings"] = {
      gecko: {
        id: "xoul-export@local",
        strict_min_version: "128.0",
      },
    };
  }

  return base;
}

export default defineConfig({
  build: {
    outDir: `build/${browser}`,
    emptyOutDir: true,
    sourcemap: process.env["NODE_ENV"] !== "production",
    minify: process.env["NODE_ENV"] === "production" ? "esbuild" : false,
  },

  lint: {
    ignorePatterns: ["build/**", "node_modules/**", "exports/**", "reference/**", "AGENTS.md"],
    rules: {
      "no-console": "off",
    },
  },

  fmt: {
    ignorePatterns: ["build/**", "node_modules/**", "exports/**", "reference/**", "AGENTS.md"],
  },

  plugins: [
    webExtension({
      browser,
      manifest: () => makeManifest(browser),
    }),
  ],
});
