# skill-activation Specification

## Purpose

TBD - created by archiving change add-skill-auto-activation. Update Purpose after archive.

## Requirements

### Requirement: Hook Execution on Prompt Submit

The `skill-activation-prompt.ts` hook SHALL execute on every `user-prompt-submit` event and analyze the user's prompt for skill matches.

#### Scenario: User submits prompt with skill keyword

- **GIVEN** user project with skill-activation-prompt.ts hook installed
- **AND** claude-tools plugin with skill-rules.json defining "create skill" as keyword
- **WHEN** user submits prompt "I want to create a new skill for testing"
- **THEN** hook executes and matches keyword "create skill"
- **AND** outputs formatted suggestion: "📚 RECOMMENDED SKILLS: → skill-creator"

#### Scenario: User submits prompt with no matches

- **GIVEN** user project with skill-activation-prompt.ts hook installed
- **AND** claude-tools plugin with skill-rules.json
- **WHEN** user submits prompt "What's the weather today?"
- **THEN** hook executes but finds no matches
- **AND** no output is generated (exits cleanly with code 0)

#### Scenario: Bun runtime not available

- **GIVEN** user project with skill-activation-prompt.ts hook installed
- **AND** Bun is not installed on the system
- **WHEN** hook attempts to execute
- **THEN** hook outputs error message: "⚠️ Bun required for skill activation"
- **AND** provides installation URL: "Install: <https://bun.sh>"
- **AND** exits with code 1

---

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

### Requirement: Keyword Matching

The hook SHALL match prompts against skill keywords using case-insensitive literal matching.

#### Scenario: Exact keyword match

- **GIVEN** skill-creator has keyword "create skill"
- **WHEN** user prompt is "I want to create skill for testing"
- **THEN** keyword "create skill" matches
- **AND** skill-creator is suggested

#### Scenario: Case-insensitive matching

- **GIVEN** skill-creator has keyword "create skill"
- **WHEN** user prompt is "I want to CREATE SKILL for testing"
- **THEN** keyword matches (case-insensitive)
- **AND** skill-creator is suggested

---

### Requirement: Intent Pattern Matching

The hook SHALL match prompts against skill intent patterns using regex with case-insensitive flag.

#### Scenario: Regex pattern matches intent

- **GIVEN** skill-creator has pattern "(create|add).\*?skill"
- **WHEN** user prompt is "How do I add a new skill?"
- **THEN** regex matches "add ... skill"
- **AND** skill-creator is suggested

#### Scenario: Complex intent pattern

- **GIVEN** hook-creator has pattern "(how to|how do I)._?(create|add)._?hook"
- **WHEN** user prompt is "How do I create a pre-commit hook?"
- **THEN** regex matches
- **AND** hook-creator is suggested

#### Scenario: Invalid regex pattern

- **GIVEN** skill has invalid regex pattern "(unclosed"
- **WHEN** hook attempts to compile pattern
- **THEN** hook logs warning: "⚠️ Invalid regex in [skill-name]"
- **AND** continues with other patterns without crashing

---

### Requirement: Priority-Based Output Formatting

The hook SHALL output matched skills grouped by priority (critical, high, medium, low) with formatted sections.

#### Scenario: Multiple priorities matched

- **GIVEN** prompt matches 3 skills: one critical, two high priority
- **WHEN** hook formats output
- **THEN** output shows:
  - "⚠️ CRITICAL SKILLS (REQUIRED):" section with critical-skill
  - "📚 RECOMMENDED SKILLS:" section with high-skill-1 and high-skill-2

#### Scenario: Only one priority matched

- **GIVEN** prompt matches 2 high-priority skills
- **WHEN** hook formats output
- **THEN** output shows only "📚 RECOMMENDED SKILLS:" section
- **AND** does not show empty priority sections

#### Scenario: No matches

- **GIVEN** prompt matches no skills
- **WHEN** hook processes
- **THEN** no output is generated
- **AND** hook exits with code 0

---

### Requirement: Performance Requirements

The hook SHALL execute in under 50ms for typical projects (<10 installed plugins).

