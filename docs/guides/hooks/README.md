# Hook Documentation Hub

Comprehensive documentation for Claude Code command hooks in super-claude.

## Overview

Command hooks are local scripts that execute in response to Claude Code events. They provide zero-token, fast, deterministic automation for development workflows.

**Key characteristics:**

- **Zero tokens** - No LLM calls, pure TypeScript execution
- **Fast** - Target <50ms for most hooks, <2s for type checking
- **Offline** - No network required
- **Deterministic** - Consistent behavior across sessions

## Current Hooks

super-claude provides three production-ready hooks:

| Hook                  | Event        | Purpose                                      | Performance |
| --------------------- | ------------ | -------------------------------------------- | ----------- |
| **session-checklist** | SessionStart | Display project status at session start      | <100ms      |
| **type-checker**      | PreToolUse   | Validate TypeScript types before Edit/Write  | <2s         |
| **git-commit-guard**  | PreToolUse   | Prevent auto-commits without explicit intent | <50ms       |

## Documentation Quick Links

### Getting Started

**New to hooks?** Start here:

1. [Command Hooks Guide](../command-hooks.md) - Comprehensive introduction
2. [Lifecycle Diagram](./lifecycle.md) - Visual execution flow
3. [Placement Guide](./placement-guide.md) - Choosing the right hook

### Deep Dives

**Ready to optimize?** Advanced topics:

- [Performance Guide](./performance-guide.md) - Optimization strategies
- [Anti-Patterns Guide](./anti-patterns.md) - What to avoid

### Quick Reference

**Need a quick answer?**

- [Placement Guide](./placement-guide.md) - Decision trees for hook selection
- [Lifecycle Diagram](./lifecycle.md) - Execution order and timing

## Guide Selection Matrix

Use this matrix to find the right guide for your needs:

| Your Question                          | Read This Guide                                                      |
| -------------------------------------- | -------------------------------------------------------------------- |
| How do I create a hook?                | [Command Hooks](../command-hooks.md)                                 |
| Which hook event should I use?         | [Placement Guide](./placement-guide.md)                              |
| When do hooks execute?                 | [Lifecycle Diagram](./lifecycle.md)                                  |
| Why is my hook slow?                   | [Performance Guide](./performance-guide.md)                          |
| Why isn't my hook working as expected? | [Anti-Patterns](./anti-patterns.md)                                  |
| Can I block tool execution?            | [Placement Guide](./placement-guide.md) → PreToolUse                 |
| Should I run formatting in a hook?     | [Anti-Patterns](./anti-patterns.md) → File Modifications             |
| Will SessionEnd complete before exit?  | [Anti-Patterns](./anti-patterns.md) → Critical Cleanup               |
| How do I optimize type checking?       | [Performance Guide](./performance-guide.md) → Incremental Operations |

## Quick Start

### 1. Understanding Hook Events

Claude Code provides eight hook events:

```txt
Session Lifecycle:
├─ SessionStart      → Session begins
├─ UserPromptSubmit  → User submits prompt
├─ PreToolUse        → Before tool execution (can block)
├─ PostToolUse       → After tool execution
├─ Stop              → Response complete
└─ SessionEnd        → Session ending (best-effort)

Special Events:
├─ Notification      → 60s idle timeout
└─ PreCompact        → Before transcript compaction
```

**For complete timing, see [Lifecycle Diagram](./lifecycle.md)**

### 2. Choosing the Right Hook

Use this decision tree:

```txt
What do you need?
├─ Block an operation? → PreToolUse (only reliable blocker)
├─ Inject context? → SessionStart or UserPromptSubmit
├─ Log activity? → PostToolUse
├─ Best-effort cleanup? → SessionEnd
└─ Not sure? → Read Placement Guide
```

**For complete decision trees, see [Placement Guide](./placement-guide.md)**

### 3. Creating Your First Hook

**Basic structure:**

```typescript
#!/usr/bin/env bun

import { parseStdin, checkPerformance, formatError } from './utils/index.js';

async function main(): Promise<void> {
  const startTime = Date.now();

  try {
    const input = await parseStdin();

    // Your hook logic here...

    checkPerformance(startTime, 50, 'hook-name');
    process.exit(0); // Approve
  } catch (error) {
    console.error(formatError(error, 'hook-name'));
    process.exit(0); // Don't fail session
  }
}

await main();
```

