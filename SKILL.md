---
name: presentation-feature-video-ads
description: "Generate premium, multi-scene, UI-first video-ad presentations from a progressive-disclosure skill pack with on-demand template loading and zero-dependency HTML delivery."
---

# presentation-feature-video-ads

Turn product briefs, pages, screenshots, notes, or an empty project into a cinematic presentation implementation that feels like `PresentationFeature`.

## Core rules

1. **Implementation-first** — default to real source files in the current app workspace.
2. **Progressive disclosure** — load only the files needed for the current phase.
3. **Zero dependencies** — default to a single HTML presentation with inline CSS and JS; do not introduce npm, build tools, or framework runtime unless the host project explicitly needs it.
4. **Visual style discovery** — use the generated preview cards to shortlist a vibe before opening full design docs.
5. **Anti-AI-slop** — favor curated, distinctive styles over generic template aesthetics.
6. **UI-first storytelling** — prefer product surfaces, state changes, counters, timelines, chips, and staged simulations over dense text.
7. **One focus per scene** — split rich content into more, shorter beats.
8. **Shared house style** — keep the player-first, premium, simulation-driven system while allowing template-level variation.

## File loading map

| File | Purpose | Load when |
| --- | --- | --- |
| `SKILL.md` | Workflow map and rules | Always |
| `reference/STYLE_INDEX.md` | Lightweight template chooser | Template selection |
| `reference/PRODUCT_PILLARS.md` | Product-level delivery rules | Generation |
| `templates/index.json` | Compact template metadata | Template selection |
| `templates/*/preview.md` | Generated visual preview cards | After shortlisting |
| `reference/STYLE_GUIDE.md` | Shared house-style authority | Generation |
| `reference/scene-grammar.json` | Shared scene/pacing contract | Generation |
| `templates/*/design.md` | Selected template design recipe | After user selection |
| `templates/presentation-feature-core/examples/*` | Base-template example briefs | When the selected template is the default and the use case matches |
| `examples/*.md` | User-facing starting prompts | Only when the user needs a starting prompt |

Do not bulk-read every template `design.md`.

## Workflow

### Phase 1 — detect the starting point

Classify the job:

- current app implementation
- empty-project scaffold
- page-to-presentation adaptation
- brief/notes-to-presentation adaptation

If there is no app shell, create the smallest standalone HTML presentation first with inline CSS and JS. Do not scaffold React/Vite unless the host project already requires it or the user explicitly asks for that stack.

### Phase 2 — choose a template

1. Read `reference/STYLE_INDEX.md`.
2. Read `reference/PRODUCT_PILLARS.md`.
3. Read `templates/index.json`.
4. Shortlist up to 3 templates from metadata and preview-vibe cues only.
5. Read only those templates' `preview.md` files.
6. If the user chooses one, read exactly that template's `design.md`.
7. If the user does not choose, default to `presentation-feature-core`.

### Phase 3 — generate

Read:

- `reference/PRODUCT_PILLARS.md`
- `reference/STYLE_GUIDE.md`
- `reference/scene-grammar.json`
- the selected template's `design.md`
- the selected template's example briefs only if they help the current use case

Then implement the presentation in the current app workspace as a zero-dependency HTML composition unless the host project already requires a thin wrapper.

## Implementation contract

The expected result usually includes:

- a single self-contained HTML presentation file with inline CSS and JS
- a tiny route/page wrapper only if the host project already needs one
- minimal styling glue for the presentation shell, if any
- any small supporting components or data modules needed by the host
- tests for controls and scene flow

Write into the current app workspace, not into `examples/`, `reference/`, or `templates/`.

Only edit the skill package itself when the user explicitly asks to improve or rewrite the skill.

## Shared quality bar

- more, shorter scenes when the content is rich
- one focus and one visible UI state per scene
- modern product mockups, not literal desktop chrome
- crisp, tactile, refined motion
- minimal music-player-like transport chrome
- fixed 16:9 and 9:16 production targets
- accessible, commented, customizable code
- premium CTA close

If a result feels like a slide deck instead of a product video ad, revise it toward the shared references.
