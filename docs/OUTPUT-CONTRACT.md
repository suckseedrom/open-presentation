# Output contract

This skill produces implementation-ready presentations, pitch decks, product demos, launches, and video ads in the current app workspace. The presentation remains zero-dependency HTML, text-light, motion-heavy, and portable.

## Default deliverable

- a single HTML file with inline CSS and JS, OR an HTML file plus the local shared player library (`player.js` + `player.css`)
- no npm packages, build tools, CDN calls, or framework runtime for the presentation itself
- accessible markup, aria-labelled controls, and clear focus states
- fixed 16:9 artboard logic with a 9:16 mobile-safe version
- well-commented code that is easy to customize
- layered entrance, action, and exit choreography bound to scene activation, with reduced-motion support
- a static full-viewport background layer for every scene, rendered outside the scaled stage
- a 9:16 mobile recheck for every scene with capped type, stacked layouts, and safe-zone padding

## Shared player library deliverable

When using the bundled `lib/player.js`:

- Include `player.css` in the `<head>` and `player.js` before the closing `</body>` (or load it as a module).
- Provide scenes as `{ id, durationMs, render(el), activate(el) }` objects.
- `render(el)` must create the scene DOM; `activate(el)` must start scene-bound motion so animations run when the scene becomes active, not on file load.
- Keep transport chrome minimal, player-like, detached, and visually subordinate.
- Do not add a scrubber, timeline, time display, fullscreen toggle, or presentation-style footer.
- Scene transitions use blur + opacity fades and subtle scale drift; internal motion is triggered by `activate()` and the `scene:activate` event.

## Optional editor and 4K export contract

Editable delivery is opt-in. Closed editor mode must remain the same minimal player: one optional **Editor** action may appear in its transport, but inspector, canvas, timeline, import/export, and progress UI belong only to the editor surface.

An editable deliverable includes the local browser modules `editor-model.js`, `editor-renderer.js`, `editor-export.js`, `editor.js`, and `editor.css`. The composition is portable versioned JSON with per-scene duration/order and per-layer type, visibility, order, timing, style, plus separate 16:9 and 9:16 geometry. Editing must support direct canvas selection/move/resize, text/style changes, layer/scene ordering, undo/redo, autosave, bounded validated JSON import, canonical JSON export, and deterministic time seeking.

The player and editor must use the same composition authority. Live editor preview and deterministic rendering must resolve the same scene, layer order, timing, geometry, and styles. Closing the editor returns the current composition to the player; reopening must not silently reset edits.

Browser video export is an optional capability, not a playback dependency:

- 16:9 output is exactly 3840×2160; 9:16 output is exactly 2160×3840
- every frame comes from deterministic `renderAt(composition, timeMs, aspect)` seeking
- WebM codec support is capability-probed before recording
- cancellation, unsupported recording, recorder errors, empty data, and dimension mismatch are explicit non-success outcomes
- success requires a non-empty WebM whose decoded dimensions match the requested target
- object URLs, streams, tracks, timers, and recorder listeners are cleaned after success, failure, or cancellation
- export failure never discards or mutates the editable composition

The complete browser wiring is in `examples/editor-example.html`.

## Input-derived scene contract

- Run an input-sufficiency preflight before choosing a template or scene count.
- Ask zero questions when the supplied content and constraints are sufficient.
- Otherwise ask only 2–4 recommendation-first selectable questions for unresolved high-impact choices.
- Build an input-derived cinematic micro-scene inventory; never impose a fixed count.
- Give each scene one communication job, one focal object, one visible state, a dominant motion family, a duration, and separate 16:9 and 9:16 composition notes.
- Keep copy to one headline or short label plus, when necessary, one short support line. Some scenes may be visual-only.
- Expand an important flow into enough focused scenes to show setup, action, feedback, and outcome legibly.

The result should feel cinematic rather than slide-like: scene count follows the input, each beat has one focus, and UI or simulation carries the story where the product has a visual surface.

When the source has an important product flow, the deck should show that flow over 2–3 consecutive scenes instead of compressing it into one text block.

Use contextual modern product mockups grounded in the supplied product, workflow, platform, and native surface conventions. Split layouts, counters, timelines, chips, and state-change reveals are options when they make the story easier to understand, not a required visual formula.

Language is input-led and audience-led. Preserve brand terms and domain vocabulary. Use deliberate bilingual treatment only when the input, audience, or user explicitly justifies it.

Motion should be layered and varied. Give each scene a readable entrance, a purposeful action or state change, and an exit; vary dominant motion families across adjacent scenes. Fades remain useful but should not become a fade-only recipe.

## Closed per-scene Recheck gate

Maintain a per-scene render QA ledger. For every scene: render, inspect, repair, and rerender at both production targets. Record current artifact paths and explicit `16:9 PASS` and `9:16 PASS` statuses.

Inspect and repair until:

- no text overlay, clipping, or cramped edge-to-edge stack remains
- no dominant layout repeats more than twice in a row
- no animation completes before the scene becomes visible
- animations are bound to scene activation, not just file load
- entrance, action, and exit remain readable and scene-bound
- adjacent scenes do not repeat the same dominant motion family without narrative reason
- the deck reads like a premium video ad, not a slide presentation
- persistent source labels or chrome do not compete with the hero frame
- every scene has a full-viewport static background layer with no letterboxing
- the mobile 9:16 recheck shows no overflow, clipped text, or broken layouts

Any repair invalidates that row until both aspects are rerendered and reinspected. Block delivery until every row is green/PASS for both 16:9 and 9:16.

## Layout and motion variety

- alternate centered statement, split copy/product, full-bleed showcase, proof-grid/stat-wall, and CTA scenes
- do not repeat the same dominant layout more than twice in a row
- vary the dominant motion family across adjacent scenes
- choreograph entrance, action, and exit using typography, UI state, masks, proof, spatial movement, transitions, or micro-interactions as the scene requires

## Integration rule

When the host project already exists, keep the integration glue thin. Do not add a framework or build step just to satisfy the presentation. The ad logic itself should remain self-contained.

## Ad-first pacing

- more, shorter scenes when the brief has multiple strong claims
- one visible UI state or product moment per scene
- many scenes should be text-light or near-textless
- every scene should have some motion, even if it is subtle
- text, cards, and mockups should have readable presence transitions, not hard pops
- no crowded footer chrome, no clipped edges, and no accidental overlaps
- fixed 16:9 and 9:16 production targets

When the brief has multiple major ideas, split them into more, shorter scenes instead of building one dense slide.

Each scene should be allowed to own one primary UI state or product moment.

Strong features should often get their own mini-sequence of scenes so the viewer can watch the interface evolve.

## For empty projects

Create the smallest working structure that can run:

- a standalone HTML file
- inline styles and scripts
- any tiny data or helper modules needed by the HTML file

If there is no app shell yet, create the standalone HTML presentation directly. Do not scaffold React/Vite unless the user explicitly asks for that stack.

Do not fall back to a docs-only or example-only result.

The transport should remain minimal and player-like rather than becoming a generic presentation toolbar.

## If you only want an outline

Say so explicitly.

Otherwise, the skill should assume code generation mode.
