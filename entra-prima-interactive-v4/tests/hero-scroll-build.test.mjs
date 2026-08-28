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


/* V20 — rich reference mini-site inside AFTER panel */
assert.match(html,/reference-site-demo/,'reference mini-site required');
assert.match(html,/reference-site-hero/,'reference hero required');
assert.match(html,/reference-media-track/,'reference media rail required');
assert.equal((html.match(/<figure>/g)||[]).length,14,'7 references duplicated for seamless rail');
assert.ok(html.includes('be488eb2-cbd8-4aac-aded-7aa5c5a203ac.jpg'),'reference photo required');
for(const id of [
  '9d268ed4-da7b-4636-a37d-09d96cd34391',
  'a76c6f4a-19ef-4711-a479-3699915ebf30',
  '76125208-c2c9-441e-a7d9-573d7f93276a',
  '24b1ef3d-8455-4ad3-8d69-67c955e0ece6',
  '143ecce7-438b-4a6f-871f-fa55a7c69d5a',
  '66fcbdf0-5381-4ef5-b118-4772cb9653fb'
]) assert.ok(html.includes(id),`reference frame ${id} required`);
assert.match(css,/@keyframes referenceFeatureBreath/);
assert.match(css,/@keyframes referenceRail/);


const siteHtml=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const siteCss=fs.readFileSync(new URL('../styles.css',import.meta.url),'utf8');
const siteJs=fs.readFileSync(new URL('../script.js',import.meta.url),'utf8');

assert.ok(siteHtml.includes('f4edb58c-a2a3-4638-a765-0e683483fbd3.mp4'),'clean loop video must be embedded');
assert.match(siteHtml,/<video[^>]*autoplay[^>]*muted[^>]*loop[^>]*playsinline/i,'video must autoplay muted loop inline');
assert.ok(!siteHtml.match(/<video[^>]*controls/i),'video controls must be absent');
assert.match(siteCss,/\.ep3d-panel video/,'3D panel video styling required');
assert.match(siteJs,/querySelector\('video'\)/,'3D video playback management required');

console.log('3d-video-loop test: PASS');
