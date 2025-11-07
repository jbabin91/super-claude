# Hook Performance Optimization Guide

Comprehensive guide to optimizing Claude Code hook performance for fast, efficient execution.

## Performance Targets

### By Hook Type

| Hook Type              | Target | Max | Rationale                        |
| ---------------------- | ------ | --- | -------------------------------- |
| SessionStart           | <100ms | 60s | User waiting for session         |
| UserPromptSubmit       | <50ms  | 60s | User waiting for response        |
| PreToolUse (simple)    | <50ms  | 60s | Frequent execution, user waiting |
| PreToolUse (typecheck) | <2s    | 60s | Incremental check acceptable     |
| PostToolUse            | <50ms  | 60s | User waiting for next action     |
| Stop                   | <100ms | 60s | User waiting for response end    |
| SessionEnd             | <60s   | 60s | Best-effort, session closing     |
| Notification           | <50ms  | 60s | Desktop notification delay       |
| PreCompact             | <500ms | 60s | Transcript processing pause      |

### Why These Targets?

**User-facing hooks (SessionStart, UserPromptSubmit, PreToolUse, PostToolUse):**

- User is actively waiting
- Fast feedback essential for flow state
- Target: <50-100ms for instant feel
- Max: 60s hard timeout from Claude Code

**Background hooks (SessionEnd, Notification, PreCompact):**

- User not directly waiting
- Can tolerate longer execution
- Still respect 60s timeout
- Best-effort completion acceptable

## Core Optimization Patterns

### Pattern 1: Early Exits

Exit immediately when hook doesn't apply to current context.

```typescript
async function main(): Promise<void> {
  const input = await parseStdin();

  // Exit if wrong tool
  if (input.tool_name !== 'Edit' && input.tool_name !== 'Write') {
    process.exit(0); // ~1ms
  }

  // Exit if wrong file type
  const filePath = input.tool_input?.file_path as string;
  if (!filePath?.endsWith('.ts') && !filePath?.endsWith('.tsx')) {
    process.exit(0); // ~1ms
  }

  // Continue with actual work...
}
```

**Impact:** Reduces median execution from 50ms to <5ms for non-applicable cases.

### Pattern 2: Incremental Operations

Use incremental tools instead of full project operations.

```typescript
// ❌ SLOW: Full project type check (5-30s)
execSync('tsc --noEmit', { cwd });

// ✅ FAST: Incremental file type check (<2s)
execSync(`bunx tsc-files --noEmit "${filePath}"`, { cwd });
```

**Impact:** 10-30x speedup for type checking.

**Incremental Tools:**

- TypeScript: `tsc-files` instead of `tsc`
- ESLint: `--cache` flag + specific file
- Prettier: `--cache` flag + specific file
- Tests: `--changed` or `--related` flags

### Pattern 3: Caching

Cache expensive lookups that don't change during session.

```typescript
// ❌ BAD: Reload config every time
function checkTypes(cwd: string, filePath: string) {
  const tsConfig = loadTsConfig(cwd); // 50-100ms each time
  return runTypeCheck(filePath, tsConfig);
}

// ✅ GOOD: Cache config per session
let cachedTsConfig: TsConfig | null = null;

function checkTypes(cwd: string, filePath: string) {
  if (!cachedTsConfig) {
    cachedTsConfig = loadTsConfig(cwd); // 50-100ms once
  }
  return runTypeCheck(filePath, cachedTsConfig);
}
```

**Impact:** 50-100ms saved per execution after first run.

**Cacheable Data:**

- Configuration files (tsconfig.json, .eslintrc, package.json)
- Git status (if checking multiple times)
- Project metadata (package name, version)
- File system structure (if traversing repeatedly)

**Cache Invalidation:**

```typescript
// Simple: Cache for hook execution only (cleared between runs)
let cache: Config | null = null;

// Advanced: Cache with TTL
const cache = new Map<string, { data: Config; expires: number }>();
```

### Pattern 4: Parallel Execution

Run independent operations concurrently.

```typescript
// ❌ SLOW: Sequential git commands (300ms)
const branch = getBranch(cwd); // 100ms
const status = getStatus(cwd); // 100ms
const commits = getRecentCommits(cwd); // 100ms

// ✅ FAST: Parallel git commands (100ms)
const [branch, status, commits] = await Promise.all([
  getBranch(cwd),
  getStatus(cwd),
  getRecentCommits(cwd),
]);
```

**Impact:** 3x speedup for independent operations.

**Good Candidates:**

- Multiple git commands
- File system operations
- Network requests
- Database queries

**Caution:** Don't parallelize operations with shared resources (files, stdout).

### Pattern 5: Lazy Loading

Load heavy dependencies only when needed.

