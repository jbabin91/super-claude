# Implementation Tasks: CLI Testing Skill

## 1. Skill File Structure

- [ ] 1.1 Create `plugins/typescript-tools/skills/cli-testing/` directory
- [ ] 1.2 Create SKILL.md with YAML frontmatter (name, version, triggers, etc.)
- [ ] 1.3 Create API_REFERENCE.md for advanced scenarios
- [ ] 1.4 Add skill to `.claude-plugin/marketplace.json`

## 2. Universal Executor Implementation

- [ ] 2.1 Document universal executor pattern in SKILL.md
- [ ] 2.2 Provide template for temporary test file generation
- [ ] 2.3 Document environment setup steps (package manager, monorepo context)
- [ ] 2.4 Document test execution with proper module resolution
- [ ] 2.5 Document result parsing and validation logic
- [ ] 2.6 Document cleanup procedures (try/finally, timeout handling)

## 3. Monorepo Support

- [ ] 3.1 Add Nx workspace detection logic (check for nx.json)
- [ ] 3.2 Add Turborepo detection logic (check for turbo.json)
- [ ] 3.3 Add pnpm workspaces detection (check for pnpm-workspace.yaml)
- [ ] 3.4 Document workspace context setup for each monorepo type
- [ ] 3.5 Provide examples for monorepo CLI testing

## 4. Package Manager Detection

- [ ] 4.1 Add lockfile detection logic (pnpm-lock.yaml, yarn.lock, package-lock.json)
- [ ] 4.2 Document package manager priority (pnpm > yarn > npm)
- [ ] 4.3 Add package manager override mechanism
- [ ] 4.4 Document validation for package manager availability
- [ ] 4.5 Provide examples for each package manager

## 5. Cross-Platform Compatibility

- [ ] 5.1 Add platform detection (process.platform)
- [ ] 5.2 Document platform-specific shell selection (bash/sh vs cmd.exe/PowerShell)
- [ ] 5.3 Document path separator handling (Unix / vs Windows \)
- [ ] 5.4 Add platform-specific test conditional logic
- [ ] 5.5 Document Windows-specific considerations in API_REFERENCE.md
- [ ] 5.6 Provide cross-platform testing examples

## 6. Test Result Validation

- [ ] 6.1 Document JSON result format (stdout, stderr, exitCode, executionTime)
- [ ] 6.2 Add success/failure detection logic
- [ ] 6.3 Add output pattern matching for validation
- [ ] 6.4 Document common error recognition patterns
- [ ] 6.5 Provide result validation examples

## 7. Environment Isolation

- [ ] 7.1 Document temp file creation in isolated directories
- [ ] 7.2 Add unique filename generation logic
- [ ] 7.3 Document environment variable isolation
- [ ] 7.4 Add cleanup on success scenario
- [ ] 7.5 Add cleanup on failure scenario (try/finally)
- [ ] 7.6 Document timeout handling and resource cleanup

## 8. Documentation & Examples

- [ ] 8.1 Write SKILL.md overview section
- [ ] 8.2 Add basic CLI testing example
- [ ] 8.3 Add monorepo testing example
- [ ] 8.4 Add package manager testing example
- [ ] 8.5 Add cross-platform testing example
- [ ] 8.6 Document common troubleshooting scenarios
- [ ] 8.7 Add API_REFERENCE.md with advanced topics
- [ ] 8.8 Verify SKILL.md is < 500 lines

## 9. RED-GREEN-REFACTOR Testing

- [ ] 9.1 RED Phase: Test CLI scenarios WITHOUT skill, document failures
- [ ] 9.2 GREEN Phase: Create minimal skill, verify Claude complies
- [ ] 9.3 REFACTOR Phase: Identify rationalizations, add guards, re-test
- [ ] 9.4 Test in basic TypeScript project
- [ ] 9.5 Test in Nx monorepo
- [ ] 9.6 Test in Turborepo monorepo
- [ ] 9.7 Test in pnpm workspace
- [ ] 9.8 Test with npm, pnpm, and yarn
- [ ] 9.9 Test on macOS (if available)
- [ ] 9.10 Test on Linux (if available)
- [ ] 9.11 Test on Windows (if available)
- [ ] 9.12 Document all test results and edge cases discovered

## 10. Integration & Polish

- [ ] 10.1 Verify skill activates on CLI testing keywords
- [ ] 10.2 Test progressive disclosure (SKILL.md loads, API_REFERENCE.md on-demand)
- [ ] 10.3 Check for markdownlint violations and fix
- [ ] 10.4 Verify YAML frontmatter is valid
- [ ] 10.5 Update ROADMAP.md to mark tsc-files-validation as complete
- [ ] 10.6 Update SESSION_SUMMARY.md or relevant docs
- [ ] 10.7 Create commit with conventional commit message

## Dependencies

- **Blocked by:** None (new capability)
- **Blocks:** Future Vitest integration skill (will reuse universal executor)
- **Parallel work:** Can develop smart-commit skill simultaneously

## Success Criteria

- ✅ Skill loads in Claude Code without errors
- ✅ Auto-activates on CLI testing keywords
- ✅ Generates valid CLI test code
- ✅ Properly detects monorepo environments
- ✅ Correctly identifies package managers
- ✅ Handles cross-platform scenarios
- ✅ Cleanup works in success and failure cases
- ✅ SKILL.md < 500 lines
- ✅ All RED-GREEN-REFACTOR tests pass
- ✅ No markdownlint violations
