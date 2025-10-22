# Git Commit Workflow Capability

## ADDED Requirements

### Requirement: Conventional Commit Format

The skill SHALL generate commit messages following conventional commit format with gitmoji integration.

#### Scenario: Basic commit message format

- **WHEN** user requests a commit message
- **THEN** the skill generates format: `<type>(<scope>): <gitmoji> <description>`
- **AND** type is one of: feat, fix, docs, chore, refactor, test
- **AND** gitmoji matches the commit type
- **AND** description is in imperative mood

#### Scenario: Commit without scope

- **WHEN** changes affect single area or scope is not clear
- **THEN** the skill generates format: `<type>: <gitmoji> <description>`
- **AND** omits the scope parentheses

#### Scenario: Multi-line commit with body

- **WHEN** changes are complex and need explanation
- **THEN** the skill includes a body section after blank line
- **AND** body explains what and why (not how)
- **AND** wraps body lines at 72 characters

### Requirement: Gitmoji Auto-Selection

The skill SHALL automatically select appropriate gitmoji based on commit type and changes.

#### Scenario: Feature commit gitmoji

- **WHEN** commit type is "feat"
- **THEN** the skill uses ✨ `:sparkles:` gitmoji

#### Scenario: Bug fix gitmoji

- **WHEN** commit type is "fix"
- **THEN** the skill uses 🐛 `:bug:` gitmoji

#### Scenario: Documentation gitmoji

- **WHEN** commit type is "docs"
- **THEN** the skill uses 📝 `:memo:` gitmoji

#### Scenario: Chore/tooling gitmoji

- **WHEN** commit type is "chore"
- **THEN** the skill uses 🔨 `:hammer:` gitmoji

#### Scenario: Refactoring gitmoji

- **WHEN** commit type is "refactor"
- **THEN** the skill uses ♻️ `:recycle:` gitmoji

#### Scenario: Test gitmoji

- **WHEN** commit type is "test"
- **THEN** the skill uses ✅ `:white_check_mark:` gitmoji

#### Scenario: Custom gitmoji override

- **WHEN** user specifies a different gitmoji
- **THEN** the skill uses the user-specified gitmoji
- **AND** maintains conventional commit format

### Requirement: Scope Detection

The skill SHALL automatically detect commit scope from staged file paths.

#### Scenario: Single directory changes

- **WHEN** all staged files are in one directory (e.g., `src/auth/`)
- **THEN** the skill suggests scope from directory name (e.g., "auth")

#### Scenario: Plugin/package scope

- **WHEN** staged files are in a plugin directory (e.g., `plugins/typescript-tools/`)
- **THEN** the skill suggests scope from plugin name (e.g., "typescript-tools")

#### Scenario: Multiple scopes

- **WHEN** staged files span multiple directories
- **THEN** the skill suggests using primary scope or omitting scope
- **AND** notes multiple areas affected in commit body

#### Scenario: Root-level changes

- **WHEN** staged files are configuration or documentation at root
- **THEN** the skill omits scope or uses generic scope like "config" or "docs"

### Requirement: Commit Type Detection

The skill SHALL analyze git status and diff to suggest appropriate commit type.

#### Scenario: New files detected

- **WHEN** git status shows new untracked files being added
- **THEN** the skill suggests "feat" type for new capabilities
- **AND** uses ✨ `:sparkles:` gitmoji

#### Scenario: Bug fix patterns

- **WHEN** commit message or changes mention "fix", "bug", "issue"
- **THEN** the skill suggests "fix" type
- **AND** uses 🐛 `:bug:` gitmoji

#### Scenario: Documentation changes

- **WHEN** only .md files are staged
- **THEN** the skill suggests "docs" type
- **AND** uses 📝 `:memo:` gitmoji

#### Scenario: Test file changes

- **WHEN** only test files are staged (_.test.ts, _.spec.ts)
- **THEN** the skill suggests "test" type
- **AND** uses ✅ `:white_check_mark:` gitmoji

#### Scenario: Refactoring detection

- **WHEN** code changes but no new features or fixes
- **THEN** the skill suggests "refactor" type
- **AND** uses ♻️ `:recycle:` gitmoji

### Requirement: Message Validation

The skill SHALL validate commit messages against conventional commit standards.

#### Scenario: Subject line length

- **WHEN** generating commit message
- **THEN** the skill keeps subject line under 72 characters
- **AND** warns if description is too long

#### Scenario: Imperative mood

- **WHEN** generating description
- **THEN** the skill uses imperative mood ("add" not "added")
- **AND** starts with lowercase (after gitmoji)

#### Scenario: No trailing punctuation

- **WHEN** generating subject line
- **THEN** the skill omits trailing period
- **AND** removes other trailing punctuation

#### Scenario: Capitalization

- **WHEN** description starts after gitmoji
- **THEN** the skill uses lowercase for first word
- **AND** maintains proper nouns capitalization

### Requirement: Breaking Change Handling

The skill SHALL detect and properly format breaking changes in commits.

#### Scenario: Breaking change detection

- **WHEN** changes include breaking API changes or removals
- **THEN** the skill adds BREAKING CHANGE footer
- **AND** includes exclamation mark: `<type>!(<scope>):`

#### Scenario: Breaking change description

- **WHEN** breaking change is detected
- **THEN** the skill adds footer: "BREAKING CHANGE: <description>"
- **AND** explains migration path in body
- **AND** warns user about semantic versioning impact (major version bump)

#### Scenario: Multiple breaking changes

- **WHEN** multiple breaking changes in one commit
- **THEN** the skill lists all breaking changes in footer
- **AND** uses bullet points for clarity

### Requirement: Commit Message Assembly

The skill SHALL assemble complete commit messages from analyzed components.

#### Scenario: Simple commit assembly

- **WHEN** generating a basic commit
- **THEN** the skill combines type, scope, gitmoji, and description
- **AND** validates format before presenting to user

#### Scenario: Complex commit with body

- **WHEN** changes need explanation
- **THEN** the skill adds blank line after subject
- **AND** includes body explaining changes
- **AND** optionally adds footer for issues/PRs

#### Scenario: Issue reference

- **WHEN** commit relates to an issue or PR
- **THEN** the skill adds footer: "Closes #123" or "Refs #456"
- **AND** uses proper GitHub keywords (Closes, Fixes, Resolves)

### Requirement: Context-Aware Activation

The skill SHALL auto-activate based on conversation triggers related to git commits.

#### Scenario: Keyword trigger activation

- **WHEN** conversation contains: "commit", "conventional commit", "gitmoji", "commit message"
- **THEN** the skill activates automatically
- **AND** Claude reads SKILL.md for instructions

#### Scenario: Git workflow trigger

- **WHEN** user shows git status or requests help committing changes
- **THEN** the skill activates
- **AND** analyzes staged changes to suggest commit message
