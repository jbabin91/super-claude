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
# === OFFICIAL CLAUDE CODE FIELDS ===
name: skill-identifier                    # Required: kebab-case
description: |                            # Required: What it does and when to use
  Clear description of what it does and when to use it.
  Include activation triggers in the description.
allowed-tools: []                         # Optional: Restrict to specific tools

# === COMMUNITY ENHANCEMENTS (super-claude) ===
version: 1.0.0                           # Track changes
category: appropriate-category           # Organization (typescript, testing, git, etc.)
tags: [relevant, tags, here]             # Searchability
model: sonnet                            # Preferred model: sonnet | haiku | opus
triggers:                                # Explicit activation hints
  keywords: [keyword1, keyword2]         # Words that activate this skill
  patterns: ["pattern1", "pattern2"]     # Regex patterns
  contexts: [development, testing]       # When to activate
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
  skills: [typescript-tools/tsc-validation]
  packages: ['@types/node']
```

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