**For complete implementation guide, see [Command Hooks Guide](../command-hooks.md)**

### 4. Avoiding Common Mistakes

**Top 3 anti-patterns:**

1. **File modifications in Stop/PostToolUse** → 160k+ tokens
2. **Critical cleanup in SessionEnd** → May not complete
3. **Long network calls in PreToolUse** → Blocks user

**For complete anti-patterns with evidence, see [Anti-Patterns Guide](./anti-patterns.md)**

### 5. Performance Optimization

**Top 3 optimizations:**

1. **Early exits** → Exit immediately when hook doesn't apply
2. **Incremental operations** → Use `tsc-files`, not `tsc`
3. **Parallel execution** → Run independent ops concurrently

**For complete optimization strategies, see [Performance Guide](./performance-guide.md)**

## Hook Event Reference

### SessionStart

**When:** Session begins or resumes
**Can block:** No
**Guaranteed:** Yes
**Target:** <100ms

**Use cases:**

- Load project context
- Display status summaries
- Initialize session state

**Example:** `session-checklist.ts`

### UserPromptSubmit

**When:** User submits prompt
**Can block:** No
**Guaranteed:** Yes
**Target:** <50ms

**Use cases:**

- Skill auto-activation
- Prompt enhancement
- Context injection

**stdout:** Prepended to user prompt

### PreToolUse

**When:** Before tool execution
**Can block:** **YES (exit 2)**
**Guaranteed:** Yes
**Target:** <50ms (simple), <2s (type check)

**Use cases:**

- Validate inputs
- Block unsafe operations
- Type checking

**Example:** `type-checker.ts`, `git-commit-guard.ts`

**Exit codes:**

- `0` - Approve tool execution
- `2` - Block tool execution (stderr → Claude)

### PostToolUse

**When:** After tool execution
**Can block:** No
**Guaranteed:** Yes
**Target:** <50ms

**Use cases:**

- Update state
- Log activity
- Trigger follow-up actions

### Stop

**When:** Response complete
**Can block:** No
**Guaranteed:** Yes
**Target:** <100ms

**Use cases:**

- Final validations
- Session-scoped checks
- Suggestions to user

**⚠️ WARNING:** Session still active - file modifications = 160k+ tokens!

### SessionEnd

**When:** Session ending
**Can block:** No
**Guaranteed:** **NO (best-effort)**
**Target:** <60s

**Use cases:**

- Best-effort cleanup
- Session metrics
- Non-critical logging

**⚠️ WARNING:** May not complete before session closes!

### Notification

**When:** 60s idle timeout
**Can block:** No
**Guaranteed:** Partial
**Target:** <50ms

**Use cases:**

- Desktop notifications
- Idle reminders

