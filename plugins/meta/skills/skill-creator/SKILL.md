---
name: skill-creator
version: 1.0.0
description: |
  Create new Claude Code skills with proper structure, validation, and best practices.
  Generates skills that follow Anthropic specifications and community patterns.
  Use when you need custom skills for specific workflows, either globally or per-project.
category: meta
tags: [skill-generation, meta, automation, claude-code]
model: sonnet
triggers:
  keywords: [create skill, generate skill, new skill, custom skill, skill for]
  patterns: ['create.*skill', 'generate.*skill', 'make.*skill']
  contexts: [development, skill-creation]
---

# Skill Creator

A meta-skill for generating new Claude Code skills with proper structure and validation.

## When to Use

- Creating project-specific skills (e.g., "Odyssey design system components")
- Building work-related skills (e.g., "SD API client generation")
- Generating custom workflow automations
- Standardizing team practices into reusable skills
- Converting manual processes into automated skills

## Core Workflow

### 1. Gather Requirements

Ask the user:

- **Purpose**: What problem does this skill solve?
- **Triggers**: What keywords/phrases should activate it?
- **Context**: When should it be used (file types, project types)?
- **Location**: Where to save (global or project-local)?
- **Dependencies**: Required tools, packages, or other skills?

### 2. Generate Skill Structure

**Template Reference:** See `templates/skill_template.md` for the complete skill template with all available fields and examples.

Create a properly formatted SKILL.md with:

```yaml
---
# OFFICIAL CLAUDE CODE FIELDS (recognized by Claude Code)
name: skill-identifier                    # Required: kebab-case
description: |                            # Required: What it does AND when to activate
  Clear description of what it does and when to use it.
  IMPORTANT: Include activation triggers in the description itself.
  Example: "Generate React components. Use when creating new UI components."
allowed-tools: []                         # Optional: Restrict to specific tools

# EXTENDED METADATA (ignored by Claude Code, useful for organization)
version: 1.0.0                           # Track changes (skills are files, not packages)
---

# Skill Name

Brief overview (1-2 sentences).

## When to Use

- Concrete trigger 1
- Concrete trigger 2
- Specific scenario 3

## Core Workflow

### 1. First Step
Description and instructions

### 2. Second Step
Description and instructions

## Best Practices

- Practice 1
- Practice 2

## Example Workflows

### Scenario 1: Common Use Case
Step-by-step example

### Scenario 2: Edge Case
How to handle edge cases

## Integration Points

- Works with: [other skills]
- Calls: [agents/tools]
- Required by: [dependent skills]

## Troubleshooting

### Issue 1
Symptom: [description]
Solution: [fix]

### Issue 2
Symptom: [description]
Solution: [fix]

## References

- [External documentation links]
```

### 3. Validate Against Specifications

Ensure the skill follows:

**Anthropic Best Practices:**

- ✅ Clear, actionable instructions
- ✅ Specific triggers (not generic)
- ✅ Real examples (not placeholders)
- ✅ Token-efficient (< 500 lines for core content)
- ✅ Progressive disclosure (link to API_REFERENCE.md if needed)

**RED-GREEN-REFACTOR Ready:**

- ✅ Can be tested without the skill (RED phase)
- ✅ Verifiable compliance (GREEN phase)
- ✅ Hardened against rationalizations (REFACTOR phase)

**Community Patterns:**

- ✅ No TODOs or placeholders in production
- ✅ No "YOUR_KEY_HERE" style configs
- ✅ Specific, not generic labels
- ✅ Context-aware activation

### 4. Save to Appropriate Location

**Global Skills** (general use across all projects):

```txt
~/.claude/skills/super-claude/plugins/[category]/skills/skill-name.md
```

**Project-Local Skills** (specific to one project):

```txt
/path/to/project/.claude/skills/skill-name.md
```

**Note**: Project-local skills are perfect for work-specific or proprietary patterns that shouldn't be shared globally.

### 5. Test the Skill

Provide testing guidance:

- RED: Try the workflow WITHOUT the skill, note failures
- GREEN: Enable the skill, verify it works
- REFACTOR: Identify edge cases, harden the skill

