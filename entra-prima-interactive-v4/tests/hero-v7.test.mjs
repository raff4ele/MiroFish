import fs from 'node:fs';

const root = new URL('..', import.meta.url).pathname;
const html = fs.readFileSync(root + 'index.html','utf8');
const css = fs.readFileSync(root + 'styles.css','utf8');
const js = fs.readFileSync(root + 'script.js','utf8');

const checks = [
  ['architectural hero exists', /class="architectural-hero/.test(html)],
  ['exact hero image wired', /527640ad-5708-4b15-ada8-cfd6ac887d43\.jpg/.test(html)],
  ['hero appears before engine', html.indexOf('architectural-hero') >= 0 && html.indexOf('architectural-hero') < html.indexOf('engine-section')],
  ['old v6 hero removed', !/hero-v6/.test(html)],
  ['hero scroll progress css', /--hero-progress/.test(css)],
  ['hero scroll handler', /architecturalHero/.test(js) && /requestAnimationFrame/.test(js)],
  ['engine still present', /id="engine"/.test(html)],
  ['perception still present', /id="perception"/.test(html)],
  ['difference still present', /id="difference"/.test(html)],
  ['measurement still present', /id="measurement"/.test(html)],
  ['finale still present', /id="finale"/.test(html)],
  ['four visual tabs preserved', (html.match(/data-mode="(?:site|ads|global|action)"/g)||[]).length === 4]
];

const failed = checks.filter(([,ok])=>!ok).map(([name])=>name);
if (failed.length) {
  console.error('FAIL:', failed.join(', '));
  process.exit(1);
}
console.log('hero v7 contract: PASS');
