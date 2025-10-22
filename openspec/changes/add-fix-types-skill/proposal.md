# Add Fix Types Skill

## Why

TypeScript compilation errors slow down development and often require manual investigation and fixing. Common type errors have standard solutions that could be automated.

This skill will enable Claude to automatically identify and fix common TypeScript type errors, improving developer velocity and code quality.

## What Changes

- **ADD** new type-checking capability to typescript-tools plugin
- **ADD** skill file: `plugins/typescript-tools/skills/fix-types/SKILL.md`
- **ADD** common type error detection
- **ADD** auto-fix patterns for standard errors
- **ADD** type inference improvements
- **ADD** examples and documentation

## Impact

- **Affected specs:** New capability `type-checking` in typescript-tools
- **Affected code:**
  - `plugins/typescript-tools/skills/fix-types/SKILL.md` (new)
  - `.claude-plugin/marketplace.json` (update)
- **Dependencies:**
  - Requires TypeScript compiler (tsc)
- **Benefits:**
  - Faster error resolution
  - Automated common fixes
  - Improved type safety
  - Better developer experience
