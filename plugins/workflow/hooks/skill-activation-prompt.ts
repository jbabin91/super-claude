#!/usr/bin/env bun

/**
 * Skill Auto-Activation Hook for Claude Code
 *
 * This UserPromptSubmit hook analyzes user prompts and suggests relevant skills
 * before Claude responds. It discovers skill-rules.json files across installed
 * plugins, merges them with project overrides, and matches against keywords
 * and intent patterns.
 *
 * @see {@link https://github.com/jbabin91/super-claude} for documentation
 *
 * Runtime: Bun (native TypeScript support)
 * Execution: Triggered on every user prompt submission
 * Performance Target: <50ms for typical projects (<10 plugins)
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import type {
  HookInput,
  MatchedSkill,
  PluginSkillRules,
  Priority,
  ProjectSkillRules,
  SkillConfig,
} from '../types/skill-rules.d.ts';

/**
 * Check if Bun runtime is available.
 * This function is mainly for documentation - if we're executing, Bun is available.
 */
function checkBunRuntime(): void {
  // If this script is running, Bun is available (shebang ensures it)
  // This check is here for clarity and future enhancement
  if (typeof Bun === 'undefined') {
    console.error('[WARNING] Bun required for skill activation');
    console.error('Install: https://bun.sh');
    // Exit 0 to not block user workflow on hook error
    process.exit(0);
  }
}

/**
 * Parse hook input from stdin.
 *
 * Claude Code passes hook context as JSON via stdin.
 *
 * @returns Parsed HookInput object
 * @throws Error if stdin is empty or invalid JSON
 */
async function parseStdin(): Promise<HookInput> {
  const stdin = await Bun.stdin.text();

  if (!stdin || stdin.trim() === '') {
    throw new Error('No input received from stdin');
  }

  try {
    const input = JSON.parse(stdin) as HookInput;

    // Validate required fields
    if (!input.prompt || typeof input.prompt !== 'string') {
      throw new Error('Invalid input: missing or invalid prompt field');
    }

    if (!input.cwd || typeof input.cwd !== 'string') {
      throw new Error('Invalid input: missing or invalid cwd field');
    }

    return input;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON from stdin: ' + error.message);
    }
    throw error;
  }
}

/**
 * Discover all skill-rules.json files from installed plugins.
 *
 * Scans ".claude/skills/star/skill-rules.json" for plugin-level rules.
 * Handles missing files and invalid JSON gracefully.
 *
 * @param cwd Current working directory
 * @returns Array of validated PluginSkillRules
 */
