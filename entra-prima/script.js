(() => {
  document.documentElement.classList.add('js');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const qs=(s,r=document)=>r.querySelector(s), qsa=(s,r=document)=>[...r.querySelectorAll(s)];

  document.body.innerHTML = `
    <div class="scroll-progress" aria-hidden="true"><span></span></div>
    <header class="topbar">
      <a class="brand" href="#hero"><svg class="brand-mark" viewBox="0 0 64 64"><path d="M17 12h24c8 0 13 4 13 11 0 8-6 12-15 12H17V12Z"/><path d="M17 35h18c9 0 14 4 14 11 0 6-5 10-13 10H17V35Z"/><path d="M17 12v44M25 20h14M25 43h11"/></svg><span><strong>ENTRA PRIMA</strong><small>Il cliente entra prima di arrivare.</small></span></a>
      <nav class="desktop-nav"><a href="#before-after">Prima / Dopo</a><a href="#difference">Differenza</a><a href="#ads-world">ADS estero</a><a href="#portfolio">Demo</a></nav>
      <a class="nav-cta" href="#contact">Voglio la mia demo <span>↗</span></a>
    </header>

    <main>
      <section class="hero" id="hero">
        <div class="hero-grid" aria-hidden="true"></div>
        <div class="hero-copy">
          <p class="eyebrow">Esperienze digitali immersive / Milano → World</p>
          <h1>Non costruisco siti.<br><em>Costruisco il primo incontro.</em></h1>
          <p class="hero-lede">Trasformo un brand in un'esperienza digitale che <strong>si muove, reagisce, racconta e converte</strong>: 3D, scroll storytelling, UI/UX, prenotazioni e una presenza pensata anche per il pubblico internazionale.</p>
          <div class="hero-actions">
            <a class="cta cta-primary" href="#before-after"><span>Guarda la trasformazione</span><b>↓</b></a>
            <a class="cta cta-ghost" href="#ads-world"><span>Come porto il brand fuori dall'Italia</span><b>↗</b></a>
          </div>
          <div class="hero-note"><span class="note-line"></span><p>3D · Scroll animation · UI/UX · ADS · IT/EN · Booking</p></div>
        </div>
        <div class="portal-wrap" aria-label="Oggetto 3D ENTRA PRIMA">
          <div class="portal-fallback"><div class="bright-orbit"></div><span class="orb-dot a"></span><span class="orb-dot b"></span><span class="orb-dot c"></span><div class="ep-monogram">EP</div><div class="float-ui one"><i></i>3D interaction</div><div class="float-ui two"><i></i>Scroll storytelling</div></div>
        </div>
      </section>

      <section class="statement section-pad">
        <p class="eyebrow">Il punto</p>
        <div><h2>La maggior parte dei siti <em>informa.</em><br>ENTRA PRIMA fa <em>percepire.</em></h2><p class="statement-copy">L'obiettivo non è riempire una pagina di effetti. Ogni movimento deve avere una funzione: guidare lo sguardo, spiegare il valore, far ricordare il brand e portare naturalmente verso una prenotazione, una richiesta o un contatto.</p></div>
      </section>

      <section class="comparison section-pad" id="before-after">
        <div class="section-heading"><div><p class="eyebrow">Prima / Dopo</p><h2>Stesso brand.<br><em>Un'altra percezione.</em></h2></div><p>Trascina il confine. Il “dopo” non è un altro template: è la stessa identità trasformata in profondità, movimento e interazione.</p></div>
        <div class="compare-stage" data-compare>
          <div class="compare-side compare-before"><div class="browser-shell"><div class="browser-top"><span></span><span></span><span></span></div><div class="generic-site"><small>SITO TRADIZIONALE</small><h3>La nostra attività</h3><p>Qualità, esperienza e attenzione al cliente.</p><div class="generic-img"></div><button type="button">Scopri di più</button></div></div><div class="compare-label"><span>PRIMA</span><strong>Presenza</strong></div></div>
          <div class="compare-side compare-after"><div class="browser-shell"><div class="browser-top"><span></span><span></span><span></span></div><div class="immersive-site"><div class="immersive-photo"></div><div class="immersive-copy"><small>ENTRA PRIMA EXPERIENCE</small><h3>Il brand<br><em>prende vita.</em></h3><span class="mini-cta">ENTRA NELL'ESPERIENZA ↗</span></div></div></div><div class="compare-label"><span>DOPO</span><strong>Desiderio</strong></div></div>
          <div class="compare-divider"><span>‹</span><span>›</span></div>
        </div>
        <div class="signal-grid" data-scroll-chart>
          <article class="signal-card"><div class="signal-icon">◉</div><div><strong>Attenzione</strong><span>Più profondità di esplorazione</span></div><svg viewBox="0 0 180 54"><path class="graph-base graph-line" d="M2 47C29 46 32 39 55 39S83 32 98 31s24-14 36-16 24-12 44-12"/></svg></article>
          <article class="signal-card"><div class="signal-icon">↗</div><div><strong>Intenzione</strong><span>Il percorso conduce alla CTA</span></div><svg viewBox="0 0 180 54"><path class="graph-base graph-line" d="M2 48c18-2 28-4 41-10 18-8 23-4 36-10 17-7 19-18 36-17 23 1 29-7 63-9"/></svg></article>
          <article class="signal-card"><div class="signal-icon">◇</div><div><strong>Memoria</strong><span>Un'identità più riconoscibile</span></div><svg viewBox="0 0 180 54"><path class="graph-base graph-line" d="M2 48c17 0 18-11 34-11 19 0 21 3 34-7 14-11 24-7 34-15 16-12 35-7 74-12"/></svg></article>
        </div>
        <p class="metric-note">Grafici concettuali: i risultati reali vengono misurati sul progetto, non inventati prima.</p>
      </section>

      <section class="difference" id="difference">
        <div class="difference-grid">
          <div class="difference-copy"><p class="eyebrow">Cosa faccio di diverso</p><h2>Non parto dal template.<br><em>Parto da ciò che ti rende unico.</em></h2><p>Una normale agenzia può consegnarti una presenza online. Io costruisco un sistema che unisce identità, esperienza, conversione e distribuzione internazionale.</p></div>
          <div class="difference-board">
            <div class="difference-flow">
              <div class="difference-row"><strong>Approccio standard</strong><div class="flow"><span class="pill">Template</span><span>→</span><span class="pill">Contenuti</span><span>→</span><span class="pill">Pubblicazione</span></div></div>
              <div class="difference-row enp"><strong>ENTRA PRIMA</strong><div class="flow"><span class="pill">Identità</span><span>→</span><span class="pill">Emozione</span><span>→</span><span class="pill">3D + Motion</span><span>→</span><span class="pill">Azione</span><span>→</span><span class="pill">Crescita</span></div><div class="difference-line"></div></div>
            </div>
          </div>
        </div>
      </section>

      <section class="concept section-pad" id="concept">
        <div class="concept-copy"><p class="eyebrow">Dentro l'esperienza</p><h2>Ogni dettaglio<br><em>ha un ruolo.</em></h2><p>Oggetti 3D, scroll, immagini, transizioni, copy e CTA vengono progettati insieme. Non sono decorazione: diventano parte del racconto e del percorso verso l'azione.</p><a class="text-link" href="#portfolio">Apri le demo reali <span>↗</span></a></div>
        <div class="product-orbit"><div class="orbit-card main-card"><div class="tailoring-photo"></div><span class="hotspot h1">+</span><span class="hotspot h2">+</span><span class="hotspot h3">+</span><div class="material-card"><small>INTERAZIONE</small><strong>Dettaglio che<br>si può esplorare</strong><span>Tap / hover / scroll ↗</span></div></div><div class="orbit-card small-card one"></div><div class="orbit-card small-card two"></div></div>
        <div class="journey"><div class="journey-line"></div><article><span class="journey-num">01</span><div><strong>Identità</strong><p>Capisco ciò che rende il brand impossibile da confondere.</p></div></article><article><span class="journey-num">02</span><div><strong>Immersione</strong><p>Scroll e 3D costruiscono ritmo e profondità.</p></div></article><article><span class="journey-num">03</span><div><strong>Interazione</strong><p>Il visitatore esplora, sceglie e scopre.</p></div></article><article><span class="journey-num">04</span><div><strong>Azione</strong><p>Prenotazione, richiesta o acquisto diventano il passo naturale.</p></div></article></div>
      </section>

      <section class="ads-world" id="ads-world">
        <div class="ads-shell">
          <div class="ads-head"><div><p class="eyebrow">ADS + Internazionalizzazione</p><h2>Da Milano<br><em>al pubblico giusto.</em></h2></div><p>Non mi fermo all'esperienza digitale. Posso costruire anche il percorso con cui il brand viene presentato fuori dall'Italia: creatività ADS, messaggi localizzati, lingua inglese e landing coerenti con il mercato di destinazione.</p></div>
          <div class="ads-stage">
            <div class="globe-card"><div class="globe-fallback"><div class="globe"></div><span class="city-tag milan">MILANO</span><span class="city-tag london">LONDRA</span><span class="city-tag ny">NEW YORK</span><span class="city-tag dubai">DUBAI</span></div></div>
            <div class="ads-flow">
              <div class="ads-step"><div class="icon3d">✦</div><div><strong>Creatività ADS</strong><p>Video e visual costruiti per attirare l'attenzione del pubblico che vuoi raggiungere.</p></div></div><div class="ads-route"></div>
              <div class="ads-step"><div class="icon3d">◎</div><div><strong>Target internazionale</strong><p>Messaggio, lingua e percezione vengono adattati al mercato, senza perdere l'identità italiana.</p></div></div><div class="ads-route"></div>
              <div class="ads-step"><div class="icon3d">↳</div><div><strong>Esperienza → prenotazione</strong><p>L'annuncio non finisce al click: conduce dentro un'esperienza pensata per trasformare interesse in azione.</p></div></div>
            </div>
          </div>
          <div class="funnel"><div class="funnel-title"><strong>Il percorso che costruisco</strong><span>Schema illustrativo, non dati promessi</span></div><div class="funnel-bars"><div class="funnel-bar">ADS / DISCOVERY</div><div class="funnel-bar">ESPERIENZA IMMERSIVA</div><div class="funnel-bar">INTERESSE / CONTATTO</div><div class="funnel-bar">PRENOTAZIONE</div></div></div>
        </div>
      </section>

      <section class="portfolio section-pad" id="portfolio">
        <div class="section-heading"><div><p class="eyebrow">Demo reali</p><h2>Non devi immaginarlo.<br><em>Puoi entrarci.</em></h2></div><p>Ogni esperienza cambia linguaggio visivo in base all'attività. Qui puoi aprire progetti costruiti per settori diversi.</p></div>
        <div class="work-grid">
          <a class="work-card work-tailor" href="https://luigi-monza-luxe-62xdg6p2u-agent25.vercel.app" target="_blank"><div class="work-img"></div><div class="work-overlay"></div><span class="work-index">01</span><div class="work-meta"><small>SARTORIA SU MISURA</small><h3>Luigi Monza</h3><span>Apri esperienza ↗</span></div></a>
          <a class="work-card work-jewel" href="https://gm-gioielli-higgsfield-5rhsqc1bh-agent25.vercel.app" target="_blank"><div class="work-img"></div><div class="work-overlay"></div><span class="work-index">02</span><div class="work-meta"><small>GIOIELLERIA</small><h3>GM Gioielli</h3><span>Apri esperienza ↗</span></div></a>
          <a class="work-card work-flower" href="https://domenico-tesoro-entra-prima-flnv8bclf-agent25.vercel.app" target="_blank"><div class="work-img"></div><div class="work-overlay"></div><span class="work-index">03</span><div class="work-meta"><small>ATELIER FLOREALE</small><h3>Domenico Tesoro</h3><span>Apri esperienza ↗</span></div></a>
        </div>
      </section>

      <section class="contact section-pad" id="contact">
        <div class="contact-copy"><p class="eyebrow">Il prossimo può essere il tuo</p><h2>Fammi vedere il brand.<br><em>Ti mostro cosa può diventare.</em></h2><p>Parto dalla tua attività, non da un template. Posso preparare una direzione visiva personalizzata e mostrarti come potrebbe prendere vita ENTRA PRIMA.</p><a class="cta cta-primary" href="mailto:?subject=ENTRA%20PRIMA%20%E2%80%94%20Demo%20personalizzata"><span>Voglio vedere la mia demo</span><b>↗</b></a><small class="contact-hint">Una prima anteprima serve a capire la direzione, senza obbligarti a immaginarla.</small></div>
        <div class="contact-object"><div class="black-card"><svg class="card-logo" viewBox="0 0 64 64"><path d="M17 12h24c8 0 13 4 13 11 0 8-6 12-15 12H17V12Z"/><path d="M17 35h18c9 0 14 4 14 11 0 6-5 10-13 10H17V35Z"/><path d="M17 12v44M25 20h14M25 43h11"/></svg><strong>ENTRA PRIMA</strong><small>Il cliente entra prima di arrivare.</small></div></div>
      </section>
    </main>

    <footer><a class="brand" href="#hero"><svg class="brand-mark" viewBox="0 0 64 64"><path d="M17 12h24c8 0 13 4 13 11 0 8-6 12-15 12H17V12Z"/><path d="M17 35h18c9 0 14 4 14 11 0 6-5 10-13 10H17V35Z"/><path d="M17 12v44M25 20h14M25 43h11"/></svg><span><strong>ENTRA PRIMA</strong><small>Digital experiences built around identity.</small></span></a><div class="footer-tags"><span>3D</span><span>SCROLL</span><span>UI/UX</span><span>ADS</span><span>IT/EN</span></div><p>© 2026 ENTRA PRIMA</p></footer>
  `;

  function setupCompare(){
    const stage=qs('[data-compare]'); if(!stage) return;
    const after=qs('.compare-after',stage), divider=qs('.compare-divider',stage); let value=50,drag=false;
    const set=v=>{value=Math.max(8,Math.min(92,v));after.style.clipPath=`inset(0 0 0 ${value}%)`;divider.style.left=`${value}%`;stage.setAttribute('aria-valuenow',Math.round(value));};
    const pointer=x=>{const r=stage.getBoundingClientRect();set((x-r.left)/r.width*100)};
    stage.setAttribute('role','slider');stage.setAttribute('tabindex','0');stage.setAttribute('aria-label','Confronto prima e dopo');stage.setAttribute('aria-valuemin','8');stage.setAttribute('aria-valuemax','92');stage.setAttribute('aria-valuenow','50');
    stage.addEventListener('pointerdown',e=>{drag=true;stage.setPointerCapture?.(e.pointerId);pointer(e.clientX)});stage.addEventListener('pointermove',e=>drag&&pointer(e.clientX));stage.addEventListener('pointerup',e=>{drag=false;stage.releasePointerCapture?.(e.pointerId)});stage.addEventListener('pointercancel',()=>drag=false);stage.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){set(value-3);e.preventDefault()}if(e.key==='ArrowRight'){set(value+3);e.preventDefault()}});
  }

  function initHero3D(){
    if(reduced||!window.THREE) return; const host=qs('.portal-wrap'); if(!host) return; let renderer;
    try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'})}catch(e){return}
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6));renderer.setClearColor(0x000000,0);host.appendChild(renderer.domElement);host.classList.add('is-webgl');
    const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(38,1,.1,100);camera.position.z=8.5;const root=new THREE.Group();scene.add(root);
    const mat=new THREE.MeshPhysicalMaterial({color:0x7181ff,metalness:.12,roughness:.12,transmission:.28,transparent:true,opacity:.9,clearcoat:1});
    const knot=new THREE.Mesh(new THREE.TorusKnotGeometry(2.25,.55,180,28,2,3),mat);root.add(knot);
    const ringMat=new THREE.MeshBasicMaterial({color:0xff776c,transparent:true,opacity:.55});for(let i=0;i<3;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(3.15+i*.5,.025,12,150),ringMat.clone());r.rotation.x=.9+i*.2;r.rotation.y=.35+i*.25;root.add(r)}
    const planeMat=new THREE.MeshPhysicalMaterial({color:0xffffff,roughness:.05,metalness:0,transmission:.55,transparent:true,opacity:.66,clearcoat:1});for(let i=0;i<5;i++){const p=new THREE.Mesh(new THREE.BoxGeometry(1.15,.12,1.5),planeMat.clone());p.position.set((i-2)*.8,Math.sin(i)*1.1,(i%2)*.6-1);p.rotation.set(.35+i*.08,.4+i*.22,.2*i);root.add(p)}
    scene.add(new THREE.HemisphereLight(0xffffff,0x7d63ff,2.2));const key=new THREE.PointLight(0xff7f72,3,16);key.position.set(3,2,5);scene.add(key);const fill=new THREE.PointLight(0x5f70ff,3,18);fill.position.set(-3,-2,4);scene.add(fill);
    let mx=0,my=0;addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5},{passive:true});
    const resize=()=>{const r=host.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/Math.max(1,r.height);camera.updateProjectionMatrix()};resize();addEventListener('resize',resize,{passive:true});
    const clock=new THREE.Clock();(function loop(){const t=clock.getElapsedTime();root.rotation.y+=(mx*.5-root.rotation.y)*.025;root.rotation.x+=(-my*.28-root.rotation.x)*.025;knot.rotation.z=t*.12;knot.rotation.x=Math.sin(t*.35)*.18;renderer.render(scene,camera);requestAnimationFrame(loop)})();
    if(window.gsap&&window.ScrollTrigger){gsap.to(root.rotation,{z:1.1,y:1.45,ease:'none',scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom top',scrub:1}});gsap.to(camera.position,{z:6.6,ease:'none',scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom top',scrub:1}})}
  }

  function initGlobe3D(){
    if(reduced||!window.THREE) return; const host=qs('.globe-card'); if(!host)return; let renderer;try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true})}catch(e){return};renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.setClearColor(0,0);host.appendChild(renderer.domElement);
    const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(38,1,.1,100);camera.position.z=6.6;const globe=new THREE.Mesh(new THREE.SphereGeometry(2,64,64),new THREE.MeshPhysicalMaterial({color:0x6574ff,roughness:.24,metalness:.05,transmission:.08,clearcoat:1}));scene.add(globe);
    const wire=new THREE.Mesh(new THREE.SphereGeometry(2.03,26,16),new THREE.MeshBasicMaterial({color:0xffffff,wireframe:true,transparent:true,opacity:.18}));scene.add(wire);
    const arcMat=new THREE.MeshBasicMaterial({color:0xff7569,transparent:true,opacity:.9});[[0,0],[.55,.25],[-.65,.18],[.35,-.55]].forEach((pt,i)=>{const t=new THREE.Mesh(new THREE.TorusGeometry(2.35+i*.08,.018,8,90,Math.PI*1.1),arcMat.clone());t.rotation.set(1.1+i*.2,pt[0],pt[1]);scene.add(t)});
    scene.add(new THREE.HemisphereLight(0xffffff,0x5968ff,2));const l=new THREE.PointLight(0xff8a7f,2.8,15);l.position.set(3,3,5);scene.add(l);
    const resize=()=>{const r=host.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/Math.max(1,r.height);camera.updateProjectionMatrix()};resize();addEventListener('resize',resize,{passive:true});let t=0;(function loop(){t+=.004;globe.rotation.y=t;wire.rotation.y=-t*.7;renderer.render(scene,camera);requestAnimationFrame(loop)})();
    if(window.gsap&&window.ScrollTrigger)gsap.to(globe.rotation,{y:Math.PI*2.8,ease:'none',scrollTrigger:{trigger:'#ads-world',start:'top bottom',end:'bottom top',scrub:1}})
  }

  function initMotion(){
    if(reduced||!window.gsap||!window.ScrollTrigger)return;gsap.registerPlugin(ScrollTrigger);
    gsap.set('.hero-copy>*',{opacity:0,y:28});gsap.timeline({defaults:{ease:'power3.out'}}).to('.hero-copy .eyebrow',{opacity:1,y:0,duration:.65},.05).to('.hero-copy h1',{opacity:1,y:0,duration:1},.14).to('.hero-lede',{opacity:1,y:0,duration:.75},.34).to('.hero-actions',{opacity:1,y:0,duration:.7},.48).to('.hero-note',{opacity:1,y:0,duration:.6},.62);
    gsap.to('.scroll-progress span',{width:'100%',ease:'none',scrollTrigger:{start:'top top',end:'max',scrub:.15}});gsap.to('.hero-grid',{backgroundPosition:'0 160px',ease:'none',scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom top',scrub:1}});gsap.fromTo('.note-line',{scaleX:0},{scaleX:1,duration:1,delay:.7});
    qsa('.section-pad h2,.difference h2,.ads-world h2').forEach(el=>gsap.from(el,{y:55,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 84%',once:true}}));qsa('.eyebrow').slice(1).forEach(el=>gsap.from(el,{x:-24,opacity:0,duration:.65,scrollTrigger:{trigger:el,start:'top 90%',once:true}}));
    gsap.from('.compare-stage',{y:70,scale:.97,opacity:0,duration:1.1,ease:'power3.out',scrollTrigger:{trigger:'.compare-stage',start:'top 84%',once:true}});
    qsa('.graph-line').forEach(path=>{const len=path.getTotalLength();path.style.strokeDasharray=len;path.style.strokeDashoffset=len;gsap.to(path,{strokeDashoffset:0,ease:'none',scrollTrigger:{trigger:path,start:'top 88%',end:'top 55%',scrub:1}})});
    gsap.from('.signal-card',{y:35,opacity:0,stagger:.1,duration:.75,scrollTrigger:{trigger:'.signal-grid',start:'top 86%',once:true}});gsap.fromTo('.difference-line',{scaleX:0},{scaleX:1,ease:'none',scrollTrigger:{trigger:'.difference-board',start:'top 78%',end:'bottom 55%',scrub:1}});
    gsap.from('.difference-row',{x:50,opacity:0,stagger:.15,duration:.8,scrollTrigger:{trigger:'.difference-board',start:'top 82%',once:true}});gsap.fromTo('.journey-line',{scaleY:0},{scaleY:1,ease:'none',scrollTrigger:{trigger:'.journey',start:'top 78%',end:'bottom 65%',scrub:1}});qsa('.journey article').forEach(el=>gsap.from(el,{x:28,opacity:0,duration:.6,scrollTrigger:{trigger:el,start:'top 88%',once:true}}));
    qsa('.ads-route').forEach(line=>gsap.fromTo(line,{scaleX:0},{scaleX:1,ease:'none',scrollTrigger:{trigger:line,start:'top 90%',end:'top 70%',scrub:1}}));qsa('.ads-step').forEach((el,i)=>gsap.from(el,{x:i%2?35:55,opacity:0,duration:.7,scrollTrigger:{trigger:el,start:'top 88%',once:true}}));qsa('.funnel-bar').forEach((el,i)=>gsap.from(el,{scaleX:0,duration:.85,delay:i*.04,ease:'power3.out',scrollTrigger:{trigger:'.funnel',start:'top 82%',once:true}}));
    qsa('.work-card').forEach((card,i)=>{gsap.from(card,{y:70,opacity:0,rotateZ:i===1?2:-2,duration:1,scrollTrigger:{trigger:card,start:'top 84%',once:true}});gsap.to(card,{y:-18,ease:'none',scrollTrigger:{trigger:card,start:'top bottom',end:'bottom top',scrub:1}})});gsap.from('.black-card',{y:80,rotateY:-38,rotateZ:14,opacity:0,duration:1.1,scrollTrigger:{trigger:'#contact',start:'top 78%',once:true}});
  }

  function initMagnetic(){if(reduced)return;qsa('.cta,.nav-cta').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;el.style.transform=`translate(${x*.08}px,${y*.1}px)`});el.addEventListener('pointerleave',()=>el.style.transform='')})}

  setupCompare();initHero3D();initGlobe3D();initMotion();initMagnetic();
})();