#### Scenario: Hook performance benchmark

- **GIVEN** project with 5 installed plugins
- **AND** each plugin has 5 skills in skill-rules.json
- **WHEN** hook executes on prompt submit
- **THEN** total execution time is <50ms
- **AND** prompt submission is not noticeably delayed

---

### Requirement: Configuration Commands

The `/workflow:configure` command SHALL generate `.claude/super-claude-config.json` template with current plugin defaults and intelligent migration handling.

#### Scenario: Generate unified configuration template

- **GIVEN** user has workflow and meta plugins installed
- **AND** user runs `/workflow:configure` slash command
- **AND** `.claude/super-claude-config.json` does not exist
- **WHEN** command executes
- **THEN** file is created with structure organized by plugin name
- **AND** includes current plugin defaults for all skills
- **AND** includes examples for enabling/disabling skills
- **AND** includes examples for modifying triggers

#### Scenario: Update existing configuration with new defaults

- **GIVEN** user runs `/workflow:configure` command
- **AND** `.claude/super-claude-config.json` already exists
- **AND** new plugin defaults are available
- **WHEN** command executes
- **THEN** command prompts user to add new defaults
- **AND** preserves all existing user customizations
- **AND** only adds new plugins or new skills/hooks

#### Scenario: Migrate from legacy skill-rules.json

- **GIVEN** user has `.claude/skills/skill-rules.json`
- **AND** user runs `/workflow:configure` command
- **WHEN** command executes
- **THEN** command prompts for migration
- **AND** creates backup of legacy file
- **AND** converts to new format preserving customizations

---

### Requirement: Schema Validation

All `super-claude-config.json` files SHALL conform to `.claude-plugin/super-claude-config.schema.json` schema with comprehensive validation.

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

#### Scenario: Allow $schema property

- **GIVEN** configuration file includes `$schema` property
- **WHEN** schema validation executes
- **THEN** `$schema` property is recognized as valid string
- **AND** validation passes without errors
- **AND** IDE tooling can use schema for autocomplete

### Requirement: Namespace Conflict Prevention

Skills SHALL be referenced with namespace prefix (e.g., "claude/skill-creator") to prevent conflicts between plugins.

#### Scenario: Different plugins with same skill name

- **GIVEN** claude-tools has skill "api-builder"
- **AND** tanstack-tools also has skill "api-builder"
- **WHEN** both are installed
- **THEN** they are referenced as:
  - "claude/api-builder"
  - "tanstack/api-builder"
- **AND** no conflict occurs

#### Scenario: Override uses namespace

- **GIVEN** project overrides for skill-creator
- **WHEN** override is defined
- **THEN** key MUST be "claude/skill-creator" (with namespace)
- **AND** override without namespace is ignored with warning

---

### Requirement: Auto-Migration from YAML

The system SHALL support migrating existing YAML `triggers` frontmatter to skill-rules.json format.

#### Scenario: YAML triggers present

- **GIVEN** SKILL.md with YAML frontmatter containing triggers section
- **WHEN** plugin is migrated (manual or via command)
- **THEN** skill-rules.json entry is created with:
  - keywords from YAML
  - intentPatterns from YAML patterns

#### Scenario: No YAML triggers

- **GIVEN** SKILL.md without triggers field
- **WHEN** migration is attempted
- **THEN** skill-rules.json entry is created with empty promptTriggers
- **AND** warning suggests adding triggers manually

---

### Requirement: Global Configuration

Project overrides SHALL support global configuration affecting all skills.

#### Scenario: Limit suggestions per prompt

- **GIVEN** project overrides with global.maxSkillsPerPrompt = 2
- **AND** prompt matches 5 skills
- **WHEN** hook formats output
- **THEN** only top 2 skills (by priority) are shown
- **AND** message indicates more skills available

#### Scenario: Priority threshold

- **GIVEN** project overrides with global.priorityThreshold = "high"
- **AND** prompt matches skills with medium and high priorities
- **WHEN** hook filters results
- **THEN** only high-priority skills are shown
- **AND** medium-priority skills are excluded

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
