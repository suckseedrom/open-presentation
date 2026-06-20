import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, installFakeDom, require } from './editor-fixtures.mjs';

const playerJs = fs.readFileSync(path.join(ROOT, 'lib/player.js'), 'utf8');

test('player Download bridge is opt-in and preserves browser/CommonJS compatibility', () => {
  assert.match(playerJs, /window\.PresentationPlayer\s*=\s*PresentationPlayer/);
  assert.match(playerJs, /module\.exports\s*=\s*PresentationPlayer/);
  assert.match(playerJs, /opts\.onDownload/);
  assert.match(playerJs, /typeof\s+opts\.onDownload\s*===\s*['"]function['"]/);
  assert.match(playerJs, /makeBtn\(['"]Download to Video \(4K\)['"]/);
  assert.match(playerJs, /this\._onDownload\(\)/);
});

test('player bridge adds exactly one Download action only when configured', () => {
  const downloadLabelOccurrences = playerJs.match(/makeBtn\(['"]Download to Video \(4K\)['"]/g) || [];
  assert.equal(downloadLabelOccurrences.length, 1, 'transport source must define exactly one Download action');
  assert.match(playerJs, /if\s*\(this\._onDownload\)/, 'Download action must be conditional');
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
    assert.equal(fake.container.findByLabel('Download to Video (4K)').length, 0, 'default transport remains unchanged');
    baseline.destroy();
    activePlayer = null;

    let downloads = 0;
    const configured = activePlayer = new PresentationPlayer(fake.container, {
      scenes: [{ id: 'one', html: 'One' }],
      onDownload: () => { downloads += 1; },
    });
    const buttons = fake.container.findByLabel('Download to Video (4K)');
    assert.equal(buttons.length, 1, 'configured transport adds exactly one Download action');
    const wasPlaying = configured.isPlaying;
    buttons[0].click();
    assert.equal(downloads, 1);
    assert.equal(configured.isPlaying, wasPlaying, 'triggering download does not alter playback state');
    configured.destroy();
    activePlayer = null;
    assert.equal(fake.container.findByLabel('Download to Video (4K)').length, 0);
  } finally {
    activePlayer?.destroy();
    fake.restore();
  }
});
