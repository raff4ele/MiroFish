# ENTRA PRIMA Editorial Portfolio — Design Spec

## Goal
Rebuild the ENTRA PRIMA presentation as an editorial creative-developer portfolio that feels authored, premium and physically believable rather than AI-generated. The page must demonstrate the service through real work, hierarchy, motion and depth instead of explaining it with repeated cards or decorative 3D.

## Visual language
- Primary palette: warm paper `#F4F1EA`, graphite `#111214`, white `#FFFFFF`, signature violet `#6C63FF`.
- Coral/acid accents may appear only as rare functional state highlights, never as a section-wide gradient system.
- Use asymmetric editorial composition, large negative space and mixed square/soft-radius geometry.
- Avoid repeated three-card grids, oversized drop shadows, generic glassmorphism, AI-luxury black/gold, decorative particles and meaningless floating shapes.
- Typography must feel editorial: serif display paired with neutral sans. Headlines do not all center-align.

## Hero
- Replace the giant smartphone-as-decoration with a browser/work-window object that represents the work itself.
- The hero object is a true WebGL scene: a browser window with physical depth, glass/screen layers and a real project preview texture.
- Scroll separates the browser into background/content/interaction layers, then moves the camera between those layers.
- Pointer/touch adds subtle spring-damped parallax; no perpetual showroom spin.
- Hero copy: concise and studio-like. Avoid buzzword clouds.

## Selected work
- Three real projects: Luigi Monza, GM Gioielli, Domenico Tesoro.
- Each project occupies roughly one viewport and uses a distinct composition instead of one repeated card template.
- Use real captured material from the existing live demos as video/still preview wherever possible.
- Metadata is minimal: project name, sector/location, contribution and a direct “View experience” link.
- Motion: project media shifts from flat editorial layout into depth/device crop as the section scrolls.

## Before / After
- Do not show a deliberately ugly fake website.
- “Before” is a credible flat digital presence: image, text, social/search/contact fragments.
- As scroll progresses, the same content reorganizes into hierarchy, depth, motion and action.
- Final “After” is the immersive composition itself, not a separate mockup card.
- Preserve an accessible slider/keyboard fallback where possible, but the primary narrative is scroll-driven transformation.

## What I do
- No four service cards and no icon-per-service demo.
- One continuous scene and one sentence: “I take what makes a physical brand worth visiting — and make people feel it before they arrive.”
- As the user scrolls, five words/states alter the same scene: EXPERIENCE, MOTION, 3D, CONVERSION, INTERNATIONAL.
- Each state changes camera, layering or material behavior instead of spawning a new generic object.

## ADS / International
- Remove “globe as proof of internationality” as the main communication device.
- Show a believable acquisition path: vertical ad creative → localized message → landing experience → action/booking.
- Use English/Italian state changes and a restrained market label treatment.
- Any graph is process visualization only; no invented uplift percentages.

## Motion rules
- Follow Emil Kowalski-style craft: motion must explain, provide spatial consistency or feedback.
- UI response under 300ms; custom strong ease-out curves; `transform`/`opacity` for DOM motion.
- Gesture-driven 3D uses damping/spring behavior and remains interruptible.
- Scroll-driven 3D uses scroll position as the playhead, not one-shot autoplay.
- `prefers-reduced-motion` keeps legibility while removing large camera travel.
- Hover-only effects must be gated to fine pointers.
- No global idle rotation on meaningful objects.

## 3D rules
- Form follows subject. The browser/project interface is the primary 3D object because ENTRA PRIMA is a digital-experience service.
- Use Three.js real-time rendering, physical materials, environment lighting, tone mapping and depth.
- Avoid torus knots, icosahedra, random cubes or spheres unless they have a direct semantic function.
- Budget mobile performance first: cap DPR, pause offscreen canvases, reuse materials/geometry and use instancing for repeated elements.

## Portfolio behavior
- No public contact/sales section; this page is sent directly inside lead conversations.
- Keep demo links real and clickable.
- No invented metrics, fake clients, fake testimonials or fabricated screenshots.
- No login.

## Acceptance criteria
- Hero, work, before/after, method and international sections have visibly different editorial layouts.
- At least one true WebGL scene remains, but it is conceptually tied to the work.
- Real demo project URLs are present.
- No `.service-label` repeated service-card system from the previous version.
- No `globe3d` as the centerpiece of the international section.
- No contact section or contact CTA.
- Zero horizontal overflow at 390px and 1440px.
- No uncaught JavaScript errors in Chromium desktop/mobile emulation.
- `prefers-reduced-motion` is handled.
