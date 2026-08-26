import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const mobile = window.matchMedia('(max-width: 700px)').matches;
const qs = (s, root = document) => root.querySelector(s);
const qsa = (s, root = document) => [...root.querySelectorAll(s)];
const sceneControllers = [];
let heroScrollProgress = 0;
let servicesScrollProgress = 0;
let globeScrollProgress = 0;

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function damp(current, target, lambda, dt) { return THREE.MathUtils.damp(current, target, lambda, dt); }
function seededRandom(seed) {
  let s = seed >>> 0;
  return () => ((s = Math.imul(1664525, s) + 1013904223 >>> 0) / 4294967296);
}

function makeCanvasTexture(draw, width = 1024, height = 1600) {
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext('2d');
  draw(ctx, width, height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

function roundRect(ctx, x, y, w, h, r, fillStyle) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = fillStyle;
  ctx.fill();
}

function makeScreenTexture() {
  return makeCanvasTexture((ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#f8f4ee'); g.addColorStop(.45, '#edf0ff'); g.addColorStop(1, '#fff0e9');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#101126'; ctx.font = '700 34px Arial'; ctx.fillText('ENTRA PRIMA', 72, 105);
    ctx.fillStyle = '#5268ff'; ctx.font = '700 21px Arial'; ctx.fillText('EXPERIENCE / MILANO → WORLD', 72, 180);
    ctx.fillStyle = '#101126'; ctx.font = '68px Georgia'; ctx.fillText('Il brand entra', 72, 305); ctx.fillText('prima di arrivare.', 72, 382);
    ctx.fillStyle = '#6c7087'; ctx.font = '29px Arial'; ctx.fillText('3D · Motion · UI/UX · ADS', 72, 455);
    roundRect(ctx, 72, 535, 880, 400, 48, '#15172c');
    const gg = ctx.createLinearGradient(72, 535, 952, 935); gg.addColorStop(0, '#5268ff'); gg.addColorStop(.55, '#9a6cff'); gg.addColorStop(1, '#ff6f61');
    roundRect(ctx, 102, 565, 820, 340, 38, gg);
    ctx.fillStyle = 'rgba(255,255,255,.94)'; ctx.font = '56px Georgia'; ctx.fillText('Esperienza', 148, 700); ctx.fillText('immersiva', 148, 765);
    ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.font = '23px Arial'; ctx.fillText('Scroll per entrare →', 148, 835);
    roundRect(ctx, 72, 1010, 420, 190, 35, 'rgba(255,255,255,.88)');
    roundRect(ctx, 532, 1010, 420, 190, 35, 'rgba(255,255,255,.88)');
    ctx.fillStyle = '#5268ff'; ctx.font = '700 21px Arial'; ctx.fillText('3D INTERATTIVO', 108, 1072); ctx.fillText('BOOKING', 568, 1072);
    ctx.fillStyle = '#101126'; ctx.font = '37px Georgia'; ctx.fillText('Esplora.', 108, 1137); ctx.fillText('Prenota.', 568, 1137);
    roundRect(ctx, 72, 1285, 880, 145, 72, '#101126');
    ctx.fillStyle = '#fff'; ctx.font = '700 27px Arial'; ctx.fillText('ENTRA NELL’ESPERIENZA', 170, 1374);
    ctx.fillText('↗', 860, 1374);
  });
}

function makeCardTexture(title, subtitle, colors) {
  return makeCanvasTexture((ctx, w, h) => {
    const g = ctx.createLinearGradient(0,0,w,h); g.addColorStop(0, colors[0]); g.addColorStop(1, colors[1]);
    ctx.fillStyle = g; ctx.fillRect(0,0,w,h);
    ctx.fillStyle = 'rgba(255,255,255,.92)'; ctx.font = '700 34px Arial'; ctx.fillText(title, 72, 120);
    ctx.font = '46px Georgia'; ctx.fillText(subtitle, 72, 205);
    roundRect(ctx, 72, 290, w-144, 86, 43, 'rgba(255,255,255,.16)');
    ctx.font='700 22px Arial'; ctx.fillText('ENTRA PRIMA', 110, 344);
  }, 820, 470);
}

function makeMiniUITexture(accent = '#5268ff') {
  return makeCanvasTexture((ctx,w,h) => {
    ctx.fillStyle='#fffaf4';ctx.fillRect(0,0,w,h);
    ctx.fillStyle='#101126';ctx.font='700 30px Arial';ctx.fillText('EXPERIENCE UI',55,85);
    roundRect(ctx,55,135,w-110,220,36,'#f0f1f7');
    roundRect(ctx,85,165,180,38,19,accent); roundRect(ctx,85,230,w-170,24,12,'#d8dbe8'); roundRect(ctx,85,277,w-260,24,12,'#e3e5ee');
    roundRect(ctx,55,410,w-110,100,50,'#101126'); ctx.fillStyle='#fff';ctx.font='700 22px Arial';ctx.fillText('PRENOTA  ↗',110,472);
  },760,570);
}

function makePerfumeLabelTexture() {
  return makeCanvasTexture((ctx,w,h)=>{
    ctx.fillStyle='#fbf6ef';ctx.fillRect(0,0,w,h);
    ctx.fillStyle='#101126';ctx.font='700 28px Arial';ctx.textAlign='center';ctx.fillText('ENTRA',w/2,80);
    ctx.font='48px Georgia';ctx.fillText('PRIMA',w/2,145);
    ctx.font='18px Arial';ctx.fillStyle='#6c7087';ctx.fillText('EXPERIENCE',w/2,190);
  },360,240);
}

function createRenderer(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !mobile, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(new RoomEnvironment(), .04).texture;
  return { renderer, environment, pmrem };
}

function fitRenderer(renderer, camera, canvas) {
  const rect = canvas.parentElement.getBoundingClientRect();
  const w = Math.max(1, rect.width), h = Math.max(1, rect.height);
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

function trackVisibility(controller, element) {
  controller.active = true;
  const io = new IntersectionObserver(([entry]) => { controller.active = entry.isIntersecting; }, { rootMargin: '180px 0px' });
  io.observe(element);
  controller.disposeVisibility = () => io.disconnect();
}

function addSoftFloor(scene, y = -4.2, size = 13) {
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(size,size), new THREE.ShadowMaterial({ color: 0x59618e, opacity: .15 }));
  floor.rotation.x = -Math.PI/2; floor.position.y = y; floor.receiveShadow = true; scene.add(floor);
}

function addLighting(scene, environment) {
  scene.environment = environment;
  const hemi = new THREE.HemisphereLight(0xffffff, 0xb9b6d6, 1.35); scene.add(hemi);
  const key = new THREE.RectAreaLight(0xffffff, 5.5, 5.5, 7); key.position.set(4.5,5.8,5.8); key.lookAt(0,0,0); scene.add(key);
  const rim = new THREE.DirectionalLight(0x8da0ff, 2.1); rim.position.set(-4,2,5); scene.add(rim);
}

function createHeroDevice() {
  const canvas = qs('#hero3d'); if (!canvas) return;
  const { renderer, environment, pmrem } = createRenderer(canvas);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 100); camera.position.set(0,.15,10.6);
  addLighting(scene, environment); addSoftFloor(scene, -4.35, 15);

  const root = new THREE.Group(); scene.add(root);
  const device = new THREE.Group(); root.add(device);
  const bodyMat = new THREE.MeshPhysicalMaterial({ color:0x222431, metalness:.9, roughness:.18, clearcoat:1, clearcoatRoughness:.08, envMapIntensity:1.25 });
  const frame = new THREE.Mesh(new RoundedBoxGeometry(4.55,7.65,.52,8,.24), bodyMat); frame.castShadow=true; frame.receiveShadow=true; device.add(frame);
  const frontInset = new THREE.Mesh(new RoundedBoxGeometry(4.28,7.36,.08,8,.19), new THREE.MeshPhysicalMaterial({color:0x06070a,metalness:.35,roughness:.18,clearcoat:1})); frontInset.position.z=.286; device.add(frontInset);
  const screenTexture = makeScreenTexture();
  const screen = new THREE.Mesh(new RoundedBoxGeometry(4.12,7.18,.035,8,.17), new THREE.MeshPhysicalMaterial({ map:screenTexture, roughness:.26, metalness:0, clearcoat:.9, clearcoatRoughness:.12, envMapIntensity:.45 })); screen.position.z=.335; device.add(screen);
  const speaker = new THREE.Mesh(new RoundedBoxGeometry(1.05,.18,.04,6,.08),new THREE.MeshStandardMaterial({color:0x050506,roughness:.35})); speaker.position.set(0,3.18,.37);device.add(speaker);
  const sideButtonMat = new THREE.MeshStandardMaterial({color:0x333644,metalness:.95,roughness:.2});
  const vol = new THREE.Mesh(new RoundedBoxGeometry(.09,.78,.18,4,.04),sideButtonMat);vol.position.set(-2.31,1.35,.03);device.add(vol);
  const power = new THREE.Mesh(new RoundedBoxGeometry(.09,1.05,.18,4,.04),sideButtonMat);power.position.set(2.31,1.0,.03);device.add(power);

  const back = new THREE.Mesh(new RoundedBoxGeometry(4.35,7.42,.07,8,.2), new THREE.MeshPhysicalMaterial({color:0x30333f,metalness:.72,roughness:.24,clearcoat:.9}));back.position.z=-.296;device.add(back);
  const island = new THREE.Mesh(new RoundedBoxGeometry(1.48,1.48,.13,6,.22), new THREE.MeshPhysicalMaterial({color:0x2a2c36,metalness:.65,roughness:.18,clearcoat:1}));island.position.set(-1.23,2.55,-.37);device.add(island);
  [[-.32,.32],[.32,.28],[0,-.34]].forEach(([x,y])=>{
    const ring=new THREE.Mesh(new THREE.CylinderGeometry(.27,.27,.13,32),new THREE.MeshPhysicalMaterial({color:0x171921,metalness:.9,roughness:.12,clearcoat:1}));ring.rotation.x=Math.PI/2;ring.position.set(-1.23+x,2.55+y,-.47);device.add(ring);
    const lens=new THREE.Mesh(new THREE.CylinderGeometry(.18,.18,.14,32),new THREE.MeshPhysicalMaterial({color:0x050812,metalness:.1,roughness:.08,clearcoat:1,transmission:.12}));lens.rotation.x=Math.PI/2;lens.position.set(-1.23+x,2.55+y,-.55);device.add(lens);
  });

  const uiLayers = new THREE.Group(); device.add(uiLayers);
  const cards = [
    {tex:makeCardTexture('3D / MOTION','Il prodotto prende vita.',['#5268ff','#9a6cff']), pos:[-.35,1.75,.48], rot:-.04},
    {tex:makeCardTexture('SCROLL STORY','La pagina diventa percorso.',['#9a6cff','#ff6f61']), pos:[.45,.35,.55], rot:.04},
    {tex:makeCardTexture('BOOKING','L’interesse diventa azione.',['#ff6f61','#5268ff']), pos:[-.05,-1.35,.62], rot:-.02}
  ];
  cards.forEach((c,i)=>{
    const mesh=new THREE.Mesh(new RoundedBoxGeometry(3.5,1.95,.08,6,.18),new THREE.MeshPhysicalMaterial({map:c.tex,roughness:.3,metalness:0,clearcoat:.8,transparent:true,opacity:.985}));
    mesh.position.set(...c.pos);mesh.rotation.z=c.rot;mesh.userData.baseZ=c.pos[2];mesh.castShadow=true;uiLayers.add(mesh);
  });

  device.rotation.set(-.08,-.24,-.045); device.position.y=.15;
  const glow = new THREE.Mesh(new THREE.CircleGeometry(3.5,64), new THREE.MeshBasicMaterial({color:0x5268ff,transparent:true,opacity:.065,depthWrite:false}));glow.position.set(.3,.1,-1);scene.add(glow);

  const pointer={x:0,y:0,targetX:0,targetY:0,dragX:0,dragY:0,down:false,lastX:0,lastY:0};
  const parent=canvas.parentElement;
  parent.addEventListener('pointermove',e=>{
    const rect=parent.getBoundingClientRect();pointer.targetX=((e.clientX-rect.left)/rect.width-.5);pointer.targetY=((e.clientY-rect.top)/rect.height-.5);
    if(pointer.down){pointer.dragX=clamp(pointer.dragX+(e.clientX-pointer.lastX)*.004,-.45,.45);pointer.dragY=clamp(pointer.dragY+(e.clientY-pointer.lastY)*.003,-.22,.22);pointer.lastX=e.clientX;pointer.lastY=e.clientY;}
  },{passive:true});
  parent.addEventListener('pointerdown',e=>{pointer.down=true;pointer.lastX=e.clientX;pointer.lastY=e.clientY;parent.setPointerCapture?.(e.pointerId)});
  parent.addEventListener('pointerup',e=>{pointer.down=false;parent.releasePointerCapture?.(e.pointerId)});
  parent.addEventListener('pointercancel',()=>pointer.down=false);
  parent.addEventListener('pointerleave',()=>{pointer.targetX=0;pointer.targetY=0});

  const controller={active:true,renderer,scene,camera,pmrem,update(dt,time){
    pointer.x=damp(pointer.x,pointer.targetX,7.5,dt);pointer.y=damp(pointer.y,pointer.targetY,7.5,dt);
    if(!pointer.down){pointer.dragX=damp(pointer.dragX,0,3.6,dt);pointer.dragY=damp(pointer.dragY,0,3.6,dt)}
    const p=reducedMotion?0:heroScrollProgress;
    const targetY=-.24 + pointer.x*.23 + pointer.dragX + p*.44;
    const targetX=-.08 - pointer.y*.13 + pointer.dragY + p*.055;
    device.rotation.y=damp(device.rotation.y,targetY,5.5,dt);device.rotation.x=damp(device.rotation.x,targetX,5.5,dt);
    device.rotation.z=damp(device.rotation.z,-.045 + Math.sin(time*.55)*.006,4,dt);
    device.position.y=damp(device.position.y,.15 + Math.sin(time*.7)*.035 - p*.12,3.2,dt);
    camera.position.z=damp(camera.position.z,10.6-p*1.95,4.3,dt);
    uiLayers.children.forEach((card,i)=>{
      const explosion=[.28,.72,1.13][i]*p;
      card.position.z=damp(card.position.z,card.userData.baseZ+explosion,6,dt);
      card.position.x += Math.sin(time*.7+i*1.7)*.0008;
    });
    glow.scale.setScalar(1+p*.1);glow.material.opacity=.055+p*.035;
    renderer.render(scene,camera);
  },resize(){fitRenderer(renderer,camera,canvas)}};
  controller.resize();window.addEventListener('resize',controller.resize,{passive:true});trackVisibility(controller,parent);sceneControllers.push(controller);
}

