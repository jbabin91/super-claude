#!/usr/bin/env bun

/**
 * Git Commit Guard Hook
 *
 * Prevents auto-committing without explicit user request.
 * Analyzes conversation context to detect commit intent.
 * Blocks commits when Claude initiates without being asked.
 *
 * Performance target: <50ms (ADR-0010)
 * Exit code 2: Block tool execution
 *
 * @see {@link https://github.com/jbabin91/super-claude} for documentation
 */

import { existsSync, readFileSync } from 'node:fs';

import {
  checkHookEnabled,
  checkPerformance,
  formatError,
  parseStdin,
} from './utils/index.js';

/**
 * Conversation message from transcript
 */
type Message = {
  role: 'user' | 'assistant';
  content: string;
  [key: string]: unknown;
};

/**
 * Transcript file schema
 */
type Transcript = {
  messages: Message[];
  [key: string]: unknown;
};

/**
 * Detect if Bash command is a git commit
 *
 * @param command Bash command string
 * @returns true if commit command
 */
function isGitCommit(command: string): boolean {
  // Match git commit variants
  const patterns = [
    /\bgit\s+commit\b/i,
    /\bgit\s+ci\b/i, // Common alias
  ];

  return patterns.some((pattern) => pattern.test(command));
}

/**
 * Load and parse transcript file
 *
 * @param transcriptPath Path to transcript JSON
 * @returns Parsed transcript or null
 */
function loadTranscript(transcriptPath: string): Transcript | null {
  if (!existsSync(transcriptPath)) {
    return null;
  }

  try {
    const content = readFileSync(transcriptPath, 'utf8');
    return JSON.parse(content) as Transcript;
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.warn(`[WARNING] Failed to load transcript: ${msg}`);
    return null;
  }
}

/**
 * Check if user explicitly requested commit
 *
 * Looks for commit intent keywords in recent user messages.
 *
 * @param messages Conversation messages
 * @param lookback Number of recent messages to check
 * @returns true if explicit commit intent found
 */
function hasExplicitCommitIntent(messages: Message[], lookback = 10): boolean {
  // Get recent user messages
  const recentMessages = messages.slice(-lookback);
  const userMessages = recentMessages.filter((m) => m.role === 'user');

  // Explicit commit keywords
  const commitKeywords = [
    /\bcommit\s+(these|this|the)\s+(changes?|files?)\b/i,
    /\bcreate\s+a\s+commit\b/i,
    /\bmake\s+a\s+commit\b/i,
    /\bcommit\s+it\b/i,
    /\bcommit\s+them\b/i,
    /\blet'?s\s+commit\b/i,
    /\bcan\s+you\s+commit\b/i,
    /\bplease\s+commit\b/i,
    /\bgit\s+commit\b/i,
  ];

  // Check each user message for explicit commit request
  for (const message of userMessages) {
    const content = message.content.toLowerCase();
    if (commitKeywords.some((pattern) => pattern.test(content))) {
      return true;
    }
  }

  return false;
}

/**
 * Format blocking message for user
 *
 * @returns Formatted warning message
 */
function formatBlockMessage(): string {
  return [
    '',
    '═'.repeat(70),
    '⚠️  COMMIT BLOCKED: No explicit commit request detected',
    '═'.repeat(70),
    '',
    'This hook prevents auto-committing without your explicit request.',
    '',
    'If you want to commit, please explicitly ask:',
    '  • "commit these changes"',
    '  • "create a commit with this"',
    '  • "please commit this"',
    '',
    'If this is a false positive or you want to disable this guard:',
    '',
    'Option 1: Add to .claude/settings.json (project-wide):',
    '  {',
    '    "customHooks": {',
    '      "gitCommitGuard": { "enabled": false }',
    '    }',
    '  }',
    '',
    'Option 2: Add to .claude/settings.local.json (personal):',
    '  {',
    '    "customHooks": {',
    '      "gitCommitGuard": { "enabled": false }',
    '    }',
    '  }',
    '',
    'Option 3: Use environment variable:',
    '  export CLAUDE_HOOK_GITCOMMITGUARD_ENABLED=false',
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
    checkHookEnabled(input.cwd, 'gitCommitGuard');

    // Only run for Bash tool
    if (input.tool_name !== 'Bash') {
      process.exit(0);
    }

    // Extract command from tool input
    const toolInput = input.tool_input!;
    const command = toolInput?.command as string | undefined;

    if (!command) {
      process.exit(0); // No command
    }

    // Check if this is a git commit command
    if (!isGitCommit(command)) {
      process.exit(0); // Not a commit command
    }

    // Load transcript to check for commit intent
    const transcriptPath = input.transcript_path;

    if (!transcriptPath) {
      // No transcript available - allow commit (graceful degradation)
      checkPerformance(startTime, 50, 'git-commit-guard');
      process.exit(0);
    }

    const transcript = loadTranscript(transcriptPath);

    if (!transcript) {
      // Failed to load transcript - allow commit (graceful degradation)
      checkPerformance(startTime, 50, 'git-commit-guard');
      process.exit(0);
    }

    // Check for explicit commit intent
    const hasIntent = hasExplicitCommitIntent(transcript.messages);

    if (!hasIntent) {
      // No explicit intent - block commit
      console.error(formatBlockMessage());
      checkPerformance(startTime, 50, 'git-commit-guard');
      process.exit(2); // Block tool execution
    }

    // Explicit intent found - allow commit
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