**⚠️ Known issue:** May not fire if session ends before 60s (#8320)

### PreCompact

**When:** Before transcript compaction
**Can block:** Unreliable
**Guaranteed:** Yes
**Target:** <500ms

**Use cases:**

- Backup transcript
- Archive conversation

**⚠️ WARNING:** Exit code 2 blocking unreliable (#10412)

## Complete Guide Index

### Comprehensive Guides

- **[Command Hooks Guide](../command-hooks.md)** (700+ lines)
  - Complete introduction to command hooks
  - Hook events and use cases
  - Creating hooks (structure, input schema, exit codes)
  - Configuration system
  - Implementation examples
  - Testing strategies
  - Troubleshooting

### Focused Guides

- **[Lifecycle Diagram](./lifecycle.md)** (visual-first)
  - Complete execution flow
  - Timing diagrams
  - Execution guarantees matrix
  - Edge cases
  - Performance baselines

- **[Placement Guide](./placement-guide.md)** (quick reference)
  - Decision trees
  - Hook selection matrix
  - Common patterns
  - When to use which hook

- **[Performance Guide](./performance-guide.md)** (optimization)
  - Core optimization patterns
  - Performance targets by hook type
  - Common bottlenecks and fixes
  - Monitoring and profiling
  - Timeout handling

- **[Anti-Patterns Guide](./anti-patterns.md)** (what to avoid)
  - File modifications in hooks
  - Critical cleanup expectations
  - Blocking assumptions
  - Network operations
  - Parallel execution issues
  - Each with evidence and fixes

## Implementation Examples

### Example 1: Session Status Hook

**Hook:** SessionStart
**Purpose:** Display project status at session start

```typescript
function getGitStatus(cwd: string) {
  const branch = execSync('git branch --show-current', {
    cwd,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
  }).trim();
  // ... parse status
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

**See:** `plugins/workflow/hooks/session-checklist.ts`

### Example 2: Type Validation Hook

**Hook:** PreToolUse (Edit/Write)
**Purpose:** Validate TypeScript types before file modifications

```typescript
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

  if (input.tool_name !== 'Edit' && input.tool_name !== 'Write') {
    process.exit(0); // Early exit
  }

  const result = checkTypes(input.cwd, filePath);

  if (!result.valid) {
    console.error(formatTypeErrors(result.errors));
    process.exit(2); // Block operation
  }

  process.exit(0); // Allow operation
}
```

**See:** `plugins/workflow/hooks/type-checker.ts`

### Example 3: Commit Guard Hook

**Hook:** PreToolUse (Bash)
**Purpose:** Prevent auto-commits without explicit user intent

```typescript
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

**See:** `plugins/workflow/hooks/git-commit-guard.ts`

## Testing Your Hooks

### Manual Testing

```sh
# Test session-checklist
printf '{"cwd":"%s"}' "$(pwd)" | plugins/workflow/hooks/session-checklist.ts

# Test type-checker with Edit tool
cat > /tmp/test-input.json <<EOF
{
  "cwd": "$(pwd)",
  "tool_name": "Edit",
  "tool_input": {
    "file_path": "src/example.ts"
  }
}
EOF
cat /tmp/test-input.json | plugins/workflow/hooks/type-checker.ts
```

**For complete testing strategies, see [Command Hooks Guide](../command-hooks.md#testing-strategies)**

## Configuration

### Settings Hierarchy

**Precedence** (highest to lowest):

1. Enterprise managed settings
2. CLI arguments
3. `.claude/settings.local.json` (gitignored, personal)
4. `.claude/settings.json` (project, committed)
5. `~/.claude/settings.json` (global)
6. Environment variables
7. Default (enabled: true)

### Custom Hook Configuration

```json
// .claude/settings.json (project)
{
  "customHooks": {
    "gitCommitGuard": {
      "enabled": true
    }
  }
}

// .claude/settings.local.json (personal)
{
  "customHooks": {
    "gitCommitGuard": {
      "enabled": false
    }
  }
}
```

**For complete configuration guide, see [Command Hooks Guide](../command-hooks.md#configuration-system)**

## Troubleshooting

### Quick Fixes

**Hook not executing:**

```sh
# Make executable
chmod +x plugins/workflow/hooks/your-hook.ts

# Test directly
echo '{"cwd":"'$(pwd)'"}' | plugins/workflow/hooks/your-hook.ts

# Check plugin.json registration
cat plugins/workflow/.claude-plugin/plugin.json | jq '.hooks'
```

**Hook slow:**

```typescript
// Add performance monitoring
import { checkPerformance } from './utils/index.js';

const startTime = Date.now();
// ... your logic
checkPerformance(startTime, 50, 'hook-name');
```

**For complete troubleshooting, see [Command Hooks Guide](../command-hooks.md#troubleshooting)**

## Additional Resources

### Official Documentation

- [Claude Code Hooks Documentation](https://docs.claude.com/en/docs/claude-code/hooks)
- [Plugin Development Guide](https://docs.claude.com/en/docs/claude-code/plugins)

### Architecture Decisions

- [ADR-0008: No Auto-Formatting Hooks](../../architecture/decisions/ADR-0008-no-auto-formatting-hooks.md)
- [ADR-0010: Hook Type Selection](../../architecture/decisions/ADR-0010-hook-type-selection.md)

### Related Guides

- [Skill Activation Guide](../skill-activation.md) - UserPromptSubmit hook usage
- [OpenSpec Workflow](../../workflows/openspec.md) - Spec-driven development

---

**Remember:** Command hooks are zero-token, fast, deterministic automation. Default to command hooks unless semantic analysis explicitly required.
