# Usage

## Install

```bash
npx skills add Rommadon/presentation-video-ads-skill
```

## Default prompt

```text
Use presentation-feature-video-ads to implement the Apple Inc about us presentation.
```

That short prompt already implies:

- create the actual source files in the current app workspace
- default to a single HTML presentation file with inline CSS and JS
- only add framework glue if the host project already requires it
- split rich content into more, shorter scenes
- keep one focus and one visible UI state per scene
- use modern product mockups and refined motion
- keep the transport chrome minimal and player-like
- keep the output accessible, customizable, and production-ready for 16:9 and 9:16

## Progressive-disclosure flow

1. Read `SKILL.md`
2. Read `reference/STYLE_INDEX.md`
3. Read `templates/index.json`
4. Shortlist candidates from metadata and preview-vibe cues only
5. Read only shortlisted `preview.md` files
6. Read one selected `design.md`
7. Generate the implementation

## User-facing starting prompts

- `examples/empty-project.md`
- `examples/about-us.md`
- `examples/pricing.md`
- `examples/react-implementation.md`

Use these only when you need a starting prompt. They are not the architecture.
