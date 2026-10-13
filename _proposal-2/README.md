# Proposal 2: card logos and website policies

Local proposal only. Nothing here is committed or pushed. The leading underscore keeps
GitHub Pages from publishing this folder.

Every change lands in the site root or in `assets/`. No build tools, includes or new
folders outside `assets/` are needed.

## What changes

| Change | Files |
|---|---|
| One new page holding all five policies, with a contents list and a section for each: Privacy Policy, Terms of Service, Refund, Cancellation and Shipping | `policies.html` |
| Footer on all 13 existing pages gets five policy links, each jumping to its section (for example `policies.html#refund-policy`), plus Visa, Mastercard, Discover and American Express logos. That is 16 added lines per page, with nothing removed | every existing `*.html` in the root |
| Footer and policies page styles (72 added lines, nothing removed) | `style.css` |
| Card logo images, with Apache-2.0 license and notice | `assets/cards/` |

## How to apply

Either copy the files over the root:

    cp -r _proposal-2/*.html _proposal-2/style.css _proposal-2/assets .

Or apply the patch, which was checked against the working tree on 2026-10-13:

    git apply _proposal-2/changes.patch

If any page footer was edited after 2026-10-13, use the patch (it will refuse rather
than overwrite), or re-copy the 16-line `footer-legal` block by hand.

## Before publishing

- **Legal review:** the policies are drafts written from what the site shows (Stripe
  card donations, The Donors' Fund, donor-advised funds, the Google Ads tag). Have the
  board or counsel approve them. `policies.html` carries a `DRAFT FOR REVIEW` HTML comment.
- **Facts to confirm:**
  - The legal name is used as "Bayit Miklot Inc.".
  - Refund requests are accepted within 30 days, with a reply within 5 business days.
  - Recurring donations need 3 business days' notice to cancel.
  - Whether the Stripe Payment Link offers recurring gifts or a "manage donation" link in receipts.
  - Whether a mailing address should be added to the "Contact us" sections.
- **Single page, separate links:** card processors often ask for a URL per policy.
  Give them the section links, such as `https://bayitmiklot.com/policies.html#privacy-policy`.
- **If a GA4 tag, email newsletter tool or contact form is added later,** update the Privacy Policy.

## Card logo source

"flat-rounded" icons from https://github.com/aaronfagan/svg-credit-card-payment-icons
(Apache License 2.0). The brand marks belong to their owners and indicate accepted payment
methods only.
