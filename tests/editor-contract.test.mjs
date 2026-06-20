import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { EDITOR_PATHS, ROOT, installFakeDom, loadOptionalModule, makeComposition, readOptional, require } from './editor-fixtures.mjs';

const editorJs = readOptional(EDITOR_PATHS.editor);
const editorCss = readOptional(EDITOR_PATHS.editorCss);
const playerJs = fs.readFileSync(path.join(ROOT, 'lib/player.js'), 'utf8');

test('editor shell exposes semantic named regions, actions, timeline, and live status hooks', () => {
  assert.ok(editorJs, 'lib/editor.js must exist');
  for (const hook of ['scene-list', 'canvas', 'layer-stack', 'inspector', 'timeline', 'export-status']) {
    assert.match(editorJs, new RegExp(`data-editor-region=["']${hook}["']`), `missing named ${hook} region`);
  }
  for (const action of ['undo', 'redo', 'import-json', 'export-json', 'export-video', 'cancel-export', 'aspect-16:9', 'aspect-9:16']) {
    assert.match(editorJs, new RegExp(`data-editor-action=["']${action}["']`), `missing ${action} action`);
  }
  assert.match(editorJs, /aria-live=["'](?:polite|assertive)["']/);
  assert.match(editorJs, /role=["'](?:dialog|application)["']/);
  assert.match(editorJs, /aria-label=["'][^"']+["']/);
});

test('keyboard command map guards editable targets and covers NLE operations', () => {
  assert.ok(editorJs, 'lib/editor.js must exist');
  assert.match(editorJs, /isEditableTarget/);
  assert.match(editorJs, /contentEditable|isContentEditable|INPUT|TEXTAREA|SELECT/);
  assert.match(editorJs, /(?:metaKey|ctrlKey)[\s\S]{0,180}(?:KeyZ|['"]z['"])/i);
  assert.match(editorJs, /(?:KeyY|['"]y['"])/i);
  assert.match(editorJs, /Delete/);
  assert.match(editorJs, /Arrow(?:Left|Right|Up|Down)/);
  assert.match(editorJs, /shiftKey/);
  assert.match(editorJs, /Enter/);
  assert.match(editorJs, /Escape/);
  assert.match(editorJs, /(?:Space|['"] ['"])/);
});

test('canvas pointer gestures keep a stable capture target and commit one undoable geometry change', () => {
  const PresentationEditor = loadOptionalModule(EDITOR_PATHS.editor);
  const model = loadOptionalModule(EDITOR_PATHS.model);

  function makeGesture(mode) {
    const node = {
      dataset: { canvasLayer: 'text-a' },
      classList: { toggle() {} },
      style: {},
      focus() {},
    };
    let captured = null;
    let renderCount = 0;
    const artboard = {
      querySelectorAll: () => [node],
      getBoundingClientRect: () => ({ width: 1000, height: 500 }),
      setPointerCapture: (pointerId) => { captured = pointerId; },
      hasPointerCapture: (pointerId) => captured === pointerId,
      releasePointerCapture: () => { captured = null; },
    };
    const editor = Object.create(PresentationEditor.prototype);
    editor.history = model.createHistory(makeComposition());
    editor.sceneId = 'scene-a';
    editor.layerId = null;
    editor.aspect = '16:9';
    editor.autosave = null;
    editor.parts = { artboard };
    editor._status = () => {};
    editor.render = () => { renderCount += 1; };
    const target = {
      dataset: mode === 'resize' ? { resizeHandle: 'se' } : {},
      closest: () => node,
    };
    const start = { target, pointerId: 7, clientX: 100, clientY: 100, preventDefault() {} };
    const move = { pointerId: 7, clientX: 200, clientY: 150, preventDefault() {} };

    editor._pointerStart(start);
    assert.equal(captured, 7, `${mode} captures on the stable artboard`);
    assert.equal(renderCount, 0, `${mode} does not replace the captured layer at pointerdown`);
    editor._pointerMove(move);
    editor._pointerMove({ pointerId: 7, clientX: 250, clientY: 150, preventDefault() {} });
    assert.equal(renderCount, 0, `${mode} updates live geometry without a full render`);
    editor._pointerEnd({ type: 'pointerup', pointerId: 7 });
    assert.equal(renderCount, 1, `${mode} performs one synchronizing render at pointerup`);
    assert.equal(captured, null, `${mode} releases pointer capture`);
    return { editor, node };
  }

  const moved = makeGesture('move');
  assert.equal(moved.editor.composition.scenes[0].layers[0].layouts['16:9'].x, 0.25);
  assert.equal(moved.editor.composition.scenes[0].layers[0].layouts['16:9'].y, 0.2);
  assert.equal(moved.node.style.left, '25%');
  assert.equal(moved.editor.history.undoDepth, 1);
  moved.editor.history.undo();
  assert.equal(moved.editor.composition.scenes[0].layers[0].layouts['16:9'].x, 0.1);

  const resized = makeGesture('resize');
  assert.equal(resized.editor.composition.scenes[0].layers[0].layouts['16:9'].width, 0.55);
  assert.ok(Math.abs(resized.editor.composition.scenes[0].layers[0].layouts['16:9'].height - 0.3) < Number.EPSILON);
  assert.ok(Math.abs(Number.parseFloat(resized.node.style.width) - 55) < Number.EPSILON * 100);
  assert.equal(resized.editor.history.undoDepth, 1);
});

test('editor styling is scoped, focus-visible, reduced-motion aware, and mobile-safe', () => {
  assert.ok(editorCss, 'lib/editor.css must exist');
  assert.match(editorCss, /\.pf-editor\s*\{/);
  assert.match(editorCss, /--pf-editor-/);
  assert.match(editorCss, /\.pf-editor[^\n{]*:focus-visible|\.pf-editor[\s\S]{0,100}:focus-visible/);
  assert.match(editorCss, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(editorCss, /@media\s*\(max-width:\s*(?:7\d\d|8\d\d)px\)/);
  assert.doesNotMatch(editorCss, /(^|\})\s*(?:button|input|body|html|\.pf-pill|\.pf-stage)\s*\{/m, 'editor CSS must not globally restyle player/document selectors');
});

test('player Editor bridge is opt-in and preserves browser/CommonJS compatibility', () => {
  assert.match(playerJs, /window\.PresentationPlayer\s*=\s*PresentationPlayer/);
  assert.match(playerJs, /module\.exports\s*=\s*PresentationPlayer/);
  assert.match(playerJs, /opts\.onEdit/);
  assert.match(playerJs, /typeof\s+opts\.onEdit\s*===\s*['"]function['"]/);
  assert.match(playerJs, /aria-label['"],\s*['"]Editor['"]|makeBtn\(['"]Editor['"]/);
  assert.match(playerJs, /this\._onEdit\(\)/);
});

test('player bridge adds exactly one Editor action only when configured', () => {
  const editorLabelOccurrences = playerJs.match(/makeBtn\(['"]Editor['"]/g) || [];
  assert.equal(editorLabelOccurrences.length, 1, 'transport source must define exactly one Editor action');
  assert.match(playerJs, /if\s*\(this\._onEdit\)/, 'Editor action must be conditional');
  assert.doesNotMatch(playerJs, /(?:require|import)[^\n]*editor/i, 'player must not import or auto-open the editor');
});

test('player bridge behavior is absent by default and invokes one configured action without changing playback', () => {
  const fake = installFakeDom();
  let activePlayer = null;
  try {
    const playerPath = path.join(ROOT, 'lib/player.js');
    delete require.cache[playerPath];
    const PresentationPlayer = require(playerPath);
    const baseline = activePlayer = new PresentationPlayer(fake.container, { scenes: [{ id: 'one', html: 'One' }] });
    assert.equal(fake.container.findByLabel('Editor').length, 0, 'default transport remains unchanged');
    baseline.destroy();
    activePlayer = null;

    let edits = 0;
    const configured = activePlayer = new PresentationPlayer(fake.container, {
      scenes: [{ id: 'one', html: 'One' }],
      onEdit: () => { edits += 1; },
    });
    const buttons = fake.container.findByLabel('Editor');
    assert.equal(buttons.length, 1, 'configured transport adds exactly one Editor action');
    const wasPlaying = configured.isPlaying;
    buttons[0].click();
    assert.equal(edits, 1);
    assert.equal(configured.isPlaying, wasPlaying, 'opening the editor does not alter playback state');
    configured.destroy();
    activePlayer = null;
    assert.equal(fake.container.findByLabel('Editor').length, 0);
  } finally {
    activePlayer?.destroy();
    fake.restore();
  }
});
