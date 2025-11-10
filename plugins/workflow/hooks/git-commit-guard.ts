#!/usr/bin/env bun

/**
 * Git Commit Guard Hook
 *
 * Prevents direct commits/pushes to protected branches (main).
 * Enforces feature branch workflow - commits should happen on feature branches.
 * Use bypass environment variable for emergencies: SKIP_COMMIT_GUARD=true
 *
 * Performance target: <50ms (ADR-0010)
 *
 * @see {@link https://github.com/jbabin91/super-claude} for documentation
 */

import { execSync } from 'node:child_process';

import { checkPerformance, formatError, parseStdin } from './utils/index.js';
import {
  checkHookEnabled,
  getHookConfig,
} from './utils/super-claude-config-loader.js';

/**
 * Get current git branch
 *
 * @param cwd Current working directory
 * @returns Current branch name or null if not in git repo
 */
function getCurrentBranch(cwd: string): string | null {
  try {
    const branch = execSync('git branch --show-current', {
      cwd,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
    return branch || null;
  } catch {
    return null;
  }
}

/**
 * Detect if Bash command is a git commit or push
 *
 * @param command Bash command string
 * @returns true if commit/push command
 */
function isGitCommitOrPush(command: string): boolean {
  const patterns = [
    /\bgit\s+commit\b/i,
    /\bgit\s+push\b/i,
    /\bgit\s+ci\b/i, // Common commit alias
  ];

  return patterns.some((pattern) => pattern.test(command));
}

/**
 * Check if command targets a protected branch
 *
 * @param command Git command
 * @param currentBranch Current branch name
 * @param protectedBranches List of protected branches
 * @returns true if targeting protected branch
 */
function targetsProtectedBranch(
  command: string,
  currentBranch: string | null,
  protectedBranches: string[],
): boolean {
  // Check if push command explicitly targets protected branch
  for (const branch of protectedBranches) {
    if (
      command.includes(`origin ${branch}`) ||
      command.includes(`origin/${branch}`)
    ) {
      return true;
    }
  }

  // Check if current branch is protected
  if (currentBranch && protectedBranches.includes(currentBranch)) {
    return true;
  }

  return false;
}

/**
 * Format blocking message
 *
 * @param currentBranch Current branch name
 * @param command Git command that was blocked
 * @param protectedBranches List of protected branches
 * @returns Formatted error message
 */
function formatBlockMessage(
  currentBranch: string | null,
  command: string,
  protectedBranches: string[],
): string {
  return [
    '',
    '═'.repeat(70),
    '⚠️  DIRECT COMMIT/PUSH TO PROTECTED BRANCH BLOCKED',
    '═'.repeat(70),
    '',
    `Protected branches: ${protectedBranches.join(', ')}`,
    `Current branch: ${currentBranch ?? 'unknown'}`,
    `Blocked command: ${command}`,
    '',
    'Feature Branch Workflow:',
    '',
    '  1. Create a feature branch:',
    '     git checkout -b feat/your-feature',
    '',
    '  2. Make commits on your feature branch:',
    '     git commit -m "feat: add new feature"',
    '',
    '  3. Push feature branch:',
    '     git push origin feat/your-feature',
    '',
    '  4. Create pull request:',
    '     gh pr create',
    '',
    '  5. After approval, merge via PR',
    '',
    'To bypass this guard (emergencies only):',
    '  SKIP_COMMIT_GUARD=true git commit -m "..."',
    '  SKIP_COMMIT_GUARD=true git push',
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

    // Check if hook is enabled and get config
    checkHookEnabled(input.cwd, 'workflow', 'gitCommitGuard');

    // Get hook configuration
    const config = getHookConfig(input.cwd, 'workflow', 'gitCommitGuard');
    const protectedBranches = (config.protectedBranches as string[]) ?? [
      'main',
      'master',
    ];
    const bypassEnvVar = (config.bypassEnvVar as string) ?? 'SKIP_COMMIT_GUARD';

    // Check for bypass flag
    if (process.env[bypassEnvVar] === 'true') {
      console.error(`[DEBUG] ${bypassEnvVar}=true - bypassing guard`);
      checkPerformance(startTime, 50, 'git-commit-guard');
      process.exit(0);
    }

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

    // Check for bypass flag in command string
    if (command.includes(`${bypassEnvVar}=true`)) {
      console.error(
        `[DEBUG] ${bypassEnvVar}=true in command - bypassing guard`,
      );
      checkPerformance(startTime, 50, 'git-commit-guard');
      process.exit(0);
    }

    // Only check git commit/push commands
    if (!isGitCommitOrPush(command)) {
      process.exit(0);
    }

    // Get current branch
    const currentBranch = getCurrentBranch(input.cwd);

    console.error('[DEBUG] git-commit-guard: Git operation detected');
    console.error(`[DEBUG] Current branch: ${currentBranch}`);
    console.error(`[DEBUG] Command: ${command}`);
    console.error(
      `[DEBUG] Protected branches: ${protectedBranches.join(', ')}`,
    );

    // Check if targeting protected branch
    if (targetsProtectedBranch(command, currentBranch, protectedBranches)) {
      // Block the operation
      console.error('[DEBUG] BLOCKING - targets protected branch');

      const output = {
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          permissionDecision: 'deny',
          permissionDecisionReason: formatBlockMessage(
            currentBranch,
            command,
            protectedBranches,
          ),
        },
      };

      console.log(JSON.stringify(output));
      checkPerformance(startTime, 50, 'git-commit-guard');
      process.exit(0);
    }

    // Allow the operation - not targeting protected branch
    console.error('[DEBUG] ALLOWING - not targeting protected branch');
    checkPerformance(startTime, 50, 'git-commit-guard');
    process.exit(0);
  } catch (error) {
    console.error(formatError(error, 'git-commit-guard'));
    // On hook error, don't block the operation
    process.exit(0);
  }
}

// Execute
await main();
