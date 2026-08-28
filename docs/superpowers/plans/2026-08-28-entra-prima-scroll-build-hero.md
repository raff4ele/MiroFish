# ENTRA PRIMA Scroll-Build Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace only the current hero with a reversible scroll-scrub construction sequence from empty site to finished ENTRA PRIMA architecture.

**Architecture:** Generate a locked-camera empty-site start frame and a short start→finish construction video ending on the approved architectural reference. Transcode it for scrub-friendly seeking, then bind a paused inline video’s `currentTime` to normalized progress inside a sticky hero. Keep the existing strategy-v6 body intact and test hero behavior at 390 px and 1440 px.

**Tech Stack:** HTML5 video, CSS sticky layout, vanilla JavaScript `requestAnimationFrame`, ffmpeg, Playwright.

**Spec:** `docs/superpowers/specs/2026-08-28-entra-prima-scroll-build-hero-design.md`

## Global Constraints
- Preserve all content below the hero exactly.
- Initial frame is empty terrain.
- Scroll forward builds; scroll backward reverses.
- No autoplay, controls, audio, or play icon.
- Locked camera.
- 390 px and 1440 px must have zero horizontal overflow.
- Reduced motion shows a static finished frame.

---

### Task 1: Produce construction media

**Files:**
- Create: `entra-prima-interactive-v4/assets/hero-build.mp4`
- Create: `entra-prima-interactive-v4/assets/hero-build-poster.jpg`

**Interfaces:**
- Consumes: approved final hero reference and generated empty-site start frame.
- Produces: `hero-build.mp4` suitable for deterministic seek and `hero-build-poster.jpg`.

- [ ] **Step 1: Generate the empty-site start frame**

Use the approved final reference with a locked-camera prompt that removes all building geometry and typography while preserving environment, framing, lighting and ground.

- [ ] **Step 2: Verify the start frame**

Check that there is no building, no ENTRA PRIMA text, and the camera/horizon match the final reference closely enough for a seamless transition.

- [ ] **Step 3: Generate the construction video**

Use the empty-site frame as `start_image`, approved architectural reference as `end_image`, 9:16, no audio, and a prompt enforcing fixed camera and progressive physical assembly.

- [ ] **Step 4: Transcode for scrubbing**

Run:
```bash
ffmpeg -i source.mp4 -an -vf "scale=900:-2:flags=lanczos" -c:v libx264 -profile:v high -level 4.1 -pix_fmt yuv420p -g 1 -keyint_min 1 -sc_threshold 0 -crf 21 -movflags +faststart hero-build.mp4
```
Expected: all-I-frame H.264 file, no audio.

- [ ] **Step 5: Extract poster**

Run:
```bash
ffmpeg -sseof -0.05 -i hero-build.mp4 -frames:v 1 -q:v 2 hero-build-poster.jpg
```
Expected: final completed architectural frame.

---

### Task 2: Write failing hero behavior test

**Files:**
- Create: `entra-prima-interactive-v4/tests/hero-scroll-build.test.mjs`

**Interfaces:**
- Consumes: site HTML/CSS/JS.
- Produces: regression guarantees for structure, video attributes, scroll progress and unchanged lower content.

- [ ] **Step 1: Write the failing test**

Test assertions:
```js
expect(html).toContain('data-build-hero');
expect(html).toContain('id="build-video"');
expect(html).toContain('muted');
expect(html).toContain('playsinline');
expect(html).not.toContain('controls');
expect(js).toContain('video.currentTime');
expect(js).toContain('requestAnimationFrame');
expect(html).toContain('id="engine"');
expect(html).toContain('id="perception"');
expect(html).toContain('id="measurement"');
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
node tests/hero-scroll-build.test.mjs
```
Expected: FAIL because the current hero is static rather than video-scrubbed.

---

### Task 3: Implement scrub hero

**Files:**
- Modify: `entra-prima-interactive-v4/index.html`
- Modify: `entra-prima-interactive-v4/styles.css`
- Modify: `entra-prima-interactive-v4/script.js`

**Interfaces:**
- Consumes: `assets/hero-build.mp4`, `assets/hero-build-poster.jpg`.
- Produces: sticky reversible scroll hero.

- [ ] **Step 1: Replace only the hero markup**

Use:
```html
<section class="build-hero" data-build-hero>
  <div class="build-hero__sticky">
    <video id="build-video" muted playsinline preload="auto" poster="./assets/hero-build-poster.jpg">
      <source src="./assets/hero-build.mp4" type="video/mp4">
    </video>
    <div class="build-hero__shade"></div>
    <div class="build-hero__final-wordmark" aria-hidden="true">ENTRA PRIMA</div>
    <a class="build-hero__scroll" href="#engine">SCROLL ↓</a>
  </div>
</section>
```
Keep the next `#engine` section and all later markup byte-for-byte unchanged.

- [ ] **Step 2: Add sticky hero styling**

Required behavior:
- hero scrub distance ~340svh mobile / 300svh desktop;
- sticky viewport `height: calc(100svh - var(--header))`;
- video covers the viewport;
- final wordmark opacity maps only to final ~12% of progress;
- scroll cue fades within first ~15%;
- reduced-motion collapses to one viewport and poster/final state.

- [ ] **Step 3: Add scroll-to-time controller**

Implementation contract:
```js
const progress = clamp(-rect.top / (section.offsetHeight - innerHeight), 0, 1);
const targetTime = progress * video.duration;
video.currentTime += (targetTime - video.currentTime) * 0.28;
```
Run inside one `requestAnimationFrame` loop while the hero intersects the viewport. Update CSS `--build-progress` for wordmark and overlay transitions.

- [ ] **Step 4: Run unit test**

Run:
```bash
node tests/hero-scroll-build.test.mjs
```
Expected: PASS.

---

### Task 4: Browser verification

**Files:**
- Test: runtime only.

**Interfaces:**
- Consumes: completed hero implementation.
- Produces: verified mobile and desktop behavior.

- [ ] **Step 1: Serve locally**

Run:
```bash
python3 -m http.server 4173
```

- [ ] **Step 2: Verify desktop 1440×900**

Using Playwright, assert:
- status 200;
- `scrollWidth === clientWidth`;
- video has duration > 0;
- at top, currentTime is near 0;
- halfway through hero, currentTime is between 35% and 65% of duration;
- at hero end, currentTime reaches > 90%;
- `#engine`, `#perception`, `#measurement`, `#finale` still exist;
- zero page errors.

- [ ] **Step 3: Verify mobile 390×844**

Repeat the same assertions at 390×844 and confirm no controls/play button appear.

- [ ] **Step 4: Verify reverse scrub**

Scroll to 80%, record `currentTime`, then scroll back to 25% and assert `currentTime` decreases.

---

### Task 5: Publish preview and verify public URL

**Files:**
- Create self-contained deployment bundle from current HTML/CSS/JS plus public media URLs.

**Interfaces:**
- Consumes: verified local build.
- Produces: public preview URL.

- [ ] **Step 1: Publish the preview**

Deploy the verified build without changing the implementation.

- [ ] **Step 2: Run the same 390 px / 1440 px Playwright audit on the public URL**

Expected: all checks from Task 4 pass.

- [ ] **Step 3: Report only verified behavior**

Provide the public link and state that the hero starts empty, scrubs construction forward/backward, finishes on ENTRA PRIMA, and all lower sections remain unchanged.
