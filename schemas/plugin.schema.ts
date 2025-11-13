import { type } from 'arktype';

import { hooksSchema } from './hooks.schema';

/**
 * Common patterns matching .claude-plugin/plugin.schema.json
 */
const patterns = {
  // Plugin name must be kebab-case
  kebabCase: (s: string) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(s),
  // Semantic versioning
  semver: (s: string) =>
    /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/.test(s),
  // Paths must start with ./
  relativePath: (s: string) => /^\.\/.*$/.test(s),
  // Basic email format
  email: (s: string) =>
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
      s,
    ),
  // Basic URL format
  url: (s: string) => /^https?:\/\/.+$/.test(s),
};

/**
 * Author information schema
 * Name is required for consistency with marketplace owner requirement
 */
const authorSchema = type({
  name: 'string', // Required
  'email?': type('string', ':', patterns.email),
  'url?': type('string', ':', patterns.url),
});

/**
 * Path validation - single path or array of paths starting with ./
 */
const pathOrPaths = type('string', ':', patterns.relativePath).or(
  type('string', ':', patterns.relativePath).array(),
);

/**
 * MCP servers can be a path to .mcp.json OR inline server configurations
 * When inline, it's an object where keys are server names and values are configs
 *
 * Note: Full nested validation would require Record<string, mcpServerConfigSchema>
 * where mcpServerConfigSchema validates: { command: string, args?: string[], env?: Record<string, string>, cwd?: string }
 * However, arktype doesn't support this nested pattern easily. The JSON schema handles full validation.
 */
const mcpServersSchema = type('string', ':', patterns.relativePath).or(
  type('Record<string, object>'), // Record of server name to config
);

/**
 * Plugin manifest schema for .claude-plugin/plugin.json
 *
 * Based on .claude-plugin/plugin.schema.json
 * Reference: https://code.claude.com/docs/en/plugins-reference.md
 *
 * NOTE: This schema is STRICT - it rejects unknown properties to match
 * Claude Code's runtime behavior. Uses .onUndeclaredKey("reject") to
 * enforce strict validation.
 * DO NOT add $schema to plugin.json - it will cause installation failures.
 */
export const pluginSchema = type({
  // Required fields
  name: type('string', ':', patterns.kebabCase),

  // Metadata fields
  'version?': type('string', ':', patterns.semver),
  'description?': 'string',
  'author?': authorSchema,
  'homepage?': type('string', ':', patterns.url),
  'repository?': type('string', ':', patterns.url),
  'license?': 'string',
  'keywords?': 'string[]',

  // Component path fields - must start with ./
  // NOTE: Only 4 component paths are officially recognized by Claude Code.
  // Skills are auto-discovered from skills/ directory - no manifest field needed.
  'commands?': pathOrPaths,
  'agents?': pathOrPaths,

  // Hooks: can be string path to hooks.json OR inline hooks object
  // When inline, must match hooksSchema structure
  'hooks?': type('string', ':', patterns.relativePath).or(hooksSchema),

  // MCP servers: can be string path or inline object
  'mcpServers?': mcpServersSchema,
}).onUndeclaredKey('reject');

export type PluginManifest = typeof pluginSchema.infer;
