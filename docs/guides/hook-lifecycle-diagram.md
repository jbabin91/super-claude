# Claude Code Hook Lifecycle Diagram

Comprehensive guide to hook execution order, guarantees, and optimal placement patterns.

## Complete Hook Lifecycle

```txt
┌─────────────────────────────────────────────────────────────────┐
│                      SESSION INITIALIZATION                      │
└─────────────────────────────────────────────────────────────────┘
                                ▼
                    ┌──────────────────────┐
                    │   SessionStart Hook   │ ← Fires once per session start/resume
                    │   Target: <100ms      │   Can inject context via stdout
                    │   Exit 0: Continue    │   Cannot block session
                    │   Can use: CLAUDE_ENV_FILE
                    └──────────────────────┘
                                ▼
              stdout becomes → Claude receives context
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CONVERSATION TURN BEGINS                      │
└─────────────────────────────────────────────────────────────────┘
                                ▼
                    ┌──────────────────────┐
                    │ User submits prompt   │
                    └──────────────────────┘
                                ▼
                    ┌──────────────────────┐
                    │ UserPromptSubmit Hook │ ← Fires BEFORE LLM sees prompt
                    │   Target: <50ms       │   stdout prepended to prompt
                    │   Exit 0: Continue    │   Cannot block prompt
                    │   Cannot block        │   Used for: skill activation
                    └──────────────────────┘
                                ▼
              stdout prepended → Augmented prompt to LLM
                                ▼
                    ┌──────────────────────┐
                    │ Claude processes and  │
                    │ generates response    │
                    │ with tool calls       │
                    └──────────────────────┘
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     TOOL EXECUTION PHASE                         │
└─────────────────────────────────────────────────────────────────┘
                                ▼
                    ┌──────────────────────┐
                    │  PreToolUse Hook      │ ← Fires BEFORE tool executes
                    │   Target: <50ms       │   Can validate & block
                    │   Exit 0: Allow       │   Most reliable blocking
                    │   Exit 2: BLOCK ✓     │   stderr → Claude feedback
                    │   Type check: <2s     │
                    └──────────────────────┘
                                ▼
                          ┌─────┴─────┐
                          │           │
                  Exit 0  │           │  Exit 2
                 (Allow)  │           │  (Block)
                          ▼           ▼
                  ┌──────────┐   ┌──────────────┐
                  │   Tool   │   │ stderr shown │
                  │ Executes │   │ to user +    │
                  │          │   │ fed to Claude│
                  └──────────┘   └──────────────┘
                          │                │
                          │                └─→ Claude adjusts plan
                          ▼                    Conversation continues
                    ┌──────────────────────┐
                    │ PostToolUse Hook      │ ← Fires AFTER successful execution
                    │   Target: <50ms       │   Tool already complete
                    │   Exit 0: Continue    │   Cannot prevent execution
                    │   Exit 2: Feedback ✗  │   Not for error handling
                    │   Only on success     │   Use for: logging, follow-ups
                    └──────────────────────┘
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CONVERSATION TURN ENDS                        │
└─────────────────────────────────────────────────────────────────┘
                                ▼
                    ┌──────────────────────┐
                    │     Stop Hook         │ ← Fires after response complete
                    │   Target: <50ms       │   Session still active
                    │   Exit 0: Continue    │   User can send more messages
                    │   Exit 2: Feedback ✗  │   NOT for file modifications
                    │   Session continues   │   Use for: final checks
                    └──────────────────────┘
                                ▼
              User can continue conversation
                     (loop to top)
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                  SPECIAL EVENTS (ASYNC)                         │
└─────────────────────────────────────────────────────────────────┘

         ┌──────────────────────┐       ┌──────────────────────┐
         │  Notification Hook    │       │   PreCompact Hook     │
         │  Triggers:            │       │   Triggers:           │
         │  • Permission request │       │   • /compact (manual) │
         │  • 60s idle timeout   │       │   • Context 95% full  │
         │  Cannot block ✗       │       │   Cannot block ✗      │
         │  Use: Desktop alerts  │       │   Use: Backup         │
         └──────────────────────┘       └──────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     SESSION TERMINATION                          │
└─────────────────────────────────────────────────────────────────┘
                                ▼
                    ┌──────────────────────┐
                    │ User runs /exit       │
                    │ or closes session     │
                    └──────────────────────┘
                                ▼
                    ┌──────────────────────┐
                    │  SessionEnd Hook      │ ← Fires during termination
                    │   Target: <60s        │   Session CLOSING
                    │   Exit 0: Continue    │   Cannot block exit
                    │   Cannot block ✗      │   Best-effort only
                    │   May not complete    │   No guarantees
                    │   Reason: exit/logout │
                    └──────────────────────┘
                                ▼
              Session terminates regardless
```

