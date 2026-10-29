# bayitmiklot.com

Public website for Bayit Miklot Inc., hosted on GitHub Pages. GitHub builds the
site with Jekyll whenever `main` changes, so there is no separate build step.

## Where things live

| What | File |
|---|---|
| Phone, email, EIN, legal name, founder details | `_data/site.yml` |
| Main menu | `_data/navigation.yml` |
| Shared `<head>`, Google tag, structured data | `_includes/head.html`, `_includes/schema.html` |
| Header and footer (every page) | `_includes/header.html`, `_includes/footer.html` |
| Page shell | `_layouts/default.html` |
| Styles, including dark mode | `style.css` |
| Menu keyboard and touch behavior | `assets/js/site.js` |
| Optimized photos (WebP) | `assets/si/webp/` (originals stay in `assets/si/`) |
| Fonts (self-hosted, open license) | `assets/fonts/` |
| Daily rebuild for dated press releases | `.github/workflows/scheduled-pages-rebuild.yml` |
| Press releases | `_press/` and `press/index.html` |

Each page starts with a short front-matter block (`title`, `description`). Those
values become the page title, search description, and social-share text, so keep
titles under about 50 characters and descriptions under about 155.

The founder page uses `footer_contact: founder`, so its footer shows Avi's
contact details. Every other page shows the general contact block.

## Preview locally

```
bundle install
bundle exec jekyll serve --livereload
```

Then open http://localhost:4000.

## Add a press release

1. Copy `_press/2026-01-01-example-press-release.md` to
   `_press/YYYY-MM-DD-short-title.md`.
2. Fill in the front matter, remove `published: false`, and write the release.
3. Commit to `main`. The release appears at `/press/`, in the sitemap, and in the
   RSS feed at `https://bayitmiklot.com/press/feed.xml`.

A release with a future date stays hidden until the site is rebuilt after that
date. The workflow in `.github/workflows/scheduled-pages-rebuild.yml` rebuilds the
site every morning (8:15 a.m. Dallas time), so embargoed releases go live on
their date. You can also run it by hand from the Actions tab.

### Crossposting with Postiz

[Postiz](https://github.com/gitroomhq/postiz-app) is a free, open-source,
actively maintained social media scheduler. It is AGPL-licensed and can be
self-hosted with Docker, or used through Postiz Cloud.

1. Install Postiz, or sign up for Postiz Cloud, and connect the organization's
   LinkedIn, Facebook, Instagram, X, Threads, and Bluesky accounts.
2. Add an RSS auto-post source for `https://bayitmiklot.com/press/feed.xml`.
3. Turn on approval, so each new release becomes a draft post to review before it
   goes out.

## Owner actions (outside the code)

These came up in the October 2026 compliance review. They need decisions or
facts that only the organization can provide.

- **Legal review:** have counsel review `policies.html` before relying on it.
- **Charitable registration:** confirm which states require registration for
  online solicitation, and add any required state disclosure statements to the
  Donate page.
- **Mailing address:** consider adding a mailing address (a PO box is fine) to
  the policies contact block.
- **Donation receipts:** customize the payment processor's receipt so gifts of
  $250 or more include the legal name, EIN, amount, date, and the sentence "No
  goods or services were provided in exchange for this contribution."
- **Payment processor dashboard:** set the public support email to
  info@bayitmiklot.com. Set the privacy and terms links to
  `https://bayitmiklot.com/policies.html#privacy-policy` and `#terms-of-service`.
- **Google Ads:**
  - Confirm that no remarketing or Customer Match lists exist.
  - Ads that promote addiction services in the US require LegitScript
    certification.
- **Health privacy:**
  - Ask counsel whether HIPAA or 42 CFR Part 2 applies to any part of the
    program.
  - Confirm that the email provider will sign a business associate agreement if
    one is needed.
- **Claims to keep on file:**
  - written support for the endorsement line in the footer
  - the "500+ calls" figure on the homepage
  - the impact figures on the Our Story page
- **Search:**
  - Verify the site in Google Search Console and Bing Webmaster Tools, and
    submit `https://bayitmiklot.com/sitemap.xml`.
  - Claim the Google Business Profile.
- **Donate page:** the "Become a Monthly Supporter" and "Give via DAF" buttons
  are hidden in Liquid comments until real links exist.

Recommended but not yet added: a site-wide 988 crisis line, and a note beside
each Get Help button asking people not to email medical details.

## Adding photos

Put the original in `assets/si/`, then create WebP copies (800px wide, plus
1600px for large photos) in `assets/si/webp/`. Reference them with a
`<picture>` element like the existing ones, and include `width`, `height`, and
`alt` on the `<img>`.
