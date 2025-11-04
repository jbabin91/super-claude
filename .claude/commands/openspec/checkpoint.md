---
name: OpenSpec: Checkpoint
description: Save current progress and context to design.md.
category: OpenSpec
tags: [openspec, checkpoint, save]
---

<!-- OPENSPEC:START -->

**Purpose**

This command saves your current progress as a checkpoint in design.md. It's the equivalent of the Reddit post's "checkpoint" concept - preserving context so you can resume work later without losing your train of thought.

**When to Use**

- Before taking a break or ending a session
- After completing a significant subtask
- When you've made important decisions or discoveries
- Before switching to a different change
- Regularly during long work sessions (every 30-60 minutes)

**Steps**

1. **Check for active change**
   - Read `openspec/active.json`
   - If no active change: "No active change. Use /openspec:work to start working on a change first."
   - Exit if no active change

2. **Gather current context**
   - Ask user to summarize current progress:

     ```txt
     Let's save a checkpoint. Please provide:

     1. What did you just complete?
     2. What are you working on now?
     3. What's next?
     4. Any blockers or decisions made?

     (You can provide a brief summary or detailed notes)
     ```

3. **Load existing design.md**
   - Path: `openspec/changes/<change-id>/design.md`
   - If doesn't exist, create with initial structure:

     ```markdown
     # Design: <change-id>

     ## Overview

     (Brief description of the approach)

     ## Progress Log

     ### Checkpoint: <ISO 8601 timestamp>

     (User's progress notes)
     ```

   - If exists, append new checkpoint section

4. **Append checkpoint to design.md**
   - Add new section at the end:

     ```markdown
     ### Checkpoint: <ISO 8601 timestamp>

     **Completed:**

     - (what user completed)

     **Current:**

     - (what user is working on)

     **Next:**

     - (what's next)

     **Notes:**

     - (any blockers/decisions)
     ```

5. **Update tasks.md if needed**
   - Ask user: "Any tasks to mark complete in tasks.md? (y/n)"
   - If yes, ask which task numbers to mark with `[x]`
   - Update tasks.md with completed tasks

6. **Update active.json**
   - Update `lastCheckpoint` field to current timestamp:

     ```json
     {
       "change": "<change-id>",
       "started": "<original timestamp>",
       "lastCheckpoint": "<current ISO 8601 timestamp>"
     }
     ```

7. **Confirm checkpoint saved**

   ```txt
   ✓ Checkpoint saved to design.md

   Updated:
   - design.md: Added progress notes
   - tasks.md: Marked <X> tasks complete
   - active.json: Updated lastCheckpoint

   You can safely resume this work later. The SessionStart hook will load this context automatically.

   Use /openspec:status to see current progress.
   ```

**Error Handling**

- If no active change: Guide user to use /openspec:work first
- If design.md write fails: Show error and suggest checking file permissions
- If tasks.md parsing fails: Skip task updates but still save checkpoint

**Example Usage**

**Scenario 1: Quick checkpoint**

```txt
User: /openspec:checkpoint
Assistant: Let's save a checkpoint. Please provide:
          1. What did you just complete?
          2. What are you working on now?
          3. What's next?
User: Just finished the theme provider. Working on the toggle component now. Next is localStorage persistence.
Assistant: [Appends to design.md]
          [Updates active.json]
          ✓ Checkpoint saved
```

**Scenario 2: Checkpoint with task updates**

```txt
User: /openspec:checkpoint
Assistant: Let's save a checkpoint...
User: Completed theme context and provider setup
Assistant: Any tasks to mark complete in tasks.md? (y/n)
User: y
Assistant: Which task numbers? (e.g., 1,3,5)
User: 1,2
Assistant: [Updates tasks.md: marks tasks 1 and 2 complete]
          [Appends checkpoint to design.md]
          ✓ Checkpoint saved. 2 tasks marked complete.
```

**Notes**

- design.md acts as a "living doc" that grows with the project
- Checkpoints create a timeline of progress and decisions
- The SessionStart hook reads design.md to restore context
- This is inspired by diet103's "context.md" approach from Reddit
- Unlike git commits, checkpoints capture thought process and decisions

<!-- OPENSPEC:END -->
