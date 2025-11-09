#!/bin/bash
# Check if plugin changes require version bumps

set -e

# Get list of changed files in plugins/
CHANGED_PLUGINS=$(git diff --name-only origin/main...HEAD | grep '^plugins/' | cut -d'/' -f2 | sort -u)

if [ -z "$CHANGED_PLUGINS" ]; then
  echo "✓ No plugin changes detected"
  exit 0
fi

echo "🔍 Checking plugin version updates..."

VERSION_WARNINGS=""

for plugin in $CHANGED_PLUGINS; do
  PLUGIN_PATH="plugins/$plugin"
  PLUGIN_JSON="$PLUGIN_PATH/.claude-plugin/plugin.json"

  if [ ! -f "$PLUGIN_JSON" ]; then
    continue
  fi

  # Check if plugin files changed (excluding docs)
  PLUGIN_FILES_CHANGED=$(git diff --name-only origin/main...HEAD | grep "^$PLUGIN_PATH/" | grep -v -E '(README|CHANGELOG|\.md$)' | wc -l)

  if [ "$PLUGIN_FILES_CHANGED" -gt 0 ]; then
    # Check if plugin.json was modified
    PLUGIN_JSON_CHANGED=$(git diff --name-only origin/main...HEAD | grep -c "^$PLUGIN_JSON$" || true)

    if [ "$PLUGIN_JSON_CHANGED" -eq 0 ]; then
      CURRENT_VERSION=$(jq -r '.version' "$PLUGIN_JSON")
      VERSION_WARNINGS="${VERSION_WARNINGS}\n  ⚠️  $plugin: Files changed but version still $CURRENT_VERSION"
    fi
  fi
done

if [ -n "$VERSION_WARNINGS" ]; then
  echo ""
  echo "❌ Plugin changes detected without version bump:"
  echo -e "$VERSION_WARNINGS"
  echo ""
  echo "Required actions:"
  echo "  1. Bump version: ./scripts/bump-version.sh <plugin-name> <patch|minor|major>"
  echo "  2. Update: .claude-plugin/marketplace.json"
  echo "  3. Document: CHANGELOG.md"
  echo ""

  # Check for bypass methods (in order of preference)
  BYPASS_REASON=""

  # Method 1: Environment variable (one-time bypass)
  if [ "${SKIP_VERSION_CHECK}" = "true" ]; then
    BYPASS_REASON="SKIP_VERSION_CHECK environment variable"
  fi

  # Method 2: Git config (persistent bypass)
  if [ -z "$BYPASS_REASON" ] && [ "$(git config --get hooks.skipVersionCheck)" = "true" ]; then
    BYPASS_REASON="git config hooks.skipVersionCheck=true"
  fi

  # Method 3: .skip-version-check file (project-level bypass)
  if [ -z "$BYPASS_REASON" ] && [ -f ".skip-version-check" ]; then
    BYPASS_REASON=".skip-version-check file present"
  fi

  if [ -n "$BYPASS_REASON" ]; then
    echo "⚠️  Bypassing version check: $BYPASS_REASON"
    echo ""
  else
    echo "To bypass this check (choose one method):"
    echo ""
    echo "  One-time bypass:"
    echo "    SKIP_VERSION_CHECK=true git push"
    echo ""
    echo "  Persistent bypass (user-level):"
    echo "    git config hooks.skipVersionCheck true"
    echo ""
    echo "  Project-level bypass (gitignored):"
    echo "    touch .skip-version-check"
    echo ""
    exit 1
  fi
fi

echo "✓ Plugin version check complete"
exit 0
