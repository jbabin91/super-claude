/**
 * Hook Configuration Loader
 *
 * Loads hook configuration from Claude Code settings hierarchy:
 * - Enterprise managed (highest priority)
 * - CLI args
 * - .claude/settings.local.json (gitignored, personal overrides)
 * - .claude/settings.json (project, committed)
 * - ~/.claude/settings.json (global)
 *
 * Uses custom namespace "customHooks" for hook-specific config.
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
 * Load hook configuration from settings hierarchy
 *
 * Follows Claude Code settings precedence:
 * 1. Local overrides (.claude/settings.local.json)
 * 2. Project settings (.claude/settings.json)
 * 3. Global settings (~/.claude/settings.json)
 * 4. Environment variables (CLAUDE_HOOK_{HOOK_NAME}_ENABLED)
 * 5. Default (enabled: true)
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
  // Load all settings files in precedence order
  const localPath = path.join(cwd, '.claude', 'settings.local.json');
  const projectPath = path.join(cwd, '.claude', 'settings.json');
  const globalPath = path.join(
    process.env.HOME ?? process.env.USERPROFILE ?? '~',
    '.claude',
    'settings.json',
  );

  const local = loadSettingsFile(localPath);
  const project = loadSettingsFile(projectPath);
  const global = loadSettingsFile(globalPath);

  // Check environment variable override
  const envKey = `CLAUDE_HOOK_${hookName.toUpperCase()}_ENABLED`;
  const envEnabled = process.env[envKey];

  // Merge config (local > project > global > env > default)
  const config: HookConfig = { enabled: true };

  // Start with global
  if (global?.customHooks?.[hookName]) {
    Object.assign(config, global.customHooks[hookName]);
  }

  // Override with project
  if (project?.customHooks?.[hookName]) {
    Object.assign(config, project.customHooks[hookName]);
  }

  // Override with local
  if (local?.customHooks?.[hookName]) {
    Object.assign(config, local.customHooks[hookName]);
  }

  // Override with environment variable
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
