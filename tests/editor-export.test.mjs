import test from 'node:test';
import assert from 'node:assert/strict';
import { EDITOR_PATHS, assertModule, loadOptionalModule, makeComposition } from './editor-fixtures.mjs';

const renderer = loadOptionalModule(EDITOR_PATHS.renderer);
const exporter = loadOptionalModule(EDITOR_PATHS.exporter);

test('renderAt is deterministic at start, scene boundary, midpoint, and final frame', () => {
  assertModule(assert, renderer, 'lib/editor-renderer.js');
  assert.equal(typeof renderer.renderAt, 'function');
  const composition = makeComposition();
  const times = [0, 750, 1000, 1499];
  const frames = times.map((time) => renderer.renderAt(composition, time, '16:9'));
  assert.deepEqual(frames, times.map((time) => renderer.renderAt(composition, time, '16:9')));
  assert.equal(frames[0].sceneId, 'scene-a');
  assert.equal(frames[2].sceneId, 'scene-b');
  assert.equal(frames[2].localTimeMs, 0);
  assert.equal(frames[3].localTimeMs, 499);
  assert.deepEqual(frames[0].layers.map(({ id }) => id), ['text-a', 'shape-a', 'image-a', 'group-a', 'surface-a']);
});

test('renderAt uses aspect layouts and clamps the terminal boundary deterministically', () => {
  assertModule(assert, renderer, 'lib/editor-renderer.js');
  const composition = makeComposition();
  const landscape = renderer.renderAt(composition, 0, '16:9');
  const portrait = renderer.renderAt(composition, 0, '9:16');
  assert.equal(landscape.layers[0].geometry.x, 0.1);
  assert.equal(portrait.layers[0].geometry.x, 0.08);
  const terminal = renderer.renderAt(composition, 1500, '9:16');
  assert.equal(terminal.sceneId, 'scene-b');
  assert.equal(terminal.localTimeMs, 499);
  assert.equal(terminal.complete, true);
});

test('4K target map is exact and MIME probing selects the first supported WebM capability', () => {
  assertModule(assert, exporter, 'lib/editor-export.js');
  assert.deepEqual(exporter.OUTPUT_DIMENSIONS, {
    '16:9': { width: 3840, height: 2160 },
    '9:16': { width: 2160, height: 3840 },
  });
  assert.deepEqual(exporter.WEBM_MIME_CANDIDATES, [
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
  ]);
  const MediaRecorder = { isTypeSupported: (mime) => mime.includes('vp8') || mime === 'video/webm' };
  assert.equal(exporter.selectWebMMime(MediaRecorder), 'video/webm;codecs=vp8');
  assert.throws(() => exporter.selectWebMMime({ isTypeSupported: () => false }), /WebM|supported|capability/i);
});

test('export state machine reports monotonic progress and exact requested/actual metadata', async () => {
  assertModule(assert, exporter, 'lib/editor-export.js');
  const states = [];
  const progress = [];
  const cleanup = { tracks: 0, timers: 0, urls: 0 };
  const result = await exporter.exportComposition({
    composition: makeComposition(), aspect: '16:9', fps: 30,
    onState: (state) => states.push(state), onProgress: (value) => progress.push(value),
  }, makeSuccessfulExportDeps(cleanup));
  assert.deepEqual(states, ['probing', 'recording', 'finalizing', 'completed']);
  assert.ok(progress.length > 1);
  assert.ok(progress.every((value, index) => index === 0 || value >= progress[index - 1]));
  assert.equal(progress.at(-1), 1);
  assert.deepEqual(result.requestedDimensions, { width: 3840, height: 2160 });
  assert.deepEqual(result.actualDimensions, { width: 3840, height: 2160 });
  assert.equal(result.mime, 'video/webm;codecs=vp9');
  assert.equal(result.outcome, 'completed');
  assert.ok(result.bytes > 0);
  assert.deepEqual(cleanup, { tracks: 1, timers: 1, urls: 1 });
});

test('cancel, recorder error, and empty data fail closed and clean every owned resource once', async () => {
  assertModule(assert, exporter, 'lib/editor-export.js');
  for (const outcome of ['cancelled', 'recorder-error', 'empty']) {
    const cleanup = { tracks: 0, timers: 0, urls: 0 };
    const states = [];
    const controller = new AbortController();
    const deps = makeSuccessfulExportDeps(cleanup, outcome, controller);
    const result = await exporter.exportComposition({
      composition: makeComposition(), aspect: '9:16', fps: 30, signal: controller.signal,
      onState: (state) => states.push(state),
    }, deps);
    assert.equal(result.outcome, outcome === 'cancelled' ? 'cancelled' : 'failed');
    assert.notEqual(states.at(-1), 'completed');
    assert.deepEqual(cleanup, { tracks: 1, timers: 1, urls: 1 }, `${outcome} cleanup`);
  }
});

function makeSuccessfulExportDeps(cleanup, failure = null, controller = null) {
  return {
    MediaRecorder: { isTypeSupported: (mime) => mime.includes('vp9') },
    createCanvas: ({ width, height }) => ({ width, height }),
    renderAt: () => ({ sceneId: 'scene-a', layers: [] }),
    async record({ onProgress, signal }) {
      try {
        onProgress(0);
        if (signal?.aborted) return { outcome: 'cancelled', chunks: [] };
        onProgress(0.5);
        if (failure === 'cancelled') {
          controller.abort('user');
          return { outcome: 'cancelled', chunks: [] };
        }
        if (failure === 'recorder-error') throw new Error('injected recorder error');
        onProgress(0.9);
        return { chunks: failure === 'empty' ? [] : [new Uint8Array([1, 2, 3])] };
      } finally {
        cleanup.tracks += 1;
        cleanup.timers += 1;
        cleanup.urls += 1;
      }
    },
    inspectBlob: async () => ({ width: 3840, height: 2160 }),
  };
}
