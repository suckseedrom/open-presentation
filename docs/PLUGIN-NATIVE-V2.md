# Plugin-Native V2

`open-presentation` now includes a plugin-native v2 architecture scaffold for Codex and Claude-style hosts.

## Goal

Move from:

- plugin install
- skill execution
- no dedicated plugin-owned app surface

to:

- plugin install
- real app surface
- typed orchestrator and composition contracts
- preview and export flows driven by structured session state

## Included v2 building blocks

- `core/contracts/composition.schema.json`
- `core/contracts/plugin-session.schema.json`
- `core/orchestrator/brief-normalizer.mjs`
- `core/orchestrator/presentation-orchestrator.mjs`
- `core/orchestrator/plugin-session.mjs`
- `core/adapters/codex-host.mjs`
- `core/adapters/claude-host.mjs`
- `core/app-surface/README.md`
- `plugins/open-presentation/app/open-presentation-v2.app.template.json`
- `plugins/open-presentation/app/open-presentation.codex.production.app.template.json`
- `plugins/open-presentation/app/open-presentation.claude.production.app.template.json`
- `docs/APP-CONNECTOR-REQUIREMENTS.md`

## Important limitation

This repo still does not ship a live `.app.json` because that would require a real app or connector id. The v2 architecture is implemented as a code scaffold and contract layer, ready for binding to a real app surface when one exists.

## Recommended next implementation step

Bind a real app/connector target to the orchestrator and replace the template file with a production `.app.json`.
