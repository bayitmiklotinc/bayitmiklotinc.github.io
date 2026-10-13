#!/usr/bin/env bash
# Make web-sized AVIF/WebP copies of every photo (originals untouched).
# Needs ImageMagick 7 (`magick`) or: sudo apt-get install -y imagemagick webp
# Usage: tools/optimize_images.sh assets/si assets/img
set -euo pipefail
src=${1:-assets/si}; out=${2:-assets/img}; mkdir -p "$out"
for f in "$src"/*.{png,jpg,jpeg}; do
  [ -e "$f" ] || continue
  base=$(basename "${f%.*}")
  for w in 480 800 1600; do
    magick "$f" -auto-orient -strip -resize "${w}x>" -quality 72 "$out/$base-$w.webp"
    magick "$f" -auto-orient -strip -resize "${w}x>" -quality 55 "$out/$base-$w.avif"
  done
  echo "done: $base"
done
# Then rename to descriptive, keyword-bearing names (e.g. img2 -> home-shabbos-table)
# and update <img>/<picture> tags. Delete img2_old.png and img3.old.png.
