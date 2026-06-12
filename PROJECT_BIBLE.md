# Project Bible — 2026 USPSA Alabama State Championship Digital Matchbook

## Live Site & Repo
- **URL:** https://alstateuspsa.com
- **GitHub:** https://github.com/stanggt325/2026-al-state-championship
- **Hosting:** GitHub Pages, `main` branch, repo root directory
- **Custom domain:** `CNAME` file in repo root contains `alstateuspsa.com`
- **DNS:** Cloudflare (nameservers switched from Porkbun) — CNAME `@` and `www` → `stanggt325.github.io`, proxied
- **SSL:** GitHub Pages auto-provisions Let's Encrypt; Cloudflare proxy sits in front
- **Cloudflare:** Free tier — security headers ("Add security headers" + "Remove X-Powered-By" enabled), DDoS protection, caching. No Transform Rules (paid). Origin bypass is a known/accepted limitation of GitHub Pages.

---

## Tech Stack
- Pure static HTML/CSS/JS — **no build tools, no npm, no framework**
- Google Fonts: `Bebas Neue`, `Oswald`, `Inter`
- No external JS libraries
- GitHub Actions: none — GitHub Pages deploys automatically from `main`

---

## Git Workflow
```bash
# Standard commit pattern used throughout:
git add <specific files>   # Never git add -A blindly — check for stale/junk files
git commit -m "..."
git push origin main       # GitHub Pages deploys automatically on push
```
- `gh` CLI is installed and authenticated (Keychain) — push works without token prompts
- Hard refresh (`Cmd+Shift+R`) required on the browser after pushing CSS/JS changes
- GitHub Pages propagation is typically under 30 seconds

