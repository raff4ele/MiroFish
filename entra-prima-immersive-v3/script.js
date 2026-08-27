import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const clamp = (n, a = 0, b = 1) => Math.min(b, Math.max(a, n));
const lerp = (a, b, t) => a + (b - a) * t;
const damp = (current, target, lambda, dt) => THREE.MathUtils.damp(current, target, lambda, dt);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

function sceneProgress(section, vh = window.innerHeight) {
  const rect = section.getBoundingClientRect();
  if (rect.bottom <= 0 || rect.top >= vh) return 0;
  const travel = Math.max(1, rect.height - vh);
  return clamp(-rect.top / travel, 0, 1);
}

const sections = [...document.querySelectorAll('[data-scene]')];
const indexLinks = [...document.querySelectorAll('.scene-index a')];
const sceneState = new Map(sections.map(section => [section.id, 0]));

function initLenis() {
  if (reducedMotion || !finePointer || window.innerWidth < 900) return;
  import('https://cdn.jsdelivr.net/npm/lenis@1.3.11/+esm').then(({ default: Lenis }) => {
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: .92, touchMultiplier: 1 });
    const raf = time => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }).catch(() => {});
}
initLenis();

function rendererFor(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(new RoomEnvironment(), .04).texture;
  pmrem.dispose();
  return { renderer, environment };
}

function syncRenderer(renderer, canvas, camera) {
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const mobile = window.innerWidth <= 720;
  const ratio = Math.min(window.devicePixelRatio || 1, mobile ? 1.35 : 1.8);
  const w = Math.max(1, Math.floor(rect.width * ratio));
  const h = Math.max(1, Math.floor(rect.height * ratio));
  if (canvas.width !== w || canvas.height !== h) {
    renderer.setSize(rect.width, rect.height, false);
    renderer.setPixelRatio(ratio);
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
  }
}

function physical(color, options = {}) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: options.roughness ?? .24,
    metalness: options.metalness ?? .62,
    clearcoat: options.clearcoat ?? .65,
    clearcoatRoughness: options.clearcoatRoughness ?? .16,
    transmission: options.transmission ?? 0,
    transparent: (options.transmission ?? 0) > 0 || (options.opacity ?? 1) < 1,
    opacity: options.opacity ?? 1,
    thickness: options.thickness ?? .45,
    ior: options.ior ?? 1.42,
    emissive: options.emissive ?? 0x000000,
    emissiveIntensity: options.emissiveIntensity ?? 0,
    side: THREE.DoubleSide
  });
}

