import fs from 'node:fs';
const path=new URL('../index.html', import.meta.url).pathname;
if(!fs.existsSync(path)){ console.error('FAIL: wrapper index missing'); process.exit(1); }
const html=fs.readFileSync(path,'utf8');
const checks=[
 ['exact user hero',/527640ad-5708-4b15-ada8-cfd6ac887d43\.jpg/.test(html)],
 ['loads current approved site',/entra-prima-strategy-v6/.test(html)],
 ['removes old hero only',/querySelector\('\.hero-v6'\)/.test(html)],
 ['architectural hero inserted',/architectural-hero/.test(html)],
 ['local scroll progress',/--hero-progress/.test(html)&&/requestAnimationFrame/.test(html)],
 ['no iframe',!/<iframe/i.test(html)]
];
const failed=checks.filter(([,ok])=>!ok).map(([n])=>n);
if(failed.length){console.error('FAIL:',failed.join(', '));process.exit(1)}
console.log('wrapper hero v7: PASS');
