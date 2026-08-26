(() => {
  document.documentElement.classList.add('js');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const qs = (s, root=document) => root.querySelector(s);
  const qsa = (s, root=document) => [...root.querySelectorAll(s)];

  function setupCompare(){
    const stage = qs('[data-compare]');
    if(!stage) return;
    const after = qs('.compare-after', stage);
    const divider = qs('.compare-divider', stage);
    let value = 50;
    const setValue = (v) => {
      value = Math.max(7, Math.min(93, v));
      after.style.clipPath = `inset(0 0 0 ${value}%)`;
      divider.style.left = `${value}%`;
      stage.style.setProperty('--compare', `${value}%`);
    };
    const fromPointer = (clientX) => {
      const rect = stage.getBoundingClientRect();
      setValue(((clientX - rect.left) / rect.width) * 100);
    };
    let dragging = false;
    stage.addEventListener('pointerdown', e => { dragging = true; stage.setPointerCapture?.(e.pointerId); fromPointer(e.clientX); });
    stage.addEventListener('pointermove', e => { if(dragging) fromPointer(e.clientX); });
    stage.addEventListener('pointerup', e => { dragging = false; stage.releasePointerCapture?.(e.pointerId); });
    stage.addEventListener('pointercancel', () => dragging = false);
    stage.setAttribute('role','slider');
    stage.setAttribute('tabindex','0');
    stage.setAttribute('aria-label','Confronto prima e dopo');
    stage.setAttribute('aria-valuemin','7');
    stage.setAttribute('aria-valuemax','93');
    stage.setAttribute('aria-valuenow','50');
    stage.addEventListener('keydown', e => {
      if(e.key==='ArrowLeft'){ setValue(value-3); e.preventDefault(); }
      if(e.key==='ArrowRight'){ setValue(value+3); e.preventDefault(); }
      stage.setAttribute('aria-valuenow', String(Math.round(value)));
    });
  }

  function makeLogoTexture(){
    const c=document.createElement('canvas'); c.width=512; c.height=512;
    const x=c.getContext('2d');
    x.clearRect(0,0,512,512);
    const g=x.createRadialGradient(256,256,20,256,256,230);
    g.addColorStop(0,'rgba(226,188,117,.14)'); g.addColorStop(1,'rgba(0,0,0,0)');
    x.fillStyle=g; x.fillRect(0,0,512,512);
    x.strokeStyle='#e2bc75'; x.lineWidth=5; x.shadowColor='rgba(226,188,117,.75)'; x.shadowBlur=26;
    x.font='150px Georgia'; x.textAlign='center'; x.textBaseline='middle'; x.strokeText('EP',256,250);
    x.shadowBlur=0; x.fillStyle='#e5c98f'; x.globalAlpha=.9; x.fillText('EP',256,250);
    return new THREE.CanvasTexture(c);
  }

  function initThree(){
    if(reduced || !window.THREE) return;
    const host = qs('.portal-wrap');
    if(!host) return;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'}); }
    catch(err){ return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.setClearColor(0x000000,0);
    renderer.outputEncoding = THREE.sRGBEncoding;
    host.appendChild(renderer.domElement);
    host.classList.add('is-webgl');

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38,1,.1,100);
    camera.position.set(0,.2,10);
    const root = new THREE.Group(); scene.add(root);

    const gold = new THREE.Color(0xd6a85d);
    const dark = new THREE.Color(0x151410);
    const ringMat = new THREE.MeshStandardMaterial({color:dark,metalness:.82,roughness:.2,emissive:new THREE.Color(0x4a2b0b),emissiveIntensity:.25});
    [3.9,3.25,2.62,2.08].forEach((r,i)=>{
      const torus = new THREE.Mesh(new THREE.TorusGeometry(r,.035 + i*.004,18,180), ringMat.clone());
      torus.material.emissiveIntensity=.25 + i*.07;
      torus.rotation.x=.08;
      torus.position.z=-i*.22;
      root.add(torus);
    });

    const glowMat = new THREE.MeshBasicMaterial({color:gold,transparent:true,opacity:.8});
    const inner = new THREE.Mesh(new THREE.TorusGeometry(1.55,.018,12,160),glowMat); inner.position.z=.18; root.add(inner);

    const logo = new THREE.Mesh(new THREE.PlaneGeometry(2.05,2.05),new THREE.MeshBasicMaterial({map:makeLogoTexture(),transparent:true,depthWrite:false}));
    logo.position.z=.35; root.add(logo);

    const stairMat = new THREE.MeshStandardMaterial({color:0x191915,metalness:.7,roughness:.32});
    for(let i=0;i<9;i++){
      const step = new THREE.Mesh(new THREE.BoxGeometry(2.7+i*.18,.09,.48),stairMat);
      step.position.set(0,-3.15-i*.16,1.1+i*.52);
      step.rotation.x=.03;
      root.add(step);
    }

    const geo = new THREE.BufferGeometry();
    const count = window.innerWidth < 760 ? 90 : 180;
    const pos = new Float32Array(count*3);
    for(let i=0;i<count;i++){
      const a=Math.random()*Math.PI*2, rad=4.2+Math.random()*2.4;
      pos[i*3]=Math.cos(a)*rad; pos[i*3+1]=Math.sin(a)*rad*.75; pos[i*3+2]=(Math.random()-.5)*4;
    }
    geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
    const particles = new THREE.Points(geo,new THREE.PointsMaterial({color:gold,size:.025,transparent:true,opacity:.38}));
    root.add(particles);

    scene.add(new THREE.AmbientLight(0xb8894d,.7));
    const key = new THREE.PointLight(0xe8bb72,2.6,18); key.position.set(2,2,5); scene.add(key);
    const rim = new THREE.PointLight(0x7d4d18,1.8,18); rim.position.set(-3,-2,2); scene.add(rim);

    let mx=0,my=0, tx=0,ty=0;
    window.addEventListener('pointermove',e=>{
      mx=(e.clientX/window.innerWidth-.5); my=(e.clientY/window.innerHeight-.5);
    },{passive:true});

    const resize=()=>{
      const rect=host.getBoundingClientRect();
      renderer.setSize(Math.max(1,rect.width),Math.max(1,rect.height),false);
      camera.aspect=rect.width/Math.max(1,rect.height); camera.updateProjectionMatrix();
    };
    resize(); window.addEventListener('resize',resize,{passive:true});
    const clock=new THREE.Clock();
    const loop=()=>{
      const t=clock.getElapsedTime();
      tx += (mx*.2-tx)*.035; ty += (-my*.14-ty)*.035;
      root.rotation.y=tx; root.rotation.x=.03+ty;
      logo.rotation.z=Math.sin(t*.38)*.025;
      particles.rotation.z=t*.012;
      inner.material.opacity=.68+Math.sin(t*1.4)*.12;
      renderer.render(scene,camera);
      requestAnimationFrame(loop);
    };
    loop();

    if(window.gsap && window.ScrollTrigger){
      gsap.to(root.rotation,{z:.12,y:.18,scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom top',scrub:1}});
      gsap.to(camera.position,{z:8.9,scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom top',scrub:1}});
    }
  }

  function initMotion(){
    if(reduced || !window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    gsap.set('.hero-copy > *',{opacity:0,y:26});
    gsap.timeline({defaults:{ease:'power3.out'}})
      .to('.hero-copy .eyebrow',{opacity:1,y:0,duration:.7},.1)
      .to('.hero-copy h1',{opacity:1,y:0,duration:1},.22)
      .to('.hero-lede',{opacity:1,y:0,duration:.8},.42)
      .to('.hero-actions',{opacity:1,y:0,duration:.7},.56)
      .to('.hero-note',{opacity:1,y:0,duration:.6},.7);

    gsap.to('.scroll-progress span',{width:'100%',ease:'none',scrollTrigger:{start:'top top',end:'max',scrub:.2}});
    gsap.fromTo('.hero-grid',{backgroundPosition:'0 0'},{backgroundPosition:'0 120px',ease:'none',scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom top',scrub:1}});
    gsap.to('.scroll-cue i',{scaleX:.2,opacity:.25,ease:'none',scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom 40%',scrub:1}});

    qsa('.section-pad h2').forEach(el=>gsap.from(el,{y:52,opacity:0,duration:1.05,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 84%',once:true}}));
    qsa('.eyebrow').slice(1).forEach(el=>gsap.from(el,{x:-22,opacity:0,duration:.7,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}}));
    qsa('.statement-copy,.section-heading>p,.concept-copy>p:not(.eyebrow),.intl-body>p,.contact-copy>p:not(.eyebrow)').forEach(el=>gsap.from(el,{y:24,opacity:0,duration:.8,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}}));

    gsap.from('.compare-stage',{y:70,scale:.98,opacity:0,duration:1.1,ease:'power3.out',scrollTrigger:{trigger:'.compare-stage',start:'top 85%',once:true}});
    qsa('.graph-line').forEach(path=>{
      const len=path.getTotalLength(); path.style.strokeDasharray=len; path.style.strokeDashoffset=len;
      gsap.to(path,{strokeDashoffset:0,duration:1.55,ease:'power2.out',scrollTrigger:{trigger:path,start:'top 90%',once:true}});
    });
    gsap.from('.signal-card',{y:34,opacity:0,stagger:.12,duration:.75,ease:'power2.out',scrollTrigger:{trigger:'.signal-grid',start:'top 87%',once:true}});

    gsap.fromTo('.journey-line',{scaleY:0},{scaleY:1,ease:'none',scrollTrigger:{trigger:'.journey',start:'top 75%',end:'bottom 70%',scrub:true}});
    qsa('.journey article').forEach((el,i)=>gsap.from(el,{x:24,opacity:0,duration:.6,delay:i*.03,scrollTrigger:{trigger:el,start:'top 88%',once:true}}));
    gsap.fromTo('.coordinate i',{scaleX:0},{scaleX:1,ease:'none',scrollTrigger:{trigger:'.coordinate',start:'top 92%',end:'top 72%',scrub:true}});
    gsap.from('.world-word',{xPercent:-12,opacity:0,duration:1.5,ease:'power2.out',scrollTrigger:{trigger:'.international',start:'top 75%',once:true}});

    qsa('.work-card').forEach((card,i)=>{
      gsap.from(card,{y:65,opacity:0,rotateY:i===1?4:-4,duration:1,ease:'power3.out',scrollTrigger:{trigger:card,start:'top 86%',once:true}});
      gsap.to(qs('.work-img',card),{yPercent:7,ease:'none',scrollTrigger:{trigger:card,start:'top bottom',end:'bottom top',scrub:1}});
    });
    gsap.from('.black-card',{y:80,rotateY:-38,rotateX:16,rotateZ:14,opacity:0,duration:1.2,ease:'power3.out',scrollTrigger:{trigger:'#contact',start:'top 75%',once:true}});
    gsap.fromTo('.contact-aura',{scale:.7,opacity:0},{scale:1,opacity:1,duration:1.5,ease:'power2.out',scrollTrigger:{trigger:'#contact',start:'top 80%',once:true}});
  }

  function initMagnetic(){
    if(reduced) return;
    qsa('.cta,.nav-cta').forEach(el=>{
      el.addEventListener('pointermove',e=>{
        const r=el.getBoundingClientRect(), x=e.clientX-r.left-r.width/2, y=e.clientY-r.top-r.height/2;
        el.style.transform=`translate(${x*.08}px,${y*.12}px)`;
      });
      el.addEventListener('pointerleave',()=>{ el.style.transform=''; });
    });
  }

  setupCompare();
  initThree();
  initMotion();
  initMagnetic();
})();
