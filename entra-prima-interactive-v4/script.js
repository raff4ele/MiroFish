const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    description:"Un sito costruito intorno all'identità reale del brand: immagini, gerarchia, UI/UX e atmosfera lavorano insieme per far percepire valore prima ancora della visita.",
    status:'WEBSITE EXPERIENCE',
    asset:'https://raw.githubusercontent.com/raff4ele/MiroFish/entra-prima-flat-visuals-v5/entra-prima-interactive-v4/assets/site.b64',
    alt:'Visual pulito di un sito immersivo ENTRA PRIMA'
  },
  ads:{
    index:'02 / 04',
    title:'ADS / ATTENTION',
    description:"Creative e campagne non vengono trattate come un elemento separato. L'annuncio apre la stessa storia che continua nel sito, con hook, visual e messaggio coerenti.",
    status:'CAMPAIGN EXPERIENCE',
    asset:'https://raw.githubusercontent.com/raff4ele/MiroFish/entra-prima-flat-visuals-v5/entra-prima-interactive-v4/assets/ads.b64',
    alt:'Visual pulito della sezione ADS ENTRA PRIMA'
  },
  global:{
    index:'03 / 04',
    title:'GLOBAL PRESENCE',
    description:"La stessa identità viene adattata a lingua, tono e mercato per presentare il brand fuori dall'Italia senza perdere coerenza, qualità percepita e riconoscibilità.",
    status:'GLOBAL PRESENCE',
    asset:'https://raw.githubusercontent.com/raff4ele/MiroFish/entra-prima-flat-visuals-v5/entra-prima-interactive-v4/assets/global.b64',
    alt:'Visual pulito della presenza internazionale ENTRA PRIMA'
  },
  action:{
    index:'04 / 04',
    title:'AZIONE / BOOKING',
    description:"Il percorso porta a un gesto concreto: prenotare, chiedere informazioni, entrare in showroom o iniziare una conversazione. La conversione diventa parte naturale dell'esperienza.",
    status:'BOOKING EXPERIENCE',
    asset:'https://raw.githubusercontent.com/raff4ele/MiroFish/entra-prima-flat-visuals-v5/entra-prima-interactive-v4/assets/action.b64',
    alt:'Visual pulito del booking e della conversione ENTRA PRIMA'
  }
};

const imageCache=new Map();
const imageEl=document.getElementById('experience-image');
const loaderEl=document.getElementById('visual-loader');

async function getImage(mode){
  if(imageCache.has(mode)) return imageCache.get(mode);
  const text=(await fetch(modes[mode].asset,{cache:'force-cache'}).then(r=>{
    if(!r.ok) throw new Error('asset '+mode+' '+r.status);
    return r.text();
  })).trim();
  const src='data:image/jpeg;base64,'+text;
  imageCache.set(mode,src);
  return src;
}

