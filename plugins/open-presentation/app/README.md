# Open Presentation App Surface

This plugin bundle is prepared for a true plugin-native v2 app surface, but it does not yet include a production `.app.json`.

## Why there is no `.app.json` here

A valid plugin-owned app surface needs a real app or connector id. Without that id, shipping `.app.json` would be misleading and would not produce a reliable public user experience.

## Current supported runtime

- plugin install
- skill-driven workflow execution
- workspace output generation

## Planned upgrade path

When a real Codex or Claude-compatible app target exists, add:

- `.app.json`
- app-specific assets if needed
- host bindings to `../../core/orchestrator/`
- session rendering based on `../../core/contracts/plugin-session.schema.json`

Use these templates as the production starting points:

- `open-presentation.codex.production.app.template.json`
- `open-presentation.claude.production.app.template.json`

Keep the skill and references as the authority behind the UI.
