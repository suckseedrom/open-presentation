# Support

## Best place to get help

Use the public GitHub repository for installation help, bug reports, release questions, and feature requests:

[https://github.com/suckseedrom/open-presentation](https://github.com/suckseedrom/open-presentation)

## Good support requests include

- the host app you used, such as Codex or Claude Code
- the install path you used, such as GitHub marketplace, local marketplace, or markdown skill
- the exact command or prompt you ran
- screenshots or logs for install failures
- whether the issue is about install, generation quality, player behavior, or export
- whether you expected plugin install only or a full app-like plugin surface

## Before opening an issue

1. Confirm you are on the expected GitHub branch or release tag.
2. Re-run the documented install steps from the README.
3. If using Claude Code, try `/reload-plugins` or restart the app.
4. If using Codex, confirm both marketplace add and plugin add succeeded.
5. If you changed the plugin bundle locally, validate it again before reporting an install bug.
6. If you expected a plugin widget from `plugin://open-presentation@open-presentation`, note that this package is skill-first and does not ship a connector-backed app surface.
7. If you saw `Generate or edit presentation`, `MCP app returned no HTML content`, or only a presentation id, report it as a host routing problem and include the exact prompt plus whether `presentation.html` was written to the workspace.

## Issue categories

- `install` for marketplace or plugin setup problems
- `generation` for skill output quality or scene-planning problems
- `player` for playback and runtime behavior
- `export` for 4K WebM export issues
- `docs` for unclear instructions or missing guidance

## Commercial or private support

This repository currently publishes public support paths only. If private support becomes available later, document it here and link the exact contact channel.
