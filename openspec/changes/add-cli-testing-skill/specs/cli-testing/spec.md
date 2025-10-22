# CLI Testing Capability

## ADDED Requirements

### Requirement: CLI Test Execution

The skill SHALL enable automated generation and execution of CLI tests for TypeScript projects using the universal executor pattern.

#### Scenario: Basic CLI execution

- **WHEN** user requests testing a CLI command
- **THEN** the skill generates a test file with proper module imports
- **AND** executes the CLI command in an isolated environment
- **AND** returns stdout, stderr, and exit code
- **AND** cleans up temporary files after execution

#### Scenario: CLI execution with arguments

- **WHEN** user requests testing a CLI command with arguments
- **THEN** the skill properly escapes and passes arguments to the command
- **AND** validates argument handling
- **AND** returns execution results

#### Scenario: CLI execution timeout

- **WHEN** a CLI command exceeds the timeout threshold (default 30 seconds)
- **THEN** the skill terminates the process
- **AND** returns a timeout error with partial output
- **AND** cleans up resources

### Requirement: Monorepo Environment Support

The skill SHALL detect and configure appropriate testing contexts for monorepo environments.

#### Scenario: Nx monorepo detection

- **WHEN** testing in an Nx workspace (nx.json present)
- **THEN** the skill detects Nx configuration
- **AND** sets up workspace context for CLI execution
- **AND** handles inter-package dependencies

#### Scenario: Turborepo detection

- **WHEN** testing in a Turborepo workspace (turbo.json present)
- **THEN** the skill detects Turborepo configuration
- **AND** configures appropriate pipeline context
- **AND** resolves workspace package references

#### Scenario: pnpm workspaces detection

- **WHEN** testing in pnpm workspaces (pnpm-workspace.yaml present)
- **THEN** the skill detects workspace structure
- **AND** configures pnpm workspace context
- **AND** handles workspace protocol dependencies

#### Scenario: No monorepo

- **WHEN** testing in a standalone package (no monorepo config)
- **THEN** the skill uses standard Node.js module resolution
- **AND** executes tests in the package root

### Requirement: Package Manager Support

The skill SHALL auto-detect and support multiple package managers for test execution.

#### Scenario: pnpm detection

- **WHEN** pnpm-lock.yaml exists in the project
- **THEN** the skill uses pnpm for dependency resolution
- **AND** executes CLI commands with pnpm context

#### Scenario: Yarn detection

- **WHEN** yarn.lock exists (and pnpm-lock.yaml does not)
- **THEN** the skill uses yarn for dependency resolution
- **AND** executes CLI commands with yarn context

#### Scenario: npm fallback

- **WHEN** only package-lock.json exists OR no lockfile present
- **THEN** the skill uses npm for dependency resolution
- **AND** executes CLI commands with npm context

#### Scenario: Package manager override

- **WHEN** user specifies a package manager explicitly
- **THEN** the skill uses the specified manager regardless of lockfiles
- **AND** validates the manager is available

### Requirement: Cross-Platform Compatibility

The skill SHALL support CLI testing across different operating systems with platform-aware execution.

#### Scenario: Platform detection

- **WHEN** generating CLI tests
- **THEN** the skill detects the current platform (macOS, Linux, Windows)
- **AND** adapts shell commands for the platform
- **AND** uses appropriate path separators

#### Scenario: Platform-specific tests

- **WHEN** user requests platform-specific testing
- **THEN** the skill allows conditional test execution based on platform
- **AND** skips incompatible tests on unsupported platforms
- **AND** reports which tests were skipped

#### Scenario: Windows shell compatibility

- **WHEN** executing on Windows
- **THEN** the skill uses cmd.exe or PowerShell as appropriate
- **AND** handles Windows-specific path formats
- **AND** properly escapes Windows command syntax

### Requirement: Test Result Validation

The skill SHALL parse and validate CLI test results with clear success/failure reporting.

#### Scenario: Successful CLI execution

- **WHEN** CLI command exits with code 0
- **THEN** the skill reports test success
- **AND** returns stdout output
- **AND** provides execution time

#### Scenario: Failed CLI execution

- **WHEN** CLI command exits with non-zero code
- **THEN** the skill reports test failure
- **AND** returns stderr output
- **AND** includes exit code in results
- **AND** suggests potential causes if recognizable

#### Scenario: Output validation

- **WHEN** user provides expected output pattern
- **THEN** the skill validates stdout/stderr against the pattern
- **AND** reports match/mismatch results
- **AND** highlights differences if validation fails

### Requirement: Environment Isolation

The skill SHALL execute CLI tests in isolated environments to prevent side effects.

#### Scenario: Temporary file creation

- **WHEN** executing a CLI test
- **THEN** the skill creates temporary test files in isolated directories
- **AND** ensures unique filenames to prevent conflicts
- **AND** uses system temp directory

#### Scenario: Environment variable isolation

- **WHEN** executing a CLI test with custom environment variables
- **THEN** the skill sets variables only for the test execution
- **AND** restores original environment after test
- **AND** prevents pollution of parent process

#### Scenario: Cleanup on success

- **WHEN** CLI test completes successfully
- **THEN** the skill removes all temporary files
- **AND** restores environment state
- **AND** releases system resources

#### Scenario: Cleanup on failure

- **WHEN** CLI test fails or throws error
- **THEN** the skill still removes temporary files (try/finally)
- **AND** logs cleanup status
- **AND** does not suppress original error

### Requirement: Progressive Disclosure Documentation

The skill SHALL follow progressive disclosure pattern with core instructions in SKILL.md and advanced topics in API_REFERENCE.md.

#### Scenario: Basic usage documentation

- **WHEN** skill is loaded by Claude Code
- **THEN** SKILL.md provides core CLI testing instructions (< 500 lines)
- **AND** includes common scenarios (basic execution, monorepo, package managers)
- **AND** provides simple examples

#### Scenario: Advanced documentation access

- **WHEN** user needs advanced features (custom environment, complex monorepo)
- **THEN** skill references API_REFERENCE.md for detailed guidance
- **AND** API_REFERENCE.md covers cross-platform edge cases
- **AND** includes troubleshooting and performance tips

### Requirement: Context-Aware Activation

The skill SHALL auto-activate based on conversation triggers related to CLI testing.

#### Scenario: Keyword trigger activation

- **WHEN** conversation contains keywords: "CLI test", "command-line", "test CLI", "tsc-files", "validate CLI"
- **THEN** the skill activates automatically
- **AND** Claude reads SKILL.md for instructions

#### Scenario: Pattern trigger activation

- **WHEN** user describes testing a command-line tool or binary
- **THEN** the skill activates based on pattern matching
- **AND** provides CLI testing guidance