function createPerfumeBottle() {
  const group=new THREE.Group();
  const glassMat=new THREE.MeshPhysicalMaterial({color:0xdfe9ff,roughness:.08,metalness:0,transmission:.86,thickness:.65,ior:1.45,clearcoat:1,clearcoatRoughness:.06,transparent:true,opacity:.98});
  const bottle=new THREE.Mesh(new RoundedBoxGeometry(1.55,2.2,.78,8,.2),glassMat);bottle.castShadow=true;group.add(bottle);
  const liquid=new THREE.Mesh(new RoundedBoxGeometry(1.35,1.25,.61,6,.14),new THREE.MeshPhysicalMaterial({color:0xff8b7e,roughness:.18,metalness:0,transparent:true,opacity:.68}));liquid.position.y=-.38;group.add(liquid);
  const neck=new THREE.Mesh(new THREE.CylinderGeometry(.31,.36,.42,28),new THREE.MeshStandardMaterial({color:0xd9dce8,metalness:.8,roughness:.18}));neck.position.y=1.31;group.add(neck);
  const cap=new THREE.Mesh(new RoundedBoxGeometry(.84,.68,.78,6,.14),new THREE.MeshPhysicalMaterial({color:0x1a1c2a,metalness:.9,roughness:.14,clearcoat:1}));cap.position.y=1.83;cap.castShadow=true;group.add(cap);
  const label=new THREE.Mesh(new THREE.PlaneGeometry(1.12,.75),new THREE.MeshBasicMaterial({map:makePerfumeLabelTexture(),transparent:false}));label.position.set(0,.05,.403);group.add(label);
  group.userData.kind='bottle';return group;
}

