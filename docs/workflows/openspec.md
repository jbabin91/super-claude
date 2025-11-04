# OpenSpec Workflow Guide

This guide explains how to use the enhanced OpenSpec workflow tools in super-claude. These tools add session persistence and context management on top of the standard OpenSpec CLI.

## Overview

The OpenSpec workflow enhancement provides:

- **Session persistence** - Automatically resume work when starting a new session
- **Checkpoint saves** - Capture progress and decisions in design.md
- **Active change tracking** - Know what you're working on at all times
- **Seamless context loading** - No need to manually re-read files

## Architecture

### Files and Directories

```sh
openspec/
├── active.json              # Tracks currently active change (gitignored)
└── changes/
└── <change-id>/
    ├── proposal.md          # The WHY (goals, motivation)
    ├── design.md            # The HOW (living doc with approach)
    ├── tasks.md             # The WHAT (checklist)
    └── specs/               # The DELTA (file changes)
```

```sh
.claude/commands/openspec/
├── work.md                  # Start/resume work on a change
├── status.md                # Check progress
├── checkpoint.md            # Save progress
└── done.md                  # Complete and archive
```

```sh
.claude/hooks/
└── session-start.ts         # Auto-load context on session start
```

### How It Works

1. **Starting work**: `/openspec:work` shows dashboard, loads context, tracks active change
2. **Working**: Make changes, update tasks.md as you go
3. **Checkpointing**: `/openspec:checkpoint` saves progress to design.md
4. **Resuming**: SessionStart hook automatically loads context when you return
5. **Completing**: `/openspec:done` archives change and clears active tracker

## Commands

### /openspec:work

**Purpose**: Start or resume work on an OpenSpec change.

**Usage**:

```txt
/openspec:work
```

**What it does**:

1. Shows `openspec view` dashboard with all changes
2. Asks which change you want to work on
3. Loads proposal.md, design.md, tasks.md
4. Updates openspec/active.json to track this change
5. Enables automatic context loading on session resume

**Example**:

```txt
User: /openspec:work
Assistant: [Shows openspec view dashboard]
          Which change would you like to work on?
User: add-dark-mode
Assistant: ✓ Now working on: add-dark-mode
          [Loads and displays context]
```

### /openspec:status

**Purpose**: Check progress on current change.

**Usage**:

```txt
/openspec:status
```

**What it does**:

1. Shows which change is active
2. Displays task progress (X/Y completed, Z%)
3. Shows time since started and last checkpoint
4. Displays recent context from design.md
5. Runs `openspec view` for full dashboard

**Example**:

```txt
User: /openspec:status
Assistant:
📊 OpenSpec Status

Active Change: add-dark-mode
Started: 2 hours ago
Last Checkpoint: 15 minutes ago

Progress:
├─ Tasks: 8/12 (67%)
├─ Status: In Progress
└─ Next: Implement theme toggle

[Recent context and dashboard shown]
```

### /openspec:checkpoint

**Purpose**: Save current progress and context.

**Usage**:

```txt
/openspec:checkpoint
```

**What it does**:

1. Asks for progress summary (what's done, what's next, blockers)
2. Appends checkpoint section to design.md with timestamp
3. Optionally updates tasks.md to mark completed tasks
4. Updates lastCheckpoint in active.json

**When to use**:

- Before taking a break
- After completing a significant subtask
- Every 30-60 minutes during long sessions
- Before switching to a different change
- When making important decisions

**Example**:

```txt
User: /openspec:checkpoint
Assistant: Let's save a checkpoint. Please provide:
          1. What did you just complete?
          2. What are you working on now?
          3. What's next?
User: Finished theme context setup. Working on toggle component. Next is persistence.
Assistant: ✓ Checkpoint saved to design.md
```

### /openspec:done

**Purpose**: Complete and archive a change.

**Usage**:

```txt
/openspec:done
```

**What it does**:

1. Verifies all tasks in tasks.md are complete
2. Offers final checkpoint save
3. Runs `openspec archive <change-id>`
4. Clears openspec/active.json
5. Guides you to update CHANGELOG.md and commit

**Example**:

```txt
User: /openspec:done
Assistant: [Checks all tasks complete ✓]
          Would you like a final checkpoint? (y/n)
User: y
Assistant: [Saves checkpoint]
          [Runs openspec archive]
          ✓ Change archived!
          [Shows next steps for CHANGELOG and git commit]
```

## SessionStart Hook

The SessionStart hook runs automatically when you start or resume a Claude Code session.

**What it does**:

1. Reads openspec/active.json
2. If there's an active change, loads the context:
   - proposal.md (goals)
   - design.md (approach and decisions)
   - tasks.md (work checklist)
3. Shows formatted summary with progress
4. Displays recent checkpoint notes

**Benefits**:

- No manual re-reading of files
- Instantly resume where you left off
- See progress at a glance
- Recent decisions surfaced automatically

## Workflow Example

### Scenario: Adding Dark Mode Feature

**1. Start work**:

```txt
User: /openspec:work
Assistant: [Shows dashboard]
User: add-dark-mode
Assistant: ✓ Now working on: add-dark-mode
          [Loads proposal, design, tasks]
```

**2. Work on tasks**:

```txt
- [x] Create theme context
- [x] Add theme provider
- [ ] Implement toggle component
- [ ] Add localStorage persistence
```

**3. Save checkpoint** (after completing theme context):