## Hook Execution Guarantees

### Strong Guarantees ✅

| Hook                 | Execution       | Blocking         | Completion                     | Context Access               |
| -------------------- | --------------- | ---------------- | ------------------------------ | ---------------------------- |
| **SessionStart**     | Guaranteed      | No               | Yes (waits briefly)            | stdout → Claude context      |
| **UserPromptSubmit** | Guaranteed      | No               | Yes (waits for completion)     | stdout prepended to prompt   |
| **PreToolUse**       | Guaranteed      | **YES (exit 2)** | Yes (must complete to proceed) | stdin: tool_name, tool_input |
| **PostToolUse**      | Only on success | No               | Yes                            | stdin: tool result           |
| **Stop**             | Guaranteed      | No               | Yes                            | Session still active         |

### Weak Guarantees ⚠️

| Hook             | Execution   | Blocking | Completion | Issues                                      |
| ---------------- | ----------- | -------- | ---------- | ------------------------------------------- |
| **SessionEnd**   | Best-effort | **NO**   | **NO**     | Cannot block exit, may not complete         |
| **Notification** | Usually     | No       | Usually    | 60s idle notifications may not fire (#8320) |
| **PreCompact**   | Usually     | **NO**   | Usually    | Exit 2 blocking unreliable (#10412)         |

## Hook Placement Decision Tree

### For Validation/Safety Checks

```txt
Need to BLOCK operation?
├─ YES → Use PreToolUse (exit 2)
│         Examples: Type checking, commit guard
│         Reliable blocking with stderr → Claude feedback
└─ NO  → Use PostToolUse or Stop
          Examples: Logging, metrics
```

### For Context Injection

```txt
When do you need to inject context?
├─ Session start → Use SessionStart
│                  stdout becomes Claude context
│                  Can set CLAUDE_ENV_FILE variables
├─ Before prompt → Use UserPromptSubmit
│                  stdout prepended to user prompt
│                  Used for: skill activation
└─ After response → Use Stop
                    Session still active
```

### For File Modifications

```txt
⚠️ NEVER modify files in hooks during conversation!
Causes 160k+ token system-reminders (ADR-0008)

When CAN you modify files?
└─ ONLY in SessionEnd (with caveats)
   ⚠️ No completion guarantee
   ⚠️ Use synchronous operations
   ⚠️ May be interrupted

Recommendation: Manual commands shown in SessionStart
Example: "bun run format" in session-checklist
```

### For Cleanup Operations

```txt
What kind of cleanup?
├─ Critical (MUST complete)
│  → Use PostToolUse after specific tools
│     OR periodic checkpoints (not SessionEnd)
│     SessionEnd is unreliable!
│
└─ Best-effort (nice to have)
   → Use SessionEnd
      Examples: Logging, metrics, backups
      Accept that it may not complete
```

### For Alerts/Notifications

```txt
What triggers the alert?
├─ Permission needed → Notification hook
│                      Cannot block
├─ Context full      → PreCompact hook
│                      Cannot block reliably
└─ Session starting  → SessionStart hook
                       Display in output
```

## Performance Targets

### Critical Path Hooks (User Waiting)

```txt
SessionStart:        <100ms  (user waiting for session)
UserPromptSubmit:    <50ms   (user waiting for response)
PreToolUse (simple): <50ms   (frequent execution)
PostToolUse:         <50ms   (response waiting)
Stop:                <50ms   (response complete)
```

### Acceptable Delay Hooks

```txt
PreToolUse (type):   <2s     (incremental check)
PreCompact:          <100ms  (user triggered compact)
SessionEnd:          <60s    (timeout limit)
```

## Edge Cases & Special Scenarios

### Scenario: Multiple Tools in Parallel

```txt
Claude invokes: Edit file1 + Edit file2 + Write file3 (parallel)
                        ▼
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
   PreToolUse      PreToolUse      PreToolUse
   (file1)         (file2)         (file3)
   All run in PARALLEL
        │               │               │
        └───────────────┼───────────────┘
                        ▼
   If ANY exits 2 → ALL blocked
   If ALL exit 0  → ALL execute
```

**Key:** One hook blocking affects all parallel tools

### Scenario: Hook Timeout

```txt
PreToolUse hook starts → Runs for 61 seconds → TIMEOUT
                                    ▼
                          Hook process killed
                                    ▼
                          Tool execution CONTINUES
                          (fail open behavior)
```

**Key:** Timeout = hook fails, operation continues

### Scenario: SessionEnd During Active Operation

```txt
User runs /exit while tool executing
              ▼
    ┌─────────┴──────────┐
    ▼                    ▼
Tool continues      SessionEnd fires
execution           in parallel
    │                    │
    └─────────┬──────────┘
              ▼
    Session terminates
    (SessionEnd may not complete)
```

**Key:** SessionEnd doesn't wait for tool completion

### Scenario: PreToolUse Blocks Edit

```txt
Claude wants: Edit file.ts
        ▼
PreToolUse: Type check
        ▼
    Exit 2 (type errors found)
        ▼
Edit NEVER executes
        ▼
stderr shown to user + Claude
        ▼
Claude sees error, suggests fixes
        ▼
Conversation continues normally
```

**Key:** Blocking doesn't crash session

### Scenario: File Modification in Stop Hook

```txt
Claude finishes response
        ▼
Stop hook runs: prettier --write **/*.ts
        ▼
Files modified (system-reminder triggered)
        ▼
User sends next message: "Thanks!"
        ▼
NEW TURN includes system-reminders showing diffs
        ▼
160k+ tokens consumed! ❌
```

**Key:** Stop hook file mods = expensive system-reminders

### Scenario: SessionEnd Hook Hangs

```txt
User runs /exit
        ▼
SessionEnd hook starts: uploadTranscript()
        ▼
Network call hangs...
        ▼
60 second timeout
        ▼
Hook killed, session terminates
        ▼
Upload INCOMPLETE ❌
```

**Key:** No completion guarantee for SessionEnd

### Scenario: Compaction with Custom Instructions

```txt
User runs: /compact "Keep ADRs and proposals"
        ▼
PreCompact hook fires (matcher: "manual")
        ▼
Hook receives custom_instructions field
        ▼
Hook can enhance instructions:
  stdout: "Also preserve OpenSpec history"
        ▼
Compaction proceeds with augmented context
```

**Key:** Manual compaction allows instruction enhancement

## Optimal Hook Placement Patterns

### Pattern 1: Type Safety Validation ✅

**Use:** PreToolUse (Edit/Write tools)
**Target:** <2s
**Blocking:** YES (exit 2)

```typescript
// Blocks file modifications if type errors detected
if (!isValidTypes(filePath)) {
  console.error('❌ Type errors detected');
  process.exit(2); // Block operation
}
process.exit(0); // Allow
```

**Why:** Prevents broken code, provides immediate feedback

### Pattern 2: Commit Intent Guard ✅

**Use:** PreToolUse (Bash tool)
**Target:** <50ms
**Blocking:** YES (exit 2)

```typescript
// Prevents auto-commits without explicit user request
if (isGitCommit(command) && !hasExplicitIntent(transcript)) {
  console.error('⚠️ COMMIT BLOCKED: No explicit request');
  process.exit(2); // Block commit
}
process.exit(0); // Allow
```

**Why:** Prevents accidental commits, respects user intent

### Pattern 3: Session Context Display ✅

**Use:** SessionStart
**Target:** <100ms
**Blocking:** NO

```typescript
// Display project status at session start
console.log('Git: 3 staged, 2 modified');
console.log('Active Changes: add-two-factor-auth');
console.log('Commands: openspec list, bun run format');
process.exit(0);
```

**Why:** User sees context, Claude receives it too

### Pattern 4: Skill Auto-Activation ✅

**Use:** UserPromptSubmit
**Target:** <50ms
**Blocking:** NO

```typescript
// Suggest relevant skills based on prompt
const matches = matchSkills(prompt, skillRules);
if (matches.length > 0) {
  console.log('[RECOMMENDED] SKILLS:');
  matches.forEach((s) => console.log(`  -> ${s.name}`));
}
process.exit(0);
```

**Why:** Zero-friction skill discovery

### Pattern 5: Manual Formatting Reminder ✅

**Use:** SessionStart
**Target:** <100ms
**Blocking:** NO

```typescript
// Remind user to format between sessions
console.log('Quick Commands:');
console.log('  bun run format  # Format code');
console.log('  bun run lint    # Lint code');
process.exit(0);
```

**Why:** User control, zero tokens, no system-reminders

### Pattern 6: Transcript Backup (Best-Effort) ⚠️

**Use:** PreCompact OR SessionEnd
**Target:** <100ms
**Blocking:** NO

```typescript
// Backup transcript before compaction
const backup = `${transcript_path}.backup.${Date.now()}`;
copyFileSync(transcript_path, backup);
console.log(`✅ Backed up: ${backup}`);
process.exit(0);
```

**Why:** Preserves history, accepts incomplete on timeout

### Pattern 7: Desktop Notification ✅

**Use:** Notification hook
**Target:** <50ms
**Blocking:** NO

```typescript
// Alert user when Claude needs input
execSync(`notify-send "Claude Code" "${message}"`);
process.exit(0);
```

**Why:** Mobile/desktop awareness of long-running tasks

## Anti-Patterns (AVOID)

### ❌ Anti-Pattern 1: File Modification in Stop Hook

```typescript
// BAD - Causes 160k+ token system-reminders
execSync('prettier --write **/*.ts');
process.exit(0);
```

**Problem:** Files modified → system-reminders → next turn = expensive
**Solution:** Show manual command in SessionStart instead

### ❌ Anti-Pattern 2: Critical Cleanup in SessionEnd

```typescript
// BAD - No completion guarantee
await closeDatabase();
await uploadLogs();
process.exit(0);
```

**Problem:** Hook may be killed, operations incomplete
**Solution:** Use PostToolUse after specific tools, or periodic checkpoints

### ❌ Anti-Pattern 3: Blocking in SessionEnd

```typescript
// BAD - Cannot block session termination
if (!backupComplete) {
  console.error('⚠️ Backup incomplete');
  process.exit(2); // DOESN'T BLOCK
}
```

**Problem:** Session terminates regardless
**Solution:** Use best-effort pattern, accept incomplete

### ❌ Anti-Pattern 4: Long Network Calls in Critical Path

```typescript
// BAD - Delays user experience
const response = await fetch('https://api.example.com/slow');
process.exit(0);
```

**Problem:** User waiting 2-5s for response
**Solution:** Use `run_in_background: true` or async queue

### ❌ Anti-Pattern 5: Assuming Sequential Hook Execution

```typescript
// BAD - Hooks run in parallel
writeFileSync('state.json', '{"step": 1}');
// Hook B might read before Hook A writes!
```

**Problem:** Race conditions with shared resources
**Solution:** Use file locking or unique filenames

## Summary Recommendations

### DO Use These Patterns ✅

1. **PreToolUse for validation** - Reliable blocking, immediate feedback
2. **SessionStart for context** - Display status, inject Claude context
3. **UserPromptSubmit for enhancement** - Skill activation, context augmentation
4. **Best-effort SessionEnd** - Logging, metrics (accept incomplete)
5. **Manual commands in output** - User control, zero tokens

### DON'T Use These Patterns ❌

1. **File mods in Stop/PostToolUse** - Expensive system-reminders (160k+ tokens)
2. **Critical cleanup in SessionEnd** - No completion guarantee
3. **Blocking expectations in SessionEnd** - Cannot block termination
4. **Long operations without timeout** - Exceeds 60s limit
5. **Assuming sequential execution** - Hooks run in parallel

### Edge Case Checklist

When designing hooks, consider:

- [ ] What if hook times out (60s)?
- [ ] What if session terminates mid-execution?
- [ ] What if multiple hooks run in parallel?
- [ ] What if tool execution is already in progress?
- [ ] What if transcript is unavailable?
- [ ] What if configuration is disabled?
- [ ] What if network is unavailable?
- [ ] What if file is locked/missing?

**Philosophy:** Hooks enhance workflow but never break it (fail open)

---

## Further Reading

- [Command Hooks Guide](./command-hooks.md) - Complete implementation guide
- [ADR-0008: No Auto-Formatting Hooks](../architecture/decisions/ADR-0008-no-auto-formatting-hooks.md) - Why avoid file modifications
- [ADR-0010: Hook Type Selection](../architecture/decisions/ADR-0010-hook-type-selection.md) - Command vs prompt hooks
- [Official Claude Code Hooks Docs](https://code.claude.com/docs/en/hooks) - Reference documentation

---

**Remember:** Hooks provide powerful automation, but respect their limitations. Design defensively, fail gracefully, and prioritize user experience.
