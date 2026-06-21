import { createPluginSession } from '../orchestrator/plugin-session.mjs';

export function createCodexSession(briefText, options = {}) {
  return createPluginSession(briefText, {
    ...options,
    host: 'codex'
  });
}
