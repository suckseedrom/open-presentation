# presentation-feature-video-ads

One-command skill pack for turning briefs, pages, or empty projects into code-ready presentation video ads.

```bash
npx skills add Rommadon/presentation-video-ads-skill
```

Built for Codex, Claude Code, OpenCode, Cursor, and any agent that reads skill folders.

Need help choosing the right starting point? Read `docs/USAGE.md`.

## Why it exists

- Code-first by default
- Empty-project friendly
- PresentationFeature-style output
- No extra suffix prompt required

## What you get

- `SKILL.md` — reusable skill contract
- `manifest.json` — package metadata and install contract
- `reference/` — style authority
- `examples/` — starting points for empty and existing projects
- `docs/` — usage, portability, FAQ, and output contract
- `mcp/` — optional adapter for structured clients

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

1. Open the agent and point it at your source content.
2. Ask it to create a presentation using the `presentation-feature-video-ads` skill.
3. Start with `examples/empty-project.md` if you do not already have a page or brief.

### If you are starting from an empty project

Use `examples/empty-project.md` as your first prompt. It is written to work without any existing app code.

## Portable contract

The package follows one simple rule:

> keep the PresentationFeature house style; change only the storyline and source content

That means the repo keeps the cinematic player shell, premium motion language, polished simulation cards, and strong CTA ending while adapting to the input you give it.

## Output mode

This skill is implementation-first.

When you use it in an app, expect it to create or update real code files, not just return a text summary.

For React apps, the target is usually a presentation component, a page wrapper, styles, and tests.

Read `docs/OUTPUT-CONTRACT.md` for the exact contract.

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
