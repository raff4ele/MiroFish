import fs from 'node:fs';
import assert from 'node:assert/strict';
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../styles.css',import.meta.url),'utf8');
const js=fs.readFileSync(new URL('../script.js',import.meta.url),'utf8');

assert.match(html,/data-build-hero/);
assert.match(html,/class="build-empty-image"/);
assert.match(html,/class="build-svg"/);
assert.ok((html.match(/data-build-piece/g)||[]).length>=7,'SVG must have seven build pieces');
assert.match(html,/<clipPath/,'SVG clip paths required');
assert.match(html,/data-build-final/);
assert.ok(!css.includes('.build-piece--foundation{clip-path'),'CSS clip-path implementation must not be active');
assert.match(css,/\.build-svg/);
assert.match(js,/applySvgBuildProgress/);
assert.match(js,/requestAnimationFrame/);
for(const s of ['FONDAZIONI','STRUTTURA','VOLUMI','VETRI','FINITURE','ENTRA PRIMA']) assert.ok(js.includes(s));
for(const id of ['engine','perception','difference','measurement','finale']) assert.ok(html.includes(`id="${id}"`));
console.log('hero-scroll-svg test: PASS');
