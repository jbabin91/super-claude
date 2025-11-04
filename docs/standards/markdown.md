# Markdown Standards

This document describes the markdown formatting standards for the super-claude project.

We use [markdownlint-cli2](https://github.com/DavidAnson/markdownlint-cli2) with a lenient configuration that focuses on critical issues while allowing flexibility for content organization.

**Philosophy:** The linter catches critical formatting issues (code fences, list indentation), but we follow additional best practices documented here for consistency and readability.

## Quick Start

```bash
# Lint all markdown files
bun run lint:md

# Auto-fix fixable issues
bun run lint:md:fix
```

## Core Rules

### MD040: Code Fences Must Have Language Identifiers

**Rule:** All code blocks must specify a language identifier.

**Why:** Enables syntax highlighting, makes content machine-readable, improves accessibility.

**Wrong:**

````markdown
```
code here
```
````

**Right:**

````markdown
```sh
code here
```

```txt
text content
```

```yaml
yaml: content
```
````

**Common mistake:**

````markdown
```
npm install
git commit -m "message"
```
````

**Fixed:**

````markdown
```bash
npm install
git commit -m "message"
```
````

### MD032: Blank Line Required Before Lists

**Rule:** Lists must be preceded by a blank line.

**Why:** Improves readability, prevents parsing ambiguity.

**Wrong:**

```markdown
Ask the user:

- **Purpose**: What does this do?
- **Category**: What type of skill?
```

**Right:**

```markdown
Ask the user:

- **Purpose**: What does this do?
- **Category**: What type of skill?
```

**Wrong:**

```markdown
The skill should:

1. Validate parameters
2. Generate code
3. Test output
```

**Right:**

```markdown
The skill should:

1. Validate parameters
2. Generate code
3. Test output
```

### MD022/MD023: Blank Lines Around Headings

**Rule:** Headings must have blank lines before and after them.

**Why:** Improves visual hierarchy, consistent spacing.

**Wrong:**

```markdown
### Model Selection Guide

### Haiku (Fast & Cheap)

- Simple tasks
- Quick responses
```

**Right:**

```markdown
### Model Selection Guide

### Haiku (Fast & Cheap)

- Simple tasks
- Quick responses
```

**Wrong:**

```markdown
Some paragraph text.

## Next Section

More content here.
```

**Right:**

```markdown
Some paragraph text.

## Next Section

More content here.
```

### Blank Line Before Nested Content

**Rule:** Nested content (lists, code blocks, blockquotes) inside bold/emphasis needs blank lines.

**Why:** Prevents parsing errors, improves readability.

**Wrong:**

```markdown
**Solution**:

- Check syntax
- Verify formatting
```

**Right:**

```markdown
**Solution**:

- Check syntax
- Verify formatting
```

**Wrong:**

````markdown
**Example**:

```js
console.log('hello');
```
````

**Right:**

````markdown
**Example**:

```js
console.log('hello');
```
````

## Language Identifiers

### Common Identifiers

| Identifier           | Use For                                               |
| -------------------- | ----------------------------------------------------- |
| `sh`                 | Terminal commands, CLI examples, shell scripts        |
| `bash`               | Bash-specific scripts (prefer `sh` for general usage) |
| `txt`                | Plain text, output, logs, generic content             |
| `yaml`               | YAML configuration files                              |
| `json`               | JSON data and configuration                           |
| `markdown`           | Markdown examples and syntax                          |
| `typescript` or `ts` | TypeScript code                                       |
| `javascript` or `js` | JavaScript code                                       |
| `jsx`                | React JavaScript components                           |
| `tsx`                | React TypeScript components                           |

### Directory Structures

**Use `sh` for directory trees:**

````markdown
```sh
src/
├── components/
│   ├── ui/
│   │   └── button/
│   └── layout/
└── utils/
```
````

**Not `txt` (unless it's just plain text):**

````markdown
```txt
This is plain text output from a command.
Not a directory structure.
```
````

### Terminal Commands

**Use `sh` for terminal examples:**

````markdown
```sh
bun install
bun run build
git commit -m "feat: add feature"
```
````

**Use `bash` only for bash-specific syntax:**

````markdown
```bash
# Bash-specific features
for i in {1..5}; do
  echo "Number: $i"
done
```
````

### When Unsure

**Rule of thumb:** Use `txt` when you're unsure, but prefer specific identifiers when possible.

````markdown
```txt
Generic output or content that doesn't fit other categories.
```
````

## Additional Rules

### MD001: Heading Levels

**Rule:** Heading levels should increment by one level at a time.

**Wrong:**

```markdown
# Main Title

### Subsection (skips h2)
```

**Right:**

```markdown
# Main Title

## Section

### Subsection
```

### MD003: Heading Style

**Rule:** Use ATX-style headings (`#`) consistently.

**Preferred:**

```markdown
# Heading 1

## Heading 2

### Heading 3
```

**Avoid:**

```markdown
# Heading 1

## Heading 2
```

### MD009: No Trailing Spaces

**Rule:** Remove trailing spaces from lines.

**Configuration:** We allow 2 trailing spaces for hard line breaks.

### MD012: No Multiple Blank Lines

**Rule:** Use single blank lines only.

**Wrong:**

```markdown
Some content.

More content.
```

**Right:**

```markdown
Some content.

More content.
```

### MD013: Line Length

**Rule:** Lines should be <= 120 characters (relaxed from default 80).

**Why:** Balance readability with modern wide displays.

**Configuration:**

```json
{
  "MD013": {
    "line_length": 120,
    "code_blocks": false,
    "tables": false
  }
}
```

### MD025: Single H1 per Document

**Rule:** Only one h1 (`#`) heading per file.

**Wrong:**

```markdown
# Introduction

Some content.

# Another Top-Level Heading
```

**Right:**

```markdown
# Document Title

## Introduction

## Another Section
```

### MD033: No Inline HTML

**Rule:** Avoid inline HTML in markdown (with exceptions).

**Generally avoid:**

```markdown
<div class="warning">
  This is a warning
</div>
```

**Prefer markdown:**

```markdown
> **Warning:** This is a warning
```

**Exceptions allowed:**

- `<details>` / `<summary>` for collapsible sections
- `<kbd>` for keyboard shortcuts
- Tables when markdown tables are insufficient

## Project-Specific Patterns

### YAML Frontmatter

Skills and ADRs use YAML frontmatter:

```markdown
---
name: skill-identifier
version: 1.0.0
description: |
  Multi-line description
  with proper indentation
category: workflow-automation
tags: [tag1, tag2]
---

# Skill Name

Content starts here.
```

### Code Blocks in Lists

**Indent code blocks within lists:**

````markdown
1. First step

   ```sh
   npm install
   ```

2. Second step

   ```sh
   pnpm build
   ```
````

### Nested Lists

**Use consistent indentation (2 spaces):**

```markdown
- Top level
  - Second level
    - Third level
  - Back to second

1. Ordered top
   1. Ordered second
   2. Another second
2. Back to top
```

### Links

**Prefer reference-style for repeated links:**

```markdown
See [OpenSpec workflow][openspec] and [git workflow][git] for details.

[openspec]: workflows/openspec.md
[git]: workflows/git.md
```

**Inline for unique links:**

```markdown
See the [Base UI docs](https://base-ui.com/) for more info.
```

### Tables

**Align columns for readability:**

```markdown
| Type | Gitmoji     | Description   |
| ---- | ----------- | ------------- |
| feat | ✨ sparkles | New features  |
| fix  | 🐛 bug      | Bug fixes     |
| docs | 📝 memo     | Documentation |
```

## Common Mistakes

### 1. Code blocks without language

**Error:**

````markdown
```
npm install
```
````

**Fix:**

````markdown
```sh
npm install
```
````

### 2. Missing blank lines before lists

**Error:**

```markdown
Install these plugins:

- meta
- design-system
```

**Fix:**

```markdown
Install these plugins:

- meta
- design-system
```

### 3. Heading level jumps

**Error:**

```markdown
# Main Title

### Subsection
```

**Fix:**

```markdown
# Main Title

## Section

### Subsection
```

### 4. Trailing spaces

**Error:**

```markdown
Some text.␣␣
Next line.
```

**Fix:**

```markdown
Some text.
Next line.
```

(Unless intentional hard break)

### 5. Multiple blank lines

**Error:**

```markdown
Some content.

More content.
```

**Fix:**

```markdown
Some content.

More content.
```

## Linting Configuration

Our `.markdownlint-cli2.mjs` configuration:

```javascript
export default {
  config: {
    default: true,
    MD001: false, // Heading levels (flexible)
    MD007: { indent: 2 }, // List indentation
    MD012: false, // Multiple blank lines (flexible)
    MD013: false, // Line length (no limit)
    MD024: false, // Duplicate headings (flexible)
    MD025: false, // Multiple h1 (flexible)
    MD033: false, // Inline HTML (allowed)
    MD041: false, // First line h1 (flexible)
    MD046: { style: 'fenced' }, // Use fenced code blocks
  },
  globs: ['**/*.{md,mdx}'],
  gitignore: true,
};
```

**Philosophy:** We use a lenient configuration focused on critical issues (code fences, list formatting) while allowing flexibility for content organization.

## Tools and Commands

### Lint All Files

```sh
bun run lint:md
```

Runs markdownlint-cli2 on all markdown files.

### Auto-fix Issues

```sh
bun run lint:md:fix
```

Automatically fixes issues like:

- Adding blank lines before lists
- Adding blank lines around headings
- Removing trailing spaces
- Fixing heading styles

**Note:** Some issues require manual fixing (like adding language identifiers to code blocks).

### Lint Specific Files

```sh
bunx markdownlint-cli2 "docs/**/*.md"
bunx markdownlint-cli2 "CLAUDE.md" "README.md"
```

### VS Code Integration

Install the [markdownlint extension](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint):

```sh
code --install-extension DavidAnson.vscode-markdownlint
```

**Note:** The extension will automatically detect and use `.markdownlint-cli2.mjs` configuration.

**Optional VS Code settings for auto-fix:**

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.markdownlint": true
  }
}
```

## Pre-commit Hooks

Consider adding markdown linting to pre-commit:

```yaml
# lefthook.yml (example)
pre-commit:
  commands:
    markdown-lint:
      glob: '*.md'
      run: bunx markdownlint-cli2 {staged_files}
