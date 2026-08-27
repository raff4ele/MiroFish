# ENTRA PRIMA Immersive V3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild ENTRA PRIMA from zero as one continuous, mobile-first immersive portfolio that demonstrates websites, motion, real-time 3D, attention creatives, international ADS and conversion without showing other client sites.

**Architecture:** A static three-file front end (`index.html`, `styles.css`, `script.js`) with semantic full-height scenes and two Three.js canvases. Scroll state is calculated per scene from the section bounding box, so animation progress is frozen at zero before entry and never completes before the visitor reaches that section. DOM motion uses transforms/masks/CSS variables; WebGL uses PBR materials and pointer damping. Mobile receives separate camera distances, sticky heights and composition rules.

**Tech Stack:** HTML5, CSS custom properties, ES modules, Three.js 0.180, optional Lenis on desktop only, Playwright runtime verification.

**Spec:** Approved conversation concept: FROM ATTENTION TO ACTION — hero → immersive websites → motion → real-time 3D → attention/creative → worldwide ADS → conversion.

## Global Constraints

- No Luigi Monza, GM Gioielli, Domenico Tesoro or any other client-project gallery.
- No `<video>` tags, screen recordings, image-sequence fakery or iframe embeds.
- No globe cliché and no decorative service-card 3D icons.
- No contact section; this page is sent directly to prospects.
- No fabricated percentages, ROAS or conversion metrics.
- Scroll animation progress must be local to each scene and must remain at initial state while the scene is outside the viewport.
- Mobile max-width 720px is a distinct composition, not scaled desktop.
- Respect `prefers-reduced-motion`.

---

### Task 1: Structural Narrative

**Files:**
- Create: `entra-prima-immersive-v3/index.html`
- Test: `entra-prima-immersive-v3/tests/immersive-v3.test.mjs`

**Interfaces:**
- Produces scene IDs: `hero`, `websites`, `motion`, `three-d`, `attention`, `world`, `conversion`.
- Produces canvas IDs: `hero-webgl`, `object-webgl`.

- [ ] Keep the already-written failing contract test.
- [ ] Build semantic markup in the required order with no legacy project/video content.
- [ ] Include real DOM compositions for website-building, motion typography, creative hooks, international localization and conversion path.
- [ ] Run `node entra-prima-immersive-v3/tests/immersive-v3.test.mjs` and confirm it still fails only on missing style/motion contracts until Tasks 2–3 land.

### Task 2: Editorial Mobile-First Design System

**Files:**
- Create: `entra-prima-immersive-v3/styles.css`
- Test: `entra-prima-immersive-v3/tests/immersive-v3.test.mjs`

**Interfaces:**
- Consumes scene markup from Task 1.
- Produces sticky scene layout, editorial typography, high-contrast palette, masks, stage geometry and dedicated mobile rules.

- [ ] Build off-white/ink base with one electric signature accent and restrained secondary accent.
- [ ] Avoid repeated rounded cards; use asymmetry, rules, large type and negative space.
- [ ] Define `.scene-sticky` and per-scene stages with `touch-action: pan-y`.
- [ ] Add `@media (max-width: 720px)` with different sticky heights, font scales, stage placement and 3D canvas sizing.
- [ ] Add reduced-motion CSS fallback.

### Task 3: Local Scroll Engine + WebGL

**Files:**
- Create: `entra-prima-immersive-v3/script.js`
- Test: `entra-prima-immersive-v3/tests/immersive-v3.test.mjs`

**Interfaces:**
- Produces `sceneProgress(section, vh)` returning 0 while not visible and normalized progress while active.
- Drives CSS variables `--p`, `--phase` and WebGL scene state.

- [ ] Implement `sceneProgress()` with explicit viewport gating: `rect.bottom <= 0 || rect.top >= vh`.
- [ ] Run one `requestAnimationFrame(renderFrame)` loop; no global scroll timelines that pre-render future sections.
- [ ] Build hero PBR `EP` spatial mark that opens into UI layers and responds to pointer/touch damping.
- [ ] Build second PBR object scene for the real-time 3D section, with drag interaction and scroll-driven exploded/reassembled state.
- [ ] Drive website construction, motion masks, attention hook timing, localization panels and conversion trace from local section progress.
- [ ] Use Lenis only on fine-pointer desktop and disable it for touch/mobile/reduced-motion.
- [ ] Run structure test until green.

### Task 4: Runtime Verification and Deployment

**Files:**
- No source changes unless runtime defects are discovered.

**Interfaces:**
- Production target: `entra-prima-official.vercel.app` only after preview passes.

- [ ] Serve the branch locally and run Playwright at 1440×900 and 390×844.
- [ ] Verify 0 horizontal overflow, 2 WebGL contexts, no console errors, correct scene order and no legacy content.
- [ ] Probe each section before entry and confirm its CSS progress/state remains at initial values.
- [ ] Verify pointer/touch interaction and `prefers-reduced-motion` mode.
- [ ] Deploy isolated Vercel preview and repeat browser checks.
- [ ] Promote the exact tested build to the official project and repeat production checks.
