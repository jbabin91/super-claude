# Implementation Tasks: Add Workflow Command Hooks

## 1. Infrastructure Setup

- [x] 1.1 Add @jbabin91/tsc-files to package.json dependencies
- [x] 1.2 Create plugins/workflow/hooks/ directory structure
- [x] 1.3 Create shared utilities for hook input parsing
- [x] 1.4 Create hook configuration loader utility

## 2. Session Checklist Hook

- [x] 2.1 Create plugins/workflow/hooks/session-checklist.ts
- [x] 2.2 Implement git status display (branch, staged, commits)
- [x] 2.3 Implement OpenSpec changes display (active proposals)
- [x] 2.4 Implement quick command reference display
- [x] 2.5 Add performance monitoring (<100ms target)
- [x] 2.6 Register hook in plugin.json (SessionStart event)
- [x] 2.7 Test hook locally with various project states (✓ Verified: git status, commits, OpenSpec changes)

## 3. Type Checker Hook

- [x] 3.1 Create plugins/workflow/hooks/type-checker.ts (renamed from build-checker)
- [x] 3.2 Implement PreToolUse matcher for Edit/Write tools
- [x] 3.3 Integrate @jbabin91/tsc-files for type checking
- [x] 3.4 Extract file paths from tool input
- [x] 3.5 Block on type errors (exit code 2) with clear messages
- [x] 3.6 Add performance optimization (cache, debounce)
- [x] 3.7 Register hook in plugin.json (PreToolUse event)
- [x] 3.8 Test with TypeScript files (valid and invalid) (✓ Verified: passes clean files, fixed tsc-files command)

## 4. Git Commit Guard Hook

- [x] 4.1 Create plugins/workflow/hooks/git-commit-guard.ts
- [x] 4.2 Implement git commit command detection (regex)
- [x] 4.3 Implement configuration loader (settings.json hierarchy)
- [x] 4.4 Parse transcript for conversation context
- [x] 4.5 Analyze last 10 messages for explicit commit intent
- [x] 4.6 Block without intent (exit code 2) with helpful message
- [x] 4.7 Register hook in plugin.json (PreToolUse, Bash matcher)
- [x] 4.8 Test with various commit scenarios (explicit vs implicit) (✓ Verified: blocks without intent, allows with intent)

## 5. Hook Configuration System

- [x] 5.1 Document settings hierarchy (global → project → local)
- [ ] 5.2 Create example .claude/settings.json with hook config
- [ ] 5.3 Create example .claude/settings.local.json for overrides
- [x] 5.4 Add .claude/settings.local.json to .gitignore (already present)
- [x] 5.5 Document environment variable fallbacks
- [x] 5.6 Create configuration validation utility

## 6. Documentation

- [x] 6.1 Create docs/guides/command-hooks.md
- [x] 6.2 Document hook events and use cases
- [x] 6.3 Document hook type selection (reference ADR-0010)
- [x] 6.4 Document configuration patterns
- [x] 6.5 Add implementation examples from our hooks
- [x] 6.6 Document testing strategies
- [x] 6.7 Document performance optimization patterns
- [x] 6.8 Add troubleshooting section
- [x] 6.9 BONUS: Create docs/guides/hooks/ focused guides (anti-patterns, placement, performance, lifecycle, README)

## 7. Examples and Tests

- [x] 7.1 Add hook examples to examples/ directory (N/A - hooks themselves serve as reference implementations)
- [x] 7.2 Create test fixtures for each hook (N/A - testing examples in workflow README and docs)
- [x] 7.3 Document testing approach in guide
- [x] 7.4 Add integration test examples

## 8. Plugin Registration

- [x] 8.1 Update plugins/workflow/plugin.json with all hooks
- [x] 8.2 Verify hook registration format
- [ ] 8.3 Test hooks in clean Claude Code session
- [ ] 8.4 Verify /hooks menu shows all three hooks

## 9. Validation and Review

- [x] 9.1 Run bun run format on all hook files
- [x] 9.2 Run bun run lint on all hook files
- [x] 9.3 Validate performance targets met (<100ms for checklist, <2s for type checking) (✓ Verified in manual tests)
- [ ] 9.4 Test enable/disable configuration works
- [x] 9.5 Verify hooks follow ADR-0010 patterns
- [x] 9.6 Review guide documentation for completeness

## 10. Final Integration

- [ ] 10.1 Test all hooks together in workflow plugin
- [ ] 10.2 Verify no conflicts between hooks
- [x] 10.3 Update workflow plugin README with hook documentation and testing examples
- [x] 10.4 Create commit following conventional commit format (5 commits total)
