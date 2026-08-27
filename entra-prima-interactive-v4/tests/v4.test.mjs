import fs from 'node:fs';

const root = new URL('..', import.meta.url).pathname;
const required = ['index.html','styles.css','script.js'];
for (const file of required) {
  if (!fs.existsSync(root + file)) throw new Error('missing ' + file);
}
const html = fs.readFileSync(root + 'index.html','utf8');
const css = fs.readFileSync(root + 'styles.css','utf8');
const js = fs.readFileSync(root + 'script.js','utf8');

const must = [
  ['one immersive canvas', (html.match(/<canvas/g)||[]).length === 1],
  ['three-dot menu', /menu-dots/.test(html) && /menu-panel/.test(html)],
  ['website explanation', /SITI IMMERSIVI/.test(html)],
  ['world ads explanation', /ADS MONDIALI/.test(html)],
  ['conversion explanation', /CONVERSIONE/.test(html)],
  ['interactive modes', /data-mode="site"/.test(html) && /data-mode="ads"/.test(html) && /data-mode="global"/.test(html) && /data-mode="action"/.test(html)],
  ['no client portfolio', !/Luigi Monza|GM Gioielli|Domenico Tesoro/i.test(html)],
  ['no videos or iframes', !/<video|<iframe/i.test(html)],
  ['no scroll progress engine', !/sceneProgress|ScrollTrigger/.test(js)],
  ['intersection reveals', /IntersectionObserver/.test(js)],
  ['real webgl', /WebGLRenderer/.test(js) && /MeshPhysicalMaterial/.test(js)],
  ['mobile layout', /@media\s*\(max-width:\s*720px\)/.test(css)],
];
const failed = must.filter(([,ok])=>!ok).map(([name])=>name);
if (failed.length) {
  console.error('FAIL:', failed.join(', '));
  process.exit(1);
}
console.log('interactive v4 contract: PASS');
