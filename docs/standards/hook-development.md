# Hook Development Standards

Code quality and development patterns for Claude Code hooks in super-claude.

## Shared Utilities

All hooks should use shared utilities from `plugins/workflow/hooks/utils/`:

### Core Utilities

```typescript
import {
  parseStdin,
  checkPerformance,
  formatError,
  createLogger,
  type HookInput,
} from './utils/index.js';
```

| Utility            | Purpose                                    | Usage                                         |
| ------------------ | ------------------------------------------ | --------------------------------------------- |
| `parseStdin()`     | Parse JSON input from stdin                | `const input = await parseStdin();`           |
| `checkPerformance` | Log warning if execution exceeds threshold | `checkPerformance(startTime, 50, 'hook');`    |
| `formatError`      | Format errors consistently                 | `console.error(formatError(error, 'hook'));`  |
| `createLogger`     | Create structured logger for hook          | `const log = createLogger('hook-name');`      |
| `HookInput`        | Type for parsed hook input                 | `const input: HookInput = await parseStdin()` |

### parseStdin

Parses JSON from stdin with validation:

```typescript
const input = await parseStdin();
// Returns: { cwd, tool_name?, tool_input?, transcript_path?, ... }
```

### checkPerformance

Logs a warning if execution exceeds threshold:

```typescript
const startTime = Date.now();
// ... hook logic ...
checkPerformance(startTime, 50, 'my-hook');
// Logs: [WARNING] Slow my-hook hook: 75ms (target: 50ms)
```

### formatError

Formats errors consistently for stderr:

```typescript
try {
  // ... hook logic ...
} catch (error) {
  console.error(formatError(error, 'my-hook'));
  process.exit(0); // Don't fail session on hook error
}
```

### createLogger

Creates a structured logger with consistent formatting:

```typescript
const log = createLogger('my-hook');

log.debug('Starting validation'); // [DEBUG] my-hook: Starting validation
log.info('Processing file'); // [INFO] my-hook: Processing file
log.warn('File not found, skipping'); // [WARNING] my-hook: File not found, skipping
log.error('Failed to parse input'); // [ERROR] my-hook: Failed to parse input
```

**Important:** All logger output goes to stderr to keep stdout clean for hook responses.

## Hook Template

Use this template for new hooks:

```typescript
#!/usr/bin/env bun

/**
 * Hook Name
 *
 * Brief description of what this hook does.
 *
 * Runtime: Bun (native TypeScript support)
 * Execution: Triggered on [event]
 * Performance Target: <50ms
 */

import {
  checkPerformance,
  createLogger,
  formatError,
  parseStdin,
} from './utils/index.js';

const log = createLogger('hook-name');

async function main(): Promise<void> {
  const startTime = Date.now();

  try {
    const input = await parseStdin();

    // Early exit if hook doesn't apply
    if (input.tool_name !== 'Edit') {
      process.exit(0);
    }

    log.debug('Processing request');

    // Hook logic here...

    checkPerformance(startTime, 50, 'hook-name');
    process.exit(0);
  } catch (error) {
    console.error(formatError(error, 'hook-name'));
    process.exit(0); // Don't fail session on hook error
  }
}

await main();
```

## Code Quality Patterns

### No Duplication

**Principle:** Extract shared logic to utilities. Don't duplicate code across hooks.

**Anti-pattern:**

```typescript
// hook-a.ts
const PRIORITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 };

// hook-b.ts
const PRIORITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 }; // Duplicated!
```

**Correct pattern:**

```typescript
// utils/priority.ts
export const PRIORITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 };

// hook-a.ts and hook-b.ts
import { PRIORITY_ORDER } from './utils/priority.js';
```

### Use Established Libraries

**Principle:** Prefer well-tested libraries over custom implementations.

**Anti-pattern:**

```typescript
// Custom YAML parser - error-prone, unmaintained
function parseYaml(content: string): unknown {
  const result: Record<string, string> = {};
  for (const line of content.split('\n')) {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length) {
      result[key.trim()] = valueParts.join(':').trim();
    }
  }
  return result;
}
```

**Correct pattern:**

