/**
 * Runtime validation schemas for super-claude-config.json
 *
 * Uses ArkType for TypeScript-native validation with excellent error messages.
 */

import { type } from 'arktype';

import type {
  HookConfig,
  LegacySkillRules,
  PluginConfig,
  ProjectConfig,
  SkillConfig,
} from './config-types.js';

/**
 * Skill configuration validation schema
 */
export const skillConfigSchema = type({
  'enabled?': 'boolean',
  'triggers?': 'object',
});

/**
 * Hook configuration validation schema
 *
 * Allows additional properties for hook-specific settings
 */
export const hookConfigSchema = type({
  'enabled?': 'boolean',
});

/**
 * Plugin-level configuration validation schema
 */
export const pluginConfigSchema = type({
  plugin: 'string',
  'skills?': 'object',
  'hooks?': 'object',
});

/**
 * Legacy skill-rules.json validation schema
 */
export const legacySkillRulesSchema = type({
  plugin: {
    namespace: 'string',
    name: 'string',
  },
  skills: 'object',
  'overrides?': {
    'disabled?': 'string[]',
  },
});

/**
 * Validation result type
 */
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: string };

/**
 * Validate plugin configuration
 *
 * @param data Configuration data to validate
 * @returns Validation result with typed data or errors
 */
export function validatePluginConfig(
  data: unknown,
): ValidationResult<PluginConfig> {
  const result = pluginConfigSchema(data);

  if (result instanceof type.errors) {
    return {
      success: false,
      errors: result.summary,
    };
  }

  return {
    success: true,
    data: result as PluginConfig,
  };
}

/**
 * Validate project configuration
 *
 * @param data Configuration data to validate
 * @returns Validation result with typed data or errors
 */
export function validateProjectConfig(
  data: unknown,
): ValidationResult<ProjectConfig> {
  // Basic object check
  if (typeof data !== 'object' || data === null) {
    return {
      success: false,
      errors: 'Project configuration must be an object',
    };
  }

  return {
    success: true,
    data: data as ProjectConfig,
  };
}

/**
 * Validate skill configuration
 *
 * @param data Skill config data to validate
 * @returns Validation result with typed data or errors
 */
export function validateSkillConfig(
  data: unknown,
): ValidationResult<SkillConfig> {
  const result = skillConfigSchema(data);

  if (result instanceof type.errors) {
    return {
      success: false,
      errors: result.summary,
    };
  }

  return {
    success: true,
    data: result as SkillConfig,
  };
}

/**
 * Validate hook configuration
 *
 * @param data Hook config data to validate
 * @returns Validation result with typed data or errors
 */
export function validateHookConfig(
  data: unknown,
): ValidationResult<HookConfig> {
  const result = hookConfigSchema(data);

  if (result instanceof type.errors) {
    return {
      success: false,
      errors: result.summary,
    };
  }

  return {
    success: true,
    data: result as HookConfig,
  };
}

/**
 * Validate legacy skill-rules.json format
 *
 * @param data Legacy config data to validate
 * @returns Validation result with typed data or errors
 */
export function validateLegacySkillRules(
  data: unknown,
): ValidationResult<LegacySkillRules> {
  const result = legacySkillRulesSchema(data);

  if (result instanceof type.errors) {
    return {
      success: false,
      errors: result.summary,
    };
  }

  return {
    success: true,
    data: result as LegacySkillRules,
  };
}
