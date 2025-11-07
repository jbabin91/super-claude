# Hook Anti-Patterns: What to Avoid and Why

Critical patterns to avoid when implementing Claude Code hooks, with evidence and solutions.

## Overview

Hook anti-patterns are implementations that work but cause problems:

- Excessive token consumption (160k+ per session)
- Unreliable execution (incomplete operations)
- Poor user experience (delays, failures)
- Race conditions (data corruption)

This guide documents proven anti-patterns from production evidence, research, and community reports.

---

## Anti-Pattern 1: File Modifications in Stop/PostToolUse Hooks

### ❌ The Problem

Automatically modifying files during active conversation turns triggers expensive system-reminders.

**Example:**

```typescript
// ❌ BAD - PostToolUse hook
async function main() {
  const input = await parseStdin();

  // After any Edit/Write, run formatter
  if (input.tool_name === 'Edit' || input.tool_name === 'Write') {
    execSync('prettier --write src/**/*.ts', { cwd: input.cwd });
    console.log('✓ Files formatted');
  }

  process.exit(0);
}
```

### 🔥 The Cost

**Token Consumption:** 160k+ tokens in just 3 conversation rounds

**Why this happens:**

```txt
Round 1: Claude edits file.ts
    ↓
PostToolUse hook: prettier --write file.ts
    ↓
File modified (diff generated)
    ↓
<system-reminder> injected into next turn:
"Note: file.ts was modified... [full diff]"
    ↓
Round 2: User: "Thanks!"
    ↓
Claude processes with system-reminder context
    ↓
Token cost: ~50k tokens (for diff context)
    ↓
Repeat for 3 rounds = 160k+ tokens
```

### 📊 Evidence

**Source:** [ADR-0008: No Auto-Formatting Hooks](../../architecture/decisions/ADR-0008-no-auto-formatting-hooks.md)

> "After publishing, a reader shared detailed data showing that file modifications trigger `<system-reminder>` notifications that can consume significant context tokens. In their case, Prettier formatting led to 160k tokens consumed in just 3 rounds due to system-reminders showing file diffs."

**Real-world report:**

- Project: Large codebase with strict formatting rules
- Hook: PostToolUse prettier formatter
- Result: 160k tokens in 3 conversation rounds
- Files: Large files with many formatting changes made it worse

### 💡 Solution

**Use manual formatting reminders:**

```typescript
// ✓ GOOD - SessionStart hook
async function main() {
  const input = await parseStdin();

  console.log('═'.repeat(70));
  console.log('Quick Commands:');
  console.log('  bun run format  # Format code between sessions');
  console.log('  bun run lint    # Lint code');
  console.log('═'.repeat(70));

  process.exit(0);
}
```

**Benefits:**

- Zero token cost (no file modifications during conversation)
- User control (format when ready)
- No system-reminders
- Works offline

**Alternative (SessionEnd only):**

```typescript
// ⚠️ ACCEPTABLE - SessionEnd hook (best-effort)
async function main() {
  const input = await parseStdin();

  // Format on exit (no more conversation turns)
  try {
    execSync('bun run format', {
      cwd: input.cwd,
      timeout: 5000, // Quick timeout
    });
    console.log('✓ Files formatted for next session');
  } catch (error) {
    // Fail silently - formatting not critical
  }

  process.exit(0);
}
```

**Caveats for SessionEnd:**

- No guarantee it completes before exit
- Use synchronous operations
- Accept incomplete formatting
- 60s timeout still applies

### 🎯 When File Modifications ARE Safe

**Only safe in SessionEnd hooks:**

- Session is terminating (no more conversation)
- No system-reminders possible
- Use for best-effort cleanup only

**Still risky:**

- May not complete (no guarantee)
- 60s timeout can interrupt
- Critical operations should use PostToolUse + periodic checkpoints

---

## Anti-Pattern 2: Critical Cleanup in SessionEnd Hooks

### ❌ The Problem

Relying on SessionEnd hooks to complete critical operations that MUST finish.

