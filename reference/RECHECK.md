# Recheck Loop

This file defines the final repair pass that runs before a presentation is handed off.

The goal is simple: if the result still feels like a slide deck, has overlapping text, or repeats the same layout too often, it is not done yet.

## Recheck checklist

1. **One focal scene, one focal object.**
   - Each scene should have a single dominant visual idea.
   - If two cards, two text stacks, or two competing UI clusters fight for attention, split the scene.

2. **Keep text layers light and layered cleanly.**
   - Default to one headline and at most one short support line.
   - Text should fade in and fade out with the scene.
   - Avoid stacked paragraphs, dense labels, and text overlays that collide with UI surfaces.
   - Ensure the animation still reads when the scene becomes active; do not let it finish while hidden.

3. **Vary the layout on purpose.**
   - Mix centered statement scenes, split copy/product scenes, full-bleed showcases, proof-grid moments, transition beats, and CTA lockups.
   - Do not repeat the same dominant layout more than twice in a row.

4. **Require motion in every scene.**
   - Every scene needs a visible change: text reveal, state swap, counter tick, card entrance, camera drift, or a subtle fade-based presence transition.
   - Animations must trigger when the scene becomes active, not only when the file loads.
   - If the scene is still static or already-finished on entry, add motion or split it.

5. **Repair any overlap or clipping immediately.**
   - If text overlaps another text block, control overlay, or card edge, rewrite the scene as two beats.
   - If the frame feels cramped or slide-like, reduce copy and increase spacing.

6. **Remove persistent deck chrome from the scene body.**
   - Control bars, source stamps, and other persistent labels should not compete with the hero frame.
   - If they are required, keep them minimal, detached, and visually subordinate.

7. **Re-run until the deck reads like a video ad.**
    - The finished piece should feel cinematic, sequence-driven, and product-led.
    - If it still reads like a presentation template, the loop has not finished.

8. **Static full-viewport background layer.**
    - Every scene must have a background layer that fills the viewport.
    - The background must sit outside the scaled stage and must not letterbox.
    - No transform or self-animation should run on the background layer.

9. **Mobile 9:16 recheck.**
    - After composing at 16:9, recheck every scene at 9:16.
    - Stack split layouts, cap type sizes, and add 40px safe-zone padding.
    - Remove any overflow, clipped text, or broken layouts at 390x844 and 576x1024.

## Repair order

When a deck fails this check, repair in this order:

1. split crowded scenes
2. remove duplicate layout repetition
3. trim copy to one headline plus one support line
4. ensure motion triggers on scene activation
5. remove persistent chrome that competes with the scene
6. add or clarify scene motion
7. add a static full-viewport background layer to any scene that lacks one
8. repair any background that animates on its own or fails to fill the viewport
9. fix mobile 9:16 overflow by stacking layouts, capping type, and adding safe-zone padding
10. re-run the check

## Pass condition

The deck passes only when:

- no text overlay or clipping remains
- no dominant layout repeats more than twice in a row
- every scene has a visible motion event
- the result still feels like a premium video ad, not a slide deck