function createPageStack() {
  const group=new THREE.Group();
  const colors=[['#5268ff','#9a6cff'],['#9a6cff','#ff6f61'],['#7de1c5','#5268ff']];
  for(let i=0;i<3;i++){
    const tex=makeCardTexture(['STORY','SCROLL','ACTION'][i],['Identità','Profondità','Conversione'][i],colors[i]);
    const page=new THREE.Mesh(new RoundedBoxGeometry(2.35,3.35,.1,6,.17),new THREE.MeshPhysicalMaterial({map:tex,roughness:.32,clearcoat:.65}));
    page.position.set((i-1)*.34,(i-1)*.12,-i*.26);page.rotation.z=(i-1)*.07;page.castShadow=true;page.userData.index=i;group.add(page);
  }
  group.userData.kind='pages';return group;
}

function createPointerMesh() {
  const shape=new THREE.Shape();shape.moveTo(-.55,.78);shape.lineTo(.5,.2);shape.lineTo(.08,-.02);shape.lineTo(.43,-.62);shape.lineTo(.1,-.8);shape.lineTo(-.2,-.18);shape.lineTo(-.55,-.02);shape.closePath();
  const geo=new THREE.ExtrudeGeometry(shape,{depth:.16,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.035,bevelThickness:.035});geo.center();
  return new THREE.Mesh(geo,new THREE.MeshPhysicalMaterial({color:0xff6f61,metalness:.15,roughness:.2,clearcoat:1}));
}

