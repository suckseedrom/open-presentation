import test from 'node:test';
import assert from 'node:assert/strict';
import {
  EDITOR_PATHS, assertModule, clone, loadOptionalModule, makeComposition, makeMemoryStorage,
} from './editor-fixtures.mjs';

const model = loadOptionalModule(EDITOR_PATHS.model);

test('editor model exposes the frozen versioned canonical interface', () => {
  assertModule(assert, model, 'lib/editor-model.js');
  assert.equal(model.CURRENT_SCHEMA_VERSION, 1);
  for (const name of ['createComposition', 'validateComposition', 'migrateComposition', 'canonicalStringify', 'importComposition', 'applyCommand', 'createHistory', 'createAutosave']) {
    assert.equal(typeof model[name], 'function', `${name} must be exported`);
  }
  assert.deepEqual([...model.LAYER_TYPES], ['text', 'shape', 'image', 'group', 'product-surface']);
});

test('composition validates every layer type, aspect layout, and canonical round-trip', () => {
  assertModule(assert, model, 'lib/editor-model.js');
  const composition = makeComposition();
  assert.doesNotThrow(() => model.validateComposition(composition));
  const canonical = model.canonicalStringify(composition);
  assert.equal(canonical, model.canonicalStringify(clone(composition)));
  assert.deepEqual(JSON.parse(canonical), composition);
  assert.deepEqual(composition.scenes[0].layers.map(({ type }) => type), ['text', 'shape', 'image', 'group', 'product-surface']);
  for (const layer of composition.scenes[0].layers) {
    assert.deepEqual(Object.keys(layer.layouts), ['16:9', '9:16']);
  }
});

test('schema rejects unknown style keys and out-of-bounds geometry/timing', () => {
  assertModule(assert, model, 'lib/editor-model.js');
  const unknownStyle = makeComposition();
  unknownStyle.scenes[0].layers[0].style.position = 'fixed';
  assert.throws(() => model.validateComposition(unknownStyle), /style\.position|unknown|allowlist/i);

  const badGeometry = makeComposition();
  badGeometry.scenes[0].layers[0].layouts['9:16'].width = 1.2;
  assert.throws(() => model.validateComposition(badGeometry), /layouts\.9:16\.width|geometry|range/i);

  const badTiming = makeComposition();
  badTiming.scenes[1].layers[0].timing.endMs = 501;
  assert.throws(() => model.validateComposition(badTiming), /timing\.endMs|duration/i);
});

test('pure commands preserve inputs and update layer, order, and scene duration', () => {
  assertModule(assert, model, 'lib/editor-model.js');
  const original = makeComposition();
  const snapshot = clone(original);
  const edited = model.applyCommand(original, {
    type: 'updateLayer', sceneId: 'scene-a', layerId: 'text-a', patch: { text: 'Edited' },
  });
  assert.notEqual(edited, original);
  assert.deepEqual(original, snapshot, 'commands must never mutate caller state');
  assert.equal(edited.scenes[0].layers[0].text, 'Edited');

  const reordered = model.applyCommand(edited, {
    type: 'reorderLayer', sceneId: 'scene-a', layerId: 'text-a', toIndex: 4,
  });
  assert.equal(reordered.scenes[0].layers[4].id, 'text-a');
  const resized = model.applyCommand(reordered, {
    type: 'setSceneDuration', sceneId: 'scene-a', durationMs: 1400,
  });
  assert.equal(resized.scenes[0].durationMs, 1400);
});

test('history is immutable, bounded, grouped, suppresses no-ops, and invalidates redo', () => {
  assertModule(assert, model, 'lib/editor-model.js');
  const initial = makeComposition();
  const history = model.createHistory(initial, { limit: 2 });
  assert.equal(history.execute({ type: 'updateLayer', sceneId: 'scene-a', layerId: 'text-a', patch: { text: 'A' } }, { groupId: 'drag-1' }), true);
  history.execute({ type: 'updateLayer', sceneId: 'scene-a', layerId: 'text-a', patch: { geometry: { x: 0.2 } } }, { groupId: 'drag-1' });
  assert.equal(history.undo().scenes[0].layers[0].text, 'Launch clarity', 'one grouped gesture must undo once');
  assert.equal(history.redo().scenes[0].layers[0].text, 'A');
  assert.equal(history.execute({ type: 'updateLayer', sceneId: 'scene-a', layerId: 'text-a', patch: { text: 'A' } }), false, 'no-op is not history');
  history.undo();
  history.execute({ type: 'updateLayer', sceneId: 'scene-a', layerId: 'text-a', patch: { text: 'B' } });
  assert.equal(history.canRedo, false, 'divergent edit invalidates redo');
  history.execute({ type: 'updateLayer', sceneId: 'scene-a', layerId: 'text-a', patch: { text: 'C' } });
  history.execute({ type: 'updateLayer', sceneId: 'scene-a', layerId: 'text-a', patch: { text: 'D' } });
  assert.equal(history.undoDepth, 2, 'history must obey its configured bound');
});

test('validated import migrates v0 and rejects malformed, unsupported, unsafe, and oversized input atomically', () => {
  assertModule(assert, model, 'lib/editor-model.js');
  const prior = makeComposition();
  const priorSnapshot = clone(prior);
  const legacy = clone(prior);
  legacy.version = 0;
  delete legacy.schemaVersion;
  const migrated = model.importComposition(JSON.stringify(legacy), { maxBytes: 200_000 });
  assert.equal(migrated.schemaVersion, 1);
  assert.deepEqual(prior, priorSnapshot);

  const hostile = '{"schemaVersion":1,"__proto__":{"polluted":true}}';
  for (const [source, message] of [
    ['{', /JSON|parse|malformed/i],
    [JSON.stringify({ schemaVersion: 999, scenes: [] }), /version|unsupported/i],
    [hostile, /__proto__|unsafe/i],
    [JSON.stringify({ schemaVersion: 1, title: 'x'.repeat(5000), scenes: [] }), /size|string|limit/i],
  ]) {
    assert.throws(() => model.importComposition(source, { maxBytes: 1000, maxStringLength: 1000 }), message);
    assert.deepEqual(prior, priorSnapshot, 'failed import must not alter the last valid model');
  }
  assert.equal({}.polluted, undefined);
});

test('autosave writes canonical JSON, restores it, and reports storage failure without losing state', async () => {
  assertModule(assert, model, 'lib/editor-model.js');
  const storage = makeMemoryStorage();
  const autosave = model.createAutosave({ storage, key: 'pf-editor:v1:test', delayMs: 0 });
  const composition = makeComposition();
  await autosave.schedule(composition);
  await autosave.flush();
  assert.equal(storage.getItem('pf-editor:v1:test'), model.canonicalStringify(composition));
  assert.deepEqual(autosave.restore(), composition);

  const failure = new Error('quota');
  const broken = model.createAutosave({ storage: { getItem: () => null, setItem: () => { throw failure; } }, key: 'broken', delayMs: 0 });
  await assert.rejects(() => broken.flush(composition), /quota/);
  assert.deepEqual(composition, makeComposition());
});
