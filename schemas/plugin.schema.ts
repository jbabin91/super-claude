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
 */
const authorSchema = type({
  name: 'string',
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
 * Plugin manifest schema for .claude-plugin/plugin.json
 *
 * Based on .claude-plugin/plugin.schema.json
 * Reference: https://code.claude.com/docs/en/plugins-reference.md
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
  'commands?': pathOrPaths,
  'agents?': pathOrPaths,
  'skills?': pathOrPaths,
  'subAgents?': pathOrPaths,

  // Hooks: can be string path to hooks.json OR inline hooks object
  // When inline, must match hooksSchema structure
  'hooks?': type('string', ':', patterns.relativePath).or(hooksSchema),

  // MCP servers: can be string path or inline object
  'mcpServers?': type('string', ':', patterns.relativePath).or(type('object')),
});

export type PluginManifest = typeof pluginSchema.infer;
