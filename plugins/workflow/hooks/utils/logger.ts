/**
 * Shared Logging Utility for Hooks
 *
 * Provides consistent log formatting across all Claude Code hooks.
 * All output goes to stderr to keep stdout clean for hook responses.
 *
 * Format: [LEVEL] hook-name: message
 */

type LogLevel = 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR';

/**
 * Create a logger instance for a specific hook
 *
 * @param hookName Name of the hook (e.g., 'git-commit-guard')
 * @returns Logger object with debug, info, warn, error methods
 *
 * @example
 * ```ts
 * const log = createLogger('git-commit-guard');
 * log.debug('Checking branch name');
 * log.warn('Branch not found, skipping');
 * log.error('Failed to parse input');
 * ```
 */
export function createLogger(hookName: string) {
  const format = (level: LogLevel, message: string): string => {
    return `[${level}] ${hookName}: ${message}`;
  };

  return {
    /**
     * Debug-level logging (development/troubleshooting)
     */
    debug: (message: string): void => {
      console.error(format('DEBUG', message));
    },

    /**
     * Info-level logging (normal operation)
     */
    info: (message: string): void => {
      console.error(format('INFO', message));
    },

    /**
     * Warning-level logging (recoverable issues)
     */
    warn: (message: string): void => {
      console.error(format('WARNING', message));
    },

    /**
     * Error-level logging (failures)
     */
    error: (message: string): void => {
      console.error(format('ERROR', message));
    },
  };
}
