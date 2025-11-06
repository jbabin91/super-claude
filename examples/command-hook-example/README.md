# Command Hook Example

A minimal command hook demonstrating validation patterns and best practices.

## What This Example Shows

- ✅ TypeScript implementation with Bun runtime
- ✅ Stdin parsing for hook input
- ✅ Exit codes (0 = approve, 1 = block)
- ✅ Clear error messaging
- ✅ Performance optimization (<50ms target)

## When to Use This Example

- Creating validation or checking hooks
- Need deterministic pass/fail logic
- Want offline, zero-token execution
- Performance-critical operations (<50ms)

## File Structure

```txt
command-hook-example/
├── README.md          # This file
└── hook.ts            # Complete hook implementation
```

## Hook Type: Command vs Prompt

This is a **command hook** (ADR-0010):

| Feature     | Command Hook (This Example) | Prompt Hook            |
| ----------- | --------------------------- | ---------------------- |
| Execution   | Local script                | LLM (Haiku) evaluation |
| Performance | <50ms                       | 200-1000ms             |
| Token Cost  | 0                           | 200-500                |
| Offline     | ✅ Yes                      | ❌ No                  |
| Use Case    | Deterministic checks        | Semantic analysis      |

**Use command hooks by default.** Only use prompt hooks when context-aware evaluation is essential.

## How to Use

### 1. Copy to Your Plugin

```sh
# Copy to your plugin's hooks directory
cp examples/command-hook-example/hook.ts plugins/your-plugin/hooks/your-hook-name.ts

# Make executable
chmod +x plugins/your-plugin/hooks/your-hook-name.ts
```

### 2. Configure Hook

Create hook configuration in your plugin's `plugin.json`:

```json
{
  "hooks": {
    "your-hook-name": {
      "event": "PreToolUse",
      "type": "command",
      "command": "bun run plugins/your-plugin/hooks/your-hook-name.ts",
      "timeout": 5000
    }
  }
}
```

### 3. Customize Logic

Edit the hook script to implement your validation:

```typescript
async function validate(input: HookInput): Promise<HookResult> {
  // Your validation logic here

  if (/* check failed */) {
    return {
      decision: 'block',
      reason: 'Why it was blocked',
      systemMessage: 'Message shown to user'
    };
  }

  return {
    decision: 'approve',
    reason: 'Check passed'
  };
}
```

### 4. Test Locally

```sh
# Create test input
echo '{"tool": "Edit", "arguments": {...}}' > test-input.json

# Run hook
bun run plugins/your-plugin/hooks/your-hook-name.ts < test-input.json

# Check exit code
echo $?  # 0 = approve, 1 = block
```

## Hook Events

Choose the appropriate event for your hook:

| Event              | When It Runs               | Use For                     |
| ------------------ | -------------------------- | --------------------------- |
| `SessionStart`     | At start of conversation   | Setup, display info         |
| `PreToolUse`       | Before tool execution      | Validation, pre-checks      |
| `PostToolUse`      | After tool execution       | Verification, notifications |
| `UserPromptSubmit` | After user submits message | Auto-activation, routing    |
| `Stop`             | Before response ends       | Final checks, cleanup       |

## Input/Output Format

### Input (via stdin)

```json
{
  "tool": "Edit",
  "arguments": {
    "file_path": "/path/to/file.ts",
    "old_string": "...",
    "new_string": "..."
  }
}
```

### Output (exit code + stdout)

**Approve:**

```json
{
  "decision": "approve",
  "reason": "Validation passed"
}
```

Exit code: 0

**Block:**

```json
{
  "decision": "block",
  "reason": "Internal reason for blocking",
  "systemMessage": "User-friendly message displayed in Claude Code"
}
```

Exit code: 1

## Performance Targets

Command hooks should be fast:

- ✅ **Target:** <50ms execution time
- ⚠️ **Warning:** 50-100ms (consider optimization)
- ❌ **Problem:** >100ms (too slow, impacts UX)

