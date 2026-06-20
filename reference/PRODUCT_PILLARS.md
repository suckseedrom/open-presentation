# Product Pillars

This file translates the public pack promise into generator behavior.

## Zero Dependencies

- Default output is a single HTML file with inline CSS and JavaScript.
- No npm install, build tools, or framework runtime should be required for the presentation itself.
- If the host project needs integration glue, keep it thin and avoid adding new runtime dependencies.

## Visual Style Discovery

- `reference/STYLE_INDEX.md` and `templates/index.json` are the shortlist surface.
- `templates/*/preview.md` are the generated visual previews: short, vivid style cards that should be easy to compare without reading every design doc.
- Read exactly one `design.md` after the user or the shortlist picks a style.

## Anti-AI-Slop

- Curated, distinct styles only.
- No generic purple gradients on white, copy-paste hero layouts, or template-y card stacks.
- Each template should have a clear visual voice, motion tempo, and surface language.

## Scene Archetypes

- title-only or one-word hook scenes
- centered statement scenes
- full-bleed product or UI showcase scenes
- split copy/product scenes when the story earns it
- proof grids, stat walls, and metric cards
- transition / atmospheric scenes
- CTA / outro scenes

## Layout Variance

- Alternate scene archetypes instead of repeating the same split layout.
- Do not repeat the same dominant layout more than twice in a row.
- Use centered, split, full-bleed, stacked, and grid-based frames across a deck.
- Layout should feel intentionally choreographed, not templated.

## Scene Count

- Build an input-derived micro-scene inventory from the brief, narrative arc, and product-state inventory; never start from a universal scene quota.
- A `20+` count is not a requirement; use that many scenes only when the inventory actually earns them.
- Give every planned scene a record with one communication job, one focal object, one visible state, one dominant motion family, an explicit duration, and separate 16:9 and 9:16 composition notes.
- Keep beats cinematic and focused. Split crowded beats rather than compressing a full story into one or two dense frames.
- Let a major feature or product flow span 2–4 scenes when setup, interaction, state change, and proof need distinct moments.
- Mix title-only, text+mockup, UI-only, and transition scenes according to the inventory.

## Product and Language Authority

- Prefer a contextual product mockup grounded in the supplied product, workflow, platform, and real surface conventions.
- Use abstract premium UI only when the product genuinely has no visual surface to show. If the choice remains unresolved and would materially change the result, ask a bounded, recommendation-first question.
- Make language input-led: follow the source language and intended audience, and preserve supplied brand terms, product names, and domain vocabulary.
- Use deliberate bilingual accents only when the brief, source, audience, or user direction justifies them; never add bilingual copy as decoration.

## Text Budget

- Default scene copy is one headline and at most one short support line.
- Some scenes should be visual-only or nearly textless.
- If a scene needs more than two short lines, split it into more scenes.
- Avoid paragraphs, stacked labels, and multi-card reading surfaces inside the same frame.

## Motion Density

- Every scene should contain layered motion with a clear entrance, action, and exit phase, even when the copy is minimal.
- Choreograph appropriate layers across typography, mockup or UI state, spatial or camera movement, masks, data or proof, transitions, and micro-interactions. Not every layer must move in every scene, but the scene must have a purposeful dominant motion family.
- Bind entrance and action motion to scene activation, and stop, reset, or clean up timers and animation state on scene deactivation.
- Adjacent scenes must vary their dominant motion family, timing, direction, or spatial treatment so the sequence does not become mechanically repetitive.
- Preserve presence transitions where useful, but avoid fade-only repetition. Reveals, counter ticks, loading-to-data changes, state swaps, masks, camera moves, and tactile micro-interactions should carry narrative meaning.
- Honor `prefers-reduced-motion`: remove nonessential travel and camera drift, reduce duration and parallax, and retain immediate readable state changes without hiding content.

## Recheck Loop

- Run a final repair pass before delivery.
- Verify scene animations trigger on activation, not just on file load.
- Verify deactivation stops or resets scene-local animation, timers, and transient UI state.
- Reject scenes with overlapping text, clipped controls, or competing content clusters.
- Reject decks where the same dominant layout repeats more than twice in a row.
- Reject duplicate layouts that keep reappearing scene after scene.
- Reject persistent source stamps or control chrome that compete with the hero frame.
- Reject fade-only repetition; require readable entrances and exits while varying the dominant motion family across adjacent scenes.
- If the deck still reads like a slide presentation, split more scenes and re-run the check.

## Background

- Static full-viewport background layer on every scene.
- Rendered outside the scaled stage so there is no letterboxing.
- No continuous animation, transform, or self-motion on the background.
- This is the background layer policy.

## Mobile Production

- Every scene rechecked at 9:16 after being composed at 16:9.
- Stack horizontal layouts vertically for narrow viewports.
- Cap headline at 3rem, subline at 1.25rem, body at 1rem.
- Apply 40px safe-zone padding so text never touches the edge.
- Remove any overflow, clipped text, or broken layouts at mobile sizes.
- This is the mobile 9:16 policy.

## Production Quality

- Accessible semantics, keyboard support, and clear focus behavior.
- Fixed 16:9 output with a 9:16 mobile-safe version.
- Well-commented code that is easy to customize.
- No overlap, no cropped footer chrome, and no cramped edge-to-edge clutter.
