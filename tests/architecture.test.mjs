import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const exists = (relativePath) => fs.existsSync(path.join(ROOT, relativePath));
const readText = (relativePath) => fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
const skillFrontmatter = () => {
  const match = readText('SKILL.md').match(/^---\s*\n([\s\S]*?)\n---/);
  assert.ok(match, 'SKILL.md must expose YAML frontmatter');
  return match[1];
};

const walkFiles = (relativePath, predicate) => {
  const absolutePath = path.join(ROOT, relativePath);
  if (!fs.existsSync(absolutePath)) return [];
  return fs.readdirSync(absolutePath, { withFileTypes: true }).flatMap((entry) => {
    const child = path.join(relativePath, entry.name);
    return entry.isDirectory() ? walkFiles(child, predicate) : predicate(child) ? [child] : [];
  });
};

test('progressive-disclosure entrypoints exist', () => {
  assert.equal(exists('SKILL.md'), true);
  assert.equal(exists('PRIVACY.md'), true);
  assert.equal(exists('SUPPORT.md'), true);
  assert.equal(exists('docs/APP-CONNECTOR-REQUIREMENTS.md'), true);
  assert.equal(exists('docs/PLUGIN-NATIVE-V2.md'), true);
  assert.equal(exists('core/contracts/composition.schema.json'), true);
  assert.equal(exists('core/contracts/plugin-session.schema.json'), true);
  assert.equal(exists('reference/STYLE_INDEX.md'), true);
  assert.equal(exists('templates/index.json'), true);
  assert.equal(exists('reference/PRODUCT_PILLARS.md'), true);
  assert.equal(exists('docs/OUTPUT-CONTRACT.md'), true);
  assert.equal(exists('.agents/plugins/marketplace.json'), true);
  assert.equal(exists('plugins/open-presentation/.codex-plugin/plugin.json'), true);
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
  assert.match(readText('README.md'), /skill-first/i);
  assert.match(readText('README.md'), /plugin install/i);
  assert.match(readText('README.md'), /zero-dependency HTML/i);
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
  const productPillars = readText('reference/PRODUCT_PILLARS.md');
  assert.match(productPillars, /input-derived micro-scene inventory/i);
  assert.match(productPillars, /never start from a universal scene quota/i);
  assert.match(productPillars, /every planned scene[\s\S]{0,120}one communication job[\s\S]{0,120}one focal object[\s\S]{0,120}one visible state/i);
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
  const coreDesign = readText('templates/presentation-feature-core/design.md');
  assert.match(coreDesign, /derive the micro-scene inventory from the supplied material/i);
  assert.match(coreDesign, /each scene one communication job/i);
  assert.match(coreDesign, /as the input warrants/i);
  assert.match(coreDesign, /instead of targeting a universal count/i);
  assert.doesNotMatch(coreDesign, /(?:default to|expect|aim for|use) 20\+ (?:short |micro-?)?scenes/i);
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
  const outputContract = readText('docs/OUTPUT-CONTRACT.md');
  assert.match(outputContract, /input-derived cinematic micro-scene inventory/i);
  assert.match(outputContract, /never impose a fixed count/i);
  assert.match(outputContract, /each scene one communication job[\s\S]{0,120}one focal object[\s\S]{0,120}one visible state/i);
  assert.match(readText('docs/OUTPUT-CONTRACT.md'), /16:9/i);
  assert.match(readText('docs/OUTPUT-CONTRACT.md'), /9:16/i);
  assert.match(readText('docs/OUTPUT-CONTRACT.md'), /layout and motion variety/i);
  assert.match(readText('docs/OUTPUT-CONTRACT.md'), /centered statement/i);
  assert.match(readText('docs/OUTPUT-CONTRACT.md'), /Recheck gate/i);
  assert.match(readText('docs/OUTPUT-CONTRACT.md'), /activation/i);
  assert.match(readText('README.md'), /recheck pass/i);
});