**Example:**

```typescript
// ❌ BAD - SessionEnd hook
async function main() {
  const input = await parseStdin();

  // Critical database cleanup
  await closeAllConnections();
  await flushTransactionLog();

  // Critical file operations
  await saveSessionState('state.json');
  await uploadBackup(input.transcript_path);

  console.log('✓ Cleanup complete');
  process.exit(0);
}
```

### 🔥 The Risk

**SessionEnd hooks CANNOT guarantee completion:**

```txt
User runs /exit
    ↓
SessionEnd hook starts
    ↓
closeAllConnections() - starts
uploadBackup() - starts (network call)
    ↓
[30 seconds pass]
    ↓
Network call still pending...
    ↓
[60 second timeout]
    ↓
Hook process KILLED
    ↓
Session terminates
    ↓
Result: Database connections still open ❌
        Backup incomplete ❌
        State file partially written ❌
```

### 📊 Evidence

**Official Documentation:**

> "SessionEnd hooks run when a session ends. They **cannot block session termination** but can perform cleanup tasks." (emphasis added)

**Research Findings:**

> "SessionEnd hooks do NOT guarantee complete cleanup because they explicitly cannot block session termination. This is by design - the session will end regardless of whether the cleanup tasks complete within the 60-second timeout window."

**Known Behaviors:**

- 60-second timeout (hard limit)
- Cannot block session termination
- Hook runs in parallel with exit (not before)
- May not fire on crashes/force quits

### 💡 Solution

**For critical cleanup:**

```typescript
// ✓ GOOD - PostToolUse hook after specific tool
async function main() {
  const input = await parseStdin();

  // After database query completes
  if (input.tool_name === 'DatabaseQuery') {
    // Cleanup immediately after tool
    await closeConnection(input.tool_input.connectionId);
    console.log('✓ Connection closed');
  }

  process.exit(0);
}
```

**For critical state:**

```typescript
// ✓ GOOD - Periodic checkpoints (not SessionEnd)
// Write state after every significant operation
async function saveCheckpoint(state: SessionState) {
  const checkpoint = {
    timestamp: Date.now(),
    state,
    version: '1.0',
  };

  // Atomic write with temp file + rename
  const temp = `${STATE_FILE}.tmp`;
  await writeFile(temp, JSON.stringify(checkpoint));
  await rename(temp, STATE_FILE);
}
```

**For best-effort cleanup:**

```typescript
// ✓ ACCEPTABLE - SessionEnd for non-critical cleanup
async function main() {
  const input = await parseStdin();

  try {
    // Log session statistics (nice to have)
    const stats = calculateSessionStats(input.transcript_path);
    await logStats(stats);

    // Backup transcript (best-effort)
    const backup = `${input.transcript_path}.backup`;
    copyFileSync(input.transcript_path, backup);

    console.log('✓ Best-effort cleanup complete');
  } catch (error) {
    // Fail silently - these aren't critical
    console.warn('⚠️ Cleanup incomplete:', error.message);
  }

  process.exit(0);
}
```

### 🎯 Decision Matrix

| Operation Type                  | Use Hook             | Guarantee               |
| ------------------------------- | -------------------- | ----------------------- |
| **Critical (MUST complete)**    | PostToolUse          | ✓ Completes             |
| **Important (should complete)** | Periodic checkpoints | ✓ Eventually consistent |
| **Nice to have (best-effort)**  | SessionEnd           | ⚠️ May not complete     |

---

## Anti-Pattern 3: Expecting SessionEnd to Block Termination

### ❌ The Problem

Using exit code 2 in SessionEnd hooks expecting to prevent session termination.

**Example:**

```typescript
// ❌ BAD - SessionEnd hook
async function main() {
  const input = await parseStdin();

  const backupComplete = await checkBackupStatus();

  if (!backupComplete) {
    console.error('⚠️ BACKUP INCOMPLETE - Cannot exit safely');
    process.exit(2); // DOESN'T BLOCK EXIT
  }

  process.exit(0);
}
```

