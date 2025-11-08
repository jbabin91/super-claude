#!/usr/bin/env bun

import { execSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

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
 * Parse YAML frontmatter (basic parser, assumes valid YAML)
 */
function parseYaml(yaml: string): unknown {
  // This is a simple YAML parser for our use case
  // For production, consider using a library like 'yaml' or 'js-yaml'
  const lines = yaml.split('\n');
  const result: Record<string, unknown> = {};
  let currentKey = '';
  let _inArray = false;
  let inMultiline = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) continue;

    // Handle array items
    if (trimmed.startsWith('-')) {
      const value = trimmed.slice(1).trim();
      if (Array.isArray(result[currentKey])) {
        (result[currentKey] as unknown[]).push(
          value.replaceAll(/^['"]|['"]$/g, ''),
        );
      }
      continue;
    }

    // Handle key-value pairs
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex !== -1) {
      const key = trimmed.slice(0, colonIndex).trim();
      let value: unknown = trimmed.slice(colonIndex + 1).trim();

      // Handle multiline strings (|)
      if (value === '|') {
        inMultiline = true;
        currentKey = key;
        result[key] = '';
        continue;
      }

      // Handle arrays ([...])
      if (
        typeof value === 'string' &&
        value.startsWith('[') &&
        value.endsWith(']')
      ) {
        value = value
          .slice(1, -1)
          .split(',')
          .map((v: string) => v.trim().replaceAll(/^['"]|['"]$/g, ''));
      }
      // Handle nested objects
      else if (value === '' || value === '{}') {
        value = {};
        currentKey = key;
        _inArray = false;
      }
      // Handle simple values
      else if (typeof value === 'string') {
        value = value.replaceAll(/^['"]|['"]$/g, '');
      }

      result[key] = value;
      currentKey = key;
      continue;
    }

    // Handle multiline string continuation
    if (inMultiline) {
      if (/^\w+:/.test(trimmed)) {
        inMultiline = false;
      } else {
        result[currentKey] =
          `${result[currentKey]}\n${line.replace(/^\s{2}/, '')}`;
      }
    }

    // Handle nested object properties
    if (currentKey && typeof result[currentKey] === 'object' && trimmed) {
      const nestedMatch = /^(\w+):\s*(.*)$/.exec(trimmed);
      if (nestedMatch) {
        const [, nestedKey, nestedValue] = nestedMatch;
        let value: unknown = nestedValue;

        // Handle nested arrays
        if (nestedValue.startsWith('[') && nestedValue.endsWith(']')) {
          value = nestedValue
            .slice(1, -1)
            .split(',')
            .map((v: string) => v.trim().replaceAll(/^['"]|['"]$/g, ''));
        } else if (nestedValue === '' || trimmed.endsWith(':')) {
          value = [];
          _inArray = true;
        } else {
          value = nestedValue.replaceAll(/^['"]|['"]$/g, '');
        }

        (result[currentKey] as Record<string, unknown>)[nestedKey] = value;
      }
    }
  }

  return result;
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

    if (result instanceof Error) {
      return {
        valid: false,
        file: filePath,
        errors: [result.message],
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

    if (result instanceof Error) {
      return {
        valid: false,
        file: filePath,
        errors: [result.message],
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

    if (result instanceof Error) {
      return {
        valid: false,
        file: filePath,
        errors: [result.message],
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
