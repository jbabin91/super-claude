import { type } from 'arktype';

/**
 * Common patterns matching .claude-plugin/marketplace.schema.json
 */
const patterns = {
  // Marketplace/plugin name must be kebab-case
  kebabCase: (s: string) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(s),
  // Semantic versioning
  semver: (s: string) =>
    /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/.test(s),
  // Basic email format
  email: (s: string) =>
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
      s,
    ),
  // Basic URL format
  url: (s: string) => /^https?:\/\/.+$/.test(s),
};

/**
 * Owner/Author information schema
 */
const ownerSchema = type({
  name: 'string',
  'email?': type('string', ':', patterns.email),
  'url?': type('string', ':', patterns.url),
});

/**
 * Marketplace metadata schema
 */
const metadataSchema = type({
  version: type('string', ':', patterns.semver),
  description: 'string',
  'repository?': type('string', ':', patterns.url),
  'homepage?': type('string', ':', patterns.url),
  'license?': 'string',
});

/**
 * Plugin source - can be relative path, GitHub repo, or Git URL
 */
const pluginSourceSchema = type('string')
  .or(
    type({
      source: type('"github"'),
      repo: 'string', // Format: owner/repo
    }),
  )
  .or(
    type({
      source: type('"url"'),
      url: type('string', ':', patterns.url),
    }),
  );

/**
 * Plugin entry schema
 * Matches .claude-plugin/marketplace.schema.json plugin entry structure
 */
const pluginEntrySchema = type({
  // Required fields
  name: type('string', ':', patterns.kebabCase),
  source: pluginSourceSchema,

  // Optional metadata fields (can override plugin.json)
  'description?': 'string',
  'version?': type('string', ':', patterns.semver),
  'category?': 'string',
  'keywords?': 'string[]',
  'tags?': 'string[]', // Alternative to keywords
  'author?': type({
    name: 'string',
    'email?': type('string', ':', patterns.email),
    'url?': type('string', ':', patterns.url),
  }),
  'homepage?': type('string', ':', patterns.url),
  'repository?': type('string', ':', patterns.url),
  'license?': 'string',

  // Component paths (can override plugin.json)
  'commands?': 'string | string[]',
  'agents?': 'string | string[]',
  'hooks?': 'string | object', // Path to hooks.json or inline
  'mcpServers?': 'string | object', // Path to .mcp.json or inline

  // Behavior control
  'strict?': 'boolean', // Require plugin.json in plugin folder (default: true)
});

/**
 * Marketplace manifest schema for .claude-plugin/marketplace.json
 *
 * Based on .claude-plugin/marketplace.schema.json
 * Reference: https://code.claude.com/docs/en/plugin-marketplaces.md
 *
 * NOTE: This schema is STRICT - it rejects unknown properties to match
 * Claude Code's runtime behavior. Uses .onUndeclaredKey("reject") to
 * enforce strict validation.
 */
export const marketplaceSchema = type({
  name: type('string', ':', patterns.kebabCase),
  owner: ownerSchema,
  metadata: metadataSchema,
  plugins: pluginEntrySchema.array(),
  '$schema?': 'string', // Optional JSON Schema reference (allowed in marketplace.json)
}).onUndeclaredKey('reject');

export type MarketplaceManifest = typeof marketplaceSchema.infer;
