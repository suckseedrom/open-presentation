import { createPluginSession } from '../orchestrator/plugin-session.mjs';

export function createClaudeSession(briefText, options = {}) {
  return createPluginSession(briefText, {
    ...options,
    host: 'claude-code'
  });
}
