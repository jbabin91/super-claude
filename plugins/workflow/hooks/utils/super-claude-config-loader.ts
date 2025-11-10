/**
 * Super Claude Configuration Loader
 *
 * Loads unified plugin configuration from super-claude-config.json files
 * with support for:
 * - Plugin defaults (plugins/{plugin}/super-claude-config.json)
 * - Project overrides (.claude/super-claude-config.json)
 * - Legacy skill-rules.json backwards compatibility
 * - Environment variable overrides (highest priority)
 * - Deep merge with caching for performance (<50ms)
 *
 * Loading priority: env vars > project overrides > plugin defaults
 *
 * @see {@link https://github.com/jbabin91/super-claude} for documentation
 */

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import type {
  HookConfig,
  LegacySkillRules,
  PluginConfig,
  ProjectConfig,
  ResolvedConfig,
  SkillConfig,
} from './config-types.js';
import {
  validateLegacySkillRules,
  validatePluginConfig,
  validateProjectConfig,
} from './config-validation.js';

/**
 * Configuration cache for performance
 * Key: pluginName:cwd
 */
const configCache = new Map<string, ResolvedConfig>();

/**
 * Deep merge two objects
 *
 * Arrays are replaced entirely (not merged item-by-item)
 * Nested objects are merged recursively
 *
 * @param target Target object
 * @param source Source object with overrides
 * @returns Merged object
 */
function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: Partial<T>,
): T {
  const result = { ...target };

  for (const key in source) {
    const sourceValue = source[key];
    const targetValue = result[key];

    if (sourceValue === undefined) {
      continue;
    }

    // Arrays: replace entirely
    if (Array.isArray(sourceValue)) {
      result[key] = sourceValue as T[Extract<keyof T, string>];
      continue;
    }

    // Objects: merge recursively
    if (
      typeof sourceValue === 'object' &&
      sourceValue !== null &&
      typeof targetValue === 'object' &&
      targetValue !== null &&
      !Array.isArray(targetValue)
    ) {
      result[key] = deepMerge(
        targetValue as Record<string, unknown>,
        sourceValue as Record<string, unknown>,
      ) as T[Extract<keyof T, string>];
      continue;
    }

    // Primitives: replace
    result[key] = sourceValue as T[Extract<keyof T, string>];
  }

  return result;
}

/**
 * Load JSON file safely
 *
 * @param filePath Path to JSON file
 * @returns Parsed JSON or null if not found/invalid
 */
