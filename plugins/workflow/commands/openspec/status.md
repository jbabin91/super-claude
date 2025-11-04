---
name: OpenSpec: Status
description: Show current OpenSpec change status and progress.
category: OpenSpec
tags: [openspec, status, progress]
---

<!-- OPENSPEC:START -->

**Purpose**

This command shows the current state of your OpenSpec work:

- Which change you're actively working on
- Progress on tasks (completed vs remaining)
- Time since you started and last checkpoint
- Quick access to the OpenSpec dashboard

**Steps**

1. **Check for active change**
   - Read `openspec/active.json`
   - If file doesn't exist or is empty: "No active change. Use /openspec:work to start working on a change."
   - Exit if no active change

2. **Parse active change data**
   - Extract: `change` (change ID), `started` (timestamp), `lastCheckpoint` (timestamp)
   - Calculate time elapsed since started and last checkpoint

3. **Run OpenSpec dashboard**
   - Execute `openspec view` to get current state of all changes
   - This shows the progress bars and task counts

4. **Load task progress**
   - Read `openspec/changes/<change-id>/tasks.md`
   - Count total tasks (lines starting with `- [ ]` or `- [x]`)
   - Count completed tasks (lines starting with `- [x]`)
   - Calculate percentage: `(completed / total) * 100`

5. **Display status summary**

   ```txt
   📊 OpenSpec Status

   Active Change: <change-id>
   Started: <X hours/days ago>
   Last Checkpoint: <Y minutes/hours ago>

   Progress:
   ├─ Tasks: <completed>/<total> (<percentage>%)
   ├─ Status: <In Progress|Blocked|Ready for Review>
   └─ Next: <first incomplete task from tasks.md>

   Recent Context (from design.md):
   <last 5-10 lines of design.md to show recent decisions/progress>

   Commands:
   - /openspec:checkpoint - Save current progress
   - /openspec:work - Switch to different change
   - /openspec:done - Complete and archive
   ```

6. **Show OpenSpec dashboard**
   - Output result of `openspec view` for full context

**Error Handling**

- If active.json exists but change directory missing: "Active change '<change-id>' not found. It may have been archived. Use /openspec:work to select a new change."
- If tasks.md missing: Show "0/0 tasks (no tasks.md found)"
- If design.md missing: Skip "Recent Context" section

**Example Usage**

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
└─ Next: Implement theme toggle in settings page

Recent Context (from design.md):
- Created ThemeContext with light/dark modes
- Added theme provider to root layout
- Implemented CSS variable system for colors
- Need to add persistence with localStorage

[openspec view output shown]
```

**Notes**

- This command is read-only - it doesn't modify anything
- Useful for quick progress checks without reading all files
- Shows "at a glance" summary before diving into details
- Complements `openspec view` with active change focus

<!-- OPENSPEC:END -->
