#!/usr/bin/env bun

/**
 * SessionStart Hook for OpenSpec Workflow
 *
 * This hook automatically loads context from the active OpenSpec change when
 * a new Claude Code session starts or resumes. It reads .openspec/active.json
 * to find the current change, then loads the proposal, design, and tasks to
 * restore context seamlessly.
 *
 * @see {@link https://github.com/jbabin91/super-claude} for documentation
 *
 * Runtime: Bun (native TypeScript support)
 * Execution: Triggered on session start/resume
 * Performance Target: <100ms
 */

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { checkPerformance, parseStdin } from './utils/index.js';
import { checkHookEnabled } from './utils/super-claude-config-loader.js';

/**
 * Active change tracker schema
 */
type ActiveChange = {
  change: string; // Change ID (folder name)
  started: string; // ISO 8601 timestamp
  lastCheckpoint: string; // ISO 8601 timestamp
};

/**
 * Load active change from openspec/active.json
 *
 * @param cwd Current working directory
 * @returns ActiveChange object or null if not found
 */
function loadActiveChange(cwd: string): ActiveChange | null {
  const activePath = path.resolve(cwd, 'openspec/active.json');

  if (!existsSync(activePath)) {
    return null;
  }

  try {
    const content = readFileSync(activePath, 'utf8');
    const active = JSON.parse(content) as ActiveChange;

    // Validate required fields
    if (!active.change || typeof active.change !== 'string') {
      console.warn('[WARNING] Invalid active.json: missing change field');
      return null;
    }

    return active;
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.warn('[WARNING] Failed to load active.json: ' + msg);
    return null;
  }
}

/**
 * Load file content safely with fallback
 *
 * @param path File path
 * @param fallback Fallback message if file not found
 * @returns File content or fallback
 */
function loadFileContent(path: string, fallback: string): string {
  if (!existsSync(path)) {
    return fallback;
  }

  try {
    return readFileSync(path, 'utf8');
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.warn('[WARNING] Failed to read ' + path + ': ' + msg);
    return fallback;
  }
}

/**
 * Count completed and total tasks from tasks.md
 *
 * @param tasksContent Content of tasks.md
 * @returns Object with total and completed counts
 */
function countTasks(tasksContent: string): {
  total: number;
  completed: number;
} {
  const lines = tasksContent.split('\n');
  let total = 0;
  let completed = 0;

  for (const line of lines) {
    if (line.trim().startsWith('- [x]') || line.trim().startsWith('- [X]')) {
      completed++;
      total++;
    } else if (line.trim().startsWith('- [ ]')) {
      total++;
    }
  }

  return { total, completed };
}

/**
 * Format time elapsed since timestamp
 *
 * @param timestamp ISO 8601 timestamp
 * @returns Human-readable time elapsed
 */
function formatTimeElapsed(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();

  const minutes = Math.floor(diffMs / 1000 / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return days + (days === 1 ? ' day ago' : ' days ago');
  if (hours > 0) return hours + (hours === 1 ? ' hour ago' : ' hours ago');
  if (minutes > 0)
    return minutes + (minutes === 1 ? ' minute ago' : ' minutes ago');
  return 'just now';
}

/**
 * Get last N lines from content
 *
 * @param content File content
 * @param n Number of lines
 * @returns Last N lines
 */
function getLastLines(content: string, n: number): string {
  const lines = content.trim().split('\n');
  const lastN = lines.slice(-n);
  return lastN.join('\n');
}

/**
 * Format context output for Claude
 *
 * @param active Active change data
 * @param cwd Current working directory
 * @returns Formatted context string
 */
function formatContext(active: ActiveChange, cwd: string): string {
  const changeDir = path.resolve(cwd, 'openspec/changes', active.change);

  // Check if change directory exists
  if (!existsSync(changeDir)) {
    return (
      '⚠️  Active change "' +
      active.change +
      '" not found.\n' +
      'It may have been archived. Use /openspec:work to select a new change.'
    );
  }

  // Load context files
  const proposalPath = path.join(changeDir, 'proposal.md');
  const designPath = path.join(changeDir, 'design.md');
  const tasksPath = path.join(changeDir, 'tasks.md');

  const proposal = loadFileContent(
    proposalPath,
    '(No proposal.md - create one with /openspec:proposal)',
  );
  const design = loadFileContent(
    designPath,
    '(No design.md - create one to track your approach)',
  );
  const tasks = loadFileContent(tasksPath, '(No tasks.md - no tasks defined)');

  // Count task progress
  const taskCounts = countTasks(tasks);
  const percentage =
    taskCounts.total > 0
      ? Math.round((taskCounts.completed / taskCounts.total) * 100)
      : 0;

  // Format timestamps
  const startedAgo = formatTimeElapsed(active.started);
  const checkpointAgo = active.lastCheckpoint
    ? formatTimeElapsed(active.lastCheckpoint)
    : 'never';

  // Build output
  const recentContext = getLastLines(design, 15);

  const lines = [
    '='.repeat(70),
    '📋 RESUMING OPENSPEC WORK',
    '='.repeat(70),
    '',
    'Active Change: ' + active.change,
    'Started: ' + startedAgo,
    'Last Checkpoint: ' + checkpointAgo,
    '',
    'Progress:',
    '  Tasks: ' +
      taskCounts.completed +
      '/' +
      taskCounts.total +
      ' (' +
      percentage +
      '%)',
    '',
    '-'.repeat(70),
    'PROPOSAL (WHY)',
    '-'.repeat(70),
    proposal,
    '',
    '-'.repeat(70),
    'DESIGN (HOW - Living Doc)',
    '-'.repeat(70),
    design,
    '',
    '-'.repeat(70),
    'RECENT CHECKPOINT NOTES',
    '-'.repeat(70),
    recentContext,
    '',
    '-'.repeat(70),
    'TASKS (WHAT)',
    '-'.repeat(70),
    tasks,
    '',
    '='.repeat(70),
    'COMMANDS:',
    '  /openspec:status - Check progress',
    '  /openspec:checkpoint - Save progress',
    '  /openspec:work - Switch changes',
    '  /openspec:done - Complete and archive',
    '='.repeat(70),
  ];

  return lines.join('\n');
}

/**
 * Main hook execution
 *
 * Workflow:
 * 1. Parse stdin
 * 2. Load active change
 * 3. If active, load context files
 * 4. Format and output context
 * 5. Exit cleanly
 */
async function main(): Promise<void> {
  const startTime = Date.now();

  try {
    // 1. Parse input
    const input = await parseStdin();

    // 2. Check if project has openspec directory (exit early if not)
    const openspecDir = path.resolve(input.cwd, 'openspec');
    if (!existsSync(openspecDir)) {
      process.exit(0); // Not an OpenSpec project, exit silently
    }

    // 3. Check if hook is enabled
    checkHookEnabled(input.cwd, 'workflow', 'sessionStart');

    // 4. Load active change
    const active = loadActiveChange(input.cwd);

    // If no active change, exit silently (no output)
    if (!active) {
      process.exit(0);
    }

    // 3. Format and output context
    const context = formatContext(active, input.cwd);
    console.log(context);

    // Performance monitoring
    checkPerformance(startTime, 100, 'session-start');

    process.exit(0);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('[ERROR] SessionStart hook error: ' + msg);
    // Don't fail the session start - just exit silently
    process.exit(0);
  }
}

// Execute
await main();
