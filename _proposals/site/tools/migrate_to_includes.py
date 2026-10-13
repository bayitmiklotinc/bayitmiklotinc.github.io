#!/usr/bin/env python3
"""Convert each hand-built page into a Jekyll page that uses _layouts/default.html.

For every top-level *.html page it:
  1. reads <title> and <meta name="description"> into YAML front matter
     (with the SEO title rewrites from seo_titles.yml when present),
  2. keeps <body class="..."> as body_class,
  3. removes <head>, the <header class="site-header"> block and the
     <footer class="site-footer"> block (now shared includes),
  4. writes the remaining body content back with the front matter on top.

Usage:  python3 tools/migrate_to_includes.py <site_dir> [--dry-run]
Run it on a branch, review `git diff`, then preview with `bundle exec jekyll serve`.
"""
import html, pathlib, re, sys

SKIP = {"clubhouse-standalone_7.html"}

def yaml_str(s: str) -> str:
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'

def load_overrides(root: pathlib.Path) -> dict:
    f = root / "tools" / "seo_titles.yml"
    out, cur = {}, None
    if not f.exists():
        return out
    for line in f.read_text().splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        if not line.startswith(" "):
            cur = line.rstrip(":").strip(); out[cur] = {}
        else:
            k, v = line.strip().split(":", 1)
            out[cur][k.strip()] = v.strip().strip('"')
    return out

def migrate(path: pathlib.Path, overrides: dict) -> str:
    src = path.read_text(encoding="utf-8")
    if src.lstrip().startswith("---"):
        return None  # already migrated
    title = re.search(r"<title>(.*?)</title>", src, re.S)
    desc = re.search(r'<meta name="description" content="(.*?)"', src, re.S)
    body_cls = re.search(r'<body[^>]*class="([^"]*)"', src)
    title = html.unescape(title.group(1)).strip() if title else ""
    # jekyll-seo-tag appends " | <site.title>", so drop the hand-written suffix.
    title = re.sub(r"\s*\|\s*Bayit Miklot.*$", "", title)
    desc = html.unescape(desc.group(1)).strip() if desc else ""
    o = overrides.get(path.name, {})
    title, desc = o.get("title", title), o.get("description", desc)

    body = re.search(r"<body[^>]*>(.*)</body>", src, re.S).group(1)
    body = re.sub(r'\s*<header class="site-header">.*?</header>\s*', "\n", body, count=1, flags=re.S)
    body = re.sub(r'\s*<!-- =+ FOOTER =+ -->\s*', "\n", body)
    body = re.sub(r'\s*<footer class="site-footer">.*?</footer>\s*', "\n", body, count=1, flags=re.S)
    body = body.replace("</img>", "")   # invalid closing tags found in index.html
    # Root-relative links so pages also work under /press/...
    body = re.sub(r'(href|src)="(?!https?:|mailto:|tel:|#|/)([^"]+)"', r'\1="/\2"', body)

    fm = ["---", f"title: {yaml_str(title)}", f"description: {yaml_str(desc)}"]
    if path.name == "404.html":
        fm.append("permalink: /404.html")
        fm.append("sitemap: false")
    if body_cls:
        fm.append(f"body_class: {yaml_str(body_cls.group(1))}")
    fm.append("---")
    return "\n".join(fm) + "\n" + body.strip() + "\n"

def main():
    root = pathlib.Path(sys.argv[1])
    dry = "--dry-run" in sys.argv
    overrides = load_overrides(root)
    for page in sorted(root.glob("*.html")):
        if page.name in SKIP:
            continue
        out = migrate(page, overrides)
        if out is None:
            print(f"skip (already has front matter): {page.name}"); continue
        print(f"{'would migrate' if dry else 'migrated'}: {page.name}")
        if not dry:
            page.write_text(out, encoding="utf-8")

if __name__ == "__main__":
    main()
