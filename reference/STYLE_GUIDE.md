# PresentationFeature House Style Snapshot

This is the portable style reference for the public `presentation-feature-video-ads` package.

It is a self-contained house-style contract for the public pack. The style name `PresentationFeature` refers to the visual language family, not a required source path.

The presentation output itself should stay zero-dependency. The default deliverable is a single HTML composition with inline CSS and JavaScript. When the shared PresentationFeature player library is used, the same HTML may load a local `player.js` + `player.css` via `<script>` tags; this still counts as zero-dependency because no npm packages, frameworks, or external CDN calls are required.

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

## Background layer

This is the background layer policy. Every scene must include a static full-viewport background layer.

- Backgrounds fill the player viewport completely.
- They are rendered outside the scaled stage so they never letterbox.
- They use `background-size: cover` or equivalent to fill the frame.
- They have no transform or self-animation; only opacity transitions are allowed when the scene enters or exits.
- The background stays visually subordinate and does not compete with the foreground content.

## Mobile 9:16 recheck

This is the mobile 9:16 safety pass. After composing each scene at 16:9, immediately recheck it at 9:16.

- Stack split layouts vertically so copy sits above the product surface.
- Cap headline size at 3rem, subline at 1.25rem, and body at 1rem.
- Add 40px safe-zone padding on all sides so text never touches the viewport edge.
- Test at 390x844 and 576x1024 to confirm nothing overflows or clips.
- Remove any horizontal scroll, clipped text, or overlapping UI clusters at narrow widths.

## Scene grammar

The canonical arc is:

1. hook intro
2. concept reframing
3. philosophy / criteria / worldview
4. vision or positioning
5. feature chapters sized to the source content
6. audience / proof / comparison scenes when supported
7. final CTA

The deck size is not fixed. Derive an input-driven scene inventory from the supplied facts, narrative arc, proof, and product-state inventory. Use the smallest deck that fully expresses the source content while still feeling structurally close to PresentationFeature. The smallest deck is the one with the fewest words, not the fewest scenes.

Prefer more, shorter scenes when the brief has multiple strong claims. One scene should own one idea, one visible UI state, and one emotional beat.

If a scene needs two major claims, split it into two scenes.

Avoid making one scene do the work of a whole page.

Use a deliberate mix of centered statement scenes, split copy/product scenes, full-bleed product showcases, proof-grid/stat-wall moments, transition scenes, and CTA lockups. Do not let split layouts dominate the whole deck.

Each scene should still read as a single focal composition. If two text blocks, two cards, or two competing surfaces fight for attention, split the scene.

The visual balance should be UI-first, not text-first.

Record every scene before implementation with:

- one communication job
- one focal object
- one visible state
- one dominant motion family
- an explicit duration
- separate 16:9 composition notes and 9:16 composition notes

Keep cinematic micro-scenes and split any crowded beat. A major feature or product flow should usually take 2–4 scenes when its setup, interaction, state change, and proof cannot remain legible as one focused beat.

## Scene density and UI balance

Each major scene should feel like a focused product moment.

Use:

- one headline or short label
- one short supporting line only when it really helps
- one primary product surface or state change
- optional tiny proof labels or metric chips

Prefer product simulation over explanation. Keep scenes text-light. Some scenes can be visual-only. If the scene is mostly copy or needs more than two short lines, split it. Scene count follows the input and state inventory, not a fixed quota.

If a scene starts to feel crowded or visually overlap-prone, split it before polishing it.

## Feature chapter patterns

The strongest chapters in the source app behave like mini product demos.

Prefer chapter structures that look like:

- split layout: short copy block on the left, product surface on the right
- centered statement scenes for hooks, worldview beats, and premium emphasis
- full-bleed showcases for product moments that need visual immersion
- proof-grid and stat-wall scenes for evidence-heavy beats
- modern product mockup card for the hero proof moment
- 2–3 staged simulation beats for one feature family
- counters, timelines, chips, or state transitions inside the mockup

Use a contextual product mockup first: ground it in the supplied product, workflow, platform, content model, and native surface conventions. Avoid literal desktop-window imitation unless the product itself calls for it. Use abstract premium UI only when the product has no meaningful visual surface. If product context is missing and the choice would materially alter the story, ask a bounded, recommendation-first question rather than inventing a high-impact direction.

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

Avoid persistent source stamps, debug labels, or chrome elements that sit on top of every scene and compete with the hero frame.

