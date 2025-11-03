---
name: generate-skill-rules
description: Generate skill-rules.json entries from SKILL.md YAML frontmatter (for maintainers)
version: 1.0.0
---

# Generate Skill Rules

This command parses YAML frontmatter from SKILL.md files and generates `skill-rules.json` entries for the auto-activation system.

## Usage

```sh
/generate-skill-rules [options]
```

## What It Does

1. Scans for SKILL.md files in the specified directory
2. Parses YAML frontmatter to extract trigger information
3. Converts to skill-rules.json format
4. Outputs generated JSON to stdout or writes to file

## Options

- **--plugin** - Plugin directory to scan (default: current directory)
- **--namespace** - Plugin namespace (required if --write)
- **--write** - Write directly to skill-rules.json
- **--dry-run** - Output to stdout without writing (default)

## Examples

### Preview Generated Rules

```sh
/generate-skill-rules --plugin plugins/tanstack-tools --namespace tanstack
```

### Write to skill-rules.json

```sh
/generate-skill-rules --plugin plugins/api-tools --namespace api --write
```

## Instructions for Claude

When this command is invoked:

1. **Locate SKILL.md Files**

   ```sh
   find {plugin-dir}/skills -name "SKILL.md" -type f
   ```

2. **Parse Each SKILL.md**
   - Read YAML frontmatter (between `---` delimiters)
   - Extract these fields:
     - `name` → skill ID
     - `description` → skill description
     - `category` → determines skill type
     - `triggers.keywords` → promptTriggers.keywords
     - `triggers.patterns` → promptTriggers.intentPatterns
     - `priority` (if present) → priority field

3. **Map Fields to skill-rules.json Schema**

   ```json
   {
     "plugin": {
       "name": "{extracted-from-plugin-json}",
       "version": "{extracted-from-plugin-json}",
       "namespace": "{from-cli-arg-or-plugin-json}"
     },
     "skills": {
       "{skill-name}": {
         "type": "domain",
         "enforcement": "suggest",
         "priority": "{from-yaml-or-default-high}",
         "description": "{from-yaml}",
         "promptTriggers": {
           "keywords": ["{from-yaml-triggers-keywords}"],
           "intentPatterns": ["{from-yaml-triggers-patterns}"]
         }
       }
     }
   }
   ```

4. **Handle Edge Cases**
   - Skills without triggers → create empty arrays
   - Skills without priority → default to "high"
   - Skills with category "guardrail" → type: "guardrail"
   - All other categories → type: "domain"

5. **Validation**
   - Check namespace is valid (lowercase, no spaces)
   - Ensure skill names are kebab-case
   - Validate regex patterns are valid
   - Warn about missing required fields

6. **Output Format**
   - **Dry run**: Print formatted JSON to stdout with guidance
   - **Write mode**: Create/update `{plugin-dir}/skills/skill-rules.json`
   - Include success message with file location

## Example YAML → JSON Conversion

**SKILL.md frontmatter:**

```yaml
---
name: skill-creator
description: Generate new Claude Code skills
category: workflow-automation
priority: high
triggers:
  keywords:
    - create skill
    - new skill
    - skill template
  patterns:
    - (create|add|generate).*?skill
    - how to.*?create.*?skill
---
```

**Generated skill-rules.json entry:**

```json
{
  "skill-creator": {
    "type": "domain",
    "enforcement": "suggest",
    "priority": "high",
    "description": "Generate new Claude Code skills",
    "promptTriggers": {
      "keywords": ["create skill", "new skill", "skill template"],
      "intentPatterns": [
        "(create|add|generate).*?skill",
        "how to.*?create.*?skill"
      ]
    }
  }
}
```

## Success Criteria

- Successfully parses all SKILL.md files
- Generates valid JSON matching schema
- Handles skills without triggers gracefully
- Provides clear output and error messages
- Works for both dry-run and write modes

## Notes

- This is a maintainer tool for initial migration
- After migration, maintain skill-rules.json directly
- YAML triggers in SKILL.md can be removed after migration
- Always validate generated JSON with `/configure-activation`
