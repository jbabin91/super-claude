---
name: OpenSpec: Done
description: Complete and archive an OpenSpec change.
category: OpenSpec
tags: [openspec, done, archive, complete]
---

<!-- OPENSPEC:START -->

**Purpose**

This command finalizes your work on an OpenSpec change:

- Verifies all tasks are complete
- Archives the change proposal
- Updates CHANGELOG.md
- Clears the active change tracker
- Guides you to commit the changes

**Steps**

1. **Check for active change**
   - Read `openspec/active.json`
   - If no active change: "No active change. Use /openspec:work to start working on a change first."
   - Exit if no active change

2. **Verify all tasks complete**
   - Read `openspec/changes/<change-id>/tasks.md`
   - Count incomplete tasks (lines with `- [ ]`)
   - If any incomplete:

     ```txt
     ⚠️  Not all tasks are complete!

     Remaining tasks: <X>
     - (list first 5 incomplete tasks)

     Options:
     1. Continue anyway and mark as done (not recommended)
     2. Cancel and finish remaining tasks
     3. Save checkpoint and resume later (/openspec:checkpoint)

     What would you like to do?
     ```

   - Wait for user decision

3. **Final checkpoint**
   - Ask user: "Would you like to save a final checkpoint before archiving? (y/n)"
   - If yes, run /openspec:checkpoint workflow
   - This captures final state in design.md

4. **Run OpenSpec archive**
   - Execute: `openspec archive <change-id>`
   - This moves the change to archived folder with timestamp
   - Updates specs/ folder with approved changes
   - Shows success message from OpenSpec CLI

5. **Clear active change tracker**
   - Delete or clear `openspec/active.json`:

     ```json
     {}
     ```

   - Or delete the file entirely

6. **Guide CHANGELOG update**
   - Show message:

     ```txt
     ✓ Change archived successfully!

     Next steps:
     1. Review the changes made by OpenSpec
     2. Update CHANGELOG.md with this change:

        ## [Unreleased]

        ### Added
        - **<change-id>** - <brief description>

     3. Commit all changes:
        git add .
        git commit -m "feat: <change description>"

     4. The change is now archived in:
        openspec/changes/<timestamp>-<change-id>/

     Use /openspec:work to start on the next change.
     ```

7. **Show OpenSpec view**
   - Run `openspec view` to show updated dashboard
   - Confirms change is archived and specs are updated

**Error Handling**

- If no active change: Guide user to use /openspec:work
- If openspec archive fails: Show error and suggest checking change validity
- If CHANGELOG.md doesn't exist: Create it with standard format
- If active.json clear fails: Warn but continue (non-critical)

**Example Usage**

**Scenario 1: All tasks complete**

```txt
User: /openspec:done
Assistant: [Checks tasks.md - all complete ✓]
          Would you like to save a final checkpoint? (y/n)
User: y
Assistant: [Runs checkpoint flow]
          [Runs openspec archive add-dark-mode]
          [Clears active.json]
          ✓ Change archived successfully!
          [Shows next steps]
```

**Scenario 2: Tasks incomplete**

```txt
User: /openspec:done
Assistant: ⚠️  Not all tasks are complete!

          Remaining tasks: 3
          - [ ] Add localStorage persistence
          - [ ] Write tests for theme toggle
          - [ ] Update documentation

          Options:
          1. Continue anyway (not recommended)
          2. Cancel and finish tasks
          3. Save checkpoint and resume later

          What would you like to do?
User: 2
Assistant: Cancelled. Use /openspec:status to see remaining work.
```

**Notes**

- This command wraps `openspec archive` with pre/post checks
- Clears active.json so SessionStart hook doesn't load old context
- Encourages final checkpoint for documentation
- Guides user through commit process
- Ensures clean state for starting next change

<!-- OPENSPEC:END -->
