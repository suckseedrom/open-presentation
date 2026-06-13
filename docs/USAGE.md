# Usage

This skill is designed to be easy to add and easy to use.

## Install

```bash
npx skills add Rommadon/presentation-video-ads-skill
```

No scaffold suffix is needed. The skill generates the code by default.

## Use with Codex

After installing, ask Codex to use the `presentation-feature-video-ads` skill on your source material **and to implement the result as code**.

Example:

```text
Use presentation-feature-video-ads to turn my /about page into an About Us Presentation.
```

## Use with Claude Code

Install the skill, then ask Claude Code to transform the source content into a cinematic presentation **as runnable code**.

Example:

```text
Use presentation-feature-video-ads on this pricing page and keep the house style consistent.
```

## Use with OpenCode

Install the skill, then point OpenCode at the source content and ask for a presentation-style output **in code**.

Example:

```text
Use presentation-feature-video-ads to turn this empty project brief into a presentation video ad implementation.
```

## Best first prompt

If you are starting from nothing, use `examples/empty-project.md`.

If you already have a page, use the example that matches it:

- `examples/about-us.md`
- `examples/pricing.md`

If you want the React/code version explicitly, use `examples/react-implementation.md`.