```typescript
import yaml from 'js-yaml';

function parseYaml(content: string): unknown {
  const result = yaml.load(content);
  if (result === null || result === undefined) {
    throw new Error('Empty or invalid YAML document');
  }
  return result;
}
```

### Use Shared Performance Monitoring

**Principle:** Always use `checkPerformance()` instead of inline timing checks.

**Anti-pattern:**

```typescript
const duration = Date.now() - startTime;
if (duration > 50) {
  console.warn('[WARNING] Slow hook: ' + duration + 'ms');
}
```

**Correct pattern:**

```typescript
import { checkPerformance } from './utils/index.js';

checkPerformance(startTime, 50, 'hook-name');
```

### Use Structured Logging

**Principle:** Use `createLogger()` for consistent log formatting.

**Anti-pattern:**

```typescript
console.error('[DEBUG] hook-name: Starting...');
console.error('[WARNING] hook-name: File not found');
console.error('[ERROR] hook-name: Failed');
```

**Correct pattern:**

```typescript
const log = createLogger('hook-name');
log.debug('Starting...');
log.warn('File not found');
log.error('Failed');
```

### Schema Validation

**Principle:** Use ArkType for runtime validation of complex data structures.

```typescript
import { type } from 'arktype';

const configSchema = type({
  version: 'string',
  enabled: 'boolean',
  'options?': {
    threshold: 'number',
  },
});

function validateConfig(data: unknown) {
  const result = configSchema(data);
  if ('summary' in result) {
    throw new Error(`Invalid config: ${result.summary}`);
  }
  return result;
}
```

## Logging Conventions

### Log Levels

| Level   | Use For                             | Example                             |
| ------- | ----------------------------------- | ----------------------------------- |
| DEBUG   | Development/troubleshooting details | `log.debug('Checking branch name')` |
| INFO    | Normal operation milestones         | `log.info('Hook enabled')`          |
| WARNING | Recoverable issues, skip conditions | `log.warn('File not found')`        |
| ERROR   | Failures that affect hook behavior  | `log.error('Failed to parse')`      |

### Stdout vs Stderr

- **stdout** - Hook responses that Claude should see (context injection, formatted output)
- **stderr** - All logging (debug, info, warn, error) - never reaches Claude

```typescript
// Goes to Claude as context
console.log('Branch: main, Status: clean');

// Goes to terminal for debugging only
log.info('Processed git status');
```

## Error Handling

### Don't Fail Sessions

Hooks should exit 0 on internal errors to avoid blocking user workflows:

```typescript
try {
  // Hook logic
} catch (error) {
  console.error(formatError(error, 'hook-name'));
  process.exit(0); // Allow session to continue
}
```

### Exit Codes

| Code | Meaning                 | Use For                           |
| ---- | ----------------------- | --------------------------------- |
| 0    | Success / Allow         | Normal completion, errors handled |
| 2    | Block (PreToolUse only) | Prevent tool execution            |

### Graceful Degradation

When optional features fail, continue without them:

```typescript
let gitStatus = { branch: 'unknown', clean: true };
try {
  gitStatus = getGitStatus(cwd);
} catch {
  log.warn('Could not get git status, using defaults');
}
// Continue with default gitStatus...
```

## Testing Hooks

### Manual Testing

```bash
# Test with minimal input
echo '{"cwd":"'$(pwd)'"}' | bun plugins/workflow/hooks/my-hook.ts

# Test PreToolUse hook
cat <<EOF | bun plugins/workflow/hooks/my-hook.ts
{
  "cwd": "$(pwd)",
  "tool_name": "Edit",
  "tool_input": { "file_path": "src/test.ts" }
}
EOF

# Check exit code
echo $?
```

### Performance Testing

```bash
# Time execution
time (echo '{"cwd":"'$(pwd)'"}' | bun plugins/workflow/hooks/my-hook.ts)

# Check for performance warnings in stderr
echo '{"cwd":"'$(pwd)'"}' | bun plugins/workflow/hooks/my-hook.ts 2>&1 | grep WARNING
```

## Related Documentation

- [Hook Performance Guide](../guides/hooks/performance-guide.md) - Optimization strategies
- [Hook Anti-Patterns](../guides/hooks/anti-patterns.md) - What to avoid
- [Hooks README](../guides/hooks/README.md) - Complete hook reference