## Skill Types

### Standard Skill (Most Common)

General-purpose automation or guidance for specific tasks.

### Component Generator

Creates code/files following specific patterns.

### Workflow Orchestrator

Coordinates multiple steps or tools.

### Validation/Checker

Ensures code/config meets standards.

### Migration Helper

Assists in moving between technologies.

## Advanced Features

### Progressive Disclosure

If skill exceeds 500 lines, split into:

- **SKILL.md**: Core instructions (< 500 lines)
- **API_REFERENCE.md**: Advanced topics (loaded on-demand)

Link from SKILL.md:

```markdown
For advanced usage, see [API_REFERENCE.md](./API_REFERENCE.md)
```

### Context-Aware Activation

Make skills activate automatically:

```yaml
triggers:
  keywords: [specific, technical, terms]
  patterns: ['regex.*patterns']
  contexts: [file-types, project-types]
```

### Dependencies

Declare requirements:

```yaml
requires:
  tools: [git, npm, docker]
  skills: [typescript/tsc-validation]
  packages: ['@types/node']
```

## Auto-Activation System

### Overview

Skills can auto-activate based on user prompts using the skill-rules.json system. This enables Claude to proactively suggest relevant skills before responding.

**For complete details, see:** [SKILL_ACTIVATION_GUIDE.md](../../docs/SKILL_ACTIVATION_GUIDE.md)

### When to Add Activation Rules

Add skill-rules.json entries when:

- Skill is part of a plugin (not project-local)
- Skill should auto-activate from specific keywords
- Skill addresses a common workflow pattern
- Skill is high-value and frequently needed

**Skip activation rules for:**

- One-off project-specific skills
- Rarely-used experimental skills
- Skills that should only run on explicit user request

### Creating skill-rules.json Entries

**For plugin developers:** Add entries to `plugins/{plugin}/skills/skill-rules.json`

**Schema:**

```json
{
  "plugin": {
    "name": "plugin-name",
    "version": "1.0.0",
    "namespace": "namespace"
  },
  "skills": {
    "skill-name": {
      "type": "domain",
      "enforcement": "suggest",
      "priority": "high",
      "description": "Brief description of what the skill does",
      "promptTriggers": {
        "keywords": ["keyword1", "keyword2"],
        "intentPatterns": ["pattern1", "pattern2"]
      }
    }
  }
}
```

### Writing Good Keywords

**✅ Good Keywords** (specific, unambiguous):

```json
"keywords": [
  "create skill",
  "new skill",
  "skill template",
  "generate skill",
  "skill development"
]
```

**❌ Bad Keywords** (too generic):

```json
"keywords": [
  "create",
  "new",
  "help",
  "build"
]
```

**Rules for keywords:**

- Minimum 2 words for specificity
- Include the domain (e.g., "skill", "hook", "component")
- Match how users naturally ask for help
- Case-insensitive literal matching
- No regex needed for keywords

### Writing Good Intent Patterns

**✅ Good Patterns** (capture intent, not exact wording):

```json
"intentPatterns": [
  "(create|add|generate|build).*?skill",
  "how to.*?(create|add|build).*?skill",
  "skill.*?(template|generator|builder)",
  "need.*?skill.*?(for|to)",
  "(make|write).*?skill"
]
```

**❌ Bad Patterns** (too broad or too narrow):

```json
"intentPatterns": [
  ".*skill.*",
  "^create exactly this specific phrase$"
]
```

**Rules for patterns:**

- Use regex with case-insensitive flag (`i`)
- Include action verbs: create, add, generate, build, make
- Include domain terms: skill, hook, component, etc.
- Use `.*?` for flexible matching between keywords
- Capture natural variations of the same intent

### Priority Guidelines

**critical** - Must run for safety/correctness:

```json
"priority": "critical"
// Examples: security validators, syntax checkers
```

**high** - Highly recommended:

```json
"priority": "high"
// Examples: skill-creator, component-generator
```

**medium** - Useful but optional:

```json
"priority": "medium"
// Examples: documentation generators, formatters
```

**low** - Nice-to-have:

```json
"priority": "low"
// Examples: experimental features, rarely-used tools
```

