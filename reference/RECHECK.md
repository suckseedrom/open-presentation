# Per-scene Recheck Loop

This is a production-house quality loop, not a one-shot deck-only gate. Run it for every scene before deck-level review or delivery. The goal is simple: if a result still feels like a slide deck, overlaps, clips, enters in an already-finished state, or repeats the same layout too often, it is not done.

## Closed quality loop

For each scene and each target aspect, repeat **render -> inspect -> repair -> rerender**:

1. **Render** the scene at 16:9 and 9:16, including its full motion lifecycle and reduced-motion state. Save the outputs at stable artifact paths.
2. **Inspect** both outputs independently against every check below. Record findings in that scene's per-scene QA ledger row; never infer one aspect's result from the other.
3. **Repair** the smallest affected scene or scene-local rule. Preserve useful behavior and avoid broad deck changes when a local copy, spacing, layout, timing, or activation fix is sufficient.
4. **Rerender** every failed aspect, increment the row's iteration, retain the prior evidence and findings, and record the repair. Reinspect the complete checklist for that aspect; a partial spot-check does not turn it green.

A row is green only when it records both **16:9 PASS** and **9:16 PASS** with current render evidence. A failed aspect remains FAIL even if the other aspect passes.

## Per-scene QA ledger

Keep exactly one current row per scene, backed by an append-only iteration history. Each row must contain:

| Scene | Iteration | 16:9 status | 16:9 artifact path | 9:16 status | 9:16 artifact path | Repairs made | Verifier | Block/escalation |
| --- | ---: | --- | --- | --- | --- | --- | --- | --- |
| `scene-id` | `1` | `16:9 PASS` or `16:9 FAIL` | render/video and inspection evidence paths | `9:16 PASS` or `9:16 FAIL` | render/video and inspection evidence paths | exact scene-local changes, or `none` | person or agent + verification time | `none`, or linked block record |

Artifact paths must identify the scene, aspect, and iteration. Never overwrite failed evidence: retain its render, inspection result, and repair record when advancing the current row to the next iteration. The verifier must inspect the artifacts rather than relying on the renderer's exit status.

If the same aspect fails repeatedly, add an explicit block/escalation record containing the scene, aspect, failed iterations and retained artifact paths, recurring defect, repairs attempted, owner, and required decision. Keep the row red and block downstream review; do not waive or silently relabel the failure.

## Inspection checklist for each aspect

Inspect every scene at both 16:9 and 9:16. For mobile, include representative 390x844 and 576x1024 viewports.

1. **Safe zones and transport clearance**
   - Keep critical copy, logos, controls, and product focal points inside the aspect's safe zones.
   - At 9:16, add at least 40px safe-zone padding and account for top/bottom platform UI.
   - Keep the scene body clear of the transport/control area. Required transport chrome must remain minimal, detached, and visually subordinate.

2. **Overlap and clipping**
   - No text may overlap another text block, control overlay, card edge, or product UI.
   - No copy, surface, shadow, or focal content may be clipped or escape the viewport.
   - Stack split layouts and cap type sizes on narrow screens.

3. **Hierarchy and focal state**
   - Each scene has one dominant visual idea and one unambiguous focal object or focal state.
   - If two cards, text stacks, or UI clusters fight for attention, split the scene.
   - Default to one headline and at most one short support line; avoid dense labels and paragraphs.

4. **Motion lifecycle and scene activation**
   - Every scene shows a deliberate entrance, action/state change, and exit or handoff where appropriate.
   - Animation starts on scene activation, not only on file load, and does not finish while hidden.
   - Text and supporting layers enter and leave with the scene; no stale layer persists into the next beat.
   - Review the full duration for smoothness: no jumps, stalls, unintended easing changes, flicker, dropped-looking transitions, or abrupt resets.

5. **Reduced motion**
   - With `prefers-reduced-motion`, the scene remains legible, ordered, and complete without essential information depending on movement.
   - Reduced motion must avoid flashing or large unnecessary travel while preserving the intended focal state.

6. **Static full-viewport background**
   - Every scene has a background layer that fills the viewport without letterboxing.
   - The background sits outside the scaled stage and has no transform or self-animation.

7. **Premium-ad quality**
   - The scene reads as cinematic, sequence-driven, product-led, text-light, and motion-heavy—not as a presentation template.
   - Composition, spacing, typography, product rendering, pacing, and transitions hold up at the target aspect without placeholder-like or generic treatment.

## Deck-level continuity checks

Deck-level review happens only after every per-scene row is green for both aspects. Then verify that adjacent scenes form a coherent sequence, dominant layouts do not repeat more than twice in a row, pacing remains smooth, and the final CTA resolves cleanly. A deck-level observation that identifies a scene defect sends that scene back through its per-scene loop; it is not repaired only at deck level.

## Repair order

When an aspect fails, repair the smallest affected scene in this order:

1. split crowded scenes
2. remove duplicate layout repetition
3. trim copy to one headline plus one support line
4. restore hierarchy and one clear focal state
5. ensure motion triggers on scene activation and completes its lifecycle
6. remove persistent chrome that competes with the scene and restore transport clearance
7. add or clarify scene motion; tune timing/easing for smoothness
8. add a static full-viewport background layer to any scene that lacks one
9. repair any background that animates on its own or fails to fill the viewport
10. fix 9:16 overflow by stacking layouts, capping type, and adding safe-zone padding
11. verify the reduced-motion state
12. increment the iteration, retain failed evidence, rerender the failed aspect, and reinspect every check

## Pass and release gate

**Block delivery and deck-level review until every row is green/PASS for both aspects: 16:9 PASS and 9:16 PASS.** There is no one-shot deck-only approval and no aggregate score that can compensate for a failed scene or aspect.

The production passes only when every ledger row has current artifacts and a named verifier confirming:

- safe zones and transport clearance are intact
- no overlap, clipping, or broken responsive layout remains
- hierarchy and focal state are clear
- the full motion lifecycle activates with the scene and plays smoothly
- reduced motion is complete and legible
- the background is static and fills the full viewport
- the scene meets premium video-ad quality
- deck-level continuity checks pass after all scene rows are green
