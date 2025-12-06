#!/usr/bin/env bun

import { execSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

import yaml from 'js-yaml';

import { hooksSchema } from '../schemas/hooks.schema';
import { marketplaceSchema } from '../schemas/marketplace.schema';
import { pluginSchema } from '../schemas/plugin.schema';
import { skillFrontmatterSchema } from '../schemas/skill-frontmatter.schema';

/**
 * Color codes for terminal output
 */
const colors = {
  reset: '\u001B[0m',
  red: '\u001B[31m',
  green: '\u001B[32m',
  yellow: '\u001B[33m',
  cyan: '\u001B[36m',
  gray: '\u001B[90m',
};

/**
 * Validation result
 */
type ValidationResult = {
  valid: boolean;
  file: string;
  errors: string[];
};

/**
 * CLI arguments
 */
type Args = {
  changed: boolean;
  help: boolean;
  verbose: boolean;
};

/**
 * Parse command-line arguments
 */
function parseArgs(): Args {
  const args = new Set(process.argv.slice(2));
  return {
    changed: args.has('--changed'),
    help: args.has('--help') || args.has('-h'),
    verbose: args.has('--verbose') || args.has('-v'),
  };
}

/**
 * Show help message
 */
function showHelp(): void {
  console.log(`
${colors.cyan}validate-schemas${colors.reset} - Validate plugin manifests and skill frontmatter

${colors.yellow}USAGE:${colors.reset}
  bun run validate              # Validate all schemas
  bun run validate --changed    # Validate only git-staged files
  bun run validate --verbose    # Show detailed output
  bun run validate --help       # Show this help

${colors.yellow}OPTIONS:${colors.reset}
  --changed, -c    Only validate files staged in git
  --verbose, -v    Show detailed validation output
  --help, -h       Show this help message

${colors.yellow}EXIT CODES:${colors.reset}
  0  All validations passed
  1  Validation errors found
`);
}

/**
 * Get list of changed files from git
 */
function getChangedFiles(): string[] {
  try {
    const output = execSync('git diff --cached --name-only', {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return output
      .trim()
      .split('\n')
      .filter((f) => f.length > 0);
  } catch {
    return [];
  }
}

/**
 * Find all plugin.json files
 */
function findPluginManifests(changedFiles?: string[]): string[] {
  const files: string[] = [];
  const pluginsDir = path.join(process.cwd(), 'plugins');

  if (!existsSync(pluginsDir)) return files;

  for (const plugin of readdirSync(pluginsDir)) {
    const manifestPath = path.join(
      pluginsDir,
      plugin,
      '.claude-plugin',
      'plugin.json',
    );
    if (existsSync(manifestPath)) {
      const relativePath = path.relative(process.cwd(), manifestPath);
      if (!changedFiles || changedFiles.includes(relativePath)) {
        files.push(manifestPath);
      }
    }
  }

  return files;
}

/**
 * Find marketplace.json
 */
function findMarketplaceManifest(changedFiles?: string[]): string | null {
  const manifestPath = path.join(
    process.cwd(),
    '.claude-plugin',
    'marketplace.json',
  );
  if (!existsSync(manifestPath)) return null;

  const relativePath = path.relative(process.cwd(), manifestPath);
  if (changedFiles && !changedFiles.includes(relativePath)) return null;

  return manifestPath;
}

/**
 * Find all SKILL.md files
 */
function findSkillFiles(changedFiles?: string[]): string[] {
  const files: string[] = [];
  const pluginsDir = path.join(process.cwd(), 'plugins');

  if (!existsSync(pluginsDir)) return files;

  for (const plugin of readdirSync(pluginsDir)) {
    const skillsDir = path.join(pluginsDir, plugin, 'skills');
    if (!existsSync(skillsDir)) continue;

    // Recursively find SKILL.md files
    const findSkills = (dir: string): void => {
      for (const entry of readdirSync(dir)) {
        const fullPath = path.join(dir, entry);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
          findSkills(fullPath);
        } else if (entry === 'SKILL.md') {
          const relativePath = path.relative(process.cwd(), fullPath);
          if (!changedFiles || changedFiles.includes(relativePath)) {
            files.push(fullPath);
          }
        }
      }
    };

    findSkills(skillsDir);
  }

  return files;
}

/**
 * Extract YAML frontmatter from markdown file
 */
function extractFrontmatter(filePath: string): string | null {
  const content = readFileSync(filePath, 'utf8');
  const match = /^---\n([\s\S]*?)\n---/.exec(content);
  return match ? match[1] : null;
}

/**
 * Parse YAML frontmatter using js-yaml library
 *
 * @param yamlContent YAML string to parse
 * @returns Parsed YAML object
 */
function parseYaml(yamlContent: string): unknown {
  try {
    const result = yaml.load(yamlContent);
    if (result === null || result === undefined) {
      throw new Error('Empty or invalid YAML document');
    }
    return result;
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`YAML parsing error: ${msg}`);
  }
}

/**
 * Validate filesystem references in plugin manifest
 * Checks if referenced files exist and validates their structure
 */
function validateFilesystemReferences(
  manifestPath: string,
  data: Record<string, unknown>,
): string[] {
  const errors: string[] = [];
  const pluginDir = path.dirname(path.dirname(manifestPath)); // Go up from .claude-plugin/plugin.json

  // Helper to resolve path relative to plugin root
  const resolvePath = (refPath: string): string => {
    // Remove leading ./ if present
    const cleanPath = refPath.startsWith('./') ? refPath.slice(2) : refPath;
    return path.join(pluginDir, cleanPath);
  };

  // Helper to check single path
  const checkPath = (refPath: string, fieldName: string): void => {
    const fullPath = resolvePath(refPath);
    if (!existsSync(fullPath)) {
      const relativePath = path.relative(pluginDir, fullPath);
      errors.push(
        `${fieldName} references missing file: "${relativePath}" (resolved to: ${fullPath})`,
      );
    }
  };

  // Helper to check path or array of paths
  const checkPaths = (value: unknown, fieldName: string): void => {
    if (typeof value === 'string') {
      checkPath(value, fieldName);
    } else if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === 'string') {
          checkPath(item, fieldName);
        }
      }
    }
  };

  // Validate hooks field
  if (data.hooks && typeof data.hooks === 'string') {
    const hooksPath = resolvePath(data.hooks);

    // Check for duplicate: hooks/hooks.json is auto-discovered
    const standardHooksPath = path.join(pluginDir, 'hooks', 'hooks.json');
    if (
      hooksPath === standardHooksPath &&
      existsSync(standardHooksPath) &&
      data.hooks === './hooks/hooks.json'
    ) {
      errors.push(
        'hooks field references "./hooks/hooks.json" which is auto-discovered by Claude Code. ' +
          'Remove the "hooks" field from plugin.json to avoid duplicate loading. ' +
          'Only use "hooks" field for additional or non-standard hook files.',
      );
    } else if (existsSync(hooksPath)) {
      // Validate hooks.json structure
      try {
        const hooksContent = readFileSync(hooksPath, 'utf8');
        const hooksData = JSON.parse(hooksContent) as unknown;
        const result = hooksSchema(hooksData);
        if ('summary' in result) {
          errors.push(`hooks file has invalid structure: ${result.summary}`);
        }
      } catch (error) {
        errors.push(
          `hooks file is not valid JSON: ${error instanceof Error ? error.message : 'unknown error'}`,
        );
      }
    } else {
      const relativePath = path.relative(pluginDir, hooksPath);
      errors.push(`hooks references missing file: "${relativePath}"`);
    }
  }
  // Inline hooks objects are validated by pluginSchema already

  // Validate mcpServers field
  if (data.mcpServers && typeof data.mcpServers === 'string') {
    const mcpPath = resolvePath(data.mcpServers);
    if (existsSync(mcpPath)) {
      // Validate .mcp.json structure (basic check)
      try {
        const mcpContent = readFileSync(mcpPath, 'utf8');
        const mcpData = JSON.parse(mcpContent) as Record<string, unknown>;
        // MCP files should have server configs at root level
        if (Object.keys(mcpData).length === 0) {
          errors.push('mcpServers file is empty');
        }
        // Each server config should have at least a command
        for (const [serverName, config] of Object.entries(mcpData)) {
          if (
            typeof config !== 'object' ||
            config === null ||
            !('command' in config)
          ) {
            errors.push(
              `mcpServers file: server "${serverName}" is missing required "command" field`,
            );
          }
        }
      } catch (error) {
        errors.push(
          `mcpServers file is not valid JSON: ${error instanceof Error ? error.message : 'unknown error'}`,
        );
      }
    } else {
      const relativePath = path.relative(pluginDir, mcpPath);
      errors.push(`mcpServers references missing file: "${relativePath}"`);
    }
  }

  // Validate commands field
  if (data.commands) {
    checkPaths(data.commands, 'commands');
  }

  // Validate agents field
  if (data.agents) {
    checkPaths(data.agents, 'agents');
  }

  return errors;
}

