const DEFAULT_MODE = 'video-ad';

function detectValue(lines, labels) {
  for (const line of lines) {
    const normalized = line.toLowerCase();
    for (const label of labels) {
      if (normalized.startsWith(`${label.toLowerCase()}:`)) {
        return line.slice(line.indexOf(':') + 1).trim();
      }
    }
  }
  return '';
}

function detectMode(text) {
  const normalized = text.toLowerCase();
  if (normalized.includes('pitch deck') || normalized.includes('pitch-deck')) return 'pitch-deck';
  if (normalized.includes('product demo')) return 'product-demo';
  if (normalized.includes('launch')) return 'launch-video';
  if (normalized.includes('presentation')) return 'presentation';
  return DEFAULT_MODE;
}

export function normalizeBrief(briefText) {
  const text = String(briefText || '').trim();
  if (!text) {
    throw new Error('normalizeBrief requires non-empty brief text');
  }

  const lines = text
    .split('\n')
    .map((line) => line.replace(/^[>\-\*\s]+/, '').trim())
    .filter(Boolean);

  const product =
    detectValue(lines, ['Product', 'Brand', 'Client']) ||
    lines[0].slice(0, 120);
  const audience = detectValue(lines, ['Audience', 'Target']);
  const goal =
    detectValue(lines, ['Goal', 'Promise', 'Focus']) ||
    'Create a cinematic, text-light presentation flow';
  const cta = detectValue(lines, ['CTA', 'Call to action']);
  const theme = detectValue(lines, ['Theme', 'Style']);
  const problem = detectValue(lines, ['Problem']);
  const sourceSummary = lines.slice(0, 6).join(' | ');

  return {
    product,
    audience,
    goal,
    cta,
    theme,
    problem,
    sourceSummary,
    mode: detectMode(text),
    rawText: text
  };
}
