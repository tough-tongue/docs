#!/usr/bin/env bash
# Regenerate skills/toughtongue-ai/snapshots/ from a local tough-tongue-ai checkout.
# Each output file gets a one-line header pinning the source commit SHA + date.
#
# Usage:
#   TT_SRC=/path/to/tough-tongue-ai ./sync-sources.sh
#
# If TT_SRC is unset, defaults to ../../../../tough-tongue-ai relative to this script.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SNAPSHOTS="$SKILL_DIR/snapshots"

TT_SRC="${TT_SRC:-$SKILL_DIR/../../../../tough-tongue-ai}"

if [[ ! -d "$TT_SRC/.git" ]]; then
  echo "ERROR: TT_SRC=$TT_SRC is not a git checkout of tough-tongue-ai" >&2
  exit 1
fi

SHA="$(git -C "$TT_SRC" rev-parse HEAD)"
SHORT_SHA="$(git -C "$TT_SRC" rev-parse --short HEAD)"
COMMIT_DATE="$(git -C "$TT_SRC" log -1 --format='%cI')"
PINNED_AT="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

mkdir -p "$SNAPSHOTS/handbooks"

write_header_md() {
  local out="$1" src_rel="$2"
  cat > "$out" <<EOF
<!-- Pinned snapshot. Do not edit by hand. Regenerate with scripts/sync-sources.sh. -->
<!-- Source: tough-tongue-ai/$src_rel @ $SHORT_SHA ($COMMIT_DATE) -->
<!-- Pinned at: $PINNED_AT -->

EOF
}

write_header_yaml() {
  local out="$1" src_rel="$2"
  cat > "$out" <<EOF
# Pinned snapshot. Do not edit by hand. Regenerate with scripts/sync-sources.sh.
# Source: tough-tongue-ai/$src_rel @ $SHORT_SHA ($COMMIT_DATE)
# Pinned at: $PINNED_AT

EOF
}

write_header_txt() {
  local out="$1" src_rel="$2"
  cat > "$out" <<EOF
# Pinned snapshot. Do not edit by hand. Regenerate with scripts/sync-sources.sh.
# Source: tough-tongue-ai/$src_rel @ $SHORT_SHA ($COMMIT_DATE)
# Pinned at: $PINNED_AT
# Live mirror: https://app.toughtongueai.com/llms-full.txt

EOF
}

# llms-full.txt -----------------------------------------------------------------
SRC="www/public/llms-full.txt"
OUT="$SNAPSHOTS/llms-full.txt"
write_header_txt "$OUT" "$SRC"
cat "$TT_SRC/$SRC" >> "$OUT"

# scenario-schema.yml ----------------------------------------------------------
SRC="py/jarvis/boxman/claude_box/repo-base/schema/scenario-schema.yml"
OUT="$SNAPSHOTS/scenario-schema.yml"
write_header_yaml "$OUT" "$SRC"
cat "$TT_SRC/$SRC" >> "$OUT"

# boxman CLAUDE.md -------------------------------------------------------------
SRC="py/jarvis/boxman/claude_box/repo-base/CLAUDE.md"
OUT="$SNAPSHOTS/boxman-claude.md"
write_header_md "$OUT" "$SRC"
cat "$TT_SRC/$SRC" >> "$OUT"

# handbooks --------------------------------------------------------------------
HB_SRC_DIR="py/jarvis/boxman/claude_box/repo-base/handbooks"
for hb in "$TT_SRC/$HB_SRC_DIR"/*.md; do
  name="$(basename "$hb")"
  OUT="$SNAPSHOTS/handbooks/$name"
  write_header_md "$OUT" "$HB_SRC_DIR/$name"
  cat "$hb" >> "$OUT"
done

# Summary ----------------------------------------------------------------------
echo "Synced snapshots from tough-tongue-ai @ $SHORT_SHA"
echo "  - llms-full.txt"
echo "  - scenario-schema.yml"
echo "  - boxman-claude.md"
echo "  - handbooks/ ($(ls "$SNAPSHOTS/handbooks" | wc -l | tr -d ' ') files)"
echo ""
echo "Next: bump version in .claude-plugin/plugin.json if content materially changed,"
echo "      commit, and tag the new version."
