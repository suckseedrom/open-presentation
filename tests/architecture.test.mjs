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
});

test('the revised pack advertises the new product pillars', () => {
  assert.match(readText('README.md'), /zero-dependency HTML delivery/i);
  assert.match(readText('reference/STYLE_GUIDE.md'), /anti-AI-slop/i);
  assert.match(readText('docs/OUTPUT-CONTRACT.md'), /single HTML file/i);
  assert.match(readText('docs/OUTPUT-CONTRACT.md'), /16:9/i);
  assert.match(readText('docs/OUTPUT-CONTRACT.md'), /9:16/i);
});