```typescript
// ❌ BAD: Import everything upfront
import { TypeScriptAPI } from 'heavy-typescript-lib'; // 200ms import
import { ESLintAPI } from 'heavy-eslint-lib'; // 150ms import

async function main() {
  const input = await parseStdin();
  if (!isTypeScriptFile(input.file_path)) {
    process.exit(0); // Still paid 350ms import cost!
  }
  // Use TypeScriptAPI...
}

// ✅ GOOD: Dynamic import when needed
async function main() {
  const input = await parseStdin();
  if (!isTypeScriptFile(input.file_path)) {
    process.exit(0); // Fast exit, no import cost
  }

  // Only import when we know we need it
  const { TypeScriptAPI } = await import('heavy-typescript-lib');
  // Use TypeScriptAPI...
}
```

**Impact:** Eliminate import cost for non-applicable cases.

## Performance Monitoring

### Built-in Utility

```typescript
import { checkPerformance } from './utils/index.js';

async function main() {
  const startTime = Date.now();

  // Hook logic...

  checkPerformance(startTime, 50, 'hook-name');
  // Logs warning if > 50ms
}
```

### Custom Monitoring

```typescript
function measureOperation<T>(
  name: string,
  operation: () => T,
  warnThreshold = 50,
): T {
  const start = Date.now();
  const result = operation();
  const duration = Date.now() - start;

  if (duration > warnThreshold) {
    console.warn(
      `[PERF] ${name}: ${duration}ms (threshold: ${warnThreshold}ms)`,
    );
  }

  return result;
}

// Usage
const gitStatus = measureOperation('git-status', () => getGitStatus(cwd));
const typeCheck = measureOperation(
  'type-check',
  () => checkTypes(cwd, file),
  2000,
);
```

### Performance Profiling

```typescript
const timings: Record<string, number> = {};

function startTimer(label: string): void {
  timings[label] = Date.now();
}

function endTimer(label: string): number {
  const start = timings[label];
  if (!start) return 0;
  const duration = Date.now() - start;
  delete timings[label];
  return duration;
}

// Usage
startTimer('parse-input');
const input = await parseStdin();
console.log(`Parse input: ${endTimer('parse-input')}ms`);

startTimer('git-status');
const git = getGitStatus(input.cwd);
console.log(`Git status: ${endTimer('git-status')}ms`);
```

## Common Bottlenecks

### Bottleneck 1: Full Project Type Checking

**Symptom:** PreToolUse hook taking 5-30 seconds.

**Cause:**

```typescript
// Checks entire project
execSync('tsc --noEmit', { cwd });
```

**Fix:**

```typescript
// Check only modified file
execSync(`bunx tsc-files --noEmit "${filePath}"`, { cwd });
```

**Impact:** 10-30x speedup.

### Bottleneck 2: Synchronous File Operations

**Symptom:** Hook slow when dealing with many files.

**Cause:**

```typescript
const files = fs.readdirSync(dir);
files.forEach((file) => {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  processContent(content);
});
```

**Fix:**

```typescript
const files = await fs.promises.readdir(dir);
const contents = await Promise.all(
  files.map((file) => fs.promises.readFile(path.join(dir, file), 'utf8')),
);
contents.forEach(processContent);
```

**Impact:** N files → ~N/4 time with parallel I/O.

### Bottleneck 3: Missing Early Exits

**Symptom:** Hook running full logic for every tool call.

**Cause:**

```typescript
async function main() {
  const input = await parseStdin();
  const gitStatus = getGitStatus(input.cwd); // Always runs
  const commits = getRecentCommits(input.cwd); // Always runs

  if (input.tool_name !== 'Bash') {
    process.exit(0); // Too late!
  }
  // ...
}
```

**Fix:**

```typescript
async function main() {
  const input = await parseStdin();

  // Early exit BEFORE expensive operations
  if (input.tool_name !== 'Bash') {
    process.exit(0);
  }

  // Only run expensive operations when needed
  const gitStatus = getGitStatus(input.cwd);
  const commits = getRecentCommits(input.cwd);
  // ...
}
```

**Impact:** 100ms → 1ms for non-applicable cases.

### Bottleneck 4: Spawning Subprocesses

**Symptom:** Hook taking 50-100ms per command.

**Cause:**

```typescript
// Each execSync spawns new process (~20-50ms overhead)
const branch = execSync('git branch --show-current', { cwd });
const status = execSync('git status --porcelain', { cwd });
const diff = execSync('git diff --stat', { cwd });
```

**Fix Option 1: Parallel execution**

```typescript
const [branch, status, diff] = await Promise.all([
  exec('git branch --show-current', { cwd }),
  exec('git status --porcelain', { cwd }),
  exec('git diff --stat', { cwd }),
]);
```

**Fix Option 2: Combined commands**

