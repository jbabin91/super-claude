# TypeScript Plugin Spec Deltas

## ADDED Requirements

### Requirement: Systematic Code Refactoring

The typescript plugin SHALL provide a skill that systematically improves code quality without changing functionality.

#### Scenario: Refactoring request

- **WHEN** user requests code refactoring or cleanup
- **THEN** code-refactorer skill activates
- **AND** follows 6-phase methodology
- **AND** preserves exact functionality
- **AND** improves code structure and readability

#### Scenario: Auto-activation

- **WHEN** user mentions "refactor", "clean up", or "improve code"
- **THEN** code-refactorer skill auto-activates
- **AND** provides systematic refactoring guidance
- **AND** applies super-claude patterns

### Requirement: Six-Phase Methodology

The code-refactorer skill SHALL follow a systematic six-phase process.

#### Scenario: Initial assessment

- **WHEN** refactoring begins
- **THEN** skill assesses current functionality completely
- **AND** understands what code does before changes
- **AND** identifies mental test cases

#### Scenario: Goal clarification

- **WHEN** assessment completes
- **THEN** skill asks about user priorities
- **AND** clarifies goals (performance, readability, maintainability, standards)
- **AND** confirms scope boundaries

#### Scenario: Systematic analysis

- **WHEN** goals are clear
- **THEN** skill examines code for improvement opportunities
- **AND** identifies duplication, complexity, naming issues
- **AND** respects CLAUDE.md and project context

#### Scenario: Refactoring proposals

- **WHEN** analysis completes
- **THEN** skill provides before/after code samples
- **AND** explains WHAT changed and WHY
- **AND** shows concrete examples (not theoretical)

### Requirement: TypeScript-Specific Patterns

The code-refactorer skill SHALL include TypeScript and React refactoring patterns.

#### Scenario: TypeScript refactoring

- **WHEN** refactoring TypeScript code
- **THEN** skill improves type narrowing
- **AND** optimizes generic type parameters
- **AND** simplifies union/intersection types
- **AND** enhances type inference

#### Scenario: React component refactoring

- **WHEN** refactoring React components
- **THEN** skill improves component composition
- **AND** extracts reusable hooks
- **AND** optimizes props interfaces
- **AND** simplifies state management

#### Scenario: Import/export refactoring

- **WHEN** refactoring imports and exports
- **THEN** skill follows ADR-0005 (No Barrel Exports)
- **AND** uses explicit exports only
- **AND** removes unused imports
- **AND** organizes import statements
- **AND** fixes circular dependencies

### Requirement: Super-Claude Integration

The code-refactorer skill SHALL integrate with super-claude patterns and conventions.

#### Scenario: Base UI patterns

- **WHEN** refactoring Base UI components
- **THEN** skill improves component composition
- **AND** enhances accessibility patterns
- **AND** optimizes style prop usage
- **AND** follows unstyled component patterns

#### Scenario: TanStack ecosystem patterns

- **WHEN** refactoring TanStack code
- **THEN** skill optimizes Query patterns
- **AND** improves Router patterns
- **AND** enhances Form patterns
- **AND** refines Table patterns

#### Scenario: ADR compliance

- **WHEN** refactoring code
- **THEN** skill references ADR-0005 for exports
- **AND** follows ADR-0009 for file organization
- **AND** maintains super-claude conventions

### Requirement: Strict Boundaries

The code-refactorer skill SHALL maintain strict boundaries to preserve functionality.

#### Scenario: No feature additions

- **WHEN** refactoring code
- **THEN** skill MUST NOT add new features
- **AND** MUST NOT change behavior
- **AND** MUST NOT make assumptions about requirements
- **AND** only improves structure and readability

#### Scenario: Mental testing

- **WHEN** proposing refactoring
- **THEN** skill mentally tests functionality preservation
- **AND** verifies inputs produce same outputs
- **AND** maintains edge case handling

#### Scenario: Incremental improvements

- **WHEN** multiple improvements possible
- **THEN** skill prefers incremental changes over rewrites
- **AND** maintains project style consistency
- **AND** prioritizes high-value, low-risk changes

### Requirement: Attribution and Licensing

The code-refactorer skill SHALL properly attribute original work and maintain license compliance.

#### Scenario: Attribution present

- **WHEN** code-refactorer skill is used
- **THEN** YAML frontmatter includes attribution section
- **AND** credits Ian Nuttall as original author
- **AND** references iannuttall/claude-agents repository
- **AND** notes MIT license
- **AND** indicates agent-to-skill conversion and super-claude adaptations
