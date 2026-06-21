import { normalizeBrief } from './brief-normalizer.mjs';

const DEFAULT_TEMPLATES = [
  'presentation-feature-core',
  'capsule',
  'cobalt-grid'
];

const MOTION_FAMILIES = [
  'fade-reveal',
  'counter-rise',
  'proof-grid-shift',
  'camera-drift',
  'state-swap',
  'cta-lockup'
];

function sceneSeed(product) {
  return [
    {
      title: 'Reveal',
      job: 'Introduce the product promise',
      focalObject: `${product} hero frame`,
      visibleState: 'hero statement visible',
      motionFamily: MOTION_FAMILIES[0]
    },
    {
      title: 'Problem',
      job: 'Make the pain legible',
      focalObject: 'pain-point UI signal',
      visibleState: 'blocked state exposed',
      motionFamily: MOTION_FAMILIES[4]
    },
    {
      title: 'Product flow',
      job: 'Show the core interaction',
      focalObject: `${product} primary workflow`,
      visibleState: 'live state transition',
      motionFamily: MOTION_FAMILIES[1]
    },
    {
      title: 'Proof',
      job: 'Support the promise with evidence',
      focalObject: 'metric or proof block',
      visibleState: 'proof highlight active',
      motionFamily: MOTION_FAMILIES[2]
    },
    {
      title: 'CTA',
      job: 'Close with a clear next action',
      focalObject: 'final CTA lockup',
      visibleState: 'CTA settled and readable',
      motionFamily: MOTION_FAMILIES[5]
    }
  ];
}

export function createPresentationComposition(briefText, options = {}) {
  const brief = normalizeBrief(briefText);
  const templateShortlist = options.templateShortlist || [
    brief.theme || DEFAULT_TEMPLATES[0],
    ...DEFAULT_TEMPLATES.filter((template) => template !== brief.theme)
  ].slice(0, 3);

  const scenes = sceneSeed(brief.product).map((scene, index) => ({
    id: `scene-${index + 1}`,
    title: scene.title,
    job: scene.job,
    focalObject: scene.focalObject,
    visibleState: scene.visibleState,
    motionFamily: scene.motionFamily,
    durationMs: 4500 + index * 500
  }));

  return {
    version: '1.0.0',
    project: {
      id: `open-presentation-${brief.product.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'project'}`,
      title: `${brief.product} ${brief.mode}`,
      mode: brief.mode
    },
    brief: {
      product: brief.product,
      audience: brief.audience,
      goal: brief.goal,
      cta: brief.cta,
      sourceSummary: brief.sourceSummary
    },
    theme: {
      selectedTemplate: templateShortlist[0],
      paletteDirection: brief.theme || 'product-led premium contrast',
      motionDirection: 'text-light, layered, UI-first'
    },
    scenes,
    aspects: ['16:9', '9:16'],
    outputs: {
      html: true,
      videoExportReady: true,
      suggestedFiles: [
        'presentation.html',
        'presentation.json',
        'design.md'
      ]
    }
  };
}
