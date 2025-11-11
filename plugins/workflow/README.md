# Workflow Plugin

**Version:** 0.4.0
**Category:** Workflow automation
**Status:** ✅ Ready for use

## Overview

The workflow plugin provides development workflow enhancements for Claude Code, including:

- **OpenSpec proposal management** - Spec-driven development workflow
- **Skill auto-activation system** - Context-aware skill suggestions
- **Session automation** - Startup hooks for consistent environment

## Features

### Commands

#### OpenSpec Commands

All OpenSpec commands use the `/openspec:*` namespace for consistency.

**Note:** These are **enhanced versions** of OpenSpec commands, maintained by this plugin for customization and workflow optimization. They follow OpenSpec patterns but include additional context and features tailored for Claude Code.

**Setup (run once per project):**

- `/openspec:init` - Initialize OpenSpec directory structure
- `/openspec:update` - Update instruction files to latest version

**Workflow (daily development):**

- `/openspec:proposal` - Create new change proposal
- `/openspec:work` - Start working on a proposal with full context
- `/openspec:apply` - Implement an approved proposal
- `/openspec:checkpoint` - Save progress and context to design.md
- `/openspec:status` - Check current proposal status and progress
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

The workflow plugin provides production-ready command hooks demonstrating best practices from ADR-0008 and ADR-0010.

#### session-checklist

**Event:** `SessionStart`
**Purpose:** Display project status at session start

Automatically displays when session starts:

- Git status (branch, staged, modified files)
- Recent commits (last 3)
- Active OpenSpec changes
- Quick command reference

**Performance:** < 100ms

**Implementation:** [`hooks/session-checklist.ts`](./hooks/session-checklist.ts)

#### type-checker

**Event:** `PreToolUse` (Edit/Write)
**Purpose:** Validate TypeScript types before file modifications

Automatically runs before Edit/Write operations:

- Incremental type checking with `@jbabin91/tsc-files`
- Blocks file modifications on type errors (exit code 2)
- Shows actionable error messages
- Configurable per-project via settings

**Performance:** < 2s (incremental checking)

**Implementation:** [`hooks/type-checker.ts`](./hooks/type-checker.ts)

**Configuration:**

```json
// .claude/settings.json
{
  "customHooks": {
    "typeChecker": { "enabled": true }
  }
}

// .claude/settings.local.json (personal override)
{
  "customHooks": {
    "typeChecker": { "enabled": false }
  }
}
```

#### git-commit-guard

**Event:** `PreToolUse` (Bash)
**Purpose:** Prevent auto-committing without explicit user request

Analyzes conversation context:

- Detects git commit commands
- Checks for explicit commit intent in recent messages
- Blocks commits without user request (exit code 2)
- Configurable per-project/developer

**Performance:** < 50ms

**Implementation:** [`hooks/git-commit-guard.ts`](./hooks/git-commit-guard.ts)

**Explicit intent examples:**

- "commit these changes"
- "create a commit with this"
- "let's commit"

#### skill-activation-prompt

**Event:** `UserPromptSubmit`
**Purpose:** Auto-suggest relevant skills

Automatically suggests skills based on:

- Keyword matching (case-insensitive)
- Intent pattern matching (regex)
- Skill priority levels (critical > high > medium > low)

**Performance:** < 50ms

**Implementation:** [`hooks/skill-activation-prompt.ts`](./hooks/skill-activation-prompt.ts)

### Hook Testing

**Test session-checklist:**

```bash
printf '{"cwd":"%s"}' "$(pwd)" | bun plugins/workflow/hooks/session-checklist.ts
```

**Test type-checker:**

```bash
echo '{"cwd":"'$(pwd)'","tool_name":"Edit","tool_input":{"file_path":"your-file.ts"}}' \
  | bun plugins/workflow/hooks/type-checker.ts
```

**Test git-commit-guard:**

```bash
# Create test transcript without commit intent
cat > /tmp/test-transcript.json <<'EOF'
{"messages":[{"role":"user","content":"Help me implement a feature"}]}
EOF

echo '{"cwd":"'$(pwd)'","tool_name":"Bash","tool_input":{"command":"git commit -m test"},"transcript_path":"/tmp/test-transcript.json"}' \
  | bun plugins/workflow/hooks/git-commit-guard.ts
# Should block with exit code 2
```

### Hook Documentation

Comprehensive guides available:

- **[Command Hooks Guide](../../docs/guides/command-hooks.md)** - Complete implementation reference
- **[Hook Lifecycle](../../docs/guides/hooks/lifecycle.md)** - Execution flow and timing
- **[Anti-Patterns](../../docs/guides/hooks/anti-patterns.md)** - What to avoid (with evidence)
- **[Performance Guide](../../docs/guides/hooks/performance-guide.md)** - Optimization strategies
- **[Placement Guide](../../docs/guides/hooks/placement-guide.md)** - Choosing the right hook

## Installation

```bash
# Add the super-claude marketplace
/plugin marketplace add jbabin91/super-claude

# Install the workflow plugin
/plugin install workflow
```

## Requirements

- Claude Code CLI
- OpenSpec CLI (`npm install -g @jsdocs-io/openspec`)
- Bun (for hook execution)
- Git (for OpenSpec workflow)

## Configuration

### Unified Configuration System

The workflow plugin supports project-level configuration overrides via `.claude/super-claude-config.json`:

```json
{
  "$schema": "../.claude-plugin/super-claude-config.schema.json",
  "workflow": {
    "hooks": {
      "gitCommitGuard": {
        "enabled": true,
        "protectedBranches": ["main", "production"],
        "bypassEnvVar": "SKIP_COMMIT_GUARD"
      },
      "branchNameValidator": {
        "enabled": true,
        "allowedPrefixes": [
          "feat",
          "fix",
          "docs",
          "style",
          "refactor",
          "test",
          "chore",
          "build",
          "ci",
          "perf",
          "hotfix"
        ],
        "allowedBranches": ["main", "develop"]
      },
      "typeChecker": {
        "enabled": true,
        "timeout": 2000
      }
    }
  }
}
```

**Generate configuration template:**

```bash
/configure-activation
```

This command creates a template with current plugin defaults. You can then customize:

- Hook behavior (enable/disable hooks)
- Protected branches for commit guard
- Branch name validation rules
- Type checker timeout

**Configuration priority:** Environment variables > Project overrides (`.claude/super-claude-config.json`) > Plugin defaults

**Environment variable overrides:**

```bash
# Disable type checker for this session
export CLAUDE_HOOK_TYPE_CHECKER_ENABLED=false

# Bypass commit guard
export SKIP_COMMIT_GUARD=true
```

**See also:** [Plugin Configuration Guide](../../docs/guides/plugin-configuration.md) for complete documentation.

## OpenSpec Workflow

### Quick Start

**First time setup:**

1. **Initialize OpenSpec:**

   ```bash
   /openspec:init
   ```

   This creates the `openspec/` directory structure with AGENTS.md, project.md, changes/, and specs/.

2. **Fill out project context:**

   Ask Claude: "Please read openspec/project.md and help me fill it out with details about my project"

**Working with proposals:**

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

**Check OpenSpec is initialized:**

```bash
ls -la openspec/  # Should see AGENTS.md, project.md, changes/, specs/
```

**Verify OpenSpec CLI is installed:**

```bash
openspec --version
```

**Verify Git repository:**

```bash
git status  # OpenSpec requires Git
```

**Note:** Commands come from the workflow plugin, not `.claude/commands/`. If commands don't show up, ensure the workflow plugin is installed: `/plugin list`

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
