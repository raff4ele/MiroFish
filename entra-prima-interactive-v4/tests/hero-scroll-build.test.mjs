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


/* V20 — interactive 3D AFTER experience */
assert.match(html,/data-ep3d/,'interactive 3D experience required');
assert.equal((html.match(/data-ep3d-panel=/g)||[]).length,7,'7 3D visual panels required');
assert.match(html,/ep3d-world/);
assert.match(html,/ep3d-core/);
assert.match(css,/perspective:1100px/);
assert.match(css,/transform-style:preserve-3d/);
assert.match(js,/data-ep3d-viewport/);
assert.match(js,/pointerdown/);
assert.match(js,/setPointerCapture/);

const siteHtml=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const siteCss=fs.readFileSync(new URL('../styles.css',import.meta.url),'utf8');
const siteJs=fs.readFileSync(new URL('../script.js',import.meta.url),'utf8');

assert.ok(siteHtml.includes('f4edb58c-a2a3-4638-a765-0e683483fbd3.mp4'),'clean loop video must be embedded');
assert.match(siteHtml,/<video[^>]*autoplay[^>]*muted[^>]*loop[^>]*playsinline/i,'video must autoplay muted loop inline');
assert.ok(!siteHtml.match(/<video[^>]*controls/i),'video controls must be absent');
assert.match(siteCss,/\.ep3d-panel video/,'3D panel video styling required');
assert.match(siteJs,/querySelector\('video'\)/,'3D video playback management required');

console.log('3d-video-loop test: PASS');
