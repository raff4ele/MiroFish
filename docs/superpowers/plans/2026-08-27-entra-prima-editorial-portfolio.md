# ENTRA PRIMA Editorial Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current generic 3D presentation with an authored editorial portfolio that proves ENTRA PRIMA through real project previews, purposeful WebGL and restrained scroll motion.

**Architecture:** Keep the project framework-free and static. Rebuild `index.html`, `styles.css` and `script.js` around one WebGL browser-shell scene plus DOM/live-project layers, using the three existing public demo URLs as the source of truth instead of fabricated screenshots. Add a dependency-free Node structure test and verify the final deployment with Playwright on desktop/mobile.

**Tech Stack:** HTML5, CSS, Three.js 0.180 modules, GSAP 3.13 + ScrollTrigger, Lenis desktop-only, native IntersectionObserver, Node `assert` tests, Playwright external verification.

**Spec:** `docs/superpowers/specs/2026-08-27-entra-prima-editorial-portfolio.md`

## Global Constraints

- No public contact/sales section or contact CTA.
- Do not invent metrics, clients, testimonials or screenshots.
- Use warm paper `#F4F1EA`, graphite `#111214`, white and signature violet `#6C63FF` as the main system.
- No black/gold AI-luxury treatment, repeated three-card layouts, generic glassmorphism or decorative geometry.
- Real demo URLs must remain clickable.
- Scroll-driven movement must have a narrative purpose and honor `prefers-reduced-motion`.
- Target zero horizontal overflow at 390px and 1440px.

---

### Task 1: Add regression tests for the new portfolio language

**Files:**
- Create: `entra-prima-real3d/tests/editorial-portfolio.test.mjs`
- Modify later: `entra-prima-real3d/index.html`, `entra-prima-real3d/styles.css`, `entra-prima-real3d/script.js`

**Interfaces:**
- Consumes: static source files from `entra-prima-real3d/`.
- Produces: a Node test that fails on old service-card/globe/contact patterns and passes only when the new editorial structure exists.

- [ ] **Step 1: Write the failing test**

```js
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const js = fs.readFileSync(new URL('../script.js', import.meta.url), 'utf8');

assert.match(html, /id="selected-work"/);
assert.match(html, /id="transformation"/);
assert.match(html, /id="method"/);
assert.match(html, /id="international"/);
assert.match(html, /data-live-project="luigi"/);
assert.match(html, /data-live-project="jewel"/);
assert.match(html, /data-live-project="flower"/);
assert.doesNotMatch(html, /id="contact"|class="contact/);
assert.doesNotMatch(html, /id="globe3d"/);
assert.doesNotMatch(html, /service-label/);
assert.match(html, /luigi-monza-luxe-62xdg6p2u-agent25\.vercel\.app/);
assert.match(html, /gm-gioielli-higgsfield-5rhsqc1bh-agent25\.vercel\.app/);
assert.match(html, /domenico-tesoro-entra-prima-flnv8bclf-agent25\.vercel\.app/);
assert.match(css, /--paper:\s*#F4F1EA/i);
assert.match(css, /--violet:\s*#6C63FF/i);
assert.match(js, /prefers-reduced-motion/);
assert.match(js, /IntersectionObserver/);
assert.match(js, /ScrollTrigger/);
console.log('editorial portfolio structure: PASS');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node entra-prima-real3d/tests/editorial-portfolio.test.mjs`
Expected: FAIL on missing `selected-work` or `transformation`.

- [ ] **Step 3: Commit test**

Commit message: `test: define editorial portfolio acceptance structure`

---

### Task 2: Rebuild the document structure around real selected work

**Files:**
- Replace: `entra-prima-real3d/index.html`

**Interfaces:**
- Produces sections `#hero`, `#selected-work`, `#transformation`, `#method`, `#international`, `#portfolio-end` and three `.live-project` blocks.
- Each `.live-project` uses `data-live-project` and a real demo URL in `data-src`; `script.js` lazy-loads the iframe.

- [ ] **Step 1: Replace the hero with a concise studio composition**

Use this semantic structure:

