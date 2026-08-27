import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (n,a=0,b=1)=>Math.min(b,Math.max(a,n));
const damp = (current,target,lambda,dt)=>THREE.MathUtils.damp(current,target,lambda,dt);

const revealObserver = new IntersectionObserver(entries=>{
  for(const entry of entries){
    if(entry.isIntersecting){
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  }
},{threshold:.14,rootMargin:'0px 0px -8% 0px'});
document.querySelectorAll('[data-reveal]').forEach(el=>revealObserver.observe(el));

const body = document.body;
const menuButton = document.querySelector('.menu-dots');
const menuPanel = document.querySelector('.menu-panel');
function setMenu(open){
  body.classList.toggle('menu-open',open);
  menuButton?.setAttribute('aria-expanded',String(open));
  menuPanel?.setAttribute('aria-hidden',String(!open));
}
menuButton?.addEventListener('click',()=>setMenu(!body.classList.contains('menu-open')));
document.querySelector('[data-menu-close]')?.addEventListener('click',()=>setMenu(false));
document.querySelectorAll('.menu-panel a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
document.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});

const modes = {
  site:{index:'01 / 04',title:'SITO IMMERSIVO',description:"Il sito non è il contenitore finale: è il punto in cui identità, profondità e interazione diventano esperienza.",accent:0x2667ff,secondary:0xccecff},
  ads:{index:'02 / 04',title:'ATTENTION / ADS',description:"La creatività deve fermare il dito e aprire la stessa storia che continuerà nel sito. Hook, visual e destinazione parlano la stessa lingua.",accent:0xff6538,secondary:0xffd5c8},
  global:{index:'03 / 04',title:'GLOBAL SYSTEM',description:"La stessa identità viene adattata a lingua, tono e contesto di mercati diversi senza diventare un brand differente.",accent:0xd7ff63,secondary:0xccecff},
  action:{index:'04 / 04',title:'ACTION LAYER',description:"Tutto converge verso un gesto concreto: prenotare, chiedere, entrare, acquistare o iniziare una conversazione.",accent:0xffffff,secondary:0xd7ff63}
};
let activeMode='site';

const engine={
  ready:false,targetMode:'site',
  accent:new THREE.Color(modes.site.accent),
  accentTarget:new THREE.Color(modes.site.accent),
  secondary:new THREE.Color(modes.site.secondary),
  secondaryTarget:new THREE.Color(modes.site.secondary)
};

function setMode(mode){
  if(!modes[mode])return;
  activeMode=mode;
  document.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('is-active',b.dataset.mode===mode));
  const data=modes[mode];
  document.getElementById('mode-index').textContent=data.index;
  document.getElementById('mode-title').textContent=data.title;
  document.getElementById('mode-description').textContent=data.description;
  engine.targetMode=mode;
  engine.accentTarget.setHex(data.accent);
  engine.secondaryTarget.setHex(data.secondary);
}
document.querySelectorAll('[data-mode]').forEach(button=>button.addEventListener('click',()=>setMode(button.dataset.mode)));

