# Xoul AI frontend, private REST API, auth, and programmatic access

Research date: 2026-09-22. Method: fetch public HTML/JS/well-known files and unauthenticated HTTP against `xoul.ai` / `api.xoul.ai` / `auth.xoul.ai` / `voice.xoul.ai`. No login, no credential stuffing, no exploit payloads. JS strings and live JSON below are quoted from those public resources.

## What is the frontend stack, and which hosts does the product talk to?

### Takeaway
The website is a **Next.js 15 App Router** app on **Vercel**, fronted by **Cloudflare**. The product backend is a separate **FastAPI/uvicorn** REST service on **AWS ELB** at `https://api.xoul.ai`, plus Auth0 at `https://auth.xoul.ai`, a voice/WebRTC host at `https://voice.xoul.ai`, and media on `user-images.prod.xoul-media.com`. Native iOS/Android apps exist (`xoul://`).

### Cited Findings
- Homepage response headers: `x-powered-by: Next.js`, `x-vercel-id`, `x-vercel-cache: MISS`, `Server: cloudflare`, `cf-cache-status: BYPASS`, `strict-transport-security: max-age=63072000`. HTML loads `/_next/static/chunks/webpack-*.js`, `main-app-*.js`, and `app/(sidebarLayout)/(explore)/page-*.js`. — [https://xoul.ai/](https://xoul.ai/)
- Client env object in `main-app` (Sentry Next.js `15.5.11`, release `a349677adf7877cecf49625bc28f66c97b9b6876`): `WEBSITE_URL:"https://xoul.ai"`, `VERCEL_URL:"mono-7nff4drqp-xoul.vercel.app"`, `CLOUDFLARE_ENDPOINT:"https://user-images.prod.xoul-media.com"`, `REST_API_ENDPOINT:"https://api.xoul.ai"`, `OFFER_API_ENDPOINT:"https://voice.xoul.ai"`, `SENTRY_DSN:"https://af44535017139aed4393dd9103197184@o4507272699838464.ingest.us.sentry.io/4507371129667584"`, `INTERCOM_APP_ID:"igbsrifq"`, `REVENUE_CAT_API_KEY:"rcb_cnNSipINaqpJPuqycrQQaPJmFlLr"`, `AUTH0_CLIENT_ID:"zsD5lpXvjWpPSWjtiIcRIg4tym7the3u"`, `AUTH0_ISSUER:"https://auth.xoul.ai"`, `AUTH0_AUDIENCE:"https://xoul-api.com"`, `ICE_SERVER_URL:"k8s-stun-stunnerg-65ea673cfa-fa04b1c29086c211.elb.us-east-2.amazonaws.com:3478"` with `ICE_SERVER_USERNAME:"stunneruser"`. — [https://xoul.ai/_next/static/chunks/main-app-204af47630fd44b0.js](https://xoul.ai/_next/static/chunks/main-app-204af47630fd44b0.js)
- HTML also preloads Google Analytics `G-0W20EBR1FE`, PWA `manifest.json`, and `user-images.prod.xoul-media.com`. Apple Smart App Banner: `app-id=6673608916, app-argument=xoul://`. — [https://xoul.ai/](https://xoul.ai/)
- Sentry route manifest (same `main-app` chunk) lists App Router paths including `/xoul/:slug`, `/xoul/:slug/edit`, `/scenario/:slug`, `/chats/@chat/:id`, `/chats/@chat/gp/:id`, `/chats/@chatlist`, `/profile/:username`, `/create/xoul`, `/create/lorebook`, `/settings/account`, `/auth/password-protection`, `/deep-link`. — [main-app chunk](https://xoul.ai/_next/static/chunks/main-app-204af47630fd44b0.js)
- `robots.txt`: `Allow: /`, `Disallow: /api`, sitemap `https://xoul.ai/sitemap_index.xml` (only `sitemap/statics.xml` with `/`, `/create`, `/faq`, `/privacy`, `/terms-of-service`; `sitemap/writings.xml` is empty). No `security.txt`. — [https://xoul.ai/robots.txt](https://xoul.ai/robots.txt); [https://xoul.ai/sitemap_index.xml](https://xoul.ai/sitemap_index.xml)
- iOS Universal Links: appID `WSBXS677G6.ai.xoul.xoulapp`, path `/api/auth/callback-mobile`. Android Digital Asset Links: package `ai.xoul.android`. PWA name `"Xoul"`, `display: standalone`. — [https://xoul.ai/.well-known/apple-app-site-association](https://xoul.ai/.well-known/apple-app-site-association); [https://xoul.ai/.well-known/assetlinks.json](https://xoul.ai/.well-known/assetlinks.json); [https://xoul.ai/manifest.json](https://xoul.ai/manifest.json)
- GitHub org `xoul-ai` (https://xoul.ai, `info@xoul.ai`) has only four public repos: `.github`, `vaul`, forks of `excalidraw` and `aiogoogle`. No API client, OpenAPI spec, or SDK. — [https://github.com/xoul-ai](https://github.com/xoul-ai); [https://api.github.com/orgs/xoul-ai/repos](https://api.github.com/orgs/xoul-ai/repos)
- Homepage JS also initializes **Firebase app** `projectId:"xoul-ai"` (`apiKey:"AIzaSyAsfax8g4Z3acim-pxBPpcMz6OnLEh_1o8"`, `authDomain:"xoul-ai.firebaseapp.com"`, `appId:"1:904801654970:web:bb9c90304155027667ca83"`, `measurementId:"G-G912JLNB7G"`) via a `Firebase` helper — analytics/installations, not the REST client. — [https://xoul.ai/_next/static/chunks/app/layout-932e96f7509f4f2e.js](https://xoul.ai/_next/static/chunks/app/layout-932e96f7509f4f2e.js)
- Other client libraries visible in homepage chunks: TanStack Query, `nuqs` (`NuqsAdapter`), Amplitude, Sentry, Socket.IO client (`io(REST_API_ENDPOINT)`), `@microsoft/fetch-event-source`-style helper (`openWhenHidden:!0`), RevenueCat web (`Authorization: Bearer` to `api.revenuecat.com`), Intercom, js-cookie. Generated OpenAPI client banner: `VERSION:"0.1.0"`, `CREDENTIALS:"include"`. — [https://xoul.ai/_next/static/chunks/7766-0a347041687a43de.js](https://xoul.ai/_next/static/chunks/7766-0a347041687a43de.js); [https://xoul.ai/_next/static/chunks/9213-3f192b875af3a86d.js](https://xoul.ai/_next/static/chunks/9213-3f192b875af3a86d.js)

### Inferences
- Product data does **not** live in Next.js `/api` routes (those 404 as HTML). The SPA is a CORS client of `api.xoul.ai`.
- Firebase in the web bundle is for analytics (and the Google OAuth client id below shares Firebase project number `904801654970`), not a Firestore/Realtime DB API for chats.
- GitHub is not a source of the product API; reverse-engineering has to come from the public JS + live HTTP.

### Gaps
- Native iOS/Android binary protocols were not unpacked (only Universal Links / assetlinks / `xoul://`).
- `JWT_SECRET`, `FERNET_SECRETS`, `SITEMAP_CLIENT_SECRET`, `APP_ACCESS_PASSWORD` appear as keys in the client env object but are assigned from `s.env.*` without `NEXT_PUBLIC_` prefixes; their runtime values in the browser bundle were not confirmed as leaked secrets.

## What is the API base URL and path prefix? REST vs GraphQL vs WebSocket?

### Takeaway
Canonical API: **`https://api.xoul.ai` + `/api/v1/...`**. It is a **FastAPI/uvicorn REST** app behind **AWS ELB** (`awselb/2.0`, `server: uvicorn`). There is **no public OpenAPI/Swagger** on that host. Chat uses **REST + SSE** and a **Socket.IO** connection to the same host. **No GraphQL** strings or `/graphql` routes were found. A second FastAPI host `https://voice.xoul.ai` exposes `/docs` and `POST /offer`.

### Cited Findings
- Generated client concatenates `g.K.REST_API_ENDPOINT` (`https://api.xoul.ai`) with paths like `url:"/api/v1/xoul/{xoul_slug}"`. OpenAPI-style config: `let h={BASE:"",VERSION:"0.1.0",WITH_CREDENTIALS:!1,CREDENTIALS:"include",TOKEN:void 0,...}`. Extra headers: `Accept: application/json`, optional `X-Device-Fingerprint`, `ngrok-skip-browser-warning: true`. — [chunk 7766](https://xoul.ai/_next/static/chunks/7766-0a347041687a43de.js)
- Live probes (2026-09-22):
  - `GET https://api.xoul.ai/` → **404** `Server: awselb/2.0`, empty body
  - `GET /health`, `/docs`, `/redoc`, `/openapi.json` → **404** awselb
  - `GET /api/v1/` → **404** uvicorn JSON `{"detail":"Not Found"}` plus `Set-Cookie: AWSALB=...; Path=/`
  - `GET /api/v1/catalog/feed?...` → **200** JSON array
  - `GET /api/v1/preferences/` → **403** `{"detail":"Missing authentication credentials."}`
- CORS preflight `OPTIONS https://api.xoul.ai/api/v1/catalog/feed` with `Origin: https://xoul.ai` and `Access-Control-Request-Headers: authorization,content-type` → **200** `OK`, `access-control-allow-origin: https://xoul.ai`, `access-control-allow-credentials: true`, `access-control-allow-methods: DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT`, `access-control-max-age: 600`, `access-control-allow-headers: authorization,content-type`. — live OPTIONS to [api.xoul.ai](https://api.xoul.ai/api/v1/catalog/feed)
- Same GET with `Origin: https://evil.example` returned the JSON body **200** but **no** `Access-Control-Allow-Origin` (browser would hide it). OPTIONS from that origin returned **400**. — live probe
- urlscan of the production homepage (2025-10-12) already showed `api.xoul.ai` as uvicorn on `18.224.186.89` (us-east-2), CORS `https://xoul.ai` + credentials, and request headers `ngrok-skip-browser-warning`, `x-device-fingerprint`. — [urlscan.io result 0199d7dd-9b85-720a-8fbd-17afc80f9268](https://urlscan.io/result/0199d7dd-9b85-720a-8fbd-17afc80f9268/)
- `GET https://api.xoul.ai/socket.io/?EIO=4&transport=polling` → **200** `0{"sid":"...","upgrades":["websocket"],"pingTimeout":20000,"pingInterval":25000,"maxPayload":1000000}`. Client: `(0,n.io)(r.K.REST_API_ENDPOINT,{autoConnect:!1,withCredentials:!0,...,transports:[a.Fp,a.kb]})`. — live probe; [sidebar layout chunk](https://xoul.ai/_next/static/chunks/app/(sidebarLayout)/layout-faa5b842f3cd4512.js)
- Voice host: `GET https://voice.xoul.ai/docs` is FastAPI Swagger UI; `GET https://voice.xoul.ai/openapi.json` is OpenAPI 3.1 with path `POST /offer` (query `fingerprint`). CORS `*` + credentials on 404s. — [https://voice.xoul.ai/openapi.json](https://voice.xoul.ai/openapi.json)
- Homepage JS search found **no** `graphql`, `supabase` API URLs, `clerk`, or `wss://` literals besides Socket.IO’s upgrade. — local grep of downloaded `/_next/static/chunks/*.js` from [https://xoul.ai/](https://xoul.ai/)

**Generated `/api/v1` paths in chunk 7766 (complete list observed):**

Auth: `/api/v1/auth/idp/authorize`, `/api/v1/auth/idp/callback`, `/api/v1/auth/login`, `/api/v1/auth/signup`, `/api/v1/auth/password_reset`, `/api/v1/auth/password_reset/{token}`, `/api/v1/auth/verify/{token}`, `/api/v1/auth/session`, `/api/v1/auth/sessions`, `/api/v1/auth/whoami`, `/api/v1/auth/noop`

Xouls: `/api/v1/xoul`, `/api/v1/xoul/sfind`, `/api/v1/xoul/slist`, `/api/v1/xoul/facets`, `/api/v1/xoul/rep`, `/api/v1/xoul/adj`, `/api/v1/xoul/disable`, `/api/v1/xoul/{xoul_slug}`, `/api/v1/xoul/{xoul_slug}/admin`, `/api/v1/xoul/{xoul_slug}/admin/clone`, `/api/v1/xoul/{xoul_slug}/availability`, `/api/v1/xoul/{xoul_slug}/favorite`, `/api/v1/xoul/{xoul_slug}/ratings`, `/api/v1/xoul/{xoul_slug}/blocks/{scenario_slug}`

Chats: `/api/v1/chat/send`, `/api/v1/chat/stop`, `/api/v1/chat/regenerate`, `/api/v1/chat/history`, `/api/v1/chat/delete`, `/api/v1/chat/edit`, `/api/v1/chat/rewind`, `/api/v1/chat/branch`, `/api/v1/chat/clone`, `/api/v1/chat/report`, `/api/v1/chat/llm_metadata`

Conversations: `/api/v1/conversation` (POST create), `/api/v1/conversation/list`, `/api/v1/conversation/details`, `/api/v1/conversation/delete`, `/api/v1/conversation/update`, `/api/v1/conversation/update_xouls`, `/api/v1/conversation/manual-memory`, `/api/v1/conversation/call`, `/api/v1/conversation/call-charge`

Also: catalog, scenario, persona, asset (lorebooks), post, folder, follow, engine (custom proxy), media, voice, preferences, prompt/*, subscription/stripe/*, user/self/*, metadata/languages, metadata/models. **No `/api/v1/export` in this client.** — [chunk 7766](https://xoul.ai/_next/static/chunks/7766-0a347041687a43de.js)

### Inferences
- Treat `https://api.xoul.ai/api/v1` as the only product API prefix. `https://xoul.ai/api/...` is a Next.js 404 (except the mobile applinks path, which currently also 404s as HTML).
- CORS is origin-locked to `https://xoul.ai` with cookies. Non-browser clients are not blocked by CORS (CORS is a browser rule); they still need whatever cookie/header the API checks.

### Gaps
- Full OpenAPI schema (request body field lists for every POST) is not published; only paths + a few query/body keys recovered from minified JS and 422 validation errors.
- Exact Socket.IO namespace/event names beyond Avro payload types (below) were not fully de-minified.

## How is authentication done? (cookies vs Bearer JWT vs third-party IdP)

### Takeaway
Browser sessions are **cookie-authenticated cross-origin requests** (`credentials: "include"`) to `api.xoul.ai`. Login is **first-party email/password** plus **OAuth** (`google.com`, `apple.com`, `twitter.com`, `oidc.discord`) that redirects through `GET /api/v1/auth/idp/authorize` to the IdP and back to `https://api.xoul.ai/api/v1/auth/idp/callback`. An **Auth0** tenant exists at `https://auth.xoul.ai` (OIDC discovery + public client id), but the observed web social login 307s went **directly to Google/Apple/Twitter/Discord**, not to `auth.xoul.ai/authorize`. Unauthenticated private routes return FastAPI `{"detail":"Missing authentication credentials."}`. Dummy `Authorization: Bearer` produced **500**, so a Bearer header is parsed but is not how the SPA authenticates.

### Cited Findings
- OpenAPI client default: `CREDENTIALS:"include"`, `TOKEN:void 0`. Clone/admin fetch: `fetch(REST_API_ENDPOINT+"/api/v1/xoul/"+slug+"/admin/clone",{method:"POST",credentials:"include"})`. SSE helper: `credentials:"include"`. Socket.IO: `withCredentials:!0`. — [chunk 7766](https://xoul.ai/_next/static/chunks/7766-0a347041687a43de.js); [explore layout](https://xoul.ai/_next/static/chunks/app/(sidebarLayout)/(explore)/layout-8cdf709115678654.js); [9213](https://xoul.ai/_next/static/chunks/9213-3f192b875af3a86d.js); [sidebar layout](https://xoul.ai/_next/static/chunks/app/(sidebarLayout)/layout-faa5b842f3cd4512.js)
- Login URL builder: `new URL("/api/v1/auth/idp/authorize", REST_API_ENDPOINT)` with `success_url` (`is_auth_redirect=true`), `failure_url` (`open_login=true`), optional `provider`. Query `?open_login=true` is a `nuqs` flag on the homepage. — [sidebar layout](https://xoul.ai/_next/static/chunks/app/(sidebarLayout)/layout-faa5b842f3cd4512.js); [https://xoul.ai/?open_login=true](https://xoul.ai/?open_login=true)
- `GET /api/v1/auth/idp/authorize` without params → **422** `provider` and `success_url` required. With `provider=google` → **422** enum: `'google.com', 'twitter.com', 'apple.com' or 'oidc.discord'`. — live probe
- `GET /api/v1/auth/idp/authorize?provider=google.com&success_url=https://xoul.ai/&failure_url=...` → **307** `Location: https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=904801654970-27imh9dutfqkj3892okctf7hlt1mcf2j.apps.googleusercontent.com&redirect_uri=https://api.xoul.ai/api/v1/auth/idp/callback&state=...`. Apple: `client_id=ai.xoul.xoul.app`, same FastAPI `redirect_uri`. Discord: `client_id=1242241998753366146`. Twitter: `https://api.twitter.com/oauth/authenticate?oauth_token=...`. Set-Cookie on these 307s was only `AWSALB` / `AWSALBCORS` (ALB stickiness, `SameSite=None; Secure` on the CORS variant). — live probe (no follow)
- Email/password: `POST /api/v1/auth/login` and `POST /api/v1/auth/signup` with empty JSON → **422** missing body fields `email` and `password`. Login modal copy includes Email, Password, Forgot Password, “sent a magic link to your email”, Reset Password. Password zod: min 8, upper, lower, digit, special. Cookie schema `UC`: `{email: string, has_password: boolean, site_permissions: string[]}`. Frontend reads `js-cookie` key **`xoul_backend_userinfo`**, queryKey `user-info-cookie`, then `GET /api/v1/user/self` as `userProfile`. Logout: `DELETE /api/v1/auth/session`. Guest pref cookie `xoul_guest_gender_preference` (`expires:365, sameSite:"lax", secure:!0`). — [chunk 7766](https://xoul.ai/_next/static/chunks/7766-0a347041687a43de.js); [layout 81546 module](https://xoul.ai/_next/static/chunks/app/(sidebarLayout)/layout-faa5b842f3cd4512.js); [app layout LoginModal CSS](https://xoul.ai/_next/static/chunks/app/layout-932e96f7509f4f2e.js)
- `GET /api/v1/auth/whoami` unauthenticated → **200** body `null`. `GET /api/v1/auth/noop` → **204**. `GET /api/v1/auth/sessions` → **403** `{"detail":"Could not find session","error":"unspecified-auth-error"}`. `GET /api/v1/user/self` → **403** `Missing authentication credentials.` — live probes
- Auth0 OIDC at [https://auth.xoul.ai/.well-known/openid-configuration](https://auth.xoul.ai/.well-known/openid-configuration): `issuer: https://auth.xoul.ai/`, `authorization_endpoint: https://auth.xoul.ai/authorize`, `token_endpoint: https://auth.xoul.ai/oauth/token`, `jwks_uri: https://auth.xoul.ai/.well-known/jwks.json`, grants include `authorization_code`, `refresh_token`, `password`, `http://auth0.com/oauth/grant-type/passwordless/otp`, device code. Scopes include `openid`, `email`, `phone`. JWKS is RSA `use: sig`. CORS `*`. `GET https://auth.xoul.ai/` returned the **same Next.js HTML** as xoul.ai (custom domain collision or reverse proxy), while `/.well-known/openid-configuration` is Auth0. — live probes
- `GET /api/v1/user/self` with `Authorization: Bearer not-a-jwt` or a fake JWT → **500** `Internal Server Error` (not the cookie 403). SPA does not set `Authorization` on `api.xoul.ai` (RevenueCat uses Bearer to `api.revenuecat.com` only). — live probe; [RevenueCat chunk](https://xoul.ai/_next/static/chunks/fde08e1f-99c4593415740e28.js)
- Historical shutdown export required a **browser already logged in**; unauthenticated `export/all` returned `{"detail":"Missing authentication credentials."}`; workaround `https://xoul.ai/?open_login=true` then the API URL. Google sign-in users had to log in through that query. — [r/XoulAI export/all](https://www.reddit.com/r/XoulAI/comments/1k4c7x9/if_you_cant_export_your_stuff_through_the_app_but/); [r/XoulAI still can export](https://www.reddit.com/r/XoulAI/comments/1k6sc9y/for_all_xoul_users_who_forgot_to_export_their/)

### Inferences
- Effective web auth for `api.xoul.ai` is a **session cookie on the API host** (HttpOnly likely; not seen on unauthenticated responses except AWSALB) plus a **non-HttpOnly `xoul_backend_userinfo` cookie on `xoul.ai`** for the SPA. Cross-site credentialed CORS is why ALB sets `AWSALBCORS` with `SameSite=None; Secure`.
- Social login is **authorization-code OAuth with the FastAPI app as client** (`redirect_uri=https://api.xoul.ai/api/v1/auth/idp/callback`). Auth0 is configured (audience `https://xoul-api.com`) and may mint/validate JWTs server-side or serve mobile; it is **not** the 307 target of the web Google button in this probe.
- Email/password is a first-party JSON API, not Auth0 Universal Login in the observed client.
- A standalone CLI cannot “just send a Xoul API key”: there is no documented user API key. It must either complete OAuth/password login or **replay the session cookie** copied from a logged-in browser.
- Phone OTP is advertised in Auth0 grant types and older Reddit login UI (“Continue with Phone Number”), but the **current authorize enum has no phone provider**.

### Gaps
- Session cookie **name**, `HttpOnly`/`SameSite` flags, and JWT vs opaque session were not observed (would appear only after a completed login).
- Whether Auth0 access tokens are stored and sent as Bearer for mobile (`/api/auth/callback-mobile`) was not verified.
- Magic-link vs password-reset vs Auth0 passwordless was not fully traced (UI copy mentions a magic link; API has `/auth/verify/{token}` and `/auth/password_reset`).

## Which endpoints return a single chat, a chat list, a xoul definition, and a public xoul profile?

### Takeaway
**Public catalog/profile/definition** are unauthenticated REST GETs. **Chat list, chat history, conversation details, send, and owner-admin xoul** require the session (`403 Missing authentication credentials`). Streaming send is SSE POST, not a simple JSON GET.

### Cited Findings

#### Public xoul profile / definition (no login)
- Page route: `https://xoul.ai/xoul/{slug}` (e.g. `https://xoul.ai/xoul/YukiOnnaMif.xo`) returns Next.js HTML. OG tags and slug appear; **`definition` / `backstory` / samples text are not in the HTML**. Client fetches the API. — [https://xoul.ai/xoul/YukiOnnaMif.xo](https://xoul.ai/xoul/YukiOnnaMif.xo); [https://xoul.ai/xoul/NarratorNPC.xo](https://xoul.ai/xoul/NarratorNPC.xo)
- `GET https://api.xoul.ai/api/v1/xoul/{xoul_slug}` → **200** full card. Example keys from `YukiOnnaMif.xo` / `NarratorNPC.xo` / `Ashley.Gravess.xo`:

  `icon_spec`, `bio`, `backstory`, `backstory_spec`, **`definition`**, `default_scenario`, **`samples`**, `greeting`, `chat_preset`, `lorebook_slugs`, **`system_prompt`**, `allow_community_posts`, `default_engine`, `custom_formatting`, `visibility`, `voice`, `voice_preview_text`, `voice_preview_url`, `name`, `gender`, `age`, `icon_url`, `background_url`, `tagline`, `social_tags`, `language`, `slug`, `creator_slug`, `created_at`, `updated_at`, `version_no`, `n_conversations`, `n_stars`, `token_likes`, `lorebooks`

  Client method: `xoulRead(slug)` GET `/api/v1/xoul/{xoul_slug}`. Missing slug (valid length) → **404** `{"detail":"Item no-such-xoul.xo not found.","error":"item-not-found"}`. Slug max 30 chars (422 `string_too_long`). — live GET [https://api.xoul.ai/api/v1/xoul/NarratorNPC.xo](https://api.xoul.ai/api/v1/xoul/NarratorNPC.xo); [chunk 7766](https://xoul.ai/_next/static/chunks/7766-0a347041687a43de.js)
- Listing (no `definition`/`backstory`):
  - `GET /api/v1/catalog/feed?kinds=xoul&sort=created_at_desc|interactions_desc|hot_desc|...&limit=&filter_language=` → array of `{kind, slug, title, description, icon_url, social_tags, created_at, updated_at, favorited_at, num_favorites, num_interactions}`. Invalid `sort` 422 lists enum: `created_at_asc`, `created_at_desc`, `edited_at_asc`, `edited_at_desc`, `interactions_desc`, `hot_desc`.
  - `GET /api/v1/xoul/sfind?limit=&q=&creator=` → `{items:[...]}` with `name, gender, age, visibility, icon_url, background_url, tagline, social_tags, language, slug, creator_slug, created_at, updated_at, version_no, n_conversations, n_stars`.
  - `GET /api/v1/xoul/slist?orderby=created_at_desc&limit=` → same listing shape. Extra query keys in client: `cursor, creator, filter_favorites, filter_tags, filter_gender, filter_chat_preset, filter_language, use_tag_preference_boost, use_gender_preference_filter, use_blocked_tags, filter_visibility`.
  - `GET /api/v1/xoul/facets?facet_type=tag&limit=` → `{facet_type, items:[{item, frequency}]}` (e.g. `male` 16687, `nsfw` 13080).
- `GET /api/v1/xoul/{slug}/admin` unauthenticated → **403** credentials. Client: `xoulAdminRead`. — live probe; chunk 7766

#### Public scenario / lorebook / user
- `GET /api/v1/scenario/{scenario_slug}` **200** keys: `icon_spec`, **`definition`**, `prompt`, `prompt_spec`, `objective`, `greeter`, `greeting`, `lorebook_slugs`, `visibility`, `system_prompt`, `allow_community_posts`, `default_engine`, `name`, `icon_url`, `background_url`, `social_tags`, `language`, `slug`, `creator_slug`, `version_no`, `n_conversations`, `n_stars`, `created_at`, `updated_at`, `token_likes`, `preset_xouls`, `lorebooks`. Example slug `3319ab21-fed6-4384-b25e-d65a5b6c53bd` (`prompt` is the public description; `definition` was the short string `"Hi"`). Nested `preset_xouls[]` included each xoul’s `backstory`. — live GET
- `GET /api/v1/asset/{asset_slug}` **200** lorebook: top-level `name, description, icon_url, social_tags, visibility, posted_to_xoul, posted_to_scenario, slug, creator_slug, asset_type:"lorebook", n_downloads, token_favorites` plus `embedded: {asset_type, sections:[{lore_type, name, keywords, text}]}`. Example `c376293e-9f1c-459e-9dc9-a956b35523e0`. — live GET
- `GET /api/v1/user/{user_slug}` **200** public profile: `total_messages, total_likes, created_at, name, blurb, icon_url, social_tags, timezone, slug, n_followers, n_followees, token_follows`. `pickle` icon was a `lh3.googleusercontent.com` Google avatar. — [https://api.xoul.ai/api/v1/user/pickle](https://api.xoul.ai/api/v1/user/pickle)
- Other public GETs: `/api/v1/metadata/languages`, `/api/v1/metadata/models` → `["infinity_v4","jupiter_v3","bacchus_v2","proxy"]`, `/api/v1/user/creators/hot`, `/api/v1/scenario/facets`.

#### Chats (session required)
- List: `GET /api/v1/conversation/list?cursor=&limit=50` (`conversationList`). Client infinite query maps `{conversation:{conversation_id, name, icon_url, xouls, personas,...}, message:{conversation_id, timestamp, content, cursor}}`; next page = last `message.cursor`. Unauth → **403**. — [chunk 7766](https://xoul.ai/_next/static/chunks/7766-0a347041687a43de.js); [chunk 9213](https://xoul.ai/_next/static/chunks/9213-3f192b875af3a86d.js)
- One conversation: `GET /api/v1/conversation/details?conversation_id={uuid}`. Unauth **403**.
- Message history: `GET /api/v1/chat/history?conversation_id={uuid}&cursor=&limit=100`. Unauth **403**.
- Create: `POST /api/v1/conversation` JSON body, **SSE** (`fetchEventSource`). First event: `JSON.parse(event.data).content` is a JSON conversation object; later events stream greeting `content`. Unauth **403**.
- Send: `POST /api/v1/chat/send` SSE, body `{conversation_id, user_message, history:[]}` (regenerate/continue omits `user_message`). Also `POST /api/v1/chat/stop|regenerate|delete|edit|rewind|branch|clone|report`. Edit body includes `conversation_id`, `turn_id`, and either `user_message` or `llm_message`. Unauth send **403**.
- Delete conversation: **GET** `/api/v1/conversation/delete?conversation_id=` (unusual).
- Frontend chat URL: `/chats/{conversation_id}` (Sentry also has `/chats/@chat/:id` and `/chats/@chat/gp/:id` for groups).

#### Historical bulk export (gone from current client)
- April 2025: `GET https://api.xoul.ai/api/v1/export/all` in a logged-in browser downloaded a ZIP. Unauth JSON `Missing authentication credentials.` — [r/XoulAI](https://www.reddit.com/r/XoulAI/comments/1k4c7x9/if_you_cant_export_your_stuff_through_the_app_but/)
- 2026-09-22 unauth GET of that URL and `/api/v1/user/self/export`, `/api/v1/exports`, `/api/v1/account/export` → **404** `{"detail":"Not Found"}`. Path is **absent** from the generated client. — live probes; chunk 7766
- mefriend importer folder names from that ZIP: `chats_single`, `personas`, `xouls`, `scenarios`, `assets` (lorebooks). — [mefriend Xoul import guide](https://docs.mefriend.ai/xoul_integration_guide__2025_04_22)

### Inferences
- Programmatic **public character pull** is `GET /api/v1/xoul/{slug}` (and catalog/sfind to discover slugs). No login.
- Programmatic **session pull** is `GET /api/v1/conversation/list` then `GET /api/v1/chat/history?conversation_id=`. No public API key; cookie session.
- Owner-only extra fields, if any, live under `/xoul/{slug}/admin` (auth-gated). The public GET already includes `definition` and `samples`.

### Gaps
- Authenticated JSON for `conversation/details` and `chat/history` was not captured (no login). Avro `MessagePublic` / `ConversationMultiDetails` in the Socket.IO decoder is the best unauthenticated schema for those objects.
- Request body for `POST /api/v1/conversation` (which xoul/scenario/persona fields) was not fully recovered from minified call sites.

## Can public xoul cards (description vs advanced/hidden definition) be fetched without login?

### Takeaway
**Yes.** Unauthenticated `GET /api/v1/xoul/{slug}` returns `backstory` (UI “Description”), **`definition` (UI “Advanced Definition”)**, **`samples`**, `greeting`, and even **`system_prompt`** when the creator filled them. Official docs say Advanced Definition is “not visible to anyone except the AI”; the **public REST resource does not honor that**. The Next.js character page HTML does not embed those fields (the UI can hide them while the API still serves them).

### Cited Findings
- Official GitBook: “Advanced Definition … is a direct continuation of the Description, the only difference being that it is **not visible to anyone except the AI**.” Description / Advanced Definition / Chat Samples share 12k (17k Gold) characters. Visibility: Public / Unlisted / Private. — [Xoul Creation Interface](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/content-creation/xouls/xoul-creation-interface)
- Fandom wiki: Advanced Definition is a “hidden field”; Description is “public-facing.” — [Xoul | Xoul AI Wiki](https://xoul-ai.fandom.com/wiki/Xoul)
- Live unauthenticated GET `NarratorNPC.xo` (609k interactions): `visibility: "public"`, `backstory` length 1152, **`definition` length 4978** starting “The Narrator is a masterful storyteller…”, **`samples` length 1828** starting “Chat Examples:”, `system_prompt: null`. — [https://api.xoul.ai/api/v1/xoul/NarratorNPC.xo](https://api.xoul.ai/api/v1/xoul/NarratorNPC.xo)
- Live GET `Relonaer.xo`: `definition` length 2374, `samples` 1205, **`system_prompt` populated** (long “System note: You are {{char}}, a third-person fictional narrator…”). — [https://api.xoul.ai/api/v1/xoul/Relonaer.xo](https://api.xoul.ai/api/v1/xoul/Relonaer.xo)
- Live GET `YukiOnnaMif.xo`: `definition: null`, `samples: null`, `backstory` present — null means the creator left the field empty, not that it was redacted. — [https://api.xoul.ai/api/v1/xoul/YukiOnnaMif.xo](https://api.xoul.ai/api/v1/xoul/YukiOnnaMif.xo)
- HTML of `https://xoul.ai/xoul/NarratorNPC.xo` and `.../YukiOnnaMif.xo` does **not** contain `definition`, `backstory`, or “masterful storyteller”. Listing endpoints (`sfind`/`slist`/`catalog/feed`) omit `definition`/`backstory` and only return tagline/`description`. — live HTML + JSON
- Public lorebook sections including full `text` are likewise returned without auth (`embedded.sections[].text`). Scenario `definition` + nested `preset_xouls[].backstory` also returned. — live GETs above
- Private chats are a different class: FAQ “Only you can access your conversation history”; `conversation/list` and `chat/history` 403 without credentials. — [https://xoul.ai/faq](https://xoul.ai/faq); live 403s

### Inferences
- A CLI **without cookies** can dump public (and likely unlisted-if-you-have-the-slug) character cards **including the hidden definition**, samples, system prompt, and lorebook entries.
- The website “hides” advanced definition only in the UI, not at the REST boundary.
- Private-visibility xouls were not tested; they would be the remaining case where definition might 403/404 for strangers.

### Gaps
- Unlisted and private xoul slugs were not probed (would require knowing a private slug). Whether `/xoul/{slug}/admin` returns additional owner-only fields vs the public GET is unknown without login.

## Is there a websocket for chat streaming?

### Takeaway
**Yes, two channels:** (1) **Socket.IO** to `https://api.xoul.ai` (`withCredentials: true`, polling then websocket upgrade) carrying Avro-decoded live messages; (2) **SSE** (`fetchEventSource`, `credentials:"include"`) on `POST /api/v1/conversation` and `POST /api/v1/chat/send` for token streaming. There is no standalone `wss://api.xoul.ai/ws` path (that 404s). Voice calls use WebRTC (`POST https://voice.xoul.ai/offer` + ICE server in env).

### Cited Findings
- Socket.IO handshake unauthenticated: `GET /socket.io/?EIO=4&transport=polling` **200** with `upgrades:["websocket"]`. — live probe [https://api.xoul.ai/socket.io/?EIO=4&transport=polling](https://api.xoul.ai/socket.io/?EIO=4&transport=polling)
- Client constructor: `io(REST_API_ENDPOINT,{autoConnect:!1,withCredentials:!0,reconnection:!0,tryAllTransports:!0,rememberUpgrade:!0,transports:[polling,websocket],...})`. — [sidebar layout](https://xoul.ai/_next/static/chunks/app/(sidebarLayout)/layout-faa5b842f3cd4512.js)
- Avro schema `MessageForClient.inner` union (quoted from JS) includes records:
  - `BeginMessage`: `message_id` long, `conversation_id` uuid, `authored_by`, `references_id`, `timestamp`, `status` enum `deleted|created|user_changed|regenerated`
  - `PartialMessage`: `message_id`, `conversation_id`, `content`, `metadata`, `sequence_no`, `status`
  - `EndMessage`: `message_id`, `conversation_id`, `authored_by`, `references_id`, `sequence_max`, `timestamp`
  - `MessagePublic`: `message_id`, `conversation_id`, `timestamp`, `status`, `author_slug`, `author_type` enum `user|llm|system|channel`, `author_name`, `editor_name`, `content_type` enum `null|text|image|audio|video`, `content`, `metadata`, `references_id`, `emoji_reactions`
  - `Typing`, `UpdatedConversation` (`ConversationMultiDetails` with `xouls`, `personas`, `greeting`, lorebooks, `user_system_prompt`, `response_length`, …), `UserJoined`/`UserLeft`, `InviteCode`, `AvroManualMemory`, `EmojiReaction`, `CreatedConversation`, `RetrieveChatHistoryResponse` `{conversation_id, history: MessagePublic[]}`, `BranchConversationResponse` `{new_conversation_id}`, `XoulSocketExceptionResponse` `{detail, error}`, `RefreshConversationResponse`
  - Client listeners in 9213 include string events `"user"`, `"update_conversation"`, `"manual_memory"`. — [chunk 9213](https://xoul.ai/_next/static/chunks/9213-3f192b875af3a86d.js)
- SSE create/send: `await fetchEventSource(REST_API_ENDPOINT + url, {headers:{"Content-Type":"application/json"}, credentials:"include", openWhenHidden:!0, ...})`. Send mutation body `{conversation_id:e, user_message:n, history:[]}`. Chunk 576 contains `text/event-stream`. — [9213](https://xoul.ai/_next/static/chunks/9213-3f192b875af3a86d.js); [576](https://xoul.ai/_next/static/chunks/576-db259543c152d578.js)
- `GET https://api.xoul.ai/ws` and `/api/v1/ws` → **404**. — live probe
- Voice: `OFFER_API_ENDPOINT:"https://voice.xoul.ai"`, OpenAPI `POST /offer`; ICE URL in main-app. Conversation call: `GET /api/v1/conversation/call?conversation_id=`. — [main-app](https://xoul.ai/_next/static/chunks/main-app-204af47630fd44b0.js); [voice openapi](https://voice.xoul.ai/openapi.json)

### Inferences
- Streaming replies are SSE POSTs; Socket.IO is the realtime bus (typing, multi-user join/leave, memory updates, incremental `PartialMessage`). A CLI that only polls `GET /api/v1/chat/history` can still export completed chats; live streaming needs cookies on both SSE and Socket.IO.
- Unauthenticated Socket.IO **handshake** succeeds (sid issued); authenticated subscribe/join almost certainly fails later without a session (not tested beyond handshake).

### Gaps
- Exact Socket.IO event names for sending vs the Avro `inner` types, and whether history can be pulled over the socket (`RetrieveChatHistoryResponse`) vs REST only.

## Would a userscript/extension that reuses the logged-in session work more easily than a standalone CLI? Is there a public API?

### Takeaway
**There is no public developer API** (no API keys, no docs, GitHub empty). **Public cards** are fetchable from any CLI with plain HTTP. **Chats and private account data** need the **API session cookie**. A userscript/extension running on `https://xoul.ai` is the path of least resistance because CORS allows credentialed calls only from that origin; a CLI works if the user pastes cookies, but must speak `credentials`/Cookie headers itself and complete Auth0/OAuth or email login. The April 2025 `export/all` shortcut is **404** now.

### Cited Findings
- Official GitBook `llms.txt` / FAQ have no REST/SDK page; the only “API key” UX is **outbound** Custom Engine proxy. — [Official Guide](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide); [Custom Engine](https://xoul-ai-official-documentation.gitbook.io/xoul.ai-official-guide/navigation-and-information/navigation-and-interfaces/chat-interface/custom-engine-proxy)
- SPA always `credentials:"include"` against `https://api.xoul.ai` with CORS allowlist `https://xoul.ai`. Other browser origins cannot read responses. — live CORS; chunk 7766
- Shutdown-era userscript existed for **HTML scrape of the chat DOM** (`greasyfork.org/en/scripts/523418-download-full-chat-history-as-html-file`), not the REST API; group chats were unsupported. — [r/XoulAI urgent export](https://www.reddit.com/r/XoulAI/comments/1k3gak2/urgent_best_way_to_get_chats_out_of_xoul/)
- Current generated client has no export method; `GET /api/v1/export/all` is 404. Account settings HTML (2026-09-22) had no “export” string. — live GET [https://xoul.ai/settings/account](https://xoul.ai/settings/account); chunk 7766
- Download helper in JS: `fetch(url,{credentials:"include"})` then blob save — pattern a userscript can copy. — [chunk 2137](https://xoul.ai/_next/static/chunks/2137-4a76a8bc76c0ea66.js)
- Mobile: iOS `xoul://` + `/api/auth/callback-mobile`; Android `ai.xoul.android`. Not a documented third-party protocol. — apple-app-site-association; assetlinks.json

### Inferences
- **Public xouls:** CLI/script, no browser, `GET https://api.xoul.ai/api/v1/xoul/{slug}` (discover via `catalog/feed` or `xoul/sfind`).
- **User chats / personas / private xouls / `/user/self`:**
  1. Userscript or extension **injected on xoul.ai** (or a cookie-authenticated fetch from that origin) — reuses both `xoul_backend_userinfo` and the API session cookie automatically.
  2. CLI that copies the **api.xoul.ai session cookie** from DevTools into `Cookie:` (CORS does not apply). Must also send that cookie to Socket.IO/SSE if streaming.
  3. Full OAuth/password login in the CLI (email+password POST, or IdP code flow with `redirect_uri=https://api.xoul.ai/api/v1/auth/idp/callback`) — possible but more moving parts; not a supported public API.
- A **Chrome extension that is not on xoul.ai** cannot call `api.xoul.ai` with cookies unless it uses `host_permissions` + `credentials: include` (extensions are not bound by page CORS the same way; still need the cookie). A userscript is simpler.

### Gaps
- Cookie name for the API session is unknown; a CLI author would read it from DevTools after login rather than from this note.
- Whether mobile uses a Bearer JWT from Auth0 (easier for a reverse-engineered app) vs the same cookie was not observed.

## CSRF, bot protection, and non-browser clients

### Takeaway
**Cloudflare** fronts `xoul.ai` (no challenge observed for these GETs; `cf-cache-status: BYPASS` on HTML). **`api.xoul.ai` is not on Cloudflare** (AWS ELB + uvicorn); probes returned JSON without a JS challenge or captcha. **No reCAPTCHA/Turnstile/hCaptcha** strings in homepage JS. CSRF is effectively **CORS origin allowlist + credentialed cookies**; no CSRF token header was seen. Device fingerprint header is optional. A non-browser client is **not blocked** by Cloudflare on the API host; it is blocked by **missing session** on private routes.

### Cited Findings
- `xoul.ai` headers: `Server: cloudflare`, `CF-RAY`, `Nel` to `a.nel.cloudflare.com`, HSTS. HTML 200 without interstitial. Static chunks `cf-cache-status: HIT` on urlscan. — [https://xoul.ai/](https://xoul.ai/); [urlscan](https://urlscan.io/result/0199d7dd-9b85-720a-8fbd-17afc80f9268/)
- `api.xoul.ai` headers: `Server: awselb/2.0` or `server: uvicorn`, `Set-Cookie: AWSALB`, **no** `cf-ray`. Public catalog/xoul GETs succeeded from Python urllib with a generic Chrome UA. — live probes
- Homepage JS grep: no `recaptcha`, `turnstile`, `hcaptcha`. Fingerprint: `l["X-Device-Fingerprint"]=r` inside the OpenAPI request builder (failure only `console.error`). urlscan request used `x-device-fingerprint: 1398x7d`. — chunk 7766; urlscan
- CORS: credentials + explicit `https://xoul.ai` origin. Preflight reflects requested headers (`authorization,content-type` or `ngrok-skip-browser-warning,x-device-fingerprint`). — live OPTIONS; urlscan
- Unauthenticated Python client received full public xoul JSON, lorebooks, catalog, socket.io sid, and 403 JSON on private routes — not an HTML bot wall. — live probes
- `robots.txt` `Disallow: /api` applies to the **Next.js host**, not `api.xoul.ai`.

### Inferences
- Bot protection is **not** the main barrier to a CLI. **Auth** is.
- Browser extensions/userscripts on `xoul.ai` inherit Cloudflare’s cookie/clearance for the frontend; the API host does not need CF clearance from this vantage point.
- CSRF: a malicious third-party **website** cannot read API responses (CORS). Credentialed cross-site POSTs might still be possible depending on session `SameSite` (unknown). That does not block a user’s own CLI.

### Gaps
- Whether Cloudflare issues a challenge to some regions/ASNs, or to POST `/auth/login`, was not mapped.
- Session cookie `SameSite` (CSRF posture) unknown until login.

## Practical endpoint map (observed)

| Need | Method / URL | Auth | Notes |
| --- | --- | --- | --- |
| Discover public xouls | `GET /api/v1/catalog/feed?kinds=xoul&sort=interactions_desc&limit=` | none | `{slug,title,description,...}` |
| Search xouls | `GET /api/v1/xoul/sfind?q=&limit=&creator=` | none | listing fields only |
| **Full public card** | `GET /api/v1/xoul/{slug}` | none | includes `backstory`, **`definition`**, **`samples`**, `system_prompt` |
| Public scenario | `GET /api/v1/scenario/{uuid}` | none | `prompt`, `definition`, `preset_xouls` |
| Public lorebook | `GET /api/v1/asset/{uuid}` | none | `embedded.sections[].text` |
| Public user | `GET /api/v1/user/{slug}` | none | profile, not email |
| Chat list | `GET /api/v1/conversation/list?cursor&limit=50` | session | `{conversation, message.cursor}` |
| One chat meta | `GET /api/v1/conversation/details?conversation_id=` | session | uuid |
| Messages | `GET /api/v1/chat/history?conversation_id=&cursor&limit=100` | session | |
| Stream reply | `POST /api/v1/chat/send` SSE `{conversation_id,user_message,history:[]}` | session | |
| Start chat | `POST /api/v1/conversation` SSE | session | |
| Live updates | Socket.IO `https://api.xoul.ai` | session cookie | Avro `MessageForClient` |
| Me | `GET /api/v1/user/self` | session | |
| Login (email) | `POST /api/v1/auth/login` `{email,password}` | sets session | |
| Login (OAuth) | `GET /api/v1/auth/idp/authorize?provider=google.com\|apple.com\|twitter.com\|oidc.discord&success_url&failure_url` | 307 to IdP | callback `/api/v1/auth/idp/callback` |
| Bulk export | `GET /api/v1/export/all` | **404 now** | worked Apr–Jul 2025 with browser session |

Base: `https://api.xoul.ai`. Frontend: `https://xoul.ai`. Identity extras: `https://auth.xoul.ai` (Auth0 OIDC), `https://voice.xoul.ai` (WebRTC offer).
