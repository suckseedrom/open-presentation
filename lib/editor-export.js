(function (root, factory) {
  'use strict';
  const renderer = root && root.PresentationEditorRenderer
    ? root.PresentationEditorRenderer
    : (typeof module === 'object' && module.exports ? require('./editor-renderer.js') : null);
  const api = factory(root, renderer);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.PresentationEditorExport = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function (root, renderer) {
  'use strict';

  const OUTPUT_DIMENSIONS = Object.freeze({
    '16:9': Object.freeze({ width: 3840, height: 2160 }),
    '9:16': Object.freeze({ width: 2160, height: 3840 }),
  });
  const WEBM_MIME_CANDIDATES = Object.freeze([
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
  ]);

  function selectWebMMime(MediaRecorderApi) {
    if (!MediaRecorderApi || typeof MediaRecorderApi.isTypeSupported !== 'function') {
      throw new Error('WebM MediaRecorder capability probing is not supported');
    }
    const mime = WEBM_MIME_CANDIDATES.find((candidate) => MediaRecorderApi.isTypeSupported(candidate));
    if (!mime) throw new Error('No supported WebM recording capability was found');
    return mime;
  }

  function totalDuration(composition) {
    if (!composition || !Array.isArray(composition.scenes)) return 0;
    return composition.scenes.reduce((sum, scene) => sum + Math.max(0, Number.isFinite(scene.durationMs) ? scene.durationMs : 0), 0);
  }

  function byteLength(chunks) {
    return chunks.reduce((sum, chunk) => {
      if (!chunk) return sum;
      if (Number.isFinite(chunk.size)) return sum + chunk.size;
      if (Number.isFinite(chunk.byteLength)) return sum + chunk.byteLength;
      return sum;
    }, 0);
  }

  function errorMessage(error) {
    return error instanceof Error ? error.message : String(error || 'Export failed');
  }

  function createCanvasDefault(dimensions) {
    if (!root || !root.document || typeof root.document.createElement !== 'function') {
      throw new Error('Canvas creation is unavailable');
    }
    const canvas = root.document.createElement('canvas');
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    return canvas;
  }

  function wait(ms, dependencies, timerIds) {
    const set = dependencies.setTimeout || (root && root.setTimeout);
    const clear = dependencies.clearTimeout || (root && root.clearTimeout);
    if (typeof set !== 'function') return Promise.resolve();
    return new Promise((resolve) => {
      const id = set(() => {
        timerIds.delete(id);
        resolve();
      }, ms);
      timerIds.add(id);
      if (typeof clear !== 'function') timerIds.delete(id);
    });
  }

  async function recordDefault(options, dependencies) {
    const { canvas, composition, aspect, fps, mime, frameCount, durationMs, onProgress, signal, renderAt } = options;
    if (!canvas || typeof canvas.captureStream !== 'function') throw new Error('Canvas captureStream is not supported');
    const MediaRecorderApi = dependencies.MediaRecorder || (root && root.MediaRecorder);
    if (typeof MediaRecorderApi !== 'function') throw new Error('MediaRecorder construction is unavailable');
    const timerIds = new Set();
    let stream = null;
    let recorder = null;
    const chunks = [];
    let recorderError = null;
    let stopped = false;
    try {
      stream = canvas.captureStream(0);
      recorder = new MediaRecorderApi(stream, { mimeType: mime });
      const stoppedPromise = new Promise((resolve) => {
        recorder.ondataavailable = (event) => { if (event.data && event.data.size > 0) chunks.push(event.data); };
        recorder.onerror = (event) => { recorderError = event.error || new Error('MediaRecorder error'); resolve(); };
        recorder.onstop = () => { stopped = true; resolve(); };
      });
      recorder.start();
      onProgress(0);
      for (let index = 0; index < frameCount; index += 1) {
        if (signal && signal.aborted) break;
        const frameTimeMs = Math.min(durationMs > 0 ? durationMs - 1 : 0, Math.floor(index * 1000 / fps));
        renderAt(composition, frameTimeMs, aspect, canvas);
        const track = stream.getVideoTracks && stream.getVideoTracks()[0];
        if (track && typeof track.requestFrame === 'function') track.requestFrame();
        onProgress(frameCount ? index / frameCount : 0);
        await wait(1000 / fps, dependencies, timerIds);
      }
      if (recorder.state !== 'inactive') recorder.stop();
      await stoppedPromise;
      if (recorderError) throw recorderError;
      if (signal && signal.aborted) return { outcome: 'cancelled', chunks: [] };
      if (!stopped) throw new Error('MediaRecorder did not stop cleanly');
      return { chunks };
    } finally {
      for (const id of timerIds) (dependencies.clearTimeout || (root && root.clearTimeout))?.(id);
      if (recorder && recorder.state !== 'inactive') {
        try { recorder.stop(); } catch (_) {}
      }
      for (const track of stream && stream.getTracks ? stream.getTracks() : []) {
        try { track.stop(); } catch (_) {}
      }
    }
  }

  async function inspectBlobDefault(blob) {
    const documentApi = root && root.document;
    const URLApi = root && root.URL;
    if (!documentApi || typeof documentApi.createElement !== 'function' || !URLApi || typeof URLApi.createObjectURL !== 'function') {
      throw new Error('Decoded WebM metadata validation is unavailable');
    }
    const video = documentApi.createElement('video');
    const url = URLApi.createObjectURL(blob);
    try {
      return await new Promise((resolve, reject) => {
        video.preload = 'metadata';
        video.onloadedmetadata = () => resolve({ width: video.videoWidth, height: video.videoHeight, bytes: blob.size });
        video.onerror = () => reject(new Error('Unable to decode exported WebM metadata'));
        video.src = url;
      });
    } finally {
      video.removeAttribute?.('src');
      video.load?.();
      URLApi.revokeObjectURL(url);
    }
  }

  async function exportComposition(options, dependencies) {
    const opts = options || {};
    const deps = dependencies || {};
    const aspect = opts.aspect || (opts.composition && opts.composition.aspect) || '16:9';
    const dimensions = OUTPUT_DIMENSIONS[aspect];
    const fps = Number.isFinite(opts.fps) && opts.fps > 0 ? opts.fps : 30;
    const durationMs = totalDuration(opts.composition);
    const frameCount = Math.max(1, Math.ceil(durationMs * fps / 1000));
    const onState = typeof opts.onState === 'function' ? opts.onState : function () {};
    const onProgressCallback = typeof opts.onProgress === 'function' ? opts.onProgress : function () {};
    let lastProgress = -1;
    const onProgress = (value) => {
      const next = Math.max(lastProgress, Math.max(0, Math.min(1, Number(value) || 0)));
      if (next !== lastProgress) {
        lastProgress = next;
        onProgressCallback(next);
      }
    };
    const base = {
      requestedDimensions: dimensions ? { ...dimensions } : null,
      actualDimensions: null,
      mime: null,
      codecCandidate: null,
      durationMs,
      fps,
      frameCount,
      bytes: 0,
    };

    try {
      if (!dimensions) throw new RangeError(`Unsupported export aspect: ${aspect}`);
      if (!opts.composition || !Array.isArray(opts.composition.scenes) || opts.composition.scenes.length === 0) {
        throw new TypeError('A composition with at least one scene is required');
      }
      if (opts.signal && opts.signal.aborted) {
        onState('cancelled');
        return { ...base, outcome: 'cancelled', error: errorMessage(opts.signal.reason || 'Export cancelled') };
      }
      onState('probing');
      const MediaRecorderApi = deps.MediaRecorder || (root && root.MediaRecorder);
      const mime = selectWebMMime(MediaRecorderApi);
      base.mime = mime;
      base.codecCandidate = mime;
      const createCanvas = deps.createCanvas || createCanvasDefault;
      const canvas = createCanvas({ ...dimensions });
      if (!canvas || canvas.width !== dimensions.width || canvas.height !== dimensions.height) {
        throw new Error(`Canvas did not preserve requested 4K dimensions ${dimensions.width}x${dimensions.height}`);
      }
      const render = deps.renderAt || (renderer && renderer.renderAt);
      if (typeof render !== 'function') throw new Error('Deterministic renderAt is unavailable');
      onState('recording');
      const record = deps.record || ((recordOptions) => recordDefault(recordOptions, deps));
      const recording = await record({
        canvas, composition: opts.composition, aspect, fps, mime, durationMs, frameCount,
        signal: opts.signal, onProgress, renderAt: render,
      });
      if ((opts.signal && opts.signal.aborted) || (recording && recording.outcome === 'cancelled')) {
        onState('cancelled');
        return { ...base, outcome: 'cancelled', error: errorMessage(opts.signal && opts.signal.reason || 'Export cancelled') };
      }
      onState('finalizing');
      const chunks = recording && Array.isArray(recording.chunks) ? recording.chunks : [];
      const bytes = byteLength(chunks);
      if (bytes <= 0) throw new Error('WebM export produced empty data');
      const BlobApi = deps.Blob || (root && root.Blob);
      const blob = typeof BlobApi === 'function' ? new BlobApi(chunks, { type: mime }) : { size: bytes, type: mime, chunks };
      const inspectBlob = deps.inspectBlob || inspectBlobDefault;
      const inspected = await inspectBlob(blob, canvas, { mime, requestedDimensions: dimensions });
      const actualDimensions = { width: inspected && inspected.width, height: inspected && inspected.height };
      base.actualDimensions = actualDimensions;
      base.bytes = bytes;
      if (actualDimensions.width !== dimensions.width || actualDimensions.height !== dimensions.height) {
        throw new Error(`Encoded WebM dimensions ${actualDimensions.width}x${actualDimensions.height} do not match requested ${dimensions.width}x${dimensions.height}`);
      }
      onProgress(1);
      onState('completed');
      return { ...base, outcome: 'completed', blob, filename: opts.filename || `presentation-${aspect.replace(':', 'x')}-4k.webm` };
    } catch (error) {
      const cancelled = Boolean(opts.signal && opts.signal.aborted);
      onState(cancelled ? 'cancelled' : 'failed');
      return { ...base, outcome: cancelled ? 'cancelled' : 'failed', error: errorMessage(error) };
    }
  }

  return Object.freeze({ OUTPUT_DIMENSIONS, WEBM_MIME_CANDIDATES, selectWebMMime, exportComposition });
}));
