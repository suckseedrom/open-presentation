# Portability

This package is intended to work in any project, including an empty project. It is portable across plugin-capable agent apps, markdown-skill runners, and direct repo consumption. The presentation itself stays portable as zero-dependency HTML: either a single file with inline CSS and JS or HTML plus the bundled local player files when the workspace accepts them.

## Supported starting points

- a blank repo
- an existing app
- a website export
- a folder of markdown notes
- a plugin-capable frontier AI agent app
- a short product brief
- a presentation, pitch-deck, product-demo, launch, or video-ad request

## What it does not require

- private source paths
- a specific frontend framework
- npm install or build tooling for the presentation itself
- a specific app layout
- an existing presentation system

## Why it stays portable

The bundled markdown and JSON reference pack is the authority, so the skill can be installed and used without depending on the source repository it originated from. Progressive disclosure keeps loading compact: read the workflow map, compact template metadata, shortlisted preview cards, and only the selected design document.

The same rule makes the plugin path portable too. A compatible plugin wrapper can point at the exact same bundled markdown authority instead of introducing a second instruction system.

For Codex, this repo now includes a repo-local marketplace file plus an installable plugin bundle under `plugins/open-presentation/`.

The creative contract is portable too: input-derived cinematic micro-scenes, contextual product mockups, input-led language, layered entrance/action/exit motion, and minimal player-like transport do not require a particular framework. The result remains text-light and motion-heavy.

Portability does not weaken QA. Every scene must pass the closed render, inspect, repair, and rerender gate independently at 16:9 and 9:16 before delivery.
