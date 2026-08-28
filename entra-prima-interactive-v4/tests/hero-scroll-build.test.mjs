import fs from 'node:fs';
import assert from 'node:assert/strict';

const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../styles.css',import.meta.url),'utf8');
const js=fs.readFileSync(new URL('../script.js',import.meta.url),'utf8');

const empty='0427e38f-3da2-4d09-8580-f8e7701d012f.png';
const final='527640ad-5708-4b15-ada8-cfd6ac887d43.jpg';

assert.match(html,/data-build-hero/);
assert.ok(html.includes(empty),'empty site must be same-CDN media');
assert.ok(html.includes(final),'approved final scene must remain');
assert.ok(!html.includes('data-build-canvas'),'canvas must be removed for WKWebView/TikTok compatibility');
assert.ok((html.match(/data-build-piece/g)||[]).length>=7,'must have progressive building pieces');
assert.match(html,/data-build-final/,'must have delayed final frame');

assert.match(css,/\.build-empty-image/);
assert.match(css,/\.build-piece/);
assert.match(css,/\.build-final-image/);
assert.match(js,/applyDomBuildProgress/);
assert.match(js,/requestAnimationFrame/);
assert.match(js,/FONDAZIONI/);
assert.match(js,/ENTRA PRIMA/);

for(const id of ['engine','perception','difference','measurement','finale']){
  assert.ok(html.includes(`id="${id}"`),`${id} must remain`);
}
console.log('hero-scroll-dom test: PASS');
