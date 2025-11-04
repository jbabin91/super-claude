---
name: OpenSpec: Work
description: Start working on an OpenSpec change with full context loading.
category: OpenSpec
tags: [openspec, work, context]
---

<!-- OPENSPEC:START -->

**Purpose**

This command helps you start or resume work on an OpenSpec change proposal. It:

- Shows the OpenSpec dashboard with all changes
- Loads the change context (proposal, design, tasks)
- Tracks the active change for session persistence
- Enables automatic context loading on session resume

**Steps**

1. **Show OpenSpec dashboard**
   - Run `openspec view` to display all changes with progress
   - Output the dashboard so user can see status

2. **Select change to work on**
   - Ask user: "Which change would you like to work on? (provide change ID)"
   - Change ID is the folder name in `openspec/changes/`
   - Example: `add-dark-mode`, `fix-auth-bug`, `refactor-api`

3. **Verify change exists**
   - Check that `openspec/changes/<change-id>/` directory exists
   - If not found, show error: "Change '<change-id>' not found. Run 'openspec view' to see available changes."
   - Exit if not found

4. **Load change context**
   - Read and display key files in this order:
     - `openspec/changes/<change-id>/proposal.md` - The WHY (goals, motivation)
     - `openspec/changes/<change-id>/design.md` - The HOW (living doc with approach)
     - `openspec/changes/<change-id>/tasks.md` - The WHAT (checklist of work)
   - If design.md doesn't exist, note: "No design.md yet. Create one to track your approach and decisions."

5. **Update active change tracker**
   - Write to `openspec/active.json`:

     ```json
     {
       "change": "<change-id>",
       "started": "<ISO 8601 timestamp>",
       "lastCheckpoint": "<ISO 8601 timestamp>"
     }
     ```

   - Use JavaScript/TypeScript Date: `new Date().toISOString()`

6. **Confirm and guide next steps**
   - Show success message:

     ```txt
     ✓ Now working on: <change-id>

     Context loaded:
     - Proposal: <brief summary from proposal.md>
     - Tasks: <X> remaining, <Y> completed

     Next steps:
     1. Review the proposal and design above
     2. Work through tasks in tasks.md sequentially
     3. Use /openspec:checkpoint to save progress
     4. Use /openspec:status to check progress anytime
     5. Use /openspec:done when all tasks complete

     The SessionStart hook will automatically load this context if you resume later.
     ```

**Error Handling**

- If `openspec` CLI not found: "OpenSpec CLI not installed. Run 'npm install -g @fission-codes/openspec'"
- If no changes exist: "No OpenSpec changes found. Create one with /openspec:proposal"
- If `openspec/` directory doesn't exist: Show error (should be created by 'openspec init')
- If active.json write fails: Show error but continue (non-critical)

**Example Usage**

```txt
User: /openspec:work
Assistant: [Runs openspec view, shows dashboard]
          Which change would you like to work on? (provide change ID)
User: add-dark-mode
Assistant: [Loads proposal.md, design.md, tasks.md]
          [Updates active.json]
          [Shows success message with context summary]
```

**Notes**

- This command wraps `openspec view` and adds context loading
- The active.json file enables session resume via SessionStart hook
- design.md serves as the "living doc" (Reddit's context.md equivalent)
- Use /openspec:checkpoint frequently to update design.md with progress

<!-- OPENSPEC:END -->
