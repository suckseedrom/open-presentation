# PresentationFeature House Style Snapshot

This is the portable style reference for the public `presentation-feature-video-ads` package.

It is a self-contained house-style contract for the public pack. The style name `PresentationFeature` refers to the visual language family, not a required source path.

The presentation output itself should stay zero-dependency: a single HTML composition with inline CSS and JavaScript unless the host project explicitly needs thin integration glue.

## Immutable contract

Preserve the PresentationFeature system. Change the storyline and content only.

The output should keep:

- the same fullscreen player idea
- the same centered cinematic artboard
- the same desktop-first stage with mobile fallback
- the same bottom transport / control bar, kept intentionally minimal and music-player-like
- autoplay-first presentation behavior
- scene timing based on explicit durations
- the same polished simulation-card storytelling
- the same premium CTA close
- the same fixed 16:9 primary canvas with a 9:16 mobile-safe variant
- a distinct, curated visual voice instead of a generic template look

## Scene grammar

The canonical arc is:

1. hook intro
2. concept reframing
3. philosophy / criteria / worldview
4. vision or positioning
5. feature chapters sized to the source content
6. audience / proof / comparison scenes when supported
7. final CTA

The deck size is not fixed. Use the smallest deck that fully expresses the source content while still feeling structurally close to PresentationFeature. The smallest deck is the one with the fewest words, not the fewest scenes. For normal-length briefs, that usually means 20+ micro-scenes.

Prefer more, shorter scenes when the brief has multiple strong claims. One scene should own one idea, one visible UI state, and one emotional beat.

If a scene needs two major claims, split it into two scenes.

Avoid making one scene do the work of a whole page.

The visual balance should be UI-first, not text-first.

## Scene density and UI balance

Each major scene should feel like a focused product moment.

Use:

- one headline or short label
- one short supporting line only when it really helps
- one primary product surface or state change
- optional tiny proof labels or metric chips

Prefer product simulation over explanation. Keep scenes text-light. Some scenes can be visual-only. If the scene is mostly copy or needs more than two short lines, split it. For normal content, default to 20+ short scenes.

If a scene starts to feel crowded or visually overlap-prone, split it before polishing it.

## Feature chapter patterns

The strongest chapters in the source app behave like mini product demos.

Prefer chapter structures that look like:

 - split layout: short copy block on the left, product surface on the right
 - modern product mockup card for the hero proof moment
 - 2–3 staged simulation beats for one feature family
 - counters, timelines, chips, or state transitions inside the mockup

Use a modern, clean, aesthetic product surface. Avoid literal desktop-window imitation unless the product itself calls for it.

Some beats should be almost textless and rely on motion, UI state, or timing instead of paragraphs.

Use a mix of scene types: title-only, text+mockup, UI-only, and transition scenes.

If a feature is important, let it take multiple scenes so the UI can evolve in front of the viewer.

Good chapter pacing often looks like:

1. label / setup
2. state change or loading-to-data reveal
3. proof / outcome / recommendation

That progression should feel like a product ad, not a lecture.

## Layout language

Preserve:

- hero-centered headlines
- split copy-left / product-right scenes
- premium white cards with subtle borders and soft shadows
- stacked persona cards and role-specific framing
- stat-card grids for proof scenes
- final centered CTA lockup

Avoid duplicate nav rails, oversized footer toolbars, and any frame that feels like a slide deck because too many panels are competing at once.

The presentation should still feel like a sequence of ad beats, not a set of generic sections.

## Motion language

Preserve the current motion vocabulary:

- scene swaps through presence-based transitions
- blur + opacity fades
- subtle whole-canvas scale drift
- staggered word reveal on major headlines
- spring-like entrances for cards and modules
- gentle hover amplification
- controlled internal animation inside simulations

Use motion to reveal interface states and transitions, not to decorate long text blocks.

The motion should feel calm, premium, and deliberate.

Every scene should contain at least one motion event, even if it is only a subtle state change or counter pulse.

Text, cards, and mockups should enter and exit with fade-based presence transitions. Stagger text lines so they feel choreographed rather than dumped onto the frame.

Favor camera-like scene cuts and staged reveals over page-section transitions.

## Motion sensibility

Use the motion sensibility of `emil-design-eng`: crisp, tactile, refined, and performance-aware.

Prefer short, responsive transitions, subtle depth changes, natural easing, and motion that clarifies state rather than decorating text.

Avoid over-animated flourishes, bouncy gimmicks, or motion that feels like a template.

## Transport chrome

Treat the bottom control area like a premium music player rather than a chunky video editor.

Keep it:

- compact
- low-profile
- icon-forward
- subtle in color
- easy to scan

Think Spotify / Apple Music minimalism: a thin progress indicator, small controls, restrained labels, and very little visual noise.

## Tone and mood

The output should feel:

- premium but approachable
- strategic and high-trust
- elegant enterprise optimism
- like a product promo, not a slide template

## Surface styling

Preserve:

- warm off-white base scenes
- deep green / dark scenes for emphasis
- premium rounded cards
- soft shadows and clean borders
- restrained glow and blur accents
- crisp typographic hierarchy
- chapter colors in the emerald / violet / amber / cyan / rose family

Each template should have a distinct visual voice. Avoid generic purple gradients on white, copy-paste dashboard cards, and any anti-AI-slop look that could belong to any product.

## Typography

The reference favors:

- giant, high-confidence headlines
- very tight tracking
- bold supporting copy
- short subcopy blocks
- compact labels and micro-eyebrows only where needed
- no long paragraph sections

## Copy shape

Use short, punchy statements.

Prefer:

- strategic verbs
- high-signal phrases
- compact proof lines

Prefer one headline and, at most, one short support line when copy is needed. Some scenes should be near-textless. Let the UI carry the rest.

Avoid:

- fluffy manifesto copy
- generic “revolutionize / unlock / empower” filler
- long explanatory paragraphs
- text-only slides with no meaningful UI state
- stacked label clusters that force reading
- chunky transport bars with too much chrome

## Feature module rule

Do not simply describe major features. Show them as believable product simulations.

Good simulation scenes use:

- cards
- metrics
- tags
- progress states
- recommendation states
- role-specific states
- profile panels
- timelines
- checklists
- approval / readiness states
- before/after diffs

Keep all simulation screens internally consistent with the same visual language.

## What may change

Allowed changes:

- product name
- audience
- category
- feature/module labels
- proof points and metrics
- screenshots/mockups
- CTA text
- bilingual vs single-language copy

Those changes must still fit the scene grammar above.

## Forbidden drift

Hard failures:

- normal landing page structure
- free-scroll web sections
- a new design system
- major motion-language changes
- major color-philosophy changes
- plain copy blocks instead of polished simulations
- a template-like deck that could belong to any product

## Output contract

Any generated presentation should still read as:

> "this is PresentationFeature’s cinematic system, but for a different story"

If it instead reads like a generic presentation template, it has drifted too far.