```html
<section class="hero" id="hero">
  <div class="hero-copy">
    <p class="kicker">ENTRA PRIMA / DIGITAL EXPERIENCE STUDIO</p>
    <h1>Make them feel it<br><em>before they arrive.</em></h1>
    <p class="hero-note">I turn physical brands into digital experiences built with motion, depth, interaction and a clear path to action.</p>
  </div>
  <div class="work-window" data-browser-scene>
    <canvas id="browser3d" aria-hidden="true"></canvas>
    <div class="browser-live-layer"><iframe title="Luigi Monza live preview" data-hero-live data-src="https://luigi-monza-luxe-62xdg6p2u-agent25.vercel.app"></iframe></div>
    <div class="browser-meta"><span>LIVE PROJECT</span><span>MILANO / 01</span></div>
  </div>
</section>
```

- [ ] **Step 2: Add three distinct selected-work chapters**

Create three `article.project-chapter` elements with unique classes `project-tailor`, `project-jewel`, `project-flower`. Each contains a `.live-project` iframe using the three real demo URLs and minimal metadata: project, sector/location, contribution, `View experience ↗`.

- [ ] **Step 3: Add transformation, method and international narratives**

`#transformation`: one credible flat-presence composition that reorganizes into an immersive live-project crop during scroll.

`#method`: one continuous `.method-stage` with five state labels exactly `EXPERIENCE`, `MOTION`, `3D`, `CONVERSION`, `INTERNATIONAL`; no service cards.

`#international`: a vertical ad frame, localized copy frame, landing frame and action frame arranged as one acquisition path; no globe.

- [ ] **Step 4: Keep footer presentation-only**

Footer contains only ENTRA PRIMA identity and `Experience / Motion / 3D / International`, with no contact button or form.

- [ ] **Step 5: Run structure test**

Expected: failures may remain only for CSS/JS requirements.

- [ ] **Step 6: Commit**

Commit message: `feat: rebuild portfolio around real selected work`

---

### Task 3: Build the editorial layout and non-AI visual system

**Files:**
- Replace: `entra-prima-real3d/styles.css`
- Delete after integration: `entra-prima-real3d/overflow-fix.css`

**Interfaces:**
- Consumes the classes introduced in Task 2.
- Produces desktop/mobile editorial layouts without horizontal overflow.

- [ ] **Step 1: Define restrained tokens**

```css
:root {
  --paper:#F4F1EA;
  --ink:#111214;
  --white:#FFFFFF;
  --violet:#6C63FF;
  --muted:#77746E;
  --line:rgba(17,18,20,.14);
  --ease-out:cubic-bezier(.23,1,.32,1);
  --ease-in-out:cubic-bezier(.77,0,.175,1);
}
```

- [ ] **Step 2: Use asymmetric section compositions**

Hero uses a 5/7 grid. Tailor chapter: media right / metadata left. Jewel chapter: full-bleed dark media with small light metadata island. Flower chapter: media left with oversized editorial title crossing the gutter. Do not reuse one card rule for all three.

- [ ] **Step 3: Make live previews feel like editorial media, not embedded websites**

Iframe containers use `overflow:hidden`, `background:#111214`, `pointer-events:none` for previews and scale their internal viewport with `transform-origin: top left`; only the separate “View experience” link is interactive.

- [ ] **Step 4: Create spatial transformation without glassmorphism**

Use square/soft mixed geometry, 1px rules, masked crops and `perspective`. Avoid generic blur cards. Keep shadows subtle and limited to the browser hero object.

- [ ] **Step 5: Add mobile-specific composition**

At `max-width:700px`, collapse chapters into one column, preserve large media, cap WebGL height, avoid sideways transforms and keep type between 44–64px using `clamp()`.

- [ ] **Step 6: Add accessibility motion media rules**

```css
@media (prefers-reduced-motion: reduce) {
  *,*::before,*::after { scroll-behavior:auto!important; }
  .motion-layer,.project-media { transform:none!important; }
}
@media (hover:hover) and (pointer:fine) {
  .project-link:hover { transform:translateY(-2px); }
}
.project-link:active { transform:scale(.97); }
```

- [ ] **Step 7: Run structure test**

Expected: CSS assertions pass.

- [ ] **Step 8: Commit**

