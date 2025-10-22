# Changelog Generation Capability

## ADDED Requirements

### Requirement: Conventional Commit Parsing

The skill SHALL parse conventional commit messages for changelog generation.

#### Scenario: Parse commit types

- **WHEN** analyzing commits
- **THEN** the skill categorizes by type: feat, fix, docs, refactor, etc.
- **AND** maps to changelog sections: Added, Changed, Fixed

### Requirement: Keep a Changelog Format

The skill SHALL generate changelog in Keep a Changelog format.

#### Scenario: Generate version section

- **WHEN** creating changelog entry
- **THEN** the skill creates ## [version] - YYYY-MM-DD section
- **AND** groups changes by category

#### Scenario: Format entries

- **WHEN** adding changelog entries
- **THEN** the skill uses bullet points
- **AND** includes scope if present

### Requirement: Breaking Change Detection

The skill SHALL highlight breaking changes in changelog.

#### Scenario: Detect breaking changes

- **WHEN** commits have BREAKING CHANGE footer
- **THEN** the skill adds to ### BREAKING CHANGES section
- **AND** provides migration guidance

### Requirement: Context-Aware Activation

The skill SHALL activate for changelog tasks.

#### Scenario: Keyword trigger

- **WHEN** conversation mentions "changelog", "CHANGELOG.md", "release notes"
- **THEN** the skill activates
