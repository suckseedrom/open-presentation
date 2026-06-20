# PresentationPlayer

Vanilla JS/CSS player and optional editing modules for portable presentation video ads. Load the player in any static HTML presentation to get the minimal transport, stage, transition, and audio behavior without React or external dependencies.

## Installation

Copy the `lib/` folder into your presentation output directory, then add to your HTML:

```html
<link rel="stylesheet" href="./player.css">
<div id="player" style="width:100vw;height:100vh"></div>
<script src="./player.js"></script>
<script>
  new PresentationPlayer(document.getElementById('player'), {
    scenes: [ /* ... */ ]
  });
</script>
```

## Quick Start

```js
const player = new PresentationPlayer(document.getElementById('player'), {
  scenes: [
    {
      id: 'intro',
      html: '<div style="padding:4rem"><h1>Welcome</h1></div>',
      duration: 6000
    },
    {
      id: 'features',
      html: '<div style="padding:4rem"><h2>Features</h2></div>',
      duration: 8000,
      activate: (node) => {
        // Called when this scene becomes visible
        node.querySelectorAll('[data-animate]').forEach(el => {
          el.style.animation = 'fadeIn 0.6s ease forwards';
        });
      }
    }
  ],
  audioUrl: './bg-music.mp3',   // optional
  onExit: () => console.log('closed')
});
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `scenes` | `Scene[]` | `[]` | Array of scene objects (see Scene Contract below) |
| `durations` | `number \| number[]` | `5000` | Fallback duration(s) in ms when scene doesn't specify its own |
| `audioUrl` | `string` | `null` | URL for looping background audio |
| `theme` | `object` | `{}` | CSS custom property overrides (see Styling) |
| `onExit` | `function` | `null` | Callback — when provided, an Exit button appears in the transport |
| `onDownload` | `function` | `null` | Callback — when provided, a Download to Video (4K) button appears in the transport |

## Scene Contract

Each scene object:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | yes | Unique identifier for the scene |
| `html` | `string` | yes | Inner HTML content for the scene node |
| `background` | `string` | no | Static full-viewport background for this scene. A CSS `background` value (e.g. `#022c22` or `url(...)`), or an HTML string starting with `<` (e.g. a gradient mesh). Rendered outside the scaled stage so it never letterboxes. |
| `duration` | `number` | no | Per-scene duration in ms (overrides `durations` option) |
| `activate` | `function(node)` | no | Called with the DOM node when scene becomes active — use for triggering animations |

### Static backgrounds

Each scene can define a `background`. The player renders it in a separate full-viewport layer behind the scaled stage. This layer is never transformed or self-animated, so it stays crisp and letterbox-free even when the viewport aspect ratio differs from the production target.

```js
{
  id: 'dark-hook',
  background: '#022c22',
  html: '<div style="color:#fff"><h1>Hook</h1></div>'
}
```

## API Methods

| Method | Description |
|--------|-------------|
| `play()` | Resume playback |
| `pause()` | Pause playback |
| `next()` | Advance to next slide (wraps around) |
| `prev()` | Go to previous slide (wraps around) |
| `restart()` | Jump to first slide and resume |
| `setMuted(boolean)` | Mute or unmute audio |
| `destroy()` | Tear down player, remove all DOM and listeners |

### Read-only State

```js
player.currentSlide  // number — current index
player.isPlaying     // boolean
player.progress      // number — 0–100 within current slide
player.isMuted       // boolean
```

## Events

Events are dispatched on the container element and bubble up:

| Event | Detail | Description |
|-------|--------|-------------|
| `scene:activate` | `{ index, id, node }` | Fired when a scene becomes visible |
| `scene:deactivate` | `{ index, id, node }` | Fired when a scene transitions out |

```js
document.getElementById('player').addEventListener('scene:activate', (e) => {
  console.log('Now showing:', e.detail.id);
});
```

## Styling

Override CSS custom properties via the `theme` option or directly in CSS:

```css
#player {
  --pf-primary: #043a25;
  --pf-bg: #fafaf8;
  --pf-pill-bg: rgba(255, 255, 255, 0.75);
  --pf-pill-border: rgba(15, 31, 26, 0.05);
  --pf-pill-shadow: rgba(2, 44, 34, 0.03);
  --pf-transition: 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
```

Or via JS:

```js
new PresentationPlayer(el, {
  scenes: [...],
  theme: {
    primary: '#1a1a2e',
    bg: '#0f0f0f',
    pillBg: 'rgba(30,30,50,0.8)'
  }
});
```

### Theme Keys

| Key | CSS Property | Default |
|-----|-------------|---------|
| `primary` | `--pf-primary` | `#043a25` |
| `bg` | `--pf-bg` | `#fafaf8` |
| `pillBg` | `--pf-pill-bg` | `rgba(255,255,255,0.75)` |
| `pillBorder` | `--pf-pill-border` | `rgba(15,31,26,0.05)` |
| `pillShadow` | `--pf-pill-shadow` | `rgba(2,44,34,0.03)` |
| `transition` | `--pf-transition` | `0.6s cubic-bezier(0.16,1,0.3,1)` |

## Behavior Notes

- **No scrubber, time display, fullscreen, or keyboard shortcuts** — the transport is intentionally minimal.
- **Stage sizing**: Desktop 1280×720, Mobile (<768px) 576×1024. Auto-scales via `transform: scale()` to fit the container.
- **Transitions**: CSS blur + opacity crossfade (0.6s) with a slow scale drift (0.98 → 1.02) over each slide's duration.
- **Audio**: Autoplay is unblocked on first user interaction (clicking any transport button).
- **Accessibility**: Transport has `role="toolbar"`, all buttons have `aria-label`, and a live region announces slide changes.

## Optional 4K Video Export Modules

To support browser-side video export, include the additional export scripts after the player:

```html
<link rel="stylesheet" href="./player.css">
<script src="./player.js"></script>
<script src="./editor-model.js"></script>
<script src="./editor-renderer.js"></script>
<script src="./editor-export.js"></script>
```

Wire the export by providing an `onDownload` callback to `PresentationPlayer` that triggers the export directly:

```js
new PresentationPlayer(document.getElementById('player'), {
  scenes: [ /* ... */ ],
  onDownload: async () => {
    console.log('Initiating 4K WebM export...');
    const result = await PresentationEditorExport.exportComposition({
      composition,
      aspect: '16:9',
      onProgress: (pct) => console.log('Export progress:', Math.round(pct * 100) + '%')
    });
    if (result.outcome === 'completed') {
      // Trigger browser file save...
    }
  }
});
```

See `../examples/shared-player-example.html` for a complete runnable wiring example.

### Composition and deterministic render

`PresentationEditorModel` owns versioned portable JSON and rejects malformed, oversized, unsupported-version, unsafe-key, or unsafe asset input. `PresentationEditorRenderer.renderAt(composition, timeMs, aspect, target)` deterministically resolves the active scene and ordered layers for both preview and export.

### 4K WebM

`PresentationEditorExport.exportComposition()` targets exact dimensions:

- `16:9` → 3840×2160
- `9:16` → 2160×3840

Export is optional and capability-probed. Success requires non-empty encoded data and verified dimensions. Unsupported WebM recording, cancellation, recorder failure, empty output, or dimension mismatch returns a non-success result and leaves the composition intact. The player itself does not require `MediaRecorder`.

## License

MIT