const marketData={
  milano:{code:'IT / MILANO',eyebrow:'UN PRIMO INCONTRO DIGITALE',headline:'Entra prima<br>di arrivare.',copy:"Un'esperienza digitale pensata per far percepire il brand prima della visita.",cta:"SCOPRI L'ESPERIENZA <span>↗</span>",language:'ITALIAN',tone:'EDITORIAL / DIRECT',goal:'DISCOVERY → BOOKING'},
  london:{code:'EN / LONDON',eyebrow:'A DIGITAL FIRST IMPRESSION',headline:'Feel the brand<br>before you arrive.',copy:'Turn the first online touchpoint into an experience that feels intentional, tactile and memorable.',cta:'ENTER EXPERIENCE <span>↗</span>',language:'ENGLISH / UK',tone:'REFINED / EDITORIAL',goal:'DISCOVERY → APPOINTMENT'},
  newyork:{code:'EN / NEW YORK',eyebrow:'STOP BROWSING. START FEELING.',headline:"Don't browse it.<br>Experience it.",copy:'A sharper creative system designed to turn attention into curiosity, then curiosity into action.',cta:'STEP INSIDE <span>↗</span>',language:'ENGLISH / US',tone:'DIRECT / HIGH-ENERGY',goal:'ATTENTION → ACTION'},
  dubai:{code:'EN / DUBAI',eyebrow:'ITALIAN IDENTITY. GLOBAL PRESENCE.',headline:'Make the first<br>impression travel.',copy:'A premium digital presence adapted for an international audience without losing the original brand identity.',cta:'DISCOVER <span>↗</span>',language:'ENGLISH',tone:'PREMIUM / PRECISE',goal:'DESIRE → INQUIRY'}
};
document.querySelectorAll('[data-market]').forEach(button=>{
  button.addEventListener('click',()=>{
    const d=marketData[button.dataset.market];
    document.querySelectorAll('[data-market]').forEach(b=>b.classList.toggle('is-active',b===button));
    document.getElementById('market-code').textContent=d.code;
    document.getElementById('market-eyebrow').textContent=d.eyebrow;
    document.getElementById('market-headline').innerHTML=d.headline;
    document.getElementById('market-copy').textContent=d.copy;
    document.getElementById('market-cta').innerHTML=d.cta;
    document.getElementById('note-language').textContent=d.language;
    document.getElementById('note-tone').textContent=d.tone;
    document.getElementById('note-goal').textContent=d.goal;
  });
});

const canvas=document.getElementById('experience-canvas');
const stage=document.querySelector('[data-engine-stage]');