Commit message: `feat: add editorial visual system`

---

### Task 4: Replace decorative 3D with one purposeful browser scene and scroll orchestration

**Files:**
- Replace: `entra-prima-real3d/script.js`

**Interfaces:**
- Consumes `[data-browser-scene]`, live iframes, transformation layers, method states and international steps.
- Produces `initBrowserScene()`, `initLiveProjects()`, `initScrollNarrative()`, `initTransformation()`, `initMethodScene()`.

- [ ] **Step 1: Lazy-load real demo iframes**

```js
function initLiveProjects(){
  const frames=[...document.querySelectorAll('iframe[data-src]')];
  const io=new IntersectionObserver(entries=>{
    for(const entry of entries){
      const frame=entry.target;
      if(entry.isIntersecting && !frame.src) frame.src=frame.dataset.src;
    }
  },{rootMargin:'500px 0px'});
  frames.forEach(frame=>io.observe(frame));
}
```

- [ ] **Step 2: Build the WebGL browser shell**

Use Three.js `RoundedBoxGeometry` for a thin graphite physical frame, a white back plate and three transparent depth planes. Use `MeshPhysicalMaterial` with restrained `metalness`, `roughness`, `clearcoat`; do not add unrelated geometric hero objects.

- [ ] **Step 3: Make scroll the scene playhead**

`ScrollTrigger.create({trigger:'#hero', start:'top top', end:'bottom top', scrub:.7, onUpdate:self=>browserProgress=self.progress})`. In the render loop, damp frame rotation/camera Z toward targets derived from `browserProgress`; the depth planes spread from `0.04` to approximately `0.8` units over the scroll range.

- [ ] **Step 4: Add pointer/touch damping**

Pointer changes only ±0.08 radians; drag/touch is interruptible; when released the object damps back to the scroll-defined pose. No perpetual idle rotation.

- [ ] **Step 5: Orchestrate chapters and transformation**

Project chapters use sticky media and small `translate3d`/clip changes tied to progress. `#transformation` moves the same content layers from flat Z-order to perspective layout, then reveals the real after iframe crop.

- [ ] **Step 6: Drive method and international states**

`#method` has one pinned stage; five text states update a single composition by changing media crop, depth, pointer affordance and CTA highlight. `#international` advances `AD → LOCALISE → EXPERIENCE → ACTION` and draws a process line with scaleX; no globe animation.

- [ ] **Step 7: Performance and reduced-motion**

Cap DPR to `1.5` desktop and `1.15` mobile; pause WebGL rendering when hero is more than 250px outside viewport; use Lenis only on `min-width:901px` and when reduced motion is false.

- [ ] **Step 8: Run structure test**

Expected: PASS.

- [ ] **Step 9: Commit**

Commit message: `feat: orchestrate purposeful webgl and scroll narrative`

---

### Task 5: Deploy and verify the real portfolio

**Files:**
- No source changes unless verification exposes a defect.

**Interfaces:**
- Produces the public Vercel deployment and acceptance evidence.

- [ ] **Step 1: Deploy branch as preview**

Deploy the `entra-prima-real3d/` static directory under the editorial branch to a Vercel preview.

- [ ] **Step 2: Run browser acceptance checks at 1440×900 and 390×844**

Verify:
- page title and hero headline render;
- no `.contact` or `#contact` exists;
- `#browser3d` has an active WebGL context;
- three `[data-live-project]` chapters exist;
- `#globe3d` and `.service-label` do not exist;
- `document.documentElement.scrollWidth === document.documentElement.clientWidth`;
- no `pageerror` events;
- scroll reaches each selected-work chapter and international stage.

- [ ] **Step 3: Verify reduced motion**

Run Chromium with `reducedMotion:'reduce'`; confirm the page remains usable and no large camera scroll travel is required to read content.

- [ ] **Step 4: Promote to `entra-prima-official.vercel.app` only after preview passes**

- [ ] **Step 5: Re-run the same desktop/mobile checks on production**

Expected: all checks pass with zero horizontal overflow and zero uncaught JS errors.

- [ ] **Step 6: Commit any verification fix separately**

Use message pattern: `fix: <specific production defect>`.