```

## Best Practices

### DO ✅

- Always specify language identifiers for code blocks
- Add blank lines before lists
- Add blank lines around headings
- Use ATX-style headings (`#`)
- Keep lines under 120 characters
- Use reference-style links for repeated URLs
- Align table columns for readability
- Run `bun run lint:md` before committing

### DON'T ❌

- Use code blocks without language identifiers
- Skip blank lines before lists
- Skip blank lines around headings
- Mix heading styles
- Use excessive blank lines
- Use inline HTML when markdown works
- Commit without linting

## Examples

### Good Markdown Structure

````markdown
# Document Title

Brief introduction paragraph.

## Section 1

Content for section 1.

### Subsection 1.1

More specific content.

**Key points:**

- Point 1
- Point 2
- Point 3

**Example:**

```typescript
const example = 'value';
```

## Section 2

Another section with proper structure.

### Subsection 2.1

Terminal commands:

```sh
bun install
bun build
```

## Related Documentation

- [Link 1](path/to/doc1.md)
- [Link 2](path/to/doc2.md)
````

## Related Documentation

- [Commit Conventions](../workflows/commits.md) - Commit message formatting
- [Git Workflow](../workflows/git.md) - Branching and pull requests
- [Development Commands](../workflows/development.md) - Common development tasks
- [markdownlint Rules](https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md) - Full rule reference
- [CommonMark Spec](https://spec.commonmark.org/) - Markdown specification

## Quick Reference

```txt
┌────────────────────────────────────────────────────┐
│ Essential Rules                                    │
├────────────────────────────────────────────────────┤
│ ✅ Code blocks MUST have language identifier      │
│ ✅ Blank line BEFORE lists                        │
│ ✅ Blank lines AROUND headings                    │
│ ✅ Increment heading levels by one                │
│ ✅ Lines <= 120 characters                        │
│ ✅ Single h1 per document                         │
├────────────────────────────────────────────────────┤
│ Language Identifiers                               │
├────────────────────────────────────────────────────┤
│ sh         - Terminal, CLI, directory trees        │
│ txt        - Plain text, when unsure               │
│ yaml       - YAML files                            │
│ json       - JSON data                             │
│ typescript - TypeScript code                       │
│ markdown   - Markdown examples                     │
├────────────────────────────────────────────────────┤
│ Commands                                           │
├────────────────────────────────────────────────────┤
│ bun run lint:md     - Lint all markdown files      │
│ bun run lint:md:fix - Auto-fix issues              │
└────────────────────────────────────────────────────┘
```
