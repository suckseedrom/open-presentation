# Publishing guide

This document explains how to turn this scaffold into a public GitHub skill package.

## Target shape

Publish the skill as a standalone repo with this structure:

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
│   ├── README.md
│   ├── USAGE.md
│   ├── FAQ.md
│   └── PORTABILITY.md
├── reference/
│   ├── README.md
│   ├── STYLE_GUIDE.md
│   ├── scene-grammar.json
│   └── examples/
│       ├── about-us-brief.md
│       └── pricing-brief.md
└── mcp/
    └── README.md
```

## Recommended release model

### Phase 1: public skill repo

Ship the markdown skill and bundled reference pack first.

This makes the package immediately usable by agents that only understand markdown instructions.

Add the top-level examples, docs, changelog, contributing guide, and license at the same time so the repo feels finished on first visit.

### Phase 2: optional MCP reference adapter

Add a small read-only MCP server (the runnable `mcp/` package in this scaffold) that exposes the manifest, style guide, scene grammar, and example briefs.

This gives structured clients a better way to pull the house style without depending on repo-local code.

### Phase 3: upstream sync from the canonical source

If your house style evolves, regenerate the bundled reference pack from your canonical design source before you publish the next release.

The public package should stay aligned with its own bundled reference pack, but it should never depend on an external repo at install time.

## Sync strategy

When the source material changes:

1. update the canonical reference source
2. refresh the distilled `reference/` files and example briefs
3. bump the public package version
4. publish a new tag/release

## What not to do

- do not edit the public skill file just to support a separate source tree
- do not hardcode repo-private paths into public instructions
- do not replace the bundled reference with a vague “inspired by” description
- do not turn the skill into a generic slide template

## Compatibility notes

- markdown-first clients can use `SKILL.md` alone
- better clients should consume `reference/` as grounding context
- MCP-aware clients can use the optional adapter for richer retrieval

## Release checklist

- [ ] `SKILL.md` is self-contained
- [ ] `reference/STYLE_GUIDE.md` reads like a durable style contract
- [ ] `reference/scene-grammar.json` is valid JSON
- [ ] at least one about-us example exists
- [ ] at least one pricing example exists
- [ ] README explains that the skill repo is primary and MCP is optional
