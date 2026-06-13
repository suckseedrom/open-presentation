# Contributing

Thanks for helping improve the public skill package.

## What to change

- Improve the reusable skill contract in `SKILL.md`.
- Strengthen the style authority in `reference/`.
- Add clearer starting points in `examples/`.
- Improve portability or installability.

## What not to change casually

- The core house style contract.
- The fact that the package is self-contained.
- The rule that the bundled reference pack is authoritative.

## Example update checklist

When adding or changing an example:

1. Make it work without upstream context.
2. Make it short enough to reuse.
3. Make it clear what the input is.
4. Make the expected output obvious.
5. Keep it aligned with the style guide.

## Validation

Before opening a PR, verify:

- JSON files still parse.
- `README.md` still gives a fast start.
- MCP docs match the adapter implementation.
- No file mentions a private source path as a requirement.
