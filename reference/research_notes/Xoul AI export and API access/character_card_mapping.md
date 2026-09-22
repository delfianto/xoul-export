# Xoul.AI character → local character card mapping

This note maps Xoul.AI “Xoul” creation fields onto SillyTavern / TavernAI / Agnai / Risu / Pygmalion character-card fields so a user can recreate a character locally. It is **not** a 1:1 lossless conversion. Xoul treats Description + Advanced Definition as one continuous definition with a public/hidden split; SillyTavern V2 splits that same material across `description`, `personality`, `scenario`, and `system_prompt`. Several Xoul features (voices, energy-gated models, scenario meters, RAG lorebooks, group talkativeness, per-chat Memories) have no card equivalent.

Source-quality note: official GitBook pages are treated as current for field semantics and the shared 12k/17k budget. The Fandom wiki and rentry creation guide sometimes lag (they still mention a separate Personality field, older per-field caps, and extra Response Styles). Conflicts are called out inline.

## Exact Xoul creation fields (Name, Age, Gender, Description, Advanced Definition, Chat Samples, Greeting, Custom Prompt / Response Style, tags, images, lorebooks, novel mode)

### Takeaway
A current Xoul is a branded character card with identity fields (Name, Gender, Age), a shared-budget definition block (Description + Advanced Definition + Chat Samples), an Intro/Greeting pair, a Response Style (preset or Custom system prompt), optional lorebook attachments, an icon/voice, and social metadata (Handle, Tagline, Creator Memo, tags, visibility). “Novel mode” is a Response Style preset, not a separate card type.

