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
  echo "⚠️  Plugin version warnings:"
  echo -e "$VERSION_WARNINGS"
  echo ""
  echo "Consider updating versions in:"
  echo "  - plugins/{plugin}/.claude-plugin/plugin.json"
  echo "  - .claude-plugin/marketplace.json"
  echo "  - CHANGELOG.md"
  echo ""
  read -p "Continue anyway? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

echo "✓ Plugin version check complete"
exit 0
