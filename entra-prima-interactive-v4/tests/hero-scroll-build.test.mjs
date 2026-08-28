import fs from 'node:fs';
import assert from 'node:assert/strict';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const js = fs.readFileSync(new URL('../script.js', import.meta.url), 'utf8');

const emptySite = '22063d22-a12a-4f3b-b74b-9b69455af66a';
const finalHero = '527640ad-5708-4b15-ada8-cfd6ac887d43';

assert.match(html, /data-build-hero/, 'hero must expose data-build-hero');
assert.match(html, /data-build-canvas/, 'hero must contain a canvas controlled by scroll');
assert.ok(html.includes(emptySite), 'hero must preload the empty-site frame');
assert.ok(html.includes(finalHero), 'hero must preload the approved final architectural frame');
assert.ok(!html.includes('data-build-piece'), 'DOM construction pieces must be removed');
assert.ok(!html.includes('data-final-scene'), 'old final-scene layer must be removed');

assert.match(css, /\.build-hero__canvas/, 'CSS must size the scroll canvas');
assert.match(css, /\.build-stage-readout/, 'stage readout must remain');
assert.match(js, /getContext\(['"]2d['"]/, 'JS must render using Canvas 2D');
assert.match(js, /drawImage/, 'JS must draw the construction sequence');
assert.match(js, /requestAnimationFrame/, 'scroll rendering must be rAF-throttled');
assert.match(js, /applyCanvasBuildProgress/, 'JS must expose deterministic progress renderer');
assert.match(js, /FONDAZIONI/, 'JS must include construction stages');
assert.match(js, /ENTRA PRIMA/, 'JS must delay the final brand stage');

assert.ok(html.includes('id="engine"'), 'engine section must remain');
assert.ok(html.includes('id="perception"'), 'perception section must remain');
assert.ok(html.includes('id="measurement"'), 'measurement section must remain');
assert.ok(html.includes('id="finale"'), 'finale section must remain');

console.log('hero-scroll-canvas test: PASS');
