import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const mobile = window.matchMedia('(max-width: 700px)').matches;
const qs = (selector, root = document) => root.querySelector(selector);
const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
let browserProgress = 0;

function initProjectVideos(){
  const videos = qsa('video');
  if (!videos.length) return;

  videos.forEach(video => {
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
  });

  if (reducedMotion){
    videos.forEach(video => {
      const hold = () => { try { video.currentTime = .08; } catch {} video.pause(); };
      if (video.readyState >= 2) hold(); else video.addEventListener('loadeddata', hold, { once:true });
    });
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting){
        const play = video.play();
        if (play?.catch) play.catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { rootMargin:'240px 0px', threshold:.08 });

  videos.forEach(video => observer.observe(video));
}

function createRenderer(canvas){
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha:true,
    antialias:!mobile,
    powerPreference:'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.15 : 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.04;
  renderer.setClearColor(0x000000, 0);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(new RoomEnvironment(), .035).texture;
  return { renderer, pmrem, environment };
}

function initBrowserScene(){
  const canvas = qs('#browser3d');
  const shell = qs('[data-browser-scene]');
  if (!canvas || !shell) return;

  const { renderer, pmrem, environment } = createRenderer(canvas);
  const scene = new THREE.Scene();
  scene.environment = environment;
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 100);
  camera.position.set(0, .05, 10.5);

  const root = new THREE.Group();
  scene.add(root);

  const frameMaterial = new THREE.MeshPhysicalMaterial({
    color:0x18191c,
    metalness:.72,
    roughness:.18,
    clearcoat:1,
    clearcoatRoughness:.1,
    envMapIntensity:1.1
  });
  const frame = new THREE.Mesh(new RoundedBoxGeometry(7.7, 4.92, .34, 8, .19), frameMaterial);
  frame.castShadow = true;
  root.add(frame);

  const video = document.createElement('video');
  video.src = 'https://d2ol7oe51mr4n9.cloudfront.net/user_39aFzNjMLgKsNfI0IjCLA8xTUEc/3e105ba2-0e5e-46e5-95b9-153f1c27ad4e.mp4';
  video.crossOrigin = 'anonymous';
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = 'auto';
  if (!reducedMotion) video.play().catch(() => {});

  const texture = new THREE.VideoTexture(video);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const screen = new THREE.Mesh(
    new RoundedBoxGeometry(7.28, 4.5, .045, 8, .13),
    new THREE.MeshPhysicalMaterial({ map:texture, roughness:.24, metalness:0, clearcoat:.7, clearcoatRoughness:.18, envMapIntensity:.35 })
  );
  screen.position.z = .205;
  root.add(screen);

  const bar = new THREE.Mesh(new RoundedBoxGeometry(7.28, .34, .055, 5, .11), new THREE.MeshPhysicalMaterial({ color:0xf5f1e8, roughness:.4, clearcoat:.25 }));
  bar.position.set(0, 2.07, .24);
  root.add(bar);

  const dotMaterial = new THREE.MeshStandardMaterial({ color:0x6c63ff, roughness:.35 });
  [-3.28,-3.05,-2.82].forEach((x,index) => {
    const dot = new THREE.Mesh(new THREE.SphereGeometry(.055, 16, 16), index === 0 ? dotMaterial : new THREE.MeshStandardMaterial({color:0xbdbab2,roughness:.5}));
    dot.position.set(x,2.07,.285);
    root.add(dot);
  });

  const layerMaterials = [
    new THREE.MeshPhysicalMaterial({color:0xf4f1ea,roughness:.42,metalness:0,transparent:true,opacity:.9}),
    new THREE.MeshPhysicalMaterial({color:0x6c63ff,roughness:.3,metalness:.05,transparent:true,opacity:.83}),
    new THREE.MeshPhysicalMaterial({color:0xffffff,roughness:.36,metalness:0,transparent:true,opacity:.92})
  ];
  const layers = layerMaterials.map((material, index) => {
    const mesh = new THREE.Mesh(new RoundedBoxGeometry(6.65 - index*.22, 3.82 - index*.15, .07, 7, .12), material);
    mesh.position.set(0,0,-.2 - index*.08);
    root.add(mesh);
    return mesh;
  });

  const hemi = new THREE.HemisphereLight(0xffffff, 0xb8b4a7, 1.5);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffffff, 2.35);
  key.position.set(4.5, 5.5, 7);
  scene.add(key);
  const violet = new THREE.DirectionalLight(0x8a82ff, 1.1);
  violet.position.set(-5, 1, 5);
  scene.add(violet);

  const pointer = { x:0, y:0, tx:0, ty:0, dragX:0, dragY:0, down:false, lx:0, ly:0 };
  const setPointer = event => {
    const rect = shell.getBoundingClientRect();
    pointer.tx = clamp((event.clientX - rect.left) / rect.width - .5, -.5, .5);
    pointer.ty = clamp((event.clientY - rect.top) / rect.height - .5, -.5, .5);
  };
  shell.addEventListener('pointermove', event => {
    setPointer(event);
    if (pointer.down){
      pointer.dragX = clamp(pointer.dragX + (event.clientX - pointer.lx) * .0019, -.15, .15);
      pointer.dragY = clamp(pointer.dragY + (event.clientY - pointer.ly) * .0016, -.09, .09);
      pointer.lx = event.clientX;
      pointer.ly = event.clientY;
    }
  }, { passive:true });
  shell.addEventListener('pointerdown', event => {
    pointer.down = true;
    pointer.lx = event.clientX;
    pointer.ly = event.clientY;
    shell.setPointerCapture?.(event.pointerId);
  });
  shell.addEventListener('pointerup', event => {
    pointer.down = false;
    shell.releasePointerCapture?.(event.pointerId);
  });
  shell.addEventListener('pointercancel', () => { pointer.down = false; });
  shell.addEventListener('pointerleave', () => { pointer.tx = 0; pointer.ty = 0; });

  let active = true;
  const observer = new IntersectionObserver(([entry]) => { active = entry.isIntersecting; }, { rootMargin:'250px 0px' });
  observer.observe(shell);

  function resize(){
    const rect = shell.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(shell);
  resize();

  const clock = new THREE.Clock();
  function animate(){
    requestAnimationFrame(animate);
    const dt = Math.min(.05, clock.getDelta());
    if (!active) return;

    pointer.x = THREE.MathUtils.damp(pointer.x, pointer.tx, 7.5, dt);
    pointer.y = THREE.MathUtils.damp(pointer.y, pointer.ty, 7.5, dt);
    if (!pointer.down){
      pointer.dragX = THREE.MathUtils.damp(pointer.dragX, 0, 4.5, dt);
      pointer.dragY = THREE.MathUtils.damp(pointer.dragY, 0, 4.5, dt);
    }

    const p = reducedMotion ? .12 : browserProgress;
    const rotY = -.12 + p*.31 + pointer.x*.08 + pointer.dragX;
    const rotX = .06 - p*.11 - pointer.y*.055 + pointer.dragY;
    root.rotation.y = THREE.MathUtils.damp(root.rotation.y, rotY, 6.5, dt);
    root.rotation.x = THREE.MathUtils.damp(root.rotation.x, rotX, 6.5, dt);
    root.position.x = THREE.MathUtils.damp(root.position.x, p*.35, 5.5, dt);
    root.position.y = THREE.MathUtils.damp(root.position.y, -.1 + p*.12, 5.5, dt);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, 10.5 - p*1.25, 5.5, dt);

    layers.forEach((layer, index) => {
      const spread = p * (index + 1);
      layer.position.x = THREE.MathUtils.damp(layer.position.x, (index - 1) * .34 * spread, 7, dt);
      layer.position.y = THREE.MathUtils.damp(layer.position.y, (1 - index) * .12 * spread, 7, dt);
      layer.position.z = THREE.MathUtils.damp(layer.position.z, -.34 - index*.24 - spread*.46, 7, dt);
      layer.rotation.z = THREE.MathUtils.damp(layer.rotation.z, (index - 1) * .015 * spread, 7, dt);
    });

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('beforeunload', () => {
    observer.disconnect();
    resizeObserver.disconnect();
    video.pause();
    texture.dispose();
    pmrem.dispose();
    renderer.dispose();
  }, { once:true });
}