### Optimization Tips

```typescript
// ✅ Good: Fast checks first
if (simpleCheck()) return approve();
if (expensiveCheck()) return approve();

// ❌ Bad: Expensive checks always run
const result1 = expensiveCheck();
const result2 = anotherExpensiveCheck();
if (result1 && result2) return approve();
```

## Common Use Cases

### File Validation

```typescript
// Check file exists before reading
if (!existsSync(filePath)) {
  return block('File not found');
}
```

### Pattern Matching

```typescript
// Check for problematic patterns
if (/console\.log/i.test(content)) {
  return warn('Consider using proper logging');
}
```

### Build Verification

```typescript
// Run type check before committing
const result = await runTypeCheck();
if (result.exitCode !== 0) {
  return block('TypeScript errors found');
}
```

## Error Handling

Always handle errors gracefully:

```typescript
try {
  const result = await validate(input);
  process.exit(result.decision === 'approve' ? 0 : 1);
} catch (error) {
  console.error('Hook error:', error.message);
  // Fail open (don't block on hook errors)
  process.exit(0);
}
```

**Philosophy:** Hooks should enhance the workflow, not break it. Fail open on errors.

## Testing Your Hook

### 1. Unit Tests

```typescript
// hook.test.ts
import { describe, it, expect } from 'vitest';
import { validate } from './hook';

describe('MyHook', () => {
  it('approves valid input', async () => {
    const result = await validate({
      tool: 'Edit',
      arguments: {
        /* valid args */
      },
    });
    expect(result.decision).toBe('approve');
  });

  it('blocks invalid input', async () => {
    const result = await validate({
      tool: 'Edit',
      arguments: {
        /* invalid args */
      },
    });
    expect(result.decision).toBe('block');
  });
});
```

### 2. Integration Tests

```sh
# Test with real input
echo '{"tool": "Edit", ...}' | bun run plugins/your-plugin/hooks/your-hook.ts

# Verify exit code
if [ $? -eq 0 ]; then
  echo "✅ Approved"
else
  echo "❌ Blocked"
fi
```

### 3. Performance Tests

```sh
# Measure execution time
time bun run plugins/your-plugin/hooks/your-hook.ts < test-input.json

# Should be <50ms for good UX
```

## Common Pitfalls

### ❌ Blocking Too Aggressively

```typescript
// Bad: Blocks on warnings
if (hasAnyIssue) return block('Issues found');
```

### ✅ Appropriate Blocking

```typescript
// Good: Blocks only on critical issues
if (hasCriticalIssue) return block('Critical issue');
if (hasWarning) return warn('Consider fixing');
return approve();
```

### ❌ Slow Execution

```typescript
// Bad: Synchronous, blocking operations
const files = readdirSync('./').map((f) => readFileSync(f));
```

### ✅ Fast Execution

```typescript
// Good: Early returns, lazy evaluation
if (quickCheck()) return approve();
if (needsDeepCheck && deepCheck()) return approve();
```

### ❌ Poor Error Messages

```typescript
return block('Error'); // What error?
```

### ✅ Clear Error Messages

```typescript
return block(
  'TypeScript compilation failed',
  'Please fix type errors before continuing. Run `bun run typecheck` for details.',
);
```

## Related Documentation

- [ADR-0010: Hook Type Selection](../../docs/architecture/decisions/ADR-0010-hook-type-selection.md)
- [ADR-0008: No Auto-Formatting Hooks](../../docs/architecture/decisions/ADR-0008-no-auto-formatting-hooks.md)
- [Command Hooks Guide](../../docs/guides/command-hooks.md) (coming soon)

## Next Steps

After mastering this example:

1. Review [prompt-hook-example](../prompt-hook-example/) for LLM-based evaluation
2. Check existing hooks in `plugins/*/hooks/` for real-world patterns
3. Read ADR-0010 for guidance on choosing hook types
