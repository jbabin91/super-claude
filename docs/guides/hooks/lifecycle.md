# Hook Lifecycle Visual Reference

Visual guide to Claude Code hook execution order, timing, and guarantees.

## Complete Lifecycle Flow

```txt
┌─────────────────────────────────────────────────────────────────────┐
│ SESSION START                                                       │
└─────────────────────────────────────────────────────────────────────┘
                               │
                               ▼
                    ╔═════════════════════╗
                    ║  SessionStart       ║
                    ║  • Project status   ║
                    ║  • Load context     ║
                    ║  • stdout → Claude  ║
                    ╚═════════════════════╝
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│ USER INTERACTION                                                    │
└─────────────────────────────────────────────────────────────────────┘
                               │
                      [User submits prompt]
                               │
                               ▼
                    ╔═════════════════════╗
                    ║ UserPromptSubmit    ║
                    ║ • Skill activation  ║
                    ║ • Prompt enhance    ║
                    ║ • stdout prepended  ║
                    ╚═════════════════════╝
                               │
                               ▼
                       [Claude processes]
                               │
┌─────────────────────────────────────────────────────────────────────┐
│ TOOL EXECUTION (repeats per tool)                                  │
└─────────────────────────────────────────────────────────────────────┘
                               │
                               ▼
                    ╔═════════════════════╗
                    ║ PreToolUse          ║ ◄── ONLY RELIABLE BLOCKER
                    ║ • Validate inputs   ║
                    ║ • Type checking     ║
                    ║ • Can block (exit 2)║
                    ╚═════════════════════╝
                               │
                       [exit 0] │ [exit 2]
                               │ │
                               │ └─────► TOOL BLOCKED
                               │        stderr → Claude
                               ▼
                    ┌─────────────────────┐
                    │  Tool Executes      │
                    │  (Edit, Write, etc) │
                    └─────────────────────┘
                               │
                               ▼
                    ╔═════════════════════╗
                    ║ PostToolUse         ║
                    ║ • Log results       ║
                    ║ • Update state      ║
                    ║ • Cannot block      ║
                    ╚═════════════════════╝
                               │
                               ▼
                    [Next tool or response]
                               │
┌─────────────────────────────────────────────────────────────────────┐
│ RESPONSE COMPLETE                                                   │
└─────────────────────────────────────────────────────────────────────┘
                               │
                               ▼
                    ╔═════════════════════╗
                    ║ Stop                ║ ⚠️ SESSION STILL ACTIVE
                    ║ • Response end      ║    File mods = tokens!
                    ║ • Session active    ║
                    ║ • Cannot block      ║
                    ╚═════════════════════╝
                               │
                               │
                      [User continues or exits]
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│ SESSION END                                                         │
└─────────────────────────────────────────────────────────────────────┘
                               │
                               ▼
                    ╔═════════════════════╗
                    ║ SessionEnd          ║ ⚠️ NO COMPLETION GUARANTEE
                    ║ • Best-effort       ║    May not finish!
                    ║ • Cannot block      ║
                    ║ • Cleanup only      ║
                    ╚═════════════════════╝
                               │
                               ▼
                    [ Claude Code exits ]
```

## Parallel Tool Execution

When Claude calls multiple tools in parallel:

```txt
User Prompt
     │
     ▼
UserPromptSubmit ──────► (once)
     │
     ▼
Claude decides to call 3 tools in parallel
     │
     ├─────────────────┬─────────────────┐
     ▼                 ▼                 ▼
PreToolUse(Read)  PreToolUse(Grep)  PreToolUse(Bash)
     │                 │                 │
     ▼                 ▼                 ▼
 Read tool         Grep tool         Bash tool
     │                 │                 │
     ▼                 ▼                 ▼
PostToolUse(Read) PostToolUse(Grep) PostToolUse(Bash)
     │                 │                 │
     └─────────────────┴─────────────────┘
                       │
                       ▼
                     Stop
```

**Key:** All hooks run in parallel, not sequential. Use unique resources or locking.

## Execution Guarantees Matrix

| Hook             | Can Block? | Completion Guaranteed? | Session State    |
| ---------------- | ---------- | ---------------------- | ---------------- |
| SessionStart     | No         | Yes                    | Starting         |
| UserPromptSubmit | No         | Yes                    | Active           |
| PreToolUse       | **YES**    | Yes                    | Active           |
| PostToolUse      | No         | Yes                    | Active           |
| Stop             | No         | Yes                    | **Still Active** |
| SessionEnd       | **No**     | **No (best-effort)**   | Closing          |
| Notification     | No         | Partial (idle trigger) | Active           |
| PreCompact       | Unreliable | Yes                    | Active (compact) |

### What "Completion Guaranteed" Means

**YES:**

- Hook runs to completion or timeout (60s)
- Claude waits for hook to finish
- Hook failures are reported

**NO (SessionEnd):**

- Hook starts, but session may close before completion
- No guarantee hook will finish
- Critical operations will be lost
- Use for best-effort cleanup only

**Partial (Notification):**

- Hook fires after 60s idle
- May not fire if session ends before 60s
- Known issue: #8320

## Timing Diagrams

### Normal Session Flow

