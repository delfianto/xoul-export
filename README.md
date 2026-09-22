# Xoul Export

Your Xoul.AI chats can apparently live forever, provided “forever” means “until a product
decision, server incident, account problem, or sufficiently ambitious house cat says otherwise.”

Xoul Export is an unofficial browser extension that saves the **currently open** Xoul.AI chat as
Markdown, JSON, or a self-contained HTML file. It uses your existing signed-in browser session.
There is no API key because Xoul does not offer one, and there is no official export button because
that would have made this repository rather less necessary.

> [!CAUTION]
> Xoul.AI does not officially support chat exporting. This project is not affiliated with,
> endorsed by, or blessed during a full moon by Xoul.AI. It calls the same private API routes used
> by the web app, so those routes may change, disappear, rate-limit you, or become objectionable to
> the service at any time. Use it only with chats you are entitled to access and at your own risk.
> If Xoul somehow nukes your account after you export a 100,000-turn testament to the human
> condition, the author is not responsible. Back up responsibly; catastrophize recreationally.

## What it does

- Exports the chat open in the active tab—no public-catalog trawling and no mass scraping.
- Fetches conversation details, manual memories, and paginated message history.
- Restores the API's newest-first messages to chronological order, as civilization intended.
- Writes human-friendly Markdown, loss-minimizing JSON, and single-file offline HTML.
- Supports ordinary and group chat URLs: `/chats/{uuid}` and `/chats/gp/{uuid}`.
- Lets you choose the download directory, filename pattern, and output formats.
- Runs on Chrome and Firefox with the same `browser.*` API surface.

What it does **not** do: discover chats, walk the public catalog, export somebody else's hidden
character definition, or make any promise that a private API will remain private in precisely the
same shape.

## Install

You need [Bun](https://bun.sh/) 1.x. This project uses Bun and `vite-plus`; bringing `npm` or `npx`
to the ceremony will only upset the furniture.

### Chrome

```sh
bun install
bun run build
```

Then:

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select `build/chrome/`—not `src/`, and not an imaginary nested `extension/` directory.

### Firefox

```sh
bun install
bun run build:firefox
```

Open `about:debugging`, choose **This Firefox**, click **Load Temporary Add-on**, and select a file
inside `build/firefox/`. It is temporary because Firefox enjoys setting expectations.

## Use the extension

1. Sign in to [xoul.ai](https://xoul.ai/).
2. Open the conversation you want to preserve.
3. Click the Xoul Export icon.
4. Click **Export**.
5. Watch several megabytes of emotional archaeology arrive in your Downloads folder.

By default, all three formats are saved under:

```text
~/Downloads/Xoul.ai/{char}-{date_yymmdd}/{iso_date_time}.{ext}
```

For example:

```text
~/Downloads/Xoul.ai/Alicia-260922/2026-09-22T10-42-17Z.html
```

Open the extension's **Settings** page to change the relative download directory, filename pattern,
or enabled formats. Downloads do not open a Save As dialog. Existing names are uniquified rather
than overwritten, which is less exciting but considerably more polite.

Available filename tokens include `{char}`, `{chars}`, `{persona}`, `{user}`, `{title}`, `{id}`,
`{ext}`, `{date}`, `{date_yymmdd}`, `{date_yyyymmdd}`, `{iso_date}`, `{iso_date_time}`, `{time}`,
`{year}`, `{month}`, and `{day}`. Slashes in the pattern create subdirectories.

## CLI: for people who distrust buttons

The CLI performs the same export without installing the extension. Export your xoul.ai cookies
with Cookie Editor, save them as `cookie.json` in the repository root, then run:

```sh
bun run export-chat -- --url https://xoul.ai/chats/<uuid>
```

Or provide the conversation ID directly:

```sh
bun run export-chat -- --id <uuid>
```

Useful options:

```text
--cookies <path>             Cookie Editor JSON (default: ./cookie.json)
--out <directory>            Output directory (default: ./exports)
--format json|md|html|all    Output format (default: all)
--pattern <pattern>          Filename pattern
```

The cookie file must contain `xoul_backend_sess_tok`. It is an active session credential, not a
souvenir. Do not commit it, paste it into an issue, send it to a helpful stranger, or frame it above
your desk. `cookie.json`, `*.cookie.json`, and `exports/` are gitignored, but Git can only protect
you from mistakes it has been specifically introduced to.

## Permissions, explained before the browser does it ominously

| Permission           | Why it exists                                                        |
| -------------------- | -------------------------------------------------------------------- |
| `activeTab` / `tabs` | Identify the open Xoul chat and its conversation ID.                 |
| `cookies`            | Reuse your signed-in Xoul session; the auth cookie is HttpOnly.      |
| `downloads`          | Save the resulting files without a ceremonial copy-and-paste.        |
| `storage`            | Remember format, directory, and filename-pattern settings locally.   |
| Xoul host access     | Request chat details, memories, history, and optional avatar images. |

Your session cookie is used to talk directly to `api.xoul.ai`; the extension does not send your
export to a third-party server. The files remain wherever your browser puts downloads. You are,
naturally, still responsible for what happens to them after that.

## Output formats

| Format   | Best for                          | Contents                                                                                   |
| -------- | --------------------------------- | ------------------------------------------------------------------------------------------ |
| Markdown | Reading, searching, and migration | Metadata, memories, speakers, timestamps, and message text.                                |
| JSON     | Archival and future tooling       | Normalized messages plus raw messages and conversation details.                            |
| HTML     | Opening the chat offline          | A self-contained styled page with escaped content and small inline avatars when available. |

## Development

```sh
bun run dev             # watch mode for Chrome
bun run build           # production build → build/chrome/
bun run build:firefox   # production build → build/firefox/
bun run check           # format, lint, and type-check
bun run test            # unit tests
```

Before merging anything that seemed “too small to need tests”:

```sh
bun run check && bun run test
```

Source lives in `src/`, unit tests in `test/`, icons in `public/`, and original research notes in
`reference/`. Maintainer and agent guidance lives in [`AGENTS.md`](./AGENTS.md).

## How fragile is this?

The extension replays the routes the Xoul web app already calls with your logged-in cookie session.
That makes it straightforward, not official. A frontend or backend change can break it without
notice, and a sufficiently large chat may take a while because history is fetched 100 messages at
a time. If an export fails, confirm that you are signed in, that the chat is open and accessible,
and that Xoul has not rearranged the furniture again.

Please do not use this as a crawler. It exports one chat you already opened (or one ID/URL you
explicitly give the CLI). The absence of a public export feature is a reason to preserve your own
data, not a coupon for other people's.

## Disclaimer

This software is provided as-is, without warranty. You are responsible for complying with the
service's current terms, applicable law, and basic operational common sense. The author cannot
guarantee account safety, API stability, uninterrupted service, or that rereading 100,000 turns
will improve your weekend.
