import fs from 'node:fs';
import assert from 'node:assert/strict';

const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../styles.css',import.meta.url),'utf8');
const js=fs.readFileSync(new URL('../script.js',import.meta.url),'utf8');

assert.match(html,/data-immersive-hero/);
assert.match(html,/immersive-hero__word-float/);
assert.match(html,/immersive-hero__house-float/);
assert.match(html,/class="brand"/);

assert.match(css,/V16 — static hero with light effects/);
assert.match(css,/\.immersive-hero__word-float,\s*\.immersive-hero__house-float\s*\{/);
assert.match(css,/animation:none!important/);
assert.match(css,/@keyframes heroFacadeLightV16/);
assert.match(css,/@keyframes heroWordLightV16/);
assert.match(css,/@keyframes heroAmbientLightV16/);

assert.match(js,/data-immersive-hero/);
assert.match(js,/--immersive-scroll/);
assert.match(js,/is-over-hero/);
assert.match(js,/requestAnimationFrame/);

for(const id of ['engine','perception','difference','measurement','finale']){
  assert.ok(html.includes(`id="${id}"`),`${id} must remain`);
}
console.log('static-light-hero test: PASS');


/* V22 — AFTER panel is video only */
assert.match(html,/after-panel--video-only/);
assert.match(html,/after-video-only/);
assert.ok(!html.includes('data-ep3d'),'3D overlays must be removed from AFTER panel');
assert.ok(!html.includes('ep3d-head'),'3D title overlay must be removed');
assert.ok(!html.includes('data-ep3d-dot'),'3D controls must be removed');
assert.match(css,/\.after-video-only video/);

const siteHtml=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const siteCss=fs.readFileSync(new URL('../styles.css',import.meta.url),'utf8');
const siteJs=fs.readFileSync(new URL('../script.js',import.meta.url),'utf8');

assert.ok(siteHtml.includes('f4edb58c-a2a3-4638-a765-0e683483fbd3.mp4'),'clean loop video must be embedded');
assert.match(siteHtml,/<video[^>]*autoplay[^>]*muted[^>]*loop[^>]*playsinline/i,'video must autoplay muted loop inline');
assert.ok(!siteHtml.match(/<video[^>]*controls/i),'video controls must be absent');
assert.match(siteCss,/\.ep3d-panel video/,'3D panel video styling required');
assert.match(siteJs,/querySelector\('video'\)/,'3D video playback management required');

console.log('3d-video-loop test: PASS');
