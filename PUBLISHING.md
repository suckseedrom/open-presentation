# Publishing guide

This repo ships as a plugin-first, skill-compatible public agent package. Keep the plugin wrapper thin and keep the bundled markdown files authoritative.

## Target shape

```text
open-presentation/
├── README.md
├── PRIVACY.md
├── SUPPORT.md
├── CLAUDE.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── LICENSE
├── SKILL.md
├── manifest.json
├── <repo marketplace file>
├── docs/
├── examples/
├── plugins/
│   └── open-presentation/
│       └── .codex-plugin/plugin.json
├── reference/
│   ├── PRODUCT_PILLARS.md
│   ├── STYLE_INDEX.md
│   ├── STYLE_GUIDE.md
│   └── scene-grammar.json
├── templates/
│   ├── index.json
│   └── */
│       ├── preview.md
│       └── design.md
└── tests/
```

## Release model

### Phase 1: plugin-first public core

Ship the thin plugin wrapper metadata, the markdown skill, shared references, template metadata, template docs, and starter prompts together. The presentation output should default to zero-dependency HTML with inline CSS and JS, and the shared docs should enforce a text-light, motion-heavy scene budget.

Treat public GitHub installation as the primary release surface. Local repo marketplace use is the development path, not the main user story.

The core template is the adaptive default, not a universal activation rule. Its release contract derives scene inventory, mockups, language, and motion from the input; asks selective recommendation-first questions only for unresolved high-impact choices; and closes every scene through 16:9 and 9:16 QA.

The plugin wrapper must not add MCP, hidden services, private-path references, or alternate instruction authority. It should simply make the bundled skill easier to install in plugin-capable frontier AI agent apps.

### Phase 2: expand template coverage

Add more templates by extending `templates/index.json` and adding new `preview.md` / `design.md` pairs.

Keep the current base style as the anchor template.

## What not to do

- do not reintroduce MCP
- do not make the plugin wrapper smarter than the markdown authority
- do not bulk-load every template `design.md`
- do not move shared authority into template-local files unless the rule truly varies by template
- do not turn the skill back into one giant all-in-one contract

## Release checklist

- [ ] the public GitHub repo contains the repo marketplace file and plugin bundle on the branch users will install
- [ ] `codex plugin marketplace add suckseedrom/open-presentation` works from a clean Codex environment
- [ ] `codex plugin add open-presentation@open-presentation` works after the marketplace add
- [ ] Claude Code accepts `/plugin marketplace add suckseedrom/open-presentation`
- [ ] Claude Code shows the plugin after `/reload-plugins` or restart
- [ ] `SKILL.md` is a workflow map
- [ ] `reference/STYLE_INDEX.md` exists
- [ ] `reference/PRODUCT_PILLARS.md` exists
- [ ] `PRIVACY.md` exists and matches the package's no-hidden-service posture
- [ ] `SUPPORT.md` exists and explains public support paths
- [ ] plugin-first install guidance is visible in `README.md`
- [ ] marketplace-style plugin install examples are visible in `README.md`
- [ ] the repo marketplace file points at `./plugins/open-presentation`
- [ ] `plugins/open-presentation/.codex-plugin/plugin.json` validates
- [ ] plugin assets exist for icon, logo, and three screenshots
- [ ] screenshots present the plugin like a polished public storefront package
- [ ] skill fallback guidance is still visible in `README.md`
- [ ] `reference/STYLE_GUIDE.md` includes the text-light / motion-heavy budget
- [ ] all JSON files parse successfully
- [ ] at least one default template has example briefs
- [ ] MCP files are absent
- [ ] architecture tests pass
- [ ] no public file contains private-path or hidden dependency coupling
- [ ] `README.md` makes the plugin-first and markdown-authority loading path clear
- [ ] public docs make the zero-dependency HTML delivery promise visible
- [ ] public docs make the text-light / motion-heavy guidance visible
- [ ] adaptive scene planning does not impose a universal scene count
- [ ] selective Q&A, contextual mockups and language, layered motion, and closed per-scene dual-aspect QA remain aligned across the shared authority

## Public release gate

Before announcing a GitHub release publicly:

1. Push the release branch or tag to GitHub.
2. Verify the Codex install flow from a clean environment.
3. Verify the Claude marketplace flow and `/reload-plugins` recovery path.
4. Confirm the plugin card assets still render correctly from the plugin bundle.
5. Confirm `PRIVACY.md` and `SUPPORT.md` still match the current package behavior and support path.
6. Re-read the README install section as if you are a first-time user with no repo context.