/**
 * Validate plugin.json file
 */
function validatePlugin(filePath: string): ValidationResult {
  try {
    const content = readFileSync(filePath, 'utf8');
    const data = JSON.parse(content) as { hooks?: unknown };

    // Check for common mistakes: hooks field must not be an array
    if (data.hooks && Array.isArray(data.hooks)) {
      return {
        valid: false,
        file: filePath,
        errors: [
          'hooks field must be a string path to hooks.json OR an object with nested hooks structure, not an array.\n' +
            'See https://code.claude.com/docs/en/hooks.md for correct format.',
        ],
      };
    }

    // Validate with ArkType schema (includes all pattern checks)
    const result = pluginSchema(data);

    // Check for arktype validation errors (has summary property)
    if ('summary' in result) {
      return {
        valid: false,
        file: filePath,
        errors: [result.summary],
      };
    }

    // After schema validation passes, check filesystem references
    const fsErrors = validateFilesystemReferences(
      filePath,
      data as Record<string, unknown>,
    );
    if (fsErrors.length > 0) {
      return {
        valid: false,
        file: filePath,
        errors: fsErrors,
      };
    }

    return { valid: true, file: filePath, errors: [] };
  } catch (error) {
    return {
      valid: false,
      file: filePath,
      errors: [
        error instanceof Error ? error.message : 'Unknown parsing error',
      ],
    };
  }
}

