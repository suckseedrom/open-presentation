# presentation-feature-video-ads

Create premium presentation video ads from anything: an empty project, a product brief, a website, a folder of notes, a pricing page, or an about page.

This repo is self-contained. The bundled reference pack is the source of truth. The optional MCP adapter exposes the same files for structured clients.

## What this repo is

`presentation-feature-video-ads` is a universal skill package for turning source material into a cinematic, PresentationFeature-style presentation.

It is designed to work in:

- a brand-new empty project
- an existing product repo
- a notes folder
- a marketing site export
- a markdown-only agent runtime
- an MCP-aware agent runtime

## What you get

- `SKILL.md` — the reusable skill contract
- `manifest.json` — machine-readable package metadata
- `reference/` — the style authority
- `examples/` — copy/paste starting prompts for empty and existing projects
- `docs/` — portability and FAQ notes for maintainers and installers
- `mcp/` — an optional adapter that serves the same bundled reference files

## Install in one command

```bash
npx skills add OWNER/presentation-feature-video-ads
```

Replace `OWNER` with the GitHub user or organization that publishes this repo.

After installation, you can use the skill in any supported agent by asking it to create a presentation from your content.

Need help choosing the right starting point? Read `docs/USAGE.md`.

## Start here

### If your agent reads markdown skills

1. Open `SKILL.md`.
2. Read `reference/STYLE_GUIDE.md`.
3. Read `reference/scene-grammar.json`.
4. Try one of the examples in `examples/`.

### If your agent supports MCP

1. `cd mcp`
2. `npm install`
3. `npm run dev`
4. Read the same reference files through the MCP resources.

### If you use Codex, Claude Code, or OpenCode

1. Install the skill with `npx skills add OWNER/presentation-feature-video-ads`.
2. Open the agent and point it at your source content.
3. Ask it to create a presentation using the `presentation-feature-video-ads` skill.
4. Start with `examples/empty-project.md` if you do not already have a page or brief.

### If you are starting from an empty project

Use `examples/empty-project.md` as your first prompt. It is written to work without any existing app code.

## Portable contract

The package follows one simple rule:

> keep the PresentationFeature house style; change only the storyline and source content

That means the repo keeps the cinematic player shell, premium motion language, polished simulation cards, and strong CTA ending while adapting to the input you give it.

## Repository structure

```text
presentation-feature-video-ads/
├── README.md
├── CLAUDE.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── LICENSE
├── SKILL.md
├── manifest.json
├── examples/
├── docs/
├── reference/
└── mcp/
```

## Example use cases

- `/about` page → About Us Presentation
- pricing page → pricing deck
- customer page → design-partner presentation
- raw notes → founder narrative deck
- empty project → first-run presentation brief

## What this is not

- a dashboard kit
- a documentation template
- a generic slide deck engine
- a runtime/editor/framework
- a repo that depends on private source paths

## Maintenance

When you update the skill, keep these in sync:

- `SKILL.md`
- `reference/STYLE_GUIDE.md`
- `reference/scene-grammar.json`
- the example briefs

If you change the public contract, bump the version in `manifest.json`.

## For maintainers

- Read `CLAUDE.md` for repo rules.
- Read `CONTRIBUTING.md` before adding examples or changing the reference pack.
- Read `PUBLISHING.md` when preparing a release.
- Read `docs/USAGE.md` to see the exact prompts and install flow users should follow.
