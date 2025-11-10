# Plugin Configuration Spec Delta

## ADDED Requirements

### Requirement: Configuration File Format

The system SHALL use `super-claude-config.json` as the standard configuration file format for all plugins.

#### Scenario: Plugin default configuration

- **WHEN** a plugin is installed from the marketplace
- **THEN** the plugin includes a `super-claude-config.json` file with default settings
- **AND** the file contains `skills` and `hooks` sections organized by feature

#### Scenario: Project-level configuration override

- **WHEN** a user wants to customize plugin behavior
- **THEN** they create `.claude/super-claude-config.json` in their project
- **AND** settings are organized by plugin name at the top level
- **AND** overrides are deep-merged with plugin defaults

### Requirement: Configuration Schema

The system SHALL validate configuration files against a JSON schema.

#### Scenario: Valid configuration structure

- **WHEN** a configuration file is loaded
- **THEN** it is validated against `.claude-plugin/super-claude-config.schema.json`
- **AND** invalid configurations are rejected with clear error messages

#### Scenario: Plugin-level configuration

- **WHEN** reading plugin default configuration from `plugins/{plugin}/super-claude-config.json`
- **THEN** the file contains a `plugin` field identifying the plugin name
- **AND** contains `skills` object with skill configurations
- **AND** contains `hooks` object with hook configurations

#### Scenario: Project-level configuration

- **WHEN** reading project override configuration from `.claude/super-claude-config.json`
- **THEN** the file contains plugin names as top-level keys
- **AND** each plugin section contains `skills` and `hooks` overrides

### Requirement: Configuration Loading Priority

The system SHALL load configuration with the following precedence: environment variables > project overrides > plugin defaults.

#### Scenario: Default configuration

- **WHEN** no project overrides exist
- **THEN** plugin defaults from `plugins/{plugin}/super-claude-config.json` are used

#### Scenario: Project override

- **WHEN** `.claude/super-claude-config.json` exists with plugin settings
- **THEN** project settings override plugin defaults
- **AND** unspecified settings use plugin defaults

#### Scenario: Environment variable override

- **WHEN** environment variable `CLAUDE_HOOK_*_ENABLED` is set
- **THEN** it overrides both project and plugin configuration
- **AND** other settings from project/plugin config are preserved

### Requirement: Deep Merge Behavior

The system SHALL deep-merge configuration objects at the field level, not the section level.

#### Scenario: Partial override

- **WHEN** project config overrides only `hooks.gitCommitGuard.enabled`
- **THEN** other `gitCommitGuard` settings use plugin defaults
- **AND** other hooks use plugin defaults entirely

#### Scenario: Array override

- **WHEN** project config specifies `hooks.branchNameValidator.allowedPrefixes`
- **THEN** the array completely replaces the plugin default array
- **AND** arrays are not merged item-by-item

### Requirement: Configuration Loader Performance

The configuration loader SHALL complete in less than 50ms to avoid blocking hook execution.

#### Scenario: Cached configuration

- **WHEN** configuration is loaded multiple times in a session
- **THEN** subsequent loads use in-memory cache
- **AND** total loading time is under 50ms

#### Scenario: Uncached configuration

- **WHEN** configuration is loaded for the first time
- **THEN** files are read from disk
- **AND** results are cached for subsequent access
- **AND** total loading time is under 50ms

### Requirement: Backwards Compatibility

The system SHALL support reading `skill-rules.json` files during the transition period.

#### Scenario: Legacy skill-rules.json

- **WHEN** a plugin only has `skill-rules.json` (no `super-claude-config.json`)
- **THEN** the system reads skill activation rules from `skill-rules.json`
- **AND** logs a deprecation warning

#### Scenario: Both files present

- **WHEN** both `skill-rules.json` and `super-claude-config.json` exist
- **THEN** `super-claude-config.json` takes precedence
- **AND** no deprecation warning is logged

### Requirement: Configuration Discovery

The system SHALL provide a command to generate project-level configuration templates.

#### Scenario: Generate configuration template

- **WHEN** user runs `/configure-activation` slash command
- **THEN** a `.claude/super-claude-config.json` template is created
- **AND** the template includes current plugin defaults with comments
- **AND** the template explains override behavior

### Requirement: Configuration Documentation

Each plugin SHALL document available configuration options in its README.

#### Scenario: Plugin documentation

- **WHEN** a plugin includes configurable behavior
- **THEN** the plugin README documents all available settings
- **AND** provides examples of common configurations
- **AND** explains when to use each setting

### Requirement: Error Handling

The system SHALL handle configuration errors gracefully without blocking functionality.

#### Scenario: Invalid JSON syntax

- **WHEN** a configuration file contains invalid JSON
- **THEN** an error is logged with the parsing error
- **AND** the system falls back to plugin defaults
- **AND** hooks and skills continue to function

#### Scenario: Invalid configuration values

- **WHEN** a configuration file contains invalid values (wrong types, unknown fields)
- **THEN** validation errors are logged with specific field names
- **AND** the system falls back to plugin defaults
- **AND** hooks and skills continue to function

#### Scenario: Missing configuration file

- **WHEN** no configuration file exists
- **THEN** the system uses plugin defaults
- **AND** no error is logged (this is expected behavior)
