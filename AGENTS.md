# Xoul Export — Agent Reference

Personal MV3 browser extension (Chrome + Firefox) that dumps the **currently open** Xoul.AI chat to Markdown or JSON using the user's logged-in cookie session. No Xoul-issued API key. Do not walk the public catalog.

---

## Stack

| Tool | Version | Purpose |
| --- | --- | --- |
| TypeScript | 7.0 (stable) | Language — strict, no legacy cruft |
| Bun | 1.x | Package manager + script runner (not npm/yarn) |
| vite-plus (`vp`) | latest | Unified VoidZero toolchain — bundler, linter (oxlint), formatter (oxfmt), type checker |
| vite-plugin-web-extension | 4.x | Multi-entry extension build + manifest generation |
| webextension-polyfill | 0.12 | Unified `browser.*` API surface across Chrome/Firefox |

All commands go through `bun run <script>` or the `vp` CLI directly.
**Never use npm or npx.**

---

## Build commands

```sh
bun run build           # production build → build/chrome/
bun run build:firefox   # production build → build/firefox/
bun run dev             # watch mode (Chrome)
bun run check           # vp check (fmt + oxlint) && tsc (run before committing)
bun run lint            # vp lint src/ — oxlint only
bun run fmt             # vp fmt src/ — oxfmt format
bun run test            # bun test — unit suite (run with check before merging)
bun run export-chat     # CLI: Cookie Editor JSON → Markdown/JSON (needs cookie.json)
```

Load the extension: Chrome → `chrome://extensions` → Developer mode → Load unpacked → `build/chrome/`

---

## Testing

Unit tests live in `test/` (mirrors `src/`), run by **`bun test`**. A `bunfig.toml` preloads `test/setup.ts` (happy-dom). Pre-merge gate: `bun run check && bun run test`.

Covered:

- `src/lib/ids.ts` — chat URL parse (`/chats/{uuid}`, `/chats/gp/{uuid}`, legacy `@chat` / `story.xoul.ai`)
- `src/lib/format.ts` — newest-first history → chronological Markdown/JSON/HTML payload
- `src/settings/schema.ts` — download directory sanitization + format checkboxes

`test/` is not in the tsc `include` (keeps bun's test types out of the extension typecheck); `vp check` still fmt+lints it.

---

## Project structure

```
src/
  background/
    index.ts          # Service worker: parseTab / session / export + downloads
    api.ts            # api.xoul.ai GET with credentials:include + cookie fallback
  popup/
    index.html / index.ts / styles.css
  options/
    index.html / index.ts / styles.css   # settings page
  settings/
    schema.ts         # download directory + format defaults
    storage.ts        # browser.storage.local
  lib/
    ids.ts            # parseChatTab, chatUrlFromDetails, safeFilename
    format.ts         # Markdown / JSON / self-contained HTML
  types/
    messages.ts       # extension message protocol
public/
  icons/              # official Xoul hourglass+O (from pwa-icon-512); 16/32 are hourglass-only
scripts/
  export-chat.ts      # bun CLI using Cookie Editor JSON (cookie.json)
reference/            # original research notes (tracked)
test/                 # bun:test, mirrors src/
```

Load unpacked from **`build/chrome/`**, never from `src/` and never from a nested `extension/` folder.

Settings (`options_ui`, open in a tab):

- **Download directory** — relative to Chrome’s Downloads folder. Default `Xoul.ai` → `~/Downloads/Xoul.ai`. Absolute/`~/Downloads/...` paths are stripped down to that relative folder. `saveAs` is off.
- **Filename pattern** — handlebars `{token}` path. Default `{char}-{date_yymmdd}/{iso_date_time}.{ext}` (session subdirectory + timestamped file). `{iso_date_time}` is colon-free (`2026-09-14T17-12-52Z`). Slashes create folders. Logic in `src/lib/path-pattern.ts`.
- **Formats** — JSON, Markdown, HTML, All. Default all three. HTML is a single offline file (inline CSS, escaped text, optional tiny avatars).

---

## Auth and API

Xoul has **no public developer API**. The SPA is a CORS client of FastAPI at `https://api.xoul.ai/api/v1`. Browser auth is the HttpOnly cookie **`xoul_backend_sess_tok`** on `.xoul.ai` (`SameSite=Lax`). Also present: `xoul_backend_userinfo` (non-HttpOnly UI cookie).

Always use `browser.*` from `webextension-polyfill`, not `chrome.*`.

| Need | Route |
| --- | --- |
| Session | `GET /api/v1/user/self` |
| Chat meta | `GET /api/v1/conversation/details?conversation_id=` |
| Memories | `GET /api/v1/conversation/manual-memory?conversation_id=` |
| Messages | `GET /api/v1/chat/history?conversation_id=&cursor=&limit=100` |

History is a **bare array**, newest-first. Next page cursor is the last item's `turn_id` when `turn_id > 0`. First page omits `cursor` (`null` is dropped from the query string, same as the SPA).

Chat URLs: `https://xoul.ai/chats/{uuid}` and `https://xoul.ai/chats/gp/{uuid}`.

CLI path: Cookie Editor export saved as `cookie.json` (gitignored). Session cookie name must be `xoul_backend_sess_tok`.

`GET /api/v1/export/all` is **404**. Do not restore it. Do not mass-GET `catalog/feed` / `xoul/slist` for other people's `definition`.

---

## TypeScript conventions

- TS 7: `baseUrl` is **removed** — don't add it to `tsconfig.json`
- `exactOptionalPropertyTypes: true` — no implicit `undefined` spreading
- `noUncheckedIndexedAccess: true` — array index access returns `T | undefined`
- `verbatimModuleSyntax: true` — use `import type` for type-only imports
- `skipLibCheck: true` — do not remove

---

## oxlint / oxfmt

Config lives inside `vite.config.ts` under `lint:` and `fmt:` blocks.
Standalone `oxlint.json` is **not picked up** by `vp` — don't create one.

- `no-console: off`

---

## Git hygiene

- `cookie.json` / `*.cookie.json` — gitignored (session token)
- `exports/` — gitignored (dumped chats)
- `build/` — gitignored; always regenerated
- `reference/` — **tracked** original research (unlike clanker-clicker, this is not a third-party dump)

---

## Product constraints

- Export **the open chat**, or a CLI id/url the user already owns.
- Content policy: do not port another creator's hidden definition into a local card by default.
- ToS bans bots/scraping; this tool is a personal session replay of routes the SPA already calls.
