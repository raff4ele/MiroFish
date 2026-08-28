# ENTRA PRIMA Scroll-Build Hero Design

## Goal
Replace only the current first hero of the ENTRA PRIMA portfolio with a scroll-scrub architectural construction sequence while preserving every section below it unchanged.

## Experience
The first frame is the same camera position and dusk environment as the approved final architectural hero, but the site is empty. As the visitor scrolls, the same structure is progressively built in place: terrain → foundation → columns/primary frame → walls and roof → glass/interior → lighting and final finished architecture. Only in the final part of the scroll does the large ENTRA PRIMA wordmark become visually dominant.

The camera must remain locked. The user must feel that the building is assembled in front of them rather than that the page is zooming through unrelated imagery. Scrolling upward reverses the sequence.

## Implementation approach
Use a short photorealistic construction video generated from an empty-site start frame and the approved final architectural image as the end frame. Transcode the result for fast deterministic seeking. Bind the video currentTime to normalized scroll progress inside a sticky hero section. The video is muted, inline, paused, and never auto-plays; scroll position controls its time directly.

The section height provides the scrub distance while a sticky viewport keeps the camera fixed. A lightweight overlay displays only the scroll cue at the beginning and reveals the ENTRA PRIMA treatment near completion. When reduced-motion is requested, show the finished architectural frame without scrub motion.

## Constraints
- Preserve the current ENTRA PRIMA strategy-v6 content below the hero exactly.
- Do not modify SITO / ADS / GLOBAL / AZIONE or any later storytelling section.
- Mobile-first: no horizontal overflow at 390 px.
- Desktop must remain correct at 1440 px.
- The scroll animation must be reversible.
- No autoplay narrative animation independent of scroll.
- No visible video player controls or play button.
- No audio.
- No camera move between construction stages.
- The final state must visually match the approved architectural reference.

## Sequence
1. 0–12%: empty prepared site / terrain.
2. 12–28%: foundations and base structure emerge.
3. 28–48%: columns and main structural frame assemble.
4. 48–68%: roof, stone planes and exterior volumes complete.
5. 68–84%: glass, interiors and finish materials appear.
6. 84–94%: warm architectural lighting turns on and the finished structure settles.
7. 94–100%: ENTRA PRIMA title treatment becomes fully visible; user exits into the unchanged portfolio below.

## Success criteria
- On initial load the hero displays an empty site, not the completed building.
- Scrolling advances the building construction and reverse scrolling reverses it.
- At ~50% the structure is visibly incomplete.
- At 100% the finished structure is visible with ENTRA PRIMA.
- The next section starts immediately after the hero scrub and remains unchanged.
- Zero JavaScript errors and zero horizontal overflow in mobile/desktop audits.
