# Pull Request Workflow Capability

## ADDED Requirements

### Requirement: PR Description Generation

The skill SHALL generate PR descriptions from commit history.

#### Scenario: Analyze commit history

- **WHEN** generating PR description
- **THEN** the skill analyzes commit messages since branch diverged
- **AND** groups commits by type (feat, fix, docs, etc.)
- **AND** creates summary

#### Scenario: Follow PR template

- **WHEN** PR template exists
- **THEN** the skill fills template sections
- **AND** maintains template structure

### Requirement: Issue Linking

The skill SHALL automatically link related issues and PRs.

#### Scenario: Extract issue references

- **WHEN** commits reference issues (e.g., "#123")
- **THEN** the skill includes "Closes #123" in description

### Requirement: Test Plan Generation

The skill SHALL generate test plan sections for PRs.

#### Scenario: Create test checklist

- **WHEN** PR includes new features
- **THEN** the skill generates test plan checklist

### Requirement: Context-Aware Activation

The skill SHALL activate for PR description tasks.

#### Scenario: Keyword trigger

- **WHEN** conversation mentions "PR description", "pull request", "create PR"
- **THEN** the skill activates
