# Add CLI Testing Skill

## Why

CLI tools in TypeScript projects often require testing across multiple environments (monorepos, different package managers, cross-platform compatibility). Currently, there's no automated way for Claude Code to generate and execute comprehensive CLI test scenarios, leading to manual testing or incomplete coverage.

This skill will enable Claude to automatically generate, execute, and validate CLI tool behavior across different environments using the universal executor pattern from playwright-skill.

## What Changes

- **ADD** new CLI testing capability to typescript-tools plugin
- **ADD** skill file: `plugins/typescript-tools/skills/cli-testing/SKILL.md`
- **ADD** universal executor pattern implementation for CLI testing
- **ADD** support for multiple testing scenarios:
  - Monorepo environments (Nx, Turborepo, pnpm workspaces)
  - Package manager variations (npm, pnpm, yarn)
  - Cross-platform compatibility (macOS, Linux, Windows)
- **ADD** test result parsing and validation
- **ADD** examples and documentation

## Impact

- **Affected specs:** New capability `cli-testing` in typescript-tools
- **Affected code:**
  - `plugins/typescript-tools/skills/cli-testing/SKILL.md` (new)
  - `plugins/typescript-tools/skills/cli-testing/API_REFERENCE.md` (new, for advanced scenarios)
  - `.claude-plugin/marketplace.json` (update to reference new skill)
- **Dependencies:**
  - Requires Node.js and npm/pnpm/yarn installed
  - Optional: monorepo tools (Nx, Turborepo) for relevant scenarios
- **Users:** Developers building CLI tools for TypeScript projects
- **Benefits:**
  - Automated CLI testing across environments
  - Reduced manual testing effort
  - Better coverage for edge cases
  - Consistent test patterns using universal executor
