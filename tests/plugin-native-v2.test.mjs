import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readText = (relativePath) => fs.readFileSync(path.join(ROOT, relativePath), 'utf8');

test('plugin-native v2 contracts exist and parse', () => {
  assert.doesNotThrow(() => JSON.parse(readText('core/contracts/composition.schema.json')));
  assert.doesNotThrow(() => JSON.parse(readText('core/contracts/plugin-session.schema.json')));
  assert.doesNotThrow(() => JSON.parse(readText('plugins/open-presentation/app/open-presentation-v2.app.template.json')));
});

test('plugin-native v2 orchestrator emits deterministic composition and session state', async () => {
  const orchestrator = await import(pathToFileURL(path.join(ROOT, 'core/orchestrator/presentation-orchestrator.mjs')).href);
  const sessionMod = await import(pathToFileURL(path.join(ROOT, 'core/orchestrator/plugin-session.mjs')).href);
  const composition = orchestrator.createPresentationComposition(`
Product: Tesla Model 3
Audience: EV shoppers
Goal: Launch video ad
CTA: Book a test drive
Theme: capsule
  `);
  const session = sessionMod.createPluginSession('Product: Tesla Model 3\nGoal: Launch video ad');

  assert.equal(composition.version, '1.0.0');
  assert.equal(composition.project.mode, 'launch-video');
  assert.ok(composition.scenes.length >= 5);
  assert.equal(session.status, 'preview-ready');
  assert.ok(session.panels.some((panel) => panel.kind === 'preview'));
  assert.ok(session.actions.some((action) => action.type === 'export'));
});
