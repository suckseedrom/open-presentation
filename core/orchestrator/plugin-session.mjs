import { createPresentationComposition } from './presentation-orchestrator.mjs';

export function createPluginSession(briefText, options = {}) {
  const composition = createPresentationComposition(briefText, options);

  return {
    sessionId: composition.project.id,
    status: 'preview-ready',
    host: options.host || 'unknown',
    inputs: {
      briefText,
      requestedTemplate: composition.theme.selectedTemplate,
      requestedOutputMode: options.requestedOutputMode || 'html-player'
    },
    plan: {
      projectTitle: composition.project.title,
      templateShortlist: [
        composition.theme.selectedTemplate,
        'capsule',
        'cobalt-grid'
      ].slice(0, 3),
      sceneCount: composition.scenes.length
    },
    panels: [
      {
        id: 'brief',
        kind: 'brief',
        title: 'Brief',
        body: composition.brief.sourceSummary
      },
      {
        id: 'template',
        kind: 'template',
        title: 'Template',
        body: composition.theme.selectedTemplate
      },
      {
        id: 'scene-plan',
        kind: 'scene-plan',
        title: 'Scene plan',
        body: composition.scenes.map((scene) => `${scene.title}: ${scene.job}`).join('\n')
      },
      {
        id: 'preview',
        kind: 'preview',
        title: 'Preview',
        body: 'Render HTML preview from composition JSON and show scene-by-scene QA state.'
      },
      {
        id: 'export',
        kind: 'export',
        title: 'Export',
        body: 'Prepare HTML package and optional deterministic 4K WebM export.'
      }
    ],
    actions: [
      { id: 'generate', label: 'Generate presentation', type: 'generate' },
      { id: 'preview', label: 'Open preview', type: 'preview' },
      { id: 'export', label: 'Export 4K video', type: 'export' },
      { id: 'write-workspace', label: 'Write files to workspace', type: 'write-workspace' }
    ]
  };
}
