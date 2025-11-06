#!/usr/bin/env bun
/**
 * Command Hook Example
 *
 * Demonstrates basic command hook structure with validation logic.
 * This is a minimal example showing stdin parsing, decision logic, and exit codes.
 *
 * Event: PreToolUse (runs before tool execution)
 * Type: Command (local script execution)
 * Performance: <50ms target
 *
 * Exit codes:
 * 0 - Approve (allow tool execution)
 * 1 - Block (prevent tool execution)
 */

type HookInput = {
  tool: string;
  arguments: Record<string, unknown>;
};

type HookResult = {
  decision: 'approve' | 'block';
  reason: string;
  systemMessage?: string;
};

/**
 * Parse stdin input (JSON format)
 */
async function parseStdin(): Promise<HookInput> {
  const chunks: Buffer[] = [];

  for await (const chunk of Bun.stdin.stream()) {
    chunks.push(Buffer.from(chunk));
  }

  const input = Buffer.concat(chunks).toString('utf8');

  try {
    return JSON.parse(input) as HookInput;
  } catch (error) {
    throw new Error(
      `Failed to parse hook input: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Validate tool usage
 *
 * This is where you implement your validation logic.
 * Return 'approve' to allow tool execution, 'block' to prevent it.
 */
function validate(input: HookInput): HookResult {
  const { tool, arguments: args } = input;

  // Example 1: Block dangerous operations
  if (tool === 'Bash' && typeof args.command === 'string') {
    const command = args.command.toLowerCase();

    // Block destructive commands
    if (
      command.includes('rm -rf /') ||
      command.includes('format') ||
      command.includes('mkfs')
    ) {
      return {
        decision: 'block',
        reason: 'Destructive command detected',
        systemMessage:
          '⚠️ This command could cause data loss. Please review carefully before executing.',
      };
    }
  }

  // Example 2: Validate file paths
  if (
    (tool === 'Edit' || tool === 'Write' || tool === 'Read') &&
    typeof args.file_path === 'string'
  ) {
    const filePath = args.file_path;

    // Block operations on sensitive files
    const sensitivePatterns = [
      '/etc/passwd',
      '/etc/shadow',
      '/.env',
      '/.env.local',
      '/credentials',
    ];

    for (const pattern of sensitivePatterns) {
      if (filePath.includes(pattern)) {
        return {
          decision: 'block',
          reason: 'Sensitive file access blocked',
          systemMessage:
            '⚠️ This file contains sensitive information. Please ensure you want to modify it.',
        };
      }
    }
  }

  // Example 3: Warn about large operations
  if (tool === 'Write' && typeof args.content === 'string') {
    const content = args.content;
    const lines = content.split('\n').length;

    // Warn about very large files
    if (lines > 1000) {
      return {
        decision: 'block',
        reason: 'Large file creation detected',
        systemMessage: `⚠️ Creating a file with ${lines} lines. Consider breaking it into smaller files for better maintainability.`,
      };
    }
  }

  // Default: Approve
  return {
    decision: 'approve',
    reason: 'No issues detected',
  };
}

/**
 * Main execution
 */
async function main() {
  const startTime = performance.now();

  try {
    // Parse input from stdin
    const input = await parseStdin();

    // Validate
    const result = validate(input);

    // Performance check (warn if >50ms)
    const duration = performance.now() - startTime;
    if (duration > 50) {
      console.error(`⚠️ Hook took ${duration.toFixed(2)}ms (target: <50ms)`);
    }

    // Output result
    console.log(JSON.stringify(result, null, 2));

    // Exit with appropriate code
    process.exit(result.decision === 'approve' ? 0 : 1);
  } catch (error) {
    // Fail open: Don't block on hook errors
    console.error(
      'Hook error:',
      error instanceof Error ? error.message : String(error),
    );

    // Approve on error (fail open)
    console.log(
      JSON.stringify(
        {
          decision: 'approve',
          reason: 'Hook error (failing open)',
        },
        null,
        2,
      ),
    );

    process.exit(0);
  }
}

// Run hook
await main();
