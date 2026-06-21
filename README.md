# open-presentation

[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-success.svg?style=flat-square)](https://github.com/suckseedrom/open-presentation)
[![HTML First](https://img.shields.io/badge/Delivery-HTML%20First-blue.svg?style=flat-square)](https://github.com/suckseedrom/open-presentation)
[![Skill First](https://img.shields.io/badge/Model-Skill%20First-0f766e.svg?style=flat-square)](https://github.com/suckseedrom/open-presentation)
[![Plugin Install](https://img.shields.io/badge/Install-Plugin%20Marketplace-f59e0b.svg?style=flat-square)](https://github.com/suckseedrom/open-presentation)

> A public skill-first repo for cinematic HTML presentations, pitch decks, demos, and launch video ads. Install it as a plugin in Claude or Codex. Use it as a skill everywhere else.

Generic AI gives you deck-like slides. `open-presentation` gives you a reusable presentation skill system: scene planning, theme selection, HTML-first output, motion-heavy storytelling, and a strict 16:9 plus 9:16 recheck loop.

![Open Presentation plugin hero](plugins/open-presentation/assets/logo.png)

## Start Here

Need a launch video ad?  
Prompt: `Use open-presentation to build a launch video ad for our new product.`

Need a pricing explainer?  
Prompt: `Use open-presentation to turn our pricing page into a cinematic HTML presentation.`

Need a product demo reel?  
Prompt: `Use open-presentation to create a 9:16 HTML demo reel from this workflow.`

If this repo helps you, star it.

## Why open-presentation?

- Plugin install for public users. Claude and Codex users can install from the GitHub marketplace path instead of copying files around.
- Skill-first execution. The real value lives in `SKILL.md`, `reference/`, `templates/`, and `examples/`, not in a hidden service.
- Better than generic slide output. The workflow plans short visual beats, grounded product mockups, layered motion, and HTML deliverables that can live in your repo.
- Zero-dependency playback. Default output is a standalone HTML file or HTML plus the bundled local player.
- Closed recheck pass. Delivery stays blocked until scenes pass both 16:9 and 9:16 review.
- Public and portable. The same bundle still works as a markdown skill or direct repo copy in other AI tools.

## How It Works

### Skills are the building blocks

`open-presentation` is fundamentally a skill repo.

The skill:
- reads the brief and reuses supplied facts
- derives an input-sized micro-scene plan
- chooses a design direction from bundled templates
- writes real workspace files such as `presentation.html`, `presentation.json`, and `design.md`
- blocks delivery until scenes pass both 16:9 and 9:16 checks

### The plugin is the installer

The plugin is the public packaging layer for Claude and Codex.

It helps users:
- install from GitHub
- discover the skill more reliably
- keep the bundled references and templates together

It does not replace the skill with a separate private runtime.

### Templates are style packs

Templates are compact design packs for different visual directions:
- `presentation-feature-core` for adaptive product storytelling
- `capsule` for playful modular SaaS motion
- `cobalt-grid` for structured analytical demos
- `soft-editorial`, `emerald-editorial`, and `vellum` for distinct tone shifts

## Installation

### Claude Cowork or plugin UI

If your Claude app supports adding a marketplace from GitHub:

1. Open plugin customization or marketplace management.
2. Add marketplace from GitHub.
3. Enter `suckseedrom/open-presentation`.
4. Install `open-presentation`.

If the marketplace appears but the plugin list has not refreshed, run `/reload-plugins` or restart the app.

### Claude Code

```text
/plugin marketplace add suckseedrom/open-presentation
```

Then install `open-presentation` from the `open-presentation` marketplace in Claude Code.

### Codex CLI

```bash
codex plugin marketplace add suckseedrom/open-presentation
codex plugin add open-presentation@open-presentation
```

Codex reads the same repo marketplace file model, so this works natively without converting the repo.

### Other AI assistants

This repo still works as a plain skill repo when plugin marketplaces are unavailable.

Options:
- `npx skills add suckseedrom/open-presentation`
- copy the repo and let the tool read `SKILL.md`
- copy bundled skills into another tool's skill directory when that tool supports markdown skills only

## What Public Users Should Notice

- This is skill-first, not app-first. Install by plugin on Claude and Codex, but the execution model is still the skill.
- The intended output is workspace HTML, not a remote slide artifact.
- Explicit naming helps. `Use open-presentation to ...` is still the most reliable invocation.
- No hidden runtime is required for the public package.
- The repo is portable by design: plugin install when available, skill fallback when not.

## Important Notice About Wrong Routing

If the host responds with lines like:
- `Generate or edit presentation`
- `MCP app returned no HTML content`
- `The generator returned presentation id ...`

then the host routed your prompt to a generic presentation tool instead of this repo's HTML workflow.

That is not the intended behavior of `open-presentation`. The correct behavior is durable workspace output such as:
- `presentation.html`
- `presentation.json`
- `design.md`

## Example Prompts

### Product launch ad

```text
Use open-presentation to build a cinematic launch video ad for our developer tool.
- Product: GitPulse
- Audience: Engineering managers
- Problem: Hidden blocker branches and silent CI failures
- Promise: Live git visibility and faster team coordination
- CTA: Start free at gitpulse.dev
```

### Pricing explainer

```text
Use open-presentation to turn our pricing page into a cinematic HTML presentation.
- Product: DevHost Cloud
- Focus: push the Developer tier as the sweet spot
- Theme: Capsule
- Output: workspace HTML files
```

### Product demo reel

```text
Use open-presentation to create a 9:16 product demo reel from this workflow.
- Product: OrbitDB
- Problem: offline state loss in mobile apps
- Promise: peer-to-peer sync that works offline
- Theme: Cobalt Grid
```

## What Ships In This Repo

- `SKILL.md` — the workflow authority
- `reference/` — the creative and QA rules
- `templates/` — preview-first design packs
- `examples/` — starter prompts and examples
- `lib/` — the player and optional deterministic 4K export modules
- repo marketplace files — plugin install metadata for supported hosts
- `plugins/open-presentation/.codex-plugin/plugin.json` — installable plugin manifest
- `PRIVACY.md` and `SUPPORT.md` — public trust and support docs

## Try It Locally

Serve the repo over local HTTP and open `examples/shared-player-example.html` to preview the player and export flow.

## Advanced Docs

Most public users can stop at `README.md` and `SKILL.md`.

Advanced maintainers can also read:
- `docs/USAGE.md`
- `docs/OUTPUT-CONTRACT.md`
- `docs/PLUGIN-NATIVE-V2.md`
- `docs/APP-CONNECTOR-REQUIREMENTS.md`
- `docs/RUNTIME-SERVICE-SPEC.md`

## Trust & Support

- [PRIVACY.md](PRIVACY.md) explains the no-hidden-service posture.
- [SUPPORT.md](SUPPORT.md) explains where to ask for install, generation, player, and export help.

<div align="center">
  <sub>Plugin install first. Skill-first execution. Zero-dependency HTML output.</sub>
</div>
