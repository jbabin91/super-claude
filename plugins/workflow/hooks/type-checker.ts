#!/usr/bin/env bun

/**
 * Type Checker Hook
 *
 * Pre-validates TypeScript types before Edit/Write operations.
 * Uses @jbabin91/tsc-files programmatic API for incremental type checking with tsgo support.
 * Informs about type errors but allows file modifications (informative only).
 *
 * Performance: ~100-200ms with tsgo (10x faster than tsc)
 * Performance target: <2s (ADR-0010) - typically well under this
 * Hook behavior: Informative (does not block execution)
 *
 * @see {@link https://github.com/jbabin91/super-claude} for documentation
 */

import { existsSync } from 'node:fs';
import path from 'node:path';

import { checkFiles, type CheckResult } from '@jbabin91/tsc-files';

import {
  checkHookEnabled,
  checkPerformance,
  ensureBunInstalled,
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
 * Run TypeScript type checking on file using programmatic API
 *
 * @param cwd Current working directory
 * @param filePath File path to check
 * @returns CheckResult with structured error data
 */
async function checkTypes(cwd: string, filePath: string): Promise<CheckResult> {
  try {
    // Use programmatic API for structured error data
    // Automatically uses tsgo if available (10x faster)
    const result = await checkFiles([filePath], {
      cwd,
      skipLibCheck: true,
      verbose: false,
      throwOnError: false,
    });

    return result;
  } catch (error: unknown) {
    // Configuration or compiler execution error
    // Return a failed result with error message
    return {
      success: false,
      errorCount: 1,
      warningCount: 0,
      errors: [
        {
          file: filePath,
          line: 0,
          column: 0,
          message:
            error instanceof Error ? error.message : 'Unknown type error',
          code: 'TS0000',
          severity: 'error',
        },
      ],
      warnings: [],
      checkedFiles: [filePath],
      duration: 0,
    };
  }
}

/**
 * Format type errors for display with categorization
 *
 * @param result CheckResult from tsc-files API
 * @param targetFile The file being edited
 * @returns Formatted error message
 */
function formatTypeErrors(result: CheckResult, targetFile: string): string {
  // Categorize errors by file
  const targetFileErrors = result.errors.filter((e) => e.file === targetFile);
  const dependencyErrors = result.errors.filter((e) => e.file !== targetFile);

  // Header
  const sections: string[] = [
    '',
    '═'.repeat(70),
    '⚠️  TYPE ERRORS DETECTED - ACTION REQUIRED',
    '═'.repeat(70),
    '',
  ];

  // Target file errors (critical)
  if (targetFileErrors.length > 0) {
    sections.push(
      '🎯 ERRORS IN THIS FILE:',
      `   File: ${targetFile}`,
      '   Action: Fix these before proceeding to next task',
      '',
    );

    for (const err of targetFileErrors.slice(0, 10)) {
      sections.push(
        `   ${err.file}:${err.line}:${err.column}`,
        `   ${err.code}: ${err.message}`,
        '',
      );
    }

    if (targetFileErrors.length > 10) {
      sections.push(
        `   ... and ${targetFileErrors.length - 10} more errors in this file`,
        '',
      );
    }
  }

  // Dependency errors (informational)
  if (dependencyErrors.length > 0) {
    sections.push(
      '─'.repeat(70),
      'ℹ️  ERRORS IN DEPENDENCIES:',
      '   These errors are in imported files',
      '   Fix them separately or add to your todo list',
      '',
    );

    // Group by file
    const byFile = new Map<string, CheckResult['errors'][number][]>();
    for (const err of dependencyErrors) {
      if (!byFile.has(err.file)) {
        byFile.set(err.file, []);
      }
      byFile.get(err.file)!.push(err);
    }

    let fileCount = 0;
    for (const [file, errors] of byFile.entries()) {
      if (fileCount >= 5) break;
      sections.push(`   📄 ${file} (${errors.length} errors)`);
      fileCount++;
    }

    if (byFile.size > 5) {
      sections.push(`   ... and ${byFile.size - 5} more files`);
    }
    sections.push('');
  }

  // Footer with workflow guidance
  sections.push(
    '─'.repeat(70),
    '🤖 CLAUDE: Type errors detected.',
    '',
    'Recommended workflow:',
    '  1. If working on a task: Add "Fix type errors" to your todo list',
    '  2. Complete your current task first',
    '  3. Then fix these type errors before moving to next task',
    '',
    'If the type error is directly related to your current edit:',
    '  → Fix it immediately as part of this change',
    '',
    'User: To disable this hook, add to .claude/settings.json:',
    '  { "customHooks": { "typeChecker": { "enabled": false } } }',
    '═'.repeat(70),
    '',
  );

  return sections.join('\n');
}

/**
 * Main hook execution
 */
async function main(): Promise<void> {
  const startTime = Date.now();

  try {
    // Ensure Bun is installed (fail fast with helpful message)
    ensureBunInstalled();

    const input = await parseStdin();

    // Check if hook is enabled
    checkHookEnabled(input.cwd, 'typeChecker');

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

    // Check types using programmatic API
    const result = await checkTypes(input.cwd, filePath);

    if (!result.success) {
      // Type errors found - inform but allow operation
      const errorMessage = formatTypeErrors(result, filePath);

      // Output hookSpecificOutput to inform (not block)
      const output = {
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          permissionDecision: 'allow', // Informative only
          permissionDecisionReason: errorMessage,
        },
      };

      console.log(JSON.stringify(output));
      checkPerformance(startTime, 2000, 'type-checker');
      process.exit(0); // Exit 0 after informing
    }

    // Types are valid - allow operation silently
    checkPerformance(startTime, 2000, 'type-checker');
    process.exit(0);
  } catch (error) {
    console.error(formatError(error, 'type-checker'));
    // On hook error, don't block the operation
    process.exit(0);
  }
}

// Execute
await main();
