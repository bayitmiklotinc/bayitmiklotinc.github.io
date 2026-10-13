// QA check for the navigation fixes. Usage:
//   npm i -D playwright && npx playwright install chromium
//   python3 -m http.server 8765 &   (or: bundle exec jekyll serve --port 8765)
//   node tools/check_nav.mjs http://localhost:8765/index.html
// Exits non-zero if desktop labels are misaligned or the mobile menu
// overlaps / cannot reach its last item at any tested viewport.
import { chromium } from 'playwright';
const url = process.argv[2] || 'http://localhost:8765/index.html';
const b = await chromium.launch(); let fail = false;
for (const [w, h] of [[1280, 800], [1000, 800]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } }); await p.goto(url);
  const bottoms = await p.$$eval('.site-nav > a, .has-dropdown > a', els => els.map(e => {
    const r = document.createRange(); r.selectNodeContents(e.firstChild); return r.getBoundingClientRect().bottom; }));
  const spread = Math.max(...bottoms) - Math.min(...bottoms);
  const rows = new Set((await p.$$eval('.site-nav > *', els => els.map(e => Math.round(e.getBoundingClientRect().top / 20)))));
  console.log(`${w}x${h} text-baseline spread=${spread.toFixed(1)}px rows=${rows.size}`);
  if (spread > 1 || rows.size > 1) fail = true; await p.close();
}
for (const [w, h] of [[320, 568], [375, 667], [390, 844], [667, 375], [844, 390]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } }); await p.goto(url);
  await p.click('.nav-toggle-label'); await p.waitForTimeout(350);
  const r = await p.$eval('.site-nav', n => {
    const a = [...n.querySelectorAll('a')].map(x => x.getBoundingClientRect());
    let overlaps = 0; for (let i = 1; i < a.length; i++) if (a[i].top < a[i - 1].bottom - 1) overlaps++;
    n.scrollTop = 1e6; const last = n.querySelector('a:last-of-type, .nav-donate').getBoundingClientRect();
    return { overlaps, lastReachable: last.bottom <= innerHeight + 1 };
  });
  console.log(`${w}x${h} overlaps=${r.overlaps} lastReachable=${r.lastReachable}`);
  if (r.overlaps || !r.lastReachable) fail = true; await p.close();
}
await b.close(); process.exit(fail ? 1 : 0);
