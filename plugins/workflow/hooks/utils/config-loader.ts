/**
 * Hook Configuration Loader
 *
 * Loads hook configuration from multiple sources with priority:
 * 1. Environment variables (CLAUDE_HOOK_{NAME}_ENABLED) - session override
 * 2. .claude/settings.local.json (gitignored, personal overrides)
 * 3. .claude/settings.json (project, committed)
 * 4. .claude/super-claude-config.json (unified plugin config)
 * 5. ~/.claude/settings.json (global user defaults)
 * 6. Plugin defaults (enabled: true)
 *
 * Supports both native Claude Code settings (customHooks) and unified plugin config (workflow.hooks).
 *
 * @see {@link https://docs.claude.com/en/docs/claude-code/settings} for settings hierarchy
 */

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

/**
 * Hook configuration schema
 */
export type HookConfig = {
  enabled: boolean;
  [key: string]: unknown; // Allow hook-specific config
};

/**
 * Settings file schema (partial - only customHooks)
 */
type SettingsFile = {
  customHooks?: Record<string, HookConfig>;
  [key: string]: unknown;
};

/**
 * Unified plugin config schema (partial - only workflow.hooks)
 */
type UnifiedConfig = {
  workflow?: {
    hooks?: Record<string, HookConfig>;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

/**
 * Load settings file safely
 *
 * @param filePath Path to settings.json file
 * @returns Parsed settings or null if not found/invalid
 */
function loadSettingsFile(filePath: string): SettingsFile | null {
  if (!existsSync(filePath)) {
    return null;
  }

  try {
    const content = readFileSync(filePath, 'utf8');
    return JSON.parse(content) as SettingsFile;
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.warn(`[WARNING] Failed to load ${filePath}: ${msg}`);
    return null;
  }
}

/**
 * Load unified plugin config file safely
 *
 * @param filePath Path to super-claude-config.json file
 * @returns Parsed config or null if not found/invalid
 */
function loadUnifiedConfig(filePath: string): UnifiedConfig | null {
  if (!existsSync(filePath)) {
    return null;
  }

  try {
    const content = readFileSync(filePath, 'utf8');
    return JSON.parse(content) as UnifiedConfig;
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.warn(`[WARNING] Failed to load ${filePath}: ${msg}`);
    return null;
  }
}

/**
 * Load hook configuration from settings hierarchy
 *
 * Configuration priority (highest to lowest):
 * 1. Environment variables (CLAUDE_HOOK_{HOOK_NAME}_ENABLED)
 * 2. Local overrides (.claude/settings.local.json)
 * 3. Project settings (.claude/settings.json)
 * 4. Unified plugin config (.claude/super-claude-config.json)
 * 5. Global settings (~/.claude/settings.json)
 * 6. Default (enabled: true)
 *
 * @param cwd Current working directory
 * @param hookName Hook name (e.g., 'gitCommitGuard')
 * @returns Hook configuration
 *
 * @example
 * ```ts
 * const config = loadHookConfig(cwd, 'gitCommitGuard');
 * if (!config.enabled) {
 *   console.log('Hook disabled by config');
 *   process.exit(0);
 * }
 * ```
 */
export function loadHookConfig(cwd: string, hookName: string): HookConfig {
  // Load all config files
  const localPath = path.join(cwd, '.claude', 'settings.local.json');
  const projectPath = path.join(cwd, '.claude', 'settings.json');
  const unifiedPath = path.join(cwd, '.claude', 'super-claude-config.json');
  const globalPath = path.join(
    process.env.HOME ?? process.env.USERPROFILE ?? '~',
    '.claude',
    'settings.json',
  );

  const local = loadSettingsFile(localPath);
  const project = loadSettingsFile(projectPath);
  const unified = loadUnifiedConfig(unifiedPath);
  const global = loadSettingsFile(globalPath);

  // Check environment variable override
  const envKey = `CLAUDE_HOOK_${hookName.toUpperCase()}_ENABLED`;
  const envEnabled = process.env[envKey];

  // Merge config in reverse priority order (lowest to highest)
  const config: HookConfig = { enabled: true };

  // 1. Start with global settings
  if (global?.customHooks?.[hookName]) {
    Object.assign(config, global.customHooks[hookName]);
  }

  // 2. Override with unified plugin config
  if (unified?.workflow?.hooks?.[hookName]) {
    Object.assign(config, unified.workflow.hooks[hookName]);
  }

  // 3. Override with project settings
  if (project?.customHooks?.[hookName]) {
    Object.assign(config, project.customHooks[hookName]);
  }

  // 4. Override with local settings
  if (local?.customHooks?.[hookName]) {
    Object.assign(config, local.customHooks[hookName]);
  }

  // 5. Override with environment variable (highest priority)
  if (envEnabled !== undefined) {
    config.enabled = envEnabled === 'true' || envEnabled === '1';
  }

  return config;
}

/**
 * Check if hook is enabled
 *
 * Convenience function that exits cleanly if hook is disabled.
 * Call this at the start of your hook to respect user configuration.
 *
 * @param cwd Current working directory
 * @param hookName Hook name
 * @returns true if enabled, never returns if disabled (exits process)
 *
 * @example
 * ```ts
 * const input = await parseStdin();
 * checkHookEnabled(input.cwd, 'gitCommitGuard'); // Exits if disabled
 * // Continue with hook logic...
 * ```
 */
export function checkHookEnabled(cwd: string, hookName: string): boolean {
  const config = loadHookConfig(cwd, hookName);

  if (!config.enabled) {
    // Exit cleanly without output (hook disabled)
    process.exit(0);
  }

  return true;
}
