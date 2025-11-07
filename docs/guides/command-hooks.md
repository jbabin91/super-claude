# Command Hooks Guide

Guide for creating and using Claude Code command hooks in super-claude.

## Table of Contents

- [Overview](#overview)
- [When to Use Command Hooks](#when-to-use-command-hooks)
- [Hook Events](#hook-events)
- [Hook Type Selection](#hook-type-selection)
- [Creating a Command Hook](#creating-a-command-hook)
- [Configuration System](#configuration-system)
- [Implementation Examples](#implementation-examples)
- [Testing Strategies](#testing-strategies)
- [Performance Optimization](#performance-optimization)
- [Troubleshooting](#troubleshooting)

## Overview

Command hooks are local scripts that execute in response to Claude Code events. They run with zero token cost, fast execution (<50ms target), and work offline.

**Key characteristics:**

- **Zero tokens**: No LLM calls, pure TypeScript/JavaScript
- **Fast**: Target <50ms for most hooks, <2s for type checking
- **Offline**: No network required
- **Deterministic**: Consistent behavior across sessions

**Use cases:**

- Session initialization and context loading
- Type checking before file modifications
- Commit guard rails
- Workflow automation

## When to Use Command Hooks

Use command hooks when:

- Logic is deterministic (rule-based, no semantic analysis needed)
- Performance matters (frequent execution)
- Offline operation required
- Zero token cost is priority

Use prompt hooks when:

- Semantic analysis required (understanding intent, tone, content quality)
- Natural language processing needed
- Cost of 200-500 tokens justified

See [ADR-0010: Hook Type Selection](../architecture/decisions/ADR-0010-hook-type-selection.md) for complete decision matrix.

## Hook Events

Claude Code provides five hook events:

### SessionStart

Triggered when Claude Code session starts or resumes.

**Use cases:**

- Load project context
- Display status summaries
- Initialize session state

**Example:** `session-checklist.ts` - Shows git status, recent commits, active OpenSpec changes

### PreToolUse

Triggered before tool execution. Receives tool name and input.

**Use cases:**

- Validate inputs before execution
- Block unsafe operations
- Pre-check conditions (type errors, test failures)

**Example:** `build-checker.ts` - Type checks before Edit/Write

**Exit codes:**

- `0` - Approve tool execution
- `2` - Block tool execution (stderr shown to user)

### PostToolUse

Triggered after tool execution. Receives tool result.

**Use cases:**

- Update state based on tool results
- Trigger follow-up actions
- Log activity

### UserPromptSubmit

Triggered when user submits prompt.

**Use cases:**

- Skill auto-activation (see `skill-activation-prompt.ts`)
- Prompt enhancement
- Context injection

### Stop

Triggered when session stops.

**Use cases:**

- Cleanup resources
- Save state
- Final validations

## Hook Type Selection

Decision matrix from ADR-0010:

| Criteria       | Command Hook              | Prompt Hook           |
| -------------- | ------------------------- | --------------------- |
| **Logic type** | Deterministic, rule-based | Semantic, contextual  |
| **Latency**    | <50ms typical             | 200-1000ms            |
| **Token cost** | 0 tokens                  | 200-500 tokens        |
| **Offline**    | Yes                       | No (requires network) |
| **Use case**   | Type checking, validation | Code quality, style   |

**Default**: Prefer command hooks unless semantic analysis explicitly required.

## Creating a Command Hook

### 1. Basic Structure

```typescript
#!/usr/bin/env bun

/**
 * Hook Name
 *
 * Description of what the hook does.
 * Performance target: <50ms (or specific target)
 *
 * @see {@link https://github.com/jbabin91/super-claude} for documentation
 */

import { parseStdin, checkPerformance, formatError } from './utils/index.js';

async function main(): Promise<void> {
  const startTime = Date.now();

  try {
    // 1. Parse stdin
    const input = await parseStdin();

    // 2. Hook logic here
    // ...

    // 3. Performance check
    checkPerformance(startTime, 50, 'hook-name');

    process.exit(0); // Approve
  } catch (error) {
    console.error(formatError(error, 'hook-name'));
    process.exit(0); // Don't fail session on hook error
  }
}

await main();
```

### 2. Make Executable

```sh
chmod +x plugins/workflow/hooks/your-hook.ts
```

### 3. Hook Input Schema

Claude Code passes JSON via stdin:

```typescript
type HookInput = {
  cwd: string; // Current working directory
  tool_name?: string; // Tool being invoked (PreToolUse/PostToolUse)
  tool_input?: Record<string, unknown>; // Tool parameters
  transcript_path?: string; // Path to conversation JSON
  [key: string]: unknown;
};
```

**Use utility:**

```typescript
import { parseStdin } from './utils/index.js';

const input = await parseStdin(); // Validates and parses
console.log('Working directory:', input.cwd);
```

### 4. Exit Codes

- `0` - Success (approve operation)
- `2` - Block operation (PreToolUse only, shows stderr to user)
- Other - Treated as error (operation allowed, warning logged)

## Configuration System

Hooks can be configured via settings hierarchy.

### Settings Hierarchy

**Precedence** (highest to lowest):

1. Enterprise managed settings
2. CLI arguments
3. `.claude/settings.local.json` (gitignored, personal overrides)
4. `.claude/settings.json` (project, committed)
5. `~/.claude/settings.json` (global)
6. Environment variables
7. Default (enabled: true)

### Custom Hook Configuration

Use `customHooks` namespace in settings:

**Project settings** (`.claude/settings.json`):

```json
{
  "customHooks": {
    "gitCommitGuard": {
      "enabled": true
    },
    "buildChecker": {
      "enabled": true
    }
  }
}
```

**Personal overrides** (`.claude/settings.local.json`):

```json
{
  "customHooks": {
    "gitCommitGuard": {
      "enabled": false // Disable for this developer only
    }
  }
}
```

**Environment variable**:

```sh
export CLAUDE_HOOK_GITCOMMITGUARD_ENABLED=false
```

### Load Configuration

Use the utility:

```typescript
import { checkHookEnabled } from './utils/index.js';

async function main(): Promise<void> {
  const input = await parseStdin();

  // Exits cleanly if disabled
  checkHookEnabled(input.cwd, 'hookName');

  // Continue with hook logic...
}
```

## Implementation Examples

### Example 1: Session Checklist Hook

**Event:** SessionStart
**Purpose:** Display project status at session start

```typescript
// plugins/workflow/hooks/session-checklist.ts

function getGitStatus(cwd: string) {
  const branch = execSync('git branch --show-current', {
    cwd,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
  }).trim();

  const status = execSync('git status --porcelain', {
    cwd,
    encoding: 'utf8',
  });

  // Parse status...
  return { branch, staged, unstaged, untracked };
}

async function main(): Promise<void> {
  const input = await parseStdin();
  const git = getGitStatus(input.cwd);

  console.log(`Branch: ${git.branch}`);
  console.log(`Status: ${git.staged} staged, ${git.unstaged} modified`);

  process.exit(0);
}
```

**Key points:**

- Fast git commands
- Simple output formatting
- No blocking (exit 0)

### Example 2: Build Checker Hook

**Event:** PreToolUse (Edit/Write)
**Purpose:** Validate TypeScript types before file modifications

```typescript
// plugins/workflow/hooks/build-checker.ts

function checkTypes(cwd: string, filePath: string) {
  try {
    execSync(`bunx tsc-files --noEmit "${filePath}"`, {
      cwd,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return { valid: true, errors: '' };
  } catch (error) {
    return { valid: false, errors: error.stdout };
  }
}

async function main(): Promise<void> {
  const input = await parseStdin();

  // Only for Edit/Write tools
  if (input.tool_name !== 'Edit' && input.tool_name !== 'Write') {
    process.exit(0);
  }

  const filePath = input.tool_input?.file_path;
  if (!filePath || !isTypeScriptFile(filePath)) {
    process.exit(0);
  }

  const result = checkTypes(input.cwd, filePath);

  if (!result.valid) {
    console.error(formatTypeErrors(result.errors));
    process.exit(2); // Block operation
  }

  process.exit(0); // Allow operation
}
```

**Key points:**

- Tool name filtering
- Incremental checking (tsc-files)
- Exit code 2 to block
- User-friendly error formatting

### Example 3: Git Commit Guard Hook

**Event:** PreToolUse (Bash)
**Purpose:** Prevent auto-committing without explicit user request

```typescript
// plugins/workflow/hooks/git-commit-guard.ts

function hasExplicitCommitIntent(messages: Message[]): boolean {
  const userMessages = messages.filter((m) => m.role === 'user');

  const commitKeywords = [
    /\bcommit\s+(these|this|the)\s+(changes?|files?)\b/i,
    /\bcreate\s+a\s+commit\b/i,
    /\blet'?s\s+commit\b/i,
  ];

  return userMessages.some((msg) =>
    commitKeywords.some((pattern) => pattern.test(msg.content)),
  );
}

async function main(): Promise<void> {
  const input = await parseStdin();
  checkHookEnabled(input.cwd, 'gitCommitGuard');

  if (input.tool_name !== 'Bash') process.exit(0);

  const command = input.tool_input?.command;
  if (!isGitCommit(command)) process.exit(0);

  const transcript = loadTranscript(input.transcript_path);
  const hasIntent = hasExplicitCommitIntent(transcript.messages);

  if (!hasIntent) {
    console.error('⚠️  COMMIT BLOCKED: No explicit request detected');
    process.exit(2); // Block commit
  }

  process.exit(0); // Allow commit
}
```

**Key points:**

- Configuration support
- Transcript parsing
- Intent detection
- Graceful degradation (allow if transcript unavailable)

## Testing Strategies

### Manual Testing

Test hooks by simulating stdin input:

```sh
# Test session-checklist
printf '{"cwd":"%s"}' "$(pwd)" | plugins/workflow/hooks/session-checklist.ts

# Test build-checker with Edit tool
cat > /tmp/test-input.json <<EOF
{
  "cwd": "$(pwd)",
  "tool_name": "Edit",
  "tool_input": {
    "file_path": "src/example.ts"
  }
}
EOF
cat /tmp/test-input.json | plugins/workflow/hooks/build-checker.ts

# Test git-commit-guard with Bash tool
cat > /tmp/test-commit.json <<EOF
{
  "cwd": "$(pwd)",
  "tool_name": "Bash",
  "tool_input": {
    "command": "git commit -m 'test'"
  }
}
EOF
cat /tmp/test-commit.json | plugins/workflow/hooks/git-commit-guard.ts
```

### Integration Testing

Test in actual Claude Code session:

1. Register hook in `plugin.json`
2. Start new session
3. Trigger hook event
4. Verify behavior

**Example:**

```sh
# Test build-checker
# 1. Create TypeScript file with error
echo 'const x: string = 123;' > test.ts

# 2. Ask Claude to edit the file
# "Please edit test.ts and add a comment"

# Expected: Hook blocks with type error message
```

### Performance Testing

Use `checkPerformance` utility:

```typescript
import { checkPerformance } from './utils/index.js';

const startTime = Date.now();

// Hook logic...

checkPerformance(startTime, 50, 'hook-name');
// Logs warning if > 50ms
```

## Performance Optimization

### Optimization Patterns

**1. Early exits:**

```typescript
// Skip if not applicable
if (input.tool_name !== 'Edit') process.exit(0);
if (!isTypeScriptFile(filePath)) process.exit(0);
```

**2. Incremental operations:**

```typescript
// Use tsc-files for incremental type checking
execSync(`bunx tsc-files --noEmit "${filePath}"`, ...);

// NOT full tsc (slow):
// execSync('tsc --noEmit', ...);
```

**3. Caching:**

```typescript
// Cache expensive lookups
let cachedConfig: Config | null = null;

function getConfig(cwd: string): Config {
  if (cachedConfig) return cachedConfig;
  cachedConfig = loadConfig(cwd);
  return cachedConfig;
}
```

**4. Parallel execution:**

```typescript
// Run git commands in parallel
const [branch, status, commits] = await Promise.all([
  getBranch(cwd),
  getStatus(cwd),
  getCommits(cwd),
]);
```

### Performance Targets

| Hook Type               | Target | Rationale                    |
| ----------------------- | ------ | ---------------------------- |
| SessionStart            | <100ms | User waiting for session     |
| PreToolUse (validation) | <50ms  | Frequent execution           |
| PreToolUse (type check) | <2s    | Incremental check acceptable |
| PostToolUse             | <50ms  | Runs after tool completes    |
| UserPromptSubmit        | <50ms  | User waiting for response    |

## Troubleshooting

### Common Issues

**1. Hook not executing**

**Symptoms:** Hook not running at all

**Causes:**

- Not registered in `plugin.json`
- Not executable (`chmod +x`)
- Syntax errors in hook code

**Fix:**

```sh
# Make executable
chmod +x plugins/workflow/hooks/your-hook.ts

# Test directly
echo '{"cwd":"'$(pwd)'"}' | plugins/workflow/hooks/your-hook.ts

# Check plugin.json registration
cat plugins/workflow/plugin.json | jq '.hooks'
```

**2. Hook fails silently**

**Symptoms:** Hook runs but no output

**Causes:**

- Early exit (expected behavior)
- Errors caught and suppressed
- Configuration disabled hook

**Fix:**

```typescript
// Add debug logging (remove in production)
console.log('[DEBUG] Hook started');
console.log('[DEBUG] Input:', JSON.stringify(input));
console.log('[DEBUG] Tool:', input.tool_name);
```

**3. Stdin parsing fails**

**Symptoms:** "No input received from stdin" error

**Causes:**

- Hook not receiving input from Claude Code
- Testing with incorrect input format

**Fix:**

```sh
# Correct test format
printf '{"cwd":"%s"}' "$(pwd)" | your-hook.ts

# NOT (shell eval issues):
echo '{"cwd":"'$(pwd)'"}' | your-hook.ts
```

**4. Performance issues**

**Symptoms:** Slow hook execution, warnings

**Causes:**

- Full project type check (use incremental)
- Synchronous file operations
- Missing early exits

**Fix:**

```typescript
// Use incremental checking
execSync(`bunx tsc-files --noEmit "${filePath}"`, ...);

// Early exits
if (!isTypeScriptFile(filePath)) process.exit(0);

// Monitor performance
checkPerformance(startTime, 50, 'hook-name');
```

**5. Configuration not working**

**Symptoms:** Hook still running when disabled

**Causes:**

- Wrong config location
- Typo in hook name
- Settings precedence issue

**Fix:**

```sh
# Check settings files
cat .claude/settings.json | jq '.customHooks'
cat .claude/settings.local.json | jq '.customHooks'

# Environment variable (uppercase, exact name)
export CLAUDE_HOOK_GITCOMMITGUARD_ENABLED=false

# Hook name must match exactly
checkHookEnabled(input.cwd, 'gitCommitGuard');
//                            ^^^^^^^^^^^^^^ exact case
```

### Debug Checklist

When debugging hooks:

- [ ] Hook is executable (`ls -l`)
- [ ] Hook registered in `plugin.json`
- [ ] Test with manual stdin input
- [ ] Check for early exits in code
- [ ] Verify tool name/event matching
- [ ] Check configuration enabled
- [ ] Add temporary debug logging
- [ ] Monitor performance warnings

## Further Reading

- [ADR-0010: Hook Type Selection](../architecture/decisions/ADR-0010-hook-type-selection.md) - Decision matrix
- [ADR-0008: No Auto-Formatting Hooks](../architecture/decisions/ADR-0008-no-auto-formatting-hooks.md) - Why avoid file-modifying hooks
- [Claude Code Hooks Documentation](https://docs.claude.com/en/docs/claude-code/hooks) - Official hooks reference
- [Skill Activation Guide](./skill-activation.md) - UserPromptSubmit hook usage

---

**Remember:** Command hooks are zero-token, fast, deterministic automation. Default to command hooks unless semantic analysis explicitly required.