function initTransformation(){
  const section = qs('#transformation');
  const stage = qs('[data-transform-stage]');
  if (!section || !stage) return;

  if (reducedMotion){
    stage.style.setProperty('--p', '1');
    return;
  }

  window.ScrollTrigger?.create({
    trigger:section,
    start:'top top',
    end:'bottom bottom',
    scrub:.5,
    onUpdate:self => stage.style.setProperty('--p', self.progress.toFixed(4))
  });
}

function initMethodScene(){
  const section = qs('#method');
  const visual = qs('[data-method-visual]');
  const words = qsa('[data-method-state]');
  if (!section || !visual || !words.length) return;

  const apply = value => {
    const state = clamp(value, 0, 4);
    const active = Math.round(state);
    visual.style.setProperty('--state', state.toFixed(3));
    words.forEach((word,index) => word.classList.toggle('is-active', index === active));
  };

  if (reducedMotion){ apply(2); return; }
  window.ScrollTrigger?.create({
    trigger:section,
    start:'top top',
    end:'bottom bottom',
    scrub:.45,
    onUpdate:self => apply(self.progress * 4)
  });
}

function initInternational(){
  const section = qs('#international');
  const acquisition = qs('[data-acquisition]');
  const frames = qsa('[data-acq-step]', acquisition || document);
  const nav = qsa('.acq-nav span', acquisition || document);
  if (!section || !acquisition || !frames.length) return;

  const apply = value => {
    const step = clamp(value, 0, 3);
    const active = Math.round(step);
    acquisition.style.setProperty('--step', step.toFixed(3));
    frames.forEach((frame,index) => {
      const offset = index - step;
      const distance = Math.min(Math.abs(offset), 1);
      frame.style.setProperty('--offset', offset.toFixed(3));
      frame.style.setProperty('--distance', distance.toFixed(3));
      frame.classList.toggle('is-active', index === active);
    });
    nav.forEach((item,index) => item.classList.toggle('is-active', index === active));
  };

  if (reducedMotion){ apply(2); return; }
  window.ScrollTrigger?.create({
    trigger:section,
    start:'top 32%',
    end:'bottom 68%',
    scrub:.5,
    onUpdate:self => apply(self.progress * 3)
  });
}

