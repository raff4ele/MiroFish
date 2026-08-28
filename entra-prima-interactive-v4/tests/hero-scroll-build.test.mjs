import fs from 'node:fs';
import assert from 'node:assert/strict';

const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../styles.css',import.meta.url),'utf8');

assert.match(html,/class="brand"/,'site logo must remain in top-left');
assert.match(html,/brand-mark/,'EP mark required');
assert.match(html,/brand-name/,'ENTRA PRIMA name required');
assert.match(html,/data-floating-hero/,'hero required');
assert.match(html,/a6565366-11ca-42f3-a8ec-699c085b371e\.png/,'approved hero image required');

assert.match(css,/@media\(max-width:720px\)/,'mobile breakpoint required');
assert.match(css,/\.floating-hero__picture\s*\{/);
assert.match(css,/aspect-ratio:4\s*\/\s*3/,'mobile hero image must preserve source ratio');
assert.match(css,/\.topbar-note\{display:none/,'mobile secondary nav note must hide');
assert.match(css,/\.brand-mark/,'brand mark must be styled');
assert.match(css,/\.brand-name/,'brand name must be styled');

for(const id of ['engine','perception','difference','measurement','finale']){
  assert.ok(html.includes(`id="${id}"`),`${id} must remain`);
}
console.log('mobile-first hero test: PASS');
