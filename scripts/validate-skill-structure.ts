#!/usr/bin/env bun
/**
 * Script Name: validate-skill-structure
 * Purpose: Validates that skills follow ADR-0009 (Token-Efficient Skill Design)
 * Usage: bun run scripts/validate-skill-structure.ts [--plugin plugin-name]
 *
 * Checks:
 * - SKILL.md exists
 * - SKILL.md is <500 lines (content lines, excluding frontmatter)
 * - Has valid YAML frontmatter with required fields
 * - Has at least one trigger (keyword or pattern)
 * - Resource files follow naming conventions
 *
 * Exit codes:
 * 0 - All skills valid
 * 1 - Invalid skill structure found
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

type SkillValidation = {
  path: string;
  plugin: string;
  skill: string;
  passed: boolean;
  errors: string[];
  warnings: string[];
  lineCount?: number;
};

const LINE_LIMIT = 500;
const REQUIRED_FRONTMATTER_FIELDS = ['name', 'version', 'description'];
const VALID_RESOURCE_FILES = [
  'API_REFERENCE.md',
  'EXAMPLES.md',
  'TROUBLESHOOTING.md',
  'MIGRATION.md',
];

function countContentLines(content: string): number {
  // Remove YAML frontmatter
  const withoutFrontmatter = content.replace(/^---\n[\s\S]*?\n---\n/, '');

  // Count non-blank lines
  const lines = withoutFrontmatter.split('\n');
  return lines.filter((line) => line.trim().length > 0).length;
}

function extractFrontmatter(content: string): Record<string, unknown> | null {
  const match = /^---\n([\s\S]*?)\n---/.exec(content);
  if (!match) return null;

  try {
    // Simple YAML parser for basic key-value pairs
    const yaml = match[1];
    const result: Record<string, unknown> = {};

    let currentKey = '';
    for (const line of yaml.split('\n')) {
      const keyMatch = /^(\w+):\s*(.*)$/.exec(line);
      if (keyMatch) {
        currentKey = keyMatch[1];
        const value = keyMatch[2].trim();

        if (value === '|') {
          result[currentKey] = ''; // Multi-line string starts
        } else if (value.startsWith('[')) {
          // Array value
          result[currentKey] = value
            .replaceAll(/[[\]]/g, '')
            .split(',')
            .map((v) => v.trim());
        } else {
          result[currentKey] = value;
        }
      } else if (currentKey && line.trim()) {
        // Multi-line continuation
        result[currentKey] = (result[currentKey] as string) + ' ' + line.trim();
      }
    }

    return result;
  } catch {
    return null;
  }
}

function validateSkill(pluginPath: string, skillName: string): SkillValidation {
  const skillPath = path.join(pluginPath, 'skills', skillName);
  const skillFile = path.join(skillPath, 'SKILL.md');

  const validation: SkillValidation = {
    path: skillPath,
    plugin: pluginPath.split('/').pop()!,
    skill: skillName,
    passed: true,
    errors: [],
    warnings: [],
  };

  // Check if SKILL.md exists
  if (!existsSync(skillFile)) {
    validation.passed = false;
    validation.errors.push('SKILL.md not found');
    return validation;
  }

  const content = readFileSync(skillFile, 'utf8');

  // Check line count (ADR-0009: <500 lines)
  const lineCount = countContentLines(content);
  validation.lineCount = lineCount;

  if (lineCount > LINE_LIMIT) {
    validation.passed = false;
    validation.errors.push(
      `SKILL.md exceeds ${LINE_LIMIT} lines (${lineCount} lines found). Consider using progressive disclosure with API_REFERENCE.md`,
    );
  }

  // Check frontmatter
  const frontmatter = extractFrontmatter(content);
  if (!frontmatter) {
    validation.passed = false;
    validation.errors.push('Missing or invalid YAML frontmatter');
    return validation;
  }

  // Check required fields
  for (const field of REQUIRED_FRONTMATTER_FIELDS) {
    if (!frontmatter[field]) {
      validation.passed = false;
      validation.errors.push(`Missing required frontmatter field: ${field}`);
    }
  }

  // Check triggers
  const hasKeywords =
    frontmatter.triggers &&
    typeof frontmatter.triggers === 'object' &&
    'keywords' in frontmatter.triggers &&
    Array.isArray((frontmatter.triggers as Record<string, unknown>).keywords) &&
    (frontmatter.triggers as Record<string, unknown[]>).keywords.length > 0;

  const hasPatterns =
    frontmatter.triggers &&
    typeof frontmatter.triggers === 'object' &&
    'patterns' in frontmatter.triggers &&
    Array.isArray((frontmatter.triggers as Record<string, unknown>).patterns) &&
    (frontmatter.triggers as Record<string, unknown[]>).patterns.length > 0;

  if (!hasKeywords && !hasPatterns) {
    validation.warnings.push(
      'No trigger keywords or patterns found. Skill will not auto-activate.',
    );
  }

  // Check resource files
  try {
    const files = readdirSync(skillPath);
    for (const file of files) {
      if (file === 'SKILL.md' || file === 'index.ts') continue;

      if (file.endsWith('.md') && !VALID_RESOURCE_FILES.includes(file)) {
        validation.warnings.push(
          `Unusual resource file: ${file}. Consider renaming to ${VALID_RESOURCE_FILES.join(', ')}`,
        );
      }
    }
  } catch {
    // Ignore directory read errors
  }

  return validation;
}

function findPlugins(pluginsDir: string, targetPlugin?: string): string[] {
  const plugins: string[] = [];

  try {
    const entries = readdirSync(pluginsDir);

    for (const entry of entries) {
      const pluginPath = path.join(pluginsDir, entry);

      if (!statSync(pluginPath).isDirectory()) continue;
      if (targetPlugin && entry !== targetPlugin) continue;

      const skillsDir = path.join(pluginPath, 'skills');
      if (existsSync(skillsDir) && statSync(skillsDir).isDirectory()) {
        plugins.push(pluginPath);
      }
    }
  } catch (error) {
    console.error('Error reading plugins directory:', error);
  }

  return plugins;
}

function findSkills(pluginPath: string): string[] {
  const skills: string[] = [];
  const skillsDir = path.join(pluginPath, 'skills');

  try {
    const entries = readdirSync(skillsDir);

    for (const entry of entries) {
      const skillPath = path.join(skillsDir, entry);
      if (statSync(skillPath).isDirectory()) {
        skills.push(entry);
      }
    }
  } catch (error) {
    console.error(`Error reading skills in ${pluginPath}:`, error);
  }

  return skills;
}

function main() {
  const args = process.argv.slice(2);
  const pluginFlag = args.indexOf('--plugin');
  const targetPlugin = pluginFlag === -1 ? undefined : args[pluginFlag + 1];

  const projectRoot = path.join(import.meta.dir, '..');
  const pluginsDir = path.join(projectRoot, 'plugins');

  console.log('🔍 Validating skill structure...\n');

  const plugins = findPlugins(pluginsDir, targetPlugin);

  if (plugins.length === 0) {
    if (targetPlugin) {
      console.error(`❌ Plugin "${targetPlugin}" not found or has no skills`);
    } else {
      console.error('❌ No plugins with skills found');
    }
    process.exit(1);
  }

  const validations: SkillValidation[] = [];
  let totalSkills = 0;

  for (const pluginPath of plugins) {
    const skills = findSkills(pluginPath);
    totalSkills += skills.length;

    for (const skill of skills) {
      const validation = validateSkill(pluginPath, skill);
      validations.push(validation);
    }
  }

  // Print results
  let hasErrors = false;
  let hasWarnings = false;

  for (const v of validations) {
    const status = v.passed ? '✅' : '❌';
    const lines =
      v.lineCount === undefined ? '' : ` (${v.lineCount}/${LINE_LIMIT} lines)`;

    console.log(`${status} ${v.plugin}/${v.skill}${lines}`);

    if (v.errors.length > 0) {
      hasErrors = true;
      for (const error of v.errors) {
        console.log(`   ❌ ${error}`);
      }
    }

    if (v.warnings.length > 0) {
      hasWarnings = true;
      for (const warning of v.warnings) {
        console.log(`   ⚠️  ${warning}`);
      }
    }

    if (v.errors.length === 0 && v.warnings.length === 0) {
      console.log(`   ✓ All checks passed`);
    }

    console.log();
  }

  // Summary
  const passed = validations.filter((v) => v.passed).length;

  console.log(
    `\n📊 Summary: ${passed}/${totalSkills} skills passed validation`,
  );

  if (hasWarnings) {
    console.log('⚠️  Some warnings found (non-blocking)');
  }

  if (hasErrors) {
    console.log('❌ Validation failed - please fix errors above');
    process.exit(1);
  }

  console.log('✅ All skills valid');
  process.exit(0);
}

main();
