# Production App And Connector Requirements

This document defines the exact production `.app.json` shape and the connector/runtime requirements needed to turn `open-presentation` into a true plugin-native app surface for Codex and Claude.

## What is exact vs placeholder

The `.app.json` file shape below is exact based on installed plugin examples: an `apps` object keyed by app name with an `id` value.

What remains placeholder is the production app or connector id. That id must come from the real host-side app or connector registration flow.

## Production `.app.json` for Codex

File:

`plugins/open-presentation/.app.json`

Template:

```json
{
  "apps": {
    "open-presentation": {
      "id": "replace-with-codex-production-app-id"
    }
  }
}
```

Bundle integration:

```json
{
  "name": "open-presentation",
  "skills": "./skills/",
  "apps": "./.app.json"
}
```

## Production `.app.json` for Claude-compatible app binding

File:

`plugins/open-presentation/.app.json`

Template:

```json
{
  "apps": {
    "open-presentation": {
      "id": "replace-with-claude-production-app-or-connector-id"
    }
  }
}
```

If the production path ends up using a Claude connector abstraction instead of the same app id surface, keep the file shape identical and swap only the `id`.

## Required production connector capabilities

Whether the runtime is bound for Codex, Claude, or both, the app target must support these product-level capabilities:

1. **Session creation**
- Accept a freeform brief
- Return a stable session id
- Persist template choice, aspect targets, and output mode

2. **Scene planning**
- Return a deterministic scene plan
- Preserve one communication job per scene
- Carry 16:9 and 9:16 notes separately

3. **Preview**
- Render a plugin-owned preview surface
- Show selected template, scene ordering, and scene status
- Return structured preview state rather than only plain chat text

4. **Workspace handoff**
- Write durable files such as `presentation.html`, `presentation.json`, and `design.md`
- Return explicit file references or downloadable outputs

5. **Export**
- Expose HTML package export
- Expose optional 4K WebM export state
- Return progress, success, and recoverable failure states

6. **Revision**
- Reopen a session by id
- Update brief, theme, or scene plan
- Re-render without losing composition state

## Required runtime contracts

The production app should bind to these repo contracts:

- `core/contracts/composition.schema.json`
- `core/contracts/plugin-session.schema.json`

The production runtime should use these orchestrator entrypoints:

- `core/orchestrator/presentation-orchestrator.mjs`
- `core/orchestrator/plugin-session.mjs`
- `core/adapters/codex-host.mjs`
- `core/adapters/claude-host.mjs`

## Recommended plugin-owned panels

The plugin app surface should provide these panels at minimum:

1. **Brief**
- source summary
- product
- audience
- goal

2. **Template**
- shortlist
- active template
- visual direction summary

3. **Scene Plan**
- scene count
- scene titles
- motion families
- focal objects

4. **Preview**
- HTML preview frame or preview link
- current aspect
- scene QA summary

5. **Export**
- HTML package action
- 4K video action
- status and progress

## Authentication and account requirements

The production app id should belong to a real app or connector that:

- is available to public users of the target host
- supports the required auth policy of the host marketplace
- has stable public documentation
- does not depend on undocumented internal app ids

If auth is required:

- prefer install-time auth or first-use auth supported by the marketplace
- provide a clear retry path when auth expires
- surface auth failure as a structured plugin state, not silent chat text

## Codex-specific requirements

Known from current public docs:

- plugins bundle skills, app integrations, and MCP servers
- plugin directory publishing is still evolving
- local and curated plugin patterns already use `.app.json` with app ids

Production requirements:

- the app id must be valid in Codex
- the plugin card should remain installable from the GitHub marketplace source
- `plugin://open-presentation@open-presentation` should open a plugin-owned experience only after the app id is real

## Claude-specific requirements

Known from current public docs:

- marketplace sources can be GitHub repos, URLs, or local paths
- plugin state can require `/reload-plugins` or restart after marketplace changes
- richer integrations may depend on connector-backed runtime

Production requirements:

- the app or connector id must be valid in Claude's runtime
- install flow must remain documented with `/plugin marketplace add ...`
- reload/restart behavior must be documented until host behavior becomes fully live-refresh

## Release gate for app-native v2

Do not claim “true plugin-native app” publicly until all are true:

1. a real production app or connector id exists
2. `.app.json` points to that real id
3. Codex opens a plugin-owned surface from the installed plugin
4. Claude opens the corresponding plugin-owned surface from the installed plugin
5. preview, export, and revision flows work without falling back to generic chat-only text
6. public docs no longer describe the plugin as skill-first

## Recommended rollout sequence

1. register the production app or connector
2. replace the placeholder `.app.json`
3. bind the app surface to the orchestrator contracts
4. test Codex public install flow
5. test Claude public install flow
6. update `README.md`, `FAQ.md`, and `SUPPORT.md` from “skill-first” to “app-native”
