# Changelog

## 1.10.0

- Replaced fixed scene-count expectations with adaptive, input-derived scene planning.
- Limited discovery questions to unresolved high-impact choices, using selective recommendation-first options.
- Grounded mockups and language in the supplied product, audience, and source material.
- Expanded layered motion guidance with scene lifecycles and varied motion families.
- Closed delivery on per-scene 16:9 and 9:16 render, inspect, repair, and rerender QA.

## 1.7.0

- Added an explicit 20+ micro-scene rule for normal-length content.
- Hardened the shared guidance so text and mockups fade in/out instead of popping in.
- Extended the default template and examples to prefer text-light, motion-heavy, near-textless beats.

## 1.6.0

- Added explicit text-light, motion-heavy scene guidance and a hard copy budget per scene.
- Tightened the core template and shared style guide so scenes can be visual-only when the story allows it.
- Added motion-budget language so every scene needs a visible change, not just more copy.

## 1.5.0

- Added explicit zero-dependency HTML delivery as the default presentation model.
- Added `reference/PRODUCT_PILLARS.md` to document the new product-level promises.
- Reframed template previews as generated visual discovery cards.
- Tightened style guidance around anti-AI-slop visuals and fixed 16:9 / 9:16 production targets.
- Updated the implementation contract so the generated ad stays ad-first instead of slide-first.

## 1.4.0

- Rebuilt the package around progressive disclosure.
- Turned `SKILL.md` into a workflow map instead of a giant inline contract.
- Added `reference/STYLE_INDEX.md` and `templates/index.json` for lightweight style selection.
- Added six on-demand template packs with preview/design docs.
- Removed MCP from the public package surface.
- Added an architecture test to lock the markdown-only repo shape.

## 1.3.1

- Replaced desktop-window-inspired mockup guidance with modern product mockups and a cleaner aesthetic direction.
- Aligned motion guidance with `emil-design-eng`-style crisp, tactile, detail-driven transitions.

## 1.3.0

- Defaulted the skill toward more, shorter scenes with one focus per scene and visible UI states.
- Tightened the transport bar direction to be minimal and music-player-like.
- Reinforced UI-first storytelling so rich briefs become premium video ads instead of text-heavy slides.

## 1.2.0

- Reworked the repo into a world-class public skill package layout.
- Added one-command install guidance via `npx skills add suckseedrom/open-presentation`.
- Added agent-specific usage docs for Codex, Claude Code, and OpenCode.
- Added top-level `CLAUDE.md`, `CONTRIBUTING.md`, `examples/`, and `docs/`.
- Clarified that the bare implementation prompt expands to current-app source files, tests, and scaffold-first fallback when no app exists.

## 1.0.0

- Initial public release of `open-presentation`.
- Bundled a self-contained reference pack.
- Added universal usage examples for empty and existing projects.
