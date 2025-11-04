# Proposal: Add Components Plugin

## Why

Frontend developers need consistent, accessible UI component generation with modern tooling (Base UI, Storybook, Vitest). Manual scaffolding leads to inconsistent patterns, missing tests, and accessibility issues. A dedicated components plugin provides battle-tested patterns for component development.

## What Changes

Add `plugins/components/` with three Tier 1 skills:

1. **component-generator** - Generate Base UI components with tests
   - Three-file structure (component.tsx, component.stories.tsx, index.ts)
   - Base UI primitives from @base-ui-components/react
   - Explicit exports (no barrel exports)
   - WCAG AAA accessibility patterns
   - Inline Vitest tests in stories files

2. **design-system-orchestrator** - Design system management
   - Tailwind + Base UI theming
   - Design token management
   - WCAG AAA validation
   - Ripple effect analysis for theme changes

3. **radix-to-baseui-migrator** - Migration support
   - Understand existing Radix UI patterns
   - Suggest Base UI alternatives
   - Provide migration paths

## Impact

**Affected specs:**

- `specs/components/` - New plugin capability

**Affected code:**

- `plugins/components/` - New plugin directory
- `plugins/components/skills/component-generator/SKILL.md`
- `plugins/components/skills/design-system-orchestrator/SKILL.md`
- `plugins/components/skills/radix-to-baseui-migrator/SKILL.md`
- `.claude-plugin/marketplace.json` - Add components plugin

**Related docs:**

- `supporting/rationale.md` - Tier 1 priority, skill details, design philosophy
- `README.md` - Installation examples
