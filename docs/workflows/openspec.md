# OpenSpec Workflow

This project uses the [workflow plugin](../../plugins/workflow/) for enhanced OpenSpec proposal management with session persistence and context loading.

## Quick Reference

### Setup (Once Per Project)

```bash
/openspec:init     # Initialize OpenSpec directory structure
/openspec:update   # Update instruction files to latest version
```

### Daily Workflow

```bash
/openspec:proposal    # Create new change proposal
/openspec:work        # Start working on a proposal (loads context)
/openspec:apply       # Implement an approved proposal
/openspec:checkpoint  # Save progress to design.md
/openspec:status      # Check current progress
/openspec:done        # Complete and archive a proposal
/openspec:archive     # Archive after deployment
```

## How It Works

The workflow plugin provides:

- **Session persistence** - Tracks active change in `openspec/active.json` (gitignored)
- **Auto-resume** - SessionStart hook loads context automatically
- **Checkpoint saves** - Capture progress and decisions in `design.md`
- **Context loading** - Seamlessly load proposal, design, and tasks

## Typical Flow

1. **Create proposal**: `/openspec:proposal` → Creates proposal in `openspec/changes/`
2. **Start work**: `/openspec:work` → Loads context, tracks active change
3. **Implement**: Make changes, update `tasks.md` as you go
4. **Save progress**: `/openspec:checkpoint` → Saves to `design.md` (optional, multiple times)
5. **Complete**: `/openspec:done` → Marks complete
6. **Archive**: `/openspec:archive` → Archives after deployment

## Session Persistence

When you run `/openspec:work`, the plugin creates `openspec/active.json`:

```json
{
  "change": "your-change-id",
  "started": "2025-11-12T...",
  "lastCheckpoint": "2025-11-12T..."
}
```

**Next session:** The SessionStart hook automatically loads this context - no manual re-reading needed!

## Documentation

For complete documentation, see:

- **[Workflow Plugin README](../../plugins/workflow/README.md)** - Overview and feature list
- **[Command Documentation](../../plugins/workflow/commands/openspec/)** - Detailed command usage
- **[OpenSpec AGENTS.md](../../openspec/AGENTS.md)** - Complete OpenSpec workflow guide

## Related Documentation

- [Project Workflow](project.md) - Versioning, changelog, archiving
- [GitHub Flow](git/github-flow.md) - Branching and PRs
- [Development Guide](development.md) - Setup and common commands
