(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.PresentationEditorRenderer = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const ASPECTS = Object.freeze(['16:9', '9:16']);

  function finiteNumber(value, fallback) {
    return Number.isFinite(value) ? value : fallback;
  }

  function clone(value) {
    if (value == null || typeof value !== 'object') return value;
    if (Array.isArray(value)) return value.map(clone);
    const copy = {};
    for (const key of Object.keys(value)) copy[key] = clone(value[key]);
    return copy;
  }

  function ease(value, easing) {
    const t = Math.max(0, Math.min(1, value));
    switch (easing) {
      case 'linear': return t;
      case 'ease-in': return t * t;
      case 'ease-in-out': return t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2;
      case 'ease-out':
      default: return 1 - ((1 - t) * (1 - t));
    }
  }

  function resolveLayer(layer, localTimeMs, aspect, sourceIndex) {
    if (!layer || layer.visible === false) return null;
    const timing = layer.timing || {};
    const startMs = Math.max(0, finiteNumber(timing.startMs, 0));
    const endMs = Math.max(startMs, finiteNumber(timing.endMs, Infinity));
    if (localTimeMs < startMs || localTimeMs >= endMs) return null;

    const elapsed = localTimeMs - startMs;
    const remaining = endMs - localTimeMs;
    const enterMs = Math.max(0, finiteNumber(timing.enterMs, 0));
    const exitMs = Math.max(0, finiteNumber(timing.exitMs, 0));
    const enterProgress = enterMs ? Math.min(1, elapsed / enterMs) : 1;
    const exitProgress = exitMs && Number.isFinite(remaining) ? Math.min(1, remaining / exitMs) : 1;
    const visibilityProgress = ease(Math.min(enterProgress, exitProgress), timing.easing);
    const geometry = clone((layer.layouts && layer.layouts[aspect]) || layer.geometry || {});
    const style = clone(layer.style || {});
    style.opacity = finiteNumber(style.opacity, 1) * visibilityProgress;

    const resolved = clone(layer);
    resolved.geometry = geometry;
    resolved.style = style;
    resolved.timeline = {
      elapsedMs: elapsed,
      progress: Number.isFinite(endMs) && endMs > startMs
        ? Math.max(0, Math.min(1, elapsed / (endMs - startMs)))
        : 0,
      visibilityProgress,
    };
    Object.defineProperty(resolved, '_sourceIndex', { value: sourceIndex, enumerable: false });
    return resolved;
  }

  function paintFrame(target, frame) {
    if (!target) return;
    if (typeof target === 'function') {
      target(frame);
      return;
    }
    if (typeof target.render === 'function') {
      target.render(frame);
      return;
    }
    const context = typeof target.getContext === 'function' ? target.getContext('2d') : target;
    if (!context || typeof context.clearRect !== 'function') return;
    const canvas = context.canvas || target;
    const width = finiteNumber(canvas.width, 0);
    const height = finiteNumber(canvas.height, 0);
    context.clearRect(0, 0, width, height);
    if (frame.background && typeof context.fillRect === 'function') {
      context.fillStyle = frame.background;
      context.fillRect(0, 0, width, height);
    }
    for (const layer of frame.layers) {
      const geometry = layer.geometry || {};
      const x = finiteNumber(geometry.x, 0) * width;
      const y = finiteNumber(geometry.y, 0) * height;
      const w = finiteNumber(geometry.width, 0) * width;
      const h = finiteNumber(geometry.height, 0) * height;
      context.save?.();
      context.globalAlpha = finiteNumber(layer.style && layer.style.opacity, 1);
      if (layer.type === 'text' && typeof context.fillText === 'function') {
        const style = layer.style || {};
        context.fillStyle = style.color || '#ffffff';
        context.textAlign = style.align === 'center' ? 'center' : style.align === 'right' ? 'right' : 'left';
        context.textBaseline = 'top';
        context.font = `${finiteNumber(style.fontWeight, 400)} ${finiteNumber(style.fontSize, 16)}px ${style.fontFamily || 'sans-serif'}`;
        const textX = context.textAlign === 'center' ? x + w / 2 : context.textAlign === 'right' ? x + w : x;
        context.fillText(String(layer.text || ''), textX, y, w);
      } else if ((layer.type === 'shape' || layer.type === 'product-surface') && typeof context.fillRect === 'function') {
        context.fillStyle = (layer.style && layer.style.fill) || '#ffffff';
        context.fillRect(x, y, w, h);
      }
      context.restore?.();
    }
  }

  function renderAt(composition, timeMs, aspect, target) {
    if (!composition || !Array.isArray(composition.scenes) || composition.scenes.length === 0) {
      throw new TypeError('A composition with at least one scene is required');
    }
    const resolvedAspect = aspect || composition.aspect || '16:9';
    if (!ASPECTS.includes(resolvedAspect)) throw new RangeError(`Unsupported aspect: ${resolvedAspect}`);

    const durations = composition.scenes.map((scene) => Math.max(0, finiteNumber(scene.durationMs, 0)));
    const totalDurationMs = durations.reduce((sum, duration) => sum + duration, 0);
    const requestedTimeMs = finiteNumber(timeMs, 0);
    const complete = requestedTimeMs >= totalDurationMs;
    const timelineTimeMs = totalDurationMs > 0
      ? Math.max(0, Math.min(requestedTimeMs, Math.max(0, totalDurationMs - 1)))
      : 0;

    let sceneIndex = composition.scenes.length - 1;
    let sceneStartMs = totalDurationMs - durations[sceneIndex];
    let cursor = 0;
    for (let index = 0; index < composition.scenes.length; index += 1) {
      const end = cursor + durations[index];
      if (timelineTimeMs < end || index === composition.scenes.length - 1) {
        sceneIndex = index;
        sceneStartMs = cursor;
        break;
      }
      cursor = end;
    }

    const scene = composition.scenes[sceneIndex];
    const localTimeMs = Math.max(0, timelineTimeMs - sceneStartMs);
    const layers = (Array.isArray(scene.layers) ? scene.layers : [])
      .map((layer, index) => resolveLayer(layer, localTimeMs, resolvedAspect, index))
      .filter(Boolean)
      .sort((left, right) => finiteNumber(left.z, 0) - finiteNumber(right.z, 0) || left._sourceIndex - right._sourceIndex);
    const frame = {
      aspect: resolvedAspect,
      timeMs: timelineTimeMs,
      requestedTimeMs,
      totalDurationMs,
      complete,
      sceneId: scene.id,
      sceneIndex,
      sceneStartMs,
      localTimeMs,
      background: scene.background || null,
      layers,
    };
    paintFrame(target, frame);
    return frame;
  }

  return Object.freeze({ renderAt });
}));