function createUICard() {
  const group=new THREE.Group();
  const card=new THREE.Mesh(new RoundedBoxGeometry(2.75,3.45,.15,7,.22),new THREE.MeshPhysicalMaterial({map:makeMiniUITexture(),roughness:.3,clearcoat:.7}));card.castShadow=true;group.add(card);
  const pointer=createPointerMesh();pointer.scale.setScalar(.52);pointer.position.set(.72,-.72,.4);pointer.userData.base=new THREE.Vector3(.72,-.72,.4);group.add(pointer);group.userData.pointer=pointer;group.userData.kind='ui';return group;
}

function createCalendar() {
  const group=new THREE.Group();
  const base=new THREE.Mesh(new RoundedBoxGeometry(2.65,3.2,.28,7,.22),new THREE.MeshPhysicalMaterial({color:0xfffbf6,roughness:.3,clearcoat:.65}));base.castShadow=true;group.add(base);
  const top=new THREE.Mesh(new RoundedBoxGeometry(2.65,.65,.31,6,.18),new THREE.MeshPhysicalMaterial({color:0x7de1c5,roughness:.24,clearcoat:.7}));top.position.y=1.27;group.add(top);
  const ringMat=new THREE.MeshStandardMaterial({color:0x242632,metalness:.85,roughness:.18});[-.68,.68].forEach(x=>{const ring=new THREE.Mesh(new THREE.TorusGeometry(.19,.045,10,24),ringMat);ring.position.set(x,1.57,.12);ring.rotation.x=Math.PI/2;group.add(ring)});
  const cellGeo=new RoundedBoxGeometry(.28,.28,.07,4,.055);const cellMat=new THREE.MeshPhysicalMaterial({color:0x5268ff,roughness:.26,clearcoat:.55});const cells=new THREE.InstancedMesh(cellGeo,cellMat,28);cells.castShadow=true;
  const m=new THREE.Matrix4();let idx=0;for(let row=0;row<4;row++)for(let col=0;col<7;col++){m.makeTranslation(-.93+col*.31,.68-row*.48,.2);cells.setMatrixAt(idx++,m)}cells.instanceMatrix.needsUpdate=true;group.add(cells);
  const selected=new THREE.Mesh(new RoundedBoxGeometry(.39,.39,.1,5,.075),new THREE.MeshPhysicalMaterial({color:0xff6f61,roughness:.22,clearcoat:.7}));selected.position.set(.62,-.28,.28);group.add(selected);group.userData.selected=selected;group.userData.kind='calendar';return group;
}

