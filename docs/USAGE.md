# Usage

## Install

```bash
npx skills add suckseedrom/open-presentation
```

## Default prompt

```text
Use open-presentation to implement the Apple Inc about us presentation.
```

That short prompt can be enough for presentations, pitch decks, product demos, launches, and video ads. Skill metadata improves discoverability in compatible hosts; it does not guarantee universal auto-activation.

The workflow first runs an input-sufficiency preflight:

- if the supplied content and constraints are sufficient, ask zero questions and proceed
- if unresolved high-impact choices would materially change the result, ask only 2–4 recommendation-first selectable questions
- reuse supplied facts; do not ask again for settled details or low-impact preferences

The implementation contract is:

- create the actual source files in the current app workspace
- default to a single HTML presentation file with inline CSS and JS
- only add framework glue if the host project already requires it
- derive cinematic micro-scenes from the supplied story and product flow; do not use a fixed scene quota
- keep one focus and one visible UI state per scene
- keep scenes text-light; some scenes can be visual-only
- split a dense beat when its setup, action, feedback, and outcome cannot stay legible in one scene
- use contextual modern product mockups grounded in the actual product, workflow, and platform
- use input-led language; use deliberate bilingual copy only when the source, audience, or user direction justifies it
- vary layered entrance, action, and exit motion across typography, UI state, masks, proof, space, and micro-interactions
- keep the transport chrome minimal and player-like
- keep the output accessible, customizable, and production-ready for 16:9 and 9:16
- keep the presentation zero-dependency, text-light, and motion-heavy
- render, inspect, repair, and rerender every scene at both aspect targets; deliver only after every scene is green at both

## Optional 4K video export delivery

When the user asks for video export, keep the default player intact and add the export modules:

```html
<link rel="stylesheet" href="./lib/player.css">
<div id="player"></div>
<script src="./lib/player.js"></script>
<script src="./lib/editor-model.js"></script>
<script src="./lib/editor-renderer.js"></script>
<script src="./lib/editor-export.js"></script>
```

Load the scripts in that order. Pass one `onDownload` callback to `PresentationPlayer`; inside it, trigger the 4K WebM export using `PresentationEditorExport.exportComposition(options)` and display progress/alerts to the user.

Zero-dependency playback and optional video export are separate guarantees. The HTML player works without recording support. 4K export uses browser `MediaRecorder`; unsupported codecs, recorder failures, cancellation, empty results, or wrong encoded dimensions must produce a visible non-success state while preserving the composition.

## Progressive-disclosure flow

1. Read `SKILL.md`
2. Read `reference/STYLE_INDEX.md`
3. Read `templates/index.json`
4. Shortlist candidates from metadata and preview-vibe cues only
5. Read only shortlisted `preview.md` files
6. Read one selected `design.md`
7. Generate the implementation
8. Close the per-scene 16:9 and 9:16 repair ledger before delivery

## User-facing starting prompts

- `examples/empty-project.md`
- `examples/about-us.md`
- `examples/pricing.md`
- `examples/react-implementation.md`
- `examples/shared-player-example.html` — runnable video export integration

Use these only when you need a starting prompt. They are not the architecture.
