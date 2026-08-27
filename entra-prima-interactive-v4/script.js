import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const damp = (a,b,l,dt)=>THREE.MathUtils.damp(a,b,l,dt);

const revealObserver = new IntersectionObserver(entries=>{
  for(const entry of entries){
    if(entry.isIntersecting){
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  }
},{threshold:.14,rootMargin:'0px 0px -8% 0px'});
document.querySelectorAll('[data-reveal]').forEach(el=>revealObserver.observe(el));

const body=document.body;
const menuButton=document.querySelector('.menu-dots');
const menuPanel=document.querySelector('.menu-panel');
function setMenu(open){
  body.classList.toggle('menu-open',open);
  menuButton?.setAttribute('aria-expanded',String(open));
  menuPanel?.setAttribute('aria-hidden',String(!open));
}
menuButton?.addEventListener('click',()=>setMenu(!body.classList.contains('menu-open')));
document.querySelector('[data-menu-close]')?.addEventListener('click',()=>setMenu(false));
document.querySelectorAll('.menu-panel a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
document.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});

const modes={
  site:{
    index:'01 / 04',
    title:'SITO IMMERSIVO',
    description:"Uno spazio digitale costruito come un ambiente: fotografia, tipografia, profondità e interazione fanno percepire il brand prima della visita.",
    accent:0xb58b57
  },
  ads:{
    index:'02 / 04',
    title:'ADS / ATTENTION',
    description:"Creatività e campagna vengono progettate nello stesso linguaggio del brand, così l'annuncio non sembra separato dall'esperienza che viene dopo.",
    accent:0xc78042
  },
  global:{
    index:'03 / 04',
    title:'GLOBAL PRESENCE',
    description:"La stessa identità viene adattata a lingua, tono e contesto dei diversi mercati, mantenendo coerenza e riconoscibilità.",
    accent:0xa89362
  },
  action:{
    index:'04 / 04',
    title:'AZIONE / BOOKING',
    description:"L'esperienza porta naturalmente a un gesto reale: prenotare, chiedere informazioni, visitare lo showroom o iniziare una conversazione.",
    accent:0xd5bd8b
  }
};

const engine={
  ready:false,
  targetMode:'site',
  accent:new THREE.Color(modes.site.accent),
  accentTarget:new THREE.Color(modes.site.accent),
  sceneGroups:{},
  activeGroup:null
};

