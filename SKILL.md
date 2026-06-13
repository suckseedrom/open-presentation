---
name: presentation-feature-video-ads
description: "Generate premium video-ad presentations in the PresentationFeature house style using the bundled reference pack and optional MCP-style reference source."
---

# presentation-feature-video-ads

## Purpose

Turn product briefs, page content, screenshots, folders, notes, or an empty project into a cinematic presentation that feels like `PresentationFeature` — same premium ad-like pacing, same player framing, same polished product simulations, same deliberate motion language, same closing CTA energy.

The skill is public and portable. It is designed to work from the bundled reference pack alone, so it can be used on any project without upstream context.

## Reference resolution order

Use the bundled style sources in this order:

1. `reference/STYLE_GUIDE.md`
2. `reference/scene-grammar.json`
3. `reference/examples/about-us-brief.md`
4. `reference/examples/pricing-brief.md`
5. optional MCP reference adapter if the client supports it

The bundled reference pack is the authority. The MCP adapter should expose the same files, not replace them.

## Non-negotiable contract

Preserve the PresentationFeature system. Change the storyline and content only.

That means:

- same fullscreen player idea
- same centered cinematic artboard
- same desktop-first stage with mobile fallback
- same bottom transport bar
- same autoplay-first presentation behavior
- same scene-to-scene blur/opacity choreography
- same subtle scale drift and controlled motion rhythm
- same polished simulation-card storytelling
- same premium CTA close

## Scene grammar

Use the same narrative arc as the reference:

1. hook intro
2. concept reframing
3. philosophy / criteria / worldview
4. vision or positioning
5. feature chapters, sized to the source content
6. audience / proof / comparison slides when supported
7. final CTA

Default rule: **do not force a fixed slide count**. Choose the smallest deck that fully expresses the source content while still feeling structurally close to PresentationFeature.

## Layout language

Preserve these layout behaviors:

- hero-centered headline scenes
- split copy-left / product-right scenes
- premium white cards with soft borders and soft shadows
- stacked persona or role cards when the content calls for it
- stat-card grids for proof or comparison scenes
- final centered CTA lockup

Do not replace this with:

- long scrolling landing pages
- dashboards
- generic bento grids
- raw screenshots dropped without integration
- long paragraph sections

## Motion language

Keep motion calm, premium, and deliberate:

- scene swaps via `AnimatePresence`
- blur + opacity transitions
- subtle scale drift inside each scene
- staggered word reveals for major headlines
- spring-based entrances for cards and modules
- gentle hover amplification
- controlled internal animation inside the simulations

No chaotic choreography. No noisy meme motion. No flashy template-engine energy.

## Tone and visual mood

The output should feel:

- premium but approachable
- strategic and high-trust
- elegant enterprise optimism
- clean, modern, and product-marketing oriented

It should read like a product promo made by a strong motion/UI team.

## Surface styling

Preserve the same kind of surface language:

- warm off-white base scenes
- deep green / dark scenes for emphasis
- premium rounded cards
- soft shadows and clean borders
- restrained glow and blur accents
- crisp typographic hierarchy
- chapter colors that stay in the emerald / violet / amber / cyan / rose family

## Copy shape

Use:

- short punchy statements
- strategic verbs
- high-signal captions
- compact labels
- brief proof lines

Avoid:

- fluffy manifesto language
- generic startup filler
- long explanatory paragraphs
- template copy that could belong to any product

## What may change

The following are allowed to change if they map back into the same PresentationFeature scene grammar:

- product name
- audience
- category
- feature/module labels
- proof points
- metrics
- screenshots/mockups
- CTA text
- bilingual vs single-language copy

## Feature module rule

Do not just describe features. Show them as polished product simulations.

For each major feature or chapter:

- make it look like a believable product surface
- use cards, metrics, tags, progress states, or recommendation states when useful
- keep the screen internally consistent
- let the content breathe, but keep it compact

## Required output shape

Every result must include:

1. a PresentationFeature-style storyline
2. a scene-by-scene structure that fits the shared player model
3. explicit preservation of the house-style contract
4. a premium CTA ending

## Fidelity check

Before finalizing, verify:

- Does it still feel like a frontend-native video ad, not a webpage?
- Does it preserve the PresentationFeature player shell idea?
- Are the scenes arranged in the same narrative family?
- Are the feature moments shown as polished simulations rather than plain copy?
- Is the motion calm and deliberate?
- Does the closing feel like the same premium CTA family?

If any answer is no, revise toward the reference.