```txt
User: /openspec:checkpoint
Assistant: What did you complete?
User: Created ThemeContext with light/dark modes and added provider to root
Assistant: ✓ Checkpoint saved
```

**4. Take a break** - End session

**5. Resume later** - SessionStart hook auto-loads:

```txt
📋 RESUMING OPENSPEC WORK
Active Change: add-dark-mode
Started: 3 hours ago
Last Checkpoint: 5 minutes ago

Progress: Tasks: 2/4 (50%)

[Full context displayed automatically]
```

**6. Continue work** and save more checkpoints

**7. Complete the work**:

```txt
User: /openspec:done
Assistant: All tasks complete ✓
          [Runs openspec archive]
          [Guides CHANGELOG update and commit]
```

## Best Practices

### Checkpoint Frequency

- **After each subtask**: Save when completing any task in tasks.md
- **Before breaks**: Always checkpoint before ending a session
- **Important decisions**: Capture "why" in checkpoints, not just "what"
- **Every hour**: For long sessions, checkpoint regularly

### design.md as Living Doc

The `design.md` file should grow throughout the project:

- **Initial approach**: Start with high-level design
- **Checkpoint notes**: Add detailed progress and decisions
- **Course corrections**: Document when you change approach
- **Blockers**: Note problems and how you solved them

This creates a timeline of the work that's invaluable for:

- Resuming after days/weeks away
- Understanding why decisions were made
- Writing documentation later
- Debugging issues

### Task Management

- **Start with tasks.md**: Use `/openspec:proposal` to create structured tasks
- **Update as you go**: Mark tasks `[x]` as you complete them
- **Break down large tasks**: If a task is too big, split it in a checkpoint
- **Add discovered work**: Append new tasks if you find more work needed

## Integration with OpenSpec CLI

These enhancements work **alongside** OpenSpec CLI, not replacing it:

### What OpenSpec CLI provides

- `openspec init` - Initialize project with AGENTS.md and project.md
- `openspec validate` - Validate change proposals
- `openspec view` - Dashboard with all changes
- `openspec archive` - Archive completed changes

### What we add

- Active change tracking (openspec/active.json)
- Session resume (SessionStart hook)
- Checkpoint saves (design.md updates)
- Convenience commands (wrap CLI with context loading)

### Combined workflow

1. `openspec init` - Set up project (once)
2. `/openspec:proposal` - Create change (OpenSpec standard)
3. `/openspec:work` - Start work (our enhancement)
4. `/openspec:checkpoint` - Save progress (our enhancement)
5. SessionStart hook - Auto-resume (our enhancement)
6. `/openspec:done` - Wraps `openspec archive` (our enhancement)

## Troubleshooting

### Hook not running

**Symptom**: SessionStart hook doesn't load context on session start

**Solutions**:

- Ensure Bun is installed: `bun --version`
- Check hook is executable: `chmod +x .claude/hooks/session-start.ts`
- Verify active.json exists: `cat openspec/active.json`

### Active change not found

**Symptom**: "Active change not found" error

**Cause**: Change was archived or deleted

**Solution**: Use `/openspec:work` to select a new active change

### Commands not showing up

**Symptom**: `/openspec:work` command not available

**Solution**:

- Restart Claude Code to reload commands
- Verify files exist in `.claude/commands/openspec/`
- Check file names match: `work.md`, `status.md`, `checkpoint.md`, `done.md`

## Advanced Usage

### Multiple concurrent changes

You can work on multiple changes, but only one is "active":

- Use `/openspec:work` to switch between changes
- The active change gets auto-loaded on session resume
- All changes still visible in `openspec view` dashboard

### Sharing context with team

The enhanced workflow is local-only by default:

- `openspec/active.json` - Add to `.gitignore` (personal state)
- `design.md` - Commit this! It's valuable project documentation

**Recommended .gitignore**:

```txt
openspec/active.json
```

This way team members can:

- See design.md with approach and decisions
- Track their own active change locally
- Resume their own work without conflicts

## Comparison to Reddit Post

This workflow implements diet103's approach from the Reddit post:

| Reddit Concept   | Our Implementation                     |
| ---------------- | -------------------------------------- |
| plan.md          | proposal.md (OpenSpec standard)        |
| context.md       | design.md (living doc with checkpoints |
| tasks.md         | tasks.md (OpenSpec standard)           |
| /dev-docs        | /openspec:work (load context)          |
| /update-dev-docs | /openspec:checkpoint (save progress)   |
| Resume feature   | SessionStart hook (auto-load)          |
| Global ~/dev/    | Project-local openspec/                |

**Key differences**:

- ✅ Uses OpenSpec's existing structure (no reinventing)
- ✅ Leverages OpenSpec CLI tools (validate, view, archive)
- ✅ Project-local (not global) for better isolation
- ✅ Integrates with existing workflows

## Next Steps

1. Try the workflow on a real change:
   - Create a proposal: `/openspec:proposal`
   - Start work: `/openspec:work`
   - Make changes and checkpoint frequently
   - Complete: `/openspec:done`

2. Customize for your needs:
   - Adjust checkpoint frequency
   - Add more detail to design.md
   - Create project-specific templates

3. Share with team:
   - Commit design.md for shared context
   - Document decisions in checkpoints
   - Keep active.json local (.gitignore)

---

**Remember**: The goal is to never lose context between sessions. Checkpoint often!
