# FAQ

## Do I need the original source repo?

No. The bundled reference pack and template docs are the authority.

## Is this a plugin or a skill?

Both, but skill-first.

Public users should think of it like this:
- plugin install is how Claude and Codex users get it easily
- the skill is the real workflow and knowledge layer
- the same bundle still works as a markdown skill and as a direct repo copy

Typical plugin-marketplace examples look like `codex plugin marketplace add suckseedrom/open-presentation`, then `codex plugin add open-presentation@open-presentation`, or `/plugin marketplace add suckseedrom/open-presentation` in Claude Code.

## Can I use this in an empty project?

Yes. Start with `examples/empty-project.md` or a direct short prompt. The skill should scaffold first when needed.

## What can I make with it?

Presentations, pitch decks, product demos, launch stories, and video ads. The same workflow adapts its scene inventory, product surface, language, and pacing to the supplied input.

## Will it ask setup questions every time?

No. The input-sufficiency preflight asks zero questions when the request is sufficient. If an unresolved high-impact choice would materially alter the result, it asks only 2–4 recommendation-first selectable questions and reuses everything already supplied.

## How many scenes will it generate?

There is no fixed quota. The skill builds an input-derived inventory of cinematic micro-scenes and uses the smallest content-complete sequence that keeps each beat focused and legible.

## Does it invent a generic dashboard or translate my copy?

It should not. Product mockups follow the supplied product, workflow, platform, and native surface conventions. Language follows the input and audience; bilingual treatment is used only when the source, audience, or user direction justifies it.

## What is required before delivery?

Every scene must complete a closed render, inspect, repair, and rerender loop at 16:9 and 9:16. Delivery remains blocked until every per-scene ledger row is green or PASS at both aspects.

## Is video export a runtime dependency?

No. Playback remains local, zero-dependency HTML and works without recording APIs. WebM export is an optional browser capability.

## What does “4K export” mean here?

Landscape is 3840×2160 and portrait is 2160×3840. The browser path records deterministic canvas frames to WebM and verifies non-empty output plus exact encoded dimensions before reporting success. Unsupported codecs, cancellation, recorder errors, or dimension mismatch produce a visible failure and preserve the composition.

## Where is the complete video export example?

Serve the repository over local HTTP and open `examples/shared-player-example.html`.

## What files should I read first?

1. `README.md`
2. `SKILL.md`
3. `reference/STYLE_INDEX.md`
4. `templates/index.json`
5. shortlisted template `preview.md` files
6. one selected `design.md`

## Do I need to read every template?

No. Read only enough metadata to shortlist, then one `design.md` after selection.

## Does installation guarantee automatic activation?

No. Plugin metadata and skill metadata improve discovery for compatible agents and hosts, but the host and user request determine activation. Naming `open-presentation` explicitly is still the most reliable option.

## What should public users install from?

Prefer the public GitHub repo marketplace path first. Use `codex plugin marketplace add suckseedrom/open-presentation`, then install `open-presentation@open-presentation`. Use the markdown-skill path only when the host does not support plugin marketplaces.

## Is it like pm-skills?

Yes in the sense that:
- public users can install from a plugin marketplace on Claude and Codex
- the repo is still based on bundled markdown skills and references
- the plugin is the delivery mechanism, not a replacement for the skill

No in the sense that `open-presentation` is one focused presentation system, not a large multi-plugin marketplace.

## What if Claude Code adds the marketplace but I still do not see the plugin?

Run `/reload-plugins` or restart Claude Code. Marketplace changes can require a reload before the current session picks up the new plugin list.

## Why did `plugin://open-presentation@open-presentation` not open anything visible?

Because this package is a skill-first plugin, not a connector-backed app plugin. It ships workflow instructions and bundled references, but no `.app.json` app surface. The supported usage is to install the plugin, then prompt with `Use open-presentation to ...` so the agent runs the workflow in the workspace.

## Why did I get `Generate or edit presentation`, `MCP app returned no HTML content`, or a presentation ID?

Because the host routed your request to its generic presentation app instead of `open-presentation`'s workspace HTML workflow.

That response is not the intended output of this package. `open-presentation` should write durable files in the active workspace, typically `presentation.html`, `presentation.json`, and `design.md`.
