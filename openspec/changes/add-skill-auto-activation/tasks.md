# Tasks: Add Skill Auto-Activation System

## Phase 1: Core Infrastructure (Week 1, Days 1-3)

### 1. Define TypeScript Interfaces

- [x] Create `plugins/claude-tools/types/skill-rules.d.ts`
- [x] Define `PluginSkillRules` interface
- [x] Define `ProjectSkillRules` interface
- [x] Define `SkillConfig` interface
- [x] Define `MatchedSkill` interface
- [x] Add JSDoc comments to all interfaces
- [x] Export all types

**Validation:** TypeScript compiles with no errors

**Dependencies:** None

---

### 2. Create Hook Infrastructure

- [x] Create `plugins/claude-tools/hooks/` directory
- [x] Create `skill-activation-prompt.ts` hook file
- [x] Add shebang: `#!/usr/bin/env bun`
- [x] Implement stdin parsing (read hook input JSON)
- [x] Implement Bun runtime check with helpful error message
- [x] Add proper error handling and exit codes

**Validation:** Hook runs successfully with `bun run skill-activation-prompt.ts < test-input.json`

**Dependencies:** Task 1 (TypeScript interfaces)

---

### 3. Implement Rule Discovery

- [x] Add function to scan `.claude/skills/*/skill-rules.json`
- [x] Implement JSON parsing with error handling
- [x] Add validation for required fields (plugin.namespace, skills)
- [x] Implement loading of project overrides from `.claude/skills/skill-rules.json`
- [x] Add logging for invalid files (warn, don't crash)
- [x] Handle missing files gracefully

**Validation:** Hook discovers and loads all rule files correctly

**Dependencies:** Task 2 (Hook infrastructure)

---

### 4. Implement Rule Merging

- [x] Create merge function with precedence (project > plugin)
- [x] Implement shallow merge for overrides
- [x] Handle disabled skills array
- [x] Apply global configuration (maxSkillsPerPrompt, priorityThreshold)
- [x] Add namespace to skill keys (`namespace/skill-name`)
- [x] Validate override keys include namespace

**Validation:** Merged rules correctly apply precedence and filtering

**Dependencies:** Task 3 (Rule discovery)

---

### 5. Implement Matching Logic

- [x] Create keyword matching function (case-insensitive literal)
- [x] Create intent pattern matching function (regex with 'i' flag)
- [x] Handle invalid regex patterns gracefully
- [x] Track match type (keyword vs intent)
- [x] Filter by priority threshold if configured
- [x] Sort results by priority (critical → low)
- [x] Limit results to maxSkillsPerPrompt if configured

**Validation:** Matches correctly identify relevant skills from prompts

**Dependencies:** Task 4 (Rule merging)

---

### 6. Implement Output Formatting

- [x] Create formatted output with box drawing characters
- [x] Group skills by priority (critical, high, medium, low)
- [x] Use emoji icons for visual hierarchy
- [x] Add "ACTION: Use Skill tool BEFORE responding" message
- [x] Handle empty results (no output)
- [x] Ensure output goes to stdout for hook consumption

**Validation:** Output is formatted correctly and readable

**Dependencies:** Task 5 (Matching logic)

---

### 7. Add Performance Monitoring

- [x] Add execution time tracking
- [x] Log warning if execution >50ms
- [x] Optimize file operations (minimize reads)
- [x] Pre-compile regex patterns at load time
- [x] Cache plugin discovery if possible

**Validation:** Hook executes in <50ms for typical projects

**Dependencies:** Task 6 (Output formatting)

---

## Phase 2: Templates & Configuration (Week 1, Days 4-5)

### 8. Create Plugin-Level Template

- [x] Create `plugins/claude-tools/templates/skill-rules.template.json`
- [x] Add plugin metadata section with placeholders
- [x] Add example skill with all fields documented
- [x] Include comments (using special format for JSON)
- [x] Add link to documentation

**Validation:** Template is valid JSON and well-documented

**Dependencies:** Task 1 (TypeScript interfaces)

---

### 9. Create Project Override Template

- [x] Create `plugins/claude-tools/templates/project-overrides.template.json`
- [x] Add version field
- [x] Add overrides section with example
- [x] Add disabled array with example
- [x] Add global configuration with all options
- [x] Include extensive comments explaining each field

**Validation:** Template is valid JSON and clear

**Dependencies:** Task 1 (TypeScript interfaces)

---

### 10. Create skill-rules.json for claude-tools

- [x] Create `plugins/claude-tools/skills/skill-rules.json`
- [x] Add plugin metadata (name: "claude-tools", namespace: "claude")
- [x] Add rules for skill-creator
- [x] Add rules for hook-creator
- [x] Add rules for command-creator
- [x] Add rules for agent-creator
- [x] Add rules for plugin-creator
- [x] Add rules for skill-validator
- [x] Test all rules with real prompts

**Validation:** All claude-tools skills auto-activate correctly

**Dependencies:** Tasks 2-6 (Hook implementation)

---

## Phase 3: Commands & Migration (Week 1, Days 6-7)

### 11. Create /configure-activation Command

- [x] Create `plugins/claude-tools/commands/configure-activation.md`
- [x] Add YAML frontmatter with command metadata
- [x] Implement logic to check if file exists
- [x] Prompt user for confirmation if file exists
- [x] Copy project-overrides.template.json to `.claude/skills/skill-rules.json`
- [x] Add success message with next steps
- [x] Test command execution in Claude Code

**Validation:** Command successfully generates override file

**Dependencies:** Task 9 (Project override template)

---

### 12. Implement Auto-Migration (Internal Command)

- [x] Create `/generate-skill-rules` command (for maintainers)
- [x] Parse YAML frontmatter from SKILL.md files
- [x] Extract triggers.keywords and triggers.patterns
- [x] Generate skill-rules.json entries
- [x] Handle skills without triggers gracefully
- [x] Output generated JSON to stdout
- [x] Add option to write directly to skill-rules.json

**Validation:** YAML triggers correctly converted to JSON format

**Dependencies:** Task 10 (skill-rules.json for claude-tools)

---

## Phase 4: Documentation (Week 2, Day 1)

### 13. Update CLAUDE.md

- [x] Add "Auto-Activation System" section under Architecture
- [x] Explain per-plugin rules + runtime aggregation
- [x] Document skill-rules.json location and structure
- [x] Add project overrides section
- [x] Include setup instructions
- [x] Add troubleshooting for common issues
- [x] Update "Key Patterns" section

**Validation:** Documentation is clear and complete

**Dependencies:** Tasks 2-12 (all implementation)

---

### 14. Create SKILL_ACTIVATION_GUIDE.md

- [x] Create `docs/SKILL_ACTIVATION_GUIDE.md`
- [x] Add comprehensive overview
- [x] Document skill-rules.json schema with examples
- [x] Explain matching algorithms (keywords + patterns)
- [x] Document project overrides with use cases
- [x] Add troubleshooting section
- [x] Include migration guide from YAML
- [x] Add FAQs section
- [x] Link to diet103 showcase as inspiration

**Validation:** Guide enables users to set up in <10 minutes

**Dependencies:** Tasks 2-12 (all implementation)

---

### 15. Update skill-creator Skill

- [x] Update skill-creator/SKILL.md
- [x] Add section about generating skill-rules.json entries
- [x] Include examples of good keywords and patterns
- [x] Reference SKILL_ACTIVATION_GUIDE.md
- [x] Update template to remind about adding activation rules

**Validation:** skill-creator promotes auto-activation best practices

**Dependencies:** Task 14 (Documentation)

---

## Phase 5: Testing & Polish (Week 2, Day 2)

### 16. Manual Testing

- [x] Test with various prompts (keyword matches)
- [x] Test with various prompts (pattern matches)
- [x] Test with no matches
- [x] Test with multiple plugin installs
- [x] Test project overrides
- [x] Test disabled skills
- [x] Test priority sorting
- [x] Test maxSkillsPerPrompt limit
- [x] Test without Bun installed
- [x] Test with malformed JSON files
- [x] Test performance with 10+ plugins

**Validation:** All scenarios pass successfully

**Dependencies:** Tasks 2-12 (all implementation)

---

### 17. Error Message Refinement

- [x] Review all error messages for clarity
- [x] Ensure actionable steps included
- [x] Add helpful links where appropriate
- [x] Test error handling paths
- [x] Add color/formatting to error output (if possible)

**Validation:** Error messages are helpful and actionable

**Dependencies:** Task 16 (Manual testing)

---

### 18. Performance Optimization

- [x] Profile hook execution time
- [x] Optimize file reading (minimize I/O)
- [x] Cache compiled regex patterns
- [x] Add early exit optimizations
- [x] Test with 10+ plugins
- [x] Ensure <50ms execution time

**Validation:** Performance meets requirements

**Dependencies:** Task 16 (Manual testing)

---

### 19. OpenSpec Validation

- [x] Run `openspec validate add-skill-auto-activation --strict`
- [x] Fix any validation errors
- [x] Ensure all requirements have scenarios
- [x] Check for orphaned references
- [x] Verify task completeness

**Validation:** OpenSpec validation passes with no errors

**Dependencies:** All previous tasks

---

### 20. Update Plugin Metadata

- [x] Update `plugins/claude-tools/.claude-plugin/plugin.json`
- [x] Bump version to next minor (e.g., 0.2.0)
- [x] Update description to mention auto-activation
- [x] Add "auto-activation" to keywords
- [x] Update README.md if needed

**Validation:** Plugin metadata is accurate

**Dependencies:** Tasks 2-12 (all implementation)

---

## Summary

**Total Tasks:** 20
**Estimated Time:** 2 weeks
**Parallelizable:**

- Tasks 8-9 (Templates) can be done alongside Tasks 2-7 (Hook implementation)
- Tasks 13-15 (Documentation) can start after Task 10

**Critical Path:**

1. Define interfaces (Task 1)
2. Create hook (Tasks 2-7)
3. Create skill-rules.json (Task 10)
4. Testing (Tasks 16-19)

**Completion Criteria:**

- [x] All 20 tasks completed
- [x] OpenSpec validation passes
- [x] Manual testing successful
- [x] Documentation complete
- [x] Ready for use in claude-tools plugin
