/**
 * Hook Utilities
 *
 * Shared utilities for Claude Code command hooks.
 * Includes input parsing, configuration loading, and error handling.
 */

export {
  checkHookEnabled,
  type HookConfig,
  loadHookConfig,
} from './config-loader.js';
export {
  checkPerformance,
  formatError,
  type HookInput,
  parseStdin,
} from './hook-input.js';