### 🔥 The Reality

**Exit code 2 does NOT block SessionEnd:**

```txt
User: /exit
    ↓
SessionEnd hook: exit 2
    ↓
stderr shown to user:
"⚠️ BACKUP INCOMPLETE - Cannot exit safely"
    ↓
Session terminates ANYWAY ❌
    ↓
User sees warning but session is gone
```

### 📊 Evidence

**Official Documentation:**

> "Exit code 2: Blocking error; stderr fed back to Claude"
> "PreToolUse with exit code 2: blocks the tool call"
> "SessionEnd: **cannot block session termination**" (emphasis added)

**Blocking Capability Matrix:**

| Hook         | Exit Code 2 Blocks? | Evidence              |
| ------------ | ------------------- | --------------------- |
| PreToolUse   | ✅ YES              | Documented, reliable  |
| Stop         | ⚠️ LIMITED          | Known bugs (#10412)   |
| SessionEnd   | ❌ NO               | Explicitly documented |
| Notification | ❌ NO               | Informational only    |
| PreCompact   | ❌ NO               | Unreliable (#10412)   |

### 💡 Solution

**Accept SessionEnd limitations:**

```typescript
// ✓ GOOD - SessionEnd with realistic expectations
async function main() {
  const input = await parseStdin();

  try {
    // Best-effort backup
    const backup = await createBackup(input.transcript_path);
    console.log(`✓ Backup created: ${backup}`);
  } catch (error) {
    // Log but don't try to block
    console.warn(`⚠️ Backup failed: ${error.message}`);
    console.warn('Note: Session will terminate regardless');
  }

  // Always exit cleanly
  process.exit(0);
}
```

**For blocking, use PreToolUse:**

```typescript
// ✓ GOOD - PreToolUse blocks git push
async function main() {
  const input = await parseStdin();

  if (input.tool_name !== 'Bash') process.exit(0);

  const command = input.tool_input?.command;
  if (!command.includes('git push')) process.exit(0);

  // Check if backup is current
  const backupAge = getBackupAge();
  if (backupAge > 3600000) {
    // 1 hour
    console.error('⚠️ BACKUP OUTDATED: Run backup before pushing');
    process.exit(2); // BLOCKS git push ✓
  }

  process.exit(0);
}
```

### 🎯 Key Principle

**SessionEnd is for logging and best-effort cleanup, NOT for preventing exit.**

If an operation MUST complete before exit, don't rely on SessionEnd:

1. Use PreToolUse to block dangerous operations
2. Use PostToolUse for cleanup after specific tools
3. Use periodic checkpoints for state persistence

---

## Anti-Pattern 4: Long Network Operations in Critical Path

### ❌ The Problem

Performing slow network calls in hooks that delay user experience.

**Example:**

```typescript
// ❌ BAD - UserPromptSubmit hook
async function main() {
  const input = await parseStdin();

  // Fetch skill suggestions from API (slow!)
  const response = await fetch('https://api.example.com/skills', {
    method: 'POST',
    body: JSON.stringify({ prompt: input.prompt }),
  });

  const skills = await response.json();
  console.log('Suggested skills:', skills);

  process.exit(0);
}
```

### 🔥 The Impact

**User Experience:**

```txt
User submits prompt: "I want to create a skill"
    ↓
[Wait for network call...]  ← User waiting
    ↓
[2-5 seconds pass]  ← Poor UX
    ↓
Hook completes
    ↓
Prompt finally sent to Claude
    ↓
User frustrated by delay
```

**Performance Targets:**

| Hook             | Target | Network Call Delay | Result        |
| ---------------- | ------ | ------------------ | ------------- |
| UserPromptSubmit | <50ms  | 2-5 seconds        | **Failed** ❌ |
| SessionStart     | <100ms | 2-5 seconds        | **Failed** ❌ |
| PreToolUse       | <50ms  | 2-5 seconds        | **Failed** ❌ |

### 📊 Evidence

**From codebase (skill-activation-prompt.ts):**

```typescript
// Performance monitoring (lines 503-507)
const duration = Date.now() - startTime;
if (duration > 50) {
  console.warn('[WARNING] Slow hook execution: ' + duration + 'ms');
}
```

**Actual measurements:**

- Local file operations: 5-20ms ✓
- Git commands: 20-40ms ✓
- Network calls: 2000-5000ms ❌

### 💡 Solution

**For UserPromptSubmit/PreToolUse - Use local processing:**

```typescript
// ✓ GOOD - Local processing only
async function main() {
  const input = await parseStdin();

  // Load skills from local cache
  const skills = loadLocalSkillRules(input.cwd);

  // Match against prompt (fast regex)
  const matches = matchSkills(input.prompt, skills);

  if (matches.length > 0) {
    console.log('[RECOMMENDED] SKILLS:');
    matches.forEach((s) => console.log(`  -> ${s.name}`));
  }

  process.exit(0);
}
```

**Performance:** <50ms typical

**For PostToolUse/Notification - Background acceptable:**

```typescript
// ✓ ACCEPTABLE - PostToolUse with async
async function main() {
  const input = await parseStdin();

  // Fire-and-forget notification
  fetch('https://ntfy.sh/my-topic', {
    method: 'POST',
    body: 'Tool completed successfully',
  }).catch((err) => {
    // Fail silently - not critical
    console.warn('Notification failed:', err.message);
  });

  // Don't wait for response
  process.exit(0);
}
```

**For long operations - Use background execution:**

```json
{
  "event": "PostToolUse",
  "command": "bun run tests",
  "run_in_background": true
}
```

**Benefits:**

- Hook returns immediately
- Operation continues in background
- No user delay

### 🎯 Decision Guide

**Network call timing:**

| Hook             | Network Call | Acceptable?    | Pattern              |
| ---------------- | ------------ | -------------- | -------------------- |
| UserPromptSubmit | <50ms        | ⚠️ Risky       | Cache locally        |
| SessionStart     | <100ms       | ⚠️ Risky       | Cache locally        |
| PreToolUse       | <50ms        | ❌ NO          | Use local validation |
| PostToolUse      | Any          | ✓ YES          | Fire-and-forget      |
| Notification     | Any          | ✓ YES          | Async acceptable     |
| SessionEnd       | <60s         | ⚠️ May timeout | Best-effort          |

---

## Anti-Pattern 5: Assuming Sequential Hook Execution

### ❌ The Problem

Writing hooks that assume they execute in a specific order or that other hooks complete first.

**Example:**

```typescript
// ❌ BAD - Hook A writes state
// hooks/save-state.ts
async function main() {
  const state = { step: 1, data: 'important' };
  writeFileSync('state.json', JSON.stringify(state));
  process.exit(0);
}

// ❌ BAD - Hook B reads state (RACE CONDITION!)
// hooks/process-state.ts
async function main() {
  const state = JSON.parse(readFileSync('state.json', 'utf8'));
  console.log('Processing:', state.step);
  process.exit(0);
}
```

### 🔥 The Risk

**Parallel execution causes race conditions:**

```txt
PreToolUse triggers (Edit tool)
    ↓
Hook A starts ────┐
                  ├─── Both running in parallel!
Hook B starts ────┘
    ↓
Hook B reads state.json
Hook A writes state.json  ← RACE CONDITION
    ↓
Result: Hook B might read old data or corrupt data
```

### 📊 Evidence

**Official Documentation:**

> "All matching hooks run **in parallel**"
> "Hooks are automatically deduplicated if identical hook commands are registered multiple times"

**Implications:**

- No guaranteed execution order
- No serialization between hooks
- Shared resources need synchronization

### 💡 Solution

**Design for parallel execution:**

```typescript
// ✓ GOOD - Each hook uses unique files
// hooks/save-state.ts
async function main() {
  const timestamp = Date.now();
  const filename = `state-${timestamp}.json`;

  const state = { step: 1, data: 'important', timestamp };
  writeFileSync(filename, JSON.stringify(state));

  process.exit(0);
}

// ✓ GOOD - Hook reads only its own data
// hooks/process-state.ts
async function main() {
  // Use hook-specific file
  const myState = loadFromCache('process-state-cache');
  console.log('Processing:', myState);

  process.exit(0);
}
```

**Use file locking for shared resources:**

```typescript
// ✓ GOOD - File locking pattern
import { open, close } from 'node:fs';

async function withLock<T>(lockFile: string, fn: () => T): Promise<T> {
  // Acquire lock
  const fd = await new Promise((resolve, reject) => {
    open(lockFile, 'wx', (err, fd) => {
      if (err) reject(err);
      else resolve(fd);
    });
  });

  try {
    // Critical section
    return await fn();
  } finally {
    // Release lock
    await new Promise<void>((resolve) => {
      close(fd, () => resolve());
    });
    unlinkSync(lockFile);
  }
}

// Usage
await withLock('/tmp/state.lock', () => {
  const state = readFileSync('state.json', 'utf8');
  // ... modify state ...
  writeFileSync('state.json', newState);
});
```

**Alternative: Atomic operations:**

```typescript
// ✓ GOOD - Atomic write pattern
import { writeFile, rename } from 'node:fs/promises';

async function atomicWrite(path: string, data: string): Promise<void> {
  const temp = `${path}.tmp.${Date.now()}`;

  // Write to temp file
  await writeFile(temp, data, 'utf8');

  // Atomic rename
  await rename(temp, path);
}

// Usage - safe from race conditions
await atomicWrite('state.json', JSON.stringify(state));
```

### 🎯 Safe Patterns

**1. Independent hooks:**

```typescript
// Each hook does its own work, no shared state
hooks/log-tool-use.ts      → logs/tool-use.log
hooks/metrics-collector.ts → metrics/session.json
hooks/backup-transcript.ts → backups/transcript.backup
```

**2. Read-only hooks:**

```typescript
// Only read shared resources (safe)
const status = execSync('git status');
const config = readFileSync('config.json');
// No writes = no race conditions
```

**3. Idempotent hooks:**

```typescript
// Can run multiple times safely
const backup = `transcript-${Date.now()}.json`;
copyFileSync(transcript_path, backup);
// New file each time = no conflicts
```

---

## Summary Checklist

When implementing hooks, verify you're NOT doing these:

### ❌ Anti-Pattern Checklist

- [ ] File modifications in Stop/PostToolUse hooks
- [ ] Critical cleanup that MUST complete in SessionEnd
- [ ] Exit code 2 expecting to block SessionEnd
- [ ] Network calls >50ms in UserPromptSubmit/PreToolUse
- [ ] Shared file writes without locking
- [ ] Assuming Hook A completes before Hook B
- [ ] Long-running operations without timeout handling

### ✅ Best Practice Checklist

- [ ] File modifications only in SessionEnd (best-effort)
- [ ] Critical cleanup via PostToolUse or checkpoints
- [ ] Accept SessionEnd cannot block termination
- [ ] Local processing for critical path hooks (<50ms)
- [ ] Unique files per hook or atomic operations
- [ ] Design for parallel execution
- [ ] Fail open (exit 0) on hook errors

---

## Further Reading

- [Hook Lifecycle Diagram](./lifecycle.md) - Visual execution flow
- [Placement Guide](./placement-guide.md) - When to use each hook type
- [Performance Guide](./performance-guide.md) - Optimization strategies
- [ADR-0008: No Auto-Formatting Hooks](../../architecture/decisions/ADR-0008-no-auto-formatting-hooks.md) - Evidence for anti-pattern #1
- [ADR-0010: Hook Type Selection](../../architecture/decisions/ADR-0010-hook-type-selection.md) - Command vs prompt hooks

---

**Remember:** Anti-patterns often "work" initially but cause problems at scale. Design hooks defensively from the start.