```txt
Time →
════════════════════════════════════════════════════════════════════

SessionStart (100ms)
│
├─ Load git status (50ms)
├─ Check active changes (30ms)
└─ Display checklist (20ms)

[User: "Edit src/foo.ts to add feature"]

UserPromptSubmit (50ms)
│
└─ Check skill activation (50ms)

[Claude: "I'll edit that file"]

PreToolUse(Edit) (1800ms)
│
├─ Check if TypeScript (1ms)
├─ Run tsc-files (1750ms)
└─ Format output (49ms)

Tool: Edit src/foo.ts (500ms)

PostToolUse(Edit) (10ms)
│
└─ Log edit completed (10ms)

Stop (20ms)
│
└─ Final validation (20ms)

[User: types /exit]

SessionEnd (2000ms) ⚠️ may not complete
│
└─ Backup transcript (2000ms) ← might not finish
```

### Timeout Scenario

```txt
PreToolUse starts
│
├─ 0-30s:  Type checking in progress...
├─ 30-45s: Still checking...
├─ 45-60s: Almost done...
│
└─ 60s:    ⚠️ TIMEOUT
           Hook killed
           stderr shown to Claude
           Tool execution CONTINUES (PreToolUse)
           or completed (PostToolUse)
```

### SessionEnd Edge Cases

```txt
Scenario 1: Clean exit
═══════════════════════
[User types /exit]
SessionEnd starts (100ms)
│
└─ Log session metrics ✓ (completes)

Session closes


Scenario 2: Exit during operation
══════════════════════════════════
[User types /exit while hook running]
SessionEnd starts
│
├─ 0-2s:    Backup transcript...
├─ 2s:      Session force closes
│
└─ ⚠️ Backup incomplete (lost data)


Scenario 3: Timeout during SessionEnd
══════════════════════════════════════
SessionEnd starts
│
├─ 0-30s:   Heavy database operation...
├─ 30-60s:  Still working...
├─ 60s:     ⚠️ TIMEOUT
│
└─ Hook killed, operation incomplete
```

## Decision Trees

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
    • Stop cannot block
    • PostToolUse cannot block
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

## Edge Cases

### Case 1: Multiple Hooks, Same Event

```txt
plugin.json:
{
  "hooks": [
    {"event": "PreToolUse", "path": "hooks/type-check.ts"},
    {"event": "PreToolUse", "path": "hooks/lint-check.ts"},
    {"event": "PreToolUse", "path": "hooks/security-check.ts"}
  ]
}

Execution:
──────────────────────────────────────────────────
Edit tool called
     │
     ▼
All 3 hooks start IN PARALLEL
     │
     ├───────────────┬───────────────┐
     ▼               ▼               ▼
type-check.ts   lint-check.ts   security-check.ts
     │               │               │
   exit 0          exit 0          exit 2 (BLOCK)
     │               │               │
     └───────────────┴───────────────┘
                     │
                     ▼
              Tool BLOCKED
         (security-check blocked it)
```

**Key:** ANY hook exit 2 → Tool blocked.

### Case 2: Long-Running Tool with Timeout

```txt
Claude calls slow API endpoint (90s response time)
     │
     ▼
PreToolUse (2s type check) ✓
     │
     ▼
Bash tool starts (curl to API)
     │
     ├─ 0-60s:  Waiting for response...
     │
     └─ 60s:    ⚠️ Tool times out
                Response never arrives
                PostToolUse never runs
                Stop runs after timeout
```

### Case 3: SessionEnd During Active Operations

```txt
Scenario: User exits while Claude is thinking

Claude thinking...
     │
     ├─ Building response...
     │
[User types /exit]
     │
     ▼
SessionEnd hook starts
     │
     ├─ 0-1s:    Heavy operation starting...
     │
     └─ 1s:      Session force closes
                 ⚠️ Hook incomplete
```

**Lesson:** SessionEnd is best-effort only. Critical ops → PostToolUse.

## Performance Baselines

```txt
Hook Event          P50      P95      P99      Max
─────────────────────────────────────────────────
SessionStart        50ms     80ms     120ms    60s
UserPromptSubmit    20ms     40ms     60ms     60s
PreToolUse(simple)  5ms      30ms     60ms     60s
PreToolUse(tsc)     800ms    1.5s     2.5s     60s
PostToolUse         5ms      20ms     50ms     60s
Stop                10ms     30ms     100ms    60s
SessionEnd          50ms     2s       30s      60s
```

**Target:** Keep P95 < target for hook type (see [performance-guide.md](./performance-guide.md)).

## Visual Summary

```txt
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Hook Lifecycle Quick Reference                                  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

  WHEN              HOOK                 CAN BLOCK?    GUARANTEED?
  ────────────────────────────────────────────────────────────────
  Session starts    SessionStart         No            Yes
  User prompt       UserPromptSubmit     No            Yes
  Before tool       PreToolUse           YES (exit 2)  Yes
  After tool        PostToolUse          No            Yes
  Response ends     Stop                 No            Yes
  Session ends      SessionEnd           No            NO ⚠️
  60s idle          Notification         No            Partial
  Before compact    PreCompact           Unreliable    Yes

  KEY INSIGHTS:
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  • PreToolUse is ONLY reliable blocking mechanism
  • Stop runs while session is STILL ACTIVE (file mods = tokens!)
  • SessionEnd is BEST-EFFORT (may not complete)
  • All hooks run in PARALLEL (not sequential)
  • Default timeout: 60 seconds
```

## Further Reading

- [Anti-Patterns](./anti-patterns.md) - What to avoid
- [Placement Guide](./placement-guide.md) - Choosing the right hook
- [Performance Guide](./performance-guide.md) - Optimization strategies
- [Command Hooks Guide](../command-hooks.md) - Complete reference
