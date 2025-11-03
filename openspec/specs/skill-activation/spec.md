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

The hook SHALL discover and load all `skill-rules.json` files from installed plugins in `.claude/skills/*/skill-rules.json`.

#### Scenario: Multiple plugins installed

- **GIVEN** user project has claude-tools and tanstack plugins installed
- **AND** each plugin has its own skill-rules.json
- **WHEN** hook executes
- **THEN** both `skill-rules.json` files are discovered and loaded
- **AND** rules from both plugins are available for matching

#### Scenario: Plugin without skill-rules.json

- **GIVEN** user project has a plugin without skill-rules.json
- **WHEN** hook executes
- **THEN** plugin is skipped without error
- **AND** other plugins with rules are still processed

#### Scenario: Malformed skill-rules.json

- **GIVEN** plugin with invalid JSON in skill-rules.json
- **WHEN** hook attempts to load the file
- **THEN** hook logs warning: "⚠️ Invalid skill-rules.json in [plugin-name]"
- **AND** continues processing other plugins without crashing

---

### Requirement: Project Override Support

The hook SHALL support project-level overrides in `.claude/skills/skill-rules.json` with higher precedence than plugin rules.

#### Scenario: Override skill priority

- **GIVEN** claude-tools defines skill-creator with priority "high"
- **AND** project overrides define "claude/skill-creator" with priority "critical"
- **WHEN** hook merges rules
- **THEN** skill-creator has priority "critical"
- **AND** appears first in suggestions

#### Scenario: Disable specific skill

- **GIVEN** plugin defines skill-creator
- **AND** project overrides include "claude/skill-creator" in disabled array
- **WHEN** hook processes rules
- **THEN** skill-creator is excluded from matching
- **AND** does not appear in suggestions even if prompt matches

#### Scenario: Add custom keywords

- **GIVEN** plugin defines skill-creator with keywords ["create skill"]
- **AND** project overrides add keywords ["scaffold skill"]
- **WHEN** hook merges rules
- **THEN** skill-creator matches both "create skill" AND "scaffold skill"

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

The `/configure-activation` command SHALL generate `.claude/skills/skill-rules.json` template with commented examples.

#### Scenario: Generate project overrides

- **GIVEN** user runs /configure-activation command
- **AND** .claude/skills/skill-rules.json does not exist
- **WHEN** command executes
- **THEN** file is created with template structure
- **AND** includes commented examples for overrides
- **AND** includes commented examples for disabled array
- **AND** includes commented global configuration options

#### Scenario: File already exists

- **GIVEN** user runs /configure-activation command
- **AND** .claude/skills/skill-rules.json already exists
- **WHEN** command executes
- **THEN** command prompts: "File exists. Overwrite? (y/n)"
- **AND** only overwrites if user confirms

---

### Requirement: Schema Validation

All skill-rules.json files SHALL conform to defined TypeScript interfaces with required fields.

#### Scenario: Valid plugin rules

- **GIVEN** plugin skill-rules.json with required fields (plugin, skills)
- **WHEN** hook loads the file
- **THEN** file parses successfully
- **AND** all skills are available for matching

#### Scenario: Missing required field

- **GIVEN** plugin skill-rules.json without "plugin.namespace" field
- **WHEN** hook loads the file
- **THEN** hook logs warning: "⚠️ Invalid schema in [plugin-name]: missing namespace"
- **AND** skips that plugin
- **AND** continues processing other plugins

---

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

