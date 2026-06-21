# Publishing guide

## Target shape

```text
open-presentation/
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

Ship the markdown skill, shared references, template metadata, template docs, and starter prompts together. The presentation output should default to zero-dependency HTML with inline CSS and JS, and the shared docs should enforce a text-light, motion-heavy scene budget.

The core template is the adaptive default, not a universal activation rule. Its release contract derives scene inventory, mockups, language, and motion from the input; asks selective recommendation-first questions only for unresolved high-impact choices; and closes every scene through 16:9 and 9:16 QA.

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
- [ ] `reference/STYLE_GUIDE.md` includes the text-light / motion-heavy budget
- [ ] all JSON files parse successfully
- [ ] at least one default template has example briefs
- [ ] MCP files are absent
- [ ] architecture tests pass
- [ ] no public file contains private-path or hidden dependency coupling
- [ ] `README.md` makes the markdown-only loading path clear
- [ ] public docs make the zero-dependency HTML delivery promise visible
- [ ] public docs make the text-light / motion-heavy guidance visible
- [ ] adaptive scene planning does not impose a universal scene count
- [ ] selective Q&A, contextual mockups and language, layered motion, and closed per-scene dual-aspect QA remain aligned across the shared authority
