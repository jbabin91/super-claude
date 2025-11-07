#!/usr/bin/env bun

/**
 * Build Checker Hook
 *
 * Pre-validates TypeScript types before Edit/Write operations.
 * Uses @jbabin91/tsc-files for incremental type checking.
 * Blocks file modifications if type errors detected.
 *
 * Performance target: <2s (ADR-0010)
 * Exit code 2: Block tool execution
 *
 * @see {@link https://github.com/jbabin91/super-claude} for documentation
 */

import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

import {
  checkHookEnabled,
  checkPerformance,
  formatError,
  parseStdin,
} from './utils/index.js';

/**
 * Check if file is TypeScript
 *
 * @param filePath File path to check
 * @returns true if TypeScript file
 */
function isTypeScriptFile(filePath: string): boolean {
  return /\.(ts|tsx)$/.test(filePath);
}

/**
 * Check if tsconfig.json exists
 *
 * @param cwd Current working directory
 * @returns true if tsconfig.json found
 */
function hasTsConfig(cwd: string): boolean {
  return (
    existsSync(path.join(cwd, 'tsconfig.json')) ||
    existsSync(path.join(cwd, 'tsconfig.base.json'))
  );
}

/**
 * Run TypeScript type checking on file
 *
 * @param cwd Current working directory
 * @param filePath File path to check
 * @returns Validation result with errors
 */
function checkTypes(
  cwd: string,
  filePath: string,
): { valid: boolean; errors: string } {
  try {
    // Run tsc-files on the specific file (no --noEmit flag needed)
    execSync(`bunx tsc-files "${filePath}"`, {
      cwd,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    return { valid: true, errors: '' };
  } catch (error: unknown) {
    // Type errors will cause execSync to throw
    if (error && typeof error === 'object' && 'stderr' in error) {
      const stderr = (error as { stderr: Buffer }).stderr.toString();
      return { valid: false, errors: stderr };
    }

    return {
      valid: false,
      errors: error instanceof Error ? error.message : 'Unknown type error',
    };
  }
}

/**
 * Format type errors for display
 *
 * @param errors Raw error output from tsc-files
 * @returns Formatted error message
 */
function formatTypeErrors(errors: string): string {
  // Extract relevant error lines (filter out noise)
  const lines = errors.split('\n').filter((line) => {
    return (
      line.includes('error TS') || // TypeScript errors
      line.trim().startsWith('src/') || // File paths
      line.includes(': error') // Error markers
    );
  });

  const header = [
    '',
    '═'.repeat(70),
    '❌ TYPE ERRORS DETECTED',
    '═'.repeat(70),
    '',
    'TypeScript type errors must be fixed before modifying files.',
    'This prevents introducing type-unsafe code.',
    '',
    '─'.repeat(70),
  ].join('\n');

  const errorBlock = lines.slice(0, 20).join('\n'); // Limit to first 20 lines
  const moreErrors =
    lines.length > 20 ? `\n... and ${lines.length - 20} more errors\n` : '';

  const footer = [
    '',
    '─'.repeat(70),
    'To fix:',
    '  1. Review type errors above',
    '  2. Update types or implementation',
    '  3. Run: bun run typecheck',
    '  4. Try the edit again',
    '',
    'To disable this hook:',
    '  Add to .claude/settings.json:',
    '  { "customHooks": { "buildChecker": { "enabled": false } } }',
    '═'.repeat(70),
    '',
  ].join('\n');

  return header + errorBlock + moreErrors + footer;
}

/**
 * Main hook execution
 */
async function main(): Promise<void> {
  const startTime = Date.now();

  try {
    const input = await parseStdin();

    // Check if hook is enabled
    checkHookEnabled(input.cwd, 'buildChecker');

    // Only run for Edit and Write tools
    if (input.tool_name !== 'Edit' && input.tool_name !== 'Write') {
      process.exit(0); // Not a file modification tool
    }

    // Extract file path from tool input
    const toolInput = input.tool_input!;
    const filePath = toolInput?.file_path as string | undefined;

    if (!filePath) {
      process.exit(0); // No file path
    }

    // Skip if not TypeScript file
    if (!isTypeScriptFile(filePath)) {
      process.exit(0);
    }

    // Skip if no tsconfig
    if (!hasTsConfig(input.cwd)) {
      process.exit(0);
    }

    // Check types
    const result = checkTypes(input.cwd, filePath);

    if (!result.valid) {
      // Type errors found - block operation
      console.error(formatTypeErrors(result.errors));
      checkPerformance(startTime, 2000, 'build-checker');
      process.exit(2); // Block tool execution
    }

    // Types are valid - allow operation
    checkPerformance(startTime, 2000, 'build-checker');
    process.exit(0);
  } catch (error) {
    console.error(formatError(error, 'build-checker'));
    // On hook error, don't block the operation
    process.exit(0);
  }
}

// Execute
await main();
