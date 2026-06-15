# Output contract

This skill is intended to produce implementation-ready code in the current app workspace, with the presentation itself delivered as a single HTML file with inline CSS and JavaScript.

## Default deliverable

- a single HTML file with inline CSS and JS, OR an HTML file plus the local shared player library (`player.js` + `player.css`)
- no npm packages, build tools, CDN calls, or framework runtime for the presentation itself
- accessible markup, aria-labelled controls, and clear focus states
- fixed 16:9 artboard logic with a 9:16 mobile-safe version
- well-commented code that is easy to customize
- fade-based presence transitions and staggered text reveals for every scene
- a static full-viewport background layer for every scene, rendered outside the scaled stage
- a 9:16 mobile recheck for every scene with capped type, stacked layouts, and safe-zone padding

## Shared player library deliverable

When using the bundled `lib/player.js`:

- Include `player.css` in the `<head>` and `player.js` before the closing `</body>` (or load it as a module).
- Provide scenes as `{ id, durationMs, render(el), activate(el) }` objects.
- `render(el)` must create the scene DOM; `activate(el)` must start scene-bound motion so animations run when the scene becomes active, not on file load.
- The player exposes a minimal glass-pill transport with Exit, Previous, Play/Pause, Next, Restart, and Mute.
- The player intentionally does not include a scrubber, timeline, time display, or fullscreen toggle.
- Scene transitions use blur + opacity fades and subtle scale drift; internal motion is triggered by `activate()` and the `scene:activate` event.

## Scene copy budget

- one headline or short label
- optional one short support line
- some scenes may be visual-only
- if a beat needs more than two short lines, split it into another scene
- for normal-length content, aim for 20+ short scenes
- mix title-only, text+mockup, UI-only, and transition scenes

The resulting deck should feel like a premium video ad: more scenes when the content is rich, one focus per scene, UI/simulation first, and a compact music-player-like transport bar instead of a chunky presentation footer.

When the source has an important product flow, the deck should show that flow over 2–3 consecutive scenes instead of compressing it into one text block.

Use split copy-left / product-right scenes, modern product mockups, counters, timelines, chips, and state-change reveals whenever they make the story easier to understand.

The motion should feel like `emil-design-eng`: crisp, tactile, subtle, and detail-driven.

## Recheck gate

Before delivery, run one final repair pass and confirm:

- no text overlay, clipping, or cramped edge-to-edge stack remains
- no dominant layout repeats more than twice in a row
- no animation completes before the scene becomes visible
- animations are bound to scene activation, not just file load
- every text layer fades in and fades out instead of popping in
- every scene still has a visible motion event
- the deck reads like a premium video ad, not a slide presentation
- persistent source labels or chrome do not compete with the hero frame
- every scene has a full-viewport static background layer with no letterboxing
- the mobile 9:16 recheck shows no overflow, clipped text, or broken layouts

If any check fails, split the scene, reduce copy, or re-compose the layout before handing it off.

## Layout and motion variety

- alternate centered statement, split copy/product, full-bleed showcase, proof-grid/stat-wall, and CTA scenes
- do not repeat the same dominant layout more than twice in a row
- vary the dominant motion family from scene to scene
- treat fades, reveals, counters, state changes, and camera drift as different beats rather than a single repeated effect

## Integration rule

When the host project already exists, keep the integration glue thin. Do not add a framework or build step just to satisfy the presentation. The ad logic itself should remain self-contained.

## Ad-first pacing

- more, shorter scenes when the brief has multiple strong claims
- one visible UI state or product moment per scene
- many scenes should be text-light or near-textless
- every scene should have some motion, even if it is subtle
- text, cards, and mockups should fade in and fade out rather than pop in
- no crowded footer chrome, no clipped edges, and no accidental overlaps
- fixed 16:9 and 9:16 production targets

When the brief has multiple major ideas, split them into more, shorter scenes instead of building one dense slide.

Each scene should be allowed to own one primary UI state or product moment.

Strong features should often get their own mini-sequence of scenes so the viewer can watch the interface evolve.

## For empty projects

Create the smallest working structure that can run:

- a standalone HTML file
- inline styles and scripts
- any tiny data or helper modules needed by the HTML file

If there is no app shell yet, create the standalone HTML presentation directly. Do not scaffold React/Vite unless the user explicitly asks for that stack.

Do not fall back to a docs-only or example-only result.

The transport section should be minimal and elegant, closer to Spotify or Apple Music than a generic presentation toolbar.

## If you only want an outline

Say so explicitly.

Otherwise, the skill should assume code generation mode.
