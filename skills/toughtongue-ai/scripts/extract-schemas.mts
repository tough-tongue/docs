#!/usr/bin/env bun
/**
 * Extract Scenario + Session resource schemas from tough-tongue-ai's
 * api-schemas.ts into Markdown snapshots. Driven by sync-sources.sh.
 *
 * api-schemas.ts has no runtime imports (pure data + types), so we can
 * dynamic-import it directly via bun.
 *
 * Usage:
 *   bun extract-schemas.mts <api-schemas.ts path> <out dir> <sha> <commit-date> <pinned-at>
 */

type SchemaField = {
  name: string;
  type: string;
  required?: boolean;
  description: string;
};

type SchemaSection = {
  title: string;
  fields: SchemaField[];
};

type ResourceSchema = {
  name: string;
  description: string;
  sections: SchemaSection[];
  representation: string;
  notes?: string;
};

// args ------------------------------------------------------------------------
const [, , srcPath, outDir, sha, commitDate, pinnedAt] = process.argv;
if (!srcPath || !outDir || !sha || !commitDate || !pinnedAt) {
  console.error(
    "Usage: extract-schemas.mts <api-schemas.ts> <out-dir> <sha> <commit-date> <pinned-at>",
  );
  process.exit(1);
}

// source ----------------------------------------------------------------------
const mod = (await import(srcPath)) as {
  SCENARIO_SCHEMA: ResourceSchema;
  SESSION_SCHEMA: ResourceSchema;
};

const SCHEMAS: Record<string, ResourceSchema> = {
  "scenario-schema.md": mod.SCENARIO_SCHEMA,
  "session-schema.md": mod.SESSION_SCHEMA,
};

const SOURCE_REL = "www/app/docs/config/api-schemas.ts";

// rendering -------------------------------------------------------------------
function header(): string {
  return [
    "<!-- Pinned snapshot. Do not edit by hand. Regenerate with scripts/sync-sources.sh. -->",
    `<!-- Source: tough-tongue-ai/${SOURCE_REL} @ ${sha} (${commitDate}) -->`,
    `<!-- Pinned at: ${pinnedAt} -->`,
    "",
    "",
  ].join("\n");
}

function renderFieldsTable(fields: SchemaField[]): string {
  let md = "| Field | Type | Required | Description |\n";
  md += "|---|---|---|---|\n";
  for (const f of fields) {
    const required = f.required ? "✓" : "";
    // escape pipe chars inside descriptions so they don't break the table
    const desc = f.description.replace(/\|/g, "\\|");
    md += `| \`${f.name}\` | ${f.type} | ${required} | ${desc} |\n`;
  }
  return md;
}

function toMarkdown(s: ResourceSchema): string {
  let md = `# ${s.name}\n\n${s.description}\n\n`;
  md += `## Sample\n\n\`\`\`json\n${s.representation}\n\`\`\`\n\n`;
  md += `## Fields\n\n`;
  for (const section of s.sections) {
    md += `### ${section.title}\n\n${renderFieldsTable(section.fields)}\n`;
  }
  if (s.notes) {
    md += `## Notes\n\n${s.notes}\n`;
  }
  return md;
}

// write -----------------------------------------------------------------------
for (const [filename, schema] of Object.entries(SCHEMAS)) {
  const outPath = `${outDir}/${filename}`;
  await Bun.write(outPath, header() + toMarkdown(schema));
  console.log(`  - ${filename}`);
}