/**
 * Validate marketplace.json file
 */
function validateMarketplace(filePath: string): ValidationResult {
  try {
    const content = readFileSync(filePath, 'utf8');
    const data = JSON.parse(content) as unknown;
    const result = marketplaceSchema(data);

    // Check for arktype validation errors (has summary property)
    if ('summary' in result) {
      return {
        valid: false,
        file: filePath,
        errors: [result.summary],
      };
    }

    return { valid: true, file: filePath, errors: [] };
  } catch (error) {
    return {
      valid: false,
      file: filePath,
      errors: [
        error instanceof Error ? error.message : 'Unknown parsing error',
      ],
    };
  }
}

/**
 * Validate SKILL.md frontmatter
 */
function validateSkill(filePath: string): ValidationResult {
  try {
    const yaml = extractFrontmatter(filePath);
    if (!yaml) {
      return {
        valid: false,
        file: filePath,
        errors: ['No frontmatter found (must be between --- delimiters)'],
      };
    }

    const data = parseYaml(yaml);
    const result = skillFrontmatterSchema(data);

    // Check for arktype validation errors (has summary property)
    if ('summary' in result) {
      return {
        valid: false,
        file: filePath,
        errors: [result.summary],
      };
    }

    return { valid: true, file: filePath, errors: [] };
  } catch (error) {
    return {
      valid: false,
      file: filePath,
      errors: [
        error instanceof Error ? error.message : 'Unknown parsing error',
      ],
    };
  }
}

/**
 * Format validation results
 */
function formatResults(results: ValidationResult[], verbose: boolean): void {
  const failures = results.filter((r) => !r.valid);
  const successes = results.filter((r) => r.valid);

  if (verbose || failures.length > 0) {
    console.log('');
  }

  // Show failures
  for (const failure of failures) {
    const relativePath = path.relative(process.cwd(), failure.file);
    console.log(`${colors.red}✖${colors.reset} ${relativePath}`);
    for (const error of failure.errors) {
      console.log(`  ${colors.gray}${error}${colors.reset}`);
    }
    console.log('');
  }

  // Show successes in verbose mode
  if (verbose) {
    for (const success of successes) {
      const relativePath = path.relative(process.cwd(), success.file);
      console.log(`${colors.green}✓${colors.reset} ${relativePath}`);
    }
    console.log('');
  }

  // Summary
  const total = results.length;
  if (failures.length === 0) {
    console.log(
      `${colors.green}✓${colors.reset} All ${total} schema(s) validated successfully`,
    );
  } else {
    console.log(
      `${colors.red}✖${colors.reset} ${failures.length} of ${total} schema(s) failed validation`,
    );
  }
}

/**
 * Main validation function
 */
function main(): void {
  const args = parseArgs();

  if (args.help) {
    showHelp();
    process.exit(0);
  }

  const changedFiles = args.changed ? getChangedFiles() : undefined;

  if (args.changed && changedFiles?.length === 0) {
    console.log(`${colors.gray}No staged files to validate${colors.reset}`);
    process.exit(0);
  }

  // Collect all files to validate
  const pluginFiles = findPluginManifests(changedFiles);
  const marketplaceFile = findMarketplaceManifest(changedFiles);
  const skillFiles = findSkillFiles(changedFiles);

  if (pluginFiles.length === 0 && !marketplaceFile && skillFiles.length === 0) {
    console.log(
      `${colors.gray}No schema files found to validate${colors.reset}`,
    );
    process.exit(0);
  }

  // Run validations
  const results: ValidationResult[] = [];

  for (const file of pluginFiles) {
    results.push(validatePlugin(file));
  }

  if (marketplaceFile) {
    results.push(validateMarketplace(marketplaceFile));
  }

  for (const file of skillFiles) {
    results.push(validateSkill(file));
  }

  // Format and display results
  formatResults(results, args.verbose);

  // Exit with appropriate code
  const hasFailures = results.some((r) => !r.valid);
  process.exit(hasFailures ? 1 : 0);
}

// Run the script
try {
  main();
} catch (error) {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error);
  process.exit(1);
}
