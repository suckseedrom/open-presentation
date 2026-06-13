# Repository rules

This repo packages a public, portable skill for generating PresentationFeature-style presentation video ads.

## Core rule

The bundled reference pack is the authority. Do not add upstream paths or hidden source dependencies back into the public package.

## Repo layout

- `SKILL.md` is the reusable contract.
- `reference/` is the style authority.
- `examples/` are the fastest way to start.
- `mcp/` is optional and must expose the same bundled files.

## Style contract

Keep the output:

- cinematic
- premium
- player-first
- content-sized
- simulation-driven
- CTA-led

## Editing rules

- Keep `README.md` consumer-friendly.
- Keep `PUBLISHING.md` maintainer-focused.
- Keep examples generic enough to work in any project.
- Keep JSON files valid and lint-free.
- Keep the MCP adapter layout-independent via configuration or a documented package root.

## Before release

1. Validate JSON files.
2. Run the package tests that cover the presentation flow.
3. Verify the repo has no private-path coupling.
4. Confirm the README answers “what is this?” and “how do I use it?” in under a minute.
