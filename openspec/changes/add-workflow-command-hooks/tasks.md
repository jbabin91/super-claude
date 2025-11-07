# Implementation Tasks: Add Workflow Command Hooks

## 1. Infrastructure Setup

- [ ] 1.1 Add @jbabin91/tsc-files to package.json dependencies
- [ ] 1.2 Create plugins/workflow/hooks/ directory structure
- [ ] 1.3 Create shared utilities for hook input parsing
- [ ] 1.4 Create hook configuration loader utility

## 2. Session Checklist Hook

- [ ] 2.1 Create plugins/workflow/hooks/session-checklist.ts
- [ ] 2.2 Implement git status display (branch, staged, commits)
- [ ] 2.3 Implement OpenSpec changes display (active proposals)
- [ ] 2.4 Implement quick command reference display
- [ ] 2.5 Add performance monitoring (<100ms target)
- [ ] 2.6 Register hook in plugin.json (SessionStart event)
- [ ] 2.7 Test hook locally with various project states

## 3. Build Checker Hook

- [ ] 3.1 Create plugins/workflow/hooks/build-checker.ts
- [ ] 3.2 Implement PreToolUse matcher for Edit/Write tools
- [ ] 3.3 Integrate @jbabin91/tsc-files for type checking
- [ ] 3.4 Extract file paths from tool input
- [ ] 3.5 Block on type errors (exit code 2) with clear messages
- [ ] 3.6 Add performance optimization (cache, debounce)
- [ ] 3.7 Register hook in plugin.json (PreToolUse event)
- [ ] 3.8 Test with TypeScript files (valid and invalid)

## 4. Git Commit Guard Hook

- [ ] 4.1 Create plugins/workflow/hooks/git-commit-guard.ts
- [ ] 4.2 Implement git commit command detection (regex)
- [ ] 4.3 Implement configuration loader (settings.json hierarchy)
- [ ] 4.4 Parse transcript for conversation context
- [ ] 4.5 Analyze last 10 messages for explicit commit intent
- [ ] 4.6 Block without intent (exit code 2) with helpful message
- [ ] 4.7 Register hook in plugin.json (PreToolUse, Bash matcher)
- [ ] 4.8 Test with various commit scenarios (explicit vs implicit)

## 5. Hook Configuration System

- [ ] 5.1 Document settings hierarchy (global → project → local)
- [ ] 5.2 Create example .claude/settings.json with hook config
- [ ] 5.3 Create example .claude/settings.local.json for overrides
- [ ] 5.4 Add .claude/settings.local.json to .gitignore
- [ ] 5.5 Document environment variable fallbacks
- [ ] 5.6 Create configuration validation utility

## 6. Documentation

- [ ] 6.1 Create docs/guides/command-hooks.md
- [ ] 6.2 Document hook events and use cases
- [ ] 6.3 Document hook type selection (reference ADR-0010)
- [ ] 6.4 Document configuration patterns
- [ ] 6.5 Add implementation examples from our hooks
- [ ] 6.6 Document testing strategies
- [ ] 6.7 Document performance optimization patterns
- [ ] 6.8 Add troubleshooting section

## 7. Examples and Tests

- [ ] 7.1 Add hook examples to examples/ directory
- [ ] 7.2 Create test fixtures for each hook
- [ ] 7.3 Document testing approach in guide
- [ ] 7.4 Add integration test examples

## 8. Plugin Registration

- [ ] 8.1 Update plugins/workflow/plugin.json with all hooks
- [ ] 8.2 Verify hook registration format
- [ ] 8.3 Test hooks in clean Claude Code session
- [ ] 8.4 Verify /hooks menu shows all three hooks

## 9. Validation and Review

- [ ] 9.1 Run bun run format on all hook files
- [ ] 9.2 Run bun run lint on all hook files
- [ ] 9.3 Validate performance targets met (<100ms for checklist, <2s for build)
- [ ] 9.4 Test enable/disable configuration works
- [ ] 9.5 Verify hooks follow ADR-0010 patterns
- [ ] 9.6 Review guide documentation for completeness

## 10. Final Integration

- [ ] 10.1 Test all hooks together in workflow plugin
- [ ] 10.2 Verify no conflicts between hooks
- [ ] 10.3 Update workflow plugin README if needed
- [ ] 10.4 Create commit following conventional commit format
