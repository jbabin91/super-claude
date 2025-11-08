# Tooling Specification

**Note:** This is a tooling-only change that does not affect user-facing capabilities. This placeholder spec satisfies OpenSpec validation requirements. During archiving, use `openspec archive add-schema-validation --skip-specs --yes` to skip spec updates.

## ADDED Requirements

### Requirement: Schema Validation Infrastructure

The development tooling SHALL provide automated validation of plugin manifests and skill frontmatter to prevent schema errors from reaching the marketplace.

#### Scenario: Valid schema passes validation

- **WHEN** a developer commits changes to plugin.json with valid schema
- **THEN** the pre-commit hook validates successfully
- **AND** the commit proceeds without errors

#### Scenario: Invalid schema blocks commit

- **WHEN** a developer commits changes to plugin.json with invalid schema
- **THEN** the pre-commit hook fails validation
- **AND** clear error messages guide the developer to fix the issues
- **AND** the commit is blocked until schemas are valid
