# Implementation Tasks: Refactor Imports Skill

## 1. Skill File Structure

- [ ] 1.1 Create `plugins/typescript-tools/skills/refactor-imports/` directory
- [ ] 1.2 Create SKILL.md with YAML frontmatter
- [ ] 1.3 Add skill to `.claude-plugin/marketplace.json`

## 2. Path Alias Management

- [ ] 2.1 Document tsconfig.json path alias detection
- [ ] 2.2 Add relative-to-alias conversion logic
- [ ] 2.3 Add alias-to-relative conversion logic
- [ ] 2.4 Document path alias consistency checking
- [ ] 2.5 Provide path alias examples

## 3. Unused Import Detection

- [ ] 3.1 Document AST parsing for import analysis
- [ ] 3.2 Add unused import identification logic
- [ ] 3.3 Document safe removal procedures
- [ ] 3.4 Add side-effect import preservation
- [ ] 3.5 Provide unused import examples

## 4. Import Organization

- [ ] 4.1 Document import grouping strategy (external, internal, relative)
- [ ] 4.2 Add alphabetical sorting within groups
- [ ] 4.3 Document blank line insertion between groups
- [ ] 4.4 Add type import separation (import type)
- [ ] 4.5 Provide organization examples

## 5. Auto-Fix Capabilities

- [ ] 5.1 Document import statement formatting
- [ ] 5.2 Add duplicate import merging
- [ ] 5.3 Document barrel import optimization
- [ ] 5.4 Add circular dependency detection
- [ ] 5.5 Provide auto-fix examples

## 6. Documentation & Testing

- [ ] 6.1 Write SKILL.md overview
- [ ] 6.2 Add examples for each feature
- [ ] 6.3 RED-GREEN-REFACTOR testing
- [ ] 6.4 Verify SKILL.md < 500 lines

## Success Criteria

- ✅ Detects and converts path aliases
- ✅ Identifies unused imports
- ✅ Organizes imports consistently
- ✅ Auto-fixes common issues
- ✅ All tests pass
