# Examples

These concise starter prompts cover four common situations:

- `empty-project.md` — start from a product brief
- `about-us.md` — transform an about page
- `pricing.md` — transform a pricing or package page
- `react-implementation.md` — implement in an existing app

They model the skill's input preflight: complete briefs proceed without questions; underspecified requests receive only 2–4 recommendation-first choices about unresolved, high-impact decisions.

Each prompt asks for an input-derived, text-light cinematic story, contextual product mockups, input-led language, varied layered motion, minimal player transport, and per-scene QA at both 16:9 and 9:16. Scene count follows the supplied story rather than a fixed quota.

For visual discovery, use `reference/STYLE_INDEX.md` and the compact cards in `templates/*/preview.md`. The full workflow remains in `SKILL.md`.

## Video export demo

`shared-player-example.html` is a complete zero-dependency browser example. Serve the repository over local HTTP, open the file, and click the **Download to Video (4K)** action in the minimal player transport. This demonstrates deterministic 4K WebM export directly on the client side using the shared player library and video export modules.

Playback does not require recording support. The export action uses browser `MediaRecorder`, verifies a non-empty encoded result and exact output dimensions, and reports unsupported or failed export states directly on the player stage.
