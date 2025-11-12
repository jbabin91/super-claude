/**
 * Runtime Check Utilities
 *
 * Validates runtime requirements for hooks (e.g., Bun installation).
 * Provides clear, actionable error messages when requirements aren't met.
 */

import { execSync } from 'node:child_process';

/**
 * Check if Bun is installed and available in PATH
 *
 * @throws Error with installation instructions if Bun is not found
 */
export function ensureBunInstalled(): void {
  try {
    // Use 'bun --version' for cross-platform compatibility (works on Windows, macOS, Linux)
    execSync('bun --version', { stdio: 'pipe' });
  } catch {
    const errorMessage = [
      '',
      '═'.repeat(70),
      '❌ BUN RUNTIME NOT FOUND',
      '═'.repeat(70),
      '',
      'This workflow hook requires Bun to be installed.',
      '',
      '📦 Install Bun:',
      '',
      '  macOS/Linux:',
      '    curl -fsSL https://bun.sh/install | bash',
      '',
      '  Windows:',
      '    powershell -c "irm bun.sh/install.ps1|iex"',
      '',
      '  Or via npm:',
      '    npm install -g bun',
      '',
      '  Or via Homebrew (macOS):',
      '    brew install oven-sh/bun/bun',
      '',
      '🔗 More info: https://bun.sh',
      '',
      '⚠️  After installing, restart your terminal and try again.',
      '',
      '═'.repeat(70),
      '',
    ].join('\n');

    console.error(errorMessage);
    process.exit(1);
  }
}

/**
 * Check Bun version meets minimum requirement
 *
 * @param minVersion Minimum required version (e.g., "1.0.0")
 * @returns true if version is sufficient, false otherwise
 */
export function checkBunVersion(minVersion: string): boolean {
  try {
    const version = execSync('bun --version', {
      encoding: 'utf8',
      stdio: 'pipe',
    }).trim();

    return compareVersions(version, minVersion) >= 0;
  } catch {
    return false;
  }
}

/**
 * Strip pre-release and build metadata from semver string
 *
 * @param version Version string (e.g., "1.0.0-beta", "1.0.0+build")
 * @returns Clean version (e.g., "1.0.0")
 */
function stripSemverMetadata(version: string): string {
  return version.split(/[-+]/)[0] || version;
}

/**
 * Compare two semantic versions
 *
 * Strips pre-release and build metadata before comparison.
 * Examples: "1.0.0-beta" → "1.0.0", "1.0.0+build" → "1.0.0"
 *
 * @param a Version string (e.g., "1.2.3", "1.2.3-beta")
 * @param b Version string (e.g., "1.0.0", "1.0.0+build")
 * @returns -1 if a < b, 0 if equal, 1 if a > b
 */
function compareVersions(a: string, b: string): number {
  const aParts = stripSemverMetadata(a).split('.').map(Number);
  const bParts = stripSemverMetadata(b).split('.').map(Number);

  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    const aPart = aParts[i] || 0;
    const bPart = bParts[i] || 0;

    if (aPart > bPart) return 1;
    if (aPart < bPart) return -1;
  }

  return 0;
}

/**
 * Ensure required command-line tools are installed
 *
 * @param tools Array of required tools (e.g., ['git', 'tsc'])
 * @throws Error with installation instructions if any tool is missing
 */
export function ensureToolsInstalled(tools: string[]): void {
  const missing: string[] = [];
  // Use platform-specific command: 'where' on Windows, 'which' on Unix-like systems
  const checkCommand = process.platform === 'win32' ? 'where' : 'which';

  for (const tool of tools) {
    try {
      execSync(`${checkCommand} ${tool}`, { stdio: 'pipe' });
    } catch {
      missing.push(tool);
    }
  }

  if (missing.length > 0) {
    const errorMessage = [
      '',
      '═'.repeat(70),
      '❌ MISSING REQUIRED TOOLS',
      '═'.repeat(70),
      '',
      `The following tools are required but not found: ${missing.join(', ')}`,
      '',
      'Please install the missing tools and try again.',
      '',
      '═'.repeat(70),
      '',
    ].join('\n');

    console.error(errorMessage);
    process.exit(1);
  }
}
