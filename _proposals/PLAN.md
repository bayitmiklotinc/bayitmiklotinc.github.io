# Bayit Miklot website: SEO, layout and press-release change plan

Prepared 2026-10-06 from a local audit of the `bayitmiklotinc.github.io` working tree.
Nothing in this folder is committed or pushed. The `_proposals/` folder starts with an
underscore, so Jekyll will never publish it, even if it is committed by accident.

Task IDs (SEO-01, NAV-01 ...) match `monday-import.csv`, which can be imported into
monday.com as a board (Import > Excel/CSV).

---

## 1. What was found

### 1.1 Verified bugs (reproduced in a headless browser)

| ID | Problem | Root cause | Evidence |
|----|---------|------------|----------|
| NAV-01 | Mobile menu is "cut short": items overlap and the list cannot be scrolled | The open menu is a flex column with `max-height: 80vh` that inherits `flex-wrap: wrap` from the desktop rule. When the list is taller than 80vh it wraps into an off-screen second column instead of scrolling. 80vh also ignores the 85px header and the mobile browser toolbars. | 5 overlapping items at every tested size: 320x568, 375x667, 390x844, 667x375, 844x390 |
| NAV-02 | Desktop: "About" and "Programs" labels sit lower than the other links | `.has-dropdown` is a `div` that inherits the body's 18px / 1.7 line box, and the 0.88rem link rides that taller line, so its baseline and underline drop. | Text bottoms differ by 1.7px; underline boxes differ by 2.3px |
| NAV-03 | Between 901px and about 1100px wide, the Donate button wraps to a second row | Fixed 2rem gaps plus an 86px-tall logo do not fit | Header grows from 111px to 131px at 1000px wide |
| NAV-04 | Dropdown can close while the pointer moves onto it | 6px gap between label and panel with no hover bridge | Code review |
| CSS-01 | Clubhouse page 3-column cards and larger "who is it for" text never apply | `clubhouse-css-additions.css` is not linked from any page and its rules are not in `style.css` | Classes are used in the page, and no rule matches them |
| CSS-02 | Footer logo is squashed on the new 404 page | The image has `width`/`height` attributes, but the CSS sets only the height | Renders 551x30 instead of 133x30 |

### 1.2 SEO audit

| Area | Current state | Impact |
|------|---------------|--------|
| Canonical URLs | None on any page | Possible duplicate indexing of `/` vs `/index.html`, and `http`/`www` variants |
| Open Graph / social cards | None | Shares on Facebook, LinkedIn, WhatsApp and X show no image or summary |
| Structured data (JSON-LD) | None | No eligibility for organization knowledge panels or nonprofit details |
| Titles | Brand-first and keyword-light ("Clinical Care \| Bayit Miklot — Home of Refuge") | Pages do not match how people search ("Jewish sober living Dallas") |
| Descriptions | Mostly poetic copy, for example Clubhouse "1,300 square feet. Two bedrooms..." | Low click-through and no search terms |
| Location signals | "Dallas" appears twice on the whole site, with no address or service-area statement | Weak local ranking, which is the most important search for this service |
| Name consistency | Founder is "Founder & CEO" on one page and "Founder and Executive Director" on 13 | Weakens trust signals for people and search engines |
| Contact | Get Help goes to `info@` in one place and `avi@` in 18 places. Contact is mailto links only, with no contact page | Lost conversions and no crawlable contact page |
| Sitemap | Hand-written, with every `lastmod` frozen at 2026-08-12 | Search engines learn to ignore `lastmod` |
| `robots.txt` | Good. It allows everything, includes AI crawlers, and points at the sitemap | Keep it |
| Duplicate page | `clubhouse-standalone_7.html` (560 KB copy of the Clubhouse page). It is tracked in git and was deleted from the working tree during this session | Keep it out of the published site (excluded in the proposed `_config.yml`) |
| Images | 45 MB in `assets/si`. Photos are 0.4 to 6.4 MB PNG/JPG. `img6.jpg` is 8085x5390 px and 6.4 MB. Filenames are `img1`..`img30`. There is no `width`/`height` and no lazy loading | Clubhouse page downloads 8.3 MB on a phone. Poor Largest Contentful Paint and Cumulative Layout Shift, which are ranking signals |
| Hero quote photo | Set as a CSS background | Invisible to image search, has no alt text, and is not responsive |
| Analytics | Google Ads tag only | No GA4 and no Search Console or Bing verification, so SEO results cannot be measured |
| Accessibility (ranking-adjacent) | Text contrast is below WCAG AA in several brand pairings (see 1.3). There is no skip link, and the hamburger has no `aria-expanded` | Accessibility audit failures and legal exposure |

