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
   V9 — DOM architectural construction scrub
   ========================================================= */
const buildHero=document.querySelector('[data-build-hero]');
if(buildHero){
  const pieces=[...buildHero.querySelectorAll('[data-build-piece]')];
  const finalImage=buildHero.querySelector('[data-build-final]');
  const emptyImage=buildHero.querySelector('.build-empty-image');
  const shade=buildHero.querySelector('.build-hero__shade');
  const cue=buildHero.querySelector('.build-hero__scroll');
  const stageIndex=buildHero.querySelector('.build-stage-index');
  const stageLabel=buildHero.querySelector('.build-stage-label');

  const clamp01=v=>Math.min(1,Math.max(0,v));
  const smooth=(a,b,v)=>{
    const t=clamp01((v-a)/(b-a));
    return t*t*(3-2*t);
  };

  const ranges=[
    [.05,.18],
    [.12,.30],
    [.20,.42],
    [.30,.53],
    [.43,.66],
    [.56,.75],
    [.64,.82]
  ];
  const enterY=[48,44,52,58,-52,38,30];
  const enterX=[0,-18,18,0,0,12,-10];

  const stages=[
    [0.00,'00','TERRENO'],
    [0.06,'01','FONDAZIONI'],
    [0.18,'02','STRUTTURA'],
    [0.34,'03','VOLUMI'],
    [0.52,'04','VETRI'],
    [0.68,'05','FINITURE'],
    [0.88,'06','ENTRA PRIMA']
  ];

  let ticking=false;
  let lastProgress=-1;

  function applyDomBuildProgress(progress){
    progress=clamp01(progress);
    buildHero.style.setProperty('--build-progress',progress.toFixed(4));

    pieces.forEach((piece,i)=>{
      const range=ranges[i]||[0,1];
      const t=smooth(range[0],range[1],progress);
      const eased=1-Math.pow(1-t,3);
      const x=(1-eased)*(enterX[i]||0);
      const y=(1-eased)*(enterY[i]||0);
      const scale=.992+eased*.008;
      piece.style.opacity=eased.toFixed(4);
      piece.style.transform=`translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) scale(${scale.toFixed(4)})`;
      piece.style.filter=`brightness(${(.78+eased*.18).toFixed(3)}) saturate(.97) contrast(1.04)`;
    });

    const finalT=smooth(.875,.985,progress);
    if(finalImage){
      finalImage.style.opacity=finalT.toFixed(4);
      finalImage.style.transform=`scale(${(1.008-finalT*.008).toFixed(4)})`;
    }

    if(emptyImage){
      const fade=1-smooth(.86,.99,progress)*.88;
      emptyImage.style.opacity=Math.max(.12,fade).toFixed(4);
      emptyImage.style.filter=`brightness(${(.84+progress*.08).toFixed(3)}) saturate(.94) contrast(1.03)`;
    }

    if(shade) shade.style.opacity=(.56-progress*.20).toFixed(3);
    if(cue){
      cue.style.opacity=(1-smooth(.015,.13,progress)).toFixed(3);
      cue.style.pointerEvents=progress>.14?'none':'auto';
    }

    let active=stages[0];
    for(const stage of stages){
      if(progress>=stage[0]) active=stage;
    }
    if(stageIndex) stageIndex.textContent=active[1];
    if(stageLabel) stageLabel.textContent=active[2];

    lastProgress=progress;
  }

  function computeBuildProgress(){
    const header=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header'))||0;
    const viewport=Math.max(1,innerHeight-header);
    const rect=buildHero.getBoundingClientRect();
    const docTop=rect.top+scrollY;
    const travel=Math.max(1,buildHero.offsetHeight-viewport);
    return clamp01((scrollY-(docTop-header))/travel);
  }

  function updateBuildHero(){
    ticking=false;
    const progress=computeBuildProgress();
    if(Math.abs(progress-lastProgress)>.0004) applyDomBuildProgress(progress);
  }

  function requestBuildUpdate(){
    if(ticking) return;
    ticking=true;
    requestAnimationFrame(updateBuildHero);
  }

  addEventListener('scroll',requestBuildUpdate,{passive:true});
  addEventListener('resize',requestBuildUpdate,{passive:true});

  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    applyDomBuildProgress(1);
  }else{
    applyDomBuildProgress(computeBuildProgress());
  }

  window.__ENTRA_PRIMA_BUILD_HERO__={
    get progress(){return computeBuildProgress()},
    applyDomBuildProgress
  };
}
