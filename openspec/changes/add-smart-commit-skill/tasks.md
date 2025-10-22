# Implementation Tasks: Smart Commit Skill

## 1. Skill File Structure

- [ ] 1.1 Create `plugins/git-tools/skills/smart-commit/` directory
- [ ] 1.2 Create SKILL.md with YAML frontmatter (name, version, triggers, etc.)
- [ ] 1.3 Add skill to `.claude-plugin/marketplace.json`

## 2. Conventional Commit Format

- [ ] 2.1 Document conventional commit format: `<type>(<scope>): <gitmoji> <description>`
- [ ] 2.2 Define commit types (feat, fix, docs, chore, refactor, test)
- [ ] 2.3 Document scope detection logic (auto-detect from file paths)
- [ ] 2.4 Add description formatting guidelines
- [ ] 2.5 Document optional body and footer sections
- [ ] 2.6 Provide conventional commit examples

## 3. Gitmoji Integration

- [ ] 3.1 Document gitmoji mapping for each commit type
- [ ] 3.2 Create type-to-gitmoji reference table
- [ ] 3.3 Add auto-selection logic based on commit type
- [ ] 3.4 Document custom gitmoji override mechanism
- [ ] 3.5 Provide gitmoji examples for common scenarios

## 4. Commit Analysis

- [ ] 4.1 Document git status parsing for staged files
- [ ] 4.2 Document git diff analysis for change detection
- [ ] 4.3 Add file path analysis for scope detection
- [ ] 4.4 Document change pattern recognition (new files, deletions, modifications)
- [ ] 4.5 Add logic for multi-scope commits (multiple areas changed)

## 5. Message Generation

- [ ] 5.1 Document commit message assembly from components
- [ ] 5.2 Add subject line length validation (50-72 chars recommended)
- [ ] 5.3 Document body generation for complex changes
- [ ] 5.4 Add breaking change detection and BREAKING CHANGE footer
- [ ] 5.5 Document issue/PR reference formatting (e.g., "Closes #123")

## 6. Validation & Verification

- [ ] 6.1 Add conventional commit format validation
- [ ] 6.2 Document subject line capitalization rules
- [ ] 6.3 Add trailing punctuation check (no periods in subject)
- [ ] 6.4 Document imperative mood verification
- [ ] 6.5 Provide validation error messages with suggestions

## 7. Documentation & Examples

- [ ] 7.1 Write SKILL.md overview section
- [ ] 7.2 Add basic commit message example
- [ ] 7.3 Add multi-file commit example
- [ ] 7.4 Add breaking change example
- [ ] 7.5 Document gitmoji reference table
- [ ] 7.6 Add scope detection examples
- [ ] 7.7 Document troubleshooting scenarios
- [ ] 7.8 Verify SKILL.md is < 500 lines

## 8. RED-GREEN-REFACTOR Testing

- [ ] 8.1 RED Phase: Create commits WITHOUT skill, document inconsistencies
- [ ] 8.2 GREEN Phase: Create minimal skill, verify Claude generates proper format
- [ ] 8.3 REFACTOR Phase: Identify edge cases, add guards, re-test
- [ ] 8.4 Test with new feature commits (feat)
- [ ] 8.5 Test with bug fix commits (fix)
- [ ] 8.6 Test with documentation commits (docs)
- [ ] 8.7 Test with refactoring commits (refactor)
- [ ] 8.8 Test with multi-scope commits
- [ ] 8.9 Test with breaking changes
- [ ] 8.10 Document all test results and patterns discovered

## 9. Integration & Polish

- [ ] 9.1 Verify skill activates on commit-related keywords
- [ ] 9.2 Test with git status showing staged changes
- [ ] 9.3 Check for markdownlint violations and fix
- [ ] 9.4 Verify YAML frontmatter is valid
- [ ] 9.5 Update ROADMAP.md to mark smart-commit as complete
- [ ] 9.6 Create commit with conventional commit message

## Dependencies

- **Blocked by:** None (new capability)
- **Blocks:** pr-description skill (reuses commit message format)
- **Parallel work:** Can develop alongside CLI testing skill

## Success Criteria

- ✅ Skill loads in Claude Code without errors
- ✅ Auto-activates on commit keywords (commit, conventional, gitmoji)
- ✅ Generates properly formatted commit messages
- ✅ Correct gitmoji for commit type
- ✅ Validates commit message format
- ✅ Detects scope from file paths
- ✅ Handles breaking changes
- ✅ SKILL.md < 500 lines
- ✅ All RED-GREEN-REFACTOR tests pass
- ✅ No markdownlint violations