function roundedMesh(size, material, radius = .12) {
  const geo = new RoundedBoxGeometry(size[0], size[1], size[2], 5, radius);
  const mesh = new THREE.Mesh(geo, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function addPointerMotion(stage, target) {
  const state = { x: 0, y: 0, tx: 0, ty: 0, dragging: false, lastX: 0, lastY: 0 };
  stage.addEventListener('pointerdown', e => {
    state.dragging = true; state.lastX = e.clientX; state.lastY = e.clientY;
  });
  stage.addEventListener('pointermove', e => {
    const rect = stage.getBoundingClientRect();
    if (state.dragging) {
      const dx = e.clientX - state.lastX, dy = e.clientY - state.lastY;
      state.tx += dx * .006; state.ty += dy * .004;
      state.lastX = e.clientX; state.lastY = e.clientY;
    } else if (e.pointerType !== 'touch') {
      state.tx = ((e.clientX - rect.left) / Math.max(1, rect.width) - .5) * .42;
      state.ty = ((e.clientY - rect.top) / Math.max(1, rect.height) - .5) * .24;
    }
  });
  const release = () => { state.dragging = false; if (!finePointer) { state.tx *= .55; state.ty *= .55; } };
  stage.addEventListener('pointerup', release); stage.addEventListener('pointercancel', release); stage.addEventListener('pointerleave', release);
  target.userData.pointerState = state;
  return state;
}

function buildHeroScene() {
  const canvas = document.getElementById('hero-webgl');
  const stage = canvas?.closest('[data-pointer-stage]');
  if (!canvas || !stage) return null;
  const { renderer, environment } = rendererFor(canvas);
  const scene = new THREE.Scene(); scene.environment = environment;
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 100); camera.position.set(0, 0, 8.3);
  const root = new THREE.Group(); scene.add(root);

  const key = new THREE.DirectionalLight(0xffffff, 4.1); key.position.set(4, 6, 6); key.castShadow = true; scene.add(key);
  const fill = new THREE.DirectionalLight(0x8b96ff, 2.3); fill.position.set(-5, 1, 4); scene.add(fill);
  const rim = new THREE.PointLight(0xd9ff43, 24, 12, 1.7); rim.position.set(1, -2, 3); scene.add(rim);

  const ink = physical(0x151515, { metalness: .76, roughness: .18, clearcoat: .82 });
  const acid = physical(0xd9ff43, { metalness: .22, roughness: .3, clearcoat: .8, emissive: 0x304000, emissiveIntensity: .16 });
  const blue = physical(0x4f63ff, { metalness: .35, roughness: .22, clearcoat: .8 });
  const glass = physical(0xffffff, { metalness: 0, roughness: .08, clearcoat: 1, transmission: .88, opacity: .72, thickness: .6, ior: 1.3 });

  const bars = [];
  const addBar = (size, pos, mat = ink) => {
    const m = roundedMesh(size, mat, Math.min(size[0], size[1], size[2]) * .22);
    m.position.set(...pos); m.userData.base = m.position.clone(); root.add(m); bars.push(m); return m;
  };
  // Extruded E
  addBar([.34, 2.45, .44], [-1.55, 0, 0]);
  addBar([1.46, .32, .44], [-.94, 1.06, 0]);
  addBar([1.18, .32, .44], [-1.08, 0, 0], acid);
  addBar([1.46, .32, .44], [-.94, -1.06, 0]);
  // Extruded P
  addBar([.34, 2.45, .44], [.15, 0, 0]);
  addBar([1.46, .32, .44], [.78, 1.06, 0], blue);
  addBar([1.36, .32, .44], [.72, 0, 0]);
  addBar([.34, 1.36, .44], [1.34, .55, 0]);

  const plates = [];
  [[2.95,1.7,.07,glass], [2.35,1.15,.08,blue], [1.72,.74,.09,acid]].forEach(([w,h,d,mat], i) => {
    const p = roundedMesh([w,h,d], mat, .06); p.position.z = -.5 - i*.34; p.userData.baseZ = p.position.z; p.rotation.z = (i-1)*.025; root.add(p); plates.push(p);
  });
  const rail = roundedMesh([3.55,.035,.035], acid, .01); rail.position.set(0,-1.52,-.1); root.add(rail);

  const pointer = addPointerMotion(stage, root);
  return { canvas, renderer, scene, camera, root, bars, plates, pointer, rim };
}

function buildObjectScene() {
  const canvas = document.getElementById('object-webgl');
  const stage = canvas?.closest('[data-object-stage]');
  if (!canvas || !stage) return null;
  const { renderer, environment } = rendererFor(canvas);
  const scene = new THREE.Scene(); scene.environment = environment;
  const camera = new THREE.PerspectiveCamera(31, 1, .1, 100); camera.position.set(0, .05, 9.2);
  const root = new THREE.Group(); scene.add(root);
  const key = new THREE.DirectionalLight(0xffffff, 4.5); key.position.set(5, 6, 6); key.castShadow = true; scene.add(key);
  const rim = new THREE.PointLight(0x4f63ff, 34, 13, 1.8); rim.position.set(-3,-1,4); scene.add(rim);
  const warm = new THREE.PointLight(0xff5c4d, 22, 10, 2); warm.position.set(4,-2,3); scene.add(warm);

  const chrome = physical(0xd9d9d5, { metalness: .94, roughness: .14, clearcoat: .9 });
  const ink = physical(0x151515, { metalness: .68, roughness: .2, clearcoat: .88 });
  const glass = physical(0xffffff, { metalness: 0, roughness: .06, transmission: .92, opacity: .68, thickness: .75, clearcoat: 1, ior: 1.28 });
  const acid = physical(0xd9ff43, { metalness: .16, roughness: .3, clearcoat: .9 });
  const blue = physical(0x4f63ff, { metalness: .4, roughness: .18, clearcoat: .9 });

  // A physical browser/experience object rather than a decorative primitive.
  const frame = new THREE.Group(); root.add(frame);
  const top = roundedMesh([4.6,.22,.28], chrome,.08); top.position.y=2.2; frame.add(top);
  const bottom = roundedMesh([4.6,.22,.28], chrome,.08); bottom.position.y=-2.2; frame.add(bottom);
  const left = roundedMesh([.22,4.22,.28], chrome,.08); left.position.x=-2.2; frame.add(left);
  const right = roundedMesh([.22,4.22,.28], chrome,.08); right.position.x=2.2; frame.add(right);

  const layers = [];
  const back = roundedMesh([4.2,3.9,.08], ink,.12); back.position.z=-.5; root.add(back); layers.push(back);
  const glassPanel = roundedMesh([3.7,3.3,.07], glass,.14); glassPanel.position.z=-.15; root.add(glassPanel); layers.push(glassPanel);
  const accent = roundedMesh([2.9,1.35,.1], acid,.14); accent.position.set(-.3,.62,.15); root.add(accent); layers.push(accent);
  const info = roundedMesh([2.45,.62,.1], blue,.1); info.position.set(.48,-.76,.32); root.add(info); layers.push(info);
  const cta = roundedMesh([1.3,.42,.18], chrome,.12); cta.position.set(.88,-1.5,.55); root.add(cta); layers.push(cta);
  layers.forEach(l => l.userData.base = l.position.clone());

  // Meaningful content bars inside the physical interface.
  for (let i=0;i<4;i++) {
    const line = roundedMesh([1.5 - i*.17,.055,.06], i===0?acid:chrome,.02);
    line.position.set(-.72,1.45-i*.16,.48+i*.015); line.userData.base=line.position.clone(); root.add(line); layers.push(line);
  }
  const pointer = addPointerMotion(stage, root);
  return { canvas, renderer, scene, camera, root, frame, layers, pointer, rim, warm };
}

const hero3d = buildHeroScene();
const object3d = buildObjectScene();
const clock = new THREE.Clock();

function updateHero3d(dt, p) {
  if (!hero3d) return;
  const { root, bars, plates, pointer, camera, rim } = hero3d;
  pointer.x = damp(pointer.x, pointer.tx, 6.2, dt); pointer.y = damp(pointer.y, pointer.ty, 6.2, dt);
  const motionP = reducedMotion ? .28 : p;
  root.rotation.y = damp(root.rotation.y, pointer.x + motionP*.36, 5, dt);
  root.rotation.x = damp(root.rotation.x, -pointer.y + motionP*.08, 5, dt);
  root.rotation.z = damp(root.rotation.z, motionP*-.06, 5, dt);
  root.scale.setScalar(lerp(1, .82, motionP));
  bars.forEach((bar, i) => {
    const dir = i < 4 ? -1 : 1;
    const spread = clamp((motionP-.12)*1.35,0,1);
    bar.position.x = bar.userData.base.x + dir * spread * (.14 + (i%4)*.055);
    bar.position.y = bar.userData.base.y + Math.sin(i*2.1)*spread*.12;
    bar.position.z = spread * (.22 + i*.055);
  });
  plates.forEach((plate,i)=>{
    const spread = clamp((motionP-.22)*1.4,0,1);
    plate.position.z = plate.userData.baseZ - spread*(.7+i*.45);
    plate.position.x = (i-1)*spread*.32;
    plate.rotation.y = (i-1)*spread*.08;
  });
  camera.position.z = lerp(8.3, 6.8, clamp(motionP*1.2,0,1));
  rim.intensity = lerp(20,40,motionP);
}

function updateObject3d(dt, p) {
  if (!object3d) return;
  const { root, layers, pointer, camera, rim, warm } = object3d;
  pointer.x = damp(pointer.x, pointer.tx, 5.8, dt); pointer.y = damp(pointer.y, pointer.ty, 5.8, dt);
  const motionP = reducedMotion ? .5 : p;
  root.rotation.y = damp(root.rotation.y, pointer.x + lerp(-.16,.26,motionP), 5.3, dt);
  root.rotation.x = damp(root.rotation.x, -pointer.y + lerp(.07,-.08,motionP), 5.3, dt);
  root.rotation.z = damp(root.rotation.z, Math.sin(motionP*Math.PI)*-.055, 5.3, dt);
  layers.forEach((layer,i)=>{
    const base = layer.userData.base;
    if (!base) return;
    const explode = Math.sin(clamp(motionP,0,1)*Math.PI);
    const lane = (i%3)-1;
    layer.position.x = base.x + lane*explode*.28;
    layer.position.y = base.y + Math.sin(i*1.7)*explode*.12;
    layer.position.z = base.z + explode*(.32+i*.21);
  });
  camera.position.z = lerp(9.2,7.65,Math.sin(motionP*Math.PI)*.65);
  rim.intensity = lerp(24,42,Math.sin(motionP*Math.PI));
  warm.intensity = lerp(14,28,clamp((motionP-.35)*1.7,0,1));
}

function updateSceneVariables() {
  const vh = window.innerHeight;
  let active = sections[0]?.id;
  let best = Infinity;
  for (const section of sections) {
    const p = sceneProgress(section, vh);
    sceneState.set(section.id, p);
    section.style.setProperty('--p', p.toFixed(5));
    section.style.setProperty('--phase', Math.floor(p*4));
    const rect = section.getBoundingClientRect();
    if (rect.bottom > vh*.35 && rect.top < vh*.65) {
      const d = Math.abs(rect.top - vh*.12);
      if (d < best) { best = d; active = section.id; }
    }
  }
  indexLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === `#${active}`));
}

