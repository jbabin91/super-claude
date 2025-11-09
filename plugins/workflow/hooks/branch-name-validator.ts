#!/usr/bin/env bun

/**
 * Branch Name Validator Hook
 *
 * Enforces conventional commit prefixes for branch names (GitHub Flow).
 * Valid patterns: feat/*, fix/*, chore/*, docs/*, test/*, refactor/*, perf/*
 * Allows main/master (protected branches).
 *
 * Performance target: <50ms (ADR-0010)
 *
 * @see {@link https://github.com/jbabin91/super-claude} for documentation
 */

import {
  checkHookEnabled,
  checkPerformance,
  formatError,
  parseStdin,
} from './utils/index.js';

/**
 * Valid conventional commit types for branch naming
 */
const VALID_PREFIXES = [
  'feat', // New features
  'fix', // Bug fixes
  'docs', // Documentation
  'style', // Code style (formatting, missing semicolons, etc.)
  'refactor', // Code refactoring
  'perf', // Performance improvements
  'test', // Adding or updating tests
  'build', // Build system or dependencies
  'ci', // CI/CD changes
  'chore', // Maintenance tasks
  'revert', // Reverting changes
];

/**
 * Branches that are always allowed (protected branches)
 */
const ALLOWED_BRANCHES = new Set(['main', 'master', 'develop']);

/**
 * Extract branch name from git checkout command
 *
 * @param command Git command string
 * @returns Branch name or null if not a checkout -b command
 */
function extractBranchName(command: string): string | null {
  // Match: git checkout -b <branch-name>
  const match = /git\s+checkout\s+-b\s+([^\s]+)/.exec(command);
  return match ? match[1] : null;
}

/**
 * Validate branch name follows conventional commit pattern
 *
 * @param branchName Branch name to validate
 * @returns true if valid, false otherwise
 */
function isValidBranchName(branchName: string): boolean {
  // Allow protected branches
  if (ALLOWED_BRANCHES.has(branchName)) {
    return true;
  }

  // Check if follows pattern: <type>/<description>
  const pattern = new RegExp(`^(${VALID_PREFIXES.join('|')})/[a-z0-9-]+$`);
  return pattern.test(branchName);
}

/**
 * Get suggested branch name from invalid name
 *
 * @param branchName Invalid branch name
 * @returns Suggested valid branch name
 */
function suggestBranchName(branchName: string): string {
  // Try to extract a valid prefix if present
  for (const prefix of VALID_PREFIXES) {
    if (branchName.toLowerCase().includes(prefix)) {
      const description = branchName
        .toLowerCase()
        .replace(new RegExp(`^${prefix}[/-]?`), '')
        .replaceAll(/[^a-z0-9-]/g, '-')
        .replaceAll(/-+/g, '-')
        .replaceAll(/^-|-$/g, '');

      return description ? `${prefix}/${description}` : `${prefix}/description`;
    }
  }

  // Default suggestion
  return `feat/${branchName.toLowerCase().replaceAll(/[^a-z0-9-]/g, '-')}`;
}

/**
 * Format blocking message
 *
 * @param branchName Invalid branch name
 * @returns Formatted error message
 */
function formatBlockMessage(branchName: string): string {
  const suggested = suggestBranchName(branchName);

  return [
    '',
    '═'.repeat(70),
    '❌ INVALID BRANCH NAME',
    '═'.repeat(70),
    '',
    `Branch name: ${branchName}`,
    '',
    'GitHub Flow + Conventional Commits requires:',
    '  <type>/<description>',
    '',
    'Valid types:',
    `  ${VALID_PREFIXES.join(', ')}`,
    '',
    'Description rules:',
    '  • Use kebab-case (lowercase with hyphens)',
    '  • Be descriptive and concise',
    '  • Use letters, numbers, and hyphens only',
    '',
    '✅ Valid examples:',
    '  feat/user-authentication',
    '  fix/memory-leak-in-parser',
    '  docs/api-reference',
    '  test/validate-branch-names',
    '  refactor/simplify-hooks',
    '',
    '❌ Invalid examples:',
    '  feature/auth (use "feat" not "feature")',
    '  fix_bug (use "/" not "_")',
    '  MyFeature (no type prefix)',
    '  feat/Fix Bug (use kebab-case)',
    '',
    `💡 Suggested: git checkout -b ${suggested}`,
    '',
    '═'.repeat(70),
    '',
  ].join('\n');
}

/**
 * Main hook execution
 */
async function main(): Promise<void> {
  const startTime = Date.now();

  try {
    const input = await parseStdin();

    // Check if hook is enabled
    checkHookEnabled(input.cwd, 'branchNameValidator');

    // Only run for Bash tool
    if (input.tool_name !== 'Bash') {
      process.exit(0);
    }

    // Extract command from tool input
    const toolInput = input.tool_input!;
    const command = toolInput?.command as string | undefined;

    if (!command) {
      process.exit(0);
    }

    // Only check git checkout -b commands
    if (!command.includes('git checkout -b')) {
      process.exit(0);
    }

    // Extract branch name
    const branchName = extractBranchName(command);

    if (!branchName) {
      process.exit(0);
    }

    console.error('[DEBUG] branch-name-validator: Checking branch name');
    console.error(`[DEBUG] Branch name: ${branchName}`);

    // Validate branch name
    if (!isValidBranchName(branchName)) {
      // Block the operation
      console.error('[DEBUG] BLOCKING - invalid branch name');

      const output = {
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          permissionDecision: 'deny',
          permissionDecisionReason: formatBlockMessage(branchName),
        },
      };

      console.log(JSON.stringify(output));
      checkPerformance(startTime, 50, 'branch-name-validator');
      process.exit(0);
    }

    // Allow the operation - valid branch name
    console.error('[DEBUG] ALLOWING - valid branch name');
    checkPerformance(startTime, 50, 'branch-name-validator');
    process.exit(0);
  } catch (error) {
    console.error(formatError(error, 'branch-name-validator'));
    // On hook error, don't block the operation
    process.exit(0);
  }
}

// Execute
await main();
