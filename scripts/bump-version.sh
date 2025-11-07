#!/bin/bash
# Helper script to bump plugin and marketplace versions

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

show_help() {
  cat << EOF
Usage: ./scripts/bump-version.sh <plugin-name> <bump-type>

Bump plugin and marketplace versions for a plugin.

Arguments:
  plugin-name   Name of the plugin (e.g., workflow, meta)
  bump-type     Version bump type: patch, minor, or major

Examples:
  ./scripts/bump-version.sh workflow minor
  ./scripts/bump-version.sh meta patch

What each bump type means:
  patch (0.0.X)  Bug fixes, small updates
  minor (0.X.0)  New features, backward compatible
  major (X.0.0)  Breaking changes

This script will:
  1. Bump version in plugins/{plugin}/.claude-plugin/plugin.json
  2. Bump version in .claude-plugin/marketplace.json
  3. Show what changed

You still need to manually:
  - Update CHANGELOG.md
  - Commit the changes
EOF
}

bump_semver() {
  local version=$1
  local bump_type=$2

  IFS='.' read -ra PARTS <<< "$version"
  local major=${PARTS[0]}
  local minor=${PARTS[1]}
  local patch=${PARTS[2]}

  case $bump_type in
    major)
      major=$((major + 1))
      minor=0
      patch=0
      ;;
    minor)
      minor=$((minor + 1))
      patch=0
      ;;
    patch)
      patch=$((patch + 1))
      ;;
    *)
      echo "Invalid bump type: $bump_type"
      exit 1
      ;;
  esac

  echo "$major.$minor.$patch"
}

# Check arguments
if [ $# -ne 2 ]; then
  show_help
  exit 1
fi

PLUGIN_NAME=$1
BUMP_TYPE=$2

# Validate bump type
if [[ ! "$BUMP_TYPE" =~ ^(patch|minor|major)$ ]]; then
  echo -e "${RED}Error: bump-type must be 'patch', 'minor', or 'major'${NC}"
  exit 1
fi

PLUGIN_JSON="plugins/$PLUGIN_NAME/.claude-plugin/plugin.json"
MARKETPLACE_JSON=".claude-plugin/marketplace.json"

# Check if plugin exists
if [ ! -f "$PLUGIN_JSON" ]; then
  echo -e "${RED}Error: Plugin not found at $PLUGIN_JSON${NC}"
  exit 1
fi

echo -e "${BLUE}🔧 Bumping versions for plugin: $PLUGIN_NAME${NC}"
echo ""

# Get current versions
CURRENT_PLUGIN_VERSION=$(jq -r '.version' "$PLUGIN_JSON")
CURRENT_MARKETPLACE_VERSION=$(jq -r '.metadata.version' "$MARKETPLACE_JSON")

# Calculate new versions
NEW_PLUGIN_VERSION=$(bump_semver "$CURRENT_PLUGIN_VERSION" "$BUMP_TYPE")
NEW_MARKETPLACE_VERSION=$(bump_semver "$CURRENT_MARKETPLACE_VERSION" "$BUMP_TYPE")

# Show what will change
echo -e "${YELLOW}Changes:${NC}"
echo "  Plugin version:      $CURRENT_PLUGIN_VERSION → $NEW_PLUGIN_VERSION"
echo "  Marketplace version: $CURRENT_MARKETPLACE_VERSION → $NEW_MARKETPLACE_VERSION"
echo ""

# Confirm
read -p "Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Aborted"
  exit 0
fi

# Update plugin.json
echo -e "${BLUE}Updating $PLUGIN_JSON...${NC}"
jq ".version = \"$NEW_PLUGIN_VERSION\"" "$PLUGIN_JSON" > "$PLUGIN_JSON.tmp"
mv "$PLUGIN_JSON.tmp" "$PLUGIN_JSON"

# Update marketplace.json - plugin version
echo -e "${BLUE}Updating plugin version in marketplace.json...${NC}"
jq --arg name "$PLUGIN_NAME" --arg version "$NEW_PLUGIN_VERSION" \
  '(.plugins[] | select(.name == $name) | .version) = $version' \
  "$MARKETPLACE_JSON" > "$MARKETPLACE_JSON.tmp"
mv "$MARKETPLACE_JSON.tmp" "$MARKETPLACE_JSON"

# Update marketplace.json - marketplace version
echo -e "${BLUE}Updating marketplace version...${NC}"
jq ".metadata.version = \"$NEW_MARKETPLACE_VERSION\"" "$MARKETPLACE_JSON" > "$MARKETPLACE_JSON.tmp"
mv "$MARKETPLACE_JSON.tmp" "$MARKETPLACE_JSON"

echo ""
echo -e "${GREEN}✓ Versions updated successfully!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Review changes: git diff"
echo "  2. Update CHANGELOG.md with changes"
echo "  3. Commit: git add . && git commit -m \"chore: bump $PLUGIN_NAME to v$NEW_PLUGIN_VERSION\""
echo ""
