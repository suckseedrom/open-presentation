# Publishing guide

## Target shape

```text
presentation-feature-video-ads/
├── README.md
├── CLAUDE.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── LICENSE
├── SKILL.md
├── manifest.json
├── docs/
├── examples/
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

### Phase 1: markdown-first core

Ship the markdown skill, shared references, template metadata, template docs, and starter prompts together. The presentation output should default to zero-dependency HTML with inline CSS and JS.

### Phase 2: expand template coverage

Add more templates by extending `templates/index.json` and adding new `preview.md` / `design.md` pairs.

Keep the current base style as the anchor template.

## What not to do

- do not reintroduce MCP
- do not bulk-load every template `design.md`
- do not move shared authority into template-local files unless the rule truly varies by template
- do not turn the skill back into one giant all-in-one contract

## Release checklist

- [ ] `SKILL.md` is a workflow map
- [ ] `reference/STYLE_INDEX.md` exists
- [ ] `reference/PRODUCT_PILLARS.md` exists
- [ ] `templates/index.json` is valid JSON
- [ ] at least one default template has example briefs
- [ ] MCP files are absent
- [ ] architecture tests pass
