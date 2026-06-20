(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.PresentationEditorModel = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var CURRENT_SCHEMA_VERSION = 1;
  var LAYER_TYPES = Object.freeze(['text', 'shape', 'image', 'group', 'product-surface']);
  var ASPECTS = Object.freeze(['16:9', '9:16']);
  var UNSAFE_KEYS = Object.freeze(['__proto__', 'prototype', 'constructor']);
  var DEFAULT_LIMITS = Object.freeze({
    maxBytes: 1024 * 1024,
    maxDepth: 24,
    maxScenes: 100,
    maxLayersPerScene: 500,
    maxTotalLayers: 2000,
    maxStringLength: 4096,
    maxArrayLength: 2000
  });
  var idCounter = 0;

  function fail(path, message) {
    var error = new TypeError((path || '$') + ': ' + message);
    error.name = 'CompositionValidationError';
    error.path = path || '$';
    throw error;
  }

  function isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  function ownKeys(value) {
    return Object.keys(value);
  }

  function mergeLimits(options) {
    var limits = {};
    ownKeys(DEFAULT_LIMITS).forEach(function (key) {
      var value = options && options[key];
      limits[key] = Number.isFinite(value) && value >= 0 ? value : DEFAULT_LIMITS[key];
    });
    return limits;
  }

  function scan(value, limits, path, depth, state) {
    if (depth > limits.maxDepth) fail(path, 'maximum depth limit exceeded');
    if (typeof value === 'string') {
      if (value.length > limits.maxStringLength) fail(path, 'string length limit exceeded');
      return;
    }
    if (value === null || typeof value === 'boolean' || typeof value === 'number') return;
    if (typeof value !== 'object') fail(path, 'unsupported value type');
    if (Array.isArray(value)) {
      if (value.length > limits.maxArrayLength) fail(path, 'array count limit exceeded');
      value.forEach(function (item, index) { scan(item, limits, path + '[' + index + ']', depth + 1, state); });
      return;
    }
    var prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) fail(path, 'unsafe object prototype is not allowed');
    ownKeys(value).forEach(function (key) {
      if (UNSAFE_KEYS.indexOf(key) !== -1) fail(path + '.' + key, 'unsafe key is not allowed');
      scan(value[key], limits, path + '.' + key, depth + 1, state);
    });
  }

  function clone(value) {
    if (Array.isArray(value)) return value.map(clone);
    if (isObject(value)) {
      var output = Object.create(null);
      ownKeys(value).forEach(function (key) { output[key] = clone(value[key]); });
      return output;
    }
    return value;
  }

  function plainClone(value) {
    if (Array.isArray(value)) return value.map(plainClone);
    if (isObject(value)) {
      var output = {};
      ownKeys(value).forEach(function (key) { output[key] = plainClone(value[key]); });
      return output;
    }
    return value;
  }

  function assertObject(value, path) {
    if (!isObject(value)) fail(path, 'must be an object');
  }

  function allowKeys(value, allowed, path) {
    ownKeys(value).forEach(function (key) {
      if (allowed.indexOf(key) === -1) fail(path + '.' + key, 'unknown key; expected allowlist');
    });
  }

  function stringValue(value, path, options) {
    if (typeof value !== 'string') fail(path, 'must be a string');
    if (options && options.nonempty && !value.trim()) fail(path, 'must not be empty');
    if (options && options.pattern && !options.pattern.test(value)) fail(path, 'has an invalid format');
  }

  function numberValue(value, path, min, max, integer) {
    if (typeof value !== 'number' || !Number.isFinite(value)) fail(path, 'must be a finite number');
    if (integer && !Number.isInteger(value)) fail(path, 'must be an integer');
    if (value < min || value > max) fail(path, 'is outside the allowed range');
  }

  function booleanValue(value, path) {
    if (typeof value !== 'boolean') fail(path, 'must be a boolean');
  }

  function enumValue(value, values, path) {
    if (values.indexOf(value) === -1) fail(path, 'must be one of: ' + values.join(', '));
  }

  function colorValue(value, path) {
    stringValue(value, path);
    if (!/^#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?$/.test(value)) fail(path, 'must be a hex color');
  }

  function validateGeometry(value, path) {
    assertObject(value, path);
    allowKeys(value, ['x', 'y', 'width', 'height', 'rotation'], path);
    ['x', 'y', 'width', 'height', 'rotation'].forEach(function (key) {
      if (!Object.prototype.hasOwnProperty.call(value, key)) fail(path + '.' + key, 'is required');
    });
    numberValue(value.x, path + '.x', 0, 1);
    numberValue(value.y, path + '.y', 0, 1);
    numberValue(value.width, path + '.width', 0.001, 1);
    numberValue(value.height, path + '.height', 0.001, 1);
    if (value.x + value.width > 1.000001 || value.y + value.height > 1.000001) fail(path, 'geometry must remain within the artboard');
    numberValue(value.rotation, path + '.rotation', -360, 360);
  }

  function validateTiming(value, path, durationMs) {
    assertObject(value, path);
    allowKeys(value, ['startMs', 'endMs', 'enterMs', 'exitMs', 'easing'], path);
    ['startMs', 'endMs', 'enterMs', 'exitMs', 'easing'].forEach(function (key) {
      if (!Object.prototype.hasOwnProperty.call(value, key)) fail(path + '.' + key, 'is required');
    });
    numberValue(value.startMs, path + '.startMs', 0, durationMs, true);
    numberValue(value.endMs, path + '.endMs', 0, durationMs, true);
    if (value.endMs < value.startMs) fail(path + '.endMs', 'must be after timing.startMs');
    numberValue(value.enterMs, path + '.enterMs', 0, durationMs, true);
    numberValue(value.exitMs, path + '.exitMs', 0, durationMs, true);
    enumValue(value.easing, ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out'], path + '.easing');
  }

  var STYLE_KEYS = Object.freeze({
    text: ['color', 'fontSize', 'fontWeight', 'fontFamily', 'align', 'opacity'],
    shape: ['fill', 'stroke', 'strokeWidth', 'radius', 'opacity'],
    image: ['fit', 'radius', 'opacity'],
    group: ['opacity'],
    'product-surface': ['fill', 'radius', 'opacity']
  });

  function validateStyle(value, type, path) {
    assertObject(value, path);
    allowKeys(value, STYLE_KEYS[type], path);
    if (Object.prototype.hasOwnProperty.call(value, 'opacity')) numberValue(value.opacity, path + '.opacity', 0, 1);
    if (type === 'text') {
      if (Object.prototype.hasOwnProperty.call(value, 'color')) colorValue(value.color, path + '.color');
      if (Object.prototype.hasOwnProperty.call(value, 'fontSize')) numberValue(value.fontSize, path + '.fontSize', 1, 1000);
      if (Object.prototype.hasOwnProperty.call(value, 'fontWeight')) numberValue(value.fontWeight, path + '.fontWeight', 100, 900, true);
      if (Object.prototype.hasOwnProperty.call(value, 'fontFamily')) enumValue(value.fontFamily, ['sans-serif', 'serif', 'monospace'], path + '.fontFamily');
      if (Object.prototype.hasOwnProperty.call(value, 'align')) enumValue(value.align, ['left', 'center', 'right'], path + '.align');
    } else if (type === 'shape') {
      if (Object.prototype.hasOwnProperty.call(value, 'fill')) colorValue(value.fill, path + '.fill');
      if (Object.prototype.hasOwnProperty.call(value, 'stroke')) colorValue(value.stroke, path + '.stroke');
      if (Object.prototype.hasOwnProperty.call(value, 'strokeWidth')) numberValue(value.strokeWidth, path + '.strokeWidth', 0, 100);
      if (Object.prototype.hasOwnProperty.call(value, 'radius')) numberValue(value.radius, path + '.radius', 0, 1000);
    } else if (type === 'image') {
      if (Object.prototype.hasOwnProperty.call(value, 'fit')) enumValue(value.fit, ['contain', 'cover', 'fill'], path + '.fit');
      if (Object.prototype.hasOwnProperty.call(value, 'radius')) numberValue(value.radius, path + '.radius', 0, 1000);
    } else if (type === 'product-surface') {
      if (Object.prototype.hasOwnProperty.call(value, 'fill')) colorValue(value.fill, path + '.fill');
      if (Object.prototype.hasOwnProperty.call(value, 'radius')) numberValue(value.radius, path + '.radius', 0, 1000);
    }
  }

  function validateLayer(layer, path, durationMs, ids) {
    assertObject(layer, path);
    var commonKeys = ['id', 'type', 'name', 'visible', 'locked', 'z', 'geometry', 'layouts', 'timing', 'style'];
    var extraKeys = { text: ['text'], shape: ['shape'], image: ['src', 'alt'], group: ['childIds'], 'product-surface': ['surface'] };
    enumValue(layer.type, LAYER_TYPES, path + '.type');
    allowKeys(layer, commonKeys.concat(extraKeys[layer.type]), path);
    stringValue(layer.id, path + '.id', { nonempty: true, pattern: /^[A-Za-z0-9][A-Za-z0-9._:-]*$/ });
    if (ids[layer.id]) fail(path + '.id', 'duplicate layer id');
    ids[layer.id] = true;
    stringValue(layer.name, path + '.name');
    booleanValue(layer.visible, path + '.visible');
    booleanValue(layer.locked, path + '.locked');
    numberValue(layer.z, path + '.z', -100000, 100000, true);
    validateGeometry(layer.geometry, path + '.geometry');
    assertObject(layer.layouts, path + '.layouts');
    allowKeys(layer.layouts, ASPECTS, path + '.layouts');
    ASPECTS.forEach(function (aspect) {
      if (!Object.prototype.hasOwnProperty.call(layer.layouts, aspect)) fail(path + '.layouts.' + aspect, 'is required');
      validateGeometry(layer.layouts[aspect], path + '.layouts.' + aspect);
    });
    validateTiming(layer.timing, path + '.timing', durationMs);
    validateStyle(layer.style, layer.type, path + '.style');
    if (layer.type === 'text') stringValue(layer.text, path + '.text');
    if (layer.type === 'shape') enumValue(layer.shape, ['rect', 'rounded-rect', 'ellipse', 'line'], path + '.shape');
    if (layer.type === 'image') {
      stringValue(layer.src, path + '.src', { nonempty: true });
      if (/^(?:[a-z]+:|\/\/|\/)/i.test(layer.src) || layer.src.indexOf('..') !== -1 || /[<>"'`]/.test(layer.src)) fail(path + '.src', 'only safe local relative asset paths are allowed');
      stringValue(layer.alt, path + '.alt');
    }
    if (layer.type === 'group') {
      if (!Array.isArray(layer.childIds)) fail(path + '.childIds', 'must be an array');
      layer.childIds.forEach(function (id, index) { stringValue(id, path + '.childIds[' + index + ']', { nonempty: true }); });
    }
    if (layer.type === 'product-surface') {
      assertObject(layer.surface, path + '.surface');
      allowKeys(layer.surface, ['kind', 'label', 'accent'], path + '.surface');
      enumValue(layer.surface.kind, ['browser', 'dashboard', 'mobile', 'card'], path + '.surface.kind');
      stringValue(layer.surface.label, path + '.surface.label');
      colorValue(layer.surface.accent, path + '.surface.accent');
    }
  }

  function validateComposition(value, options) {
    var limits = mergeLimits(options);
    scan(value, limits, '$', 0, {});
    assertObject(value, '$');
    allowKeys(value, ['schemaVersion', 'id', 'title', 'aspect', 'fps', 'scenes'], '$');
    if (value.schemaVersion !== CURRENT_SCHEMA_VERSION) fail('$.schemaVersion', 'unsupported version ' + value.schemaVersion);
    stringValue(value.id, '$.id', { nonempty: true, pattern: /^[A-Za-z0-9][A-Za-z0-9._:-]*$/ });
    stringValue(value.title, '$.title');
    enumValue(value.aspect, ASPECTS, '$.aspect');
    numberValue(value.fps, '$.fps', 1, 120, true);
    if (!Array.isArray(value.scenes)) fail('$.scenes', 'must be an array');
    if (value.scenes.length > limits.maxScenes) fail('$.scenes', 'scene count limit exceeded');
    var sceneIds = Object.create(null);
    var layerIds = Object.create(null);
    var totalLayers = 0;
    value.scenes.forEach(function (scene, sceneIndex) {
      var path = '$.scenes[' + sceneIndex + ']';
      assertObject(scene, path);
      allowKeys(scene, ['id', 'name', 'durationMs', 'background', 'layers'], path);
      stringValue(scene.id, path + '.id', { nonempty: true, pattern: /^[A-Za-z0-9][A-Za-z0-9._:-]*$/ });
      if (sceneIds[scene.id]) fail(path + '.id', 'duplicate scene id');
      sceneIds[scene.id] = true;
      stringValue(scene.name, path + '.name');
      numberValue(scene.durationMs, path + '.durationMs', 1, 3600000, true);
      colorValue(scene.background, path + '.background');
      if (!Array.isArray(scene.layers)) fail(path + '.layers', 'must be an array');
      if (scene.layers.length > limits.maxLayersPerScene) fail(path + '.layers', 'layer count limit exceeded');
      totalLayers += scene.layers.length;
      if (totalLayers > limits.maxTotalLayers) fail('$.scenes', 'total layer count limit exceeded');
      scene.layers.forEach(function (layer, layerIndex) { validateLayer(layer, path + '.layers[' + layerIndex + ']', scene.durationMs, layerIds); });
    });
    return value;
  }

  function nextId(prefix) {
    idCounter += 1;
    return prefix + '-' + Date.now().toString(36) + '-' + idCounter.toString(36);
  }

  function createComposition(options) {
    options = options || {};
    var composition = {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      id: options.id || nextId('composition'),
      title: options.title || 'Untitled presentation',
      aspect: options.aspect || '16:9',
      fps: options.fps || 30,
      scenes: options.scenes ? plainClone(options.scenes) : []
    };
    validateComposition(composition);
    return composition;
  }

  function migrateComposition(input, options) {
    scan(input, mergeLimits(options), '$', 0, {});
    var source = plainClone(input);
    var version = source.schemaVersion;
    if (version === undefined && source.version === 0) version = 0;
    if (version === CURRENT_SCHEMA_VERSION) {
      validateComposition(source, options);
      return source;
    }
    if (version === 0) {
      delete source.version;
      source.schemaVersion = CURRENT_SCHEMA_VERSION;
      validateComposition(source, options);
      return source;
    }
    fail('$.schemaVersion', 'unsupported version ' + version);
  }

  function canonicalize(value) {
    if (Array.isArray(value)) return value.map(canonicalize);
    if (isObject(value)) {
      var output = {};
      ownKeys(value).sort().forEach(function (key) { output[key] = canonicalize(value[key]); });
      return output;
    }
    return value;
  }

  function canonicalStringify(composition) {
    validateComposition(composition);
    return JSON.stringify(canonicalize(composition));
  }

  function importComposition(source, options) {
    options = options || {};
    if (typeof source !== 'string') fail('$', 'import source must be a JSON string');
    var limits = mergeLimits(options);
    var bytes = 0;
    for (var byteIndex = 0; byteIndex < source.length; byteIndex += 1) {
      var code = source.charCodeAt(byteIndex);
      if (code < 0x80) bytes += 1;
      else if (code < 0x800) bytes += 2;
      else if (code >= 0xd800 && code <= 0xdbff && byteIndex + 1 < source.length && source.charCodeAt(byteIndex + 1) >= 0xdc00 && source.charCodeAt(byteIndex + 1) <= 0xdfff) {
        bytes += 4;
        byteIndex += 1;
      } else bytes += 3;
    }
    if (bytes > limits.maxBytes) fail('$', 'input size limit exceeded');
    var parsed;
    try { parsed = JSON.parse(source); } catch (error) {
      var parseError = new SyntaxError('JSON parse failed: ' + error.message);
      parseError.name = 'CompositionImportError';
      throw parseError;
    }
    scan(parsed, limits, '$', 0, {});
    return migrateComposition(parsed, options);
  }

  function deepMerge(target, patch) {
    if (!isObject(patch)) return clone(patch);
    var output = isObject(target) ? clone(target) : Object.create(null);
    ownKeys(patch).forEach(function (key) {
      if (UNSAFE_KEYS.indexOf(key) !== -1) fail('$.command.patch.' + key, 'unsafe key is not allowed');
      output[key] = isObject(patch[key]) ? deepMerge(output[key], patch[key]) : clone(patch[key]);
    });
    return output;
  }

  function findScene(composition, sceneId) {
    var index = composition.scenes.findIndex(function (scene) { return scene.id === sceneId; });
    if (index < 0) fail('$.command.sceneId', 'scene not found: ' + sceneId);
    return index;
  }

  function uniqueId(existing, preferred, prefix) {
    var id = preferred || nextId(prefix);
    if (existing[id]) fail('$.command.id', 'duplicate id: ' + id);
    return id;
  }

  function applyCommand(composition, command) {
    validateComposition(composition);
    assertObject(command, '$.command');
    stringValue(command.type, '$.command.type', { nonempty: true });
    var output = plainClone(composition);
    var sceneIndex;
    var scene;
    var layerIndex;
    if (command.type === 'updateLayer') {
      sceneIndex = findScene(output, command.sceneId);
      scene = output.scenes[sceneIndex];
      layerIndex = scene.layers.findIndex(function (layer) { return layer.id === command.layerId; });
      if (layerIndex < 0) fail('$.command.layerId', 'layer not found: ' + command.layerId);
      assertObject(command.patch, '$.command.patch');
      if (Object.prototype.hasOwnProperty.call(command.patch, 'id') || Object.prototype.hasOwnProperty.call(command.patch, 'type')) fail('$.command.patch', 'id and type are immutable');
      scene.layers[layerIndex] = plainClone(deepMerge(scene.layers[layerIndex], command.patch));
    } else if (command.type === 'addLayer') {
      sceneIndex = findScene(output, command.sceneId);
      assertObject(command.layer, '$.command.layer');
      var layer = plainClone(command.layer);
      var layerIds = Object.create(null);
      output.scenes.forEach(function (item) { item.layers.forEach(function (entry) { layerIds[entry.id] = true; }); });
      layer.id = uniqueId(layerIds, layer.id, 'layer');
      var insertAt = command.toIndex === undefined ? output.scenes[sceneIndex].layers.length : command.toIndex;
      numberValue(insertAt, '$.command.toIndex', 0, output.scenes[sceneIndex].layers.length, true);
      output.scenes[sceneIndex].layers.splice(insertAt, 0, layer);
    } else if (command.type === 'deleteLayer') {
      sceneIndex = findScene(output, command.sceneId);
      scene = output.scenes[sceneIndex];
      layerIndex = scene.layers.findIndex(function (layer) { return layer.id === command.layerId; });
      if (layerIndex < 0) fail('$.command.layerId', 'layer not found: ' + command.layerId);
      scene.layers.splice(layerIndex, 1);
      scene.layers.forEach(function (item) { if (item.type === 'group') item.childIds = item.childIds.filter(function (id) { return id !== command.layerId; }); });
    } else if (command.type === 'reorderLayer') {
      sceneIndex = findScene(output, command.sceneId);
      scene = output.scenes[sceneIndex];
      layerIndex = scene.layers.findIndex(function (layer) { return layer.id === command.layerId; });
      if (layerIndex < 0) fail('$.command.layerId', 'layer not found: ' + command.layerId);
      numberValue(command.toIndex, '$.command.toIndex', 0, scene.layers.length - 1, true);
      scene.layers.splice(command.toIndex, 0, scene.layers.splice(layerIndex, 1)[0]);
    } else if (command.type === 'setSceneDuration') {
      sceneIndex = findScene(output, command.sceneId);
      numberValue(command.durationMs, '$.command.durationMs', 1, 3600000, true);
      output.scenes[sceneIndex].durationMs = command.durationMs;
    } else if (command.type === 'addScene') {
      assertObject(command.scene, '$.command.scene');
      var sceneIds = Object.create(null);
      output.scenes.forEach(function (item) { sceneIds[item.id] = true; });
      var newScene = plainClone(command.scene);
      newScene.id = uniqueId(sceneIds, newScene.id, 'scene');
      var sceneAt = command.toIndex === undefined ? output.scenes.length : command.toIndex;
      numberValue(sceneAt, '$.command.toIndex', 0, output.scenes.length, true);
      output.scenes.splice(sceneAt, 0, newScene);
    } else if (command.type === 'deleteScene') {
      sceneIndex = findScene(output, command.sceneId);
      output.scenes.splice(sceneIndex, 1);
    } else if (command.type === 'reorderScene') {
      sceneIndex = findScene(output, command.sceneId);
      numberValue(command.toIndex, '$.command.toIndex', 0, output.scenes.length - 1, true);
      output.scenes.splice(command.toIndex, 0, output.scenes.splice(sceneIndex, 1)[0]);
    } else if (command.type === 'updateComposition') {
      assertObject(command.patch, '$.command.patch');
      allowKeys(command.patch, ['title', 'aspect', 'fps'], '$.command.patch');
      output = plainClone(deepMerge(output, command.patch));
    } else {
      fail('$.command.type', 'unknown command: ' + command.type);
    }
    validateComposition(output);
    return output;
  }

  function createHistory(initial, options) {
    validateComposition(initial);
    options = options || {};
    var limit = Number.isInteger(options.limit) && options.limit > 0 ? options.limit : 100;
    var current = plainClone(initial);
    var undoStack = [];
    var redoStack = [];
    var activeGroup = null;

    var api = {
      execute: function (command, transaction) {
        var next = applyCommand(current, command);
        if (canonicalStringify(next) === canonicalStringify(current)) return false;
        var groupId = transaction && transaction.groupId != null ? String(transaction.groupId) : null;
        if (groupId === null || groupId !== activeGroup) {
          undoStack.push(current);
          if (undoStack.length > limit) undoStack.shift();
        }
        current = next;
        activeGroup = groupId;
        redoStack.length = 0;
        return true;
      },
      undo: function () {
        activeGroup = null;
        if (!undoStack.length) return plainClone(current);
        redoStack.push(current);
        current = undoStack.pop();
        return plainClone(current);
      },
      redo: function () {
        activeGroup = null;
        if (!redoStack.length) return plainClone(current);
        undoStack.push(current);
        if (undoStack.length > limit) undoStack.shift();
        current = redoStack.pop();
        return plainClone(current);
      },
      reset: function (composition) {
        validateComposition(composition);
        current = plainClone(composition);
        undoStack.length = 0;
        redoStack.length = 0;
        activeGroup = null;
        return plainClone(current);
      },
      get value() { return plainClone(current); },
      get composition() { return plainClone(current); },
      get canUndo() { return undoStack.length > 0; },
      get canRedo() { return redoStack.length > 0; },
      get undoDepth() { return undoStack.length; },
      get redoDepth() { return redoStack.length; }
    };
    return api;
  }

  function createAutosave(options) {
    options = options || {};
    var storage = options.storage;
    if (!storage || typeof storage.getItem !== 'function' || typeof storage.setItem !== 'function') throw new TypeError('autosave storage must implement getItem and setItem');
    var key = options.key || 'pf-editor:v' + CURRENT_SCHEMA_VERSION;
    var delayMs = Number.isFinite(options.delayMs) && options.delayMs >= 0 ? options.delayMs : 250;
    var timer = null;
    var pending = null;
    var waiters = [];

    function settle(error) {
      var queued = waiters.splice(0);
      queued.forEach(function (pair) { if (error) pair.reject(error); else pair.resolve(); });
    }

    function write(composition) {
      var serialized = canonicalStringify(composition);
      storage.setItem(key, serialized);
    }

    function flush(composition) {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
      var target = composition || pending;
      if (!target) return Promise.resolve();
      pending = null;
      try {
        write(target);
        settle();
        return Promise.resolve();
      } catch (error) {
        settle(error);
        return Promise.reject(error);
      }
    }

    return {
      schedule: function (composition) {
        validateComposition(composition);
        pending = plainClone(composition);
        if (timer !== null) clearTimeout(timer);
        var promise = new Promise(function (resolve, reject) { waiters.push({ resolve: resolve, reject: reject }); });
        timer = setTimeout(function () { flush().catch(function () {}); }, delayMs);
        return promise;
      },
      flush: flush,
      restore: function () {
        var source = storage.getItem(key);
        return source == null ? null : importComposition(source, options);
      },
      clear: function () {
        if (timer !== null) clearTimeout(timer);
        timer = null;
        pending = null;
        settle();
        if (typeof storage.removeItem === 'function') storage.removeItem(key);
      },
      get key() { return key; }
    };
  }

  return Object.freeze({
    CURRENT_SCHEMA_VERSION: CURRENT_SCHEMA_VERSION,
    LAYER_TYPES: LAYER_TYPES,
    createComposition: createComposition,
    validateComposition: validateComposition,
    migrateComposition: migrateComposition,
    canonicalStringify: canonicalStringify,
    importComposition: importComposition,
    applyCommand: applyCommand,
    createHistory: createHistory,
    createAutosave: createAutosave
  });
}));
