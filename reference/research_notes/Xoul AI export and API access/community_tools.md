# Unofficial / community ways to export or client Xoul.AI

Scope: Xoul.AI the character-chat site (`https://xoul.ai`, API host `https://api.xoul.ai`). This is **not** the unrelated Korean personal-assistant repo `xoul-project/xoul` (QEMU/Ollama desktop agent with Telegram/Discord/Slack clients). Official company GitHub org `xoul-ai` (https://github.com/xoul-ai) publishes forks (vaul, excalidraw, aiogoogle) and **no** public Xoul.AI client SDK.

Research date: 2026-09-22. Last-updated dates below are the dates on the cited pages, not live verification of each tool.

## Catalog of concrete tools (quick index)

| Tool | What it exports / imports | Auth | Last known update | 2026 status |
| --- | --- | --- | --- | --- |
| Official **Export All** button (account settings) | Zip of chats, Xouls, personas, scenarios, lorebooks, voices, posts | Logged-in web/app session | Shipped 2025-04-21 for the shutdown | **Unverified after relaunch.** Official 2026 GitBook Account Settings page does not document it. |
| `GET https://api.xoul.ai/api/v1/export/all` | Same zip as the button | Browser cookies / session from a logged-in tab | Used 2025-04-21 through at least 2025-07 | **Unverified in 2026.** Worked for days after the April 2025 shutdown if cookies still existed. |
| Greasy Fork **Download Full Chat History as HTML file** (Clawberry) | One 1:1 chat as HTML (names, timestamps, messages) | Tampermonkey `GM_xmlhttpRequest` + cookies on `api.xoul.ai` | 2025-04-13 v2.5 | Script still listed; last code update is pre-relaunch. `@match` is `https://story.xoul.ai/*`. |
| Greasy Fork UI scripts (LuxTallis notepad / background / styler; Clawberry numbering / CSS) | **Do not export** Xoul data | localStorage / DOM on `xoul.ai` | Dec 2024 | Cosmetic only. |
| Chrome Web Store **Xoul export extension** | — | — | — | **None found.** |
| mefriend.ai **My → Import from Xoul.ai** | Imports unzipped folders into mefriend | mefriend account; Xoul zip already on disk | 2025-04-22/23 docs | Importer docs still live. Requires a prior Xoul zip. |
| **SOX Project** (Junj DragonFox, Xoulcord) | Xoul zip → SillyTavern cards + chats; also JSON V2 | Local/web converter on export files | Reddit 2025-04-27 | Host URL stripped from public Reddit snippets; no GitHub repo found. |
| Wyvern **Xoul to Card Converter** (mod, GitHub Pages JS) | Xoul character JSON → SillyTavern V2 JSON | None (client-side JS) | Reddit 2025-04-25 | Host URL stripped from public Reddit snippets. |
| Wyvern ChatGPT prompt | Xoul fields → ST V2 JSON | Paste into ChatGPT | Reddit 2025-04-21 | Manual; native Wyvern import of Xoul JSON failed. |
| Charsnap **Xoul Import Guide** | Manual field mapping (not zip ingest) | Copy/paste in Charsnap UI | 2025-04-21 | Docs still live; Charsnap JSON/PNG import is generic, not Xoul-native. |
| FadeInHeaven **chat export viewer** | Read chats from the zip | Local zip upload | Reddit 2025-07-18 | Host URL stripped. Author said `export/all` still worked then after login-from-404. |
| **Re:Soul** (Father Gucci) | Zip viewer + stats, heatmap, search, tier lists | Local zip upload | Reddit 2025-08-15 | Host URL stripped. |
| Reddit Python DIY (r/XoulAI 2025-06-05) | `chats_single` JSON → SillyTavern JSONL | Local files | 2025-06-05 | Code only in the Reddit post; not a published repo. |
| Discord **Fathe** executable | Xoul JSON → more-compatible JSON | Local exe | Mentioned 2025-04-22 | No public download URL found. |
| Spellbound “tool” | Unspecified | Unspecified | One Reddit mention 2025-04-21 | **Not identified.** |
| JanitorAI / generic ST PNG converters | Not Xoul-specific | N/A | Various 2025–2026 | Convert **after** you already have V2 JSON/PNG. |
| Official iOS/Android apps | Same product as web | Same Xoul account | iOS 1.010 on 2025-11-08 | iOS live; Android Play listing later removed (see mobile section). |

---

## Is there a Tampermonkey/Violentmonkey userscript or Chrome extension for Xoul export?

### Takeaway
Yes: one Greasy Fork userscript exports a **single 1:1 chat to HTML** by calling `api.xoul.ai`. There is **no** Chrome Web Store extension for Xoul export. Other Greasy Fork scripts for `xoul.ai` are UI-only.

### Cited Findings
- Greasy Fork lists four scripts for `xoul.ai`: **Xoul AI Notepad**, **Xoul AI Background Manager**, **Xoul AI Chat Unified Styler** (LuxTallis, Dec 2024), and **Download Full Chat History as HTML file** (Clawberry). — [Greasy Fork site listing](https://greasyfork.org/en/scripts/by-site/xoul.ai)
- **Download Full Chat History as HTML file** (script 523418): author Clawberry; created 2025-01-10; updated **2025-04-13**; version **2.5**; ~122–127 total installs; MIT; applies to `xoul.ai`. Description: “A primitive script to download chat history from xoul.ai. Downloads an HTML file with names, timestamps and message history. … Warning: works only in chats, not scenarios!” Credits @Moaki for pagination. — [Greasy Fork script page](https://greasyfork.org/eo/scripts/523418-download-full-chat-history-as-html-file)
- Userscript metadata (from Greasy Fork code view): `@match https://story.xoul.ai/*`; `@grant GM_xmlhttpRequest`; `@connect api.xoul.ai`; `@author Clawberry+ChatGPT+Moaki`. On click it takes `conversationId` from `window.location.pathname.split('/').pop()`, then fetches `https://api.xoul.ai/api/v1/conversation/details?conversation_id=${conversationId}`, reads `details.xouls?.[0]` for the assistant name, paginates messages, and downloads `${assistantName}_${formattedTimestamp}.html`. — [Greasy Fork code snippet](https://greasyfork.org/nb/scripts/523418-download-full-chat-history-as-html-file/code)
- Reddit r/XoulAI (2025-04-20, u/Covvee) instructed users to install Tampermonkey then that Greasy Fork script to “Back up your chats as an HTML file.” Explicit: **“THIS DOES NOT WORK FOR GROUP CHATS.”** When installed correctly a “download full chat” button appears bottom-right. Attributed to “Claw”; “Berry talked about how to do it.” — [r/XoulAI post](https://www.reddit.com/r/XoulAI/comments/1k3m54u/back_up_your_chats_as_an_html_file_on_your)
- Clawberry’s other scripts (**Manual Message Numbering**, **Custom CSS for Max Width and Font**) target chat UI, not data export. — [Clawberry Greasy Fork profile](https://greasyfork.org/fr/users/1374965-clawberry?language=js)
- LuxTallis **Xoul AI Notepad** (`@match https://xoul.ai/*`, `@grant none`) stores per-chat notes; chat IDs parsed from `/chats/([a-f0-9\-]+)`. **Background Manager** same URL pattern, localStorage key `background_images`. These are not account exporters. — [Notepad source](https://greasyfork.org/en/scripts/521002-xoul-ai-notepad/code); [Background Manager source](https://greasyfork.org/es-419/scripts/521039-xoul-ai-background-manager/code)
- Web searches for Chrome Web Store “xoul.ai export extension” returned generic ChatGPT/Claude/Grok exporters, **not** a Xoul.AI store listing. — [Chrome Web Store search results in this research](https://chromewebstore.google.com/detail/export-ai-chat-claude-cha/gfhigpoceginmhbpncohekbkipabidhe)

### Inferences
- The only community **export** userscript is Clawberry 523418. It is a **per-chat HTML dump**, not an account zip, not ST V2, not PNG cards.
- Authentication is the **already-logged-in browser session**: `GM_xmlhttpRequest` to `api.xoul.ai` with Tampermonkey’s cookie/connect grant. No API key.
- `@match https://story.xoul.ai/*` vs LuxTallis `@match https://xoul.ai/*` means the HTML exporter may **not fire** on the current apex domain if chats no longer live on `story.xoul.ai` after the 2025 relaunch.
- Last code change is **2025-04-13**, eight days before shutdown. Pagination/API paths may have changed in V.2 (Sept 2025). Daily installs were ~0–1 when sampled in 2026 listings, which is not proof it still works.

### Gaps
- Full userscript source (pagination endpoint names, headers, cookie vs bearer) was only partially returned by the fetch tool; the conversation-details URL is confirmed, the message-list URL is not quoted in full.
- No live 2026 test of the script against current `xoul.ai` / `api.xoul.ai`.
- No Chrome/Firefox **extension** (as opposed to a userscript) for Xoul was found.

---

## What is the mefriend.ai Xoul importer and what zip folder structure does it expect?

### Takeaway
Mefriend shipped a one-click **folder drop** importer on 2025-04-22/23, the day after Xoul’s shutdown. It does **not** call `api.xoul.ai`. Users unzip the official Xoul export and drop five named folders into **My → Import from Xoul.ai**.

### Cited Findings
- Guide title: “Importing Your Data from Xoul.ai — One Click.” Dated in the URL as `xoul_integration_guide__2025_04_22`. Assumes “you’ve downloaded the Xoul export zip.” — [mefriend Xoul import guide](https://docs.mefriend.ai/xoul_integration_guide__2025_04_22)
- **What you can import today** (quoted folder names):
  - **One-on-one chats** (`chats_single`) – “every message lands straight in your chat list”
  - **Personas you created** (`personas`)
  - **Xouls you created** (`xouls`)
  - **Scenarios you’ve created** (`scenarios`)
  - **Lorebooks you created** (`assets`)
  — [same guide](https://docs.mefriend.ai/xoul_integration_guide__2025_04_22)
- Unzip table (quoted):

  | Folder | Meaning |
  | --- | --- |
  | `chats_single` | Your private conversations |
  | `personas` | Characters you built |
  | `xouls` | Xouls you published |
  | `scenarios` | Scenarios you published |
  | `assets` | Lorebooks you’ve created |

  “No worries if you’re missing a folder. That just means you never used that feature.” — [same guide](https://docs.mefriend.ai/xoul_integration_guide__2025_04_22)
- Drop mapping: **Chats** → entire `chats_single` folder; **Personas** → `personas`; **Xouls** → `xouls`; **Scenarios** → `scenarios`; **Lorebooks** → `assets`. Then **Upload**. “Processing usually finishes in under a minute.” — [same guide](https://docs.mefriend.ai/xoul_integration_guide__2025_04_22)
- UI path: create/log in at mefriend.ai → **My → Import from Xoul.ai**. Verify: Chats page; **My Characters** for personas/xouls; **My** for scenarios/lorebooks. Imported visibility “default to the settings of Xoul.” — [same guide](https://docs.mefriend.ai/xoul_integration_guide__2025_04_22)
- Welcome page: “Xoul.ai may be gone, but your stories don’t have to be.” Steps: account → import backup → choose a model. “your chats, personas, xouls, scenarios, and lorebooks appear exactly where you expect them.” — [Welcome, Xoul Users!](https://docs.mefriend.ai/xoul_welcome)
- Changelog v1.6.0 **Apr 23 2025**: “Yesterday Xoul closed its doors.” Feature **“One-Click Xoul Import!”**: “Drag your exported files into **My → Import from Xoul.ai**”; “We move chats, personas, xouls, scenarios, and lorebooks—nothing lost.” — [mefriend changelog 2025-04-23](https://docs.mefriend.ai/changelog_2025_04_23)
- Mefriend’s **separate** Chrome extension importer is for Character.AI, Yodayo, JanitorAI, Polydazz/Polybuzz, SpicyChat, Joyland, Wyvern — **not** listed as a Xoul source. Xoul uses the zip/folder path, not the extension. — [mefriend Character Import](https://docs.mefriend.ai/import_guide)

### Inferences
- The official Xoul zip is a **foldered archive**, not a single JSON blob. mefriend’s expected names are the strongest public spec of that layout.
- mefriend’s table **omits `chats_multi`**. Independent Reddit writeups of the same zip include `chats_multi` (see SillyTavern section). Group chats were likely **not** in the one-click importer.
- “Personas” in mefriend’s table is labeled “Characters you built,” which **collides** with Xoul’s own vocabulary (Persona = user identity; Xoul = character card). Treat mefriend’s `personas` folder as whatever the zip actually puts there, not as a guarantee of Xoul semantics.
- Auth for this path is **offline**: Xoul session is only needed to **obtain** the zip. mefriend never talks to `api.xoul.ai`.

### Gaps
- No mefriend sample JSON keys, filenames inside each folder, or whether files are one-JSON-per-entity vs nested arrays.
- Whether the importer still works in 2026 against **post-relaunch** zips (if export was even re-enabled) is untested.
- `chats_multi`, voices, and posts are in Reddit’s “export all” description but **not** in mefriend’s drop boxes.

---

## Did people convert Xoul JSON to SillyTavern character card v2 / PNG cards? Any converters?

### Takeaway
Yes, several **community** converters and recipes existed in April–June 2025: SOX Project (ST + chats + JSON V2), a Wyvern GitHub Pages JS converter, a ChatGPT V2 prompt, a Reddit Python JSONL recipe, and manual Charsnap field maps. Native Xoul JSON is **not** SillyTavern V2; PNG cards are a **second** step after V2 JSON. Public host URLs for SOX and the Wyvern converter were stripped from Reddit search snippets and were not recovered.

### Cited Findings
- **SOX Project (“Save Our Xouls”)** — Reddit 2025-04-27: “Use your exported Xoul backup data and port them to Silly Tavern with the SOX Project.” “This is the web version for mobile:” (URL omitted in aggregator). “If you need to convert your exported Xoul backup data to json V2 (more universally accepted by other sites), they have a tool for that too.” Migrates “chat history (single and multi-character chats).” Author: **Junj DragonFox** in Xoul Discord; questions in the **SOX Project thread**. Comments: you can only fully continue a chat if you **created** that Xoul; otherwise “extract character tools” can snapshot partial data **without advanced fields**. — [r/XoulAI SOX post](https://www.reddit.com/r/XoulAI/comments/1k9c04h/save_our_xouls_sox_project_create_your_own_mini)
- **Wyvern native import failed.** r/WyvernChat 2025-04-21: importing Xoul characters left fields blank. Staff reply: Xoul uses a different format; a community ChatGPT prompt converts “Xoul/V1 format to SillyTavern V2 format.” Prompt (quoted): merge personality/backstory into `description`; output JSON with `name`, `description`, empty `personality`, `scenario` from `default_scenario`, `first_mes` from greeting, `mes_example` from samples, optional `metadata` (tags, creator, character_version). “Do not include the old personality field separately.” Follow-up: “the json format is not compatible to the one Wyvern uses” for chat history. — [r/WyvernChat importing characters](https://www.reddit.com/r/WyvernChat/comments/1k4krx3/importing_characters/)
- **Wyvern “Xoul to Card Converter”** — r/WyvernChat 2025-04-25: a Wyvern **moderation-team** volunteer published a “tiny JavaScript embedded into the web page hosted by Github.” “Converter doesn’t store any data.” Caveats: move System prompt into advanced; examples must use `{{char}}:` / `{{user}}:` not `xoul` or the character name; **Backstory is merged with definition**. Asked for lorebooks/characters/personas for tests. Thread-for-feedback link omitted in aggregator. — [r/WyvernChat Xoul to Card Converter](https://www.reddit.com/r/WyvernChat/comments/1k7e3qi/xoul_to_card_converter)
- **Charsnap** is **manual mapping**, not zip ingest. Field map (quoted from the 2025-04-21 guide):
  - Name / Gender / Age → same
  - Short Description → Short Description (not read by the bot)
  - Handle → **not available**
  - Description → Charsnap **Personality** (Xoul later merged old Personality+Description)
  - Greeting → **First Message**
  - Creator Memo → Creator Memo (Charsnap requires trigger warnings for dead dove)
  - Default Scenario → **Scenario**
  - Advanced Definition → Charsnap **Description**
  - Chat Samples → **Example Messages** (**not** permanent memory on Charsnap, unlike Xoul)
  - Community Tags → Category
  - Xoul system prompts that lived in Advanced Definition → Charsnap **System prompt** / **Always-Active system prompt**
  — [Charsnap Xoul Import Guide](https://charsnap.gitbook.io/charsnap/basics-for-creators/character-creation/xoul-import-guide.md)
- Charsnap’s generic importer: **Import JSON** on Basics (full character, up to 5 variants) or **Import Variant**; PNG from C.ai or Chub. “Images are not imported via JSON.” — [Charsnap character creation](https://charsnap.gitbook.io/charsnap/basics-for-creators/character-creation.md)
- Reddit 2025-04-21 “where can i import my xouls to?”: Charsnap Google Doc by Spacy; Wyvern “import tool choked”; “I believe Spellbound put up a tool.” — [r/XoulAI](https://www.reddit.com/r/XoulAI/comments/1k4l2yu/where_can_i_import_my_xouls_to/)
- **Zip internals used by ST importers** (Reddit 2025-06-05 “Importing XOUL Chats into SillyTavern”): unzip yields `chats_multi` and `chats_single`. Single-chat JSON contains (quoted keys):

  ```json
  "xouls": [{
    "slug": "slugname.xo",
    "name": "Some Name",
    "icon_url": "someurl",
    "voice_id": "phwjJOglQ9KN6V1CnF5B",
    "talkativeness": 0.5,
    "tagline": "...",
    "age": 39,
    "bio": "...",
    "backstory": "...",
    "gender": "female",
    "samples": "..."
  }],
  "personas": [{
    "slug": "96c44245-0818-42e6-b2b2-3319a14bb824",
    "name": "Anon",
    "icon_url": "https://user-images.prod.xoul-media.com/images/....png",
    "prompt": "unknown",
    "user_slug": "ffsggs",
    "gender": "male",
    "privilege": "ADMIN"
  }]
  ```

  Author created the ST card **manually** (name must match exactly; download `icon_url`), then ran **local Python** in the same directory as the chat JSON files to emit SillyTavern format, then **Manage Chat Files → Import**. Group chats: make one card per Xoul. — [r/XoulAI Importing XOUL Chats into SillyTavern](https://www.reddit.com/r/XoulAI/comments/1l452g7/importing_xoul_chats_into_sillytavern)
- Related: r/XoulAI 2025-05-06 asked for ChatGPT prompt or Python to convert Xoul chat history to SillyTavern schema after the **character card** already imported. — [r/XoulAI](https://www.reddit.com/r/XoulAI/comments/1kfuzo6/xoul_chat_history_to_sillytavern/)
- Moderator post 2025-04-22: after exporting, “ask ChatGPT to convert these”; Discord mod **Fathe** “is sharing an executable to convert these files into JSONs that are more compatible on other platforms.” — [r/XoulAI Don’t wait, export](https://www.reddit.com/r/XoulAI/comments/1k4w3ws/dont_wait_export_your_content_now/)
- r/XoulAI 2025-04-23: “if you have png and json, you can upload about anywhere”; “open the json with a text editor… copy the text into the personality field”; “Try Wyvernchat or Chub.” — [r/XoulAI](https://www.reddit.com/r/XoulAI/comments/1k69n6i/got_everything_exported_both_on_phone_and_laptop/)
- Generic ST PNG tools (charactercardconverter.com, JanitorAI ST exporters) list SillyTavern/CAI/Kobold/etc. **None list Xoul as a source format** in the pages retrieved. — [charactercardconverter.com](https://charactercardconverter.com/)
- Xoul creation guide (rentry) treats a Xoul as a “character card” conceptually and mentions SillyTavern as a **separate frontend**, not as an official export target. Macros `{{char}}` / `{{xoul}}` / `xoul` are equivalent **on Xoul**; ST macros like `{{time}}` do not work on Xoul. — [rentry Xoul Creation Guide](https://rentry.co/XoulCreationGuide)

### Inferences
- The practical pipeline people used: **official zip → (SOX or Wyvern JS or ChatGPT or Python) → ST V2 JSON → (optional) PNG card embed**. PNG was not Xoul-native.
- Xoul field names in the zip (`bio`, `backstory`, `tagline`, `samples`, `default_scenario` / greeting, `slug` with `.xo`) do not match ST V2 (`description`, `personality`, `first_mes`, `mes_example`, `spec: "chara_card_v2"`).
- Chat conversion is a **second**, harder problem (JSONL with `name`, `is_user`, `mes`, `send_date`). SOX claimed to do it; the June 2025 Reddit post rolled a one-off Python instead, implying SOX was not universally used or available.
- `icon_url` hosts on `user-images.prod.xoul-media.com` — avatars are **URLs**, not files in the zip (mefriend/Charsnap both imply images may need a separate fetch).

### Gaps
- **SOX and Wyvern converter URLs** (GitHub Pages / Hugging Face / itch) were not recoverable from public search snippets. No GitHub repo named SOX / Save-Our-Xouls / Junj-DragonFox was found.
- Full Python source from the June 2025 Reddit post was truncated; cannot quote the JSONL mapping.
- Fathe’s executable: no filename, hash, or download page.
- Spellbound: one mention, no product page found (name collides with unrelated software).
- No evidence of a maintained 2026 converter. charactercardconverter.com (updated 2026) still does not list Xoul.
- Hangjam was named as a destination; no Hangjam Xoul importer docs were found.

---

## Mobile apps: iOS/Android package names, whether they share api.xoul.ai

### Takeaway
Official apps are **Xoul AI – Imagine Anything** by **Xoul Inc.** / **xoul.ai**. iOS bundle ID is `ai.xoul.xoulapp` (App Store 6673608916). Android package IDs in third-party stores disagree (`ai.xoul.android` vs `ai.xoul.xoulapp.android`). They are the same product as the website (same seller URL `https://xoul.ai`); community export used the **same** `api.xoul.ai` from a logged-in **browser**, including when the native app export failed. Do not confuse with the unrelated iOS “Xoul Parenting” app `id6756933529`.

### Cited Findings
- iTunes lookup: `bundleId` **`ai.xoul.xoulapp`**; `trackId` **6673608916**; `trackName` “Xoul AI - Imagine Anything”; `artistName` “xoul.ai”; `sellerName` “Xoul Inc.”; `sellerUrl` **`https://xoul.ai`**; version **1.010**; `currentVersionReleaseDate` **2025-11-08**; `releaseDate` 2025-01-08; 17+; ~39.5 MB. Version notes include “We're so back” (1.006, 2025-09-11) and “new auth” (1.004, 2025-03-16). — [iTunes lookup id=6673608916](https://itunes.apple.com/lookup?id=6673608916); [App Store US](https://apps.apple.com/us/app/xoul-ai-imagine-anything/id6673608916)
- Android: APKCombo lists Google Play ID **`ai.xoul.android`**, developer Xoul Inc., version **1.0.34**, update **2025-11-23**. — [APKCombo](https://apkcombo.com/xoul-ai-imagine-anything/ai.xoul.android/)
- APKPure / Softonic list package **`ai.xoul.xoulapp.android`**, version **1.0.30**, 2025-09-16, changelog “We're back”, filename `ai.xoul.xoulapp.android_1.0.30.xapk`. — [APKPure](https://apkpure.com/xoul-ai-imagine-anything/ai.xoul.xoulapp.android/download)
- AppBrain: “This app is currently not available on Google Play.” “removed from Google Play **May 27, 2026**”; last version 1.0.34; last update **May 3, 2026**; 50k downloads. Package shown as `ai.xoul.android`. — [AppBrain](https://www.appbrain.com/app/xoul-ai-imagine-anything/ai.xoul.android)
- Official docs 2025-09-18: “**IOS & Android App**: The IOS and Android apps are now out!” Later: Android “submitted it to the play store”; “Note to Android users — the app is coming back to the Play Store very soon.” — [Official Announcements](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/announcements-and-updates)
- DreamGen review (updated **2026-05-03**): Platforms “Web, iOS (3.9 ★, 14 ratings)”; “The iOS application remains available.” — [DreamGen Xoul AI Review](https://dreamgen.com/blog/articles/xoul-ai-review)
- Reddit export workaround: “If you can't export your stuff through the **app**, but you were logged in through a **browser**, try … `https://api.xoul.ai/api/v1/export/all`.” — [r/XoulAI](https://www.reddit.com/r/XoulAI/comments/1k4c7x9/if_you_cant_export_your_stuff_through_the_app_but/)
- Userscripts and the HTML exporter talk to **`https://api.xoul.ai/api/v1/conversation/details`**. Chat URLs on web were `/chats/{uuid}` on `xoul.ai` or `story.xoul.ai`. — [Greasy Fork code](https://greasyfork.org/nb/scripts/523418-download-full-chat-history-as-html-file/code)
- Unrelated app: **Xoul Parenting / Xoul: acompañamiento parental**, App Store id **6756933529**, seller **Los Ales LLC**, site xoul.me — parental WhatsApp wellbeing, **not** Xoul.AI. — [App Store](https://apps.apple.com/us/app/xoul-parenting-teen-wellbeing/id6756933529)

### Inferences
- Mobile apps are official first-party clients of the **same** Xoul.AI backend (seller URL xoul.ai, shared account, “We're so back” after the Sept 2025 relaunch). They almost certainly use `api.xoul.ai` (or a same-origin BFF that talks to it). Direct APK traffic was not captured in this research.
- Native-app export was **worse** than web during the 2025 shutdown; the documented community path was “log in on desktop browser, hit `export/all`.”
- Two Android package names likely reflect a Play listing rename (`ai.xoul.xoulapp.android` → `ai.xoul.android`) rather than two products. Treat **`ai.xoul.android`** as the later Play ID and **`ai.xoul.xoulapp`** as the iOS bundle.
- Android availability in Sept 2026 is **doubtful** (Play removal reported May 2026); iOS listing still resolves.

### Gaps
- No APK network log or `AndroidManifest` confirming `api.xoul.ai` hostnames.
- No iOS `Info.plist` ATS exception list.
- Why Android left Play Store in May 2026 (policy vs publisher choice) is not documented in official GitBook.

---

## Reddit r/XoulAI: export-all button, `api.xoul.ai/api/v1/export/all`, April 2025 shutdown vs current status

### Takeaway
Xoul announced a **48-hour shutdown** on 2025-04-20, went offline **2025-04-21 22:00 PT**, shipped an **Export All** button that morning, and community-discovered **`GET https://api.xoul.ai/api/v1/export/all`** as a cookie-authenticated zip download. The site **relaunched September 2025 (V.2)** and stated pre-shutdown data was retained. **xoul.ai is live in 2026.** Official 2026 Account Settings docs **do not mention Export All**. Whether `export/all` still works in 2026 was **not live-tested** here.

### Cited Findings
- **Shutdown announcement** (r/XoulAI, 2025-04-20): “Xoul’s current platform will be shut down in 48 hours.” “If you need to save anything from your account, please do so as soon as possible.” “**The official date and time we will go offline is: 10pm PT Monday April 21st 2025.**” Refunds promised. — [Announcement - Shut Down](https://reddit.com/r/XoulAI/comments/1k3exxe/announcement_shut_down/)
- **Export coming soon** (2025-04-21 ~05:24 UTC): devs “trying to quickly release the ability to export content”; livestream of Syd coding it. Later comment: “The Export Content Button update is live. You can now export your chats, characters, lorebooks, etc.” — [Export Content Coming Soon](https://www.reddit.com/r/XoulAI/comments/1k45y9h/announcement_export_content_coming_soon/)
- **Export All live** (2025-04-21 ~11:50 UTC): “You can now export all your Xoul content. This includes single chats, group chats, character profiles, lorebooks.” Site then overloaded: “Site is down right now because too many people are exporting at the same time.” Workaround posted in-thread: browser `https://api.xoul.ai/api/v1/export/all`; “It gave me an error, but the archive downloaded”; “on **Xoulcord** that was me too.” — [Export All Content Button is Now Live](https://www.reddit.com/r/XoulAI/comments/1k4bkya/announcement_export_all_content_button_is_now_live/)
- Dedicated workaround post (2025-04-21): same URL, same “check your downloads even if you see an error.” — [r/XoulAI](https://www.reddit.com/r/XoulAI/comments/1k4c7x9/if_you_cant_export_your_stuff_through_the_app_but/)
- **Don’t wait** (2025-04-22): shutdown “in **four hours**.” “go to your **account setting page** and hit the **export button**.” Exports “**all content** associated with your account, ranging from chats, Xouls, personas, scenarios, lorebooks and even **voices and posts**.” “it can only preserve the **last 300 replies in group chats**.” — [r/XoulAI](https://www.reddit.com/r/XoulAI/comments/1k4w3ws/dont_wait_export_your_content_now/)
- Offline confirmation (2025-04-22): “The platform, including the website and the app are now offline.” — [Thank you… Xoul.AI is now offline](https://reddit.com/r/XoulAI/comments/1k517k4/thank_you_for_all_your_love_and_support_xoulai_is/)
- **Post-shutdown API still worked** (2025-04-24): u/genericmcplayer: “The backup API is still working: `https://api.xoul.ai/api/v1/export/all` Use the browser you've logged into Xoul to open it. Be quick.” — [r/XoulAI](https://www.reddit.com/r/XoulAI/comments/1k6igjr/i_dont_use_xoul_for_a_couple_days_and_now/)
- Auth failure: `{"detail":"Missing authentication credentials."}` if not logged in / Google SSO stale. Fix from Discord: log in at **`https://xoul.ai/?open_login=true`**, then hit the API link in the **same browser session**. Confirmed working by multiple users after the site was “dead.” — [r/XoulAI “YOU STILL CAN”](https://www.reddit.com/r/XoulAI/comments/1k6sc9y/for_all_xoul_users_who_forgot_to_export_their/)
- Discord-only link in `#xoul-goodbyes` for people who missed shutdown; “from the last browser you logged into.” After unzip: “a bunch of **.json files** containing … bots, personas, chats, scenarios and lorebooks.” — [How to still access your data](https://www.reddit.com/r/XoulAI/comments/1k6nfgs/how_to_still_access_your_data_if_you_missed_the/)
- **July 2025**: FadeInHeaven (viewer author) commented that users could still get the zip: log in to Xoul from the **404 page**, then (link omitted) in the same session; “If you see a blank page that's just loading, you're good!” Moderator: “data from before the shutdown has been retained and should all still be available to returning users.” — [View Your Chat Exports](https://www.reddit.com/r/XoulAI/comments/1m3bhhd/view_your_chat_exports)
- Syd (2025-07-17): shutdown was financial unsustainability; relaunch “within the coming weeks.” — [An Announcement From Syd](https://www.reddit.com/r/XoulAI/comments/1m22k3s/an_announcement_from_syd)
- **Relaunch** (2025-09-11): “Xoul.AI - We're Back” / **Xoul V.2**. New models Infinity and Candyflip; proxies; personas switchable in-chat; energy plans Green/Purple/Gold. — [We're Back](https://www.reddit.com/r/XoulAI/comments/1ndzd5s/xoulai_were_back/)
- Pre-relaunch FAQ: “Does the relaunch keep my past chats?” Answer (u/rennyexo, 39 upvotes): “Yes all of your past chats should still be there.” — [r/XoulAI](https://www.reddit.com/r/XoulAI/comments/1n7g6y5/does_the_relaunch_keep_my_past_chats/)
- Independent recap (AiMagHub, 2026-06-14): offline 2025-04-21 10pm PT; relaunch September 2025. — [AiMagHub Xoul AI Review 2026](https://aimaghub.com/xoul-ai-review-2026/)
- **2026 liveness**: `https://xoul.ai/faq` still serves current FAQ (energy, Green $7 / Purple $14 / Gold $28, Bacchus/Jupiter/Infinity, Discord `https://discord.gg/xoul`). Official GitBook announcements include **2025-12-20** and **2026-07** dated pages. — [xoul.ai/faq](https://xoul.ai/faq); [Official docs index](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/llms.txt)
- **Export not in 2026 docs.** Account Settings markdown lists Usage & Subscription, Account (email, referral, timezone, logout), Preferences, Appearance, FAQ/Support, Safety — **no Export**. Full docs index has no “export” page. — [Account Settings](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/account-settings.md)

### Inferences
- `export/all` is an **authenticated GET** that returns a **zip**, not JSON. Browser navigation with session cookies is enough; a JSON error body can still accompany a successful file download.
- Auth is **not** a documented API key. Failures are FastAPI-style `{"detail":"Missing authentication credentials."}` — likely missing/expired cookie or Authorization header.
- Group-chat cap of **300 replies** is a first-party limitation of that exporter.
- After V.2 relaunch, **in-product data restoration** replaced public emphasis on zip export. Absence from GitBook is a strong signal the emergency exporter was **not productized** for 2026, but not proof the route 404s.

### Gaps
- This research did **not** GET `https://api.xoul.ai/api/v1/export/all` (would need a live session). 2026 behavior is unknown.
- Request headers (cookie names, `Authorization: Bearer`, CSRF) were never published.
- Zip filename, MIME type, and complete top-level folder list (beyond mefriend’s five + Reddit’s `chats_multi`) are not in official docs.
- Whether V.2 added a new export UI is undocumented.

---

## Any Python/JS unofficial API wrappers?

### Takeaway
**No** published Python package, npm module, or GitHub library was found that wraps `api.xoul.ai`. The only reusable JS client is the Greasy Fork HTML exporter (inline userscript, not a library). Official org `xoul-ai` has no SDK. Hits for “xoul” on GitHub/PyPI are **unrelated** projects.

### Cited Findings
- GitHub code search UI for `api.xoul.ai` requires login and returned no public snippet in this session. — [GitHub code search](https://github.com/search?q=api.xoul.ai&type=code)
- Official org https://github.com/xoul-ai : four repos (`.github`, `vaul`, `excalidraw` fork, `aiogoogle` fork); last `aiogoogle` update **2025-03-12**. README “Quack 🦆”. Website xoul.ai. — [github.com/xoul-ai](https://github.com/xoul-ai)
- **`xoul-project/xoul`** is a Windows QEMU/Ollama **personal assistant** with PyQt6/Telegram/Discord/Slack clients. It is **not** a Xoul.AI API wrapper. — [github.com/xoul-project/xoul](https://github.com/xoul-project/xoul)
- Known **JS** that calls the API: Clawberry userscript (`GM_xmlhttpRequest` to `/api/v1/conversation/details`). Not packaged. — [Greasy Fork code](https://greasyfork.org/nb/scripts/523418-download-full-chat-history-as-html-file/code)
- Known **Python**: one-off Reddit converter for **already-downloaded** chat JSON → ST JSONL (June 2025). Runs locally on files; does not call the API. — [r/XoulAI](https://www.reddit.com/r/XoulAI/comments/1l452g7/importing_xoul_chats_into_sillytavern)
- PyPI searches for Xoul.AI clients returned unrelated SDKs (`llm-cookie-bridge` lists Character.AI/ChatGPT/etc., **not** Xoul.AI; `syllable-sdk` is a different product). — [llm-cookie-bridge](https://pypi.org/project/llm-cookie-bridge/)
- Xoul.AI **does** let the **website** call **outbound** third-party LLM APIs (OpenRouter, Chutes, Featherless, TogetherAI, Generic base URL). That is a **proxy into Xoul’s chat UI**, not a wrapper of Xoul’s own API. Auth: user’s provider API key stored in Xoul. Documented Dec 2025 / still in 2026 chat-interface docs. — [Custom Engine (Proxy)](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/chat-interface/custom-engine-proxy)

### Inferences
- Community “clients” of Xoul are **session-cookie scrapers** (userscript, `export/all` in a logged-in tab), not OAuth/API-key SDKs.
- Discovered first-party endpoints from community use:
  - `GET https://api.xoul.ai/api/v1/export/all`
  - `GET https://api.xoul.ai/api/v1/conversation/details?conversation_id={uuid}`
  - Web paths: `https://xoul.ai/chats/{uuid}`, historically `https://story.xoul.ai/*`, login helper `https://xoul.ai/?open_login=true`
  - CDN: `https://user-images.prod.xoul-media.com/images/{id}.png`
- Building a wrapper in 2026 would be reverse-engineering the current web/app session, not adopting a published spec.

### Gaps
- No OpenAPI spec, HAR, or complete route list.
- Pagination endpoint used by the HTML exporter (after `conversation/details`) was not fully quoted.
- Whether Bearer tokens exist (mobile “new auth” March 2025) vs cookies-only is unknown.

---

## Discord “Xoulcord” community resources for export

### Takeaway
The official server is commonly called **Xoulcord**. Invite **`https://discord.gg/xoul`** is the stable public link (also on xoul.ai/faq). Shutdown-era export help lived in **`#xoul-goodbyes`**, SOX in a **SOX Project thread**, and converters (Fathe exe, Junj DragonFox, FadeInHeaven, Father Gucci / Re:Soul) were Discord-first. Those resources were **not mirrored to public GitHub**. Discord stayed up through the five-month outage.

### Cited Findings
- FAQ: “The fastest way to get help is on our [Discord](https://discord.gg/xoul). Post … in the `#support` channel.” Also Reddit r/XoulAI. — [xoul.ai/faq](https://xoul.ai/faq)
- Community nickname **Xoulcord** used in the Export All thread (“on Xoulcord that was me too”). — [Export All post](https://www.reddit.com/r/XoulAI/comments/1k4bkya/announcement_export_all_content_button_is_now_live/)
- Automod sidebar: Discord Server, F.A.Q., “Master List of Prompts & Jailbreaks from the Discord Community.” — multiple r/XoulAI threads
- `#xoul-goodbyes` held the post-shutdown export link, restricted to “the last browser you logged into,” because of scammers DMing fake links on Reddit. — [How to still access your data](https://www.reddit.com/r/XoulAI/comments/1k6nfgs/how_to_still_access_your_data_if_you_missed_the/)
- SOX: “community made, specifically by **Junj DragonFox** in Xoul Discord”; “SOX Project thread in Xoul Discord.” — [SOX post](https://www.reddit.com/r/XoulAI/comments/1k9c04h/save_our_xouls_sox_project_create_your_own_mini)
- **Fathe** (Discord moderator) sharing a JSON-conversion **executable**. — [Don’t wait, export](https://www.reddit.com/r/XoulAI/comments/1k4w3ws/dont_wait_export_your_content_now/)
- **FadeInHeaven** viewer: “A lovely person in the Xoul discord reached out to me.” — [View Your Chat Exports](https://www.reddit.com/r/XoulAI/comments/1m3bhhd/view_your_chat_exports)
- **Re:Soul** “created by **Father Gucci** on discord”; zip in, read chats, stats, heatmap, phrase search, tier maker, “XoulMate” smash-or-pass. Updated Aug 2025. “share … on the Discord server.” — [Re:Soul Update](https://www.reddit.com/r/XoulAI/comments/1mr6smo/resoul_update_stats_chats_more)
- Discord **never shut down** with the site. Mod u/Lulorick 2025-07-02: “The discord never shut down, it’s been up this whole time.” Invite still `https://discord.gg/xoul`. Age 18+; minors banned. Gold subscribers can link Discord for a role (2026 Account Settings). — [r/XoulAI](https://www.reddit.com/r/XoulAI/comments/1lq4hby/old_mods_have_dircord_tag_gatekeepers); [Account Settings](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/account-settings.md)
- Valentine 2025 event branding used “Xoulcord's First Collab Event.” — [r/XoulAI](https://www.reddit.com/r/XoulAI/comments/1i5c87v/valentines_day_event_on_discord)
- Unrelated: Discord gacha bot “Xoul HQ” / Xoul gacha is a **different** “Xoul.” — [DiscordHome listing](https://discordhome.com/ja/partner/769)

### Inferences
- The **canonical** unofficial tooling (SOX, Re:Soul, Fathe exe, shutdown export URL) was distributed **inside Discord**, which is why GitHub is empty and Reddit snippets lack hyperlinks.
- A 2026 researcher without Discord access cannot recover those binaries/web apps from the public web.
- `#support` and Gold-only channels are the current official help path; `#xoul-goodbyes` was shutdown-specific and may no longer exist.

### Gaps
- No public archive of the SOX thread, Re:Soul URL, FadeInHeaven URL, or Fathe binary.
- Discord bot that chats with Xouls (as an unofficial client of `api.xoul.ai`) was **not** found. Xoulcord is a **community server**, not a Xoul chat bridge.
- Channel list beyond `#support`, `#free-cells`, `#xoul-goodbyes`, SOX thread is incomplete.

---

## Zip / JSON shape (quoted from importers, not official docs)

These names appeared in **independent** community docs and should be treated as the best public schema:

**Top-level folders (mefriend + Reddit):**
- `chats_single` — 1:1 conversations (mefriend import target)
- `chats_multi` — group chats (Reddit ST guide; **not** in mefriend table)
- `personas` — user personas (mefriend)
- `xouls` — character cards (mefriend)
- `scenarios` (mefriend)
- `assets` — lorebooks (mefriend)
- Reddit also claimed **voices** and **posts** in the zip; folder names for those were not quoted.

**Chat JSON keys (Reddit ST guide, dummy example):**
`xouls[].slug` (often `*.xo`), `name`, `icon_url`, `voice_id`, `talkativeness`, `tagline`, `age`, `bio`, `backstory`, `gender`, `samples`; `personas[].slug`, `name`, `icon_url`, `prompt`, `user_slug`, `gender`, `privilege`.

**ST V2 mapping used by Wyvern prompt:**
`name` ← name; `description` ← merged personality/backstory/bio; `personality` omitted; `scenario` ← `default_scenario`; `first_mes` ← greeting; `mes_example` ← samples.

**Auth error body:** `{"detail":"Missing authentication credentials."}`

**Login helper:** `https://xoul.ai/?open_login=true`

**Export endpoint:** `https://api.xoul.ai/api/v1/export/all`

**Per-chat details:** `https://api.xoul.ai/api/v1/conversation/details?conversation_id={uuid}`

---

## Cross-cutting inferences
- Unofficial access in 2025 was **cookie session reuse**, not a developer API. That is fragile across “new auth” (iOS 1.004, Mar 2025) and V.2 relaunch (Sep 2025).
- The richest export is the **April 2025 zip**. Downstream tools (mefriend, SOX, Re:Soul) consume **that file**, they do not replace it.
- **2026** official product is a live web+iOS roleplay app with proxies **out** to OpenRouter/etc. Community export tooling largely **froze in April–August 2025** and was never republished as GitHub libraries.
- Name collisions to ignore: `xoul-project/xoul` (assistant), App Store “Xoul Parenting” (xoul.me), Discord gacha “Xoul,” `xurl` (Twitter CLI), SoulX-* ML repos.

## Cross-cutting gaps
- Live 2026 verification of `export/all`, conversation/details, and the Greasy Fork script.
- SOX / Re:Soul / FadeInHeaven / Fathe / Wyvern converter URLs.
- Complete zip inventory (`chats_multi` file layout, voices, posts).
- Android package ID reconciliation and current Play Store presence.
- Any post-relaunch official export UI not listed in GitBook.