### Cited Findings
- Official docs define a Xoul as Xoul.AI’s branded character card: a collection of information that sets the foundation of a chat. Up to 8 Xouls can be in one chat. Persona, Scenario, Memories, and Lorebook are separate cards that compile into one prompt. — [Xouls | Xoul.AI Official Documentation](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/xouls)
- **Name:** any alphanumeric characters or symbols; maximum **100 characters**. `{{char}}` and `xoul` are placeholders swapped for the exact Name text before the model sees the prompt. — [Xoul Creation Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/xouls/xoul-creation-interface.md)
- **Name limit conflict:** Fandom says maximum **50 characters**. A Sep 2025 Reddit creator guide also says **1–50 characters**. Official GitBook (page dated 2026-07-10) says **100**. — [Xoul | Fandom](https://xoul-ai.fandom.com/wiki/Xoul); [Content Creation: Xouls (r/XoulAI)](https://www.reddit.com/r/XoulAI/comments/1nfv2xw/content_creation_xouls/); [Xoul Creation Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/xouls/xoul-creation-interface.md)
- **Gender:** dropdown Male, Female, Non-Binary, Prefer Not to Say; official docs also allow typing a custom gender. The model reads this field and uses it for pronouns. — [Xoul Creation Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/xouls/xoul-creation-interface.md); [Xoul | Fandom](https://xoul-ai.fandom.com/wiki/Xoul)
- **Age:** numerical value **18 to 100000**. The model reads it. Characters under 18 are forbidden, including background characters. — [Xoul Creation Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/xouls/xoul-creation-interface.md); [Xoul | Fandom](https://xoul-ai.fandom.com/wiki/Xoul)
- **Description:** the public “guts” of the Xoul. Official: Description & Advanced Definition together define who/what the content is about (appearance, personality, opinions, dress, relationships, or a whole cast/world for story Xouls). Visible on the profile page. Minimum 10 characters (Reddit creator guide). — [Xoul Creation Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/xouls/xoul-creation-interface.md); [Content Creation: Xouls (r/XoulAI)](https://www.reddit.com/r/XoulAI/comments/1nfv2xw/content_creation_xouls/)
- **Historical Personality field:** Xoul originally had separate Personality and Description fields; they were later merged into one Description. Charsnap’s import guide states this explicitly. An older rentry FAQ still lists Personality (up to 1250 characters) and Description (up to 1250) as distinct. Current official creation UI does **not** list Personality. — [Xoul Import Guide | charsnap](https://charsnap.gitbook.io/charsnap/basics-for-creators/character-creation/xoul-import-guide); [FAQ and Quick Reference (rentry)](https://rentry.co/XCGFAQandQuickRef); [Xoul Creation Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/xouls/xoul-creation-interface.md)
- **Intro (formerly Default Scenario):** max **1000 characters**. Official: “back of the book” blurb / premise leading into the Greeting; **visible to users who start chats** and displayed at the top of the chat interface. Overwritten if a Scenario card is used. Greeting is **not** permanently remembered; other Xoul text is. — [Xoul Creation Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/xouls/xoul-creation-interface.md); [Memory & Context](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/subscriptions/memory-and-context.md)
- **Intro visibility conflict:** Fandom says Intro “is not public-facing and only serves as context.” Official says it is visible at the top of the chat. Prefer official. — [Xoul | Fandom](https://xoul-ai.fandom.com/wiki/Xoul); [Xoul Creation Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/xouls/xoul-creation-interface.md)
- **Greeting:** first message printed in chat. If blank, a small model generates a random greeting. Official: greeting style (italics, quotes, tense, perspective, length) strongly influences later writing. Fandom and a Feb 2025 Reddit mini-guide say **maximum 4000 characters**. Official Memory cheat sheet lists Greeting as a chat reply and caps **model replies at 3500 characters** (user replies 1500). — [Xoul Creation Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/xouls/xoul-creation-interface.md); [Xoul | Fandom](https://xoul-ai.fandom.com/wiki/Xoul); [Mini-guide on Xoul Creation – The Greeting](https://www.reddit.com/r/XoulAI/comments/1ip9g7i/miniguide_on_xoul_creation_the_greeting); [Memory & Context](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/subscriptions/memory-and-context.md); [Content Creation: Xouls (r/XoulAI)](https://www.reddit.com/r/XoulAI/comments/1nfv2xw/content_creation_xouls/)
- **Response Styles (current official list):** Roleplay (Character-Focused), Novel (Slowburn), Realistic (Natural / also called Simple in some pages), and Custom. Seeing “Creator” in a chat means the Xoul or Scenario is using a Custom Prompt. — [Response Style & Length](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/chat-interface/response-style-and-length.md); [Xoul Creation Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/xouls/xoul-creation-interface.md)
- **Response Styles (Fandom, likely stale):** Driven, Roleplay, Novel, Simple, Chaos, Texting, Lust, Custom. Official current pages do not list Driven/Chaos/Texting/Lust. — [Xoul | Fandom](https://xoul-ai.fandom.com/wiki/Xoul)
- **Custom / System Prompt:** Custom is a **full system-prompt override**, not a slot for a single extra instruction. Max **6000 characters** (Fandom for Custom System Prompt; official Memory cheat sheet for Response Style). Stack: chat Custom > Scenario System Prompt > Xoul Custom > Xoul.AI default. In group chats each Xoul can keep its own Custom. — [Response Style & Length](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/chat-interface/response-style-and-length.md); [Xoul | Fandom](https://xoul-ai.fandom.com/wiki/Xoul); [Memory & Context](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/subscriptions/memory-and-context.md); [Scenarios](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/scenarios.md)
- **Advanced Definition:** “a direct continuation of the Description, the only difference being that it is not visible to anyone except the AI.” Same shared character budget. Creators use it for hidden agendas, biases, traumas, private beliefs, extra world/side-character detail, or (community practice) jailbreak-style prompts prefaced with `SYSTEM:`. — [Xoul Creation Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/xouls/xoul-creation-interface.md); [Xoul | Fandom](https://xoul-ai.fandom.com/wiki/Xoul); [Xoul Creation Guide (rentry)](https://rentry.co/XoulCreationGuide)
- **Chat Samples:** examples of how the character should talk. Official delimiter: start a new sample with `{{char}}:` or `xoul:`; samples may be multiple lines including blank lines. Reddit creator guide: `{{char}}:` marks where one sample ends and another begins. Permanently in context on Xoul (unlike ST example messages, which are typically pruned). — [Xoul Creation Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/xouls/xoul-creation-interface.md); [Content Creation: Xouls (r/XoulAI)](https://www.reddit.com/r/XoulAI/comments/1nfv2xw/content_creation_xouls/)
- **Override Default Formatting:** toggle on the edit-Xoul page. Off = default roleplay formatting (quotation marks around dialogue, asterisks around narration, third person). On = drop those instructions and follow formatting in definition/samples/greeting. — [Xoul Creation Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/xouls/xoul-creation-interface.md); [Announcements & Updates](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/announcements-and-updates)
- **Lorebooks (add-ons):** attach up to **3** lorebooks to a Xoul; they auto-attach in chats but users can remove/replace them. A lorebook is up to **250 entries**, each up to **1500 characters**. Per reply, **only three entries total** are injected (keyword match first, then RAG). Entry **Name is not included in the prompt**. — [Xoul Creation Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/xouls/xoul-creation-interface.md); [Lorebooks](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/lorebooks.md)
- **Icon:** required. Generate (Cells), pick from gallery, or upload. Square or rectangular. Images cannot be explicit; depicted characters must appear 18+. The model **cannot see** the image. — [Xoul Creation Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/xouls/xoul-creation-interface.md); [Xoul | Fandom](https://xoul-ai.fandom.com/wiki/Xoul)
- **Voice:** pick from library or custom voices. The model **cannot hear** the voice; it does not affect generated text. Voice playback costs Cells (2–14 to play a message; 30 to create a voice). — [Xoul Creation Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/xouls/xoul-creation-interface.md); [Xoul | Fandom](https://xoul-ai.fandom.com/wiki/Xoul); [Energy, Cells & Streaks](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/subscriptions/energy-cells-and-streaks)
- **Handle:** unique permanent URL slug (`xoul.ai/xoul/{handle}.xo`). Alphanumeric, periods, hyphens only. Reddit creator guide: **6–26 characters**. Cannot be changed; not reusable after deletion. — [Xoul Creation Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/xouls/xoul-creation-interface.md); [Content Creation: Xouls (r/XoulAI)](https://www.reddit.com/r/XoulAI/comments/1nfv2xw/content_creation_xouls/)
- **Tagline:** **1–100 characters**, public, shown on explore page, **not read by the AI**. — [Xoul | Fandom](https://xoul-ai.fandom.com/wiki/Xoul); [Content Creation: Xouls (r/XoulAI)](https://www.reddit.com/r/XoulAI/comments/1nfv2xw/content_creation_xouls/)
- **Creator Memo:** up to **1500 characters**, public, displayed on the profile as **“Bio”**, **not read by the AI**. No markdown (Reddit). Intended for warnings, update notes, intent. — [Xoul Creation Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/xouls/xoul-creation-interface.md); [Xoul | Fandom](https://xoul-ai.fandom.com/wiki/Xoul); [Content Creation: Xouls (r/XoulAI)](https://www.reddit.com/r/XoulAI/comments/1nfv2xw/content_creation_xouls/)
- **Language:** dropdown, default English. — [Xoul | Fandom](https://xoul-ai.fandom.com/wiki/Xoul)
- **Visibility:** Public (search + everyone), Unlisted (direct link only; official also calls this Restricted in one Reddit mirror), Private (creator only). Private Xouls can still be used in a public Scenario (Fandom). — [Xoul Creation Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/xouls/xoul-creation-interface.md); [Xoul | Fandom](https://xoul-ai.fandom.com/wiki/Xoul)
- **Community Tags:** up to **7**. — [Xoul | Fandom](https://xoul-ai.fandom.com/wiki/Xoul); [Xoul Creation Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/xouls/xoul-creation-interface.md)
- **Novel mode:** Novel (Slowburn) is a **Response Style system prompt**, not a separate Xoul type. It “influenc[es] the model to use a more slow, descriptive style of prose.” Story Xouls (character + premise in the definition) are a writing pattern, not a UI mode. — [Response Style & Length](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/chat-interface/response-style-and-length.md); [Xouls](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/xouls)
- **Personas (user side, not on the Xoul card):** Name (replaces `{{user}}` / `user`), Gender, Description, Image. Persona description max **1000 characters** (2000 Gold). The model *reacts to* the persona; it does not play it. — [Personas](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/profile-page/personas.md); [Memory & Context](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/subscriptions/memory-and-context.md)
- **Scenario cards (separate from Xoul Intro):** public Description + hidden Advanced Definition share **3000 characters**. Optional familiarity, location, up to 8 embedded Xouls, greeting (Fandom: 4000 chars), up to 3 lorebooks, Objective (Fandom: 2000), up to 6 Meters, hidden System Prompt (6000) that **overrides** Xoul custom prompts. — [Scenario Creation Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/scenarios/scenario-creation-interface.md); [Scenario | Fandom](https://xoul-ai.fandom.com/wiki/Scenario)
- **Memories (per-chat, not on the card):** 5000-character permanent notes/pins for that chat. — [Memories Field](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/chat-interface/memories-field)

### Inferences
- Recreating a Xoul locally requires more than the public profile: Advanced Definition, Chat Samples, and Custom Prompt are first-class inference fields.
- Age and Gender should be copied into local `description` (or a short `personality` line) because ST/Agnai/Risu/Pygmalion have no dedicated age/gender slots, and Xoul’s model *does* read those fields.
- “Novel mode” should be recreated as a local **preset / system prompt**, not as a card field.

### Gaps
- Official GitBook does not publish a numeric Greeting cap; 4000 vs 3500 (creation field vs live model-reply cap) is unresolved.
- Official GitBook does not publish Tagline/Creator Memo/Handle length; those numbers come from Fandom + Reddit creator guide.
- No official list of every Response Style that ever existed; Fandom’s extra styles may be pre-relaunch.

## Public vs hidden fields (profile vs inference)

### Takeaway
Description, identity, social metadata, and the icon are public. Advanced Definition, Chat Samples, and Custom/System Prompt text are hidden from other users and used only at inference (users may see the style label “Creator,” not the prompt). Greeting and Intro are shown in chat, not as hidden definition.

### Cited Findings
- Description is visible on the Xoul profile to any user. — [Xoul Creation Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/xouls/xoul-creation-interface.md)
- Advanced Definition “is not visible to anyone except the AI” and is “a direct continuation of the Description.” Reddit creator guide: “Not visible to any user who views your content”; it “doesn’t function any differently when written in the Description instead other than being visible.” — [Xoul Creation Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/xouls/xoul-creation-interface.md); [Content Creation: Xouls (r/XoulAI)](https://www.reddit.com/r/XoulAI/comments/1nfv2xw/content_creation_xouls/)
- Chat Samples are “Not visible to any user viewing your content” (Reddit). Official treats them as Advanced Settings alongside Advanced Definition. — [Content Creation: Xouls (r/XoulAI)](https://www.reddit.com/r/XoulAI/comments/1nfv2xw/content_creation_xouls/); [Xoul Creation Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/xouls/xoul-creation-interface.md)
- Creator Memo is public as “Bio” and is **not** read by the AI. Tagline is public and not read by the AI. Tags are for search/filters and “SHOULD NOT be used in the prompt engineering” on the ST side analog. — [Xoul Creation Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/xouls/xoul-creation-interface.md); [Character Card V2 spec](https://github.com/malfoyslastname/character-card-spec-v2/blob/main/spec_v2.md)
- Custom Response Style: users in a chat see “Creator” rather than the prompt text. Scenario System Prompt is “hidden from the user” (Fandom). — [Response Style & Length](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/chat-interface/response-style-and-length.md); [Scenario | Fandom](https://xoul-ai.fandom.com/wiki/Scenario)
- Greeting prints as the first chat message (visible once a chat starts). Intro is displayed at the top of the chat (official). Neither is the hidden-definition slot. — [Xoul Creation Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/xouls/xoul-creation-interface.md)
- Community confirmation: Description is public and AI-read; Advanced Definition is hidden and AI-read; Creator Memo is user-only. — [r/XoulAI comment thread](https://www.reddit.com/r/XoulAI/comments/1nittg3/is_this_happening_to_anyone_else_or_is_it_just_me)

**Public (shown on profile / explore / chat chrome)**

| Field | Shown where | Read by model? |
| --- | --- | --- |
| Name, Gender, Age | Profile / creation | Yes |
| Description | Profile | Yes |
| Icon | Everywhere | No |
| Tagline | Explore | No |
| Creator Memo (“Bio”) | Profile | No |
| Handle / URL | Profile URL | No |
| Tags, Language, Visibility | Profile / search | No |
| Voice name | Profile / TTS UI | No |
| Intro | Top of chat (official) | Yes (until overwritten by a Scenario) |
| Greeting | First chat message | Yes, but temporary (scrolls out of context) |

**Hidden from other users (inference / creator-only)**

| Field | Read by model? |
| --- | --- |
| Advanced Definition | Yes (permanent) |
| Chat Samples | Yes (permanent on Xoul) |
| Custom System Prompt | Yes (overrides defaults) |
| Scenario Advanced Definition | Yes |
| Scenario System Prompt | Yes (overrides Xoul custom) |
| Override Default Formatting toggle | Indirect (changes injected formatting instructions) |

### Inferences
- Copying only what is on a public Xoul profile **cannot** reproduce the character the model actually plays if the creator used Advanced Definition, Chat Samples, or Custom Prompt.
- Putting secrets in Advanced Definition does **not** stop the model from saying them; official/Fandom both warn that hidden ≠ “do not mention.”

### Gaps
- Whether Greeting text is visible on the public profile card (vs only after starting a chat) is not stated in official docs.
- Whether attached lorebook **entry content** is publicly readable on another creator’s Xoul page is not documented (Fandom’s lorebook page says entry content is “public-facing,” but that may mean the lorebook’s own page).

## Shared 12k/17k character budget (Description + Advanced Definition + Chat Samples)

### Takeaway
Description, Advanced Definition, and Chat Samples share one character budget: **12,000** by default, **17,000** for Gold. The 5000/5000/2000 split in official docs is an example allocation, not three hard caps. Greeting, Intro, Custom Prompt, Persona, and Scenario have separate limits.

### Cited Findings
- “The Description, Advanced Definition and Chat Samples share a character limit. You have 12000 characters (or 17000 characters for Gold tier subscribers) to define your character across all three text fields.” Example: Description 5000 + Advanced Definition 5000 + Chat Samples 2000 = 12,000. — [Xoul Creation Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/xouls/xoul-creation-interface.md)
- Gold: “17,000 maximum character limit in Xouls” and “2,000 maximum character limit in Personas.” — [Subscriptions](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/subscriptions.md)
- Memory cheat sheet: Xouls max 12000 (17000 Gold) for Description + Advanced Definition + Chat Samples; Response Style 6000; Personas 1000 (2000 Gold); Xoul Intro 1000; Scenario 3000; Lorebook entry 1500; Memories 5000; user reply 1500; model reply 3500. — [Memory & Context](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/subscriptions/memory-and-context.md)
- Announcement: “samples, description, and advanced definition now share a length.” An older announcement said “Xoul definition, greeting, and description now share one character limit” (superseded). — [Announcements & Updates](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/announcements-and-updates)
- Reddit creator guide: Description minimum 10 characters; maximum 12k or 17k depending on subscription, shared with Advanced Definition and Chat Samples. — [Content Creation: Xouls (r/XoulAI)](https://www.reddit.com/r/XoulAI/comments/1nfv2xw/content_creation_xouls/)
- These are **character** counts, not tokens. Community FAQ: “One token = ~4 characters. Character count is NOT THE SAME AS TOKENS.” — [FAQ : XoulAI](https://www.reddit.com/r/XoulAI/comments/1htz3sj/faq/)
- Context tokens (how much the model can read, including chat history) are separate: Free ~12k tokens, Green ~16k, Purple ~24k, Gold ~32k. — [Memory & Context](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/subscriptions/memory-and-context.md)
- Older rentry FAQ (pre-shared-budget): Personality 1250, Description 1250, Advanced Definition 5000, Chat Samples 2000, Default Scenario 1000. Do not use these as current caps. — [FAQ and Quick Reference (rentry)](https://rentry.co/XCGFAQandQuickRef)

### Inferences
- A local card can legally hold more text than Xoul allowed; the binding constraint on Xoul was prompt-budget, not file size.
- When converting, concatenating Description + Advanced Definition into ST `description` is faithful to Xoul’s “one continuous definition” model.

### Gaps
- Official docs do not say whether the 12k/17k counter includes whitespace/newlines or only visible glyphs.
- No official statement of whether Gold-only 17k Xouls are truncated for free users at inference, or only at creation time.

## Chat-sample delimiters (`{{char}}:`, `xoul:`)

### Takeaway
Official Xoul delimiters for **new samples** are `{{char}}:` or `xoul:`. Macros `{{char}}` / `{{xoul}}` / `xoul` are equivalent and expand to the Name field **before** the model sees the text. SillyTavern example messages instead use `<START>` conversation separators plus `{{user}}:` / `{{char}}:`. Xoul does **not** honor `<START>`, `<BOT>`, `END_OF_DIALOG`, or ST-only macros.

### Cited Findings
- Official: “Each one can be multiple lines long (including blank lines), and you separate them by starting a new one with `{{char}}:` or `xoul:`.” — [Xoul Creation Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/xouls/xoul-creation-interface.md)
- Reddit creator guide: “Chat Samples span multiple lines, including line breaks and double line breaks. `{{char}}:` will indicate to the AI where one sample ends and the other begins.” — [Content Creation: Xouls (r/XoulAI)](https://www.reddit.com/r/XoulAI/comments/1nfv2xw/content_creation_xouls/)
- Rentry: samples are `(Who said this line): (What was said)`; a macro, name, or word before the colon indicates the speaker. Samples are treated as things that **did happen**, not hypotheticals. Usable markdown is italics and bold. — [Xoul Creation Guide (rentry)](https://rentry.co/XoulCreationGuide)
- Fandom (conflict): “separating each of them by paragraph (using the Enter key)” and “every sample has to be on the same line.” This contradicts official multi-line samples and the `{{char}}:` delimiter. Prefer official. — [Xoul | Fandom](https://xoul-ai.fandom.com/wiki/Xoul)
- Macros: `{{char}}` / `{{xoul}}` / `xoul` → Xoul Name; `{{user}}` / `user` → Persona Name. Conversion is frontend, case-sensitive. `user` matches as a substring (`abuser` → `ab{PersonaName}`). ST macros such as `{{time}}`, `<START>`, `<BOT>`, `END_OF_DIALOG` do nothing on Xoul. — [Xoul Creation Guide (rentry)](https://rentry.co/XoulCreationGuide); [Big list of common terms (r/XoulAI)](https://www.reddit.com/r/XoulAI/comments/1hxoa6s/big_list_of_common_terms_phrases_and_concepts_in)
- ST V1 `mes_example` **MUST** be expected in this shape, with `<START>` marking a new conversation: — [Character Card V1 spec](https://github.com/malfoyslastname/character-card-spec-v2/blob/main/spec_v1.md)

```
<START>
{{user}}: hi
{{char}}: hello
```

- Wyvern’s Xoul-to-card converter explicitly tells creators to rewrite examples to `{{char}}:` / `{{user}}:`, “not `xoul` or an actual character name.” — [Xoul to Card Converter (r/WyvernChat)](https://www.reddit.com/r/WyvernChat/comments/1k7e3qi/xoul_to_card_converter)
- On Xoul, Chat Samples are **permanent** context. On ST, example conversations **SHOULD** be pruned once real history fills context. Charsnap’s import guide flags the same mismatch. — [Xoul Creation Guide (rentry)](https://rentry.co/XoulCreationGuide); [Character Card V1 spec](https://github.com/malfoyslastname/character-card-spec-v2/blob/main/spec_v1.md); [Xoul Import Guide | charsnap](https://charsnap.gitbook.io/charsnap/basics-for-creators/character-creation/xoul-import-guide)

### Inferences
- Conversion recipe for `mes_example`: (1) replace bare `xoul` / `{{xoul}}` with `{{char}}`; (2) replace bare `user` carefully (word-boundary only) with `{{user}}`; (3) insert `<START>` before each sample block that begins with `{{char}}:` or `{{user}}:`; (4) if a sample is a single in-character paragraph with no speaker prefix, wrap it as `{{char}}: …`.
- Do not leave Xoul-only `xoul` macros in a local card; ST will not expand them.

### Gaps
- No official statement of whether `{{xoul}}` (braced) is implemented in addition to bare `xoul`; community guides say yes.
- Fandom’s “one sample per line” rule is unreconciled with official multi-line samples; implementation may have changed.

## Can a user export another creator’s public Xoul fully? (Advanced Definition withheld?)

### Takeaway
No. The official data-export zip includes **your** created Xouls in `xouls/`, not other people’s full cards. Chats with other creators’ Xouls export a **snapshot** of public-ish fields; community tools and users report that **advanced fields are missing**. Advanced Definition is the field designed to be hidden from viewers.

### Cited Findings
- Official/community export (shutdown-era, still the documented zip layout) folders: `chats_single`, `chats_multi`, `personas`, `xouls`, `scenarios`, `assets` (lorebooks). mefriend: “Xouls you created (`xouls`)”; “Lorebooks you created (`assets`)”; “Personas you created.” — [Importing Your Data from Xoul.ai — mefriend](https://docs.mefriend.ai/xoul_integration_guide__2025_04_22)
- Export button: “single chats, group chats, character profiles, lorebooks.” — [ANNOUNCEMENT: Export All Content Button is Now Live](https://www.reddit.com/r/XoulAI/comments/1k4bkya/announcement_export_all_content_button_is_now_live/)
- Reddit on chats with others’ bots: “It will not port the actual bot details unless you made it yourself though. So if you wanted to use the export to copy character details from a bot that you didn’t make, you can’t.” — [Is there a way to read old chats after exporting](https://www.reddit.com/r/XoulAI/comments/1k6xdrb/is_there_a_way_to_read_old_chats_after_exporting/)
- SOX Project (community ST porter): full port only if you are the creator. From a chat snapshot “that xoul will not have any advanced fields”; “use the extract character tools to get the **partial** data.” — [Save Our Xouls (SOX Project)](https://www.reddit.com/r/XoulAI/comments/1k9c04h/save_our_xouls_sox_project_create_your_own_mini)
- Chat-export snapshot fields observed in a ST-import guide (dummy structure inside `chats_single` JSON): `slug`, `name`, `icon_url`, `voice_id`, `talkativeness`, `tagline`, `age`, `bio`, `backstory`, `gender`, `samples`. No `definition` / `advanced_definition` / `system_prompt` in that snippet. — [Importing XOUL Chats into SillyTavern](https://www.reddit.com/r/XoulAI/comments/1l452g7/importing_xoul_chats_into_sillytavern)
- Official: Advanced Definition is explicitly not visible to anyone except the AI. — [Xoul Creation Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/xouls/xoul-creation-interface.md)
- Viewing a public profile still shows Description (and Bio/Tagline/etc.); it does not show Advanced Definition. — [Xoul Creation Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/xouls/xoul-creation-interface.md); [r/XoulAI](https://www.reddit.com/r/XoulAI/comments/1nittg3/is_this_happening_to_anyone_else_or_is_it_just_me)

### Inferences
- Recreating **your own** Xoul from `xouls/` can include hidden definition (community converters speak of merging `backstory` with `definition`).
- Recreating **someone else’s** public Xoul from a chat zip is inherently lossy: you get name/age/gender/tagline/icon plus whatever landed in `bio` / `backstory` / `samples`, not Advanced Definition or Custom Prompt.
- Manual copy-paste from the public profile yields Description + Greeting (after starting a chat) + Intro (chat chrome) + social metadata — still missing Advanced Definition and Custom Prompt.

### Gaps
- No official schema for files inside `xouls/` vs the chat snapshot, so the exact JSON key for Advanced Definition in **owned** exports (`definition` vs `advanced_definition` vs something else) is inferred from Wyvern (“Backstory is merged with definition”), not from a published spec.
- Unverified whether chat-snapshot `samples` is actually Chat Samples (a hidden field) or empty/truncated for others’ Xouls. SOX says “advanced fields” are missing; the dummy JSON still has a `samples` key.
- Unverified whether chat-snapshot `bio` is Creator Memo (officially labeled Bio) or Description.
- No evidence of a public API that returns another creator’s Advanced Definition.

## SillyTavern V2/V3 (and TavernAI / Agnai / Risu / Pygmalion) fields

### Takeaway
The portable core is Character Card V2 (`spec: "chara_card_v2"`, `spec_version: "2.0"`) nested under `data`. V1 is the flat six-field Tavern/Pygmalion shape. V3 is a superset (assets, nickname, timestamps, group-only greetings). Agnai and Risu import the same V2 fields under different internal names.

### Cited Findings
- **V1 (TavernAI / Pygmalion / Chub-era):** `name`, `description`, `personality`, `scenario`, `first_mes`, `mes_example`. All mandatory, default `""`. Macros: `{{char}}`/`<BOT>` → name; `{{user}}`/`<USER>` → user display name. PNG embedding: base64 JSON in EXIF/`chara` tEXt. — [Character Card V1 spec](https://github.com/malfoyslastname/character-card-spec-v2/blob/main/spec_v1.md)
- **V1 field meanings:** `description` SHOULD be in every prompt (Silly: “Description”; Agnai: “Persona Attributes”; ZoltanAI: “Personality”). `personality` is “a short summary of the character's personality” (Silly: “Personality summary”). `scenario` is current context/circumstances. `first_mes` is the greeting; the bot MUST speak first. `mes_example` is example conversations with `<START>`. — [Character Card V1 spec](https://github.com/malfoyslastname/character-card-spec-v2/blob/main/spec_v1.md)
- **V2:** wraps V1 fields in `data` and adds `creator_notes` (MUST NOT be used in prompts), `system_prompt` (replaces the frontend’s system prompt unless empty; supports `{{original}}`), `post_history_instructions` (replaces UJB/jailbreak; supports `{{original}}`), `alternate_greetings[]`, optional `character_book`, `tags[]`, `creator`, `character_version`, `extensions{}`. — [Character Card V2 spec](https://raw.githubusercontent.com/malfoyslastname/character-card-spec-v2/main/spec_v2.md)
- **V2 `character_book` entry:** `keys[]`, `content`, `enabled`, `insertion_order`, optional `name`, `priority`, `id`, `comment`, `selective`, `secondary_keys`, `constant`, `position` (`before_char` | `after_char`), `case_sensitive`, `extensions`. — [Character Card V2 spec](https://raw.githubusercontent.com/malfoyslastname/character-card-spec-v2/main/spec_v2.md)
- **V3:** `spec: "chara_card_v3"`, `spec_version: "3.0"`. Adds `assets[]` (`type`, `uri`, `name`, `ext`), `nickname`, `creator_notes_multilingual`, `source[]`, `group_only_greetings[]`, `creation_date`, `modification_date`. PNG chunk `ccv3` takes precedence over `chara`. CHARX is a zip with `card.json`. — [SPEC_V3.md](https://cdn.jsdelivr.net/gh/kwaroran/character-card-spec-v3@main/SPEC_V3.md)
- **Agnai import of tavern V2:** `name` ← name; `greeting` ← `first_mes`; `persona.attributes.text` ← `description` + `personality` joined; `sampleChat` ← `mes_example`; `scenario` ← `scenario`; `alternateGreetings` ← `alternate_greetings`. — [agnai `port.ts`](https://github.com/agnaistic/agnai/blob/dev/web/pages/Character/port.ts)
- **Risu internal mapping:** `data.name` → `name`; `data.description` → `desc`; `data.first_mes` → `firstMessage`; `data.alternate_greetings` → `alternateGreetings`; `data.character_book` → `globalLore`; V3 `assets` → `emotionImages` / `ccAssets`. — [RisuAI character cards (DeepWiki)](https://deepwiki.com/kwaroran/RisuAI/3.1-character-cards)
- ST chats are **JSONL**, not a single JSON object: first line is header (`user_name`, `character_name`, `create_date`, `chat_metadata`); later lines are messages (`name`, `is_user`, `is_system`, `send_date`, `mes`, optional `swipes`, `swipe_id`, `extra`). Backups: `backups/chat_{name}_{timestamp}.jsonl`. — [SillyTavern chat storage (DeepWiki)](https://deepwiki.com/SillyTavern/SillyTavern/5.2-vector-search); [SillyTavern overview](https://deepwiki.com/SillyTavern/SillyTavern)

### Inferences
- Targeting **V2 JSON + PNG `chara` chunk** maximizes compatibility (ST, Agnai, Risu, TavernAI, Pygmalion-era importers). V3 `assets` is the right place for the Xoul icon if the destination is modern ST/Risu.
- Agnai will smash `description` and `personality` together anyway, so splitting them is mainly for ST UI.

### Gaps
- No single official “Pygmalion card” spec beyond V1; Pygmalion frontends historically consumed the same six fields.
- Risu-only extensions (`extensions.risuai`, regex, triggers) have no Xoul analog and should be left empty.

## Recommended field mapping (Xoul → local card)

### Takeaway
Recommended primary mapping: Description → `description`; Advanced Definition → append to `description` (or `personality` if you want a ST two-box split); Intro → `scenario`; Greeting → `first_mes`; Chat Samples → `mes_example` (after delimiter conversion); Custom Prompt → `system_prompt`; Creator Memo → `creator_notes`; tags → `tags`; lorebook → `character_book`. Do **not** dump Advanced Definition into `system_prompt` unless it is actually jailbreak/instructions. Built-in Response Styles (Roleplay/Novel/Realistic) cannot be copied as text.

### Cited Findings
- Official: Description and Advanced Definition are the same kind of text; Advanced is only hidden. Custom Response Style is the system-prompt override. Greeting is the first message. Intro is the premise. Chat Samples teach voice. Creator Memo is not model-read. — [Xoul Creation Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/xouls/xoul-creation-interface.md); [Response Style & Length](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/chat-interface/response-style-and-length.md)
- Charsnap’s documented Xoul import (closest published field-to-field guide): Name/Gender/Age same; Tagline (“Short Description”) → short description (not model-read); Description → Personality (permanent); Greeting → First Message; Creator Memo → Creator Memo; Default Scenario/Intro → Scenario; Advanced Definition → Description (permanent); Chat Samples → Example Messages (but **not** permanent on Charsnap); Community Tags → Category; system prompts that lived in Advanced Definition should move to a dedicated System Prompt field. — [Xoul Import Guide | charsnap](https://charsnap.gitbook.io/charsnap/basics-for-creators/character-creation/xoul-import-guide)
- Wyvern converter: “Backstory is merged with definition”; “Move the System prompt into a special field in the advanced section”; rewrite examples to `{{char}}:` / `{{user}}:`. — [Xoul to Card Converter (r/WyvernChat)](https://www.reddit.com/r/WyvernChat/comments/1k7e3qi/xoul_to_card_converter)
- ST V1: `personality` is a **short summary**, `description` is the main always-included block, `system_prompt` replaces the frontend system prompt. — [V1 spec](https://github.com/malfoyslastname/character-card-spec-v2/blob/main/spec_v1.md); [V2 spec](https://raw.githubusercontent.com/malfoyslastname/character-card-spec-v2/main/spec_v2.md)

**Recommended mapping table**

| Xoul field | ST V2 `data.*` | Agnai | Risu | Pygmalion/Tavern V1 | Notes |
| --- | --- | --- | --- | --- | --- |
| Name | `name` | `name` | `name` | `name` | Direct. Keep Name as a spoken name, not a title, or ST will say the title. |
| Age, Gender | prepend 1 line to `description` | same | same | same | No native fields. |
| Description (public) | `description` (start) | `persona` text | `desc` | `description` | Main permanent definition. |
| Advanced Definition (hidden) | **append to `description`** with a blank line; optionally put a 1–3 sentence extract in `personality` | joined into `persona` | `desc` continuation | `description` continuation | Official: same function as Description. `personality` is spec’d as a **short** summary — stuffing 12k chars there is a spec mismatch. If a block is clearly `SYSTEM:` / jailbreak, split that block to `system_prompt` or `post_history_instructions` instead. |
| Intro / Default Scenario | `scenario` | `scenario` | `scenario` | `scenario` | Overwritten on Xoul when a Scenario card is used; on ST it is permanent unless you use WI. |
| Greeting | `first_mes` | `greeting` | `firstMessage` | `first_mes` | Direct. No Xoul `alternate_greetings`. |
| Chat Samples | `mes_example` | `sampleChat` | `exampleMessage` | `mes_example` | Convert delimiters; add `<START>`. Remember: Xoul keeps samples permanent; ST typically prunes them. If samples contain canon facts, also copy those facts into `description`. |
| Custom Response Style | `system_prompt` | character system prompt | `systemPrompt` | n/a (V1) | Full override. Do not put a one-line “write in past tense” here without the rest of a prompt. |
| Built-in Roleplay / Novel / Realistic | *no card field* | n/a | n/a | n/a | Recreate as an ST **preset**. Text is proprietary and not in exports. |
| Override Default Formatting | encode in `system_prompt` or rely on samples | same | same | same | No boolean on cards. |
| Creator Memo | `creator_notes` | creator notes | `creatorNotes` | n/a | Not sent to the model (V2 MUST NOT). |
| Tagline | optional prefix on `creator_notes`, or unused | unused | unused | unused | Not model-read; ST has no tagline. |
| Tags (max 7) | `tags` | tags | tags | n/a | |
| Handle | V3 `source[]` or `extensions.xoul.handle` | extensions | extensions | n/a | |
| Creator username | `creator` | creator | creator | n/a | |
| Icon | PNG card image; V3 `assets` type `icon` | avatar | avatar / assets | PNG | Download `icon_url` while the CDN lives. |
| Voice | `extensions` (e.g. namespaced voice id) | Agnai voice ext | Risu voice | n/a | Not in V2 spec. |
| Lorebook(s) | `character_book` (merge up to 3 books) | lorebook | `globalLore` | n/a | See lorebook subsection. |
| Persona | **not on the character card** — ST User Persona | Agnai persona | Risu persona | user name only | |
| Scenario card | `scenario` + maybe `system_prompt` + group extras | scenario | scenario | `scenario` | Meters/objectives/familiarity do not map. |
| Memories | ST Author’s Note / `chat_metadata.note_prompt` | memory | note | n/a | Per-chat, not card. |
| Talkativeness | ST group `talkativeness` / `extensions` | n/a | n/a | n/a | Chat snapshot includes `talkativeness: 0.5`. |

**Worked local-card assembly (V2 JSON skeleton)**

```json
{
  "spec": "chara_card_v2",
  "spec_version": "2.0",
  "data": {
    "name": "<Xoul Name>",
    "description": "<Age/Gender one-liner>\n\n<Description>\n\n<Advanced Definition>",
    "personality": "",
    "scenario": "<Intro / Default Scenario>",
    "first_mes": "<Greeting>",
    "mes_example": "<START>\n{{user}}: …\n{{char}}: …",
    "creator_notes": "<Tagline>\n\n<Creator Memo>",
    "system_prompt": "<Custom Response Style, if any>",
    "post_history_instructions": "",
    "alternate_greetings": [],
    "tags": ["<up to 7 Xoul tags>"],
    "creator": "<Xoul creator handle>",
    "character_version": "xoul-export",
    "extensions": {},
    "character_book": { "name": "<lorebook title>", "entries": [] }
  }
}
```

Charsnap’s Description→Personality / Advanced Definition→Description split is a valid **alternative** if the destination UI treats Personality as a large permanent box. For spec-correct ST V2, prefer one concatenated `description`.

### Inferences
- The assignment’s suggested mapping (Description→description, Advanced Definition→personality or system_prompt, Chat Samples→mes_example, Greeting→first_mes, Custom Prompt→system_prompt, lorebook→character_book) is directionally right, with two corrections: (1) Advanced Definition is **not** a system prompt by spec of Xoul — only Custom Response Style is; (2) ST `personality` is a short summary, so a large Advanced Definition belongs in `description` unless you are targeting a frontend (Charsnap-like) that treats Personality as a second full definition box.

### Gaps
- No official Xoul→ST mapping from Xoul.AI.
- Built-in Response Style prompt text is unpublished; Novel/Roleplay/Realistic cannot be reconstructed verbatim.

## Export zip JSON shape (mefriend, Reddit, converters)

### Takeaway
The documented zip is a foldered dump of **the account’s own** content plus **the account’s chats**. There is no official JSON schema. Community samples show chat files as one JSON object with nested `xouls[]`, `personas[]`, and `messages[]` (`role`/`content`/`timestamp`). Owned Xoul files are per-handle `.xo` JSON. Converters exist (mefriend import, SOX, Wyvern) but disagree on backstory vs definition.

### Cited Findings
- Zip folders (mefriend): `chats_single` (1:1 chats), `personas`, `xouls` (Xouls you created), `scenarios`, `assets` (lorebooks). Missing folders mean unused features. — [mefriend Xoul integration guide](https://docs.mefriend.ai/xoul_integration_guide__2025_04_22)
- Reddit ST-import guide also names `chats_multi`. Exported Xouls are saved under the `.xo` handle, not the display name. — [Importing XOUL Chats into SillyTavern](https://www.reddit.com/r/XoulAI/comments/1l452g7/importing_xoul_chats_into_sillytavern); [Xoul Conversation export](https://www.reddit.com/r/XoulAI/comments/1k4u740/xoul_conversation_export/)
- Chat JSON snapshot (community dummy, `chats_single`):

```json
{
  "xouls": [{
    "slug": "slugname.xo",
    "name": "Some Name",
    "icon_url": "someurl",
    "voice_id": "phwjJOglQ9KN6V1CnF5B",
    "talkativeness": 0.5,
    "tagline": "A hopelessly positive, deredere mom...",
    "age": 39,
    "bio": "blahblahblah",
    "backstory": "BlahBlah",
    "gender": "female",
    "samples": "BlahBlahBlah"
  }],
  "personas": [{
    "slug": "96c44245-0818-42e6-b2b2-3319a14bb824",
    "name": "Anon",
    "icon_url": "https://user-images.prod.xoul-media.com/images/….png",
    "prompt": "unknown",
    "user_slug": "ffsggs",
    "gender": "male",
    "privilege": "ADMIN"
  }],
  "messages": [{
    "role": "assistant",
    "content": "FIRST MESSAGE OF THE WHOLE CHAT HISTORY",
    "name": null,
    "turn_id": 0,
    "timestamp": "2025-04-16T11:25:40.843000Z",
    "metadata": null
  }]
}
```

— [Importing XOUL Chats into SillyTavern](https://www.reddit.com/r/XoulAI/comments/1l452g7/importing_xoul_chats_into_sillytavern)

- Wyvern converter (owned cards): treats **backstory** and **definition** as the two definition halves and merges them; tells users to move system prompt to ST’s system-prompt field. — [Xoul to Card Converter](https://www.reddit.com/r/WyvernChat/comments/1k7e3qi/xoul_to_card_converter)
- mefriend importer consumes those folders but does **not** publish per-file key names. — [mefriend Xoul integration guide](https://docs.mefriend.ai/xoul_integration_guide__2025_04_22)
- SOX Project: convert export → ST, including chat history (single and multi), plus a JSON V2 card tool; advanced fields absent from non-owned snapshots. — [SOX Project](https://www.reddit.com/r/XoulAI/comments/1k9c04h/save_our_xouls_sox_project_create_your_own_mini)

**Provisional key mapping for chat snapshots (not official)**

| Snapshot key | Likely Xoul UI field | Confidence |
| --- | --- | --- |
| `name` | Name | High |
| `slug` | Handle (`*.xo`) | High |
| `age`, `gender` | Age, Gender | High |
| `tagline` | Tagline | High |
| `icon_url` | Icon CDN URL | High |
| `voice_id` | Voice (ElevenLabs-style id in the sample) | Medium |
| `talkativeness` | Group talkativity (0–1) | High (group-chat docs use the same concept) |
| `bio` | Creator Memo (officially displayed as Bio) **or** Description | Low–medium; naming collision |
| `backstory` | Description **or** Intro | Low–medium; Wyvern’s “backstory merged with definition” suggests Description |
| `samples` | Chat Samples | Medium (key exists; may be empty for others’ Xouls) |
| persona `prompt` | Persona Description | Medium |
| persona `name`/`gender`/`icon_url` | Persona fields | High |

### Inferences
- Implementers should detect **owned** `xouls/*.json` vs **chat snapshots** and refuse to claim a full card from the latter.
- `icon_url` hosts on `user-images.prod.xoul-media.com` are not guaranteed to remain; a converter should download bytes at export time.

### Gaps
- **No official export JSON schema.** mefriend lists folders only. Wyvern/SOX/Reddit samples are the only field-level evidence, and they conflict on `bio` vs `backstory` vs `definition`.
- Unknown keys likely present in owned Xoul JSON: greeting, intro/default scenario, custom prompt, lorebook ids, visibility, tags, language, override-formatting flag. Not observed in the chat-snapshot dummy.
- Unknown whether images are embedded or URL-only.
- Unknown `chats_multi` schema (probably `xouls[]` length > 1 plus talkativeness).

## Chat transcripts → SillyTavern JSONL / backups

### Takeaway
Map each Xoul `messages[]` item to one ST JSONL message line. `role: "user"` → `is_user: true` with the persona name; `role: "assistant"` → `is_user: false` with the Xoul name; `content` → `mes`; `timestamp` → `send_date`. Prefix the file with an ST header object. This preserves readable history; it does not preserve Xoul Memories, regen swipes, pinned lorebook hits, or energy/model metadata unless stuffed into `extra`.

### Cited Findings
- Xoul chat messages (community sample): `role` (`assistant`/`user`), `content`, `name` (often null), `turn_id`, `timestamp` (ISO-8601 with `Z`), `metadata`. First assistant `content` is the greeting / first history message. — [Importing XOUL Chats into SillyTavern](https://www.reddit.com/r/XoulAI/comments/1l452g7/importing_xoul_chats_into_sillytavern)
- ST JSONL header (line 0) typically includes `user_name`, `character_name`, `create_date`, `chat_metadata` (integrity, note_prompt, attachments, variables). — [SillyTavern DeepWiki](https://deepwiki.com/SillyTavern/SillyTavern)
- ST message line: `name`, `is_user`, `is_system`, `send_date`, `mes`, optional `swipes`/`swipe_id`/`swipe_info`, `extra` (`api`, `model`, `token_count`, `media`, …), `force_avatar`. — [SillyTavern chat storage](https://deepwiki.com/SillyTavern/SillyTavern/5.2-vector-search)
- ST already has importers for Ooba, Agnai, CAI that follow this header+messages pattern (Agnai: `message.userId` ⇒ user; `message.msg` ⇒ `mes`). — [SillyTavern PR #4806](https://github.com/SillyTavern/SillyTavern/pull/4806/commits/862bb14f3e4a22b92bde03e3979b30f95d7040c4)
- Group chats: up to 8 Xouls; talkativity 0.00–1.00; auto vs manual speaker. Multi-user: up to 8 users. Export includes `chats_multi`. ST stores group chats under `group chats/` with `force_avatar` / per-message `name`. — [(Group) Chats & Multi-User Chats](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/group-chats-and-multi-user-chats); [mefriend guide](https://docs.mefriend.ai/xoul_integration_guide__2025_04_22)

**Recommended ST JSONL conversion**

Line 0:

```json
{"user_name":"<persona.name>","character_name":"<xoul.name>","create_date":"<first timestamp>","chat_metadata":{"note_prompt":"<Xoul Memories if present>","integrity":"<new uuid>"}}
```

Each following line:

```json
{"name":"<persona.name or xoul.name>","is_user":true,"is_system":false,"send_date":"<ISO timestamp>","mes":"<content>","extra":{"xoul_turn_id":0}}
```

- `role == "user"` ⇒ `is_user: true`, `name` = persona name (snapshot `personas[0].name`).
- `role == "assistant"` ⇒ `is_user: false`, `name` = matching Xoul name (group: use `messages[].name` if non-null, else `xouls[0].name`).
- Do not emit ST `swipes` unless the export actually contains regen variants (not seen in the dummy).
- ST backups are just copies of the same JSONL; writing `chats/<Character Name>/<Character Name> - <timestamp>.jsonl` is enough for ST to list the chat.

### Inferences
- A converted chat can continue in ST **only if** a character card exists for that name. For others’ Xouls, build a partial card from the snapshot first (SOX behavior).
- Putting Xoul Memories into `chat_metadata.note_prompt` is the closest ST analog (Author’s Note), not a card field.

### Gaps
- Dummy `messages[].name` is `null`; unknown how group-chat speaker identity is stored (`metadata`? parallel array?).
- Unknown whether Xoul stores regenerated alternatives (ST swipes) or only the kept message.
- Unknown whether Memories, pinned lorebook hits, meters, or selected model/energy are in the chat JSON.
- `send_date` in ST has historically been a humanized string; newer ST uses ISO. Either is accepted by current importers.

## Lorebooks, personas, scenarios (how they sit relative to a card)

### Takeaway
On Xoul these are **separate objects** that compile into one prompt. On ST, persona is a user profile, scenario is a card field (or a separate “scenario card” workaround), and lorebooks become World Info / `character_book`. Xoul lorebooks are keyword+RAG with a hard 3-entry inject cap; ST World Info is keyword/constant/recursive with a token budget — similar idea, different engine.

### Cited Findings
- Official comparison: Xoul = actor (12k/17k); Persona = your role (1k/2k); Scenario = premise (3k); Lorebook = stage/props (up to 750 entries, only 3 injected). — [Lorebooks](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/lorebooks.md)
- Lorebook entry fields: Name (not in prompt), Keywords (at least one; not case-sensitive; basic plurality), Content (verbatim when pulled), Type (Character/Location/Object/Event — organizational only). — [Lorebooks](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/lorebooks.md); [Lorebook | Fandom](https://xoul-ai.fandom.com/wiki/Lorebook)
- ST `character_book` / World Info: `keys` ← keywords split on commas; `content` ← entry content; `comment` ← entry name; `constant` has no Xoul equivalent (Xoul never “always on” except by putting text in the Xoul); `selective`/`secondary_keys` unused; RAG has no ST equivalent without extensions. — [V2 spec](https://raw.githubusercontent.com/malfoyslastname/character-card-spec-v2/main/spec_v2.md)
- Personas: not played by the model; keep them surface-level. ST user personas are the correct destination, not `description`. — [Personas](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/profile-page/personas.md)
- Scenario System Prompt overrides Xoul custom prompts. Scenario Advanced Definition is hidden. Embedded Xoul count locks single vs group chat. — [Scenarios](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/scenarios.md); [Scenario Creation Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/scenarios/scenario-creation-interface.md)

**Lorebook entry conversion**

| Xoul | ST World Info / `character_book.entries[]` |
| --- | --- |
| Name | `comment` / `name` (not prompted on Xoul; ST `comment` also not prompted) |
| Keywords (comma/phrase list) | `keys` (split) |
| Content | `content` |
| Type | unused, or `extensions.xoul.type` |
| (none) | `enabled: true`, `insertion_order: 100`, `constant: false` |
| RAG fallback | no mapping; ST will not pull by semantics unless a vector extension is used |

If a Xoul has three attached lorebooks, merge entries into one `character_book` (or one ST world file plus two extra WI files). Warn that ST may inject **many more** entries than Xoul’s 3-entry cap.

### Gaps
- Export key names for lorebook entries inside `assets/` are unpublished.
- No mapping for Scenario Meters/Objectives into ST (closest hack: Author’s Note + WI).

## Lossiness (voices, images, group chats, memory, energy-gated models, and other non-card features)

### Takeaway
A local card can carry identity, definition, greeting, samples, custom prompt, tags, notes, icon, and a lorebook. It cannot carry Xoul voices, live CDN images, group-chat talkativity, per-chat Memories, scenario meters, proprietary Response Style text, energy-gated hosted models, or RAG. Chat history can be approximated in JSONL.

### Cited Findings
- Icon is required on Xoul but **unseen** by the model; voice is **unheard**. Local cards use the image as avatar only. — [Xoul | Fandom](https://xoul-ai.fandom.com/wiki/Xoul)
- Voice playback and custom voice creation cost Cells; `voice_id` in snapshots looks like an ElevenLabs id. Community FAQ: VC used ElevenLabs and did not even read Advanced Definition. — [Energy, Cells & Streaks](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/subscriptions/energy-cells-and-streaks); [FAQ : XoulAI](https://www.reddit.com/r/XoulAI/comments/1htz3sj/faq/)
- Group chats: 8 Xouls, talkativity, narrator+solo pattern. ST has group chats but they are a separate file type (`groups/*.json` + `group chats/*.jsonl`), not a field on one card. V3 `group_only_greetings` is unused on Xoul (one greeting per scenario). — [(Group) Chats](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/group-chats-and-multi-user-chats); [SPEC_V3](https://cdn.jsdelivr.net/gh/kwaroran/character-card-spec-v3@main/SPEC_V3.md)
- Memories: 5000 characters, per chat, permanent in that chat’s prompt. Not part of the Xoul card. — [Memories Field](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/chat-interface/memories-field)
- Energy-gated models: Bacchus 1 energy, Jupiter V2 3, Infinity V3 5 (docs; site FAQ also says Infinity 6 for free/green). Green: unlimited Jupiter. Purple/Gold: unlimited energy / all models. Gold: 17k definition. Local ST uses whatever backend the user configures; Xoul model “feel” is not on the card. Proxy on Xoul **drops** Xoul Response Styles “because proxies can leak this information.” — [Energy, Cells & Streaks](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/subscriptions/energy-cells-and-streaks); [Chat Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/chat-interface.md); [xoul.ai FAQ](https://xoul.ai/faq); [Custom Engine (Proxy)](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/chat-interface/custom-engine-proxy.md)
- Macro mismatch: Xoul `xoul` / `user` (including substring `user`) vs ST `{{char}}` / `{{user}}` only. — [Xoul Creation Guide](https://rentry.co/XoulCreationGuide)
- Sample permanence mismatch: Xoul permanent vs ST pruned. — [V1 spec](https://github.com/malfoyslastname/character-card-spec-v2/blob/main/spec_v1.md); [charsnap import guide](https://charsnap.gitbook.io/charsnap/basics-for-creators/character-creation/xoul-import-guide)
- Scenario meters/objectives, Override Default Formatting, visibility/unlisted, handle uniqueness, language, post-to-Xoul toggle: no ST card fields.
- Images: Xoul forbids explicit public images; ST cards often embed NSFW avatars. Policy, not a technical field.

**Lossiness checklist**

| Feature | On local card? | Workaround |
| --- | --- | --- |
| Description | Yes | `description` |
| Advanced Definition | Yes **if you own the Xoul** | append to `description` |
| Chat Samples | Partial | `mes_example` + delimiter conversion; permanence differs |
| Greeting | Yes | `first_mes` |
| Intro | Yes | `scenario` |
| Custom Prompt | Yes if present in **owned** export | `system_prompt` |
| Roleplay/Novel/Realistic presets | No | pick an ST preset |
| Tags / creator notes | Yes | `tags` / `creator_notes` |
| Age / Gender fields | No dedicated | one-liner in `description` |
| Icon | Partial | embed PNG; CDN may die |
| Voice | No | ST TTS extensions, new voice |
| Lorebook RAG + 3-entry cap | Partial | WI keywords; expect over-injection |
| Persona | Separate ST object | User Persona |
| Scenario meters / objectives | No | Author’s Note |
| Group talkativity / 8-bot rooms | Partial | ST group chat |
| Memories | No (not on card) | Author’s Note on that chat |
| Hosted models / energy | No | user-supplied API/local model |
| Alternate greetings | Xoul has none | leave `[]` |
| `post_history_instructions` | Xoul has none | leave `""` unless splitting jailbreak out of Advanced Definition |

### Inferences
- Calling a conversion “lossless” would be false even for an owned Xoul with a full `xouls/` JSON, because voices, preset system prompts, RAG, meters, and hosted models do not exist on V2/V3 cards.
- For **other people’s** Xouls, the honest product is a **partial public reconstruction**, not a clone.

### Gaps
- No published owned-Xoul JSON to confirm that Custom Prompt, Greeting, Intro, and lorebook attachments are actually in `xouls/` files (community converters imply definition/backstory/samples/system prompt are).
- Infinity energy cost disagrees between GitBook (5) and xoul.ai FAQ (6).
- Whether relaunch-era exports still match the April 2025 zip layout is not independently verified in this pass (mefriend and Reddit describe the shutdown export; official GitBook does not currently document Export).
