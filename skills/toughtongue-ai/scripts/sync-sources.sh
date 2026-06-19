#!/usr/bin/env bash
# Regenerate skills/toughtongue-ai/snapshots/ from a local tough-tongue-ai checkout.
# Each output file gets a one-line header pinning the source commit SHA + date.
#
# Usage:
#   TT_SRC=/path/to/tough-tongue-ai ./sync-sources.sh
#
# If TT_SRC is unset, defaults to ../../../../tough-tongue-ai relative to this script.
#
# ------------------------------------------------------------------------------
# Control knobs — edit the table below to evolve what ships in the skill.
# ------------------------------------------------------------------------------
# Each row: <header-style>|<source-path-rel-to-TT_SRC>|<dest-path-rel-to-snapshots/>
# Header styles:
#   md   — HTML comment header (for .md files)
#   yaml — `# ...` comment header (for .yml/.yaml files)
#   txt  — `# ...` comment header + live-mirror note (for llms-full.txt)
#
# Add a row to ship a new snapshot; delete a row to stop shipping one.
# Glob in <source-path> is supported via the trailing "/*.md" form — see handbook row.
SOURCES=(
  "txt|www/public/llms-full.txt|llms-full.txt"
  "yaml|py/jarvis/boxman/claude_box/repo-base/schema/scenario-schema.yml|scenario-schema.yml"
  "md|py/jarvis/boxman/claude_box/repo-base/handbooks/*.md|handbooks/"
)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SNAPSHOTS="$SKILL_DIR/snapshots"

TT_SRC="${TT_SRC:-$SKILL_DIR/../../../../tough-tongue-ai}"

if [[ ! -d "$TT_SRC/.git" ]]; then
  echo "ERROR: TT_SRC=$TT_SRC is not a git checkout of tough-tongue-ai" >&2
  exit 1
fi

SHORT_SHA="$(git -C "$TT_SRC" rev-parse --short HEAD)"
COMMIT_DATE="$(git -C "$TT_SRC" log -1 --format='%cI')"
PINNED_AT="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

# Wipe snapshots/ before regenerating so removed rows actually leave the tree.
rm -rf "$SNAPSHOTS"
mkdir -p "$SNAPSHOTS"

# write_header <style> <out-path> <src-rel> ----
write_header() {
  local style="$1" out="$2" src_rel="$3"
  case "$style" in
    md)
      cat > "$out" <<EOF
<!-- Pinned snapshot. Do not edit by hand. Regenerate with scripts/sync-sources.sh. -->
<!-- Source: tough-tongue-ai/$src_rel @ $SHORT_SHA ($COMMIT_DATE) -->
<!-- Pinned at: $PINNED_AT -->

EOF
      ;;
    yaml)
      cat > "$out" <<EOF
# Pinned snapshot. Do not edit by hand. Regenerate with scripts/sync-sources.sh.
# Source: tough-tongue-ai/$src_rel @ $SHORT_SHA ($COMMIT_DATE)
# Pinned at: $PINNED_AT

EOF
      ;;
    txt)
      cat > "$out" <<EOF
# Pinned snapshot. Do not edit by hand. Regenerate with scripts/sync-sources.sh.
# Source: tough-tongue-ai/$src_rel @ $SHORT_SHA ($COMMIT_DATE)
# Pinned at: $PINNED_AT
# Live mirror: https://app.toughtongueai.com/llms-full.txt

EOF
      ;;
    *)
      echo "ERROR: unknown header style: $style" >&2; exit 1 ;;
  esac
}

# sync_row <style> <src-rel> <dest-rel> ----
# If src ends in /*.<ext>, expands to every matching file and writes into dest/ dir.
# Otherwise copies the single file.
sync_row() {
  local style="$1" src_rel="$2" dest_rel="$3"

  if [[ "$src_rel" == *"*"* ]]; then
    local dest_dir="$SNAPSHOTS/${dest_rel%/}"
    mkdir -p "$dest_dir"
    for src in "$TT_SRC"/$src_rel; do
      [[ -e "$src" ]] || { echo "ERROR: no matches for $src_rel" >&2; exit 1; }
      local name out src_rel_resolved
      name="$(basename "$src")"
      out="$dest_dir/$name"
      src_rel_resolved="${src_rel%/*}/$name"
      write_header "$style" "$out" "$src_rel_resolved"
      cat "$src" >> "$out"
    done
  else
    local out="$SNAPSHOTS/$dest_rel"
    mkdir -p "$(dirname "$out")"
    write_header "$style" "$out" "$src_rel"
    cat "$TT_SRC/$src_rel" >> "$out"
  fi
}

# main ----
for row in "${SOURCES[@]}"; do
  IFS='|' read -r style src_rel dest_rel <<< "$row"
  sync_row "$style" "$src_rel" "$dest_rel"
done

# summary ----
echo "Synced snapshots from tough-tongue-ai @ $SHORT_SHA"
for row in "${SOURCES[@]}"; do
  IFS='|' read -r _ _ dest_rel <<< "$row"
  if [[ "$dest_rel" == */ ]]; then
    count=$(find "$SNAPSHOTS/${dest_rel%/}" -maxdepth 1 -type f | wc -l | tr -d ' ')
    echo "  - $dest_rel ($count files)"
  else
    echo "  - $dest_rel"
  fi
done

echo ""
echo "Next: bump version in .claude-plugin/plugin.json if content materially changed,"
echo "      commit, and tag the new version."
