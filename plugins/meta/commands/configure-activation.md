---
name: configure-activation
description: Generate project-level skill activation overrides template
version: 1.0.0
---

# Configure Skill Activation

This command helps you set up project-level overrides for skill auto-activation rules.

## What This Does

Creates `.claude/skills/skill-rules.json` in your project with a template for customizing:

- Skill priorities (make certain skills more prominent)
- Trigger keywords (add project-specific terms)
- Disabled skills (turn off skills you don't use)
- Global settings (limit suggestions, set priority thresholds)

## Instructions

1. **Check if project overrides file exists**
   - Path: `.claude/skills/skill-rules.json`
   - If file exists, ask user: "File already exists at .claude/skills/skill-rules.json. Overwrite? (y/n)"
   - If user says no, exit without changes
   - If user says yes or file doesn't exist, proceed to step 2

2. **Ensure directory exists**
   - Create `.claude/skills/` directory if it doesn't exist
   - Use: `mkdir -p .claude/skills`

3. **Copy template to project**
   - Source: `plugins/claude-tools/templates/project-overrides.template.json`
   - Destination: `.claude/skills/skill-rules.json`
   - Important: Remove all comment fields (keys starting with "\_") from the JSON
   - Keep only the actual configuration structure

4. **Create clean template**
   - The copied file should contain:

     ```json
     {
       "version": "1.0",
       "overrides": {},
       "disabled": [],
       "global": {
         "maxSkillsPerPrompt": null,
         "priorityThreshold": null
       }
     }
     ```

   - This gives users a clean starting point

5. **Display success message**

   ```txt
   ✓ Skill activation overrides template created!

   Location: .claude/skills/skill-rules.json

   Next steps:
   1. Open .claude/skills/skill-rules.json
   2. Customize overrides for your project needs
   3. See examples in plugins/claude-tools/templates/project-overrides.template.json

   Common customizations:
   - Increase priority: Set "priority": "critical" for important skills
   - Add keywords: Add project-specific trigger words
   - Disable skills: Add unwanted skills to "disabled" array
   - Limit suggestions: Set "maxSkillsPerPrompt": 3

   Documentation: See SKILL_ACTIVATION_GUIDE.md for detailed examples
   ```

## Error Handling

- If `.claude/skills/` directory can't be created, show error and suggest checking permissions
- If template file is missing, show error and suggest reinstalling claude-tools plugin
- If file write fails, show error with the specific reason

## Example Usage

**Scenario 1: First-time setup**

```txt
User: /configure-activation
Assistant: [Creates .claude/skills/skill-rules.json with clean template]
          [Shows success message with next steps]
```

**Scenario 2: File already exists**

```txt
User: /configure-activation
Assistant: File already exists at .claude/skills/skill-rules.json. Overwrite? (y/n)
User: n
Assistant: Configuration cancelled. Your existing file was not modified.
```

**Scenario 3: Overwrite existing**

```txt
User: /configure-activation
Assistant: File already exists at .claude/skills/skill-rules.json. Overwrite? (y/n)
User: y
Assistant: [Overwrites file with clean template]
          [Shows success message]
```

## Notes

- This command only creates the template - users must manually edit it
- The hook will automatically discover and use the file once created
- Project overrides take precedence over plugin defaults
- Invalid configurations will show warnings but won't crash the hook
