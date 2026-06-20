# presentation-feature-video-ads

One-command skill pack for turning briefs, pages, or empty projects into code-ready presentations, pitch decks, product demos, launches, and video ads.

```bash
npx skills add Rommadon/presentation-video-ads-skill
```

Built for Codex, Claude Code, OpenCode, Cursor, and any agent that reads skill folders.

## What changed in this architecture

This repo now uses **progressive disclosure**:

- `SKILL.md` is the workflow map
- `reference/PRODUCT_PILLARS.md` defines the delivery promises
- `reference/STYLE_INDEX.md` is the template chooser
- `templates/index.json` is the compact metadata layer
- `templates/*/preview.md` are the generated visual preview cards
- `templates/*/design.md` are loaded only after selection

There is **no MCP layer**. This package is markdown-first and self-contained.

## Default behavior

A short prompt like `Use presentation-feature-video-ads to implement the Apple Inc about us presentation` can be enough. The skill metadata makes the workflow easier for compatible agents to discover, but activation still depends on the host and the user's request.

The skill first runs a selective input-sufficiency preflight. When the supplied goal, audience, content, language, product context, and delivery constraints are sufficient, it asks zero questions. When a high-impact choice is unresolved, it asks only 2–4 recommendation-first selectable questions rather than reopening settled details.

It then creates an input-derived inventory of cinematic micro-scenes. Scene count follows the story and product flow rather than a quota: each scene has one communication job, one focal object, one visible state, a motion family, a duration, and separate 16:9 and 9:16 composition notes. Rich beats are split when needed; some scenes can be visual-only.

Product visuals should be contextual modern mockups grounded in the supplied product and its native surface conventions. Copy follows the input language and intended audience. Bilingual treatment is deliberate and appears only when the source, audience, or user direction justifies it.

Motion is layered across entrance, action, and exit. Typography, UI state, masks, proof, spatial movement, and micro-interactions should vary across adjacent scenes instead of repeating one fade recipe. The transport remains minimal and player-like so it never competes with the content.

Before delivery, the skill runs a closed per-scene recheck pass and maintains a QA ledger: render, inspect, repair, and rerender every scene at both 16:9 and 9:16. Delivery stays blocked until every row records current `16:9 PASS` and `9:16 PASS` evidence.

Animations should be bound to the active scene, not just to page load, so word reveals and fades still read when each scene becomes visible.

If the user has not expressed a visual preference, choose from the generated preview cards first so the result feels intentionally styled instead of generically templated.

## Starter templates

- `presentation-feature-core` — the current best default
- `soft-editorial`
- `emerald-editorial`
- `vellum`
- `capsule`
- `cobalt-grid`

Each template stays inside the same core concept: premium video presentation style, a restrained player-like shell, UI-heavy storytelling, clean product surfaces, and zero-dependency HTML delivery.

## Start here

1. Read `SKILL.md`
2. Read `reference/STYLE_INDEX.md`
3. Read `templates/index.json`
4. Read only shortlisted `preview.md` files
5. Read one selected `design.md`

If you just want starter prompts, use `examples/`.

## Repository structure

```text
presentation-feature-video-ads/
├── README.md
├── CLAUDE.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── LICENSE
├── SKILL.md
├── manifest.json
├── docs/
├── examples/
├── reference/
│   ├── PRODUCT_PILLARS.md
│   ├── STYLE_INDEX.md
│   ├── RECHECK.md
│   ├── STYLE_GUIDE.md
│   └── scene-grammar.json
└── templates/
```

## Why this pack is different

- implementation-first
- zero-dependency HTML delivery for the presentation itself
- generated visual previews for style discovery
- curated styles that avoid generic AI aesthetics
- text-light, motion-heavy cinematic micro-scenes sized to the input
- contextual product mockups and input-led language
- layered entrance, action, and exit motion
- accessible, fixed 16:9 and 9:16 production-quality output
- UI-first video-ad storytelling
- shared base style with multiple on-demand templates
- progressive disclosure instead of one giant contract
- a closed per-scene repair loop that gates handoff on all-green 16:9 and 9:16 evidence
- no private paths, no MCP, no external runtime dependency
