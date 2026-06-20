import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const require = createRequire(import.meta.url);

export const EDITOR_PATHS = Object.freeze({
  model: path.join(ROOT, 'lib/editor-model.js'),
  renderer: path.join(ROOT, 'lib/editor-renderer.js'),
  exporter: path.join(ROOT, 'lib/editor-export.js'),
  editor: path.join(ROOT, 'lib/editor.js'),
  editorCss: path.join(ROOT, 'lib/editor.css'),
});

export function loadOptionalModule(file) {
  if (!fs.existsSync(file)) return null;
  delete require.cache[file];
  return require(file);
}

export function readOptional(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}

export const aspectGeometry = (x, y, width, height) => ({
  x, y, width, height, rotation: 0,
});

const common = (id, type, z, timing = { startMs: 0, endMs: 1000 }) => ({
  id,
  type,
  name: id,
  visible: true,
  locked: false,
  z,
  geometry: aspectGeometry(0.1, 0.1, 0.4, 0.2),
  layouts: {
    '16:9': aspectGeometry(0.1, 0.1, 0.4, 0.2),
    '9:16': aspectGeometry(0.08, 0.15, 0.84, 0.12),
  },
  timing: { ...timing, enterMs: 100, exitMs: 100, easing: 'ease-out' },
});

export function makeComposition() {
  return {
    schemaVersion: 1,
    id: 'composition-contract',
    title: 'Editor contract',
    aspect: '16:9',
    fps: 30,
    scenes: [
      {
        id: 'scene-a',
        name: 'Opening',
        durationMs: 1000,
        background: '#0b1020',
        layers: [
          {
            ...common('text-a', 'text', 0),
            text: 'Launch clarity',
            style: { color: '#ffffff', fontSize: 72, fontWeight: 700, fontFamily: 'sans-serif', align: 'left', opacity: 1 },
          },
          {
            ...common('shape-a', 'shape', 1),
            shape: 'rounded-rect',
            style: { fill: '#6d5efc', stroke: '#ffffff', strokeWidth: 2, radius: 24, opacity: 1 },
          },
          {
            ...common('image-a', 'image', 2),
            src: './assets/product.webp',
            alt: 'Product view',
            style: { fit: 'contain', radius: 18, opacity: 1 },
          },
          {
            ...common('group-a', 'group', 3),
            childIds: ['text-a', 'shape-a'],
            style: { opacity: 1 },
          },
          {
            ...common('surface-a', 'product-surface', 4),
            surface: { kind: 'browser', label: 'Workspace', accent: '#6d5efc' },
            style: { fill: '#151a2d', radius: 20, opacity: 1 },
          },
        ],
      },
      {
        id: 'scene-b',
        name: 'Close',
        durationMs: 500,
        background: '#111111',
        layers: [{
          ...common('text-b', 'text', 0, { startMs: 0, endMs: 500 }),
          text: 'Ready',
          style: { color: '#ffffff', fontSize: 80, fontWeight: 700, fontFamily: 'sans-serif', align: 'center', opacity: 1 },
        }],
      },
    ],
  };
}

export function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function makeMemoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
    values,
  };
}

export function assertModule(assert, module, label) {
  assert.ok(module, `${label} must exist as a zero-dependency CommonJS/browser module`);
}

export function installFakeDom() {
  class FakeElement {
    constructor(tagName = 'div') {
      this.tagName = tagName.toUpperCase();
      this.children = [];
      this.attributes = new Map();
      this.listeners = new Map();
      this.classList = {
        values: new Set(),
        add: (...names) => names.forEach((name) => this.classList.values.add(name)),
        remove: (...names) => names.forEach((name) => this.classList.values.delete(name)),
        contains: (name) => this.classList.values.has(name),
      };
      this.style = { setProperty() {} };
      this.clientWidth = 1280;
      this.clientHeight = 720;
      this.offsetHeight = 1;
      this._innerHTML = '';
    }
    set className(value) {
      this.classList.values = new Set(String(value).split(/\s+/).filter(Boolean));
    }
    get className() { return [...this.classList.values].join(' '); }
    set innerHTML(value) {
      this._innerHTML = String(value);
      if (value === '') this.children = [];
    }
    get innerHTML() { return this._innerHTML; }
    appendChild(child) { this.children.push(child); child.parentNode = this; return child; }
    setAttribute(name, value) { this.attributes.set(name, String(value)); }
    getAttribute(name) { return this.attributes.get(name) ?? null; }
    addEventListener(type, listener) {
      const list = this.listeners.get(type) || [];
      list.push(listener);
      this.listeners.set(type, list);
    }
    click() {
      for (const listener of this.listeners.get('click') || []) listener({ preventDefault() {} });
    }
    dispatchEvent() { return true; }
    remove() { this.parentNode?.children.splice(this.parentNode.children.indexOf(this), 1); }
    findByLabel(label) {
      if (this.getAttribute('aria-label') === label) return [this];
      return this.children.flatMap((child) => child.findByLabel(label));
    }
  }

  const previous = {
    document: globalThis.document,
    window: globalThis.window,
    CustomEvent: globalThis.CustomEvent,
    ResizeObserver: globalThis.ResizeObserver,
  };
  globalThis.document = { createElement: (tag) => new FakeElement(tag) };
  globalThis.window = { addEventListener() {}, removeEventListener() {} };
  globalThis.CustomEvent = class { constructor(type, init) { this.type = type; this.detail = init?.detail; } };
  globalThis.ResizeObserver = undefined;
  return {
    container: new FakeElement('main'),
    restore() {
      for (const [name, value] of Object.entries(previous)) {
        if (value === undefined) delete globalThis[name];
        else globalThis[name] = value;
      }
    },
  };
}