### Preview Server
`.claude/launch.json` runs `npx --yes serve -p 3456 .` on Windows (Node.js at `C:\Program Files\nodejs\`). The original Mac config used `/bin/bash` + Homebrew path — that entry has been replaced with the Windows-compatible `runtimeExecutable: "npx"` form.

---

## Section Order (index.html)
Order is consistent across page sections, top nav, and footer links:
1. `#hero`
2. `#welcome`
3. `#sponsors`
4. `#briefing`
5. `#stages`
6. `#schedule`
7. `#squads`
8. `#directions`
9. `<footer>`

---

## File Structure
```
/
├── index.html              # Single-page app — all sections
├── css/styles.css          # All styles
├── js/script.js            # All JS (sponsors, countdown, PDF modal, squad tabs, bay map, scroll reveal)
├── CNAME                   # alstateuspsa.com
├── .nojekyll               # Prevents GitHub Pages Jekyll processing
├── .gitignore              # Ignores .claude/
├── doc/
│   └── welcome.docx        # Source for Jim Palmer's welcome message
├── pdf/                    # 10 stage PDFs + combined all-stages PDF
│   ├── Stage N - Name-Designer.pdf
│   └── 2026-AL-State-Championship-All-Stages.pdf   # Combined 20-page PDF (all 10 stages in order)
└── img/
    ├── Match Logo.png.png          # Match logo (footer + nav) — double extension is real filename
    ├── tps-logo-white.jpg          # TPS logo — browser tab favicon
    ├── Bay Layout.png              # Aerial photo of range — 879×772px (reference only; not on site)
    ├── 2-alpha-firearm-photography.jpg  # Photography credit image in sponsors section (420px wide)
    ├── title/
    │   └── KimberLogo_Black.png        # Black-on-white → needs invert filter
    ├── presented/
    │   └── HCBLT.PNG                   # BELT logo — dark bg, screen blend only
    ├── gold/
    │   ├── Hunters-HD-Gold-Logo-2020_HD-GOLD-Tagline-300x128.png
    │   ├── pov-nutrition-logo.png      # Transparent PNG (correct file)
    │   ├── pov-nutrition-logo.png.jpg  # OLD file — ignore
    │   ├── shooters-connection-logo.png
    │   ├── socn-logo.svg               # Spec Ops Charity Network (used)
    │   ├── socn-stacked.svg            # Alternate SOCN logo — unused, ignore
    │   ├── Springer Precision.jpg      # OLD source — ignore
    │   └── springer2.jpg               # Source banner used to create cropped version
    ├── silver/
    │   ├── anderson-logo.png
    │   ├── holosun-logo.png
    │   ├── lok-grips.png
    │   ├── outdoor-dynamics-logo.png
    │   ├── range-panda-logo.jpg        # White bg — special white card treatment
    │   ├── springer-precision-logo.jpg # Cropped from springer2.jpg
    │   └── vortex-logo.svg
    └── Division/
        ├── c-more-logo.png
        └── zeroed-ammo.png
```

---

## Design System

### CSS Custom Properties (`css/styles.css`)
```css
--crimson:    #9B1C1C
--crimson-lt: #DC2626
--gold:       #C9A84C
--gold-lt:    #F0C040
--white:      #F5F5F5
--off-white:  #E0DDD8
--dark:       #0D0D0E      /* page background */
--dark-2:     #141416
--dark-3:     #1A1A1D      /* stage cards */
--mid:        #1F1F24
--mid-2:      #26262C
--border:     rgba(201,168,76,.18)
--text-muted: #7A7A8C
--nav-h:      72px
```

### Section Padding
- Desktop: `5rem 0` (reduced from 7rem)
- Mobile (≤480px): `3.5rem 0`

### Logo Rendering on Dark Backgrounds
| Logo type | CSS treatment |
|---|---|
| Dark/transparent bg (most SVGs, PNGs) | `mix-blend-mode: screen` (default) |
| Black-on-white logo (Kimber) | `filter: invert(1); mix-blend-mode: screen` |
| White-bg illustration (Range Panda) | White card bg + `mix-blend-mode: normal; filter: none` |
| Dark bg JPEG (Springer Precision) | `filter: grayscale(1) brightness(1.2)` |
| Light SVG background (Vortex, Shooter's Connection) | `filter: invert(1) grayscale(1) brightness(3)` |

### Scroll Reveal Animations
Three CSS classes, applied by JS:
- `.reveal` — cards/list items: fade + `translateY(28px)`, 0.7s ease
- `.reveal-tag` — section eyebrow tags: fade + `translateX(-20px)` slide from left, 0.5s
- `.reveal-heading` — section titles: fade + `translateY(40px)`, 0.8s spring easing
- Tag fires at 0ms, title at 120ms delay (staggered via `headingObserver`)

---

## Sponsor System (`js/script.js` — `renderSponsors` IIFE)

All grids are **dynamically built and randomized on every page load** via `buildCard()`.

### Tiers
| Tier | Grid ID | Card class | Logo max-height |
|---|---|---|---|
| Title | static HTML `<a>` tags | `sponsor-title` | 90px |
| Gold | `gold-sponsors-grid` | `gold` | 80px |
| Silver | `silver-sponsors-grid` | *(none)* | 64px |
| Division | `division-sponsors-grid` | `division` | 64px |

### Sponsor Objects Schema
```js
{ img: 'img/tier/filename.ext', name: 'Name', url: 'https://...', division: 'Open', xl: true }
```
- `url` → card renders as `<a>` (clickable, opens new tab); omit for non-clickable `<div>`
- `division` → adds a red division-label badge in the card corner
- `xl` → adds `sponsor-logo-xl` class (max-height: 120px) to the `<img>`
- `buildCard()` auto-adds a slug class: e.g., `sponsor-range-panda` for per-card CSS targeting

### Current Sponsors
**Title:** Kimber → kimberamerica.com | BELT (Hunter Constantine) → hunterconstantine.com

**Gold:**
- Hunters HD Gold → huntershdgold.com
- POV Nutrition → pov-nutrition.com
- Shooter's Connection → shootersconnectionstore.com
- Spec Ops Charity → specopscharity.com

**Silver:**
- Anderson Manufacturing (AndersonShooting.com) → andersonshooting.com
- Holosun → holosun.com
- LOK Grips → lokgrips.com
- Outdoor Dynamics → outdoordynamics.net
- Range Panda → rangepanda.com *(white card — see CSS)*
- Springer Precision → shop.springerprecision.com
- Vortex Optics → vortexoptics.com

**Division:**
- C-More Systems — "Carry Optics" → cmore.com
- Zeroed Ammo — "Open" → zeroedammo.com *(xl: true)*

### Match Photography Credit
Below the Division sponsor grid, inside `#sponsors`, a `.photography-tier` block:
- Label: italic `<p>` — "Match photography provided by"
- Separator: `border-top: 1px solid var(--border)`
- Image: `img/2-alpha-firearm-photography.jpg`, width 420px, links to Facebook group
- CSS class: `.photography-tier`, `.photography-label`, `.photography-img`

---

## Stage Cards

Each stage card has:
1. Watermark logo (`position: absolute`, top-right, low opacity)
2. "Presented by [Sponsor]" credit line
3. Stage name, designer, pills, targets
4. `data-pdf` and `data-pdf-title` attributes for PDF modal
5. "📄 View Stage Diagram" hint injected by JS

### Stage → Sponsor Mapping
| Stage | Name | Sponsor | Watermark src |
|---|---|---|---|
| 1 | Opelika | AndersonShooting.com | `img/silver/anderson-logo.png` |
| 2 | Grant | C-More Systems | `img/Division/c-more-logo.png` |
| 3 | Tuscaloosa | Hunters HD Gold | `img/gold/Hunters-HD-Gold-Logo-2020...png` |
| 4 | Slapout | LOK Grips | `img/silver/lok-grips.png` |
| 5 | Evergreen | Outdoor Dynamics | `img/silver/outdoor-dynamics-logo.png` |
| 6 | Orange Beach | POV Nutrition | `img/gold/pov-nutrition-logo.png` |
| 7 | Talladega | Shooter's Connection | `img/gold/shooters-connection-logo.png` |
| 8 | Auburn | Springer Precision | `img/silver/springer-precision-logo.jpg` |
| 9 | Eclectic | Vortex Optics | `img/silver/vortex-logo.svg` |
| 10 | Ohatchee | Zeroed Ammo | `img/Division/zeroed-ammo.png` |

### Stage Watermark CSS Overrides (important!)
- Stage 1: `top: -0.75rem`, 175×105px
- Stage 2: `top: calc(.75rem - 18px)`, 131×79px
- Stage 7: `filter: invert(1) grayscale(1) brightness(3)` (white bg)
- Stage 8: `filter: grayscale(1) brightness(1.2)` (dark bg JPEG)
- Stage 9: `filter: invert(1) grayscale(1) brightness(3)` (light SVG bg)
- Stage 10: `right: 0`, 175×105px

---

## PDF Modal (`js/script.js` — `initPdfModal` IIFE)

- Desktop: opens a full-screen overlay with iframe viewer
- **iOS + Android**: `isMobilePDF` flag detected via userAgent → `window.open(src, '_blank')` instead of iframe (both platforms render PDFs poorly in iframes)
- PDF filenames have spaces and special chars — all URL-encoded in `data-pdf` attributes
- Stage 2 PDF has a comma in the filename: `Stage%202%20-%20Grant-Jeremy%20Hughes%2C%20Original%20by%20John%20Taylor.pdf`

### View All Stages Button
- A **"View All Stages"** button sits between the Stages section heading and the stage cards grid
- HTML: `<a class="view-all-stages-btn" href="pdf/2026-AL-State-Championship-All-Stages.pdf" data-all-stages>`
- JS wires up `[data-all-stages]` using the same `isMobilePDF` logic → always `window.open(src, '_blank')`
- CSS: `.view-all-stages-wrap` (centered) + `.view-all-stages-btn` (gold outlined, Oswald font, hover fills gold)
- **To update the combined PDF:** run `node merge-pdfs.mjs` from the project root (requires `pdf-lib` in local `node_modules/` — already installed; `merge-pdfs.mjs`, `package.json`, `package-lock.json`, and `node_modules/` are gitignored/untracked). Then commit both the changed stage PDF and `pdf/2026-AL-State-Championship-All-Stages.pdf`.
- **Cache gotcha:** browsers cache PDFs aggressively — hard refresh (`Ctrl+Shift+R`) won't clear a PDF open in its own tab. Use **Ctrl+Shift+Delete → Cached images and files → All time** or open in a private/incognito window to verify updates. Cloudflare cache purge is also required after pushing PDF changes.

---

## Squad Matrix

- Three tab panels: Friday (squads 101–110), Saturday (201–210), Sunday (301–310)
- Tab switching handled by JS click handlers on `.squad-tab` buttons
- **Critical CSS bug history:** `.sq { display: inline-flex }` must NOT apply to `<td>` elements — the rule `td.sq { display: table-cell }` override is essential, without it all squad cells collapse into Stage 1's column
- Squad color classes: `.sq-1` through `.sq-10` (10 distinct colors)
- Mobile: table scrolls within its own wrapper; font/padding reduced at ≤768px
- Clicking any `.sq` element highlights the corresponding bay on the SVG bay map below

---

## Interactive Bay Map (`js/script.js` — `initBayMap` IIFE)

An inline SVG (`#bay-map-svg`) is generated by JS and injected into `#bay-map-wrap` below the squad matrix. No external image is used.

### Physical Bay Order (top → bottom in SVG)
| SVG position | Bay | Stage | Stage Name |
|---|---|---|---|
| 1 (top) | B5 | 6 | Orange Beach |
| 2 | B4 | 5 | Evergreen |
| 3 | B3 | 7 | Talladega |
| 4 | B2 | 4 | Slapout |
| 5 | B1 | 8 | Auburn |
| — | *P / Parking separator* | — | — |
| 6 | A5 | 3 | Tuscaloosa |
| 7 | A4 | 9 | Eclectic |
| 8 | A3 | 2 | Grant |
| 9 | A2 | 10 | Ohatchee |
| 10 (bottom) | A1 | 1 | Opelika |

### SVG Elements
- Road: right side, vertical gray stripe with dashed center line
- **P circle** + "Parking / Bathrooms →" label: sits at the B/A row break (between B1 and A5)
- **Shooter Services box**: small gold-bordered rect to the right of the road at A4 level
- Berm label: rotated "← BERM" on far left edge
- Each bay: parallelogram body, crimson accent bar (berm/shooting end), gold bay designation (B5, A4, etc.), stage name "Stage N · Name"
- `.bay-start-label` ("★ YOUR START"): hidden by default, shown when that bay is highlighted

### Highlight Logic
- `sq-N` class maps directly to starting stage N (sq-1 = Stage 1, etc.)
- Clicking any `.sq` element or any `.bay-group` calls `highlightBay(stageNum)`
- Highlighted bay: body fill → `#26262C`, accent bar → squad color, "YOUR START" label shown, matching `.sq` elements get `.sq-selected` gold ring
- Clicking same squad again toggles highlight off
- `squadColors` array index matches stage number (index 1 = Stage 1 color)

---

## Match Photography
- Provider: 2 Alpha Firearm Photography
- Facebook: https://www.facebook.com/groups/1113753466081338
- Image: `img/2-alpha-firearm-photography.jpg` (420px wide in sponsors section)

---

## Footer Social Links
```html
<!-- Facebook -->
https://www.facebook.com/talladegapracticalshooters

<!-- PractiScore match page -->
https://practiscore.com/2026-alabama-state-uspsa-championship/register
```
Both rendered as `.footer-social-link` (inline-flex, icon + text, muted → gold on hover).

---

## SEO / Social Sharing
OG and Twitter card meta tags in `<head>`:
- `og:image` / `twitter:image` → `https://alstateuspsa.com/img/Match%20Logo.png.png`
- `og:title` → "2026 Kimber USPSA Alabama State Championship"
- `og:description` / `name="description"` → match dates + location blurb

---

## Google Maps Embed
- Place ID: `0x888bc53a24b31987:0xf0effe62b5b817c8`
- Coordinates: `33.525609, -86.0817109`
- Map center (embed): `-86.0838996, 33.525609`

---

## Match Details

| Field | Value |
|---|---|
| Official title | The 2026 USPSA Alabama State Championship |
| Hero eyebrow | "The 2026 USPSA" |
| Subtitle | "Kimber Alabama State Championship" (hero h1) |
| Presented by | BELT |
| Dates | June 11–14, 2026 |
| Location | CMP Talladega Marksmanship Park, Range 5, 4387 Turner Mill Rd W, Talladega AL 35160 |
| Range open | 7:00 AM |
| Range close | 6:00 PM |
| Match/stage walking start | 9:00 AM (Thursday: match begins, competitors can walk stages; Fri–Sun: competition begins) |
| Stages | 10 (all Comstock) |
| Min rounds | 272 |
| Recommended | 350+ |
| Competitors | 310 |
| Format | Competitor-reset match |

### Match Staff
| Role | Name |
|---|---|
| Match Director | Jim Palmer |
| Range Master | Gary McConnell |
| Co-Range Master | Ike Starns |
| Co-Match Director & Stage Design | Jeremy Hughes |
| Stats | Steve Fischer & Linda Pool |
| Set-up Crew | Dedicated Volunteers |

---

## Watch Live Block (`index.html`, `js/script.js`, `css/styles.css`)

A single-stream livestream block sits in the hero between the stats and the "View Match Book" CTA:

```html
<div class="hero-live-block">
  <div class="hero-live-stream">
    <div class="hero-live-stream-label">Hunter's HD Gold</div>
    <a class="hero-live-card" href="RUMBLE_URL" target="_blank" ...>
      <img class="hero-live-thumb" id="watchLiveThumb" ... />
      <div class="hero-live-overlay"> ... </div>
    </a>
  </div>
</div>
<a href="#welcome" class="hero-cta hero-cta-matchbook">View Match Book</a>
```

- **Current streamer:** Hunter's HD Gold (on Rumble)
- **Stream URL:** `https://rumble.com/v7b02ce-episode-289-friday-uspsa-alabama-state-section-championship-at-cmp-in-talla.html`
- **Video ID:** `v7b02ce`
- Clicking the card opens the URL in a new tab (`target="_blank"`)
- **Thumbnail:** fetched at runtime via Rumble's oEmbed API (`https://rumble.com/api/Media/oembed.json?url=...`) in `initWatchLive` IIFE — fades in with `.loaded` class; crimson play-circle overlay shows regardless as a fallback
- **To update the stream URL:** change `url` in `initWatchLive` in `script.js` and the `href` on `.hero-live-card` in `index.html`
- **To add a second stream:** wrap the existing `.hero-live-stream` and a new one inside a `.hero-live-streams` flex row — CSS for `.hero-live-streams` and narrower card width (`min(300px, 42vw)`) will need to be restored
- **To remove after the match:** delete `.hero-live-block` from HTML, the `initWatchLive` IIFE from JS, and the `.hero-live-*` / `.hero-cta-matchbook` CSS blocks
- **Countdown timer removed** (June 2026) — the `initCountdown` IIFE, `.hero-countdown`, `.cd-block`, and `.cd-label` CSS are gone; do not re-add
- **atveventlive.com (`AMTV Live`) — do not use** — investigated June 2026; site has no disclosed ownership, inconsistent branding across multiple domains (`allevent.live`, `now247.live`, `streamonnet.com`), and no legitimate web presence. Likely a scraper/aggregator that generates event pages to drive account sign-ups.

---

## Known Quirks & Gotchas

1. **`Match Logo.png.png`** — double extension is the actual filename. Footer src uses `Match%20Logo.png.png` (space encoded). Nav uses the same encoding.
2. **Silver card sizing** — uses `flex: 0 1 220px` (no flex-grow) to prevent last-row cards expanding larger than others. Gold cards still use `flex: 1`.
3. **Footer logo** — wrapped in `.footer-logo-wrap` (white `#fff` background, `border-radius: 8px`) because `mix-blend-mode: multiply` on a dark footer made the logo invisible. Height: 95px.
4. **Favicon** — `img/tps-logo-white.jpg` (JPEG, `type="image/jpeg"`)
5. **`pov-nutrition-logo.png.jpg`** — old double-extension file, still in `/img/gold/` but unused. The correct file is `pov-nutrition-logo.png`.
6. **`springer2.jpg`** — original source banner; `springer-precision-logo.jpg` is the cropped version actually used.
7. **Range Panda** — white card background, `mix-blend-mode: normal`, `filter: none`. Logo max-height: 96px. Any attempt to use invert or screen blend makes it look wrong.
8. **Briefing cards have no emoji icons** — they were removed; do not re-add `.brief-icon` elements.
9. **Bay map is pure SVG, no raster image** — `Bay Layout.png` is kept as a reference but the illustrated SVG replaces it on the page. If stage-to-bay assignments change, update the `bays` array in `initBayMap` in `script.js`.
10. **PDF browser caching** — browsers cache PDFs opened in their own tab; `Ctrl+Shift+R` does not clear them. Use `Ctrl+Shift+Delete` (clear all cached files) or an incognito window to verify PDF updates. Always purge Cloudflare cache after pushing new PDFs.
11. **Schedule — no Sunday Only block** — the Sunday-specific arbitration rows were removed as confusing to competitors. Thursday 9 AM reads "Match Begins (Competitors Can Walk Stages)"; Fri–Sun 9 AM reads "Competition Begins". Range opens at 7 AM all days; stage walking is not permitted until 9 AM.

---

## What's Not Done / Future Considerations
- **Remove Watch Live block** after the match concludes (June 14, 2026) — see Watch Live section above for what to delete
- Results/scores page after the match concludes (June 14, 2026)
- Silver sponsor Outdoor Dynamics logo may need review (small/unclear at current size)
- Stage sponsor watermarks for stages 6, 7, 8 were previously problematic — if logos are ever replaced, check the per-stage CSS filter overrides in `styles.css`
- `doc/welcome.docx` is the source of truth for Jim Palmer's welcome message — update the HTML from this doc if the message changes
- Cloudflare Content-Security-Policy header not yet configured (requires paid Transform Rules or Workers) — low priority for a static read-only site
- If Cloudflare ever goes down, swap nameservers back to Porkbun defaults to bypass it
