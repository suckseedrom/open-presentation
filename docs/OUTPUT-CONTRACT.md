# Output contract

This skill is intended to produce implementation-ready code in the current app workspace, with the presentation itself delivered as a single HTML file with inline CSS and JavaScript.

## Default deliverable

- a single HTML file with inline CSS and JS
- no npm packages, build tools, or framework runtime for the presentation itself
- accessible markup, keyboard controls, and clear focus states
- fixed 16:9 artboard logic with a 9:16 mobile-safe version
- well-commented code that is easy to customize

The resulting deck should feel like a premium video ad: more scenes when the content is rich, one focus per scene, UI/simulation first, and a compact music-player-like transport bar instead of a chunky presentation footer.

When the source has an important product flow, the deck should show that flow over 2–3 consecutive scenes instead of compressing it into one text block.

Use split copy-left / product-right scenes, modern product mockups, counters, timelines, chips, and state-change reveals whenever they make the story easier to understand.

The motion should feel like `emil-design-eng`: crisp, tactile, subtle, and detail-driven.

## Integration rule

When the host project already exists, keep the integration glue thin. Do not add a framework or build step just to satisfy the presentation. The ad logic itself should remain self-contained.

## Ad-first pacing

- more, shorter scenes when the brief has multiple strong claims
- one visible UI state or product moment per scene
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