### 1.3 CSS audit

- **Breakpoints:** eight different mobile breakpoints (520, 620, 640, 700, 760, 860, 900 and 960px) produce in-between states. Consolidate to three tokens: 600, 900 and 1200.
- **Inline styles:** 81 inline `style=""` attributes across pages, 23 on the Clubhouse page alone. Replace them with utility classes such as `.on-navy`, `.emph-line` and `.section-title-center` (included in the proposal).
- **Units:** fixed 18px body text and fixed section padding (80px, 46px). Move to fluid type and spacing tokens with `clamp()` (included).
- **Duplicates and hacks:**
  - `.picture-frame .frame-image` is declared twice.
  - `.outline-grey` sets `border-color` twice.
  - `!important` is used on the donate buttons.
  - `.split-band.reverse` uses `direction: rtl` to swap columns. That breaks text direction for any Hebrew content and confuses screen readers. Use `order` or `grid-template-areas`.
- **Hard-coded colours:** `#D9E6E9` and `#ffffff` are written directly instead of using tokens. Derive tints with `color-mix()`.
- **Emoji icons:** the "Clinical Mental Health" pillar card uses `&#129649;`, which is U+1FA71 ONE-PIECE SWIMSUIT (🩱), on every platform. A stethoscope (🩺) is `&#129658;`. Fix it now (task CSS-03). More broadly, emoji render differently on every platform. Replace them with a small inline SVG icon set in brand colours.
- **Contrast:** these brand pairings fail WCAG AA (4.5:1 needed for body text). Add "text-safe" tokens and keep the bright originals for large display type and fills.

| Pairing | Ratio | Proposed text token | New ratio |
|---|---|---|---|
| Coral on aqua wash (featured menu item) | 2.12 | `--coral-text: #B9483A` | 4.53 |
| White on coral (hover states) | 2.43 | `#B9483A` background | 5.18 |
| Taupe on cream (footer, captions) | 3.00 | `--taupe-text: #6B675F` | 5.05 |
| Teal on cream / white (links, kickers) | 3.00 / 3.35 | `--teal-text: #23766B` | 4.86 / 5.42 |

- **Modern techniques worth adopting:** each is supported in all current browsers and degrades safely.
  - Cascade layers (`@layer reset, tokens, base, components, utilities`) remove the need for `!important`.
  - Container queries let cards adapt to their column (included).
  - `text-wrap: balance` and `text-wrap: pretty` improve headings and paragraphs (included).
  - `dvh` units and `env(safe-area-inset-*)` handle mobile toolbars and notches (included).
  - `:focus-visible` rings and `prefers-reduced-motion` support accessibility (included).
  - Logical properties (`margin-inline`, `padding-block`) help if Hebrew pages are ever added.
  - `aspect-ratio` is already used well.
  - `<picture>` with AVIF/WebP plus `srcset`/`sizes` for responsive images.
  - `scroll-margin-top` so the sticky header does not cover anchors (included).

---

## 2. Proposed solution (files in `_proposals/site/`)

```
_proposals/site/
  _config.yml                 Jekyll config: SEO, sitemap, press feed, excludes
  _data/navigation.yml        One menu definition used by every page
  _data/org.yml               Name, phone, email, city: one place to edit
  _includes/head.html         <head>: SEO tags, fonts, CSS, Google tag, JSON-LD
  _includes/header.html       Header and menu with automatic "active" state
  _includes/footer.html       Footer
  _includes/schema-org.html   NGO structured data
  _layouts/default.html       Page shell: head + header + <main> + footer
  _layouts/press-release.html Press release template with boilerplate and media contact
  _press/2026-10-06-example-press-release.md   Example release (published: false)
  press/index.html            Press listing page, generated automatically
  index.html                  Example of a page after migration (illustrative)
  assets/css/nav-fixes.css    Fixes NAV-01..04 (append to style.css)
  assets/css/components-additions.css  Tokens, a11y, utilities, press styles, CSS-01/02
  tools/migrate_to_includes.py  Converts all 13 pages automatically
  tools/seo_titles.yml        Proposed keyword titles and descriptions per page
  tools/optimize_images.sh    Generates AVIF/WebP at 480/800/1600px
  tools/check_nav.mjs         Automated QA for the menu (pass/fail)
  .github/workflows/scheduled-pages-rebuild.yml  Daily rebuild for embargoed releases
  Gemfile                     Local preview with the same gems GitHub Pages uses
```

