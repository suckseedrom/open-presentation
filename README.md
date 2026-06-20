# 🎬 presentation-feature-video-ads

[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-success.svg?style=flat-square)](https://github.com/Rommadon/presentation-video-ads-skill)
[![HTML First](https://img.shields.io/badge/Delivery-HTML%20First-blue.svg?style=flat-square)](https://github.com/Rommadon/presentation-video-ads-skill)
[![Motion Heavy](https://img.shields.io/badge/Storytelling-Motion%20Heavy-orange.svg?style=flat-square)](https://github.com/Rommadon/presentation-video-ads-skill)
[![Aspect Ratios](https://img.shields.io/badge/Aspects-16%3A9%20%2F%209%3A16-purple.svg?style=flat-square)](https://github.com/Rommadon/presentation-video-ads-skill)

Turn raw product briefs, landing pages, code snippets, or simple notes into **cinematic, high-fidelity presentation video ads** directly inside your codebase. 

No slides. No templates that look like standard decks. Just pure, motion-rich, cinematic experiences built automatically by your AI pairing assistant.

---

## ⚡ What Makes This Skill Special?

*   **📦 Zero-Dependency HTML Delivery**  
    Generates standalone, compile-free, single-file HTML presentations or lightweight structures utilizing a pre-built player. No `npm install`, no complex build configurations, and no bloated frameworks. Just open in a browser and go!
*   **🎥 Motion-Heavy, Text-Light Storytelling**  
    Forget bullet points and text walls. Each scene is built to be a high-tempo, cinematic micro-scene featuring one focal object, one active UI state, and graceful, layered fade-in/fade-out animations.
*   **📱 Native Multi-Aspect Layouts (16:9 & 9:16)**  
    Automatically designed and optimized for both widescreen desktops (16:9) and mobile screen heights (9:16) for TikTok, Reels, or YouTube Shorts.
*   **📂 Lightweight Markdown-First Integration**  
    A clean, portable pack that integrates instantly with **Claude Code**, **Cursor**, **Codex**, **OpenCode**, and other agents. Compatible AI assistants load and follow the skill guidelines dynamically on demand using progressive disclosure, without slowing down your AI's context window.
*   **🛡️ Closed Recheck Pass**  
    Before a presentation is delivered, the agent runs a closed recheck pass to inspect, repair, and verify every single scene at both 16:9 and 9:16 aspects.

---

## 🚀 Get Started in 3 Seconds

To install the skill in your project workspace:

```bash
npx skills add Rommadon/presentation-video-ads-skill
```

---

## 🔥 Try It Now! (Copy-Paste Prompts)

Want to see the magic? Copy one of these starter prompts and paste it directly into your AI assistant chat (Cursor, Claude Code, etc.):

### 💡 Example 1: The Product Launch Ad (GitPulse)
> **Paste this into your AI chat:**
> ```text
> Use presentation-feature-video-ads to build a cinematic product launch ad for a new developer tool: "GitPulse" (a real-time interactive git activity dashboard for teams).
> - Product: GitPulse, real-time activity and branch health dashboard
> - Audience: Tech leads and engineering managers who hate merge conflicts
> - Problem: Hidden blocker branches, silent build failures, late alignment
> - Promise: High-velocity team coordination with a living git map
> - Product Flow: 1) Push commit; 2) Live visual pulse on dashboard; 3) Visual branch merge warning; 4) Success pulse
> - CTA: Get started free at gitpulse.dev
> ```

### 📊 Example 2: Turn a Boring Landing Page Pricing Section into an Interactive Video
> **Paste this into your AI chat:**
> ```text
> Use presentation-feature-video-ads to transform our pricing tables into a dynamic, interactive presentation ad.
> - Product: DevHost Cloud
> - Pricing plans: Free ($0, 1 database, 100k requests), Developer ($15/mo, 10 databases, 10M requests, global CDN), Pro ($49/mo, unlimited databases, dedicated cluster, 99.9% SLA).
> - Theme: Capsule (playful, modular card-based UI)
> - Focus: Highlight the Developer tier as the sweet spot. Make the pricing cards animate gracefully and show live stats counting up!
> ```

### ⚙️ Example 3: The "Quick Pitch" Deck from a Brief
> **Paste this into your AI chat:**
> ```text
> Use presentation-feature-video-ads to create a zero-dependency HTML pitch deck from our brief:
> - Product: OrbitDB (a decentralized, offline-first database)
> - Problem: Mobile apps lose state and disconnect on trains/planes
> - Promise: Peer-to-peer sync that just works offline and syncs instantly when back online
> - Theme: Cobalt Grid (precise, technical, design-research layout)
> - CTA: Read the whitepaper at orbitdb.org
> ```

---

## 🎨 Themes & Design Authorities

Pick a design vibe that matches your brand. You don't need to read all the code—your AI assistant will load these on the fly:

| Theme | Mood & Best For | Key Visual Characteristics | Preview Card |
| :--- | :--- | :--- | :--- |
| **✨ Feature Core** | **Adaptive Default** for product-marketing | Clean modern UI mockups, layered reveals, varied active motion | [Preview](templates/presentation-feature-core/preview.md) |
| **✍️ Soft Editorial** | Calm, literary, or warm magazine style | Warm paper stocks, serif typography, serene interfaces, quiet pacing | [Preview](templates/soft-editorial/preview.md) |
| **🌿 Emerald** | Corporate confidence, bold pitches, reports | Deep emerald & navy tones, bold mastheads, high-contrast stat walls | [Preview](templates/emerald-editorial/preview.md) |
| **🌌 Vellum** | Dark, atmospheric, scholarly reflection | Dark vellum backdrop, sparse text, slow-breathing animations | [Preview](templates/vellum/preview.md) |
| **💊 Capsule** | Playful, card-based SaaS features | Rounded cards, card-group layouts, upbeat, interactive steps | [Preview](templates/capsule/preview.md) |
| **🌐 Cobalt Grid** | High-structure analytical research | Precise grid lines, crisp technical structures, clean layouts | [Preview](templates/cobalt-grid/preview.md) |

---

## 🛠️ Generated HTML Structure (Code Showcase)

The generated files are standard, highly readable, and framework-agnostic. Here is an example of the zero-dependency output:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>GitPulse Launch</title>
  <link rel="stylesheet" href="lib/player.css" />
  <style>
    /* Premium, theme-specific animations and transitions */
    .scene { font-family: system-ui; text-align: center; }
    .scene h1 { opacity: 0; transform: translateY(20px); transition: 0.6s ease; }
    .scene.active h1 { opacity: 1; transform: translateY(0); }
  </style>
</head>
<body>
  <!-- Full-viewport player stage -->
  <div id="player"></div>

  <script src="lib/player.js"></script>
  <script>
    new PresentationPlayer(document.getElementById('player'), {
      scenes: [
        {
          id: 'scene-1',
          duration: 5000,
          html: '<div class="scene"><h1>Instant Team Alignment</h1></div>',
          activate: (el) => el.querySelector('.scene').classList.add('active')
        }
      ]
    });
  </script>
</body>
</html>
```

---

## 📂 Progressive Disclosure Architecture

This repo is optimized to keep your AI context small, ensuring fast response times and high-quality outputs:

```text
presentation-video-ads-skill/
├── README.md               # You are here (beautiful, consumer-friendly overview)
├── SKILL.md                # 🗺️ Core Workflow map & rules for the AI Agent
├── manifest.json           # ⚙️ Skill registration metadata
├── reference/              # 📐 Styling & layout authority (product pillars, styling, recheck)
│   ├── STYLE_INDEX.md      # Vibe chooser
│   └── PRODUCT_PILLARS.md  # Delivery guarantees (zero-dependency, dual-aspect targets)
├── templates/              # 🎨 Compact visual templates (preview.md / design.md pairs)
└── lib/                    # ⚙️ Core JS/CSS presentation player runtime
```

---

## 🧪 Development and Testing

Verify your repository is aligned and all tests pass with a single command:

```bash
node tests/architecture.test.mjs
```

---
<div align="center">
  <sub>Built for the modern AI pairing era. Motion-heavy, text-light, zero dependencies.</sub>
</div>
