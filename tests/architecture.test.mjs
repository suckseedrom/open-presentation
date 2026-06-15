import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const exists = (relativePath) => fs.existsSync(path.join(ROOT, relativePath));
const readText = (relativePath) => fs.readFileSync(path.join(ROOT, relativePath), 'utf8');

test('progressive-disclosure entrypoints exist', () => {
  assert.equal(exists('SKILL.md'), true);
  assert.equal(exists('reference/STYLE_INDEX.md'), true);
  assert.equal(exists('templates/index.json'), true);
  assert.equal(exists('reference/PRODUCT_PILLARS.md'), true);
  assert.equal(exists('docs/OUTPUT-CONTRACT.md'), true);
});

test('MCP surface is removed from the public package', () => {
  assert.equal(exists('mcp'), false);
});

test('default template docs exist for on-demand loading', () => {
  assert.equal(exists('templates/presentation-feature-core/preview.md'), true);
  assert.equal(exists('templates/presentation-feature-core/design.md'), true);
  assert.equal(exists('templates/presentation-feature-core/examples/about-us-brief.md'), true);
  assert.equal(exists('templates/presentation-feature-core/examples/pricing-brief.md'), true);
  assert.equal(exists('reference/RECHECK.md'), true);
});

test('shared player library ships with the pack', () => {
  assert.equal(exists('lib/player.js'), true);
  assert.equal(exists('lib/player.css'), true);
  assert.equal(exists('lib/README.md'), true);
  const js = readText('lib/player.js');
  assert.match(js, /class PresentationPlayer/);
  assert.match(js, /play\(/);
  assert.match(js, /pause\(/);
  assert.match(js, /next\(/);
  assert.match(js, /prev\(/);
  assert.match(js, /restart\(/);
  assert.match(js, /setMuted\(/);
  assert.match(js, /scene:activate/);
  assert.match(js, /scene:deactivate/);
  assert.match(js, /window\.PresentationPlayer/);
  const css = readText('lib/player.css');
  assert.match(css, /\.pf-stage/);
  assert.match(css, /\.pf-pill/);
  const readme = readText('lib/README.md');
  assert.match(readme, /PresentationPlayer/);
});

test('the revised pack advertises the new product pillars', () => {
  assert.match(readText('README.md'), /zero-dependency HTML delivery/i);
  assert.match(readText('reference/STYLE_GUIDE.md'), /anti-AI-slop/i);
  assert.match(readText('reference/STYLE_GUIDE.md'), /centered statement/i);
  assert.match(readText('reference/STYLE_GUIDE.md'), /full-bleed/i);
  assert.match(readText('reference/STYLE_GUIDE.md'), /proof-grid/i);
  assert.match(readText('reference/STYLE_GUIDE.md'), /single focal composition/i);
  assert.match(readText('reference/STYLE_GUIDE.md'), /recheck and repair/i);
  assert.match(readText('reference/STYLE_GUIDE.md'), /scene-activation-bound/i);
  assert.match(readText('reference/STYLE_GUIDE.md'), /persistent source stamps/i);
  assert.match(readText('reference/STYLE_GUIDE.md'), /Shared player library/i);
  assert.match(readText('reference/PRODUCT_PILLARS.md'), /Text Budget/i);
  assert.match(readText('reference/PRODUCT_PILLARS.md'), /Motion Density/i);
  assert.match(readText('reference/PRODUCT_PILLARS.md'), /20\+/i);
  assert.match(readText('reference/PRODUCT_PILLARS.md'), /Recheck Loop/i);
  assert.match(readText('reference/PRODUCT_PILLARS.md'), /duplicate layouts/i);
  assert.match(readText('reference/PRODUCT_PILLARS.md'), /activation/i);
  assert.match(readText('reference/STYLE_GUIDE.md'), /text-light/i);
  assert.match(readText('reference/STYLE_GUIDE.md'), /visual-only/i);
  assert.match(readText('reference/STYLE_GUIDE.md'), /fade-based/i);
  assert.match(readText('reference/scene-grammar.json'), /shared_player_library/);
  assert.match(readText('reference/scene-grammar.json'), /PresentationPlayer/);
  assert.match(readText('reference/scene-grammar.json'), /scene_archetype_policy/i);
  assert.match(readText('reference/scene-grammar.json'), /layout_variance_policy/i);
  assert.match(readText('reference/scene-grammar.json'), /single_focus_policy/i);
  assert.match(readText('reference/scene-grammar.json'), /text_layer_motion_policy/i);
  assert.match(readText('reference/scene-grammar.json'), /recheck_policy/i);
  assert.match(readText('reference/scene-grammar.json'), /overlay_safety_policy/i);
  assert.match(readText('reference/scene-grammar.json'), /motion_family_variance_policy/i);
  assert.match(readText('templates/presentation-feature-core/design.md'), /text-light/i);
  assert.match(readText('templates/presentation-feature-core/design.md'), /visual-only/i);
  assert.match(readText('templates/presentation-feature-core/design.md'), /20\+/i);
  assert.match(readText('templates/presentation-feature-core/design.md'), /Recheck gate/i);
  assert.match(readText('templates/presentation-feature-core/design.md'), /Shared player library/i);
  assert.match(readText('templates/presentation-feature-core/preview.md'), /recheck-friendly/i);
  assert.match(readText('templates/presentation-feature-core/preview.md'), /shared PresentationFeature player/i);
  assert.match(readText('templates/index.json'), /layout variety/i);
  assert.match(readText('templates/index.json'), /full-bleed reveals/i);
  assert.match(readText('templates/index.json'), /proof-grid moments/i);
  assert.match(readText('docs/OUTPUT-CONTRACT.md'), /single HTML file/i);
  assert.match(readText('docs/OUTPUT-CONTRACT.md'), /shared player library/i);
  assert.match(readText('docs/OUTPUT-CONTRACT.md'), /visual-only/i);
  assert.match(readText('docs/OUTPUT-CONTRACT.md'), /20\+/i);
  assert.match(readText('docs/OUTPUT-CONTRACT.md'), /16:9/i);
  assert.match(readText('docs/OUTPUT-CONTRACT.md'), /9:16/i);
  assert.match(readText('docs/OUTPUT-CONTRACT.md'), /layout and motion variety/i);
  assert.match(readText('docs/OUTPUT-CONTRACT.md'), /centered statement/i);
  assert.match(readText('docs/OUTPUT-CONTRACT.md'), /Recheck gate/i);
  assert.match(readText('docs/OUTPUT-CONTRACT.md'), /activation/i);
  assert.match(readText('README.md'), /recheck pass/i);
});

test('shared player library exposes a scene background layer', () => {
  const css = readText('lib/player.css');
  assert.match(css, /\.pf-scene-bg/);

  const js = readText('lib/player.js');
  assert.match(js, /pf-scene-bg/);
  assert.match(js, /background/);
});

test('docs advertise the background and mobile 9:16 rules', () => {
  assert.match(readText('SKILL.md'), /background layer policy/i);
  assert.match(readText('SKILL.md'), /mobile 9:16 policy/i);

  assert.match(readText('reference/STYLE_GUIDE.md'), /background layer policy/i);
  assert.match(readText('reference/STYLE_GUIDE.md'), /mobile 9:16 safety/i);

  assert.match(readText('reference/PRODUCT_PILLARS.md'), /background layer policy/i);
  assert.match(readText('reference/PRODUCT_PILLARS.md'), /mobile 9:16 policy/i);

  assert.match(readText('reference/RECHECK.md'), /background layer/i);
  assert.match(readText('reference/RECHECK.md'), /mobile 9:16/i);

  assert.match(readText('docs/OUTPUT-CONTRACT.md'), /background layer/i);
  assert.match(readText('docs/OUTPUT-CONTRACT.md'), /mobile 9:16/i);

  const grammar = readText('reference/scene-grammar.json');
  assert.match(grammar, /background_layer_policy/);
  assert.match(grammar, /mobile_9_16_policy/);
});