function initScrollNarrative(){
  if (!window.gsap || !window.ScrollTrigger) return;
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  if (!reducedMotion){
    gsap.from('.hero-copy > *', { y:22, opacity:0, duration:.75, stagger:.07, ease:'power3.out' });
    gsap.from('.work-window', { y:28, opacity:0, scale:.985, duration:1, ease:'power3.out', delay:.15 });
  }

  gsap.to('.page-progress span', {
    scaleX:1,
    width:'100%',
    ease:'none',
    scrollTrigger:{ start:'top top', end:'max', scrub:.15 }
  });

  ScrollTrigger.create({
    trigger:'#hero',
    start:'top top',
    end:'bottom top',
    scrub:.65,
    onUpdate:self => { browserProgress = self.progress; }
  });

  if (!reducedMotion){
    qsa('.project-chapter').forEach((chapter,index) => {
      const media = qs('.project-media', chapter);
      const meta = qs('.project-meta', chapter);
      if (media){
        gsap.fromTo(media,
          { y:index === 1 ? 0 : 34, scale:1.015 },
          { y:index === 1 ? 0 : -22, scale:.985, ease:'none', scrollTrigger:{trigger:chapter,start:'top bottom',end:'bottom top',scrub:.8} }
        );
      }
      if (meta){
        gsap.fromTo(meta,
          { y:22 },
          { y:-18, ease:'none', scrollTrigger:{trigger:chapter,start:'top 85%',end:'bottom 20%',scrub:1} }
        );
      }
    });
  }

  initTransformation();
  initMethodScene();
  initInternational();
  ScrollTrigger.refresh();
}

function initSmoothScroll(){
  if (reducedMotion || mobile || !window.Lenis) return;
  const lenis = new window.Lenis({ duration:1.05, smoothWheel:true, wheelMultiplier:.85 });
  if (window.gsap){
    lenis.on('scroll', () => window.ScrollTrigger?.update());
    window.gsap.ticker.add(time => lenis.raf(time * 1000));
    window.gsap.ticker.lagSmoothing(0);
  } else {
    const raf = time => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
}

function initKeyboardNav(){
  qsa('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', event => {
      const target = qs(anchor.getAttribute('href'));
      if (!target || reducedMotion) return;
      event.preventDefault();
      target.scrollIntoView({ behavior:'smooth', block:'start' });
    });
  });
}

function boot(){
  initProjectVideos();
  initBrowserScene();
  initScrollNarrative();
  initSmoothScroll();
  initKeyboardNav();
  document.documentElement.classList.add(finePointer ? 'fine-pointer' : 'coarse-pointer');
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once:true });
else boot();
