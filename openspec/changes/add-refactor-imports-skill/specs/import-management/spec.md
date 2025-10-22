# Import Management Capability

## ADDED Requirements

### Requirement: Path Alias Management

The skill SHALL manage TypeScript path aliases and convert between relative and aliased imports.

#### Scenario: Detect path aliases from tsconfig

- **WHEN** analyzing a TypeScript project
- **THEN** the skill reads tsconfig.json paths configuration
- **AND** identifies all configured path aliases

#### Scenario: Convert relative to alias

- **WHEN** relative import can use path alias
- **THEN** the skill converts to aliased import
- **AND** maintains import functionality

#### Scenario: Convert alias to relative

- **WHEN** aliased import should use relative path
- **THEN** the skill converts to relative import
- **AND** calculates correct relative path

### Requirement: Unused Import Detection

The skill SHALL detect and remove unused imports while preserving side-effect imports.

#### Scenario: Identify unused imports

- **WHEN** analyzing import statements
- **THEN** the skill identifies imports not referenced in code
- **AND** suggests removal

#### Scenario: Preserve side-effect imports

- **WHEN** import has no explicit usage but needed for side effects
- **THEN** the skill preserves the import
- **AND** does not suggest removal

#### Scenario: Safe removal

- **WHEN** removing unused imports
- **THEN** the skill removes entire import statement if all specifiers unused
- **AND** removes only unused specifiers if others are used

### Requirement: Import Organization

The skill SHALL organize imports into consistent groups with proper sorting.

#### Scenario: Group imports

- **WHEN** organizing imports
- **THEN** the skill groups by: external packages, internal modules, relative imports
- **AND** adds blank lines between groups

#### Scenario: Sort alphabetically

- **WHEN** organizing imports within a group
- **THEN** the skill sorts alphabetically by module path
- **AND** maintains consistent ordering

#### Scenario: Separate type imports

- **WHEN** organizing TypeScript type imports
- **THEN** the skill uses `import type` syntax for type-only imports
- **AND** groups type imports separately

### Requirement: Auto-Fix Capabilities

The skill SHALL automatically fix common import issues.

#### Scenario: Merge duplicate imports

- **WHEN** multiple imports from same module
- **THEN** the skill merges into single import statement
- **AND** combines all specifiers

#### Scenario: Format import statements

- **WHEN** import formatting is inconsistent
- **THEN** the skill applies consistent formatting
- **AND** follows project style guidelines

### Requirement: Context-Aware Activation

The skill SHALL auto-activate for import-related tasks.

#### Scenario: Keyword trigger

- **WHEN** conversation mentions "import", "refactor imports", "path alias", "unused imports"
- **THEN** the skill activates automatically
