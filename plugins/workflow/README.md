# Workflow Plugin

**Version:** 0.1.0
**Category:** Workflow automation
**Status:** ✅ Ready for use

## Overview

The workflow plugin provides development workflow enhancements for Claude Code, including:

- **OpenSpec proposal management** - Spec-driven development workflow
- **Skill auto-activation system** - Context-aware skill suggestions
- **Session automation** - Startup hooks for consistent environment

## Features

### Commands

#### OpenSpec Workflow Commands

Manage architectural changes and feature proposals with a structured workflow:

- `/openspec:proposal` - Create new OpenSpec change proposal
- `/openspec:work` - Start working on a proposal with full context
- `/openspec:apply` - Implement an approved proposal
- `/openspec:status` - Check current proposal status and progress
- `/openspec:checkpoint` - Save progress and context to design.md
- `/openspec:done` - Complete and archive a proposal
- `/openspec:archive` - Archive a deployed change and update specs

**Workflow:**

```text
1. /openspec:proposal     → Create proposal (in openspec/changes/)
2. /openspec:work         → Load context and start implementation
3. /openspec:apply        → Execute the changes
4. /openspec:checkpoint   → Save progress (optional, multiple times)
5. /openspec:done         → Mark as complete
6. /openspec:archive      → Archive after deployment
```

#### Skill Configuration Commands

- `/configure-activation` - Generate project-specific skill activation overrides
- `/generate-skill-rules` - Generate skill-rules.json from SKILL.md YAML frontmatter

### Hooks

#### skill-activation-prompt.ts

**Event:** `UserPromptSubmit`
**Execution:** Before Claude processes user input

Automatically suggests relevant skills based on:

- Keyword matching (case-insensitive)
- Intent pattern matching (regex)
- Skill priority levels (critical > high > medium > low)

**Architecture:**

1. Discovers all `skill-rules.json` from installed plugins
2. Merges with project overrides (`.claude/skills/skill-rules.json`)
3. Matches user prompt against triggers
4. Suggests up to 3 relevant skills before Claude responds

**Performance:** < 50ms execution time

#### session-start.ts

**Event:** Session start
**Purpose:** Initialize consistent development environment

Runs automatically when Claude Code session starts.

## Installation

```bash
# Add the super-claude marketplace
/plugin marketplace add jbabin91/super-claude

# Install the workflow plugin
/plugin install workflow
```

## Requirements

- Claude Code CLI
- Bun (for hook execution)
- Git (for OpenSpec workflow)

## OpenSpec Workflow

### Quick Start

1. **Create a proposal:**

   ```bash
   /openspec:proposal
   ```

   Claude will guide you through:
   - Change ID (kebab-case)
   - Title and description
   - Scope and complexity

2. **Work on it:**

   ```bash
   /openspec:work
   ```

   Loads full context from proposal files

3. **Implement:**

   ```bash
   /openspec:apply
   ```

   Execute the planned changes

4. **Complete:**

   ```bash
   /openspec:done
   ```

   Mark as finished and ready to deploy

5. **Archive:**

   ```bash
   /openspec:archive
   ```

   Move to archive after deployment

### Proposal Structure

```text
openspec/changes/{change-id}/
├── proposal.md    # Initial proposal
├── design.md      # Detailed design and decisions
├── tasks.md       # Implementation tasks
└── completion.md  # Completion summary (after /openspec:done)
```

### Status Tracking

Check current status anytime:

```bash
/openspec:status
```

Shows:

- Current proposal being worked on
- Progress percentage
- Completed vs remaining tasks
- Recent checkpoints

## Auto-Activation System

### How It Works

The skill activation hook runs before Claude processes your prompt:

```text
User: "I need to create a skill for testing"
  ↓
Hook analyzes: "create" + "skill" → matches skill-creator
  ↓
Suggests: "💡 Activating: skill-creator"
  ↓
Claude sees suggestion and uses skill-creator
```

### Configuration

**Plugin-level rules** (read-only):

```text
.claude/skills/{namespace}/{plugin}/skills/skill-rules.json
```

**Project-level overrides** (customizable):

```text
.claude/skills/skill-rules.json
```

Generate template:

```bash
/configure-activation
```

### Customization Example

```json
{
  "version": "1.0",
  "overrides": {
    "meta/skill-creator": {
      "priority": "critical",
      "promptTriggers": {
        "keywords": ["create skill", "build skill", "new skill"],
        "intentPatterns": ["(create|add|build).*?skill"]
      }
    }
  },
  "disabled": ["namespace/old-skill"],
  "global": {
    "maxSkillsPerPrompt": 3,
    "priorityThreshold": "high"
  }
}
```

### Matching Strategies

**Keywords:** Case-insensitive literal matching

```text
"create skill" matches: "I want to create skill", "Create Skill for..."
```

**Intent Patterns:** Regex with case-insensitive flag

```text
"(create|add).*?skill" matches: "create a new skill", "add skill for testing"
```

**Priorities:**

- `critical` - Always suggest (security, breaking changes)
- `high` - Suggest for clear matches
- `medium` - Suggest for partial matches
- `low` - Suggest only when explicitly requested

## Troubleshooting

### Hooks Not Running

**Verify Bun is installed:**

```bash
bun --version
```

**Check hook permissions:**

```bash
ls -la .claude/hooks/*.ts
chmod +x .claude/hooks/*.ts
```

**Test hook manually:**

```bash
bun .claude/hooks/skill-activation-prompt.ts
```

### Skills Not Auto-Activating

**Check skill-rules.json exists:**

```bash
cat .claude/skills/workflow/skills/skill-rules.json
```

**Verify plugin is installed:**

```bash
ls -la .claude/skills/workflow/
```

**Test with explicit keywords:**

```text
"configure activation"  # Should match configure-activation skill
```

### OpenSpec Commands Not Working

**Check commands are registered:**

```bash
ls -la .claude/commands/openspec/
```

**Verify Git repository:**

```bash
git status  # OpenSpec requires Git
```

## Performance

- **Activation hook:** < 50ms execution
- **Session start:** < 100ms
- **Rule discovery:** Scales with number of installed plugins

## License

MIT

## Author

Jace Babin - [@jbabin91](https://github.com/jbabin91)

## Contributing

See the main [super-claude repository](https://github.com/jbabin91/super-claude) for contribution guidelines.
