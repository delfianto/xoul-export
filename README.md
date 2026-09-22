# Xoul Export

Dump the Xoul.AI chat you already have open to **Markdown** or **JSON**. Uses your browser session cookie. There is no Xoul API key.

## Install (Chrome)

```sh
bun install
bun run build          # → build/chrome/
```

`chrome://extensions` → Developer mode → **Load unpacked** → pick `build/chrome/`.

Open a conversation on [xoul.ai](https://xoul.ai) (`/chats/{uuid}` or `/chats/gp/{uuid}`), click the icon, **Export**. Files land in `~/Downloads/Xoul.ai/{char}-{date}/{time}.{ext}` (no Save As). Change folder, filename pattern, and formats on the Settings page.

Firefox: `bun run build:firefox` → `about:debugging` → Load Temporary Add-on → anything in `build/firefox/`.

## CLI (Cookie Editor JSON)

Save cookies from xoul.ai as `cookie.json` in the repo root (gitignored). The session cookie is `xoul_backend_sess_tok`.

```sh
bun run export-chat -- --url https://xoul.ai/chats/<uuid>
```

Writes into `exports/` (also gitignored).

## Layout

Same shape as [clanker-clicker-t9000](https://github.com/delfianto/clanker-clicker-t9000): TypeScript under `src/`, icons in `public/`, tests in `test/`, unpacked build in `build/chrome/`. Agent notes: [`AGENTS.md`](./AGENTS.md).
