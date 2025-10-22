# Add Refactor Imports Skill

## Why

TypeScript projects often accumulate import statement issues: path alias inconsistencies, unused imports, poor organization, and manual import management overhead. These issues reduce code quality, increase bundle size, and waste developer time.

This skill will enable Claude to automatically refactor import statements, manage path aliases, detect unused imports, and organize imports consistently across the project.

## What Changes

- **ADD** new import management capability to typescript-tools plugin
- **ADD** skill file: `plugins/typescript-tools/skills/refactor-imports/SKILL.md`
- **ADD** path alias management and conversion
- **ADD** unused import detection and removal
- **ADD** import organization and sorting
- **ADD** auto-fix capabilities for common import issues
- **ADD** examples and documentation

## Impact

- **Affected specs:** New capability `import-management` in typescript-tools
- **Affected code:**
  - `plugins/typescript-tools/skills/refactor-imports/SKILL.md` (new)
  - `.claude-plugin/marketplace.json` (update to reference new skill)
- **Dependencies:**
  - Requires TypeScript compiler (tsc)
  - Optional: eslint for import linting rules
- **Users:** TypeScript developers maintaining import statements
- **Benefits:**
  - Consistent path alias usage
  - Reduced bundle size (remove unused imports)
  - Improved code organization
  - Automated import refactoring
  - Better developer experience
