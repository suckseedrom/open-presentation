# Soft Editorial — Design System

## Visual thesis

The same video-presentation architecture as the default template, but softened into a paper-editorial palette with warmer whitespace and gentler contrast.

Keep the scenes text-light and emotionally spare; some beats can be nearly textless.

## Emphasis

- editorial serif display moments
- soft paper backgrounds and sage/blush accents
- refined, low-noise product cards
- motion stays subtle and elegant, never sleepy
- copy should stay brief enough that the eye can move before it reads too much

## Background and mobile rules

- Every scene must have a static, full-viewport background layer rendered outside the scaled stage.
- Backgrounds must not be animated (no drifting gradients, no scale transforms).
- After composing at 16:9, recheck every scene at 9:16.
- On mobile: stack horizontal layouts, cap headlines at 3rem, keep 40px safe-zone padding, and remove any overflow.
