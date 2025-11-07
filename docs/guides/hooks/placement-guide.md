# Hook Placement Guide

Quick reference for choosing the right hook for your use case.

## Decision Tree

### Need to Block an Operation?

```txt
Can you block it?
├─ YES → Use PreToolUse (exit 2)
│   Examples:
│   • Type checking before Edit/Write
│   • Commit guard before git commits
│   • Validation before API calls
│
└─ NO → Wrong hook type
    • SessionEnd cannot block
    • Notification cannot block
    • PreCompact cannot reliably block
```

### Need to Inject Context?

```txt
When does Claude need it?
├─ Session start → SessionStart
│   stdout becomes Claude context
│   Use for: Project status, git info
│
├─ Before prompt → UserPromptSubmit
│   stdout prepended to prompt
│   Use for: Skill activation, warnings
│
└─ After response → Stop
    Session still active
    Use for: Final checks, suggestions
```

### Need to Modify Files?

```txt
⚠️ WARNING: File modifications = expensive tokens!

When is it acceptable?
├─ NEVER in Stop/PostToolUse
│   Causes 160k+ token system-reminders
│
└─ ONLY in SessionEnd (with caveats)
    ⚠️ No completion guarantee
    ⚠️ Use synchronous operations
    ⚠️ Best-effort only

Recommended: Show manual command instead
Example: "bun run format" in SessionStart output
```

### Need Cleanup?

```txt
Is it critical?
├─ YES (MUST complete)
│   → Use PostToolUse after specific tool
│      OR periodic checkpoints during session
│      NOT SessionEnd (unreliable)
│
└─ NO (best-effort)
    → Use SessionEnd
       Accept it may not complete
       Examples: Logging, backups, metrics
```

## Hook Selection Matrix

| Use Case                  | Hook             | Why                              |
| ------------------------- | ---------------- | -------------------------------- |
| **Validation (blocking)** | PreToolUse       | Only reliable blocking mechanism |
| **Type checking**         | PreToolUse       | Can block Edit/Write on errors   |
| **Commit guard**          | PreToolUse       | Can block git commits            |
| **Session context**       | SessionStart     | stdout → Claude context          |
| **Skill suggestions**     | UserPromptSubmit | Prepended to prompt              |
| **File formatting**       | Manual command   | Avoid token cost                 |
| **Critical cleanup**      | PostToolUse      | Guaranteed completion            |
| **Best-effort cleanup**   | SessionEnd       | Accept incomplete                |
| **Desktop alerts**        | Notification     | User awareness                   |
| **Transcript backup**     | PreCompact       | Before compaction                |

## Common Patterns

### Pattern: Type Safety

**Hook:** PreToolUse
**Matcher:** `Edit|Write`
**Performance:** <2s
**Blocking:** YES

```typescript
if (!isTypeScriptFile(filePath)) process.exit(0);

const result = checkTypes(cwd, filePath);

if (!result.valid) {
  console.error('❌ Type errors detected');
  process.exit(2); // Block operation
}

process.exit(0); // Allow operation
```

### Pattern: Commit Intent

**Hook:** PreToolUse
**Matcher:** `Bash`
**Performance:** <50ms
**Blocking:** YES

```typescript
if (!isGitCommit(command)) process.exit(0);

const intent = hasExplicitCommitIntent(transcript);

if (!intent) {
  console.error('⚠️ No explicit commit request');
  process.exit(2); // Block commit
}

process.exit(0); // Allow commit
```

### Pattern: Session Status

**Hook:** SessionStart
**Performance:** <100ms
**Blocking:** NO

```typescript
const git = getGitStatus(cwd);
const changes = getActiveChanges(cwd);

console.log(`Git: ${git.branch}, ${git.staged} staged`);
console.log(`Active: ${changes.join(', ')}`);
console.log('Commands: bun run format, bun run lint');

process.exit(0);
```

### Pattern: Skill Activation

**Hook:** UserPromptSubmit
**Performance:** <50ms
**Blocking:** NO

```typescript
const matches = matchSkills(prompt, skillRules);

if (matches.length > 0) {
  console.log('[RECOMMENDED] SKILLS:');
  matches.forEach((s) => console.log(`  -> ${s.name}`));
}

process.exit(0);
```

## Performance Requirements

| Hook                   | Target | Max |
| ---------------------- | ------ | --- |
| SessionStart           | <100ms | 60s |
| UserPromptSubmit       | <50ms  | 60s |
| PreToolUse (simple)    | <50ms  | 60s |
| PreToolUse (typecheck) | <2s    | 60s |
| PostToolUse            | <50ms  | 60s |
| SessionEnd             | <60s   | 60s |

## Further Reading

- [Anti-Patterns](./anti-patterns.md) - What to avoid
- [Performance Guide](./performance-guide.md) - Optimization
- [Lifecycle](./lifecycle.md) - Execution order