### Why Jekyll includes, not JavaScript includes or a new tool

GitHub Pages already runs Jekyll on this repository, because there is no `.nojekyll` file. Jekyll `{% include %}` assembles the header and footer **at build time**, so crawlers receive complete HTML.

JavaScript `fetch()` includes, the common alternative, inject the menu after load. Crawlers can miss those links, and the menu flashes on every page view.

Jekyll needs no new hosting, no build server and no cost. Every existing URL (for example `/about-our-story.html`) stays exactly the same, so no rankings or inbound links are lost. The three plugins used (`jekyll-seo-tag`, `jekyll-sitemap` and `jekyll-feed`) are on the GitHub Pages allow-list.

### What was verified locally

The proposal was applied to a scratch copy of the site, built with Jekyll and rendered in Chromium.

- **Migration:** all 13 pages migrated automatically.
- **Visual parity:** desktop page heights are identical to the current site on every page tested. Mobile pages differ by about 5px, because the footer website link is replaced by "Dallas, TX".
- **Menu state:** the "active" menu item is now set automatically, including the parent item ("About" lights up on Our Founder).
- **Generated SEO files:** the build produces canonical tags, Open Graph tags, Twitter cards, JSON-LD, a 13-URL sitemap with real dates (the 404 page is excluded), and the press feed at `/press/feed.xml`.
- **Menu QA:** `tools/check_nav.mjs` fails on the current site and passes with the fixes.

| Check | Current | Proposed |
|---|---|---|
| Desktop label baseline spread | 1.7px (1280), 70px (1000, wrapped) | 0px |
| Header rows at 1000px | 2 | 1 |
| Overlapping mobile menu items | 5 | 0 |

**Not verified:**
- The build used Jekyll 4.4. GitHub Pages runs Jekyll 3.10. All features used here exist in 3.10, but preview with the `Gemfile` before merging.
- The scheduled-rebuild workflow needs a test run from the Actions tab.

---

## 3. Press releases with crossposting

### Recommendation: Postiz (self-hosted) fed by the site's own press RSS feed

| | |
|---|---|
| Tool | Postiz, github.com/gitroomhq/postiz-app |
| License / cost | AGPL-3.0, free to self-host. Hosting costs apply (a small VPS, about $5–12/month). Managed cloud plans start at about $29/month |
| Activity | About 36.7k GitHub stars and very frequent releases. It is the most widely used open-source social scheduler |
| Channels | LinkedIn pages, Facebook pages, Instagram, Threads, X, Bluesky, Mastodon, YouTube, TikTok, Pinterest, Reddit, Discord, Slack and more |
| Relevant features | RSS auto-post, approval workflow, team roles, calendar, analytics, public API, webhooks, n8n/Make/Zapier integration |

Alternative: **Mixpost Lite** (MIT, Laravel). It is lighter to host but supports fewer networks, and team features are in the paid Pro edition.

### Flow ("publish once on the website, then crosspost")

```
Author writes _press/YYYY-MM-DD-title.md  (GitHub web editor, or Decap CMS later)
        │  pull request → review/approval (comms + Avi)
        ▼
Merge to main → GitHub Pages builds
        │   /press/                     listing updates automatically
        │   /press/2026/10/title/       release page (NewsArticle schema)
        │   /press/feed.xml             Atom feed updates
        │   /sitemap.xml                new URL submitted to search engines
        ▼
Postiz RSS auto-post watches /press/feed.xml
        │   creates a post per network, held for approval (recommended) or posted directly
        ▼
LinkedIn · Facebook · Instagram · X · Threads · Bluesky
```

- **Embargoes:** give a release a future `date:`. Jekyll will not publish it until a build runs after that time. `scheduled-pages-rebuild.yml` triggers a build every morning.
- **Why the site is the source of truth:** the canonical copy lives on bayitmiklot.com. That builds search authority and backlinks to the domain rather than to social platforms. It also leaves a permanent, citable newsroom for journalists.
- **Optional reverse flow:** if the PR team prefers to draft in Postiz first, a Postiz "post published" webhook can trigger n8n, which opens a pull request that adds the Markdown file. This is more moving parts, so start with the RSS flow.
- **Optional editor for non-technical staff:** Decap CMS, an open-source, git-based CMS, gives a form-based editor for `_press/` on top of the same files. It needs a small GitHub OAuth proxy.