let currentMode='site';
async function setMode(mode){
  if(!modes[mode]) return;
  currentMode=mode;
  const data=modes[mode];

  document.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('is-active',b.dataset.mode===mode));
  document.getElementById('mode-index').textContent=data.index;
  document.getElementById('mode-title').textContent=data.title;
  document.getElementById('mode-description').textContent=data.description;
  const status=document.getElementById('engine-status-label');
  if(status) status.textContent=data.status;

  if(imageEl){
    imageEl.classList.remove('is-ready');
    loaderEl?.classList.remove('is-hidden');
    const requested=mode;
    try{
      const src=await getImage(mode);
      if(currentMode!==requested) return;
      imageEl.alt=data.alt;
      imageEl.src=src;
      if(imageEl.decode){
        try{await imageEl.decode();}catch{}
      }
      if(currentMode!==requested) return;
      imageEl.classList.add('is-ready');
      loaderEl?.classList.add('is-hidden');
    }catch(err){
      console.error(err);
      if(currentMode===requested && loaderEl) loaderEl.textContent='VISUAL NON DISPONIBILE';
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

setMode('site');
if(!reducedMotion){
  requestIdleCallback?.(()=>Promise.allSettled(['ads','global','action'].map(getImage)),{timeout:2500});
}
window.__ENTRA_PRIMA_V5__={modes,setMode,getImage};

/* V6 — viewport-bound storytelling animations */
const v6Animated = new WeakSet();

function animateCounter(el){
  const target=Number(el.dataset.count||0);
  if(!Number.isFinite(target)) return;

  // Mobile/TikTok: show the real value immediately instead of leaving
  // an empty/half-animated number when the in-app observer is throttled.
  if(matchMedia('(max-width:720px)').matches){
    el.textContent=String(target);
    return;
  }

  const duration=720;
  const start=performance.now();
  const tick=(now)=>{
    const p=Math.min(1,(now-start)/duration);
    const eased=1-Math.pow(1-p,3);
    el.textContent=String(Math.round(target*eased));
    if(p<1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

if(matchMedia('(max-width:720px)').matches){
  document.querySelectorAll('[data-count]').forEach(el=>{
    const value=Number(el.dataset.count||0);
    if(Number.isFinite(value)) el.textContent=String(value);
  });
}

const storyObserver=new IntersectionObserver(entries=>{
  for(const entry of entries){
    if(!entry.isIntersecting || v6Animated.has(entry.target)) continue;
    v6Animated.add(entry.target);
    entry.target.classList.add('is-active');
    entry.target.querySelectorAll?.('[data-count]').forEach(animateCounter);
    storyObserver.unobserve(entry.target);
  }
},{threshold:.24,rootMargin:'0px 0px -10% 0px'});

document.querySelectorAll('[data-funnel],[data-global-diagram],[data-chart]').forEach(el=>{
  storyObserver.observe(el);
});

window.__ENTRA_PRIMA_V6__={
  version:'strategy-v6',
  storySections:document.querySelectorAll('[data-funnel],[data-global-diagram],[data-chart]').length
};


/* =========================================================
   V15 — real layered immersive hero
   ========================================================= */
const immersiveHero=document.querySelector('[data-immersive-hero]');
if(immersiveHero){
  const topbar=document.querySelector('.topbar');
  const cue=immersiveHero.querySelector('.immersive-hero__scroll');

  let ticking=false;
  const clamp01=v=>Math.min(1,Math.max(0,v));

  function updateImmersiveHero(){
    ticking=false;

    const rect=immersiveHero.getBoundingClientRect();
    const progress=clamp01((-rect.top)/Math.max(1,immersiveHero.offsetHeight));
    immersiveHero.style.setProperty('--immersive-scroll',progress.toFixed(4));


    if(cue){
      const opacity=Math.max(0,1-progress*2.5);
      cue.style.opacity=opacity.toFixed(3);
      cue.style.pointerEvents=progress>.45?'none':'auto';
    }

    if(topbar){
      const overHero=rect.bottom>Math.max(86,window.innerHeight*.12);
      topbar.classList.toggle('is-over-hero',overHero);
    }
  }

  function requestImmersiveFrame(){
    if(ticking) return;
    ticking=true;
    requestAnimationFrame(updateImmersiveHero);
  }

  addEventListener('scroll',requestImmersiveFrame,{passive:true});
  addEventListener('resize',requestImmersiveFrame,{passive:true});
  requestImmersiveFrame();

  window.__ENTRA_PRIMA_IMMERSIVE_HERO__={
    update:updateImmersiveHero,
    get progress(){
      const rect=immersiveHero.getBoundingClientRect();
      return clamp01((-rect.top)/Math.max(1,immersiveHero.offsetHeight));
    }
  };
}


/* =========================================================
   V20 — interactive 3D reference experience
   ========================================================= */
document.querySelectorAll('[data-ep3d]').forEach(demo=>{
  const viewport=demo.querySelector('[data-ep3d-viewport]');
  const world=demo.querySelector('[data-ep3d-world]');
  const panels=[...demo.querySelectorAll('[data-ep3d-panel]')];
  const dots=[...demo.querySelectorAll('[data-ep3d-dot]')];
  if(!viewport || !world || !panels.length) return;

  let active=0;
  let dragging=false;
  let moved=false;
  let startX=0;
  let startY=0;
  let lastX=0;

  const wrapRel=(i)=>{
    let rel=i-active;
    const half=Math.floor(panels.length/2);
    if(rel>half) rel-=panels.length;
    if(rel<-half) rel+=panels.length;
    return rel;
  };

  function layout(){
    const vw=viewport.clientWidth||360;
    const step=Math.min(138,Math.max(84,vw*.29));
    const depth=Math.min(118,Math.max(72,vw*.24));

    panels.forEach((panel,i)=>{
      const rel=wrapRel(i);
      const distance=Math.abs(rel);
      const x=rel*step;
      const y=distance*8;
      const z=-distance*depth;
      const rotate=rel*-11;
      const scale=Math.max(.67,1-distance*.085);
      const opacity=Math.max(.28,1-distance*.20);

      panel.style.transform=
        `translate3d(calc(-50% + ${x}px),calc(-50% + ${y}px),${z}px) rotateY(${rotate}deg) scale(${scale})`;
      panel.style.opacity=String(opacity);
      panel.style.filter=distance===0?'brightness(1) saturate(1)':
        `brightness(${Math.max(.48,.82-distance*.09)}) saturate(.82)`;
      panel.style.zIndex=String(20-distance);
      panel.classList.toggle('is-active',distance===0);
      panel.setAttribute('aria-pressed',distance===0?'true':'false');

      const video=panel.querySelector('video');
      if(video){
        video.muted=true;
        video.playsInline=true;
        if(distance===0){
          const playPromise=video.play();
          playPromise?.catch?.(()=>{});
        }else{
          video.pause();
        }
      }
    });

    dots.forEach((dot,i)=>dot.classList.toggle('is-active',i===active));
  }

  function setActive(next){
    active=(next+panels.length)%panels.length;
    layout();
  }

  function tiltFromPoint(clientX,clientY){
    const rect=viewport.getBoundingClientRect();
    const nx=Math.max(-1,Math.min(1,((clientX-rect.left)/rect.width-.5)*2));
    const ny=Math.max(-1,Math.min(1,((clientY-rect.top)/rect.height-.5)*2));
    demo.style.setProperty('--ep3d-y',`${(nx*6).toFixed(2)}deg`);
    demo.style.setProperty('--ep3d-x',`${(-ny*3.5).toFixed(2)}deg`);
    demo.style.setProperty('--ep3d-lx',`${(50+nx*18).toFixed(1)}%`);
    demo.style.setProperty('--ep3d-ly',`${(43+ny*10).toFixed(1)}%`);
  }

  function resetTilt(){
    demo.style.setProperty('--ep3d-y','0deg');
    demo.style.setProperty('--ep3d-x','0deg');
    demo.style.setProperty('--ep3d-lx','50%');
    demo.style.setProperty('--ep3d-ly','42%');
  }

  viewport.addEventListener('pointerdown',e=>{
    dragging=true;
    moved=false;
    startX=lastX=e.clientX;
    startY=e.clientY;
    viewport.classList.add('is-dragging');
    viewport.setPointerCapture?.(e.pointerId);
    tiltFromPoint(e.clientX,e.clientY);
  });

  viewport.addEventListener('pointermove',e=>{
    if(!dragging){
      if(e.pointerType==='mouse') tiltFromPoint(e.clientX,e.clientY);
      return;
    }

    const dx=e.clientX-startX;
    const dy=e.clientY-startY;
    lastX=e.clientX;
    if(Math.abs(dx)>6) moved=true;

    if(Math.abs(dx)>Math.abs(dy)){
      e.preventDefault?.();
      const dragTilt=Math.max(-10,Math.min(10,dx/18));
      demo.style.setProperty('--ep3d-y',`${dragTilt.toFixed(2)}deg`);
    }
    tiltFromPoint(e.clientX,e.clientY);
  },{passive:false});

  const endDrag=e=>{
    if(!dragging) return;
    dragging=false;
    viewport.classList.remove('is-dragging');
    const dx=(e?.clientX ?? lastX)-startX;
    if(Math.abs(dx)>38) setActive(active+(dx<0?1:-1));
    resetTilt();
    setTimeout(()=>{moved=false},0);
  };

  viewport.addEventListener('pointerup',endDrag);
  viewport.addEventListener('pointercancel',endDrag);
  viewport.addEventListener('pointerleave',e=>{
    if(dragging) endDrag(e);
    else resetTilt();
  });

  panels.forEach((panel,i)=>{
    panel.addEventListener('click',e=>{
      if(moved){e.preventDefault();return}
      setActive(i);
    });
  });

  dots.forEach((dot,i)=>dot.addEventListener('click',()=>setActive(i)));

  addEventListener('resize',layout,{passive:true});

  const demoVideo=demo.querySelector('video');
  if(demoVideo && 'IntersectionObserver' in window){
    const videoObserver=new IntersectionObserver(entries=>{
      const entry=entries[0];
      if(!entry) return;
      if(entry.isIntersecting && active===0){
        demoVideo.muted=true;
        demoVideo.play()?.catch?.(()=>{});
      }else{
        demoVideo.pause();
      }
    },{threshold:.12});
    videoObserver.observe(demo);
  }

  layout();

  demo.__ep3d={setActive,get active(){return active}};
});


/* =========================================================
   V23 — interactive system atlas
   ========================================================= */
document.querySelectorAll('[data-system-atlas]').forEach(atlas=>{
  const core=atlas.querySelector('[data-system-core]');
  const nodes=[...atlas.querySelectorAll('[data-system-node]')];
  const indexEl=atlas.querySelector('[data-system-index]');
  const titleEl=atlas.querySelector('[data-system-title]');
  const descriptionEl=atlas.querySelector('[data-system-description]');
  const detailsEl=atlas.querySelector('[data-system-details]');
  const outcomeEl=atlas.querySelector('[data-system-outcome]');

  if(!core || !nodes.length) return;

  const data={
    site:{
      index:'01 / EXPERIENCE',
      title:'SITO IMMERSIVO',
      description:'Una presenza digitale costruita intorno al brand, non un template riempito di contenuti. Ogni sezione accompagna lo sguardo, rende immediatamente chiaro cosa offri e fa percepire più valore prima ancora del contatto.',
      details:['UX mobile-first','Motion & interazioni','Prenotazione integrata','Velocità & chiarezza'],
      outcome:'Far percepire più valore prima ancora del contatto.'
    },
    attention:{
      index:'02 / ATTENTION',
      title:'ATTENZIONE CHE RESTA',
      description:'Non basta pubblicare contenuti. Creo una direzione visiva coerente tra sito, video, social e campagne: hook, ritmo, immagini e tono devono far fermare lo sguardo senza sembrare una pubblicità generica.',
      details:['Visual direction','Video & creative','Hook nei primi secondi','Coerenza cross-channel'],
      outcome:'Essere riconosciuti prima ancora di leggere il nome del brand.'
    },
    ads:{
      index:'03 / DISTRIBUTION',
      title:'ADS COERENTI',
      description:'La campagna non vive separata dal sito. Creatività, promessa, pubblico e landing devono parlare la stessa lingua. Distribuisco l’esperienza verso persone con un intento reale, localmente o su mercati esteri.',
      details:['Target & intento','Creative testing','Landing coerente','Locale → internazionale'],
      outcome:'Portare persone più adatte dentro un’esperienza già preparata a convertirle.'
    },
    action:{
      index:'04 / CONVERSION',
      title:'AZIONE NATURALE',
      description:'Prenotare, chiedere informazioni o acquistare non deve sembrare un salto improvviso. CTA, percorso, messaggi e micro-interazioni riducono la frizione e trasformano l’interesse nel passo successivo.',
      details:['CTA contestuali','Booking & contatto','Riduzione frizione','Misurazione segnali'],
      outcome:'Far sembrare il contatto la conclusione naturale dell’esperienza.'
    }
  };

  const order=['site','attention','ads','action'];
  let active='site';
  let userInteracted=false;
  let autoTimer=null;

  function render(key,fromUser=false){
    const item=data[key];
    if(!item || key===active && fromUser) return;

    active=key;
    if(fromUser) userInteracted=true;

    nodes.forEach(node=>{
      const isActive=node.dataset.systemNode===key;
      node.classList.toggle('is-active',isActive);
      node.setAttribute('aria-pressed',isActive?'true':'false');
    });

    core.classList.remove('is-changing');
    void core.offsetWidth;
    core.classList.add('is-changing');

    if(indexEl) indexEl.textContent=item.index;
    if(titleEl) titleEl.textContent=item.title;
    if(descriptionEl) descriptionEl.textContent=item.description;
    if(detailsEl){
      detailsEl.innerHTML=item.details.map(v=>`<span>${v}</span>`).join('');
    }
    if(outcomeEl) outcomeEl.textContent=item.outcome;
  }

  let lastSystemActivation=0;

  function activateSystemNode(node,event){
    if(!node) return;

    const now=Date.now();
    if(now-lastSystemActivation<280) return;
    lastSystemActivation=now;

    if(event?.cancelable && event.type==='touchend'){
      event.preventDefault();
    }

    userInteracted=true;
    clearInterval(autoTimer);
    autoTimer=null;
    render(node.dataset.systemNode,true);
  }

  nodes.forEach(node=>{
    node.addEventListener('pointerup',event=>{
      activateSystemNode(node,event);
    });

    node.addEventListener('touchend',event=>{
      activateSystemNode(node,event);
    },{passive:false});

    node.addEventListener('click',event=>{
      activateSystemNode(node,event);
    });
  });

  // iOS/TikTok fallback: delegated touch handler in case the embedded
  // browser loses the direct button listener during compositing.
  atlas.addEventListener('touchend',event=>{
    const node=event.target?.closest?.('[data-system-node]');
    if(node) activateSystemNode(node,event);
  },{passive:false,capture:true});

  atlas.addEventListener('pointermove',e=>{
    if(matchMedia('(max-width:720px)').matches) return;
    const r=atlas.getBoundingClientRect();
    const x=((e.clientX-r.left)/r.width)*100;
    const y=((e.clientY-r.top)/r.height)*100;
    atlas.style.setProperty('--atlas-light-x',`${x.toFixed(1)}%`);
    atlas.style.setProperty('--atlas-light-y',`${y.toFixed(1)}%`);
  });

  atlas.addEventListener('pointerleave',()=>{
    atlas.style.setProperty('--atlas-light-x','50%');
    atlas.style.setProperty('--atlas-light-y','50%');
  });

  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{
      const visible=entries[0]?.isIntersecting;
      if(visible && !userInteracted && !matchMedia('(prefers-reduced-motion: reduce)').matches){
        clearInterval(autoTimer);
        autoTimer=setInterval(()=>{
          if(userInteracted){clearInterval(autoTimer);return}
          const next=(order.indexOf(active)+1)%order.length;
          render(order[next],false);
        },5200);
      }else{
        clearInterval(autoTimer);
        autoTimer=null;
      }
    },{threshold:.35});
    observer.observe(atlas);
  }

  render('site',false);
});