function discoverPluginRules(cwd: string): PluginSkillRules[] {
  const skillsDir = path.resolve(cwd, '.claude/skills');
  const pluginRules: PluginSkillRules[] = [];

  if (!existsSync(skillsDir)) {
    return pluginRules;
  }

  try {
    const entries = readdirSync(skillsDir, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const rulesPath = path.join(skillsDir, entry.name, 'skill-rules.json');

      if (!existsSync(rulesPath)) continue;

      try {
        const content = readFileSync(rulesPath, 'utf8');
        const rules = JSON.parse(content) as PluginSkillRules;

        // Validate required fields
        if (!rules.plugin?.name || !rules.plugin?.namespace || !rules.skills) {
          console.warn(
            '[WARNING]  Invalid skill-rules.json in ' +
              entry.name +
              ': missing required fields',
          );
          continue;
        }

        pluginRules.push(rules);
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Unknown error';
        console.warn(
          '[WARNING]  Failed to load skill-rules.json from ' +
            entry.name +
            ': ' +
            msg,
        );
      }
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.warn('[WARNING]  Failed to read skills directory: ' + msg);
  }

  return pluginRules;
}

/**
 * Load project-level overrides from .claude/skills/skill-rules.json
 *
 * @param cwd Current working directory
 * @returns ProjectSkillRules or null if not found/invalid
 */
function loadProjectOverrides(cwd: string): ProjectSkillRules | null {
  const overridesPath = path.resolve(cwd, '.claude/skills/skill-rules.json');

  if (!existsSync(overridesPath)) {
    return null;
  }

  try {
    const content = readFileSync(overridesPath, 'utf8');
    const overrides = JSON.parse(content) as ProjectSkillRules;

    // Validate schema
    if (!overrides.version || typeof overrides.version !== 'string') {
      console.warn(
        '[WARNING]  Invalid project overrides: missing version field',
      );
      return null;
    }

    // Ensure required fields exist (with defaults)
    return {
      version: overrides.version,
      overrides: overrides.overrides || {},
      disabled: overrides.disabled || [],
      global: overrides.global,
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.warn('[WARNING]  Failed to load project overrides: ' + msg);
    return null;
  }
}

/**
 * Merge plugin rules with project overrides.
 *
 * Precedence: Project overrides > Plugin defaults
 *
 * Strategy (MVP):
 * - Shallow merge for skill configs
 * - Apply disabled list
 * - Namespace all skill keys as "namespace/skill-name"
 *
 * @param pluginRules Array of plugin-level rules
 * @param projectOverrides Project-level overrides (optional)
 * @returns Map of skill ID to merged SkillConfig
 */
function mergeRules(
  pluginRules: PluginSkillRules[],
  projectOverrides: ProjectSkillRules | null,
): Map<string, SkillConfig> {
  const merged = new Map<string, SkillConfig>();

  // 1. Load all plugin rules with namespaced keys
  for (const plugin of pluginRules) {
    const namespace = plugin.plugin.namespace;

    for (const [skillName, config] of Object.entries(plugin.skills)) {
      const skillId = namespace + '/' + skillName;
      merged.set(skillId, config);
    }
  }

  // 2. Apply project overrides (shallow merge)
  if (projectOverrides) {
    for (const [skillId, override] of Object.entries(
      projectOverrides.overrides,
    )) {
      if (!merged.has(skillId)) {
        console.warn(
          '[WARNING]  Override for unknown skill: ' +
            skillId +
            ' (skill not found in plugins)',
        );
        continue;
      }

      // Shallow merge: spread operator replaces entire nested objects
      const baseConfig = merged.get(skillId)!;
      merged.set(skillId, { ...baseConfig, ...override });
    }

    // 3. Remove disabled skills
    for (const skillId of projectOverrides.disabled) {
      merged.delete(skillId);
    }
  }

  return merged;
}

/**
 * Match prompt against skill keywords (case-insensitive literal).
 *
 * @param prompt User's prompt text
 * @param keywords Array of keywords to match
 * @returns Matched keyword or null
 */
function matchKeywords(
  prompt: string,
  keywords: string[] | undefined,
): string | null {
  if (!keywords || keywords.length === 0) return null;

  const normalizedPrompt = prompt.toLowerCase();

  for (const keyword of keywords) {
    if (normalizedPrompt.includes(keyword.toLowerCase())) {
      return keyword;
    }
  }

  return null;
}

/**
 * Match prompt against intent patterns (regex with case-insensitive flag).
 *
 * @param prompt User's prompt text
 * @param patterns Array of regex patterns
 * @returns Matched pattern or null
 */
function matchIntentPatterns(
  prompt: string,
  patterns: string[] | undefined,
): string | null {
  if (!patterns || patterns.length === 0) return null;

  for (const pattern of patterns) {
    try {
      const regex = new RegExp(pattern, 'i');
      if (regex.test(prompt)) {
        return pattern;
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      console.warn(
        '[WARNING]  Invalid regex pattern: ' + pattern + ' (' + msg + ')',
      );
    }
  }

  return null;
}

/**
 * Find all skills that match the user's prompt.
 *
 * Uses both keyword and intent pattern matching.
 * Filters by priority threshold and disabled list.
 *
 * @param prompt User's prompt text
 * @param skills Map of skill ID to config
 * @param globalConfig Global configuration (optional)
 * @returns Array of matched skills
 */
function matchSkills(
  prompt: string,
  skills: Map<string, SkillConfig>,
  globalConfig: ProjectSkillRules['global'],
): MatchedSkill[] {
  const matches: MatchedSkill[] = [];

  for (const [skillId, config] of skills.entries()) {
    const [namespace, name] = skillId.split('/');

    // Try keyword matching
    const keywordMatch = matchKeywords(
      prompt,
      config.promptTriggers?.keywords ?? [],
    );
    if (keywordMatch) {
      matches.push({
        id: skillId,
        name,
        namespace,
        config,
        matchType: 'keyword',
        matchedBy: keywordMatch,
      });
      continue;
    }

    // Try intent pattern matching
    const patternMatch = matchIntentPatterns(
      prompt,
      config.promptTriggers?.intentPatterns ?? [],
    );
    if (patternMatch) {
      matches.push({
        id: skillId,
        name,
        namespace,
        config,
        matchType: 'intent',
        matchedBy: patternMatch,
      });
    }
  }

  // Apply priority threshold filter
  let filtered = matches;
  if (globalConfig?.priorityThreshold) {
    const priorityOrder: Record<Priority, number> = {
      critical: 0,
      high: 1,
      medium: 2,
      low: 3,
    };
    const threshold = priorityOrder[globalConfig.priorityThreshold];

    filtered = matches.filter(
      (match) => priorityOrder[match.config.priority] <= threshold,
    );
  }

  // Sort by priority (critical > high > medium > low)
  const priorityOrder: Record<Priority, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };

  filtered.sort(
    (a, b) =>
      priorityOrder[a.config.priority] - priorityOrder[b.config.priority],
  );

  // Apply maxSkillsPerPrompt limit
  if (globalConfig?.maxSkillsPerPrompt) {
    filtered = filtered.slice(0, globalConfig.maxSkillsPerPrompt);
  }

  return filtered;
}

/**
 * Format matched skills for output.
 *
 * Groups skills by priority and formats with box drawing and emojis.
 *
 * @param matches Array of matched skills
 * @returns Formatted string for stdout
 */
function formatOutput(matches: MatchedSkill[]): string {
  if (matches.length === 0) {
    return ''; // No output when no matches
  }

  // Group by priority
  const byPriority: Record<Priority, MatchedSkill[]> = {
    critical: [],
    high: [],
    medium: [],
    low: [],
  };

  for (const match of matches) {
    byPriority[match.config.priority].push(match);
  }

  // Build sections conditionally
  const criticalSection =
    byPriority.critical.length > 0
      ? [
          '[CRITICAL] REQUIRED SKILLS:',
          ...byPriority.critical.map((match) => '  -> ' + match.name),
          '',
        ]
      : [];

  const highSection =
    byPriority.high.length > 0
      ? [
          '[RECOMMENDED] SKILLS:',
          ...byPriority.high.map((match) => '  -> ' + match.name),
          '',
        ]
      : [];

  const mediumSection =
    byPriority.medium.length > 0
      ? [
          '[OPTIONAL] SKILLS:',
          ...byPriority.medium.map((match) => '  -> ' + match.name),
          '',
        ]
      : [];

  const lowSection =
    byPriority.low.length > 0
      ? [
          '[SUGGESTED] SKILLS:',
          ...byPriority.low.map((match) => '  -> ' + match.name),
          '',
        ]
      : [];

  const lines = [
    '='.repeat(60),
    'SKILL ACTIVATION CHECK',
    '='.repeat(60),
    '',
    ...criticalSection,
    ...highSection,
    ...mediumSection,
    ...lowSection,
    'ACTION: Use Skill tool BEFORE responding',
    '='.repeat(60),
  ];

  return lines.join('\n');
}

/**
 * Main hook execution.
 *
 * Workflow:
 * 1. Check Bun runtime
 * 2. Parse stdin
 * 3. Discover plugin rules
 * 4. Load project overrides
 * 5. Merge rules
 * 6. Match prompt
 * 7. Format output
 * 8. Exit cleanly
 */
async function main(): Promise<void> {
  const startTime = Date.now();

  try {
    // 1. Check runtime
    checkBunRuntime();

    // 2. Parse input
    const input = await parseStdin();

    // 3. Discover plugin rules
    const pluginRules = discoverPluginRules(input.cwd);

    // 4. Load project overrides
    const projectOverrides = loadProjectOverrides(input.cwd);

    // 5. Merge rules
    const mergedSkills = mergeRules(pluginRules, projectOverrides);

    // 6. Match skills
    const matches = matchSkills(
      input.prompt,
      mergedSkills,
      projectOverrides?.global,
    );

    // 7. Format and output
    const output = formatOutput(matches);
    if (output) {
      console.log(output);
    }

    // Performance monitoring
    const duration = Date.now() - startTime;
    if (duration > 50) {
      console.warn('[WARNING]  Slow hook execution: ' + duration + 'ms');
    }

    process.exit(0);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('[ERROR] Hook error: ' + msg);
    // Exit 0 to not block user workflow on hook error
    process.exit(0);
  }
}

// Execute
await main();
