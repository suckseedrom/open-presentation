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

- For normal-length content, default to 20+ short scenes.
- Use fewer scenes only when the source is genuinely tiny.
- Mix title-only, text+mockup, UI-only, and transition scenes.
- Avoid compressing a full story into one or two dense frames.

## Text Budget

- Default scene copy is one headline and at most one short support line.
- Some scenes should be visual-only or nearly textless.
- If a scene needs more than two short lines, split it into more scenes.
- Avoid paragraphs, stacked labels, and multi-card reading surfaces inside the same frame.

## Motion Density

- Every scene should contain at least one motion event.
- Motion can be text reveals, card entrances, counter ticks, state swaps, camera drift, or a small UI interaction.
- Static frames should be rare; ad scenes should feel alive even when the copy is minimal.
- Text, cards, and mockups should enter and exit with fade-based presence transitions.
- Use a different dominant motion family from scene to scene when possible.

## Recheck Loop

- Run a final repair pass before delivery.
- Verify scene animations trigger on activation, not just on file load.
- Reject scenes with overlapping text, clipped controls, or competing content clusters.
- Reject decks where the same dominant layout repeats more than twice in a row.
- Reject duplicate layouts that keep reappearing scene after scene.
- Reject persistent source stamps or control chrome that compete with the hero frame.
- Require fade-in and fade-out on text layers instead of hard pop-ins.
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