### Example: skill-creator Activation Rules

```json
{
  "plugin": {
    "name": "meta",
    "version": "1.0.0",
    "namespace": "claude"
  },
  "skills": {
    "skill-creator": {
      "type": "domain",
      "enforcement": "suggest",
      "priority": "high",
      "description": "Generate new Claude Code skills with proper structure and validation",
      "promptTriggers": {
        "keywords": [
          "create skill",
          "new skill",
          "skill development",
          "generate skill",
          "skill template"
        ],
        "intentPatterns": [
          "(create|add|generate|build).*?skill",
          "how to.*?(create|add|build).*?skill",
          "skill.*?(template|generator|builder)",
          "need.*?skill.*?(for|to)",
          "(make|write).*?skill"
        ]
      }
    }
  }
}
```

### Migration Tool

Use `/generate-skill-rules` to auto-generate entries from existing SKILL.md YAML frontmatter:

```sh
# Preview generated rules
/generate-skill-rules --plugin plugins/tanstack-tools --namespace tanstack

# Write to skill-rules.json
/generate-skill-rules --plugin plugins/api-tools --namespace api --write
```

### Testing Activation Rules

**Test in isolated project:**

```sh
# 1. Create test project
mkdir test-activation && cd test-activation

# 2. Copy hook and rules
mkdir -p .claude/hooks .claude/skills/your-plugin
cp {hook-path}/skill-activation-prompt.ts .claude/hooks/
cp {plugin-path}/skill-rules.json .claude/skills/your-plugin/

# 3. Test with prompts
echo '{"prompt":"create a new skill","cwd":"'$(pwd)'"}' | \
  bun run .claude/hooks/skill-activation-prompt.ts
```

**Expected output:**

```txt
============================================================
SKILL ACTIVATION CHECK
============================================================

[RECOMMENDED] SKILLS:
  -> skill-creator

ACTION: Use Skill tool BEFORE responding
============================================================
```

### Workflow: Adding Auto-Activation to New Skills

When creating a skill that should auto-activate:

1. **Create the SKILL.md** (as normal)

2. **Identify triggers** by asking:
   - What keywords would users type to need this skill?
   - What questions or requests indicate this intent?
   - How do users naturally express this need?

3. **Add to skill-rules.json**:

   ```json
   {
     "skills": {
       "new-skill": {
         "type": "domain",
         "enforcement": "suggest",
         "priority": "high",
         "description": "What the skill does",
         "promptTriggers": {
           "keywords": ["keyword1", "keyword2"],
           "intentPatterns": ["pattern1", "pattern2"]
         }
       }
     }
   }
   ```

4. **Test the triggers**:
   - Try prompts that SHOULD activate it
   - Try prompts that should NOT activate it
   - Refine keywords/patterns based on results

5. **Document in SKILL.md**:

   ```markdown
   ## Auto-Activation

   This skill auto-activates when you mention:

   - Creating/generating {domain objects}
   - Specific workflow requests
   - Related keywords

   Triggered by: create skill, new skill, generate skill
   ```

### Project-Level Overrides

Users can customize activation in their projects via `.claude/skills/skill-rules.json`:

```json
{
  "version": "1.0",
  "overrides": {
    "claude/skill-creator": {
      "priority": "critical"
    }
  },
  "disabled": ["claude/skill-validator"],
  "global": {
    "maxSkillsPerPrompt": 3,
    "priorityThreshold": "medium"
  }
}
```

**Command for users:** `/configure-activation`

## Example: Creating a Project-Specific Skill

**User Request:**
"Create a skill for generating Odyssey design system components"

**Generated Skill:**

Location: `/path/to/odyssey-project/.claude/skills/odyssey-components.md`

