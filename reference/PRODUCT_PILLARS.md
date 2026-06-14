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

## Text Budget

- Default scene copy is one headline and at most one short support line.
- Some scenes should be visual-only or nearly textless.
- If a scene needs more than two short lines, split it into more scenes.
- Avoid paragraphs, stacked labels, and multi-card reading surfaces inside the same frame.

## Motion Density

- Every scene should contain at least one motion event.
- Motion can be text reveals, card entrances, counter ticks, state swaps, camera drift, or a small UI interaction.
- Static frames should be rare; ad scenes should feel alive even when the copy is minimal.

## Production Quality

- Accessible semantics, keyboard support, and clear focus behavior.
- Fixed 16:9 output with a 9:16 mobile-safe version.
- Well-commented code that is easy to customize.
- No overlap, no cropped footer chrome, and no cramped edge-to-edge clutter.
