import fs from 'node:fs';
import assert from 'node:assert/strict';

const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../styles.css',import.meta.url),'utf8');
const js=fs.readFileSync(new URL('../script.js',import.meta.url),'utf8');

const finalHero='a6565366-11ca-42f3-a8ec-699c085b371e.png';

assert.match(html,/data-floating-hero/);
assert.ok(html.includes(finalHero),'must use the approved final hero image');
assert.ok(!html.includes('floating-hero__wordmark'),'duplicate HTML wordmark must be removed');
assert.match(html,/floating-hero__backdrop/);
assert.match(html,/floating-hero__picture/);

assert.match(css,/\.floating-hero__picture img/);
assert.match(css,/object-fit:contain/,'foreground image must never crop');
assert.match(css,/\.floating-hero__backdrop/);
assert.match(css,/@keyframes heroImageFloat/);
assert.match(js,/data-floating-hero/);
assert.match(js,/--hero-scroll/);

for(const id of ['engine','perception','difference','measurement','finale']){
  assert.ok(html.includes(`id="${id}"`),`${id} must remain`);
}
console.log('final-fit-hero test: PASS');
