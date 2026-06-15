# Presentation Feature Core — Design System

This is the default template and the anchor for the rest of the pack.

The presentation should be delivered as a zero-dependency HTML composition. Use inline CSS and JavaScript for the simplest case, or load the local shared player library (`lib/player.js` + `lib/player.css`) via `<script>` tags so the transport, stage scaling, and scene transitions stay consistent with the PresentationFeature house style. Support both 16:9 and 9:16 output targets without layout collisions.

For normal-length briefs, expect 20+ micro-scenes. Mix title-only, text+mockup, UI-only, and transition scenes instead of compressing the story into a few dense frames.

## Visual thesis

Modern, clean, aesthetic product storytelling with cinematic pacing. The deck should feel like a premium product ad with polished app surfaces, strong hierarchy, and deliberate motion.

Keep the scenes text-light: use one headline or short label, add at most one short support line when it helps, and let some beats be visual-only.

For normal-length briefs, aim for 20+ micro-scenes and let text fade in and out rather than sit statically on screen.

If a scene has overlapping text, clipped controls, or more than one competing focal cluster, split it before polishing it.

## Use this template when

- the user wants the current best version of the skill
- the brief is product-led, feature-led, or category-reframing
- you need the cleanest translation of the house style into code

## Recheck gate

Before you consider the template finished, run a repair pass and confirm:

- no dominant layout repeats more than twice in a row
- no animation completes before the scene becomes visible
- every text layer fades in and fades out instead of popping in
- no text overlay, clipping, or crowded stack remains
- every scene still feels like a single focal composition with one visible UI state
- persistent source labels or transport chrome stay visually subordinate
- if the result still feels slide-like, split the scene and increase the motion

## Shared player library

This template pairs with `lib/player.js` when you want the exact PresentationFeature transport:

- Load `player.css` before `player.js`.
- Build scenes as `{ id, durationMs, render(el), activate(el) }`.
- Keep all scene motion inside `activate(el)` so it runs on `scene:activate`, not on page load.
- The player handles play/pause, next/previous, restart, mute, and scene transitions; do not add a scrubber or time display.

## Core surfaces

- premium app/product mockups rather than literal desktop-window imitation
- split copy-left / product-right scenes
- metric cards, chips, counters, timelines, and recommendation states
- dark emphasis scenes balanced by warm paper or off-white chapters
- clear spacing between the headline block, the product surface, and the transport chrome
- no generic AI-template look; keep the surface distinctive and product-led

## Motion

- crisp, tactile, refined motion
- state-change reveals over ornamental choreography
- subtle depth and blur transitions
- stronger emphasis on staged UI evolution than on text animation
- camera-like cuts and ad beats over slide-like page transitions
- motion should be visible in every scene, even if it is subtle

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
- After composing at 16:9, recheck every scene at 9:16.
- On mobile: stack horizontal layouts, cap headlines at 3rem, keep 40px safe-zone padding, and remove any overflow.