function createServicesScene() {
  const canvas=qs('#services3d');if(!canvas)return;
  const {renderer,environment,pmrem}=createRenderer(canvas);const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(33,1,.1,100);camera.position.set(0,.1,mobile?12.9:11.2);addLighting(scene,environment);addSoftFloor(scene,-3.7,16);
  const root=new THREE.Group();scene.add(root);
  const bottle=createPerfumeBottle(),pages=createPageStack(),ui=createUICard(),calendar=createCalendar();const groups=[bottle,pages,ui,calendar];groups.forEach((g,i)=>{g.userData.index=i;g.traverse(o=>{if(o.isMesh){o.userData.serviceIndex=i}});root.add(g)});
  const place=()=>{const p=mobile?[[-1.55,1.62],[1.55,1.56],[-1.55,-1.6],[1.55,-1.58]]:[[-3.55,1.6],[3.55,1.55],[-3.45,-1.65],[3.55,-1.62]];groups.forEach((g,i)=>g.position.set(p[i][0],p[i][1],0));};place();
  const pointer=new THREE.Vector2(9,9),raycaster=new THREE.Raycaster();let hovered=-1,pressed=-1;const parent=canvas.parentElement;
  parent.addEventListener('pointermove',e=>{const rect=parent.getBoundingClientRect();pointer.x=((e.clientX-rect.left)/rect.width)*2-1;pointer.y=-((e.clientY-rect.top)/rect.height)*2+1},{passive:true});parent.addEventListener('pointerleave',()=>pointer.set(9,9));parent.addEventListener('pointerdown',()=>{if(hovered>=0)pressed=hovered});parent.addEventListener('pointerup',()=>pressed=-1);
  const controller={active:true,renderer,scene,camera,pmrem,update(dt,time){
    raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(groups,true)[0];hovered=hit?.object?.userData?.serviceIndex ?? -1;
    groups.forEach((g,i)=>{const hover=i===hovered;const press=i===pressed;const scale=press?.98:hover?1.055:1;const s=damp(g.scale.x,scale,8,dt);g.scale.setScalar(s);});
    const p=reducedMotion?0:servicesScrollProgress;
    bottle.rotation.y=damp(bottle.rotation.y,-.22+p*.85+(hovered===0?.18:0),4.2,dt);bottle.rotation.x=damp(bottle.rotation.x,-.05,5,dt);
    pages.children.forEach((page,i)=>{page.position.z=damp(page.position.z,-i*.22 + p*(i+1)*.26,5,dt);page.position.y=damp(page.position.y,(i-1)*.12+p*(i-1)*.12,5,dt)});pages.rotation.y=damp(pages.rotation.y,.16-p*.3,4,dt);
    const cursor=ui.userData.pointer;const cp=cursor.userData.base;cursor.position.x=damp(cursor.position.x,cp.x-p*.9,6,dt);cursor.position.y=damp(cursor.position.y,cp.y+p*.75,6,dt);ui.rotation.y=damp(ui.rotation.y,-.12+p*.25,4,dt);
    calendar.rotation.y=damp(calendar.rotation.y,.16-p*.25,4,dt);calendar.userData.selected.position.z=.28+Math.sin(time*2.2)*.025;
    root.position.y=Math.sin(time*.45)*.018;renderer.render(scene,camera);
  },resize(){fitRenderer(renderer,camera,canvas);place()}};controller.resize();window.addEventListener('resize',controller.resize,{passive:true});trackVisibility(controller,parent);sceneControllers.push(controller);
}