```typescript
// Single git invocation
const output = execSync('git branch --show-current && git status --porcelain', {
  cwd,
});
// Parse combined output
```

**Impact:** 150ms → 50ms (parallel) or 150ms → 60ms (combined).

### Bottleneck 5: JSON Parsing Large Files

**Symptom:** Hook taking 500ms+ when parsing transcript.

**Cause:**

```typescript
// Loading entire transcript (can be 5-10MB+)
const transcript = JSON.parse(fs.readFileSync(transcriptPath, 'utf8'));
// Processing all messages
const hasIntent = analyzeAllMessages(transcript.messages);
```

**Fix:**

```typescript
// Only parse what you need
const transcript = JSON.parse(fs.readFileSync(transcriptPath, 'utf8'));
// Only look at recent messages
const recentMessages = transcript.messages.slice(-10);
const hasIntent = analyzeMessages(recentMessages);
```

**Impact:** 500ms → 50ms for large transcripts.

## Timeout Handling

### Understanding Timeouts

**Default:** 60 seconds (configurable in Claude Code settings)

**Behavior:**

- Hook killed after timeout
- stderr shown to Claude
- Tool execution continues (PreToolUse) or completes (PostToolUse)

### Graceful Timeout Handling

```typescript
async function main() {
  const timeout = 60000; // 60s
  const controller = new AbortController();

  // Set timeout
  const timeoutId = setTimeout(() => {
    controller.abort();
    console.error('⚠️  Hook timed out after 60s');
    process.exit(1);
  }, timeout);

  try {
    // Your hook logic with abort signal
    await performWork({ signal: controller.signal });

    clearTimeout(timeoutId);
    process.exit(0);
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.error('⚠️  Hook aborted due to timeout');
    } else {
      console.error(`❌ Hook error: ${error.message}`);
    }
    process.exit(1);
  }
}
```

### Timeout-Safe Operations

```typescript
// ❌ BAD: Operation without timeout
await fetch('https://api.example.com/data');

// ✅ GOOD: Operation with timeout
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);

try {
  const response = await fetch('https://api.example.com/data', {
    signal: controller.signal,
  });
  clearTimeout(timeoutId);
  return response;
} catch (error) {
  clearTimeout(timeoutId);
  if (error.name === 'AbortError') {
    console.warn('API request timed out');
  }
  throw error;
}
```

## Performance Testing

### Benchmark Script

```typescript
#!/usr/bin/env bun

import { parseStdin } from './utils/index.js';

async function benchmark(iterations = 100) {
  const results: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const start = Date.now();

    // Simulate hook execution
    const input = await parseStdin();
    // Your hook logic here...

    const duration = Date.now() - start;
    results.push(duration);
  }

  const avg = results.reduce((a, b) => a + b, 0) / results.length;
  const min = Math.min(...results);
  const max = Math.max(...results);
  const p95 = results.sort((a, b) => a - b)[Math.floor(results.length * 0.95)];

  console.log(`
Benchmark Results (${iterations} iterations):
  Average: ${avg.toFixed(2)}ms
  Min: ${min}ms
  Max: ${max}ms
  P95: ${p95}ms
  `);
}

await benchmark();
```

### Realistic Testing

```sh
# Test with realistic input
printf '{"cwd":"%s","tool_name":"Edit","tool_input":{"file_path":"src/example.ts"}}' \
  "$(pwd)" | time bun hooks/type-checker.ts

# Test early exit path
printf '{"cwd":"%s","tool_name":"Read"}' \
  "$(pwd)" | time bun hooks/type-checker.ts

# Test with large transcript
printf '{"cwd":"%s","transcript_path":"/path/to/large/transcript.json"}' \
  "$(pwd)" | time bun hooks/git-commit-guard.ts
```

## Optimization Checklist

Before deploying a hook, verify:

- [ ] **Early exits** - Exit immediately when hook doesn't apply
- [ ] **Incremental operations** - Use file-specific tools, not full project scans
- [ ] **Caching** - Cache expensive lookups (configs, metadata)
- [ ] **Parallel execution** - Run independent operations concurrently
- [ ] **Lazy loading** - Import heavy dependencies only when needed
- [ ] **Performance monitoring** - Log warnings for slow operations
- [ ] **Timeout handling** - Graceful handling of 60s timeout
- [ ] **Realistic testing** - Test with production-like inputs
- [ ] **Target met** - Execution time within target for hook type

## Further Reading

- [Anti-Patterns Guide](./anti-patterns.md) - What to avoid
- [Placement Guide](./placement-guide.md) - Choosing the right hook
- [Lifecycle Diagram](./lifecycle.md) - Execution order and guarantees
- [Command Hooks Guide](../command-hooks.md) - Comprehensive hook reference
