# Default template brief: About Us

Use `presentation-feature-video-ads` to turn the content on `/about` into an About Us Presentation using the default `presentation-feature-core` template.

## Input

- source page: `/about`
- goal: cinematic video-ad presentation
- template: `presentation-feature-core`
- constraints: preserve the player shell, premium motion, modern product mockups, short scene beats, and the shared scene grammar

## What success looks like

- it feels like the current base style at full strength
- it uses more, shorter scenes instead of dense slides
- it shows proof as UI/product surfaces rather than paragraphs
- the motion feels crisp, tactile, and clean

## Recheck gate for the generator

- Use a **static, full-viewport background** on every scene (a flat color or a static gradient on the background layer). No animated or drifting backgrounds.
- After composing at 16:9, **recheck every scene at 9:16** (portrait). Stack horizontal layouts, cap headlines at 3rem, keep 40px safe-zone padding, and collapse any multi-column grids to a single column. No text may overflow on mobile.
- See `examples/correct-output.html` for a canonical, mobile-safe reference.
