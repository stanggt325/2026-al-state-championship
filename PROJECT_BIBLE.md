# Project Bible — 2026 USPSA Alabama State Championship Digital Matchbook

## Live Site & Repo
- **URL:** https://alstateuspsa.com
- **GitHub:** https://github.com/stanggt325/2026-al-state-championship
- **Hosting:** GitHub Pages, `main` branch, repo root directory
- **Custom domain:** `CNAME` file in repo root contains `alstateuspsa.com`
- **DNS:** Porkbun — ALIAS record → `stanggt325.github.io`, wildcard CNAME `*` → `stanggt325.github.io`
- **SSL:** GitHub Pages auto-provisions Let's Encrypt (Porkbun-generated cert is NOT used)

---

## Tech Stack
- Pure static HTML/CSS/JS — **no build tools, no npm, no framework**
- Google Fonts: `Bebas Neue`, `Oswald`, `Inter`
- No external JS libraries
- GitHub Actions: none — GitHub Pages deploys automatically from `main`

---

## File Structure
```
/
├── index.html              # Single-page app — all sections
├── css/styles.css          # All styles
├── js/script.js            # All JS (sponsors, countdown, PDF modal, squad tabs, scroll reveal)
├── CNAME                   # alstateuspsa.com
├── .nojekyll               # Prevents GitHub Pages Jekyll processing
├── .gitignore              # Ignores .claude/
├── doc/
│   └── welcome.docx        # Source for Jim Palmer's welcome message
├── pdf/                    # 10 stage PDFs (one per stage)
│   └── Stage N - Name-Designer.pdf
└── img/
    ├── Match Logo.png.png  # Match logo (footer + old favicon)
    ├── tps-logo-white.jpg  # TPS logo — used as browser tab favicon
    ├── Bay Layout.png      # (available, not currently used on site)
    ├── title/
    │   └── KimberLogo_Black.png        # Black-on-white → needs invert filter
    ├── presented/
    │   └── HCBLT.PNG                   # BELT logo — dark bg, screen blend only
    ├── gold/
    │   ├── Hunters-HD-Gold-Logo-2020_HD-GOLD-Tagline-300x128.png
    │   ├── pov-nutrition-logo.png      # Transparent PNG (correct file)
    │   ├── pov-nutrition-logo.png.jpg  # OLD file — ignore
    │   ├── shooters-connection-logo.png
    │   ├── socn-logo.svg               # Spec Ops Charity Network
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

### Logo Rendering on Dark Backgrounds
| Logo type | CSS treatment |
|---|---|
| Dark/transparent bg (most SVGs, PNGs) | `mix-blend-mode: screen` (default) |
| Black-on-white logo (Kimber) | `filter: invert(1); mix-blend-mode: screen` |
| White-bg illustration (Range Panda) | White card bg + `mix-blend-mode: normal; filter: none` |
| Dark bg JPEG (Springer Precision) | `filter: grayscale(1) brightness(1.2)` |
| Light SVG background (Vortex, Shooter's Connection) | `filter: invert(1) grayscale(1) brightness(3)` |

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
- Stages 1: `top: -0.75rem`, 175×105px
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

---

## Squad Matrix

- Three tab panels: Friday (squads 101–110), Saturday (201–210), Sunday (301–310)
- Tab switching handled by JS click handlers on `.squad-tab` buttons
- **Critical CSS bug history:** `.sq { display: inline-flex }` must NOT apply to `<td>` elements — the rule `td.sq { display: table-cell }` override is essential, without it all squad cells collapse into Stage 1's column
- Squad color classes: `.sq-1` through `.sq-10` (10 distinct colors)
- Mobile: table scrolls within its own wrapper; font/padding reduced at ≤768px

---

## Known Quirks & Gotchas

1. **`Match Logo.png.png`** — double extension is the actual filename. Footer src uses `Match%20Logo.png.png` (space encoded). Nav uses the same encoding.
2. **Silver card sizing** — uses `flex: 0 1 220px` (no flex-grow) to prevent last-row cards expanding larger than others. Gold cards still use `flex: 1`.
3. **Footer logo** — wrapped in `.footer-logo-wrap` (white `#fff` background, `border-radius: 8px`) because `mix-blend-mode: multiply` on a dark footer made the logo invisible. Height: 95px.
4. **Favicon** — `img/tps-logo-white.jpg` (JPEG, `type="image/jpeg"`)
5. **`pov-nutrition-logo.png.jpg`** — old double-extension file, still in `/img/gold/` but unused. The correct file is `pov-nutrition-logo.png`.
6. **`springer2.jpg`** — original source banner; `springer-precision-logo.jpg` is the cropped version actually used.
7. **Range Panda** — white card background, `mix-blend-mode: normal`, `filter: none`. Logo max-height: 96px. Any attempt to use invert or screen blend makes it look wrong.

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
| Shooting start | 9:00 AM |
| Stages | 10 (all Comstock) |
| Min rounds | 272 |
| Recommended | 350+ |
| Competitors | 310 |
| Format | Competitor-reset match |
| Countdown target | `new Date('2026-06-11T09:00:00')` in script.js |

### Match Staff
| Role | Name |
|---|---|
| Match Director | Jim Palmer |
| Range Master | Gary McConnell |
| Co-Range Master | Ike Starns |
| Co-Match Director & Stage Design | Jeremy Hughes |
| Stats | Steve Fischer & Linda Poole |
| Set-up Crew | Dedicated Volunteers |

---

## Google Maps Embed
- Place ID: `0x888bc53a24b31987:0xf0effe62b5b817c8`
- Coordinates: `33.525609, -86.0817109`
- Map center (embed): `-86.0838996, 33.525609`

---

## Git Workflow
```bash
# Standard commit pattern used throughout:
git add <specific files>   # Never git add -A blindly — check for stale/junk files
git commit -m "..."
git push origin main       # GitHub Pages deploys automatically on push
```
- Hard refresh (`Ctrl+Shift+R`) required on the browser after pushing CSS/JS changes
- GitHub Pages propagation is typically under 30 seconds

---

## What's Not Done / Future Considerations
- Results/scores page after the match concludes (June 14, 2026)
- Silver sponsor Outdoor Dynamics logo may need review (small/unclear at current size)
- Stage sponsor watermarks for stages 6, 7, 8 were previously problematic — if logos are ever replaced, check the per-stage CSS filter overrides in `styles.css`
- The `Bay Layout.png` image is in `/img/` but not used anywhere on the site — could be added to the Directions section
- `doc/welcome.docx` is the source of truth for Jim Palmer's welcome message — update the HTML from this doc if the message changes