if(canvas&&stage){
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'high-performance'});
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.15;
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;

  const scene=new THREE.Scene();
  const pmrem=new THREE.PMREMGenerator(renderer);
  scene.environment=pmrem.fromScene(new RoomEnvironment(),.04).texture;
  pmrem.dispose();

  const camera=new THREE.PerspectiveCamera(34,1,.1,100);
  camera.position.set(0,.15,8.6);

  const root=new THREE.Group();
  scene.add(root);

  const key=new THREE.DirectionalLight(0xffffff,4.2);key.position.set(4,6,7);key.castShadow=true;scene.add(key);
  const fill=new THREE.DirectionalLight(0x7fb6ff,2.5);fill.position.set(-5,1,4);scene.add(fill);
  const warm=new THREE.PointLight(0xff6538,22,11,1.8);warm.position.set(4,-2,3);scene.add(warm);
  const cool=new THREE.PointLight(0x2667ff,28,12,1.7);cool.position.set(-3,2,4);scene.add(cool);

  const mat=(color,opts={})=>new THREE.MeshPhysicalMaterial({
    color,roughness:opts.roughness??.22,metalness:opts.metalness??.56,
    clearcoat:opts.clearcoat??.78,clearcoatRoughness:.14,
    transmission:opts.transmission??0,
    transparent:(opts.transmission??0)>0||(opts.opacity??1)<1,
    opacity:opts.opacity??1,thickness:opts.thickness??.45,ior:opts.ior??1.35,
    emissive:opts.emissive??0x000000,emissiveIntensity:opts.emissiveIntensity??0
  });
  const rounded=(w,h,d,material,r=.12)=>{
    const mesh=new THREE.Mesh(new RoundedBoxGeometry(w,h,d,6,r),material);
    mesh.castShadow=true;mesh.receiveShadow=true;return mesh;
  };

  const chrome=mat(0xdce3ea,{metalness:.92,roughness:.12,clearcoat:.95});
  const dark=mat(0x0d1725,{metalness:.64,roughness:.2,clearcoat:.9});
  const glass=mat(0xffffff,{metalness:0,roughness:.05,transmission:.88,opacity:.7,thickness:.8,clearcoat:1});
  const accentMat=mat(modes.site.accent,{metalness:.28,roughness:.2,clearcoat:.95,emissive:modes.site.accent,emissiveIntensity:.08});
  const secondaryMat=mat(modes.site.secondary,{metalness:.1,roughness:.27,clearcoat:.85});
  engine.accentMat=accentMat;engine.secondaryMat=secondaryMat;

  const frame=new THREE.Group();root.add(frame);
  const top=rounded(4.9,.22,.34,chrome,.09);top.position.y=2.45;frame.add(top);
  const bottom=rounded(4.9,.22,.34,chrome,.09);bottom.position.y=-2.45;frame.add(bottom);
  const left=rounded(.22,4.7,.34,chrome,.09);left.position.x=-2.34;frame.add(left);
  const right=rounded(.22,4.7,.34,chrome,.09);right.position.x=2.34;frame.add(right);

  const back=rounded(4.5,4.35,.12,dark,.15);back.position.z=-.62;root.add(back);
  const glassPanel=rounded(4.14,3.96,.07,glass,.14);glassPanel.position.z=-.28;root.add(glassPanel);

  const panels=[];
  const makePanel=(w,h,x,y,z,material,mode)=>{
    const p=rounded(w,h,.12,material,.11);
    p.position.set(x,y,z);p.userData.base=p.position.clone();p.userData.mode=mode;root.add(p);panels.push(p);return p;
  };
  makePanel(3.3,1.52,-.12,.7,.02,accentMat,'site');
  makePanel(2.7,.62,.38,-.62,.2,secondaryMat,'action');
  makePanel(1.25,.42,.82,-1.55,.42,chrome,'action');
  makePanel(.82,2.38,-1.46,-.1,.33,secondaryMat,'ads');
  makePanel(.82,2.38,1.46,-.1,.33,accentMat,'global');

  const lines=[];
  for(let i=0;i<5;i++){
    const l=rounded(1.55-i*.18,.055,.055,i===0?accentMat:chrome,.02);
    l.position.set(-.52,1.55-i*.16,.5+i*.025);
    l.userData.base=l.position.clone();root.add(l);lines.push(l);
  }

  const halo=new THREE.Mesh(new THREE.TorusGeometry(2.9,.018,8,100),accentMat);
  halo.rotation.x=Math.PI/2.55;halo.position.z=-1.15;root.add(halo);

  const floor=new THREE.Mesh(new THREE.CircleGeometry(3.6,80),new THREE.MeshPhysicalMaterial({color:0x07111e,roughness:.35,metalness:.35,transparent:true,opacity:.5}));
  floor.rotation.x=-Math.PI/2;floor.position.y=-2.7;floor.receiveShadow=true;scene.add(floor);

  const pointer={x:0,y:0,tx:0,ty:0,drag:false,lastX:0,lastY:0,moved:0};
  stage.addEventListener('pointerdown',e=>{pointer.drag=true;pointer.lastX=e.clientX;pointer.lastY=e.clientY;pointer.moved=0;stage.setPointerCapture?.(e.pointerId)});
  stage.addEventListener('pointermove',e=>{
    const rect=stage.getBoundingClientRect();
    if(pointer.drag){
      const dx=e.clientX-pointer.lastX,dy=e.clientY-pointer.lastY;
      pointer.tx+=dx*.006;pointer.ty+=dy*.004;pointer.moved+=Math.abs(dx)+Math.abs(dy);
      pointer.lastX=e.clientX;pointer.lastY=e.clientY;
    }else if(e.pointerType!=='touch'){
      pointer.tx=((e.clientX-rect.left)/rect.width-.5)*.42;
      pointer.ty=((e.clientY-rect.top)/rect.height-.5)*.22;
    }
  });
  const release=e=>{pointer.drag=false;stage.releasePointerCapture?.(e.pointerId)};
  stage.addEventListener('pointerup',release);
  stage.addEventListener('pointercancel',release);

  const raycaster=new THREE.Raycaster();
  const mouse=new THREE.Vector2();
  let hovered=null;
  stage.addEventListener('pointermove',e=>{
    if(e.pointerType==='touch'||pointer.drag)return;
    const rect=canvas.getBoundingClientRect();
    mouse.x=((e.clientX-rect.left)/rect.width)*2-1;
    mouse.y=-((e.clientY-rect.top)/rect.height)*2+1;
    raycaster.setFromCamera(mouse,camera);
    const hit=raycaster.intersectObjects(panels,false)[0]?.object||null;
    if(hovered&&hovered!==hit)hovered.scale.setScalar(1);
    hovered=hit;
    if(hovered)hovered.scale.setScalar(1.035);
  });

  function syncSize(){
    const r=canvas.getBoundingClientRect();
    if(!r.width||!r.height)return;
    const pixel=Math.min(devicePixelRatio||1,innerWidth<720?1.25:1.7);
    const w=Math.floor(r.width*pixel),h=Math.floor(r.height*pixel);
    if(canvas.width!==w||canvas.height!==h){
      renderer.setPixelRatio(pixel);renderer.setSize(r.width,r.height,false);
      camera.aspect=r.width/r.height;camera.updateProjectionMatrix();
    }
  }

  const clock=new THREE.Clock();
  let visible=true;
  new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??true},{rootMargin:'20% 0px'}).observe(stage);

  function modeTargets(mode){
    const t={
      site:[[-.12,.7,.02,1,1],[.38,-.62,.2,1,1],[.82,-1.55,.42,1,1],[-1.46,-.1,.33,.86,1],[1.46,-.1,.33,.86,1]],
      ads:[[0,.42,.12,.72,.72],[1.18,-1.28,.36,.7,.7],[1.22,-1.82,.54,.65,.65],[-.72,.02,.58,1.45,1.05],[1.55,.05,.05,.62,.62]],
      global:[[0,.2,-.05,.72,.72],[-.85,-1.05,.28,.82,.82],[.85,-1.05,.42,.82,.82],[-1.42,.12,.62,1.05,1.1],[1.42,.12,.62,1.05,1.1]],
      action:[[0,.86,-.1,.82,.82],[0,-.35,.28,1.08,1.12],[0,-1.42,.62,1.18,1.25],[-1.5,.1,.12,.56,.72],[1.5,.1,.12,.56,.72]]
    };
    return t[mode];
  }

  function loop(){
    const dt=Math.min(clock.getDelta(),.05);
    if(visible){
      syncSize();
      pointer.x=damp(pointer.x,pointer.tx,6,dt);
      pointer.y=damp(pointer.y,pointer.ty,6,dt);
      root.rotation.y=damp(root.rotation.y,pointer.x,5.2,dt);
      root.rotation.x=damp(root.rotation.x,-pointer.y,5.2,dt);

      engine.accent.lerp(engine.accentTarget,clamp(dt*4,0,1));
      engine.secondary.lerp(engine.secondaryTarget,clamp(dt*4,0,1));
      accentMat.color.copy(engine.accent);
      accentMat.emissive.copy(engine.accent).multiplyScalar(.18);
      secondaryMat.color.copy(engine.secondary);

      const targets=modeTargets(engine.targetMode);
      panels.forEach((p,i)=>{
        const [x,y,z,sx,sy]=targets[i];
        p.position.x=damp(p.position.x,x,5.4,dt);
        p.position.y=damp(p.position.y,y,5.4,dt);
        p.position.z=damp(p.position.z,z,5.4,dt);
        p.scale.x=damp(p.scale.x,sx,5.4,dt);
        p.scale.y=damp(p.scale.y,sy,5.4,dt);
      });

      const fan=engine.targetMode==='global'?1:0;
      lines.forEach((l,i)=>{
        l.position.x=damp(l.position.x,l.userData.base.x+(engine.targetMode==='ads'?i*.13:0),5,dt);
        l.position.z=damp(l.position.z,l.userData.base.z+(engine.targetMode==='action'?i*.16:fan*i*.06),5,dt);
      });

      if(!reducedMotion)halo.rotation.z+=.0015;
      warm.intensity=damp(warm.intensity,engine.targetMode==='ads'?34:18,3.5,dt);
      cool.intensity=damp(cool.intensity,engine.targetMode==='site'?36:22,3.5,dt);
      renderer.render(scene,camera);
    }
    requestAnimationFrame(loop);
  }
  engine.ready=true;
  loop();
}

setMode('site');
window.__ENTRA_PRIMA_V4__={engine,modes,marketData,setMode,activeMode};