test('manifest advertises plugin-first with skill-compatible fallback', () => {
  const manifest = JSON.parse(readText('manifest.json'));

  assert.equal(manifest.package_type, 'plugin-skill-pack');
  assert.equal(manifest.distribution, 'public-skill-repo');
  assert.equal(manifest.primary_install_unit, 'plugin');
  assert.equal(manifest.preferred_install_mode, 'agent-plugin');
  assert.equal(manifest.public_install_surface, 'github-marketplace');
  assert.equal(manifest.plugin_marketplace_root, '.agents/plugins/marketplace.json');
  assert.equal(manifest.plugin_bundle_root, 'plugins/open-presentation/');
  assert.ok(Array.isArray(manifest.install_modes));
  assert.ok(manifest.install_modes.includes('agent-plugin'));
  assert.ok(manifest.install_modes.includes('markdown-skill'));
  assert.equal(manifest.install_commands['codex-plugin-marketplace'], 'codex plugin marketplace add suckseedrom/open-presentation');
  assert.equal(manifest.install_commands['codex-plugin-install'], 'codex plugin add open-presentation@open-presentation');
  assert.equal(manifest.install_commands['claude-plugin-marketplace'], '/plugin marketplace add suckseedrom/open-presentation');
  assert.equal(manifest.plugin_contract.requires_mcp, false);
  assert.equal(manifest.plugin_contract.requires_private_paths, false);
  assert.equal(manifest.plugin_contract.requires_hidden_runtime, false);
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

  const recheck = readText('reference/RECHECK.md');
  assert.match(recheck, /background layer/i);
  assert.match(recheck, /every scene at both 16:9 and 9:16/i);
  assert.match(recheck, /at 9:16, add at least 40px safe-zone padding/i);
  assert.match(recheck, /block delivery[\s\S]{0,120}every row[\s\S]{0,120}16:9 PASS[\s\S]{0,80}9:16 PASS/i);

  assert.match(readText('docs/OUTPUT-CONTRACT.md'), /background layer/i);
  assert.match(readText('docs/OUTPUT-CONTRACT.md'), /mobile 9:16/i);

  const grammar = readText('reference/scene-grammar.json');
  assert.match(grammar, /background_layer_policy/);
  assert.match(grammar, /mobile_9_16_policy/);
});

test('SKILL metadata is discoverable for the complete presentation-video use case', () => {
  const metadata = skillFrontmatter();

  assert.match(metadata, /presentation/i, 'metadata must advertise presentation generation');
  assert.match(metadata, /pitch[ -]?deck/i, 'metadata must be discoverable for pitch-deck requests');
  assert.match(metadata, /product[ -]?demo/i, 'metadata must be discoverable for product-demo requests');
  assert.match(metadata, /launch/i, 'metadata must be discoverable for launch requests');
  assert.match(metadata, /video[ -]?ad/i, 'metadata must be discoverable for video-ad requests');
  assert.match(metadata, /presentation\.html/i, 'metadata must steer hosts toward workspace HTML files');
  assert.match(metadata, /generic slide generator|remote presentation widget/i, 'metadata should discourage generic slide-tool routing');
});

test('workflow preflights input sufficiency and asks only bounded high-impact questions', () => {
  const skill = readText('SKILL.md');

  assert.match(skill, /input sufficiency preflight/i);
  assert.match(skill, /reuse (?:all )?supplied facts/i);
  assert.match(skill, /unresolved high-impact choices/i);
  assert.match(skill, /2(?:\s*(?:-|–|to)\s*)4 recommendation-first selectable (?:questions|Q&A)/i);
  assert.match(skill, /do not ask.*(?:already|supplied|provided)/i);
  assert.match(skill, /untrusted (?:source|input|content)[\s\S]{0,160}prompt injection[\s\S]{0,160}(?:inert|ignore|not instructions)/i);
  assert.match(skill, /(?:generic presentation generator|slide widget|remote deck tool)[\s\S]{0,160}do not substitute|do not substitute[\s\S]{0,160}(?:generic presentation generator|slide widget|remote deck tool)/i);
  assert.match(skill, /presentation id[\s\S]{0,160}no HTML content|no HTML content[\s\S]{0,160}presentation id/i);
});

test('public docs keep plugin-first install and markdown-authority fallback aligned', () => {
  const readme = readText('README.md');
  const usage = readText('docs/USAGE.md');
  const portability = readText('docs/PORTABILITY.md');
  const faq = readText('docs/FAQ.md');
  const publishing = readText('PUBLISHING.md');
  const claude = readText('CLAUDE.md');
  const contributing = readText('CONTRIBUTING.md');

  assert.match(readme, /skill-first/i);
  assert.match(readme, /plugin install/i);
  assert.match(readme, /codex plugin marketplace add suckseedrom\/open-presentation/i);
  assert.match(readme, /codex plugin add open-presentation@open-presentation/i);
  assert.match(readme, /Claude Cowork or plugin UI/i);
  assert.match(readme, /\/plugin marketplace add suckseedrom\/open-presentation/i);
  assert.match(readme, /Other AI assistants/i);
  assert.match(readme, /MCP app returned no HTML content/i);
  assert.match(readme, /PRIVACY\.md/i);
  assert.match(readme, /SUPPORT\.md/i);
  assert.match(readme, /Advanced Docs/i);
  assert.match(readme, /docs\/PLUGIN-NATIVE-V2\.md/i);
  assert.match(usage, /Plugin wrapper contract/i);
  assert.match(usage, /skill-first/i);
  assert.match(usage, /codex plugin marketplace add suckseedrom\/open-presentation/i);
  assert.match(usage, /codex plugin add open-presentation@open-presentation/i);
  assert.match(usage, /Public GitHub install/i);
  assert.match(usage, /\/plugin marketplace add suckseedrom\/open-presentation/i);
  assert.match(usage, /Generate or edit presentation/i);
  assert.match(usage, /do not add MCP requirements/i);
  assert.match(portability, /plugin-capable agent apps/i);
  assert.match(faq, /Both, but skill-first/i);
  assert.match(faq, /pm-skills/i);
  assert.match(faq, /presentation ID/i);
  assert.match(publishing, /plugin-first, skill-compatible/i);
  assert.match(claude, /plugin-first, skill-compatible/i);
  assert.match(contributing, /plugin-first install path is clear/i);
});

