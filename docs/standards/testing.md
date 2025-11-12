# Testing Standards

Testing philosophy, file structure conventions, and component testing patterns.

## Testing Philosophy

**Core Principle:** Testing first, but Storybook IS test infrastructure for components.

### When Storybook = Tests

For **UI components**, Storybook stories serve dual purpose:

1. **Visual documentation** - Component examples and variants
2. **Functional tests** - Embedded Vitest tests in stories

**Why:** Component library projects benefit from living documentation + test infrastructure combined.

### When Separate Tests

For **domain logic**, use separate test files:

- Functions and utilities
- Business logic
- API endpoints
- Hooks and composables

**Why:** Business logic tests stay focused, no UI dependencies.

## Component Testing

### Stories-Based Testing

**Pattern:** Tests live IN `.stories.tsx` files (not separate test files)

**Structure:**

```tsx
// button.stories.tsx
import { Button } from './button';
import { expect, test } from 'vitest';

export default {
  component: Button,
  title: 'Components/Button',
};

export const Primary = {
  args: {
    variant: 'primary',
    children: 'Click me',
  },
};

// Embedded tests
if (import.meta.vitest) {
  test('Button renders with correct variant', () => {
    const { container } = render(<Button variant="primary">Click me</Button>);
    expect(container.querySelector('[data-variant="primary"]')).toBeTruthy();
  });

  test('Button meets WCAG AAA standards', async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
}
```

### Key Requirements

- **Storybook + Vitest integration** - Stories include embedded tests
- **WCAG AAA accessibility validation** - Automated accessibility checks
- **Visual + functional testing** - Stories serve dual purpose
- **No separate .test.tsx files** - Tests embedded in stories

### Accessibility Testing

**ALWAYS include WCAG AAA checks:**

```tsx
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

test('meets WCAG AAA standards', async () => {
  const { container } = render(<Component />);
  const results = await axe(container, {
    rules: {
      // WCAG AAA rules
      'color-contrast': { enabled: true },
    },
  });
  expect(results).toHaveNoViolations();
});
```

## Domain Logic Testing

### Separate Test Files

**Pattern:** Functions/utilities get `.test.ts` files

**Structure:**

```txt
src/utils/formatters/
├── currency.ts       # Implementation
└── currency.test.ts  # Vitest unit tests
```

**Example:**

```typescript
// currency.test.ts
import { describe, test, expect } from 'vitest';
import { formatCurrency } from './currency';

describe('formatCurrency', () => {
  test('formats USD correctly', () => {
    expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56');
  });

  test('handles zero', () => {
    expect(formatCurrency(0, 'USD')).toBe('$0.00');
  });
});
```

## File Structure Standards

### UI Components (with Storybook)

```txt
src/components/ui/button/
├── button.tsx           # Component implementation
├── button.stories.tsx   # Storybook + Vitest tests combined
└── index.ts             # Explicit exports only
```

### Domain Logic

```txt
src/utils/formatters/
├── currency.ts       # Implementation
└── currency.test.ts  # Separate test file
```

### Hooks

```txt
src/hooks/
├── use-local-storage.ts       # Implementation
└── use-local-storage.test.ts  # React Testing Library tests
```

### API Endpoints

```txt
src/api/routes/
├── users.ts       # Route implementation
└── users.test.ts  # Integration tests
```

## File Generation Rules

| Type             | Files to Generate                    | Testing Approach                              |
| ---------------- | ------------------------------------ | --------------------------------------------- |
| UI Component     | `.tsx` + `.stories.tsx` + `index.ts` | Stories with embedded Vitest tests            |
| Function/Utility | `.ts` + `.test.ts`                   | Separate Vitest test file                     |
| Hook             | `.ts` + `.test.ts`                   | Separate test file with React Testing Library |
| API Endpoint     | `.ts` + `.test.ts`                   | Separate integration test file                |

## Code Organization

### Explicit Exports (No Barrel Exports)

**Good:**

```typescript
// index.ts
export { Button } from './button';
export type { ButtonProps } from './button';
```

**Bad:**

```typescript
// index.ts
export * from './button'; // ❌ Bad for tree-shaking
```

**Why:** Better tree-shaking, clearer dependencies, easier to track usage.

### File Structure

```txt
src/components/ui/button/
├── button.tsx              # Component implementation
├── button.stories.tsx      # Stories + tests
└── index.ts                # Explicit exports
```

## Testing Priority

1. **Unit tests** - Functions, utilities, pure logic
2. **Integration tests** - Component interaction, API calls
3. **E2E tests** - Critical user flows (Playwright)

**Prefer:**

- Pure functions (easier to test)
- Composition over inheritance
- Small, focused components
- Clear dependencies

## Base UI vs Radix UI

### New Components

**ALWAYS use Base UI:**

```tsx
// ✅ Good - Base UI
import { Dialog } from '@base-ui-components/react';

// ❌ Bad - Radix UI
import * as Dialog from '@radix-ui/react-dialog';
```

**Installation:**

```bash
# Single package (preferred)
pnpm add @base-ui-components/react

# NOT individual packages
```

### Existing Radix Code

**Understanding for migration:**

```tsx
// Understand this pattern (Radix UI)
import * as Dialog from '@radix-ui/react-dialog';

<Dialog.Root>
  <Dialog.Trigger />
  <Dialog.Content />
</Dialog.Root>;
```

**Suggest Base UI alternative:**

```tsx
// Suggest this instead (Base UI)
import { Dialog } from '@base-ui-components/react';

<Dialog.Root>
  <Dialog.Trigger />
  <Dialog.Content />
</Dialog.Root>;
```

**Migration support:**

- Use `radix-to-baseui-migrator` skill for automated migration
- Prefer single `@base-ui-components/react` package
- Provide Base UI alternatives when asked about Radix

## Rationale

### Why Stories = Tests for Components?

- **Living documentation** - Visual examples stay tested
- **Reduces duplication** - One file, dual purpose
- **Design system alignment** - Storybook is standard for component libraries
- **Faster feedback** - Visual + functional testing combined

### Why Separate Tests for Logic?

- **Focus** - Business logic tests stay focused
- **No UI dependencies** - Faster test execution
- **Clear separation** - Component vs domain concerns
- **Easier maintenance** - Logic tests don't need Storybook

### Why No Barrel Exports?

- **Tree-shaking** - Bundlers can eliminate unused code
- **Clear dependencies** - Explicit imports show what's used
- **Easier tracking** - Find all usages of an export
- **Better performance** - Smaller bundle sizes

## Running Tests

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test --watch

# Run specific test file
bun test button.test.ts

# Run with coverage
bun test --coverage
```

## Related Documentation

- **[Skill Development Guide](../guides/skill-development.md)** - RED-GREEN-REFACTOR methodology, skill format, patterns
- **[Plugin Structure Standards](plugin-structure.md)** - Naming conventions, directory organization
- **[Markdown Standards](markdown.md)** - Documentation formatting rules
- **[Skill Activation Guide](../guides/skill-activation.md)** - Auto-activation system
