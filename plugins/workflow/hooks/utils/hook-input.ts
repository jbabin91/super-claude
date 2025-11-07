/**
 * Hook Input Parsing Utilities
 *
 * Shared utilities for parsing Claude Code hook input from stdin.
 * All hooks receive JSON via stdin with fields like cwd, tool_name, tool_input, etc.
 *
 * @see {@link https://docs.claude.com/en/docs/claude-code/hooks} for hook input spec
 */

/**
 * Standard hook input schema from Claude Code
 */
export type HookInput = {
  cwd: string; // Current working directory
  tool_name?: string; // Tool being invoked (PreToolUse/PostToolUse)
  tool_input?: Record<string, unknown>; // Tool parameters
  transcript_path?: string; // Path to conversation transcript JSON
  [key: string]: unknown; // Allow additional fields
};

/**
 * Parse hook input from stdin.
 *
 * Reads JSON from stdin and validates required fields.
 * Throws error for invalid input to fail fast.
 *
 * @returns Parsed HookInput object
 * @throws Error if stdin is invalid or missing required fields
 *
 * @example
 * ```ts
 * const input = await parseStdin();
 * console.log('Working directory:', input.cwd);
 * ```
 */
export async function parseStdin(): Promise<HookInput> {
  const stdin = await Bun.stdin.text();

  if (!stdin || stdin.trim() === '') {
    throw new Error('No input received from stdin');
  }

  try {
    const input = JSON.parse(stdin) as HookInput;

    if (!input.cwd || typeof input.cwd !== 'string') {
      throw new Error('Invalid input: missing or invalid cwd field');
    }

    return input;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON from stdin: ' + error.message);
    }
    throw error;
  }
}

/**
 * Safe error formatting for hook output
 *
 * Formats error for display to user without leaking implementation details.
 *
 * @param error Error object or unknown
 * @param prefix Optional prefix for error message
 * @returns Formatted error string
 */
export function formatError(error: unknown, prefix = 'Hook error'): string {
  const msg = error instanceof Error ? error.message : 'Unknown error';
  return `[ERROR] ${prefix}: ${msg}`;
}

/**
 * Performance monitoring helper
 *
 * Logs warning if execution exceeds target duration.
 * Use to enforce ADR-0010 performance requirements (<50ms command hooks).
 *
 * @param startTime Start time from Date.now()
 * @param targetMs Target duration in milliseconds
 * @param hookName Name of hook for warning message
 */
export function checkPerformance(
  startTime: number,
  targetMs: number,
  hookName: string,
): void {
  const duration = Date.now() - startTime;
  if (duration > targetMs) {
    console.warn(
      `[WARNING] Slow ${hookName} hook: ${duration}ms (target: ${targetMs}ms)`,
    );
  }
}
