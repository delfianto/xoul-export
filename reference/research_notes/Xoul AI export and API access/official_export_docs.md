# Official Xoul.AI export, APIs, apps, and documented data-access paths

Research date: 2026-09-22. Primary sources inspected: xoul.ai homepage and FAQ, GitBook official guide (including `llms.txt`), Xoul creation / chat / custom-engine pages, Privacy Policy, Terms of Service, r/XoulAI export and relaunch threads, DreamGen’s May 2026 review, mefriend’s April 2025 import guide. Distinguish April 2025 shutdown-era export panic from the live 2026 product. Do not treat undocumented private HTTP routes as a public API.

## Does Xoul.AI offer a public developer API for chats or characters?

### Takeaway
Xoul.AI does **not** publish a public developer API for reading chats, characters (Xouls), personas, scenarios, or lorebooks. Official docs describe only *inbound* Custom Engine / proxy credentials so users can swap the LLM while remaining on Xoul’s frontend.

### Cited Findings
- The complete official documentation index (`llms.txt`) lists platform UI, creation, chat, subscriptions, moderation, and FAQ pages. It contains **no** developer, REST, OpenAPI, SDK, webhook, or “API reference” page. — [Xoul.AI Official Guide llms.txt](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/llms.txt)
- Official GitBook, published 2025-12-15 and still updated through 2026-07, describes itself as a user knowledge base for features, tutorials, and creation guides, not as API documentation. — [Xoul.AI Official Guide](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/)
- The live FAQ at `https://xoul.ai/faq` (and the GitBook FAQ mirror) covers energy, cells, subscriptions, privacy of chats, content policy, and support. It does not mention a public API, API keys issued *by* Xoul, or programmatic access to chats/characters. — [FAQ | xoul.ai](https://xoul.ai/faq); [GitBook FAQ](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/frequently-asked-questions.md)
- The only “API” surface documented in the official guide is **Custom Engine (Proxy)**: the user supplies a third-party **API Key**, optional **Base URL** (Generic provider), and **Model Name** so Xoul’s chat UI can call *that* provider. That is the user bringing an LLM API *into* Xoul, not Xoul exposing chats/characters. — [Custom Engine (Proxy)](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/chat-interface/custom-engine-proxy.md)
- DreamGen’s 2026 hands-on review (test date 2026-05-02) lists “Third-party API/proxy support” as using external models (OpenRouter, Chutes, Featherless, Generic), not a Xoul-issued developer API. — [DreamGen: Xoul AI Review](https://dreamgen.com/blog/articles/xoul-ai-review)
- The one historically documented Xoul-owned HTTP path for *user data* is `https://api.xoul.ai/api/v1/export/all`, a cookie-authenticated bulk-export URL circulated during the April 2025 shutdown, not a documented REST resource for chats/characters. Unauthenticated callers reported JSON `{"detail":"Missing authentication credentials."}`. — [r/XoulAI: export/all fallback](https://www.reddit.com/r/XoulAI/comments/1k4c7x9/if_you_cant_export_your_stuff_through_the_app_but/); [r/XoulAI: still can export](https://www.reddit.com/r/XoulAI/comments/1k6sc9y/for_all_xoul_users_who_forgot_to_export_their/)
- GitBook chat docs say you can “use a custom model by providing a URL and API key” via the Custom option in the Model menu. That URL is the *proxy provider’s* base URL, not a Xoul public API. — [Chat Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/chat-interface.md)

### Inferences
- Absence from the official `llms.txt` index, FAQ, and GitBook is strong evidence that Xoul does not currently market or document a public developer API for chats or characters.
- `api.xoul.ai` exists as a hostname used for at least the shutdown-era export route. That does **not** imply a supported public API catalog; no OpenAPI/Swagger for `api.xoul.ai` was found in official materials.

### Gaps
- This research did not log into a Xoul account or capture authenticated network traffic, so undocumented internal app/web endpoints are not inventoried (and must not be treated as a public API).
- Current (2026) HTTP status of `https://api.xoul.ai/api/v1/export/all` was not independently probed here (shell GET was blocked by environment policy). Last community confirmation of the route working is mid-2025, not 2026.

## What official export exists, and what does it include?

### Takeaway
The only well-documented official bulk export is a **shutdown-era (April 2025)** “Export All Content” account-settings button plus the cookie-authenticated URL `https://api.xoul.ai/api/v1/export/all`. It produced a **ZIP of JSON files** covering chats, Xouls, personas, scenarios, lorebooks, and (per community) voices and posts. Official 2026 GitBook account-settings docs **do not** list an export control.

### Cited Findings

#### UI button (April 2025)
- Official r/XoulAI announcement, 2025-04-21: “ANNOUNCEMENT: Export All Content Button is Now Live. You can now export all your Xoul content. This includes single chats, group chats, character profiles, lorebooks.” The site then went down because too many people exported at once. — [r/XoulAI: Export All Content Button is Now Live](https://www.reddit.com/r/XoulAI/comments/1k4bkya/announcement_export_all_content_button_is_now_live/)
- Community instructions: “Go under settings -- account -- export.” — [r/XoulAI: PSA export JSON](https://www.reddit.com/r/XoulAI/comments/1k4hddz/we_thank_you_for_your_service_xoul_o7_psa_export/)
- Another community post the same day: on desktop, mobile browser, or the app, go to the account settings page and hit the export button. It “will export **all content** associated with your account, ranging from chats, Xouls, personas, scenarios, lorebooks and even voices and posts.” Limitation stated: “it can only preserve the last 300 replies in group chats.” — [r/XoulAI: Don’t wait, export your content now!](https://www.reddit.com/r/XoulAI/comments/1k4w3ws/dont_wait_export_your_content_now/)
- Mobile users were told the same settings button existed; one user initially thought they had to export each AI individually, then found “one file.” — [r/XoulAI: reminder to export](https://www.reddit.com/r/XoulAI/comments/1k4qx62/remineder_to_export_your_data_before_the_sites/)

#### Direct URL `https://api.xoul.ai/api/v1/export/all`
- Same-day fallback when the in-app button failed: open `https://api.xoul.ai/api/v1/export/all` in a browser already logged into Xoul. Users reported a page error *and* a successful ZIP download. — [r/XoulAI: export/all fallback](https://www.reddit.com/r/XoulAI/comments/1k4c7x9/if_you_cant_export_your_stuff_through_the_app_but/)
- After the public site went dark (2025-04-24), users still used that URL in the last logged-in browser. Unauthenticated requests returned `{"detail":"Missing authentication credentials."}`. Workaround reported: log in at `https://xoul.ai/?open_login=true`, then hit the export URL in the same session. — [r/XoulAI: still can export](https://www.reddit.com/r/XoulAI/comments/1k6sc9y/for_all_xoul_users_who_forgot_to_export_their/); [r/XoulAI: site gone, backup API](https://www.reddit.com/r/XoulAI/comments/1k6igjr/i_dont_use_xoul_for_a_couple_days_and_now/)
- Discord `#xoul-goodbyes` circulated the same “last browser you logged in with” export path after the website 404’d. — [r/XoulAI: how to still access data](https://www.reddit.com/r/XoulAI/comments/1k6nfgs/how_to_still_access_your_data_if_you_missed_the/)
- As late as 2025-07-18, a community export-viewer author wrote that users who missed the shutdown could still log in from the 404 page and then trigger the zip download in the same browser session. — [r/XoulAI: View Your Chat Exports](https://www.reddit.com/r/XoulAI/comments/1m3bhhd/view_your_chat_exports)

#### ZIP / folder layout (exact names from third-party importer docs)
- mefriend’s importer, written the day after shutdown, assumes the Xoul export zip. After unzipping, documented folders:

  | Folder | Meaning (mefriend’s table) |
  | --- | --- |
  | `chats_single` | Your private conversations |
  | `personas` | Characters you built *(mefriend’s label; these are user Personas, not Xouls)* |
  | `xouls` | Xouls you published |
  | `scenarios` | Scenarios you published |
  | `assets` | Lorebooks you’ve created |

  Missing folders just mean the user never used that feature. Contents are dropped folder-by-folder into the importer. — [mefriend: Importing Your Data from Xoul.ai](https://docs.mefriend.ai/xoul_integration_guide__2025_04_22)
- mefriend’s “what you can import today” list uses the same exact folder names: `chats_single`, `personas`, `xouls`, `scenarios`, `assets`. It claims **one-on-one chats import every message**. It does **not** list a group-chat folder. — same source
- Community description of the unzipped archive: “a bunch of .json files containing the data for all your stuff (bots, personas, chats, scenarios and lorebooks).” — [r/XoulAI: how to still access data](https://www.reddit.com/r/XoulAI/comments/1k6nfgs/how_to_still_access_your_data_if_you_missed_the/)
- Files for Xouls were named by handle, not display name: “Exported xouls get saved under the .xo name, look for that instead of your xouls display name.” Public Xoul URLs use the pattern `https://xoul.ai/xoul/{handle}.xo`. — [r/XoulAI: conversation export naming](https://www.reddit.com/r/XoulAI/comments/1k4u740/xoul_conversation_export/); [Xoul Creation Interface (Handle)](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/xouls/xoul-creation-interface.md)
- One exporter reported the ZIP was JSON-only and small: “All of your stuff is saved as JSONs no images and such from what I see. So all in all my data came out to less than a megabyte.” — [r/XoulAI: didn’t get a chance to export](https://www.reddit.com/r/XoulAI/comments/1k513xt/didnt_get_a_chance_to_export/)
- Official announcement included **group chats**; community said group chats were truncated to the **last 300 replies**. mefriend’s folder table has `chats_single` only, so group-chat JSON likely lived under a folder mefriend did not import (name not independently confirmed from a zip). — [Export All announcement](https://www.reddit.com/r/XoulAI/comments/1k4bkya/announcement_export_all_content_button_is_now_live/); [Don’t wait](https://www.reddit.com/r/XoulAI/comments/1k4w3ws/dont_wait_export_your_content_now/); [mefriend guide](https://docs.mefriend.ai/xoul_integration_guide__2025_04_22)

#### What 2026 official product docs say about export
- GitBook **Account Settings** (last updated 2026-07-10) lists subpages: Usage & Subscription, Account, Preferences, Appearance, FAQ/Support, Safety. **No Export button, no data-download section.** — [Account Settings](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/account-settings.md)
- GitBook FAQ (account section) documents chat *deletion* and account deletion, not export. Chat privacy FAQ: you can delete individual conversations or entire chat history; it does not mention download/export. — [GitBook FAQ](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/frequently-asked-questions.md); [FAQ | xoul.ai](https://xoul.ai/faq)
- Chat UI documents **Copy** of a single bubble (“copy the entire chat bubble, markdown included”), **Edit / Delete / Rewind**, and **Branch Chat**. That is per-message clipboard copy, not account export. — [Chat Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/chat-interface.md)
- On relaunch day 2025-09-11 a user asked if export still existed; a community reply was “afaik, not anymore...” (not an official staff post). — [r/XoulAI: Exporting data?](https://www.reddit.com/r/XoulAI/comments/1ndz3jv/exporting_data/)

#### Privacy-law “copy of your data” is not the product export
- Privacy Policy (last updated May 20, 2024) grants EEA/UK/Switzerland/Canada users a right “to request access and obtain a copy of your personal information” and, “if applicable, to data portability,” by contacting the company. US state residents have a “Right to obtain a copy of the personal data you previously shared with us,” also by email. That is a legal request path, not the ZIP button. Contact is `hello@xoul.ai`. — [Privacy Policy](https://xoul.ai/privacy)

### Inferences
- The April 2025 ZIP is the only productized bulk export with a documented UI + URL + folder names. It was built for shutdown, not as an ongoing developer integration.
- mefriend’s five folder names (`chats_single`, `personas`, `xouls`, `scenarios`, `assets`) are the most precise published layout. Official Reddit also claimed group chats, voices, and posts; those extra types are **not** in mefriend’s folder table, so either they used other folder names or mefriend skipped them.
- Current official docs treating Account Settings without an export control, plus the 2025-09-11 “not anymore” comment, indicate the productized export was **not restored as a documented feature** at relaunch.

### Gaps
- No actual export ZIP was opened in this research, so **JSON object keys / field names inside those files are not quoted**. Do not invent them.
- Exact group-chat folder name (if any besides `chats_single`) is unconfirmed.
- Whether voices/posts were JSON metadata only, or included media files, is unconfirmed (one user said no images).
- Whether a 2026 logged-in user still sees an Export button or can still hit `/api/v1/export/all` was not verified from an account.

## What is a Xoul’s documented field model?

### Takeaway
Official GitBook (Xoul Creation Interface, last updated 2026-07-10) is the current field model: Name / Gender / Age, Description, Intro, Greeting, Response Styles (including Custom system prompt), Advanced Definition, Chat Samples, Override Default Formatting, up to three Lorebooks, required Icon, Voice, Handle, Tagline, Creator Memo, Visibility, Community Tags, and a posts-tagging toggle. Character limits and some secondary fields conflict with older community/wiki pages.

### Cited Findings

#### What a “Xoul” is
- Official definition: a **Xoul** is Xoul.AI’s branded character card — “a collection of information that sets the foundation of a chat with a model.” It is not a programmable “bot.” Up to **8** Xouls in a chat. Related cards: Persona (user character the model does *not* play), Scenario (premise), Memories (current events), Lorebook (extra info). All of that is compiled into one document called **the prompt**. — [Xouls](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/xouls.md)

#### Official creation-interface fields (GitBook, updated 2026-07-10)

**Xoul Basics**
- **Name:** alphanumeric characters or symbols; **maximum 100 characters**. Placeholders `{{char}}` and `xoul` are replaced with this exact text *before* the model sees the prompt. — [Xoul Creation Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/xouls/xoul-creation-interface.md)
- **Gender:** Male, Female, Non-Binary, Prefer Not to Say, or a custom typed gender. Model uses it for pronouns. — same
- **Age:** numerical value **18 to 100000**. Model can read it. All characters on the platform must be 18+. — same

**Xoul Persona (definition body)**
- **Description:** public-facing “guts” of the Xoul (who/what, appearance, behavior, world, or utility instructions). Visible on the Xoul profile. Sparkles button can AI-generate a description from name/age/gender. — same
- **Advanced Definition:** “direct continuation of the Description” that is **not visible to anyone except the AI**. — same
- **Chat Samples:** examples of how the character should talk. Separate samples by starting a new one with `{{char}}:` or `xoul:`. — same
- **Shared character limit** across Description, Advanced Definition, and Chat Samples: **12,000 characters** default, **17,000 for Gold**. Per-field caps cited in the same warning: Description 5000, Advanced Definition 5000, Chat Samples 2000 (those three sum to 12,000). — same
- **Intro:** formerly “Default Scenario.” Back-of-the-book blurb / premise leading into the Greeting. Visible to users who start chats; displayed at the top of the chat. — same
- **Greeting:** printed as the first chat message. If blank, a small model generates a random Greeting. Strongly influences opening style (italics, quotes, tense, length). **“The Greeting is not permanently remembered.”** All other Xoul text is described as permanently remembered. — same
- **Response Styles:** platform system prompts guiding reply style. Chat-interface names currently documented: **Roleplay (Character-Focused)**, **Novel (Slowburn)**, **Realistic (Natural)**, plus **Custom** (full system-prompt override). Group chats may show **Creator** when a Xoul/Scenario uses a custom prompt, or when each Xoul uses its own style. Older styles (Chaos, Texting, Driven, Lust) were removed in the Nov 2025 overhaul. — [Xoul Creation Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/xouls/xoul-creation-interface.md); [Chat Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/chat-interface.md); [Response Style & Length](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/chat-interface/response-style-and-length.md); [Announcements, Nov 21 2025](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/announcements-and-updates.md)
- **Custom / System Prompt:** “power user tool that completely override’s Xoul.AI’s provided system prompts.” Must be a **full instructional prompt**, not a dump of extra lore. Scenario **System Prompt** works the same and overrides Xoul custom styles. — [Response Style & Length](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/chat-interface/response-style-and-length.md); [Scenarios](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/scenarios.md)
- **Override Default Formatting:** toggle found after creation, bottom of Advanced Options. Off = quotation marks around dialogue and `*asterisks*` around narration, third person. On = drop those instructions and follow Chat Samples / Greeting formatting. — [Xoul Creation Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/xouls/xoul-creation-interface.md)
- **Ad Ons - Lorebooks:** attach up to **three Lorebooks**; users can remove/replace them in chat. — same

**Xoul Appearance**
- **Icon:** **required**. Generate (Cells), pick from pre-generated categories, or upload. Square or rectangular; auto-centered in search. Must not be explicit; all depicted characters must appear 18+. The model does **not** “see” the image. — [Xoul Creation Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/xouls/xoul-creation-interface.md); [Xoul AI Wiki (community)](https://xoul-ai.fandom.com/wiki/Xoul)
- **Voice:** pick from library or custom voices; previewable; editable later. — [Xoul Creation Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/xouls/xoul-creation-interface.md)

**Xoul Social**
- **Handle:** unique, **permanent URL**. Alphanumeric, periods, hyphens only. **Cannot be changed** and is **not reusable** after deletion. Public URL form: `xoul.ai/xoul/{handle}.xo`. — same; live example pages such as [https://xoul.ai/xoul/dariusdemon.xo](https://xoul.ai/xoul/dariusdemon.xo)
- **Tagline:** short line on the explore page. — same
- **Creator Memo:** public “Bio” on the profile; **not read by the AI**. Use for content warnings. — same
- **Visibility:** **Public** (search + everyone), **Unlisted** (direct link only), **Private** (creator only). Automod/human moderation can force Private. — same
- **Community Tags:** up to **seven**. — same
- Toggle to allow/disallow other users tagging **Posts** onto the Xoul. — same

#### Related card fields (needed to interpret export folders)
- **Persona:** Image, Name (`{{user}}` / `user` placeholder), Gender, Description. Lorebooks table: Persona description **1,000 characters** default, **2,000 Gold**. — [Personas](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/profile-page/personas.md); [Lorebooks](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/lorebooks.md)
- **Scenario:** Name, Familiarity, Location, Description, Advanced Definition (**3,000 shared** across Description + Advanced Definition), optional Greeting (one greeting, one speaking Xoul), embed up to **8 Xouls** and **3 Lorebooks**, Objective & **Meters** (up to six), **System Prompt** override, Icon, Language, Visibility, Tags. — [Scenario Creation Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/scenarios/scenario-creation-interface.md)
- **Lorebook entry fields:** **Name** (aesthetic only; **not** injected into the prompt), **Keywords**, **Content** (verbatim when pulled), **Type** (organization only). Up to **250 entries** per lorebook, **1500 characters** per entry, **3 lorebooks** per chat, **3 entries** injected per reply. — [Lorebooks](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/lorebooks.md)
- Chat Info Panel labels Description as **“Backstory”** in the UI. — [Chat Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/chat-interface.md)

#### Community/wiki field limits that **conflict** with current GitBook
- Fandom wiki (last update 2025-11-05) and a 2025-09-13 r/XoulAI creation post list **Name maximum 50 characters** (GitBook now says 100); Intro max **1,000**; Greeting max **4,000**; Custom System Prompt max **6,000**; Tagline max **100**; Creator Memo max **1,500**; Handle **6–26** characters. Wiki also lists removed Response Styles (Driven, Chaos, Texting, Lust). Treat GitBook 2026-07-10 as current official; treat wiki/Reddit as older community snapshots. — [Xoul AI Wiki: Xoul](https://xoul-ai.fandom.com/wiki/Xoul); [r/XoulAI: Content Creation: Xouls](https://www.reddit.com/r/XoulAI/comments/1nfv2xw/content_creation_xouls/)

### Inferences
- The durable “card” a bulk exporter would need is: identity (Name, Gender, Age, Handle), public text (Description, Tagline, Creator Memo, Intro), hidden model text (Advanced Definition, Chat Samples, Custom prompt, Override Formatting), first message (Greeting), attachments (up to 3 lorebook IDs), and social metadata (visibility, tags, icon/voice IDs). Images/voices are separate assets and were likely omitted from the 2025 JSON zip.
- Placeholder tokens to preserve on export/import: `{{char}}`, `xoul`, `{{user}}`, `user`.

### Gaps
- Official GitBook does not publish character limits for Intro, Greeting, Tagline, Creator Memo, Handle, or Custom prompt. Wiki/Reddit numbers are unofficial and may be stale.
- No official JSON schema mapping UI labels → export keys.
- Remix, language, and post-tagging may have additional stored fields not spelled out as exportable.

## Are there iOS/Android apps, and do they use the same backend?

### Takeaway
Yes: official iOS and Android apps exist (and existed before the 2025 shutdown). They are clients of the same Xoul Inc. account/backend as the website. Android was pulled from Play Store around late May / 2 June 2026; iOS remained listed. Subscriptions are account-scoped across browsers and devices.

### Cited Findings
- App name: **“Xoul AI - Imagine Anything”**, developer **Xoul Inc.** iOS App Store ID **6673608916**, released 2025-01-08, version history includes **1.006 “We’re so back” (2025-09-11)** after the relaunch. — [App Store: Xoul AI - Imagine Anything](https://apps.apple.com/us/app/xoul-ai-imagine-anything/id6673608916)
- Android package **`ai.xoul.android`**, Play listing historically 10K+ downloads, support email `hello@xoul.ai`, privacy policy linked. An older pre-shutdown package `ai.xoul.xoulapp.android` was also used (removed ~2025-04-18). A **brand-new** Android app was published after relaunch (community: 2025-10-14 “this is a brand new app”). — [Play Store listing](https://play.google.com/store/apps/details?id=ai.xoul.android&hl=en_US); [AppBrain `ai.xoul.android`](https://www.appbrain.com/app/xoul-ai-imagine-anything/ai.xoul.android); [r/XoulAI: Android app back](https://www.reddit.com/r/XoulAI/comments/1o67w06/xoul_ai_imagine_anything_apps_on_google_play/)
- Official GitBook: chat UI “look[s] slightly different on mobile / app view and full desktop view, but most things are in the same location.” Account settings are reached from home (desktop) or profile upper-right (mobile). Subscriptions: “Displayed prices are higher in app because Google / Apple takes a cut… make a purchase through a desktop or mobile browser.” Ads for energy are documented as **mobile only**. — [Chat Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/chat-interface.md); [Account Settings](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/account-settings.md); [Subscriptions](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/subscriptions.md); [Energy, Cells & Streaks](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/subscriptions/energy-cells-and-streaks.md)
- Relaunch announcement 2025-09-18: “The IOS and Android apps are now out!” Notifications for app users when followed creators publish. — [Announcements & Updates](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/announcements-and-updates.md)
- 2026-06-02 official r/XoulAI **Announcement - Android App**: Play Store issues over content freedom; “the app will no longer be available on the Play Store.” Purchases and ads no longer through the Android app; existing Play subscriptions cancel at renewal; resubscribe in a browser. **“All purchases and subscriptions are tied to your account and will carry over across browsers and devices.”** Already-installed APKs keep working with OTA updates except ads/subscriptions. Browser or installable web app recommended. — [r/XoulAI: Announcement - Android App](https://www.reddit.com/r/XoulAI/comments/1tv617b/announcement_android_app/)
- AppBrain: `ai.xoul.android` “removed from Google Play *May 27, 2026*”; last Play update *May 3, 2026*; version 1.0.34. — [AppBrain](https://www.appbrain.com/app/xoul-ai-imagine-anything/ai.xoul.android)
- DreamGen review, last updated 2026-05-03: “the Xoul AI application for Android is currently unavailable. The iOS application remains available.” Platforms listed: Web and iOS. — [DreamGen: Xoul AI Review](https://dreamgen.com/blog/articles/xoul-ai-review)
- April 2025 export was explicitly available “on desktop, mobile browser, or the app” via the same account settings, implying one account/backend. The `/api/v1/export/all` fallback was for browsers that already had a login cookie. — [Don’t wait](https://www.reddit.com/r/XoulAI/comments/1k4w3ws/dont_wait_export_your_content_now/); [export/all fallback](https://www.reddit.com/r/XoulAI/comments/1k4c7x9/if_you_cant_export_your_stuff_through_the_app_but/)

### Inferences
- iOS, Android, mobile web, and desktop web share one Xoul Inc. account graph (same login, energy, cells, chats, content). Apps are not a separate data silo.
- Android-after-June-2026 is “sideloaded/legacy APK or browser,” not a current Play distribution.

### Gaps
- Whether native apps wrap a WebView of xoul.ai vs a fully native client is not stated in official docs.
- Current iOS build number / whether iOS still has an in-app export control was not checked inside the app.

## What do Terms of Service / Privacy Policy say about automated access, reverse engineering, scraping, and user ownership?

### Takeaway
Users **keep ownership** of submitted Content but grant Xoul a very broad perpetual license. ToS **explicitly bans** scraping, bots, automated access, reverse engineering, and bypassing blocks. Privacy Policy collects chat messages and created characters, promises chats are not sold, and offers legal access/deletion/portability *by request*, not a self-serve ZIP.

### Cited Findings

#### Ownership and license (ToS)
- Company: **Xoul Inc.**, site `https://xoul.ai`, mailing address 945 Taraval St, San Francisco, CA 94116. Users must be at least 18. — [Terms of Service](https://xoul.ai/terms-of-service)
- “When you contribute Content… including but not limited to character generations, uploaded images, and user profiles, you affirm that you hold all rights… **Upon submission, you maintain any ownership rights you previously possessed in the Content.** You grant to Xoul… a **nonexclusive, worldwide, royalty-free, fully paid, transferable, sublicensable, perpetual, irrevocable license** to reproduce, display, upload, perform, distribute, transmit, make available, store, alter, exploit, commercialize, and utilize the Content…” — same, §2 Content Submitted By You
- **Contributions** (chats, posts, etc.) grant an even broader “unrestricted, unlimited, irrevocable, perpetual…” license, including name/voice, for any purpose including commercial. Submissions of feedback are **assigned** to Xoul. — same, Your submissions and contributions
- License to users: non-exclusive, non-transferable, revocable license to access the Services and “**download or print a copy of any portion of the Content to which you have properly gained access**,” “**solely for your personal, non-commercial use**.” Commercial copying/aggregation requires written permission. — same, Your use of our Services

#### Automated access, scraping, reverse engineering (ToS)
- Trademarks section: “You agree **not to engage in or use any data mining, robots, scraping, or similar data gathering or extraction methods** in connection with your use of the Services. If you are blocked… you agree **not to use any methods to bypass such blocking** (e.g., by masking your IP address or using a proxy IP address).” — same, Services content & Trademarks
- User representations: “(5) you will **not access the Services through automated or non-human means, whether through a bot, script or otherwise**.” — same, §3 USER REPRESENTATIONS
- §7 PROHIBITED ACTIVITIES includes, among others:
  - “**Systematically retrieve data** or other content from the Services to create or compile… a collection, compilation, database, or directory without written permission from us.”
  - “**Engage in any automated use of the system**, such as using scripts to send comments or messages, or using any data mining, robots, or similar data gathering and extraction tools.”
  - “**Attempt to bypass** any measures of the Services designed to prevent or restrict access…”
  - “**Copy or adapt the Services' software**, including but not limited to Flash, PHP, HTML, JavaScript, or other code.”
  - “Except as permitted by applicable law, **decipher, decompile, disassemble, or reverse engineer** any of the software comprising or in any way making up a part of the Services.”
  - “Except as may be the result of standard search engine or Internet browser usage, **use, launch, develop, or distribute any automated system, including without limitation, any spider, robot, cheat utility, scraper, or offline reader** that accesses the Services, or use or launch any unauthorized script or other software.”
  - “**Use the Services as part of any effort to compete with us** or otherwise use the Services and/or the Content for any revenue-generating endeavor or commercial enterprise.”
  — same, §7 PROHIBITED ACTIVITIES
- User Data clause: Xoul maintains data you transmit; “Although we perform regular routine backups of data, **you are solely responsible for all data** that you transmit or that relates to any activity you have undertaken using the Services. You agree that we shall have **no liability to you for any loss or corruption** of any such data…” — same, §22 USER DATA

#### Content-policy constraint on “porting” others’ work
- GitBook content policy: “**No Unauthorized Use:** You may not use, adapt, or ‘port’ the creative work of another creator (whether from our platform or elsewhere) without their **explicit, provable permission.**” — [Content Policies in Detail](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/moderation-overview/content-policies-in-detail.md)

#### Privacy Policy (last updated May 20, 2024)
- Collects, among other things, “**User content (including chat messages, created characters and scenarios, uploaded images)**.” — [Privacy Policy](https://xoul.ai/privacy)
- Automatically collected: IP, device/app identification numbers, log and usage data, location (GPS/IP). — same
- FAQ (product, not the legal page): chats are private, not visible to other users; “We don’t sell or share your conversation data with third parties”; stored on Xoul servers; only you can access conversation history. Controls listed: delete account; delete individual conversations or entire chat history. **No export control listed.** — [FAQ | xoul.ai](https://xoul.ai/faq)
- Legal rights: EEA/UK/Switzerland/Canada may “request access and obtain a copy,” rectification/erasure, restriction, “if applicable, **data portability**.” US residents: right to know, access, correct, delete, “**obtain a copy** of the personal data you previously shared with us.” Exercise by emailing `hello@xoul.ai`. — [Privacy Policy](https://xoul.ai/privacy)
- Account termination: deactivate/delete from active databases; some info may be retained for fraud, troubleshooting, investigations, legal terms. GitBook: content associated with a deleted account is **retained** unless the user manually deletes it first; emails cannot be reused. — [Privacy Policy](https://xoul.ai/privacy); [GitBook FAQ / Account Deletion](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/frequently-asked-questions.md)

### Inferences
- A logged-in user using the **official** export button/URL in April 2025 sits inside “download a copy of Content to which you have properly gained access” for personal use. Building an unofficial client, scraper, or competing importer that systematically pulls other users’ public Xouls is in tension with the scraping, automated-access, database-compilation, and anti-porting rules.
- User “ownership” of created Content is real in ToS language, but the license to Xoul is extremely broad and irrevocable; ownership does not include a documented ongoing self-serve export in 2026 docs.

### Gaps
- ToS does not name `/api/v1/export/all` or define permitted unofficial clients.
- Privacy Policy has not been visibly revised since May 2024 (pre-shutdown, pre-relaunch); it does not describe the ZIP export.
- No published transparency report or DPA describing subprocessors beyond Stripe, Google Analytics, and generic “vendors.”

## Is there still a working official export as of 2026, or was it a shutdown-era feature from April 2025?

### Takeaway
The bulk ZIP export is documented as an **April 2025 shutdown-era** feature. The site **is live in 2026** after a September 2025 relaunch, but **current official docs do not restore or document export**. Community comment on relaunch day was that export was “not anymore.” Legal copy-of-data rights remain via email.

### Cited Findings

#### Shutdown-era (April 2025) — confirmed
- Public shutdown date reported as **April 21, 2025, 10 PM PT**, with advice to export first. — [AiMagHub 2026 review](https://aimaghub.com/xoul-ai-review-2026/)
- Export button + `/api/v1/export/all` used 2025-04-21 through at least 2025-04-24 while the main site was dead, and still discussed as downloadable in **July 2025** (community viewer). — sources in the export section above; [View Your Chat Exports](https://www.reddit.com/r/XoulAI/comments/1m3bhhd/view_your_chat_exports)

#### Relaunch and live 2026 product — confirmed (do not treat the site as dead)
- Official “We’re Back / Xoul V.2” announcement **2025-09-10/11**, archived in GitBook. Past chats: community (2025-09-03) “Yes all of your past chats should still be there”; July 2025 staff-adjacent post: “data from before the shutdown has been retained.” — [Announcements & Updates](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/announcements-and-updates.md); [r/XoulAI: Does the relaunch keep my past chats?](https://www.reddit.com/r/XoulAI/comments/1n7g6y5/does_the_relaunch_keep_my_past_chats/); [View Your Chat Exports](https://www.reddit.com/r/XoulAI/comments/1m3bhhd/view_your_chat_exports)
- GitBook official guide **published 2025-12-15**; Chat Interface last updated **2026-07-11**; Account Settings **2026-07-10**. Homepage `https://xoul.ai` served a live “Create and chat with AI characters…” marketing page when fetched for this research. — [Official Guide](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/); [xoul.ai](https://xoul.ai/)
- DreamGen spent hours on the **live web product** on **2026-05-02** (Chrome), creating a Xoul, chatting 30+ messages, using proxy (Claude Opus 4.6 Fast via OpenRouter), and group chat. Review published **2026-05-15**. — [DreamGen: Xoul AI Review](https://dreamgen.com/blog/articles/xoul-ai-review)
- **Conflict:** a March 2026 tertiary article claims “the Xoul AI app and xoul.ai website remain offline.” That is contradicted by GitBook, DreamGen’s test, the live homepage, and 2026 Reddit app announcements. Do not use it for current status. — [suggestwave](https://suggestwave.com/xoul-ai/) vs. primary sources above

#### Export after relaunch — not documented; community says gone
- 2025-09-11, user C-Q_Cumber: “Is there still a way to export the data of your account (chats, characters, etc.)? I know people could export right before the shutdown…” Reply by u/ioneartemis: “**afaik, not anymore...**” — [r/XoulAI: Exporting data?](https://www.reddit.com/r/XoulAI/comments/1ndz3jv/exporting_data/)
- GitBook Account Settings / FAQ / `llms.txt` (2026) still have **no export page**. DreamGen’s 2026 review tested creation, proxy, group chat, ToS/privacy; it does **not** mention an export feature. — [Account Settings](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/account-settings.md); [DreamGen review](https://dreamgen.com/blog/articles/xoul-ai-review)
- AiMagHub (2026-06-14) still *advises* users to “Export conversations and character profiles regularly” as a general precaution, without citing a current Xoul control. — [AiMagHub](https://aimaghub.com/xoul-ai-review-2026/)

### Inferences
- Treat official bulk export as a **2025 shutdown tool**, not a 2026 documented product feature, unless a logged-in 2026 UI check proves otherwise.
- Data itself (chats/Xouls) was retained across the five-month outage and is used on the live 2026 site; retention ≠ export.

### Gaps
- No 2026 first-party screenshot or GitBook changelog entry that says “export removed” or “export restored.”
- `/api/v1/export/all` 2026 behavior not independently observed in this research.

## Custom Engine / proxy: local chats, or only swap the LLM on Xoul’s frontend?

### Takeaway
Custom Engine only **swaps the LLM** (and sampling) **inside Xoul’s hosted chat UI**. Chats, cards, memories, and lorebooks stay on Xoul. It is not a local runtime, not an export path, and Xoul’s own response-style prompts are withheld from proxies.

### Cited Findings
- Official page title: “Custom Engine (Proxy) — The basics of setting up a **proxy for use on Xoul.AI**.” Configuration happens in chat Engine settings. Fields: **Engine Name**, **Provider**, **API Key**, **Model Name**, **System Prompt**, **Max Context Length**, plus sampling (**Temperature**, **Top P**, **Max Tokens**, **Seed**, **Top K**, **Min P**, **Repetition Penalty**). — [Custom Engine (Proxy)](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/chat-interface/custom-engine-proxy.md)
- Providers: **Featherless**, **TogetherAI**, **InformaticaAI**, **OpenRouter**, **Chutes**, **Generic** (Generic reveals **Base URL**). — same
- “**Xoul.AI’s Response Styles and creator system prompts are not available with proxy use because proxies can leak this information.**” User must supply their own System Prompt. — same
- Reply display is still Xoul-constrained: “The reply from the model on Xoul.AI is limited to **3500 characters**. While a proxy can generate more text than that, attempting to edit a reply that contains more text than the system is designed to allow will prevent you from being able to save the edited reply.” Recommended Max Tokens ≤ 875. — same
- Chat Interface: “You can also use a custom model by providing a URL and API key. Select the **Custom** option in the Model menu to set up a custom proxy.” — [Chat Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/chat-interface.md)
- Relaunch announcement (2025-09-10, GitBook): “**Proxies:** Xoul users are now able to use proxies. To do so, go to your conversation and add a custom engine profile under the model selector. This allows you to use external APIs and **hook it up to the Xoul experience you know and love**. **Proxies do not consume your daily energy limit.**” — [Announcements & Updates](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/announcements-and-updates.md)
- DreamGen (2026-05-02) configured Custom engine from **chat settings** on **xoul.ai in Chrome**, used OpenRouter Claude Opus 4.6 (Fast), and continued the same Xoul chat UI (character card, memories tests, group chat). They describe Xoul as **host**: “Xoul AI let us *have the room* and tools… connecting a third-party model.” No local client. — [DreamGen: Xoul AI Review](https://dreamgen.com/blog/articles/xoul-ai-review)
- r/aiproxy (2025-09-19): returning user, old login and pre-shutdown chats still there; “support for OpenRouter, Chutes, and others”; “proxy messages don’t seem to count towards energy at all”; setup inside the site. — [r/aiproxy: XOUL AI is back up](https://www.reddit.com/r/aiproxy/comments/1nldsuc/xoul_ai_is_back_up/)

### Inferences
- Custom Engine is **not** a way to run Xoul chats locally, dump transcripts, or host cards offline. It is an LLM passthrough from Xoul’s servers/frontend to a user-supplied OpenAI-compatible (or listed) provider.
- Because Xoul strips its own system prompts for proxy calls, a proxy logger would see user-supplied system prompt plus whatever card/history Xoul still sends — **not** a documented, stable public prompt schema.

### Gaps
- Official docs do not publish the JSON payload Xoul POSTs to the proxy (messages array, how Description/Advanced Definition/Greeting/lorebook entries are serialized). Observing that would require intercepting one’s own proxy traffic and is not in official documentation.
- Whether “Generic / Base URL” can point at a localhost LLM is not documented; even if the HTTP call reached a local model, the **conversation state would still live on Xoul**.

## Official documentation of endpoints (what is actually documented)

### Takeaway
Official materials document **product URLs and one historical export path**, not a REST API. Anything else is undocumented.

### Cited Findings
- Site: `https://xoul.ai/` — [xoul.ai](https://xoul.ai/)
- FAQ: `https://xoul.ai/faq` — [FAQ](https://xoul.ai/faq)
- Privacy: `https://xoul.ai/privacy` (Last updated May 20, 2024) — [Privacy Policy](https://xoul.ai/privacy)
- Terms: `https://xoul.ai/terms-of-service` — [Terms of Service](https://xoul.ai/terms-of-service)
- Official handbook: `https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/` with machine index `.../llms.txt` and per-page `.md` mirrors. — [Official Guide](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/llms.txt)
- Profile URL pattern: `xoul.ai/profile/{username}` (username immutable). Xoul URL pattern: `xoul.ai/xoul/{handle}.xo`. — [Account Creation & Deletion](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/account-creation-and-deletion.md); [Xoul Creation Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/xouls/xoul-creation-interface.md)
- Login helper used during shutdown export: `https://xoul.ai/?open_login=true`. — [r/XoulAI](https://www.reddit.com/r/XoulAI/comments/1k6sc9y/for_all_xoul_users_who_forgot_to_export_their/)
- Historical data-export endpoint: `https://api.xoul.ai/api/v1/export/all` (cookie session; unauthenticated body reported as `{"detail":"Missing authentication credentials."}`). **Not** listed in GitBook. — [r/XoulAI export/all](https://www.reddit.com/r/XoulAI/comments/1k4c7x9/if_you_cant_export_your_stuff_through_the_app_but/)
- Support: Discord `https://discord.gg/xoul`, Reddit `https://www.reddit.com/r/XoulAI/`, email `hello@xoul.ai`, Ko-fi `https://ko-fi.com/urxoul`. — [FAQ](https://xoul.ai/faq)
- iOS: `https://apps.apple.com/us/app/xoul-ai-imagine-anything/id6673608916`. Android package `ai.xoul.android` (Play listing unstable after May/June 2026). — [App Store](https://apps.apple.com/us/app/xoul-ai-imagine-anything/id6673608916)

### Inferences
- For “official ways to get data out” in 2026, the documented options are: (1) copy individual chat bubbles in the UI; (2) manually copy card fields from the creation UI; (3) email a privacy-rights access/portability request to `hello@xoul.ai`; (4) historical ZIP if a user still has an April–July 2025 download. There is no documented always-on export API.

### Gaps
- No official list of `api.xoul.ai` routes other than the community-circulated `/api/v1/export/all`.
- No authenticated confirmation that `/api/v1/export/all` still issues a ZIP in 2026.
