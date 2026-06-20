(function (root, factory) {
  var Editor = factory();
  if (typeof module === 'object' && module.exports) module.exports = Editor;
  if (root) root.PresentationEditor = Editor;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  var uid = 0;
  function id(prefix) { uid += 1; return prefix + '-' + Date.now().toString(36) + '-' + uid; }
  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char];
    });
  }
  function isEditableTarget(target) {
    if (!target) return false;
    var tag = String(target.tagName || '').toUpperCase();
    return target.isContentEditable || target.contentEditable === 'true' || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
  }
  function download(name, contents, type) {
    var blob = contents instanceof Blob ? contents : new Blob([contents], { type: type });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.click();
    setTimeout(function () { URL.revokeObjectURL(url); }, 0);
  }

  function PresentationEditor(container, options) {
    if (!(this instanceof PresentationEditor)) return new PresentationEditor(container, options);
    if (!container || typeof container.appendChild !== 'function') throw new TypeError('PresentationEditor requires a container');
    this.options = options || {};
    this.model = this.options.model || (typeof window !== 'undefined' && window.PresentationEditorModel);
    this.renderer = this.options.renderer || (typeof window !== 'undefined' && window.PresentationEditorRenderer);
    this.exporter = this.options.exporter || (typeof window !== 'undefined' && window.PresentationEditorExport);
    if (!this.model || typeof this.model.createHistory !== 'function') throw new Error('PresentationEditorModel is required');
    this.container = container;
    this.history = this.model.createHistory(this.options.composition || this.model.createComposition());
    this.aspect = this.composition.aspect || '16:9';
    this.sceneId = this.composition.scenes[0] && this.composition.scenes[0].id;
    this.layerId = null;
    this.timeMs = 0;
    this.playing = false;
    this.exportController = null;
    this.drag = null;
    this.lastFocus = typeof document !== 'undefined' ? document.activeElement : null;
    this.autosave = this.options.autosave || (this.model.createAutosave && this.model.createAutosave({
      storage: this.options.storage || (typeof localStorage !== 'undefined' ? localStorage : null),
      key: this.options.autosaveKey || 'pf-editor:v1:composition', delayMs: 500,
    }));
    this._boundKeydown = this._onKeydown.bind(this);
    this._boundPointerMove = this._pointerMove.bind(this);
    this._boundPointerEnd = this._pointerEnd.bind(this);
    this._build();
    this._bind();
    this.render();
  }

  Object.defineProperty(PresentationEditor.prototype, 'composition', {
    get: function () { return this.history.current || this.history.value || this.history.state; },
  });

  PresentationEditor.prototype._build = function () {
    var host = document.createElement('div');
    host.className = 'pf-editor';
    host.setAttribute('role', 'dialog');
    host.setAttribute('aria-modal', 'true');
    host.setAttribute('aria-label', 'Presentation video editor');
    host.setAttribute('tabindex', '-1');
    host.innerHTML =
      '<header class="pf-editor__topbar">' +
        '<div class="pf-editor__brand"><span class="pf-editor__mark" aria-hidden="true"></span><span>Presentation Studio</span></div>' +
        '<div class="pf-editor__actions" aria-label="Edit history and file actions">' +
          '<button type="button" data-editor-action="undo" aria-label="Undo">Undo</button>' +
          '<button type="button" data-editor-action="redo" aria-label="Redo">Redo</button>' +
          '<button type="button" data-editor-action="import-json" aria-label="Import JSON">Import</button>' +
          '<input class="pf-editor__file" data-editor-input="json" type="file" accept="application/json,.json" aria-label="Choose composition JSON">' +
          '<button type="button" data-editor-action="export-json" aria-label="Export JSON">JSON</button>' +
          '<button class="pf-editor__primary" type="button" data-editor-action="export-video" aria-label="Export 4K WebM video">Export video</button>' +
          '<button type="button" data-editor-action="close" aria-label="Close editor">Close</button>' +
        '</div>' +
      '</header>' +
      '<div class="pf-editor__workspace" role="application" aria-label="Nonlinear presentation editor">' +
        '<aside class="pf-editor__panel pf-editor__scenes" data-editor-region="scene-list" aria-label="Scene list">' +
          '<div class="pf-editor__panel-title"><h2>Scenes</h2><button type="button" data-editor-action="add-scene" aria-label="Add scene">+</button></div>' +
          '<ol class="pf-editor__scene-list"></ol>' +
        '</aside>' +
        '<main class="pf-editor__stage-panel" data-editor-region="canvas" aria-label="Preview canvas">' +
          '<div class="pf-editor__canvasbar">' +
            '<div class="pf-editor__segmented" aria-label="Preview aspect ratio">' +
              '<button type="button" data-editor-action="aspect-16:9" aria-label="Landscape 16 by 9">16:9</button>' +
              '<button type="button" data-editor-action="aspect-9:16" aria-label="Portrait 9 by 16">9:16</button>' +
            '</div><span class="pf-editor__zoom">Fit</span>' +
          '</div>' +
          '<div class="pf-editor__canvas-wrap"><div class="pf-editor__artboard" tabindex="0" aria-label="Editable artboard"></div></div>' +
        '</main>' +
        '<aside class="pf-editor__panel pf-editor__right">' +
          '<section data-editor-region="layer-stack" aria-label="Layer stack">' +
            '<div class="pf-editor__panel-title"><h2>Layers</h2><button type="button" data-editor-action="add-layer" aria-label="Add text layer">+</button></div>' +
            '<ol class="pf-editor__layer-list"></ol>' +
          '</section>' +
          '<section class="pf-editor__inspector" data-editor-region="inspector" aria-label="Inspector"><div class="pf-editor__panel-title"><h2>Inspector</h2></div><div class="pf-editor__inspector-body"></div></section>' +
        '</aside>' +
        '<footer class="pf-editor__timeline" data-editor-region="timeline" aria-label="Timeline">' +
          '<button type="button" data-editor-action="play" aria-label="Play preview">Play</button>' +
          '<output class="pf-editor__time" aria-label="Current preview time">0:00.0</output>' +
          '<input data-editor-input="scrub" type="range" min="0" max="1000" value="0" aria-label="Timeline playhead">' +
          '<label>Duration <input data-editor-input="duration" type="number" min="100" step="100" aria-label="Scene duration in milliseconds"></label>' +
        '</footer>' +
      '</div>' +
      '<section class="pf-editor__export" data-editor-region="export-status" aria-label="Export status">' +
        '<progress value="0" max="1" aria-label="Video export progress"></progress>' +
        '<span data-editor-status aria-live="polite">Ready</span>' +
        '<button type="button" data-editor-action="cancel-export" aria-label="Cancel video export" hidden>Cancel</button>' +
      '</section>';
    this.el = host;
    this.container.appendChild(host);
    this.parts = {
      scenes: host.querySelector('.pf-editor__scene-list'), layers: host.querySelector('.pf-editor__layer-list'),
      inspector: host.querySelector('.pf-editor__inspector-body'), artboard: host.querySelector('.pf-editor__artboard'),
      scrub: host.querySelector('[data-editor-input="scrub"]'), duration: host.querySelector('[data-editor-input="duration"]'),
      time: host.querySelector('.pf-editor__time'), status: host.querySelector('[data-editor-status]'),
      progress: host.querySelector('progress'), file: host.querySelector('[data-editor-input="json"]'),
      cancel: host.querySelector('[data-editor-action="cancel-export"]'),
    };
  };

  PresentationEditor.prototype._bind = function () {
    this.el.addEventListener('click', this._onClick.bind(this));
    this.el.addEventListener('input', this._onInput.bind(this));
    this.el.addEventListener('change', this._onChange.bind(this));
    this.parts.artboard.addEventListener('pointerdown', this._pointerStart.bind(this));
    window.addEventListener('pointermove', this._boundPointerMove);
    window.addEventListener('pointerup', this._boundPointerEnd);
    window.addEventListener('pointercancel', this._boundPointerEnd);
    this.parts.artboard.addEventListener('lostpointercapture', this._boundPointerEnd);
    document.addEventListener('keydown', this._boundKeydown);
    requestAnimationFrame(function () { this.el.focus(); }.bind(this));
  };

  PresentationEditor.prototype._scene = function () {
    return this.composition.scenes.find(function (scene) { return scene.id === this.sceneId; }.bind(this)) || this.composition.scenes[0];
  };
  PresentationEditor.prototype._layer = function () {
    var scene = this._scene();
    return scene && scene.layers.find(function (layer) { return layer.id === this.layerId; }.bind(this));
  };
  PresentationEditor.prototype._execute = function (command, meta) {
    var changed = this.history.execute(command, meta);
    if (changed) {
      this._status('Saving…');
      if (this.autosave) Promise.resolve(this.autosave.schedule(this.composition)).then(function () { this._status('All changes saved'); }.bind(this), function (error) { this._status('Autosave failed: ' + error.message, true); }.bind(this));
      if (!meta || meta.render !== false) this.render();
    }
    return changed;
  };

  PresentationEditor.prototype._onClick = function (event) {
    var actionNode = event.target.closest('[data-editor-action]');
    var sceneNode = event.target.closest('[data-scene-id]');
    var layerNode = event.target.closest('[data-layer-id]');
    if (sceneNode && !actionNode) { this.sceneId = sceneNode.dataset.sceneId; this.layerId = null; this.timeMs = this._sceneStart(this.sceneId); this.render(); return; }
    if (layerNode && !actionNode) { this.layerId = layerNode.dataset.layerId; this.render(); return; }
    if (!actionNode) return;
    var action = actionNode.dataset.editorAction;
    if (action === 'undo' && this.history.canUndo) { this.history.undo(); this.render(); }
    else if (action === 'redo' && this.history.canRedo) { this.history.redo(); this.render(); }
    else if (action === 'import-json') this.parts.file.click();
    else if (action === 'export-json') download((this.composition.title || 'presentation') + '.json', this.model.canonicalStringify(this.composition), 'application/json');
    else if (action === 'export-video') this._exportVideo();
    else if (action === 'cancel-export' && this.exportController) this.exportController.abort('user');
    else if (action === 'aspect-16:9' || action === 'aspect-9:16') { this.aspect = action.slice(7); this.render(); }
    else if (action === 'play') this._togglePlayback();
    else if (action === 'close') this.close();
    else if (action === 'add-scene') this._addScene();
    else if (action === 'duplicate-scene') this._duplicateScene(actionNode.dataset.sceneId);
    else if (action === 'delete-scene') this._deleteScene(actionNode.dataset.sceneId);
    else if (action === 'scene-up' || action === 'scene-down') this._reorderScene(actionNode.dataset.sceneId, action === 'scene-up' ? -1 : 1);
    else if (action === 'add-layer') this._addLayer();
    else if (action === 'delete-layer') this._deleteLayer(actionNode.dataset.layerId || this.layerId);
    else if (action === 'layer-up' || action === 'layer-down') this._reorderLayer(actionNode.dataset.layerId, action === 'layer-up' ? -1 : 1);
    else if (action === 'toggle-layer') this._execute({ type: 'updateLayer', sceneId: this.sceneId, layerId: actionNode.dataset.layerId, patch: { visible: actionNode.getAttribute('aria-pressed') === 'true' ? false : true } });
  };

  PresentationEditor.prototype._onInput = function (event) {
    var input = event.target;
    if (input === this.parts.scrub) { this.timeMs = Number(input.value); this._renderCanvas(); return; }
    if (input === this.parts.duration) return;
    var field = input.dataset.field;
    var layer = this._layer();
    if (!field || !layer) return;
    var patch = {};
    if (field === 'text') patch.text = input.value;
    else {
      patch.style = Object.assign({}, layer.style);
      patch.style[field] = field === 'fontSize' || field === 'opacity' ? Number(input.value) : input.value;
    }
    this._execute({ type: 'updateLayer', sceneId: this.sceneId, layerId: layer.id, patch: patch }, { groupId: 'inspector-' + field });
  };

  PresentationEditor.prototype._onChange = function (event) {
    if (event.target === this.parts.duration) {
      this._execute({ type: 'setSceneDuration', sceneId: this.sceneId, durationMs: Number(event.target.value) });
    } else if (event.target === this.parts.file && event.target.files[0]) {
      var file = event.target.files[0];
      file.text().then(function (source) {
        var imported = this.model.importComposition(source);
        this.history = this.model.createHistory(imported);
        this.sceneId = imported.scenes[0] && imported.scenes[0].id;
        this.layerId = null;
        this._status('JSON imported'); this.render();
      }.bind(this)).catch(function (error) { this._status('Import failed: ' + error.message, true); }.bind(this));
      event.target.value = '';
    }
  };

  PresentationEditor.prototype._addScene = function () {
    var scene = { id: id('scene'), name: 'Untitled scene', durationMs: 3000, background: '#111216', layers: [] };
    if (this._execute({ type: 'addScene', scene: scene })) { this.sceneId = scene.id; this.layerId = null; this.render(); }
  };
  PresentationEditor.prototype._deleteScene = function (sceneId) {
    if (this.composition.scenes.length < 2) return this._status('A composition needs at least one scene', true);
    if (this._execute({ type: 'deleteScene', sceneId: sceneId })) { this.sceneId = this.composition.scenes[0].id; this.layerId = null; this.render(); }
  };
  PresentationEditor.prototype._duplicateScene = function (sceneId) {
    var sourceIndex = this.composition.scenes.findIndex(function (scene) { return scene.id === sceneId; });
    if (sourceIndex < 0) return;
    var source = this.composition.scenes[sourceIndex];
    var copy = JSON.parse(JSON.stringify(source));
    var remap = Object.create(null);
    copy.id = id('scene');
    copy.name = source.name + ' copy';
    copy.layers.forEach(function (layer) { var next = id(layer.type || 'layer'); remap[layer.id] = next; layer.id = next; });
    copy.layers.forEach(function (layer) {
      if (Array.isArray(layer.childIds)) layer.childIds = layer.childIds.map(function (childId) { return remap[childId] || childId; });
    });
    if (this._execute({ type: 'addScene', scene: copy, toIndex: sourceIndex + 1 })) { this.sceneId = copy.id; this.layerId = null; this.render(); }
  };
  PresentationEditor.prototype._reorderScene = function (sceneId, delta) {
    var index = this.composition.scenes.findIndex(function (scene) { return scene.id === sceneId; });
    this._execute({ type: 'reorderScene', sceneId: sceneId, toIndex: clamp(index + delta, 0, this.composition.scenes.length - 1) });
  };
  PresentationEditor.prototype._addLayer = function () {
    var layerId = id('text');
    var geometry = { x: 0.2, y: 0.4, width: 0.6, height: 0.14, rotation: 0 };
    var layer = { id: layerId, type: 'text', name: 'Text', visible: true, locked: false, z: this._scene().layers.length, text: 'New text', geometry: geometry,
      layouts: { '16:9': Object.assign({}, geometry), '9:16': Object.assign({}, geometry) }, timing: { startMs: 0, endMs: this._scene().durationMs, enterMs: 150, exitMs: 150, easing: 'ease-out' },
      style: { color: '#ffffff', fontSize: 64, fontWeight: 700, fontFamily: 'sans-serif', align: 'center', opacity: 1 } };
    if (this._execute({ type: 'addLayer', sceneId: this.sceneId, layer: layer })) { this.layerId = layerId; this.render(); }
  };
  PresentationEditor.prototype._deleteLayer = function (layerId) {
    if (layerId && this._execute({ type: 'deleteLayer', sceneId: this.sceneId, layerId: layerId })) { this.layerId = null; this.render(); }
  };
  PresentationEditor.prototype._reorderLayer = function (layerId, delta) {
    var layers = this._scene().layers;
    var index = layers.findIndex(function (layer) { return layer.id === layerId; });
    this._execute({ type: 'reorderLayer', sceneId: this.sceneId, layerId: layerId, toIndex: clamp(index + delta, 0, layers.length - 1) });
  };

  PresentationEditor.prototype._pointerStart = function (event) {
    var node = event.target.closest('[data-canvas-layer]');
    if (!node) return;
    this.layerId = node.dataset.canvasLayer;
    var layer = this._layer();
    if (!layer || layer.locked) return;
    var mode = event.target.dataset.resizeHandle ? 'resize' : 'move';
    event.preventDefault();
    var canvasLayers = this.parts.artboard.querySelectorAll('[data-canvas-layer]');
    for (var i = 0; i < canvasLayers.length; i += 1) canvasLayers[i].classList.toggle('is-selected', canvasLayers[i] === node);
    this.drag = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, geometry: Object.assign({}, layer.layouts[this.aspect] || layer.geometry), mode: mode, groupId: id('gesture'), node: node };
    if (typeof this.parts.artboard.setPointerCapture === 'function') {
      try { this.parts.artboard.setPointerCapture(event.pointerId); } catch (_) {}
    }
  };
  PresentationEditor.prototype._pointerMove = function (event) {
    if (!this.drag || event.pointerId !== this.drag.pointerId) return;
    var rect = this.parts.artboard.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    event.preventDefault();
    var dx = (event.clientX - this.drag.x) / rect.width;
    var dy = (event.clientY - this.drag.y) / rect.height;
    var g = Object.assign({}, this.drag.geometry);
    if (this.drag.mode === 'resize') { g.width = clamp(g.width + dx, 0.04, 1 - g.x); g.height = clamp(g.height + dy, 0.04, 1 - g.y); }
    else { g.x = clamp(g.x + dx, 0, 1 - g.width); g.y = clamp(g.y + dy, 0, 1 - g.height); }
    var layer = this._layer();
    if (!layer) return;
    var layouts = Object.assign({}, layer.layouts); layouts[this.aspect] = g;
    if (this._execute({ type: 'updateLayer', sceneId: this.sceneId, layerId: layer.id, patch: { layouts: layouts } }, { groupId: this.drag.groupId, render: false })) {
      this._applyGeometryToNode(this.drag.node, g);
    }
  };
  PresentationEditor.prototype._pointerEnd = function (event) {
    if (!this.drag || (event.pointerId && event.pointerId !== this.drag.pointerId)) return;
    var drag = this.drag;
    this.drag = null;
    var artboard = this.parts.artboard;
    if (event.type !== 'lostpointercapture' && typeof artboard.hasPointerCapture === 'function' && artboard.hasPointerCapture(drag.pointerId)) {
      try { artboard.releasePointerCapture(drag.pointerId); } catch (_) {}
    }
    this.render();
    var selected = this._canvasLayerNode(this.layerId);
    if (selected && typeof selected.focus === 'function') {
      try { selected.focus({ preventScroll: true }); } catch (_) { selected.focus(); }
    }
  };

  PresentationEditor.prototype._canvasLayerNode = function (layerId) {
    var nodes = this.parts.artboard.querySelectorAll('[data-canvas-layer]');
    for (var i = 0; i < nodes.length; i += 1) {
      if (nodes[i].dataset.canvasLayer === layerId) return nodes[i];
    }
    return null;
  };

  PresentationEditor.prototype._applyGeometryToNode = function (node, geometry) {
    if (!node || !geometry) return;
    node.style.left = (geometry.x * 100) + '%';
    node.style.top = (geometry.y * 100) + '%';
    node.style.width = (geometry.width * 100) + '%';
    node.style.height = (geometry.height * 100) + '%';
  };

  PresentationEditor.prototype._onKeydown = function (event) {
    var editable = isEditableTarget(event.target);
    var key = event.code || event.key;
    var mod = event.metaKey || event.ctrlKey;
    if (mod && (key === 'KeyZ' || String(event.key).toLowerCase() === 'z')) {
      if (editable) return;
      event.preventDefault();
      if (event.shiftKey) { if (this.history.canRedo) this.history.redo(); }
      else if (this.history.canUndo) this.history.undo();
      this.render(); return;
    }
    if (mod && (key === 'KeyY' || String(event.key).toLowerCase() === 'y')) { if (!editable && this.history.canRedo) { event.preventDefault(); this.history.redo(); this.render(); } return; }
    if (editable) { if (key === 'Escape') { event.target.blur(); this.el.focus(); } return; }
    if (key === 'Escape') { event.preventDefault(); if (this.playing) this._stopPlayback(); else this.close(); return; }
    if (key === 'Delete' || key === 'Backspace') { if (this.layerId) { event.preventDefault(); this._deleteLayer(this.layerId); } return; }
    if (key === 'Enter' && this.layerId) { var text = this.el.querySelector('[data-field="text"]'); if (text) { event.preventDefault(); text.focus(); text.select(); } return; }
    if (key === 'Space' || event.key === ' ') { event.preventDefault(); this._togglePlayback(); return; }
    if (/^Arrow(Left|Right|Up|Down)$/.test(key) && this.layerId) {
      event.preventDefault(); var amount = event.shiftKey ? 0.05 : 0.01; var layer = this._layer(); var g = Object.assign({}, layer.layouts[this.aspect] || layer.geometry);
      if (key === 'ArrowLeft') g.x -= amount; if (key === 'ArrowRight') g.x += amount; if (key === 'ArrowUp') g.y -= amount; if (key === 'ArrowDown') g.y += amount;
      g.x = clamp(g.x, 0, 1 - g.width); g.y = clamp(g.y, 0, 1 - g.height);
      var layouts = Object.assign({}, layer.layouts); layouts[this.aspect] = g;
      this._execute({ type: 'updateLayer', sceneId: this.sceneId, layerId: layer.id, patch: { layouts: layouts } });
    }
  };

  PresentationEditor.prototype._sceneStart = function (sceneId) {
    var total = 0; for (var i = 0; i < this.composition.scenes.length; i += 1) { if (this.composition.scenes[i].id === sceneId) break; total += this.composition.scenes[i].durationMs; } return total;
  };
  PresentationEditor.prototype._totalDuration = function () { return this.composition.scenes.reduce(function (sum, scene) { return sum + scene.durationMs; }, 0); };
  PresentationEditor.prototype._togglePlayback = function () { if (this.playing) this._stopPlayback(); else { this.playing = true; this._playStarted = performance.now() - this.timeMs; this._tick(); this.render(); } };
  PresentationEditor.prototype._tick = function () { if (!this.playing) return; this.timeMs = performance.now() - this._playStarted; if (this.timeMs >= this._totalDuration()) { this.timeMs = 0; this._playStarted = performance.now(); } this._renderCanvas(); this._raf = requestAnimationFrame(this._tick.bind(this)); };
  PresentationEditor.prototype._stopPlayback = function () { this.playing = false; cancelAnimationFrame(this._raf); this.render(); };

  PresentationEditor.prototype._exportVideo = function () {
    if (!this.exporter || typeof this.exporter.exportComposition !== 'function') return this._status('Video export is unavailable', true);
    this.exportController = new AbortController(); this.parts.cancel.hidden = false; this.parts.progress.value = 0;
    this._status('Preparing 4K WebM…');
    Promise.resolve(this.exporter.exportComposition({ composition: this.composition, aspect: this.aspect, fps: this.composition.fps || 30, signal: this.exportController.signal,
      onProgress: function (value) { this.parts.progress.value = value; this._status('Exporting ' + Math.round(value * 100) + '%'); }.bind(this),
      onState: function (state) { this.el.dataset.exportState = state; }.bind(this) }, this.options.exportDependencies)).then(function (result) {
        if (result.outcome === 'completed') { if (result.blob) download((this.composition.title || 'presentation') + '-4k.webm', result.blob, result.mime || 'video/webm'); this._status('4K WebM complete'); }
        else this._status(result.outcome === 'cancelled' ? 'Export cancelled' : 'Export failed: ' + (result.error || 'unknown error'), result.outcome !== 'cancelled');
      }.bind(this)).catch(function (error) { this._status('Export failed: ' + error.message, true); }.bind(this)).finally(function () { this.exportController = null; this.parts.cancel.hidden = true; }.bind(this));
  };

  PresentationEditor.prototype._status = function (message, error) { this.parts.status.textContent = message; this.parts.status.setAttribute('role', error ? 'alert' : 'status'); };
  PresentationEditor.prototype._formatTime = function (ms) { return Math.floor(ms / 60000) + ':' + String(Math.floor(ms / 1000) % 60).padStart(2, '0') + '.' + Math.floor(ms % 1000 / 100); };

  PresentationEditor.prototype.render = function () {
    var scene = this._scene(); if (!scene) return;
    this.parts.scenes.innerHTML = this.composition.scenes.map(function (item, index) {
      return '<li data-scene-id="' + esc(item.id) + '" class="' + (item.id === this.sceneId ? 'is-selected' : '') + '"><button class="pf-editor__scene-card" type="button" aria-label="Select scene ' + esc(item.name) + '"><span>' + (index + 1) + '</span><strong>' + esc(item.name) + '</strong><small>' + (item.durationMs / 1000).toFixed(1) + 's</small></button><div class="pf-editor__row-actions"><button type="button" data-editor-action="scene-up" data-scene-id="' + esc(item.id) + '" aria-label="Move scene up">↑</button><button type="button" data-editor-action="scene-down" data-scene-id="' + esc(item.id) + '" aria-label="Move scene down">↓</button><button type="button" data-editor-action="duplicate-scene" data-scene-id="' + esc(item.id) + '" aria-label="Duplicate scene">⧉</button><button type="button" data-editor-action="delete-scene" data-scene-id="' + esc(item.id) + '" aria-label="Delete scene">×</button></div></li>';
    }.bind(this)).join('');
    this.parts.layers.innerHTML = scene.layers.slice().reverse().map(function (layer) {
      return '<li data-layer-id="' + esc(layer.id) + '" class="' + (layer.id === this.layerId ? 'is-selected' : '') + '"><button type="button" data-editor-action="toggle-layer" data-layer-id="' + esc(layer.id) + '" aria-label="Toggle ' + esc(layer.name) + ' visibility" aria-pressed="' + !!layer.visible + '">' + (layer.visible ? '●' : '○') + '</button><button class="pf-editor__layer-name" type="button" aria-label="Select layer ' + esc(layer.name) + '">' + esc(layer.name) + '</button><button type="button" data-editor-action="layer-up" data-layer-id="' + esc(layer.id) + '" aria-label="Move layer up">↑</button><button type="button" data-editor-action="layer-down" data-layer-id="' + esc(layer.id) + '" aria-label="Move layer down">↓</button><button type="button" data-editor-action="delete-layer" data-layer-id="' + esc(layer.id) + '" aria-label="Delete layer">×</button></li>';
    }.bind(this)).join('');
    var layer = this._layer();
    this.parts.inspector.innerHTML = !layer ? '<p class="pf-editor__empty">Select a layer to edit its properties.</p>' :
      '<label>Name<input value="' + esc(layer.name) + '" disabled></label>' + (layer.type === 'text' ? '<label>Text<textarea data-field="text" rows="3">' + esc(layer.text) + '</textarea></label><div class="pf-editor__field-grid"><label>Size<input data-field="fontSize" type="number" min="8" max="400" value="' + esc(layer.style.fontSize) + '"></label><label>Color<input data-field="color" type="color" value="' + esc(layer.style.color) + '"></label></div><label>Alignment<select data-field="align"><option' + (layer.style.align === 'left' ? ' selected' : '') + '>left</option><option' + (layer.style.align === 'center' ? ' selected' : '') + '>center</option><option' + (layer.style.align === 'right' ? ' selected' : '') + '>right</option></select></label>' : '') + '<label>Opacity<input data-field="opacity" type="range" min="0" max="1" step="0.05" value="' + esc(layer.style.opacity) + '"></label>';
    this.parts.duration.value = scene.durationMs;
    var total = this._totalDuration(); this.parts.scrub.max = Math.max(0, total - 1); this.parts.scrub.value = clamp(this.timeMs, 0, Math.max(0, total - 1));
    this.parts.time.value = this._formatTime(this.timeMs); this.parts.time.textContent = this.parts.time.value;
    this.el.querySelector('[data-editor-action="undo"]').disabled = !this.history.canUndo;
    this.el.querySelector('[data-editor-action="redo"]').disabled = !this.history.canRedo;
    this.el.querySelector('[data-editor-action="play"]').textContent = this.playing ? 'Pause' : 'Play';
    this.el.querySelectorAll('[data-editor-action^="aspect-"]').forEach(function (button) { button.setAttribute('aria-pressed', String(button.dataset.editorAction.slice(7) === this.aspect)); }.bind(this));
    this._renderCanvas();
  };

  PresentationEditor.prototype._renderCanvas = function () {
    this.parts.artboard.dataset.aspect = this.aspect;
    var scene = this._scene();
    var layers = scene.layers.filter(function (layer) { return layer.visible; });
    if (this.renderer && typeof this.renderer.renderAt === 'function' && this.playing) {
      var frame = this.renderer.renderAt(this.composition, this.timeMs, this.aspect); scene = this.composition.scenes.find(function (item) { return item.id === frame.sceneId; }) || scene; layers = frame.layers;
    }
    this.parts.artboard.style.background = scene.background || '#0b0c10';
    this.parts.artboard.innerHTML = layers.map(function (layer) {
      var g = (layer.layouts && layer.layouts[this.aspect]) || layer.geometry; if (!g) return '';
      var style = 'left:' + (g.x * 100) + '%;top:' + (g.y * 100) + '%;width:' + (g.width * 100) + '%;height:' + (g.height * 100) + '%;opacity:' + (layer.style.opacity == null ? 1 : layer.style.opacity) + ';transform:rotate(' + (g.rotation || 0) + 'deg);';
      var content = layer.type === 'text' ? esc(layer.text) : layer.type === 'image' ? '<img src="' + esc(layer.src) + '" alt="' + esc(layer.alt || '') + '">' : '<span>' + esc(layer.surface && layer.surface.label || layer.name) + '</span>';
      var textStyle = layer.type === 'text' ? 'color:' + esc(layer.style.color) + ';font-size:clamp(10px,' + (layer.style.fontSize / 14) + 'vw,96px);font-weight:' + esc(layer.style.fontWeight) + ';text-align:' + esc(layer.style.align) + ';' : '';
      return '<div class="pf-editor__canvas-layer ' + (layer.id === this.layerId ? 'is-selected' : '') + '" data-canvas-layer="' + esc(layer.id) + '" style="' + style + textStyle + '" tabindex="0" aria-label="' + esc(layer.name) + '">' + content + (layer.id === this.layerId ? '<button class="pf-editor__resize" data-resize-handle="se" aria-label="Resize selected layer"></button>' : '') + '</div>';
    }.bind(this)).join('');
    this.parts.scrub.value = clamp(this.timeMs, 0, Number(this.parts.scrub.max)); this.parts.time.textContent = this._formatTime(this.timeMs);
  };

  PresentationEditor.prototype.close = function () {
    if (this.playing) this._stopPlayback();
    if (this.exportController) this.exportController.abort('editor closed');
    document.removeEventListener('keydown', this._boundKeydown);
    window.removeEventListener('pointermove', this._boundPointerMove);
    window.removeEventListener('pointerup', this._boundPointerEnd);
    window.removeEventListener('pointercancel', this._boundPointerEnd);
    this.el.remove();
    if (this.lastFocus && typeof this.lastFocus.focus === 'function') this.lastFocus.focus();
    if (typeof this.options.onClose === 'function') this.options.onClose(this.composition);
  };
  PresentationEditor.prototype.destroy = PresentationEditor.prototype.close;
  PresentationEditor.isEditableTarget = isEditableTarget;
  return PresentationEditor;
});
