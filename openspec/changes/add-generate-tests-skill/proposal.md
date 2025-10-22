# Add Generate Tests Skill

## Why

TypeScript projects need comprehensive test coverage, but writing Vitest tests with proper mocking is time-consuming and error-prone. Developers often skip tests or write incomplete coverage, reducing code quality.

This skill will enable Claude to automatically generate Vitest tests with proper mocking, setup, and assertions based on source code analysis.

## What Changes

- **ADD** new test generation capability to typescript-tools plugin
- **ADD** skill file: `plugins/typescript-tools/skills/generate-tests/SKILL.md`
- **ADD** Vitest test generation with mocking
- **ADD** source code analysis for test scenarios
- **ADD** mock generation for dependencies
- **ADD** assertion pattern generation
- **ADD** examples and documentation

## Impact

- **Affected specs:** New capability `test-generation` in typescript-tools
- **Affected code:**
  - `plugins/typescript-tools/skills/generate-tests/SKILL.md` (new)
  - `.claude-plugin/marketplace.json` (update)
- **Dependencies:**
  - Requires Vitest
  - Requires TypeScript
- **Benefits:**
  - Faster test creation
  - Consistent test patterns
  - Better coverage
  - Proper mocking strategies
