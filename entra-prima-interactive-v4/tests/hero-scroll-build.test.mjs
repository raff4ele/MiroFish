import fs from 'node:fs';
import assert from 'node:assert/strict';

const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../styles.css',import.meta.url),'utf8');
const js=fs.readFileSync(new URL('../script.js',import.meta.url),'utf8');

assert.match(html,/data-immersive-hero/);
assert.match(html,/immersive-hero__word/);
assert.match(html,/immersive-hero__house/);
assert.match(html,/a6565366-11ca-42f3-a8ec-699c085b371e\.png/);
assert.ok(!html.includes('data-floating-hero'),'old flat hero must be removed');

assert.match(css,/@keyframes immersiveWordFloat/);
assert.match(css,/@keyframes immersiveHouseFloat/);
assert.match(css,/\.immersive-hero__word/);
assert.match(css,/\.immersive-hero__house/);
assert.match(css,/@media\(max-width:720px\)/);
assert.match(css,/\.brand-mark/);
assert.match(js,/data-immersive-hero/);
assert.match(js,/--immersive-scroll/);
assert.match(js,/requestAnimationFrame/);

for(const id of ['engine','perception','difference','measurement','finale']){
  assert.ok(html.includes(`id="${id}"`),`${id} must remain`);
}
console.log('immersive-layered-hero test: PASS');