function latLonToVec3(lat,lon,r=2.62){const phi=(90-lat)*Math.PI/180,theta=(lon+180)*Math.PI/180;return new THREE.Vector3(-r*Math.sin(phi)*Math.cos(theta),r*Math.cos(phi),r*Math.sin(phi)*Math.sin(theta));}
function makeArcPoints(a,b,count=120,lift=3.7){const mid=a.clone().add(b).multiplyScalar(.5).normalize().multiplyScalar(lift);const curve=new THREE.QuadraticBezierCurve3(a,mid,b);return {curve,points:curve.getPoints(count)};}

function createGlobeScene() {
  const canvas=qs('#globe3d');if(!canvas)return;
  const {renderer,environment,pmrem}=createRenderer(canvas);const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(35,1,.1,100);camera.position.set(0,.1,8.4);scene.environment=environment;
  const root=new THREE.Group();scene.add(root);
  const earthMat=new THREE.MeshStandardMaterial({color:0x334577,roughness:.66,metalness:0,envMapIntensity:.25});
  const earth=new THREE.Mesh(new THREE.SphereGeometry(2.55,mobile?64:96,mobile?48:72),earthMat);earth.castShadow=true;earth.receiveShadow=true;root.add(earth);
  new THREE.TextureLoader().load('https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg',tex=>{tex.colorSpace=THREE.SRGBColorSpace;earthMat.map=tex;earthMat.color.set(0xffffff);earthMat.needsUpdate=true;},undefined,()=>{});
  const atmosphere=new THREE.Mesh(new THREE.SphereGeometry(2.65,64,48),new THREE.ShaderMaterial({transparent:true,side:THREE.BackSide,depthWrite:false,vertexShader:`varying vec3 vNormal;varying vec3 vWorld;void main(){vNormal=normalize(normalMatrix*normal);vec4 world=modelMatrix*vec4(position,1.0);vWorld=world.xyz;gl_Position=projectionMatrix*viewMatrix*world;}`,fragmentShader:`varying vec3 vNormal;varying vec3 vWorld;void main(){vec3 viewDir=normalize(cameraPosition-vWorld);float rim=pow(1.0-max(dot(vNormal,viewDir),0.0),2.4);gl_FragColor=vec4(0.38,0.55,1.0,rim*0.42);}`}));root.add(atmosphere);
  const cities={m:latLonToVec3(45.4642,9.19),l:latLonToVec3(51.5072,-.1276),d:latLonToVec3(25.2048,55.2708),n:latLonToVec3(40.7128,-74.006)};
  Object.entries(cities).forEach(([key,p])=>{const marker=new THREE.Mesh(new THREE.SphereGeometry(key==='m'?.085:.065,18,18),new THREE.MeshBasicMaterial({color:key==='m'?0x7de1c5:0xff7669}));marker.position.copy(p);root.add(marker)});
  const routes=[['m','l'],['m','d'],['m','n']].map(([a,b],i)=>{const {curve,points}=makeArcPoints(cities[a],cities[b],120,3.55+i*.12);const geo=new THREE.BufferGeometry().setFromPoints(points);geo.setDrawRange(0,1);const line=new THREE.Line(geo,new THREE.LineBasicMaterial({color:[0x7de1c5,0x9a6cff,0xff6f61][i],transparent:true,opacity:.95}));root.add(line);const pulse=new THREE.Mesh(new THREE.SphereGeometry(.045,12,12),new THREE.MeshBasicMaterial({color:[0x7de1c5,0x9a6cff,0xff6f61][i]}));root.add(pulse);return{line,curve,pulse,points}});
  const rnd=seededRandom(42),count=mobile?180:360,starPos=new Float32Array(count*3);for(let i=0;i<count;i++){const r=5.2+rnd()*4,a=rnd()*Math.PI*2,b=Math.acos(2*rnd()-1);starPos[i*3]=r*Math.sin(b)*Math.cos(a);starPos[i*3+1]=r*Math.cos(b);starPos[i*3+2]=r*Math.sin(b)*Math.sin(a)}const starGeo=new THREE.BufferGeometry();starGeo.setAttribute('position',new THREE.BufferAttribute(starPos,3));scene.add(new THREE.Points(starGeo,new THREE.PointsMaterial({color:0xaeb9ff,size:.025,transparent:true,opacity:.5,depthWrite:false})));
  scene.add(new THREE.HemisphereLight(0xffffff,0x202544,1.05));const key=new THREE.DirectionalLight(0xaab8ff,3.2);key.position.set(4,3,6);scene.add(key);const rim=new THREE.DirectionalLight(0xff8a79,1.1);rim.position.set(-4,-1,3);scene.add(rim);
  root.rotation.set(.12,-.58,-.03);
  const controller={active:true,renderer,scene,camera,pmrem,update(dt,time){const p=reducedMotion?0:globeScrollProgress;root.rotation.y=damp(root.rotation.y,-.58+p*.64+Math.sin(time*.15)*.025,3.2,dt);root.rotation.x=damp(root.rotation.x,.12-p*.055,3.2,dt);routes.forEach((r,i)=>{const local=clamp((p-i*.12)/(.72),0,1);r.line.geometry.setDrawRange(0,Math.max(1,Math.floor(r.points.length*local)));const pulseT=local<=0?0:(time*.12+i*.23)%1;r.pulse.visible=local>.08;r.pulse.position.copy(r.curve.getPoint(pulseT));});renderer.render(scene,camera);},resize(){fitRenderer(renderer,camera,canvas)}};controller.resize();window.addEventListener('resize',controller.resize,{passive:true});trackVisibility(controller,canvas.parentElement);sceneControllers.push(controller);
}

