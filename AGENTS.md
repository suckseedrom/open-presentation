# Repository rules

This repo packages a public, portable skill for generating PresentationFeature-style open presentations.

## Core rule

The bundled markdown files are the authority. Do not add upstream paths or hidden dependencies back into the public package. The presentation itself should stay zero-dependency, text-light, motion-heavy, and HTML-first.

## Repo layout

- `SKILL.md` is the workflow map.
- `reference/` is the shared authority.
- `templates/` contains on-demand template assets.
- `examples/` are user-facing starter prompts.

The preview cards in `templates/*/preview.md` are the visual discovery surface; keep them distinct enough to choose from without reading every design doc.

## Editing rules

- Keep `README.md` consumer-friendly.
- Keep `PUBLISHING.md` maintainer-focused.
- Keep JSON files valid.
- Keep templates compact enough for progressive disclosure.
- Keep the public docs aligned with the zero-dependency HTML delivery model and the text-light / motion-heavy scene budget.

## Before release

1. Validate JSON files.
2. Run the architecture tests.
3. Verify the repo has no private-path coupling.
4. Confirm the markdown-only loading path is clear from `README.md`.
5. Confirm the zero-dependency HTML delivery promise is visible in the public docs.
6. Confirm the text-light / motion-heavy guidance is visible in the public docs.
