# Plugin-Native V2 App Surface

This folder defines the plugin-native v2 app architecture for `open-presentation`.

## What exists now

- typed composition contract in `../contracts/composition.schema.json`
- typed plugin session contract in `../contracts/plugin-session.schema.json`
- deterministic orchestrator modules in `../orchestrator/`
- host adapters for Codex and Claude in `../adapters/`

## What does not exist yet

This repo does **not** ship a live `.app.json` app binding today, because a real connector or app id is required for a truthful plugin-owned widget surface.

## V2 implementation target

When a real app target is available, the plugin-native v2 surface should expose:

1. Brief intake
2. Template shortlist
3. Scene-plan review
4. HTML preview
5. Export actions
6. QA status

The app should call the orchestrator, consume the composition/session contracts, and render those panels directly instead of relying on freeform chat narration.
