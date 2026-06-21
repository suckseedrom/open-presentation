# Default template brief: Pricing

Use `open-presentation` to turn pricing or package page content into a presentation using the default `presentation-feature-core` template.

## Input

- source page: pricing or package page
- goal: cinematic pricing story
- template: `presentation-feature-core`
- constraints: preserve the player shell, split scenes, UI-first comparison states, and minimal transport chrome

## What success looks like

- tiers and comparisons appear as clean product UI states
- the strongest comparison moments are allowed to span more than one scene
- the deck stays premium and fast-paced rather than spreadsheet-like

## Recheck gate for the generator

- Use a **static, full-viewport background** on every scene (a flat color or a static gradient on the background layer). No animated or drifting backgrounds.
- After composing at 16:9, **recheck every scene at 9:16** (portrait). Stack horizontal layouts, cap headlines at 3rem, keep 40px safe-zone padding, and collapse any multi-column grids (pricing tables, comparison rows) to a single column. No text may overflow on mobile.
- See `examples/correct-output.html` for a canonical, mobile-safe reference.