---

## 4. Implementation procedure

All work happens on a branch. `main` changes only by reviewed pull request, after a local preview.

### Phase 0: Preparation (no site changes)
1. Decide on `clubhouse-standalone_7.html`. It was deleted in the working tree during this session but is still tracked in git. Either commit the deletion or keep it excluded through `_config.yml`.
2. Commit or stash the current uncommitted edits (alt text, robots.txt, sitemap.xml, 404.html) as their own change.
3. Create the branch `feature/site-foundation`.
4. Set up Google Search Console (domain property for bayitmiklot.com) and Bing Webmaster Tools. Create a GA4 property.
5. Create or claim the Google Business Profile for Bayit Miklot (Dallas, nonprofit category). Decide whether to show a street address or a service area.

### Phase 1: Navigation and CSS fixes (low risk, high visibility)
1. Append `nav-fixes.css` and `components-additions.css` to `style.css`, then remove `clubhouse-css-additions.css`.
2. Run `tools/check_nav.mjs` and test manually on a real iPhone and Android phone, in portrait and landscape.
3. Open a pull request, get review, and merge.

### Phase 2: Shared header and footer (Jekyll includes)
1. Copy the `_proposals/site/` files (except `index.html` and `assets/`) to the repo root, and delete the hand-written `sitemap.xml`.
2. Run `python3 tools/migrate_to_includes.py .` then review `git diff`.
3. Preview with `bundle install && bundle exec jekyll serve`, and click through every page and menu item.
4. Merge, then check the live site. View the page source and confirm that it contains canonical links and JSON-LD.

### Phase 3: On-page SEO content
1. Approve the titles and descriptions in `tools/seo_titles.yml`, then re-run the migration or edit the front matter.
2. Add "Dallas, Texas" naturally to each H1 subtitle or lede and to body copy. Standardize the founder title and the help email.
3. Add a Contact / Get Help page with phone, email, service area, a simple form (Formspree, or Google Forms embed), and a crisis line note (988).
4. Add an FAQ section to program pages, marked up as FAQPage.
5. Write an image alt-text pass.

### Phase 4: Performance
1. Run `tools/optimize_images.sh`, rename images descriptively, and switch `<img>` tags to `<picture>` with `width`/`height`, `loading="lazy"` (below the fold) and `fetchpriority="high"` (hero).
2. Move the homepage quote photo from a CSS background to an `<img>`.
3. Create a 1200x630 Open Graph share image and sized favicons.
4. Target Lighthouse mobile Performance 90+, Largest Contentful Paint under 2.5s, and Cumulative Layout Shift under 0.1.

### Phase 5: Press releases and crossposting
1. Merge `press/`, `_press/` and `_layouts/press-release.html` (done in Phase 2) and add the "Press" menu item.
2. Stand up Postiz (VPS with Docker Compose, or Postiz Cloud) and connect the organization's social accounts.
3. Configure the RSS auto-post on `https://bayitmiklot.com/press/feed.xml` with approval required.
4. Enable `scheduled-pages-rebuild.yml` and test an embargoed release.
5. Publish the first real release and verify that the page, feed, sitemap and social posts are correct.

### Phase 6: Measure (ongoing)
1. Submit the sitemap in Search Console and Bing, then request indexing of key pages.
2. Review monthly: impressions and clicks for the target keywords, Core Web Vitals, and conversions (Get Help clicks, donations).
3. Build local citations: Jewish Federation of Greater Dallas directories, synagogue partner sites, SAMHSA findtreatment.gov (if eligible), GuideStar/Candid, and Google for Nonprofits.

### Target keyword themes
- Jewish sober living Dallas / kosher sober living Texas
- Jewish addiction recovery Dallas / Jewish rehab Texas
- Orthodox Jewish mental health support / frum recovery community
- Jewish recovery housing / transitional housing Dallas Jewish
- Recovery clubhouse Dallas / peer recovery community Dallas
- Donate Jewish recovery nonprofit / Jewish mental health charity Dallas

### Rollback
Every phase is a single pull request. Reverting the merge commit on GitHub restores the previous site within the next Pages build, which takes about one minute.
