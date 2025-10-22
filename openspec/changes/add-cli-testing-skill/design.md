# Design: CLI Testing Skill

## Context

TypeScript CLI tools need comprehensive testing across different environments, but manually setting up and executing these tests is time-consuming and error-prone. The universal executor pattern from playwright-skill provides a proven approach for dynamic code generation and execution with proper module resolution.

This skill will adapt the universal executor pattern for CLI testing, enabling automated test generation and execution across monorepos, package managers, and platforms.

## Goals / Non-Goals

### Goals

- Automate CLI test generation and execution for TypeScript projects
- Support multiple environments (monorepos, package managers, platforms)
- Use universal executor pattern for reliable test execution
- Provide clear test result parsing and validation
- Follow RED-GREEN-REFACTOR methodology for skill development

### Non-Goals

- Not a replacement for Vitest/Jest (complementary for CLI-specific scenarios)
- Not for testing web applications (use playwright-skill for that)
- Not for performance benchmarking (focus on functional correctness)
- Not for testing non-TypeScript/JavaScript CLI tools

## Decisions

### 1. Universal Executor Pattern Adaptation

**Decision:** Adapt playwright-skill's universal executor pattern for CLI testing

**Implementation:**

```javascript
async function executeCLITest(cliCommand, context) {
  // 1. Create temp test file with proper imports
  const tempTestFile = createTempFile(`
    import { exec } from 'child_process';
    import { promisify } from 'util';
    const execAsync = promisify(exec);

    async function test() {
      const result = await execAsync('${cliCommand}', ${context});
      return { stdout: result.stdout, stderr: result.stderr, code: result.code };
    }

    test().then(console.log).catch(console.error);
  `);

  // 2. Set up environment (package manager, monorepo context)
  const env = setupEnvironment(context);

  // 3. Execute with proper module resolution
  const result = await executeInContext(tempTestFile, env);

  // 4. Parse and validate results
  const parsed = parseTestResults(result);

  // 5. Clean up temp files
  await cleanup(tempTestFile);

  return parsed;
}
```

**Rationale:**

- Proven pattern from playwright-skill (373★)
- Handles module resolution and dynamic execution
- Temporary files avoid polluting the project
- Environment setup enables testing different scenarios

**Alternatives Considered:**

- Direct `exec()` calls - rejected due to module resolution issues
- Inline eval - rejected due to security and context isolation concerns
- Jest programmatic API - rejected due to overhead for simple CLI tests

### 2. Skill Structure: Progressive Disclosure

**Decision:** Use SKILL.md (~500 lines) + API_REFERENCE.md for advanced scenarios

**Structure:**

**SKILL.md:**

- YAML frontmatter with triggers
- Core CLI testing instructions
- Common scenarios (basic CLI, monorepo, package managers)
- Simple examples

**API_REFERENCE.md:**

- Advanced cross-platform testing
- Custom environment setup
- Complex monorepo configurations
- Performance considerations

**Rationale:**

- Follows progressive disclosure pattern (~2.5x token savings)
- Common use cases always available
- Advanced scenarios loaded on-demand

### 3. Monorepo Support

**Decision:** Support Nx, Turborepo, and pnpm workspaces with context-aware setup

**Implementation:**

- Detect monorepo type from package.json and config files
- Set up appropriate workspace context
- Handle inter-package dependencies

**Rationale:**

- Covers 95%+ of TypeScript monorepo setups
- Each tool has distinct testing requirements
- Context-aware setup reduces manual configuration

### 4. Package Manager Detection

**Decision:** Auto-detect package manager from lockfiles, allow override

**Detection Priority:**

1. pnpm-lock.yaml → pnpm
2. yarn.lock → yarn
3. package-lock.json → npm
4. Context override if specified

**Rationale:**

- Automatic detection reduces configuration
- Override allows testing with different managers
- Follows community conventions (lockfile = source of truth)

### 5. Cross-Platform Testing

**Decision:** Support platform-specific testing with conditional execution

**Approach:**

- Detect platform: `process.platform`
- Allow platform-specific test scenarios
- Document platform-specific behaviors (path separators, shells)

**Rationale:**

- Critical for CLI tools (different behaviors on Windows vs Unix)
- Conditional execution prevents failures on unsupported platforms
- Documentation helps users understand limitations

## Risks / Trade-offs

### Risk: Temp File Cleanup Failures

**Mitigation:**

- Use try/finally for guaranteed cleanup
- Add timeout for hanging executions
- Log cleanup failures for debugging

### Risk: Environment Pollution

**Mitigation:**

- Isolated temp directories per test
- Restore environment variables after execution
- Clear caches between tests

### Risk: False Positives/Negatives

**Mitigation:**

- Validate test setup before execution
- Provide clear error messages
- Include verification steps in generated tests

### Trade-off: Simplicity vs. Feature Completeness

**Decision:** Start with basic scenarios, expand based on usage

**Phase 1 (MVP):**

- Basic CLI execution
- Simple monorepo detection
- npm/pnpm support

**Phase 2 (Future):**

- Advanced platform testing
- Custom environment variables
- Performance metrics

## Migration Plan

N/A - This is a new capability, no migration required.

## Open Questions

1. **Test Output Format:** Should results be JSON, TAP, or custom format?
   - **Proposal:** Start with JSON for parseability, add TAP if requested

2. **Timeout Defaults:** What's a reasonable timeout for CLI tests?
   - **Proposal:** 30 seconds default, configurable per test

3. **Error Handling:** How verbose should error messages be?
   - **Proposal:** Concise by default, verbose mode in API_REFERENCE.md
