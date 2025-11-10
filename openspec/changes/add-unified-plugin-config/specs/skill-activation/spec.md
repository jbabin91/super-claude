# Skill Activation Spec Delta

## MODIFIED Requirements

### Requirement: Plugin-Level Rule Discovery

The hook SHALL discover and load all `super-claude-config.json` files from installed plugins, falling back to `skill-rules.json` for backwards compatibility.

#### Scenario: Multiple plugins with super-claude-config.json

- **GIVEN** user project has meta and workflow plugins installed
- **AND** each plugin has `plugins/{plugin}/super-claude-config.json`
- **WHEN** hook executes
- **THEN** both `super-claude-config.json` files are discovered and loaded
- **AND** skill rules from the `skills` section of both configs are available for matching

#### Scenario: Plugin without configuration file

- **GIVEN** user project has a plugin without `super-claude-config.json`
- **WHEN** hook executes
- **THEN** plugin is skipped without error
- **AND** other plugins with config are still processed

#### Scenario: Malformed super-claude-config.json

- **GIVEN** plugin with invalid JSON in super-claude-config.json
- **WHEN** hook attempts to load the file
- **THEN** hook logs warning: "⚠️ Invalid super-claude-config.json in [plugin-name]"
- **AND** continues processing other plugins without crashing

#### Scenario: Backwards compatibility with skill-rules.json

- **GIVEN** plugin only has `skill-rules.json` (no `super-claude-config.json`)
- **WHEN** hook discovers plugin configurations
- **THEN** `skill-rules.json` is read and parsed
- **AND** skill rules are loaded successfully
- **AND** deprecation warning is logged: "⚠️ [plugin-name] using deprecated skill-rules.json. Migrate to super-claude-config.json"

#### Scenario: Both config formats present

- **GIVEN** plugin has both `super-claude-config.json` and `skill-rules.json`
- **WHEN** hook discovers plugin configurations
- **THEN** `super-claude-config.json` takes precedence
- **AND** `skill-rules.json` is ignored
- **AND** no deprecation warning is logged

---

### Requirement: Project Override Support

The hook SHALL support project-level overrides in `.claude/super-claude-config.json` with higher precedence than plugin defaults.

#### Scenario: Override skill triggers

- **GIVEN** workflow plugin defines skill with triggers in `super-claude-config.json`
- **AND** project has `.claude/super-claude-config.json` with modified triggers for that skill
- **WHEN** hook merges configuration
- **THEN** project triggers override plugin triggers
- **AND** skill matches based on project configuration

#### Scenario: Disable specific skill

- **GIVEN** plugin defines a skill in `super-claude-config.json`
- **AND** project config includes `workflow.skills.skill-name.enabled = false`
- **WHEN** hook processes configuration
- **THEN** skill is excluded from matching
- **AND** does not appear in suggestions even if prompt matches

#### Scenario: Add custom keywords to existing skill

- **GIVEN** plugin defines skill with keywords in `super-claude-config.json`
- **AND** project config adds additional keywords for that skill
- **WHEN** hook merges configuration
- **THEN** skill matches against both plugin and project keywords

#### Scenario: Deep merge behavior

- **GIVEN** plugin config defines skill with `triggers.keywords` and `triggers.patterns`
- **AND** project config only overrides `triggers.keywords`
- **WHEN** hook merges configuration
- **THEN** keywords are replaced with project values
- **AND** patterns are preserved from plugin defaults

---

### Requirement: Configuration Commands

The `/configure-activation` command SHALL generate `.claude/super-claude-config.json` template with current plugin defaults and comments.

#### Scenario: Generate unified configuration template

- **GIVEN** user has workflow and meta plugins installed
- **AND** user runs `/configure-activation` slash command
- **AND** `.claude/super-claude-config.json` does not exist
- **WHEN** command executes
- **THEN** file is created with structure organized by plugin name
- **AND** includes current plugin defaults for all skills
- **AND** includes comments explaining override behavior
- **AND** includes examples for enabling/disabling skills
- **AND** includes examples for modifying triggers

#### Scenario: File already exists

- **GIVEN** user runs `/configure-activation` command
- **AND** `.claude/super-claude-config.json` already exists
- **WHEN** command executes
- **THEN** command prompts: "File exists. Overwrite? (y/n)"
- **AND** only overwrites if user confirms
- **AND** preserves user customizations if user declines

---

### Requirement: Schema Validation

All `super-claude-config.json` files SHALL conform to `.claude-plugin/super-claude-config.schema.json` schema.

#### Scenario: Valid plugin configuration

- **GIVEN** plugin `super-claude-config.json` with required fields (plugin, skills, hooks)
- **WHEN** hook loads the file
- **THEN** file passes schema validation
- **AND** all skills and hooks are available for processing

#### Scenario: Missing required field in plugin config

- **GIVEN** plugin `super-claude-config.json` without "plugin" field
- **WHEN** hook loads the file
- **THEN** hook logs warning: "⚠️ Invalid schema in [plugin-name]: missing 'plugin' field"
- **AND** skips that plugin
- **AND** continues processing other plugins

#### Scenario: Invalid project override structure

- **GIVEN** `.claude/super-claude-config.json` with invalid nested structure
- **WHEN** hook loads the file
- **THEN** hook logs warning: "⚠️ Invalid project configuration: [specific error]"
- **AND** falls back to plugin defaults
- **AND** continues execution without crashing

---

### Requirement: Configuration File Format

Skills configuration SHALL be nested under `skills` section in `super-claude-config.json`.

#### Scenario: Plugin configuration structure

- **GIVEN** plugin `super-claude-config.json`
- **WHEN** defining skill activation rules
- **THEN** skills are nested under `skills` object
- **AND** each skill key matches the skill directory name
- **AND** skill configuration includes `triggers` object with `keywords` and `patterns`

```json
{
  "plugin": "workflow",
  "skills": {
    "skill-name": {
      "triggers": {
        "keywords": ["keyword1"],
        "patterns": ["pattern1"]
      }
    }
  },
  "hooks": {}
}
```

#### Scenario: Project override structure

- **GIVEN** `.claude/super-claude-config.json`
- **WHEN** overriding skill configuration
- **THEN** skills are nested under `{plugin-name}.skills` path
- **AND** only fields being overridden need to be specified

```json
{
  "workflow": {
    "skills": {
      "skill-name": {
        "enabled": false
      }
    }
  }
}
```

---
