import fs from 'node:fs';
import assert from 'node:assert/strict';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const js = fs.readFileSync(new URL('../script.js', import.meta.url), 'utf8');

const emptySite = '22063d22-a12a-4f3b-b74b-9b69455af66a';
const finalHero = '527640ad-5708-4b15-ada8-cfd6ac887d43';

assert.match(html, /data-build-hero/, 'hero must expose data-build-hero');
assert.ok(html.includes(emptySite), 'hero must start from generated empty-site frame');
assert.ok(html.includes(finalHero), 'hero must use approved final architectural reference');
assert.ok((html.match(/data-build-piece/g) || []).length >= 6, 'hero must contain at least six construction pieces');
assert.match(html, /data-final-scene/, 'hero must contain a final scene layer');
assert.match(html, /data-final-wordmark/, 'hero must contain delayed ENTRA PRIMA wordmark');
assert.ok(!html.includes('architectural-final-foreground" aria-hidden="true"><img src="https://d2ol7oe51mr4n9.cloudfront.net/user_39aFzNjMLgKsNfI0IjCLA8xTUEc/2db11e04'), 'old permanently visible foreground must be removed');

assert.match(css, /--build-progress/, 'CSS must expose build progress variable');
assert.match(css, /\.build-piece/, 'CSS must style build pieces');
assert.match(css, /\.final-scene/, 'CSS must style final scene');
assert.match(js, /data-build-hero/, 'JS must bind the build hero');
assert.match(js, /--build-progress/, 'JS must drive build progress');
assert.match(js, /requestAnimationFrame/, 'scroll updates must be rAF-throttled');

assert.ok(html.includes('id="engine"'), 'engine section must remain');
assert.ok(html.includes('id="perception"'), 'perception section must remain');
assert.ok(html.includes('id="measurement"'), 'measurement section must remain');
assert.ok(html.includes('id="finale"'), 'finale section must remain');

console.log('hero-scroll-build test: PASS');