test('public-user install path is prioritized over local-development guidance', () => {
  const readme = readText('README.md');
  const publicInstallIndex = readme.indexOf('## Installation');
  const localTryIndex = readme.indexOf('## Try It Locally');

  assert.notEqual(publicInstallIndex, -1);
  assert.notEqual(localTryIndex, -1);
  assert.ok(publicInstallIndex < localTryIndex, 'public install guidance should appear before local try-it-locally guidance');
  assert.match(readText('PUBLISHING.md'), /public GitHub installation as the primary release surface/i);
  assert.match(readText('docs/FAQ.md'), /public GitHub repo marketplace path first/i);
});

test('repo-local Codex marketplace points at a valid plugin bundle', () => {
  const marketplace = JSON.parse(readText('.agents/plugins/marketplace.json'));
  const plugin = JSON.parse(readText('plugins/open-presentation/.codex-plugin/plugin.json'));

  assert.equal(marketplace.name, 'open-presentation');
  assert.equal(marketplace.plugins.length, 1);
  assert.equal(marketplace.plugins[0].name, 'open-presentation');
  assert.equal(marketplace.plugins[0].source.source, 'local');
  assert.equal(marketplace.plugins[0].source.path, './plugins/open-presentation');
  assert.equal(plugin.name, 'open-presentation');
  assert.equal(plugin.skills, './skills/');
  assert.match(plugin.description, /skill-first plugin/i);
  assert.match(plugin.interface.displayName, /Open Presentation/);
  assert.match(plugin.interface.shortDescription, /skill-first/i);
  assert.match(plugin.interface.longDescription, /plugin is the install surface/i);
  assert.ok(plugin.interface.capabilities.includes('HTML workspace output'));
  assert.ok(plugin.interface.capabilities.includes('Skill-first execution'));
  assert.match(plugin.interface.defaultPrompt[0], /presentation\.html/i);
  assert.match(plugin.interface.privacyPolicyURL, /PRIVACY\.md$/);
  assert.equal(plugin.interface.composerIcon, './assets/icon.png');
  assert.equal(plugin.interface.logo, './assets/logo.png');
  assert.equal(plugin.interface.screenshots.length, 3);
  assert.equal(exists('plugins/open-presentation/skills/open-presentation/SKILL.md'), true);
  assert.equal(exists('plugins/open-presentation/reference'), true);
  assert.equal(exists('plugins/open-presentation/templates'), true);
  assert.equal(exists('plugins/open-presentation/examples'), true);
  assert.equal(exists('plugins/open-presentation/docs'), true);
  assert.equal(exists('plugins/open-presentation/lib'), true);
  assert.equal(exists('plugins/open-presentation/assets/icon.png'), true);
  assert.equal(exists('plugins/open-presentation/assets/logo.png'), true);
  assert.equal(exists('plugins/open-presentation/assets/screenshot1.png'), true);
  assert.equal(exists('plugins/open-presentation/assets/screenshot2.png'), true);
  assert.equal(exists('plugins/open-presentation/assets/screenshot3.png'), true);
  assert.equal(exists('plugins/open-presentation/app/open-presentation-v2.app.template.json'), true);
  assert.equal(exists('plugins/open-presentation/app/open-presentation.codex.production.app.template.json'), true);
  assert.equal(exists('plugins/open-presentation/app/open-presentation.claude.production.app.template.json'), true);
  assert.equal(exists('plugins/open-presentation/app/README.md'), true);
});

