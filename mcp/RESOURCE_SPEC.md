# MCP resource spec

This document defines the read-only resources an MCP adapter for `presentation-feature-video-ads` should expose.

## Goal

Let clients fetch the same grounded reference material that makes the public skill work well, without hardcoding repo-local paths into the skill.

## Resource contract

| URI | Backing file | Purpose |
|---|---|---|
| `presentation-feature://manifest` | `../manifest.json` | package metadata and resolution order |
| `presentation-feature://style-guide` | `../reference/STYLE_GUIDE.md` | distilled house-style snapshot |
| `presentation-feature://scene-grammar` | `../reference/scene-grammar.json` | structured storyboard contract |
| `presentation-feature://examples/about-us` | `../reference/examples/about-us-brief.md` | example prompt for the `/about` use case |
| `presentation-feature://examples/pricing` | `../reference/examples/pricing-brief.md` | example prompt for pricing or package page content |

## Serving rules

- resources must be read-only
- the adapter should return the style guide before any other reference content when asked for style context
- the adapter should return the scene grammar when asked about deck structure or slide sizing
- the adapter should return example briefs when asked for prompt patterns

## Client guidance

If a client supports structured retrieval, it should fetch:

1. `presentation-feature://manifest`
2. `presentation-feature://style-guide`
3. `presentation-feature://scene-grammar`
4. the relevant example brief

If a client only supports markdown, it can skip MCP and use the bundled `reference/` folder instead.
