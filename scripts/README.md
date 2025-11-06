# Scripts

Utility scripts for repository automation and development workflows.

## Purpose

This directory contains scripts that automate common development tasks:

- **Validation scripts** - Check project structure, validate specs, lint configs
- **Setup scripts** - Initialize development environment, install dependencies
- **Testing utilities** - Run test suites, generate coverage reports
- **Build helpers** - Pre-build validation, post-build verification

## Conventions

### Script Naming

- Use kebab-case: `validate-openspec.ts`, `setup-dev-env.ts`
- Prefix by type:
  - `validate-*` - Validation and checking scripts
  - `setup-*` - Environment setup and initialization
  - `test-*` - Testing utilities
  - `build-*` - Build-related scripts

### Script Structure

All scripts should:

- Use TypeScript with Bun runtime
- Include shebang: `#!/usr/bin/env bun`
- Have clear JSDoc comments explaining purpose
- Exit with appropriate codes (0 = success, 1+ = failure)
- Provide helpful error messages

### Example Template

```typescript
#!/usr/bin/env bun
/**
 * Script Name: validate-something
 * Purpose: Validates something in the project
 * Usage: bun run scripts/validate-something.ts
 *
 * Exit codes:
 * 0 - Success
 * 1 - Validation failed
 */

async function main() {
  try {
    // Script logic here
    console.log('✅ Validation passed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    process.exit(1);
  }
}

await main();
```

## Available Scripts

### validate-skill-structure.ts

Validates that skills follow the required structure:

- SKILL.md exists and is <500 lines
- Has valid YAML frontmatter
- Has at least one trigger keyword or pattern
- Resource files (if present) have proper naming

**Usage:**

```sh
# Validate all skills
bun run scripts/validate-skill-structure.ts

# Validate specific plugin
bun run scripts/validate-skill-structure.ts --plugin meta
```

**Exit codes:**

- 0 - All skills valid
- 1 - Invalid skill structure found

## Running Scripts

### From project root

```sh
bun run scripts/script-name.ts [args]
```

### Make executable

```sh
chmod +x scripts/script-name.ts
./scripts/script-name.ts [args]
```

## Integration with CI/CD

Scripts in this directory can be used in:

- **Pre-commit hooks** - Validate changes before commit
- **GitHub Actions** - Run checks in CI pipeline
- **Pre-push hooks** - Final validation before pushing

Example lefthook configuration:

```yaml
# lefthook.yml
pre-commit:
  commands:
    validate-skills:
      run: bun run scripts/validate-skill-structure.ts
      fail_text: 'Skill validation failed'
```

## Best Practices

### Performance

- Keep scripts fast (<5 seconds for validation)
- Use parallel processing where possible
- Cache expensive operations

### Error Handling

- Provide clear, actionable error messages
- Include file paths and line numbers when relevant
- Suggest fixes for common issues

### Documentation

- Update this README when adding new scripts
- Include usage examples in script comments
- Document exit codes and error conditions

## Related Documentation

- [Development Workflow](../docs/workflows/development.md) - Development commands
- [OpenSpec Workflow](../docs/workflows/openspec.md) - Spec-driven development
- [Architecture Decisions](../docs/architecture/INDEX.md) - ADR catalog

## Adding New Scripts

1. Create script in `scripts/` with appropriate name
2. Add shebang: `#!/usr/bin/env bun`
3. Include JSDoc documentation
4. Follow naming conventions
5. Update this README with usage instructions
6. Test script thoroughly
7. Consider adding to CI/CD pipeline