test('planning produces an input-derived micro-scene inventory instead of a fixed scene quota', () => {
  const skill = readText('SKILL.md');
  const publicGuidance = [
    'SKILL.md',
    'README.md',
    'docs/USAGE.md',
    'docs/OUTPUT-CONTRACT.md',
    'reference/PRODUCT_PILLARS.md',
    'reference/STYLE_GUIDE.md',
    'reference/scene-grammar.json',
    'templates/index.json',
    'templates/presentation-feature-core/design.md',
    'templates/presentation-feature-core/preview.md',
  ].map(readText).join('\n');

  assert.match(skill, /input-derived micro-scene inventory/i);
  assert.match(skill, /one (?:communication )?job/i);
  assert.match(skill, /focal object/i);
  assert.match(skill, /(?:visible )?state/i);
  assert.match(skill, /motion/i);
  assert.match(skill, /duration/i);
  assert.match(skill, /16:9[\s\S]{0,120}9:16/i);
  assert.doesNotMatch(
    publicGuidance,
    /(?:default to|expect|aim for|use) 20\+ (?:short |micro-?)?scenes/i,
    'scene count must follow the input inventory, not a universal 20+ rule',
  );
});

test('visual direction follows product context and the input language', () => {
  const skill = readText('SKILL.md');
  const style = readText('reference/STYLE_GUIDE.md');

  assert.match(skill, /contextual product mockup/i);
  assert.match(skill, /input-led language/i);
  assert.match(skill, /bilingual only when (?:the )?(?:input|brief|user)/i);
  assert.match(style, /contextual product mockup/i);
  assert.match(style, /deliberate bilingual/i);
  assert.match(style, /minimal (?:player|transport) chrome/i);
});

test('motion contract covers layered lifecycle choreography and accessibility', () => {
  const skill = readText('SKILL.md');
  const style = readText('reference/STYLE_GUIDE.md');
  const grammar = JSON.parse(readText('reference/scene-grammar.json'));
  const contract = `${skill}\n${style}\n${JSON.stringify(grammar)}`;

  assert.match(contract, /layered motion/i);
  assert.match(contract, /motion famil(?:y|ies)/i);
  assert.match(contract, /entrance[\s\S]{0,100}action[\s\S]{0,100}exit/i);
  assert.match(contract, /adjacent scenes?[\s\S]{0,120}(?:vary|different|repeat)/i);
  assert.match(contract, /scene activation/i);
  assert.match(contract, /prefers-reduced-motion|reduced motion/i);
});

test('render QA uses a per-scene dual-aspect repair ledger that gates delivery', () => {
  const skill = readText('SKILL.md');
  const recheck = readText('reference/RECHECK.md');
  const contract = readText('docs/OUTPUT-CONTRACT.md');
  const qaContract = `${skill}\n${recheck}\n${contract}`;

  assert.match(qaContract, /per-scene (?:render )?(?:QA )?ledger/i);
  assert.match(qaContract, /render[\s\S]{0,80}inspect[\s\S]{0,80}repair[\s\S]{0,80}rerender/i);
  assert.match(qaContract, /16:9 PASS/i);
  assert.match(qaContract, /9:16 PASS/i);
  assert.match(qaContract, /(?:block|do not allow) delivery[\s\S]{0,120}(?:all (?:ledger )?rows|every row)[\s\S]{0,80}(?:green|PASS)/i);
});

test('machine-readable contract, public docs, and metadata stay portable and aligned', () => {
  const jsonFiles = [
    ...walkFiles('reference', (file) => file.endsWith('.json')),
    ...walkFiles('templates', (file) => file.endsWith('.json')),
  ];
  assert.ok(jsonFiles.length > 0, 'the public package must expose JSON contracts');
  for (const file of jsonFiles) {
    assert.doesNotThrow(() => JSON.parse(readText(file)), `${file} must contain valid JSON`);
  }

  const metadata = skillFrontmatter();
  const publicDocs = ['README.md', 'SKILL.md', 'docs/OUTPUT-CONTRACT.md'].map(readText);
  const machineContract = jsonFiles.map(readText).join('\n');
  for (const [surface, content] of [
    ['SKILL metadata', metadata],
    ['public docs', publicDocs.join('\n')],
    ['JSON contract', machineContract],
  ]) {
    assert.match(content, /zero-dependency/i, `${surface} must promise zero-dependency delivery`);
    assert.match(content, /text-light/i, `${surface} must carry the text-light contract`);
    assert.match(content, /motion-heavy/i, `${surface} must carry the motion-heavy contract`);
  }

  const portableFiles = [
    'README.md',
    'PUBLISHING.md',
    'SKILL.md',
    ...walkFiles('docs', (file) => file.endsWith('.md')),
    ...walkFiles('examples', (file) => file.endsWith('.md')),
    ...walkFiles('reference', (file) => /\.(?:md|json)$/.test(file)),
    ...walkFiles('templates', (file) => /\.(?:md|json|html)$/.test(file)),
  ];
  for (const file of portableFiles) {
    assert.doesNotMatch(
      readText(file),
      /(?:\/Users\/|\/home\/|[A-Za-z]:\\Users\\|\.codex\/|\.agents\/)/,
      `${file} must not couple the public package to a private machine path`,
    );
  }
});