function setMode(mode){
  if(!modes[mode])return;
  engine.targetMode=mode;
  document.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('is-active',b.dataset.mode===mode));
  const d=modes[mode];
  document.getElementById('mode-index').textContent=d.index;
  document.getElementById('mode-title').textContent=d.title;
  document.getElementById('mode-description').textContent=d.description;
  engine.accentTarget.setHex(d.accent);
  for(const [key,group] of Object.entries(engine.sceneGroups)){
    const active=key===mode;
    group.visible=active;
    group.userData.targetScale=active?1:.92;
    group.userData.targetY=active?0:-.08;
    if(active){
      group.scale.setScalar(.92);
      group.position.y=-.08;
      engine.activeGroup=group;
    }
  }
}
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));

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
  renderer.toneMappingExposure=1.02;
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;

  const scene=new THREE.Scene();
  scene.background=new THREE.Color(0x120f0c);

  const pmrem=new THREE.PMREMGenerator(renderer);
  scene.environment=pmrem.fromScene(new RoomEnvironment(),.04).texture;
  pmrem.dispose();

  const camera=new THREE.PerspectiveCamera(34,1,.1,100);
  const cameraTarget={z:9.3};
  camera.position.set(0,.1,cameraTarget.z);

  const master=new THREE.Group();
  scene.add(master);

  const key=new THREE.DirectionalLight(0xfff5e8,4.6);key.position.set(5,7,6);key.castShadow=true;scene.add(key);
  const fill=new THREE.DirectionalLight(0xb8a58a,1.4);fill.position.set(-5,2,3);scene.add(fill);
  const warm=new THREE.PointLight(0xc78247,22,12,1.8);warm.position.set(4,-1,4);scene.add(warm);
  const side=new THREE.PointLight(0xf0d2a4,12,9,2);side.position.set(-3,1,5);scene.add(side);

  const phys=(color,opts={})=>new THREE.MeshPhysicalMaterial({
    color,
    roughness:opts.roughness??.34,
    metalness:opts.metalness??.18,
    clearcoat:opts.clearcoat??.25,
    clearcoatRoughness:opts.clearcoatRoughness??.28,
    transmission:opts.transmission??0,
    transparent:(opts.transmission??0)>0||(opts.opacity??1)<1,
    opacity:opts.opacity??1,
    thickness:opts.thickness??.35,
    ior:opts.ior??1.4,
    side:THREE.DoubleSide
  });

  const brass=phys(0xb58b57,{metalness:.82,roughness:.2,clearcoat:.55});
  const dark=phys(0x211a14,{metalness:.12,roughness:.48});
  const walnut=phys(0x3c2a1f,{metalness:.04,roughness:.62});
  const stone=phys(0x8f806d,{metalness:.02,roughness:.7});
  const marble=phys(0x2b2621,{metalness:.06,roughness:.4,clearcoat:.15});
  const cream=phys(0xe5d7c2,{metalness:0,roughness:.58});
  const smoked=phys(0x27211c,{metalness:.08,roughness:.2,transmission:.28,opacity:.88,clearcoat:.55,thickness:.22});
  const glass=phys(0xffffff,{metalness:0,roughness:.08,transmission:.66,opacity:.72,clearcoat:.85,thickness:.45});

  const rounded=(w,h,d,material,r=.12)=>{
    const mesh=new THREE.Mesh(new RoundedBoxGeometry(w,h,d,5,r),material);
    mesh.castShadow=true;mesh.receiveShadow=true;return mesh;
  };

  const makeCanvasTexture=(draw,w=1200,h=760)=>{
    const c=document.createElement('canvas');c.width=w;c.height=h;
    const ctx=c.getContext('2d');
    draw(ctx,w,h);
    const tex=new THREE.CanvasTexture(c);
    tex.colorSpace=THREE.SRGBColorSpace;
    tex.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
    return tex;
  };

  const textPlane=(w,h,texture,z=.07)=>{
    const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false}));
    m.position.z=z;return m;
  };

  const makeCardTexture=(title,subtitle,lines=[],opts={})=>makeCanvasTexture((ctx,w,h)=>{
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle=opts.bg||'rgba(25,20,16,.88)';
    ctx.fillRect(0,0,w,h);
    ctx.strokeStyle=opts.border||'rgba(206,178,135,.55)';
    ctx.lineWidth=2;ctx.strokeRect(2,2,w-4,h-4);
    ctx.fillStyle=opts.accent||'#caa675';
    ctx.font='500 24px monospace';
    ctx.fillText(title.toUpperCase(),52,72);
    ctx.fillStyle=opts.fg||'#f2ebe1';
    ctx.font='500 44px Georgia,serif';
    ctx.fillText(subtitle,52,132);
    ctx.strokeStyle='rgba(255,255,255,.14)';
    ctx.beginPath();ctx.moveTo(52,164);ctx.lineTo(w-52,164);ctx.stroke();
    ctx.font='400 24px Arial,sans-serif';
    let y=222;
    for(const line of lines){
      ctx.fillStyle=line.accent?opts.accent||'#caa675':opts.fg||'#e9e1d5';
      ctx.fillText(line.text,52,y);
      y+=52;
    }
  });

  const textureLoader=new THREE.TextureLoader();
  textureLoader.setCrossOrigin('anonymous');

  function loadTexture(url,onLoad){
    textureLoader.load(url,t=>{t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());onLoad(t)},undefined,()=>{});
  }

  function makeBrowserPanel(w,h,photoUrl,title,subtitle){
    const g=new THREE.Group();
    const frame=rounded(w+.14,h+.14,.14,brass,.09);
    frame.position.z=-.05;g.add(frame);
    const screen=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:0x4b4033}));
    screen.position.z=.035;g.add(screen);
    loadTexture(photoUrl,t=>{
      screen.material.map=t;
      screen.material.color.set(0xb8aa96);
      screen.material.needsUpdate=true;
    });
    const overlay=makeCanvasTexture((ctx,cw,ch)=>{
      ctx.clearRect(0,0,cw,ch);
      const grad=ctx.createLinearGradient(0,0,cw*.72,0);
      grad.addColorStop(0,'rgba(18,14,11,.78)');
      grad.addColorStop(.78,'rgba(18,14,11,.1)');
      ctx.fillStyle=grad;ctx.fillRect(0,0,cw,ch);
      ctx.fillStyle='#efe7da';ctx.font='600 18px monospace';ctx.fillText('EP  ENTRA PRIMA',42,54);
      ctx.fillStyle='#f5efe6';ctx.font='500 48px Georgia,serif';ctx.fillText(title,42,ch*.45);
      ctx.font='400 22px Arial,sans-serif';ctx.fillStyle='#d4c7b6';ctx.fillText(subtitle,42,ch*.45+48);
      ctx.strokeStyle='#bd985f';ctx.lineWidth=2;ctx.strokeRect(42,ch-102,160,48);
      ctx.fillStyle='#d6b883';ctx.font='500 14px monospace';ctx.fillText('EXPLORE →',72,ch-72);
    });
    const o=textPlane(w,h,overlay,.055);g.add(o);
    return g;
  }

  function buildSite(){
    const g=new THREE.Group();
    const base=rounded(6.7,.34,4.9,stone,.08);base.position.set(0,-2.25,.15);g.add(base);
    const under=rounded(7.05,.26,5.2,walnut,.07);under.position.set(0,-2.47,-.05);g.add(under);

    const main=makeBrowserPanel(4.35,3.2,'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80','BUILDING DIGITAL','EXPERIENCES — WITH PURPOSE');
    main.position.set(-.4,.15,.15);main.rotation.y=.03;g.add(main);

    const side1=makeBrowserPanel(2.3,2.9,'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=75','ABOUT','IDENTITY / SPACE');
    side1.position.set(2.12,.2,-.55);side1.rotation.y=-.28;g.add(side1);

    const side2=makeBrowserPanel(1.65,2.55,'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=70','JOURNAL','DETAILS');
    side2.position.set(3.2,.15,-1.35);side2.rotation.y=-.36;g.add(side2);

    const plaque=rounded(2.25,.5,.18,brass,.05);plaque.position.set(-1.25,-2.0,1.55);plaque.rotation.x=-.12;g.add(plaque);
    plaque.add(textPlane(2.05,.34,makeCanvasTexture((ctx,w,h)=>{
      ctx.clearRect(0,0,w,h);ctx.fillStyle='#2b2118';ctx.font='500 34px Georgia,serif';ctx.fillText('ENTRA PRIMA',75,82);
      ctx.font='500 17px monospace';ctx.fillText('DIGITAL EXPERIENCE',75,126);
    },900,220),.1));
    return g;
  }

  function perfumeBottle(){
    const g=new THREE.Group();
    const bodyMat=phys(0x5b2e18,{roughness:.12,transmission:.34,opacity:.92,thickness:.65,clearcoat:.9});
    const body=rounded(1.1,1.7,.72,bodyMat,.14);body.position.y=-.1;g.add(body);
    const neck=rounded(.36,.28,.3,brass,.05);neck.position.y=.94;g.add(neck);
    const cap=rounded(.62,.45,.52,dark,.06);cap.position.y=1.25;g.add(cap);
    const label=rounded(.72,.72,.03,phys(0x16120f,{roughness:.4}),.03);label.position.set(0,-.1,.39);g.add(label);
    label.add(textPlane(.64,.58,makeCanvasTexture((ctx,w,h)=>{
      ctx.clearRect(0,0,w,h);ctx.fillStyle='#d2b582';ctx.font='500 92px Georgia,serif';ctx.textAlign='center';ctx.fillText('EP',w/2,145);
      ctx.font='500 22px monospace';ctx.fillText('ENTRA PRIMA',w/2,205);
    },600,280),.025));
    return g;
  }

  function buildAds(){
    const g=new THREE.Group();
    const base=new THREE.Mesh(new THREE.CylinderGeometry(3.4,3.65,.42,64),marble);base.position.y=-2.35;base.castShadow=true;base.receiveShadow=true;g.add(base);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(3.18,.045,10,90),brass);ring.rotation.x=Math.PI/2;ring.position.y=-2.12;g.add(ring);

    const campaign=rounded(4.3,3.0,.18,smoked,.12);campaign.position.set(0,.2,-.2);g.add(campaign);
    campaign.add(textPlane(4.0,2.7,makeCardTexture('CAMPAIGN','Iconic Essence',[
      {text:'DISCOVER THE NEW FRAGRANCE'},
      {text:'META / SEARCH / VIDEO',accent:true}
    ],{bg:'rgba(28,22,17,.84)',accent:'#c98446'}),.12));

    const bottle=perfumeBottle();bottle.scale.setScalar(1.08);bottle.position.set(.25,-.05,.7);g.add(bottle);

    const left=rounded(1.35,2.6,.16,smoked,.1);left.position.set(-2.85,.2,.2);left.rotation.y=.12;g.add(left);
    left.add(textPlane(1.18,2.35,makeCardTexture('AUDIENCE','HIGH INTENT',[
      {text:'82% MATCH QUALITY',accent:true},{text:'BEHAVIOUR / VALUE'},{text:'RETARGET READY'}
    ],{accent:'#c98446'}),.1));

    const right=rounded(1.45,2.8,.16,smoked,.1);right.position.set(2.92,.2,.15);right.rotation.y=-.12;g.add(right);
    right.add(textPlane(1.25,2.5,makeCardTexture('PERFORMANCE','CAMPAIGN',[
      {text:'CTR  2.41%',accent:true},{text:'CPC  €0.38'},{text:'ROAS  4.21x',accent:true}
    ],{accent:'#c98446'}),.1));

    const stats=rounded(3.55,.62,.14,smoked,.08);stats.position.set(0,2.03,.1);g.add(stats);
    stats.add(textPlane(3.32,.45,makeCanvasTexture((ctx,w,h)=>{
      ctx.clearRect(0,0,w,h);ctx.fillStyle='#e8dfd3';ctx.font='500 22px monospace';
      const items=['SPEND  €24.6K','IMPRESSIONS  1.4M','CLICKS  18.3K'];
      items.forEach((t,i)=>ctx.fillText(t,40+i*360,72));
    },1200,180),.1));

    const strip=rounded(4.7,.72,.14,smoked,.08);strip.position.set(0,-1.58,.25);g.add(strip);
    strip.add(textPlane(4.42,.54,makeCanvasTexture((ctx,w,h)=>{
      ctx.clearRect(0,0,w,h);ctx.fillStyle='#b99058';ctx.font='500 24px monospace';ctx.fillText('META',36,66);ctx.fillText('SEARCH',280,66);ctx.fillText('YOUTUBE',550,66);ctx.fillText('TIKTOK',845,66);
      ctx.fillStyle='#d8cdbc';ctx.font='400 17px monospace';ctx.fillText('68%',36,105);ctx.fillText('18%',280,105);ctx.fillText('9%',550,105);ctx.fillText('5%',845,105);
    },1100,180),.1));
    return g;
  }

  function buildGlobal(){
    const g=new THREE.Group();
    const mapMat=new THREE.MeshBasicMaterial({color:0x5b5045,transparent:true,opacity:.62});
    const map=new THREE.Mesh(new THREE.PlaneGeometry(7.2,4.1),mapMat);
    map.position.set(0,-.15,-1.35);g.add(map);
    loadTexture('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',t=>{
      mapMat.map=t;mapMat.color.set(0x80705e);mapMat.needsUpdate=true;
    });

    const central=rounded(1.7,2.4,.18,smoked,.12);central.position.set(0,-.05,.45);g.add(central);
    central.add(textPlane(1.48,2.14,makeCardTexture('ENTRA PRIMA','GLOBAL',[
      {text:'EUROPE  /  AMERICAS'},{text:'MIDDLE EAST  /  APAC'},{text:'LOCALISE → LAUNCH',accent:true}
    ],{accent:'#c5ae76'}),.1));

    const locations=[
      ['NEW YORK',-2.55,.9,.2],['LONDON',-.95,1.72,.05],['DUBAI',2.55,-.65,.15],['TOKYO',2.75,1.2,-.05],['SÃO PAULO',-2.7,-1.15,.05]
    ];
    const points=[];
    for(const [name,x,y,z] of locations){
      const card=rounded(1.42,.82,.12,smoked,.09);card.position.set(x,y,z);card.rotation.y=x*.04;g.add(card);
      card.add(textPlane(1.24,.64,makeCanvasTexture((ctx,w,h)=>{
        ctx.clearRect(0,0,w,h);ctx.fillStyle='#c7aa76';ctx.font='500 22px monospace';ctx.fillText('LIVE',34,46);
        ctx.fillStyle='#efe7dd';ctx.font='500 42px Georgia,serif';ctx.fillText(name,34,100);
      },700,220),.08));
      points.push(new THREE.Vector3(x,y,z));
    }
    for(const p of points){
      const curve=new THREE.QuadraticBezierCurve3(new THREE.Vector3(0,0,.1),new THREE.Vector3(p.x*.5,p.y*.5,1.15),p);
      const geo=new THREE.TubeGeometry(curve,36,.018,6,false);
      const line=new THREE.Mesh(geo,brass);g.add(line);
    }
    return g;
  }

  function buildAction(){
    const g=new THREE.Group();

    const backdropMat=new THREE.MeshBasicMaterial({color:0x57483a});
    const backdrop=new THREE.Mesh(new THREE.PlaneGeometry(7.4,4.8),backdropMat);
    backdrop.position.set(0,.1,-1.75);g.add(backdrop);
    loadTexture('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80',t=>{
      backdropMat.map=t;backdropMat.color.set(0x9e8b73);backdropMat.needsUpdate=true;
    });

    const table=rounded(7.2,.32,4.7,marble,.08);table.position.set(0,-2.4,-.05);g.add(table);

    const center=rounded(2.55,3.2,.16,cream,.12);center.position.set(0,.05,.48);g.add(center);
    center.add(textPlane(2.3,2.92,makeCanvasTexture((ctx,w,h)=>{
      ctx.clearRect(0,0,w,h);
      ctx.fillStyle='#3a2c21';ctx.font='500 46px Georgia,serif';ctx.textAlign='center';ctx.fillText('PRENOTA LA TUA ESPERIENZA',w/2,92);
      ctx.font='400 24px Arial,sans-serif';ctx.fillText('Seleziona data e orario',w/2,142);
      const dates=['24','25','26','27'];dates.forEach((d,i)=>{ctx.strokeStyle=i===1?'#5a412b':'#9e8f7c';ctx.lineWidth=2;ctx.strokeRect(150+i*205,195,160,110);ctx.font='500 34px monospace';ctx.fillText(d,230+i*205,245);ctx.font='400 18px monospace';ctx.fillText('MAG',230+i*205,280)});
      ctx.textAlign='left';ctx.font='400 23px Arial,sans-serif';
      const fields=['Nome e Cognome','Email','Telefono'];fields.forEach((f,i)=>{ctx.strokeStyle='#b9aa96';ctx.strokeRect(130,365+i*92,w-260,68);ctx.fillText(f,170,408+i*92)});
      ctx.fillStyle='#2c231c';ctx.fillRect(130,690,w-260,82);ctx.fillStyle='#f4eadb';ctx.font='500 22px monospace';ctx.fillText('CONFERMA PRENOTAZIONE  →',210,740);
    }),.1));

    const left=rounded(1.55,2.45,.16,smoked,.1);left.position.set(-2.45,-.1,.2);left.rotation.y=.08;g.add(left);
    left.add(textPlane(1.34,2.2,makeCardTexture('LA TUA RICHIESTA','PERCORSO',[
      {text:'✓ CONSULENZA',accent:true},{text:'✓ ANALISI PERSONALIZZATA',accent:true},{text:'✓ PIANO DEDICATO',accent:true}
    ],{accent:'#c9a85e'}),.1));

    const right=rounded(1.55,2.45,.16,smoked,.1);right.position.set(2.45,-.1,.2);right.rotation.y=-.08;g.add(right);
    right.add(textPlane(1.34,2.2,makeCardTexture('RIEPILOGO','25 MAG',[
      {text:'10:00  /  ONLINE'},{text:'30 MINUTI'},{text:'CONFERMA →',accent:true}
    ],{accent:'#c9a85e'}),.1));

    const confirm=rounded(2.55,.85,.14,smoked,.1);confirm.position.set(.2,-1.8,.78);g.add(confirm);
    confirm.add(textPlane(2.3,.62,makeCanvasTexture((ctx,w,h)=>{
      ctx.clearRect(0,0,w,h);ctx.fillStyle='#c9a85e';ctx.font='500 48px Arial,sans-serif';ctx.fillText('✓',42,88);
      ctx.fillStyle='#eee3d3';ctx.font='500 24px monospace';ctx.fillText('PRENOTAZIONE CONFERMATA',120,65);ctx.font='400 18px Arial,sans-serif';ctx.fillText("Dettagli inviati. Aggiungi al calendario.",120,105);
    },900,180),.1));

    return g;
  }

  engine.sceneGroups.site=buildSite();
  engine.sceneGroups.ads=buildAds();
  engine.sceneGroups.global=buildGlobal();
  engine.sceneGroups.action=buildAction();

  Object.entries(engine.sceneGroups).forEach(([key,g])=>{
    master.add(g);
    g.visible=key==='site';
    g.userData.targetScale=key==='site'?1:.92;
    g.userData.targetY=0;
  });
  engine.activeGroup=engine.sceneGroups.site;

  const pointer={x:0,y:0,tx:0,ty:0,drag:false,lastX:0,lastY:0};

  stage.addEventListener('pointerdown',e=>{
    pointer.drag=true;pointer.lastX=e.clientX;pointer.lastY=e.clientY;
    stage.setPointerCapture?.(e.pointerId);
  });
  stage.addEventListener('pointermove',e=>{
    const rect=stage.getBoundingClientRect();
    if(pointer.drag){
      const dx=e.clientX-pointer.lastX,dy=e.clientY-pointer.lastY;
      pointer.tx+=dx*.0045;
      pointer.ty+=dy*.003;
      pointer.lastX=e.clientX;pointer.lastY=e.clientY;
    }else if(e.pointerType!=='touch'){
      pointer.tx=((e.clientX-rect.left)/rect.width-.5)*.28;
      pointer.ty=((e.clientY-rect.top)/rect.height-.5)*.12;
    }
    pointer.tx=THREE.MathUtils.clamp(pointer.tx,-.34,.34);
    pointer.ty=THREE.MathUtils.clamp(pointer.ty,-.16,.16);
  });
  const release=e=>{pointer.drag=false;stage.releasePointerCapture?.(e.pointerId)};
  stage.addEventListener('pointerup',release);
  stage.addEventListener('pointercancel',release);

  function syncSize(){
    const r=canvas.getBoundingClientRect();
    if(!r.width||!r.height)return;
    const pixel=Math.min(devicePixelRatio||1,innerWidth<720?1.25:1.7);
    renderer.setPixelRatio(pixel);
    renderer.setSize(r.width,r.height,false);
    camera.aspect=r.width/r.height;
    cameraTarget.z=innerWidth<720?17.4:9.35;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize',syncSize,{passive:true});
  syncSize();

  const clock=new THREE.Clock();
  let visible=true;
  new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??true},{rootMargin:'20% 0px'}).observe(stage);

  function loop(){
    const dt=Math.min(clock.getDelta(),.05);
    if(visible){
      pointer.x=damp(pointer.x,pointer.tx,5.5,dt);
      pointer.y=damp(pointer.y,pointer.ty,5.5,dt);

      camera.position.z=damp(camera.position.z,cameraTarget.z,4,dt);
      engine.accent.lerp(engine.accentTarget,Math.min(1,dt*4));

      if(engine.activeGroup){
        engine.activeGroup.rotation.y=damp(engine.activeGroup.rotation.y,pointer.x,4.5,dt);
        engine.activeGroup.rotation.x=damp(engine.activeGroup.rotation.x,-pointer.y*.55,4.5,dt);
      }

      for(const g of Object.values(engine.sceneGroups)){
        if(!g.visible)continue;
        const s=damp(g.scale.x,g.userData.targetScale??1,5,dt);
        g.scale.setScalar(s);
        g.position.y=damp(g.position.y,g.userData.targetY??0,5,dt);
      }

      warm.color.copy(engine.accent);
      warm.intensity=damp(warm.intensity,engine.targetMode==='ads'?27:engine.targetMode==='action'?19:15,3,dt);
      key.intensity=damp(key.intensity,engine.targetMode==='action'?5.2:4.2,3,dt);

      renderer.render(scene,camera);
    }
    requestAnimationFrame(loop);
  }

  engine.ready=true;
  loop();
}

setMode('site');
window.__ENTRA_PRIMA_V4__={engine,modes,marketData,setMode};