The presentation should still feel like a sequence of ad beats, not a set of generic sections.

## Language authority

Language is input-led and audience-led. Follow the source language and intended audience; preserve brand terms, product names, capitalization, and domain vocabulary rather than casually translating or normalizing them.

Use deliberate bilingual accents only when the input, source, audience, or user explicitly justifies them. Keep the primary reading path clear, and never introduce bilingual copy as a visual flourish.

## Motion language

Use layered motion to make product state and narrative progress visible. The available layers are:

- typography: staggered word or line reveals, emphasis changes, and readable exits
- mockup / UI state: loading-to-data, selection, approval, progress, before/after, and state swaps
- spatial / camera: restrained push, pull, pan, depth, or parallax around the focal object
- masks: wipes, crops, apertures, and shape reveals that expose meaningful detail
- data / proof: counters, charts, timelines, metric changes, and evidence highlights
- transitions: presence-based scene swaps, match cuts, directional continuity, blur, opacity, and controlled scale drift
- micro-interactions: cursor, hover, press, toggle, chip, and focus feedback when they clarify action

Use motion to reveal interface states and transitions, not to decorate long text blocks.

The motion should feel calm, premium, and deliberate.

Every scene should contain purposeful motion, even if it is only a subtle state change or counter pulse. Choose one dominant motion family and supporting layers; do not animate every available layer at once.

Plan each scene in three lifecycle phases: entrance establishes the focal object, action communicates the state or proof, and exit hands attention to the next beat. Keep those phases within the explicit scene duration.

Motion must be scene-activation-bound. Start entrances and actions on scene activation, not file load. On scene deactivation, cancel timers and animation frames, stop media, and reset transient classes or inline state so replay is deterministic.

Text, cards, and mockups need readable entrances and exits. Fade-based presence transitions remain available, but fades are only one tool. Avoid fade-only repetition. Stagger text lines when useful, and combine presence with state, mask, spatial, or proof motion when that better communicates the beat.

Adjacent scenes must vary their dominant motion family, timing, direction, or spatial treatment. Do not repeat the same reveal cadence scene after scene.

Favor camera-like scene cuts and staged reveals over page-section transitions.

Respect `prefers-reduced-motion`. Remove nonessential travel, parallax, and camera drift; shorten or eliminate transitional durations; preserve the final visible state and reading order; and never make comprehension depend on animation.

## Motion sensibility

Use the motion sensibility of `emil-design-eng`: crisp, tactile, refined, and performance-aware.

Prefer short, responsive transitions, subtle depth changes, natural easing, and motion that clarifies state rather than decorating text.

Avoid over-animated flourishes, bouncy gimmicks, or motion that feels like a template.

## Transport chrome

Treat the bottom control area like a premium music player rather than a chunky video editor.

Preserve minimal player chrome: controls must remain subordinate to the cinematic frame and product story.

Keep it:

- compact
- low-profile
- icon-forward
- subtle in color
- easy to scan

Think Spotify / Apple Music minimalism: small controls, restrained labels, and very little visual noise. The shared player does not expose a scrubber, timeline, or time display.

## Shared player library

When generating a deck with the bundled `lib/player.js`:

- Load `player.css` before `player.js` in the HTML `<head>`.
- Create scenes as `{ id, durationMs, render(el), activate(el) }` objects, where `render` populates the scene DOM and `activate` triggers scene-bound motion.
- Instantiate `new PresentationPlayer(container, scenes, options)`. Autoplay starts by default.
- The library provides Exit, Previous, Play/Pause, Next, Restart, and Mute controls in a glass-pill transport bar.
- The library handles scene swaps with blur + opacity fades, subtle scale drift, and `scene:activate` / `scene:deactivate` events.
- Keep scene motion inside `activate()` so it runs when the scene becomes visible, not on file load.
- Do not add a scrubber, timeline, time display, or fullscreen toggle; the player intentionally mirrors the PresentationFeature transport.

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

## Recheck and repair

Before delivery, verify:

- no repeated dominant layout appears more than twice in a row
- no text overlay, clipping, or cramped edge-to-edge stack remains
- every layer has a readable entrance/action/exit lifecycle without fade-only repetition
- every scene has a single focal composition and one visible UI state
- adjacent scenes vary their dominant motion family or treatment
- reduced-motion mode preserves content, state, and navigation
- if the deck still feels slide-like, split the scene and re-run the check

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