```yaml
---
name: odyssey-components
version: 1.0.0
description: |
  Generate components following Odyssey design system guidelines.
  Ensures consistency with design tokens, patterns, and accessibility standards.
category: design-system
tags: [odyssey, components, design-system, react]
model: sonnet
requires:
  tools: [npm]
  packages: ["@odyssey/design-tokens", "@odyssey/components"]
triggers:
  keywords: [odyssey, odyssey component, design system]
  patterns: ["create.*odyssey", "generate.*odyssey"]
---

# Odyssey Components

Generate React components that follow Odyssey design system standards.

## When to Use

- Creating new Odyssey components
- Ensuring design system compliance
- Maintaining consistency across products

## Component Structure

All components follow this pattern:

\`\`\`
components/
  └── ComponentName/
      ├── ComponentName.tsx
      ├── ComponentName.stories.tsx
      ├── ComponentName.test.tsx
      └── index.ts
\`\`\`

## Design Token Usage

Always use design tokens from `@odyssey/design-tokens`:

\`\`\`typescript
import { tokens } from '@odyssey/design-tokens'

const styles = {
  color: tokens.color.primary.base,
  spacing: tokens.spacing.md,
  borderRadius: tokens.borderRadius.md
}
\`\`\`

## Accessibility Requirements

All components must:
- Meet WCAG AAA standards
- Include proper ARIA labels
- Support keyboard navigation
- Provide focus indicators

## Example: Button Component

[Detailed example following Odyssey patterns]
```

## Common Skill Patterns

### API Client Generator

```yaml
name: project-api-client
purpose: Generate type-safe API clients from OpenAPI schemas
includes: OpenAPI schema parsing, type generation, RPC helpers
location: project-local (for proprietary APIs)
```

### Component Library Helper

```yaml
name: design-system-components
purpose: Generate components following project design system
includes: Component patterns, theme support, testing
location: project-local (for proprietary design systems)
```

### Database Schema Generator

```yaml
name: drizzle-schema-from-db
purpose: Generate Drizzle schemas from existing Postgres database
includes: Type inference, relationship mapping, migration helpers
location: global (reusable across projects)
```

### Deployment Automation

```yaml
name: coolify-deployment
purpose: Automate deployment to Coolify platform
includes: Docker config, environment setup, rollback procedures
location: global (reusable deployment pattern)
```

## Best Practices

1. **Be Specific**: Don't create "helper" or "utility" skills - be explicit about what they do
2. **Include Examples**: Real, working examples - not placeholders
3. **Test First**: RED-GREEN-REFACTOR methodology ensures quality
4. **Token Efficiency**: Keep core content under 500 lines
5. **Clear Triggers**: Specific keywords that clearly indicate when to activate
6. **Validate**: Always check against Claude Code and Anthropic specs

## Anti-Patterns to Avoid

- ❌ Generic names ("helper", "utils", "tool")
- ❌ TODOs or placeholders in production
- ❌ Narrative examples tied to specific sessions
- ❌ Code embedded in flowcharts
- ❌ Missing activation triggers
- ❌ Over 500 lines without progressive disclosure
- ❌ Untested skills

## Integration with Other Tools

### shadcn CLI Integration

```bash
# Generate skill that wraps shadcn commands
pnpm dlx shadcn@latest add [component]
pnpm dlx shadcn@latest add @coss/[component]
```

### Registry Support

Skills can integrate with component registries:

- shadcn/ui registry
- coss.com/ui registry
- Custom private registries

## Troubleshooting

### Skill Not Activating

**Symptom**: Skill exists but doesn't trigger
**Solution**:

- Check triggers section in YAML frontmatter
- Ensure keywords are specific enough
- Verify file is in correct location
- Check Claude Code loaded the skill (restart if needed)

### Skill Too Generic

**Symptom**: Skill triggers too often or in wrong contexts
**Solution**:

- Make keywords more specific
- Add context restrictions
- Use regex patterns to narrow activation

### Skill Too Large

**Symptom**: Skill exceeds 500 lines
**Solution**:

- Implement progressive disclosure
- Move advanced content to API_REFERENCE.md
- Keep core workflow in SKILL.md

## References

- [Claude Code Skills Documentation](https://docs.claude.com/en/docs/claude-code/skills)
- [Anthropic Best Practices](https://docs.claude.com/en/docs/claude-code)
- [obra/superpowers](https://github.com/obra/superpowers) - Community patterns
- [super-claude CREATING_SKILLS.md](../../docs/CREATING_SKILLS.md) - RED-GREEN-REFACTOR guide
