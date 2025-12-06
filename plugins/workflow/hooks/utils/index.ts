/**
 * Hook Utilities
 *
 * Shared utilities for Claude Code command hooks.
 * Includes input parsing, error handling, and runtime checks.
 *
 * For configuration loading, use super-claude-config-loader.js directly.
 */

export {
  checkPerformance,
  formatError,
  type HookInput,
  parseStdin,
} from './hook-input.js';
export { createLogger, logPerformance } from './logger.js';
export {
  checkBunVersion,
  ensureBunInstalled,
  ensureToolsInstalled,
} from './runtime-check.js';
