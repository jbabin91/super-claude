# Type Checking Capability

## ADDED Requirements

### Requirement: Type Error Detection

The skill SHALL identify common TypeScript type errors from tsc output.

#### Scenario: Parse tsc errors

- **WHEN** running TypeScript compiler
- **THEN** the skill parses error messages
- **AND** categorizes error types
- **AND** suggests fixes

### Requirement: Auto-Fix Common Errors

The skill SHALL automatically fix standard TypeScript type errors.

#### Scenario: Missing type annotation

- **WHEN** variable lacks type annotation
- **THEN** the skill infers type from usage
- **AND** adds appropriate type annotation

#### Scenario: Null safety issues

- **WHEN** value possibly null/undefined
- **THEN** the skill adds null checks or optional chaining
- **AND** maintains type safety

#### Scenario: Any type replacement

- **WHEN** any type is used
- **THEN** the skill suggests specific type
- **AND** improves type safety

### Requirement: Type Inference Improvements

The skill SHALL improve type inference where possible.

#### Scenario: Generic type parameters

- **WHEN** generic types need specification
- **THEN** the skill infers types from usage
- **AND** adds type parameters

### Requirement: Context-Aware Activation

The skill SHALL activate for type error fixes.

#### Scenario: Keyword trigger

- **WHEN** conversation mentions "type error", "fix types", "tsc error", "type checking"
- **THEN** the skill activates automatically
