# Optional MCP reference adapter

This folder describes the optional Model Context Protocol adapter for the public `presentation-feature-video-ads` package.

The MCP layer is **not** the skill itself. It is the reference backplane that can serve the style snapshot to clients that support structured resource fetches.

This scaffold now includes a minimal stdio server in `src/index.ts` plus a `package.json` and `tsconfig.json` so the adapter can be run as a real package.

## Why add MCP at all?

Because the style system works well in part because it can anchor itself to a durable reference pack. An MCP adapter gives public users a way to fetch that anchor without hardcoding repo-local paths into the skill text.

## Proposed resources

An implementation should expose these read-only resources:

| Resource | Purpose |
|---|---|
| `presentation-feature://manifest` | package metadata and resolution order |
| `presentation-feature://style-guide` | distilled house-style snapshot |
| `presentation-feature://scene-grammar` | structured storyboard contract |
| `presentation-feature://examples/about-us` | example prompt for the `/about` use case |
| `presentation-feature://examples/pricing` | example prompt for a pricing or package page |

## Runtime shape

- entrypoint: `src/index.ts`
- transport: stdio
- behavior: read-only resource fetch only
- implementation goal: keep the adapter simple enough for Codex/Claude Code style tooling, without inventing any extra runtime logic

## Run locally

```bash
cd mcp
npm install
npm run dev
```

By default the server reads the public package files from the repo root.

If you need to point at a different checkout, set `PRESENTATION_FEATURE_ROOT` to the package root before starting the server.

## Suggested behavior

1. Return the style guide first when the client asks for reference context.
2. Return the scene grammar when the client needs story structure.
3. Return example briefs when the client needs a concrete prompt pattern.
4. Keep the server read-only. It should not generate decks itself; it should provide the grounded context the skill consumes.

## Best use case

Use MCP when the client can ask for live reference data during generation.

Use the skill repo when the client only knows how to read markdown instructions.

Together, they cover both kinds of agents.
