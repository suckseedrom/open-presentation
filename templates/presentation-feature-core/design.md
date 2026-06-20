# Presentation Feature Core — Design System

This is the adaptive default template and the anchor for the rest of the pack.

Deliver a zero-dependency HTML composition with inline CSS and JavaScript. Build only the stage, scene runtime, and minimal player-like transport needed for play/pause, previous/next, restart, and mute. Do not add a scrubber, time display, or dominant chrome. Support both 16:9 and 9:16 output targets without layout collisions.

Derive the micro-scene inventory from the supplied material. Give each scene one communication job, one focal object, one visible state, a motion plan, a duration, and both aspect-ratio intents. Mix title-only, text+mockup, UI-only, and transition scenes as the input warrants instead of targeting a universal count or compressing the story into dense frames.

## Visual thesis

Modern, clean product storytelling with cinematic pacing. The deck should feel like a premium product ad with contextual modern product UI/mockups, strong hierarchy, and deliberate motion. Derive product surfaces from the actual category, workflow, claims, and audience rather than defaulting to a generic dashboard.

Keep the scenes text-light: use one headline or short label, add at most one short support line when it helps, and let some beats be visual-only.

Follow the input-led language. Keep one language when the source is monolingual; use deliberate bilingual copy only when the input, user, or audience requires it, and keep translated pairs concise rather than duplicating every label.

If a scene has overlapping text, clipped controls, or more than one competing focal cluster, split it before polishing it.

## Use this template when

- the user wants the current best version of the skill
- the brief is product-led, feature-led, or category-reframing
- you need the cleanest translation of the house style into code

## Recheck gate

Before you consider the template finished, run a repair pass and confirm:

- no dominant layout repeats more than twice in a row
- no animation completes before the scene becomes visible
- each focal layer has a purposeful entrance, action, and exit tied to scene activation
- adjacent scenes vary their dominant motion family rather than repeating the same reveal
- no text overlay, clipping, or crowded stack remains
- every scene still feels like a single focal composition with one visible UI state
- persistent source labels or transport chrome stay visually subordinate
- if the result still feels slide-like, split the scene and increase the motion
- the per-scene dual-aspect repair ledger is closed with `16:9 PASS` and `9:16 PASS` for every row

## Minimal transport

Keep transport player-like, familiar, and subordinate:

- Build scenes as `{ id, durationMs, render(el), activate(el) }`.
- Keep all scene motion inside `activate(el)` so it starts on scene activation, not on page load while hidden.
- Provide only play/pause, previous/next, restart, and mute in compact inline controls.
- Keep controls out of the focal composition and omit scrubbers, time displays, decorative shells, and external runtime dependencies.

### Shared player library

When the package layout is available, the template may use the local `lib/player.css` and `lib/player.js` files with `PresentationPlayer` for compatible stage scaling, scene activation, and transport behavior. This remains zero-dependency and must keep the same minimal controls with no scrubber or time display.

## Core surfaces

- contextual app/product mockups rather than literal desktop-window imitation or generic dashboard filler
- split copy-left / product-right scenes
- metric cards, chips, counters, timelines, and recommendation states
- dark emphasis scenes balanced by warm paper or off-white chapters
- clear spacing between the headline block, the product surface, and the transport chrome
- no generic AI-template look; keep the surface distinctive and product-led

## Motion

- use layered motion: background, focal product state, supporting data, and type may move on coordinated but offset timing
- give the focal sequence a complete entrance → action → exit lifecycle
- vary dominant motion families across adjacent scenes: cut, mask/wipe, depth/scale, directional slide, state morph, counter/data change, or controlled dissolve
- state-change reveals over ornamental choreography
- subtle depth and blur transitions
- stronger emphasis on staged UI evolution than on text animation
- camera-like cuts and ad beats over slide-like page transitions
- motion should be visible in every scene, even if it is subtle
- honor `prefers-reduced-motion` with an equivalent readable state

## Scene pacing

- one focus per scene
- important features may span 2–3 scenes
- use hero → reveal → proof progression for major product chapters
- split the scene if it needs more than two short lines of copy
- some beats can be visual-only
- split the scene if more than three visible content clusters compete for attention
- all text and mockups should fade in and fade out with the scene

## Background and mobile rules

- Every scene must have a static, full-viewport background layer rendered outside the scaled stage.
- Backgrounds must not be animated (no drifting gradients, no scale transforms).
- Maintain a per-scene dual-aspect repair ledger. For every scene: render → inspect → repair → rerender at 16:9 and 9:16.
- Mark `16:9 PASS` and `9:16 PASS` only from the latest inspected renders; block delivery until every row is PASS in both columns.
- On mobile: stack horizontal layouts, cap headlines at 3rem, keep 40px safe-zone padding, and remove any overflow.
