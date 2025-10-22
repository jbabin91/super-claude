# Test Generation Capability

## ADDED Requirements

### Requirement: Vitest Test Generation

The skill SHALL generate Vitest test files with proper structure and imports.

#### Scenario: Basic test file generation

- **WHEN** generating tests for a source file
- **THEN** the skill creates .test.ts file with Vitest imports
- **AND** includes describe and test blocks
- **AND** follows Vitest best practices

### Requirement: Mock Generation

The skill SHALL generate appropriate mocks for dependencies.

#### Scenario: Module mock generation

- **WHEN** function has external dependencies
- **THEN** the skill generates vi.mock() statements
- **AND** creates mock implementations

#### Scenario: Spy generation

- **WHEN** testing function calls
- **THEN** the skill generates vi.spyOn() usage
- **AND** includes spy assertions

### Requirement: Assertion Generation

The skill SHALL generate appropriate assertions based on function behavior.

#### Scenario: Return value assertions

- **WHEN** function returns value
- **THEN** the skill generates expect().toBe() or toEqual() assertions

#### Scenario: Async function assertions

- **WHEN** function is async
- **THEN** the skill uses await with expect()
- **AND** includes proper async test setup

### Requirement: Context-Aware Activation

The skill SHALL activate for test generation requests.

#### Scenario: Keyword trigger

- **WHEN** conversation mentions "generate test", "create test", "test for", "vitest"
- **THEN** the skill activates automatically