function renderFrame() {
  const dt = Math.min(clock.getDelta(), .05);
  updateSceneVariables();
  const hp = sceneState.get('hero') || 0;
  const op = sceneState.get('three-d') || 0;
  updateHero3d(dt, hp);
  updateObject3d(dt, op);

  if (hero3d) {
    syncRenderer(hero3d.renderer, hero3d.canvas, hero3d.camera);
    hero3d.renderer.render(hero3d.scene, hero3d.camera);
  }
  if (object3d) {
    syncRenderer(object3d.renderer, object3d.canvas, object3d.camera);
    object3d.renderer.render(object3d.scene, object3d.camera);
  }
  requestAnimationFrame(renderFrame);
}
requestAnimationFrame(renderFrame);

// Keep interaction controls intentionally small and physical.
document.querySelector('[data-replay]')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' }));

document.querySelector('.menu-index')?.addEventListener('click', e => {
  const button = e.currentTarget;
  const open = button.getAttribute('aria-expanded') !== 'true';
  button.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('show-index', open);
});

window.addEventListener('resize', () => updateSceneVariables(), { passive: true });
window.addEventListener('orientationchange', () => setTimeout(updateSceneVariables, 120), { passive: true });

// Exposed only for deterministic runtime tests.
window.__ENTRA_PRIMA_V3__ = { sceneProgress, sceneState, reducedMotion };
