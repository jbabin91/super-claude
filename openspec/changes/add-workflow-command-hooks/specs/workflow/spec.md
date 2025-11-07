# Workflow Plugin Spec Deltas

## ADDED Requirements

### Requirement: Session Context Display

The workflow plugin SHALL provide a SessionStart hook that displays relevant context at the beginning of each session.

#### Scenario: Session starts with git repository

- **WHEN** a new or resumed session starts in a git repository
- **THEN** the hook displays current branch, git status, and recent commits
- **AND** execution completes in <100ms

#### Scenario: Session starts with active OpenSpec changes

- **WHEN** a new session starts and openspec/changes/ contains active proposals
- **THEN** the hook displays list of active changes with task progress
- **AND** provides quick reference to OpenSpec commands

#### Scenario: Session starts in non-git directory

- **WHEN** a session starts outside a git repository
- **THEN** the hook exits gracefully without error
- **AND** no git information is displayed

### Requirement: Type Safety Validation

The workflow plugin SHALL provide a PreToolUse hook that validates TypeScript types before file modifications.

#### Scenario: Edit tool with valid TypeScript

- **WHEN** Edit or Write tool is used on TypeScript files
- **AND** changes would result in valid types
- **THEN** the hook approves the operation (exit code 0)
- **AND** execution completes in <2 seconds

#### Scenario: Edit tool with type errors

- **WHEN** Edit or Write tool is used on TypeScript files
- **AND** changes would result in type errors
- **THEN** the hook blocks the operation (exit code 2)
- **AND** provides clear error messages with file locations
- **AND** suggests running `bun run typecheck` for details

#### Scenario: Non-TypeScript file modification

- **WHEN** Edit or Write tool is used on non-TypeScript files
- **THEN** the hook approves immediately without type checking
- **AND** execution completes in <10ms

#### Scenario: Incremental type checking

- **WHEN** multiple TypeScript files are modified in sequence
- **THEN** the hook only checks modified files (not entire project)
- **AND** uses @jbabin91/tsc-files for performance

### Requirement: Commit Intent Verification

The workflow plugin SHALL provide a PreToolUse hook that prevents auto-committing without explicit user request.

#### Scenario: Explicit commit request

- **WHEN** user explicitly requests "commit these changes"
- **AND** Bash tool attempts git commit
- **THEN** the hook approves the commit (exit code 0)

#### Scenario: Implicit commit attempt

- **WHEN** user requests "implement feature X"
- **AND** Claude attempts git commit without being asked
- **THEN** the hook blocks the commit (exit code 2)
- **AND** displays warning: "About to commit without explicit request. Did you want to review changes first?"

#### Scenario: Hook disabled for project

- **WHEN** .claude/settings.json contains `customHooks.gitCommitGuard.enabled: false`
- **AND** Bash tool attempts git commit
- **THEN** the hook approves immediately without analysis

#### Scenario: Personal override

- **WHEN** .claude/settings.local.json contains `customHooks.gitCommitGuard.enabled: false`
- **AND** project settings have it enabled
- **THEN** the local setting takes precedence (hook disabled for this developer)

### Requirement: Hook Configuration System

The workflow plugin SHALL provide a configuration system for enabling/disabling hooks per-project and per-developer.

#### Scenario: Project-level hook configuration

- **WHEN** .claude/settings.json contains customHooks configuration
- **THEN** all developers inherit these settings
- **AND** settings are version controlled

#### Scenario: Personal hook overrides

- **WHEN** .claude/settings.local.json exists (gitignored)
- **THEN** personal settings override project settings
- **AND** other developers are unaffected

#### Scenario: Settings hierarchy

- **WHEN** hook reads configuration
- **THEN** settings merge in order: global → project → local
- **AND** more specific settings override broader ones

#### Scenario: Missing configuration

- **WHEN** no configuration files exist
- **THEN** hooks use sensible defaults (enabled: true)
- **AND** operate without errors

### Requirement: Hook Performance Standards

All workflow hooks SHALL meet performance targets appropriate for their event type.

#### Scenario: SessionStart hook performance

- **WHEN** SessionStart hook executes
- **THEN** total execution time is <100ms
- **AND** hook logs warning if target exceeded

#### Scenario: PreToolUse hook performance

- **WHEN** PreToolUse hook executes for simple validation
- **THEN** execution time is <50ms for file checks
- **AND** execution time is <2s for type checking
- **AND** hook logs warning if targets exceeded

#### Scenario: Hook error handling

- **WHEN** a hook encounters an error
- **THEN** the error doesn't crash the Claude Code session
- **AND** the hook exits cleanly (fail open)
- **AND** error details are logged for debugging

### Requirement: Hook Documentation

The workflow plugin SHALL provide comprehensive documentation for hook development.

#### Scenario: Command hooks guide available

- **WHEN** developer needs to create a new hook
- **THEN** docs/guides/command-hooks.md provides implementation patterns
- **AND** guide references ADR-0010 for hook type selection
- **AND** guide includes configuration examples

#### Scenario: Hook testing guidance

- **WHEN** developer needs to test a hook
- **THEN** guide provides testing strategies
- **AND** guide includes test fixture examples
- **AND** guide documents integration testing approaches

#### Scenario: Configuration patterns documented

- **WHEN** developer needs to make a hook configurable
- **THEN** guide documents settings hierarchy
- **AND** guide provides configuration examples
- **AND** guide documents enable/disable patterns
