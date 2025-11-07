#!/usr/bin/env bun

/**
 * Session Checklist Hook
 *
 * Displays quick project status at session start:
 * - Git status (branch, staged files, recent commits)
 * - Active OpenSpec changes
 * - Quick command reference
 *
 * Performance target: <100ms (ADR-0010)
 *
 * @see {@link https://github.com/jbabin91/super-claude} for documentation
 */

import { execSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';

import { checkPerformance, formatError, parseStdin } from './utils/index.js';

/**
 * Get git status information
 *
 * @param cwd Current working directory
 * @returns Git status summary or null if not a git repo
 */
function getGitStatus(cwd: string): {
  branch: string;
  staged: number;
  unstaged: number;
  untracked: number;
} | null {
  try {
    // Get branch (also validates git repo)
    const branch = execSync('git branch --show-current', {
      cwd,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();

    // Get status counts
    const status = execSync('git status --porcelain', {
      cwd,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let staged = 0;
    let unstaged = 0;
    let untracked = 0;

    for (const line of status.split('\n')) {
      if (!line) continue;
      const x = line[0];
      const y = line[1];

      if (x !== ' ' && x !== '?') staged++;
      if (y !== ' ' && y !== '?') unstaged++;
      if (x === '?' && y === '?') untracked++;
    }

    return { branch, staged, unstaged, untracked };
  } catch {
    return null; // Not a git repo or git error
  }
}

/**
 * Get recent commits
 *
 * @param cwd Current working directory
 * @param count Number of commits to fetch
 * @returns Array of commit summaries
 */
function getRecentCommits(cwd: string, count = 3): string[] {
  try {
    const log = execSync(
      `git log -n ${count} --pretty=format:"%h %s" --no-decorate`,
      { cwd, encoding: 'utf8' },
    );
    return log.split('\n').filter((line) => line.trim());
  } catch {
    return [];
  }
}

/**
 * Get active OpenSpec changes
 *
 * @param cwd Current working directory
 * @returns Array of change names
 */
function getActiveChanges(cwd: string): string[] {
  const changesDir = path.join(cwd, 'openspec', 'changes');

  if (!existsSync(changesDir)) {
    return [];
  }

  try {
    const entries = readdirSync(changesDir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory() && entry.name !== 'archive')
      .map((entry) => entry.name);
  } catch {
    return [];
  }
}

/**
 * Format checklist output
 *
 * @param cwd Current working directory
 * @returns Formatted checklist string
 */
function formatChecklist(cwd: string): string {
  const git = getGitStatus(cwd);
  const commits = getRecentCommits(cwd);
  const changes = getActiveChanges(cwd);

  const lines = ['═'.repeat(70), '📋 SESSION CHECKLIST', '═'.repeat(70), ''];

  // Git status
  if (git) {
    lines.push('Git Status:', `  Branch: ${git.branch}`);

    const status = [];
    if (git.staged > 0) status.push(`${git.staged} staged`);
    if (git.unstaged > 0) status.push(`${git.unstaged} modified`);
    if (git.untracked > 0) status.push(`${git.untracked} untracked`);

    if (status.length > 0) {
      lines.push(`  Status: ${status.join(', ')}`);
    } else {
      lines.push('  Status: Clean working directory');
    }

    // Recent commits
    if (commits.length > 0) {
      lines.push('', 'Recent Commits:');
      for (const commit of commits) {
        lines.push(`  ${commit}`);
      }
    }
  } else {
    lines.push('Git: Not a git repository');
  }

  lines.push('');

  // OpenSpec changes
  if (changes.length > 0) {
    lines.push('Active Changes:');
    for (const change of changes) {
      lines.push(`  • ${change}`);
    }
  } else {
    lines.push('OpenSpec: No active changes');
  }

  // Quick reference
  lines.push(
    '',
    '─'.repeat(70),
    'Quick Commands:',
    '  openspec list              # List active changes',
    '  openspec show <change>     # View change details',
    '  git status                 # Detailed git status',
    '  bun run format             # Format code',
    '  bun run lint               # Lint code',
    '═'.repeat(70),
  );

  return lines.join('\n');
}

/**
 * Main hook execution
 */
async function main(): Promise<void> {
  const startTime = Date.now();

  try {
    const input = await parseStdin();

    // Output checklist
    const checklist = formatChecklist(input.cwd);
    console.log(checklist);

    // Performance check
    checkPerformance(startTime, 100, 'session-checklist');

    process.exit(0);
  } catch (error) {
    console.error(formatError(error, 'session-checklist'));
    // Don't fail session start - exit cleanly
    process.exit(0);
  }
}

// Execute
await main();