function setupCompare() {
  const stage=qs('[data-compare]');if(!stage)return;const after=qs('.after',stage),divider=qs('.divider',stage),depth=qs('[data-depth-stage]',stage);let value=50,drag=false;
  const setValue=v=>{value=clamp(v,6,94);after.style.clipPath=`inset(0 0 0 ${value}%)`;divider.style.left=`${value}%`;stage.setAttribute('aria-valuenow',String(Math.round(value)));const reveal=(100-value)/94;depth.style.transform=`rotateY(${(reveal-.5)*4}deg) translate3d(0,0,0)`;};
  const fromX=x=>{const r=stage.getBoundingClientRect();setValue((x-r.left)/r.width*100)};
  stage.addEventListener('pointerdown',e=>{drag=true;stage.setPointerCapture?.(e.pointerId);fromX(e.clientX)});stage.addEventListener('pointermove',e=>{if(drag)fromX(e.clientX)});stage.addEventListener('pointerup',e=>{drag=false;stage.releasePointerCapture?.(e.pointerId)});stage.addEventListener('pointercancel',()=>drag=false);
  stage.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){setValue(value-3);e.preventDefault()}if(e.key==='ArrowRight'){setValue(value+3);e.preventDefault()}});setValue(50);
}

function setupLenisAndMotion() {
  const gsap=window.gsap,ScrollTrigger=window.ScrollTrigger;if(!gsap||!ScrollTrigger)return;gsap.registerPlugin(ScrollTrigger);
  if(!reducedMotion&&finePointer&&window.Lenis){const lenis=new window.Lenis({autoRaf:false,lerp:.075,smoothWheel:true,syncTouch:false});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);}
  gsap.to('.page-progress span',{scaleX:1,ease:'none',scrollTrigger:{start:'top top',end:'max',scrub:.15},onStart(){gsap.set('.page-progress span',{width:'100%',scaleX:0})}});
  gsap.timeline({defaults:{ease:'power3.out'}}).fromTo('.hero-copy > *',{opacity:0,transform:'translate3d(0,24px,0)'},{opacity:1,transform:'translate3d(0,0,0)',duration:.78,stagger:.08});
  if(!reducedMotion){
    ScrollTrigger.create({trigger:'#hero',start:'top top',end:'bottom top',scrub:.5,onUpdate:self=>heroScrollProgress=self.progress});
    ScrollTrigger.create({trigger:'#services',start:'top 78%',end:'bottom 25%',scrub:.7,onUpdate:self=>servicesScrollProgress=self.progress});
    ScrollTrigger.create({trigger:'#ads-world',start:'top 80%',end:'bottom 28%',scrub:.7,onUpdate:self=>globeScrollProgress=self.progress});
  }
  qsa('.section-head h2,.intro h2,.difference h2,.ads-copy h2').forEach(el=>gsap.fromTo(el,{opacity:0,transform:'translate3d(0,34px,0)'},{opacity:1,transform:'translate3d(0,0,0)',duration:.85,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 86%',once:true}}));
  qsa('.chart-line').forEach(path=>{const len=path.getTotalLength();path.style.strokeDasharray=len;path.style.strokeDashoffset=len;gsap.to(path,{strokeDashoffset:0,ease:'none',scrollTrigger:{trigger:path,start:'top 90%',end:'top 60%',scrub:1}})});
  gsap.to('.flow-trace',{scaleX:1,ease:'none',scrollTrigger:{trigger:'.flow-row.entra',start:'top 84%',end:'top 56%',scrub:1}});
  qsa('.funnel i').forEach((line,i)=>gsap.fromTo(line,{scaleX:0},{scaleX:1,ease:'none',scrollTrigger:{trigger:line,start:`top ${92-i*3}%`,end:'top 68%',scrub:1}}));
  qsa('.ads-steps article').forEach((el,i)=>gsap.fromTo(el,{opacity:0,transform:'translate3d(0,22px,0)'},{opacity:1,transform:'translate3d(0,0,0)',duration:.65,delay:i*.04,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}}));
  qsa('.work').forEach((el,i)=>gsap.fromTo(el,{opacity:0,transform:'translate3d(0,34px,0)'},{opacity:1,transform:'translate3d(0,0,0)',duration:.78,delay:i*.05,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 87%',once:true}}));
  gsap.to('.scroll-cue i',{scaleX:.18,opacity:.22,ease:'none',scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom 55%',scrub:1}});
}

function startRenderLoop(){let last=performance.now();function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;const time=now/1000;for(const c of sceneControllers){if(c.active)c.update(dt,time)}requestAnimationFrame(frame)}requestAnimationFrame(frame)}

setupCompare();
createHeroDevice();
createServicesScene();
createGlobeScene();
setupLenisAndMotion();
startRenderLoop();