function loadJsonFile(filePath: string): unknown {
  if (!existsSync(filePath)) {
    return null;
  }

  try {
    const content = readFileSync(filePath, 'utf8');
    return JSON.parse(content) as unknown;
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[ERROR] Failed to load ${filePath}: ${msg}`);
    return null;
  }
}

/**
 * Find plugin root directory
 *
 * Searches upward from current file to find plugins directory
 *
 * @param cwd Current working directory
 * @returns Path to plugin root or null if not found
 */
function findPluginRoot(cwd: string): string | null {
  // Try to find plugins directory by searching upward
  let current = cwd;
  const root = path.parse(current).root;

  while (current !== root) {
    const pluginsDir = path.join(current, 'plugins');
    if (existsSync(pluginsDir)) {
      return current;
    }
    current = path.dirname(current);
  }

  return null;
}

/**
 * Load plugin default configuration
 *
 * Tries to load from:
 * 1. plugins/{plugin}/super-claude-config.json
 * 2. plugins/{plugin}/skill-rules.json (legacy, with warning)
 *
 * @param cwd Current working directory
 * @param pluginName Plugin name
 * @returns Plugin configuration or empty config
 */
function loadPluginDefaults(
  cwd: string,
  pluginName: string,
): Partial<PluginConfig> {
  const pluginRoot = findPluginRoot(cwd);
  if (!pluginRoot) {
    console.error(
      `[WARNING] Could not find plugin root from ${cwd}, using empty defaults`,
    );
    return { plugin: pluginName, skills: {}, hooks: {} };
  }

  const pluginDir = path.join(pluginRoot, 'plugins', pluginName);

  // Try new format first
  const configPath = path.join(pluginDir, 'super-claude-config.json');
  const configData = loadJsonFile(configPath);

  if (configData) {
    const result = validatePluginConfig(configData);

    if (!result.success) {
      console.error(
        `[ERROR] Invalid plugin config in ${pluginName}:\n${result.errors}`,
      );
      return { plugin: pluginName, skills: {}, hooks: {} };
    }

    return result.data;
  }

  // Try legacy format
  const legacyPath = path.join(pluginDir, 'skill-rules.json');
  const legacyData = loadJsonFile(legacyPath);

  if (legacyData) {
    console.warn(
      `[DEPRECATION] ${pluginName} using deprecated skill-rules.json. Migrate to super-claude-config.json`,
    );

    const result = validateLegacySkillRules(legacyData);

    if (!result.success) {
      console.error(
        `[ERROR] Invalid legacy config in ${pluginName}:\n${result.errors}`,
      );
      return { plugin: pluginName, skills: {}, hooks: {} };
    }

    // Convert legacy format to new format
    return convertLegacyFormat(result.data, pluginName);
  }

  // No config found, use empty defaults
  return { plugin: pluginName, skills: {}, hooks: {} };
}

/**
 * Convert legacy skill-rules.json to new format
 *
 * @param legacy Legacy skill rules
 * @param pluginName Plugin name
 * @returns Plugin configuration
 */
function convertLegacyFormat(
  legacy: LegacySkillRules,
  pluginName: string,
): Partial<PluginConfig> {
  const skills: Record<string, SkillConfig> = {};

  for (const [skillName, skillData] of Object.entries(legacy.skills)) {
    skills[skillName] = {
      enabled: !legacy.overrides?.disabled?.includes(
        `${legacy.plugin.namespace}/${skillName}`,
      ),
      triggers: {
        keywords: skillData.promptTriggers?.keywords ?? [],
        patterns: skillData.promptTriggers?.intentPatterns ?? [],
      },
    };
  }

  return {
    plugin: pluginName,
    skills,
    hooks: {},
  };
}

/**
 * Load project override configuration
 *
 * Loads from .claude/super-claude-config.json
 *
 * @param cwd Current working directory
 * @returns Project configuration or null
 */
function loadProjectOverrides(cwd: string): ProjectConfig | null {
  const overridePath = path.join(cwd, '.claude', 'super-claude-config.json');
  const overrideData = loadJsonFile(overridePath);

  if (!overrideData) {
    return null;
  }

  const result = validateProjectConfig(overrideData);

  if (!result.success) {
    console.error(`[ERROR] Invalid project config:\n${result.errors}`);
    return null;
  }

  return result.data;
}

/**
 * Apply environment variable overrides
 *
 * Environment variables have highest priority.
 * Format: CLAUDE_HOOK_{HOOK_NAME}_ENABLED=true|false
 *
 * @param config Configuration to modify
 * @param pluginName Plugin name (for logging)
 */
function applyEnvironmentOverrides(
  config: ResolvedConfig,
  pluginName: string,
): void {
  // Hook enabled overrides
  for (const hookName of Object.keys(config.hooks)) {
    const envKey = `CLAUDE_HOOK_${hookName.replaceAll(/[A-Z]/g, (m) => `_${m}`).toUpperCase()}`;
    const envValue = process.env[envKey];

    if (envValue !== undefined) {
      config.hooks[hookName].enabled = envValue === 'true' || envValue === '1';
      console.error(
        `[DEBUG] ${pluginName}:${hookName} enabled=${config.hooks[hookName].enabled} (from ${envKey})`,
      );
    }
  }
}

/**
 * Load and merge configuration for a plugin
 *
 * Merge order: plugin defaults → project overrides → env vars
 *
 * @param cwd Current working directory
 * @param pluginName Plugin name
 * @param useCache Whether to use cached config
 * @returns Resolved configuration
 */
export function loadPluginConfig(
  cwd: string,
  pluginName: string,
  useCache = true,
): ResolvedConfig {
  const cacheKey = `${pluginName}:${cwd}`;

  // Check cache
  if (useCache && configCache.has(cacheKey)) {
    return configCache.get(cacheKey)!;
  }

  // Load plugin defaults
  const pluginDefaults = loadPluginDefaults(cwd, pluginName);

  // Load project overrides
  const projectOverrides = loadProjectOverrides(cwd);

  // Start with plugin defaults
  const resolved: ResolvedConfig = {
    skills: pluginDefaults.skills ?? {},
    hooks: pluginDefaults.hooks ?? {},
  };

  // Apply project overrides for this plugin
  if (projectOverrides?.[pluginName]) {
    const pluginOverrides = projectOverrides[pluginName];

    if (pluginOverrides.skills) {
      for (const [skillName, skillOverride] of Object.entries(
        pluginOverrides.skills,
      )) {
        const defaultSkill = resolved.skills[skillName] ?? {
          enabled: true,
          triggers: { keywords: [], patterns: [] },
        };
        resolved.skills[skillName] = deepMerge(defaultSkill, skillOverride);
      }
    }

    if (pluginOverrides.hooks) {
      for (const [hookName, hookOverride] of Object.entries(
        pluginOverrides.hooks,
      )) {
        const defaultHook = resolved.hooks[hookName] ?? { enabled: true };
        resolved.hooks[hookName] = deepMerge(defaultHook, hookOverride);
      }
    }
  }

  // Apply environment variable overrides (highest priority)
  applyEnvironmentOverrides(resolved, pluginName);

  // Cache result
  configCache.set(cacheKey, resolved);

  return resolved;
}

/**
 * Get hook configuration
 *
 * @param cwd Current working directory
 * @param pluginName Plugin name
 * @param hookName Hook name
 * @returns Hook configuration
 */
export function getHookConfig(
  cwd: string,
  pluginName: string,
  hookName: string,
): HookConfig {
  const config = loadPluginConfig(cwd, pluginName);
  return config.hooks[hookName] ?? { enabled: true };
}

/**
 * Get skill configuration
 *
 * @param cwd Current working directory
 * @param pluginName Plugin name
 * @param skillName Skill name
 * @returns Skill configuration
 */
export function getSkillConfig(
  cwd: string,
  pluginName: string,
  skillName: string,
): SkillConfig {
  const config = loadPluginConfig(cwd, pluginName);
  return (
    config.skills[skillName] ?? {
      enabled: true,
      triggers: { keywords: [], patterns: [] },
    }
  );
}

/**
 * Check if hook is enabled
 *
 * Convenience function that exits cleanly if hook is disabled.
 *
 * @param cwd Current working directory
 * @param pluginName Plugin name
 * @param hookName Hook name
 * @returns true if enabled, exits if disabled
 */
export function checkHookEnabled(
  cwd: string,
  pluginName: string,
  hookName: string,
): boolean {
  const config = getHookConfig(cwd, pluginName, hookName);

  if (!config.enabled) {
    console.error(`[DEBUG] ${pluginName}:${hookName} disabled by config`);
    process.exit(0);
  }

  return true;
}

/**
 * Clear configuration cache
 *
 * Useful for testing or when config files are modified
 */
export function clearConfigCache(): void {
  configCache.clear();
}
