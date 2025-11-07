# Proposal: Add Workflow Command Hooks

## Why

Based on production evidence (ADR-0008, ADR-0010) and 6+ months of Claude Code usage, command hooks provide zero-token, fast (<50ms), offline automation for development workflows. Currently, super-claude has no production hooks despite having the infrastructure. Adding session-checklist, type-checker, and git-commit-guard hooks addresses immediate workflow needs while demonstrating hook patterns for future plugin creators.

**Production evidence:**

- Command hooks: 0 tokens, <50ms execution, offline support (ADR-0010)
- File-modifying hooks waste 160k+ tokens via system-reminders (ADR-0008)
- Proper hook type selection critical for token efficiency

## What Changes

Add three production-ready command hooks to workflow plugin:

1. **session-checklist** (SessionStart)
   - Display git status, recent commits, active OpenSpec changes
   - Show pending todos and quick command reference
   - Fast context refresh at session start
   - Target: <100ms execution

2. **type-checker** (PreToolUse: Edit/Write)
   - Validate TypeScript types before file modifications
   - Use @jbabin91/tsc-files for incremental type checking
   - Block on type errors with actionable messages
   - Target: <2s execution (only changed files)

3. **git-commit-guard** (PreToolUse: Bash)
   - Prevent auto-committing without explicit user request
   - Analyze conversation context for commit intent
   - Custom enable/disable via project settings
   - Exit code 2 blocks with user-friendly warning

**Hook configuration system:**

- Settings hierarchy: global → project → local
- Custom namespace: `customHooks` in `.claude/settings.json`
- Per-developer overrides via `.claude/settings.local.json` (gitignored)
- Environment variable support

**Documentation:**

- Command hooks guide (`docs/guides/command-hooks.md`)
- Hook type selection guidance (references ADR-0010)
- Configuration patterns and examples
- Testing strategies

## Impact

**Affected specs:**

- `specs/workflow/` - New workflow automation capability

**Affected code:**

- `plugins/workflow/hooks/session-checklist.ts` - SessionStart hook
- `plugins/workflow/hooks/type-checker.ts` - PreToolUse hook
- `plugins/workflow/hooks/git-commit-guard.ts` - PreToolUse hook
- `plugins/workflow/plugin.json` - Hook registrations
- `docs/guides/command-hooks.md` - Hook development guide
- `package.json` - Add @jbabin91/tsc-files dependency

**Related ADRs:**

- [ADR-0008: No Auto-Formatting Hooks](../../docs/architecture/decisions/ADR-0008-no-auto-formatting-hooks.md) - Rationale for read-only hooks
- [ADR-0010: Hook Type Selection](../../docs/architecture/decisions/ADR-0010-hook-type-selection.md) - Command vs prompt decision matrix

**Benefits:**

- Zero token cost (vs 300-500 per prompt hook)
- Fast feedback (<100ms typical)
- Offline workflow support
- Demonstrates ADR-0010 patterns
- Reusable configuration system for future hooks
