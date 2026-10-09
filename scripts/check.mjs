#!/usr/bin/env node
// Checks what the UI toolkit needs in the current project: MCPs, skills,
// design foundation (PRODUCT.md, DESIGN.md, design system) and the project's
// UI profile. Read-only: it never installs anything and never prints
// configuration values (only server names), because ~/.claude.json can hold secrets.
//
// Usage, from any folder inside the repository:
//   node <skill dir>/scripts/check.mjs            report
//   node <skill dir>/scripts/check.mjs --json     report as JSON
//   node <skill dir>/scripts/check.mjs --register [--dismiss id1,id2]
//        marks setup as done and stores items that must not be offered again
//        (declined by the user, or already active as a claude.ai connector).

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { basename, dirname, join } from "node:path";

const home = homedir();
const args = process.argv.slice(2);
const asJson = args.includes("--json");
const register = args.includes("--register");
const dismissArg = args[args.indexOf("--dismiss") + 1];
const dismissNow = args.includes("--dismiss") && dismissArg ? dismissArg.split(",").map((s) => s.trim()).filter(Boolean) : [];

function git(...a) {
  try {
    return execFileSync("git", a, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "";
  }
}

const top = git("rev-parse", "--show-toplevel") || process.cwd();
const commonDir = git("rev-parse", "--path-format=absolute", "--git-common-dir");
// The repository's main folder, shared by all of its worktrees.
const mainRoot = commonDir ? dirname(commonDir) : top;
const projectName = basename(mainRoot);

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}

// Case-insensitive lookup of a relative path such as "docs/UI-PROFILE.md".
function findPath(root, rel) {
  let dir = root;
  const parts = rel.split("/");
  for (const [i, part] of parts.entries()) {
    let entries;
    try {
      entries = readdirSync(dir);
    } catch {
      return null;
    }
    const match = entries.find((e) => e.toLowerCase() === part.toLowerCase());
    if (!match) return null;
    dir = join(dir, match);
    if (i === parts.length - 1) return dir.slice(root.length + 1);
  }
  return null;
}

// MCP server names per scope (keys only).
const claudeJson = readJson(join(home, ".claude.json")) ?? {};
const mcpNames = {
  user: Object.keys(claudeJson.mcpServers ?? {}),
  local: [...new Set([top, mainRoot].flatMap((p) => Object.keys(claudeJson.projects?.[p]?.mcpServers ?? {})))],
  project: Object.keys(readJson(join(top, ".mcp.json"))?.mcpServers ?? {}),
};
function mcpScope(name) {
  return Object.entries(mcpNames).find(([, names]) => names.includes(name))?.[0] ?? null;
}

function skillInstalled(name) {
  return [join(home, ".claude", "skills", name), join(top, ".claude", "skills", name)].some((d) =>
    existsSync(join(d, "SKILL.md")),
  );
}

async function brilliantOpen() {
  try {
    await fetch("http://127.0.0.1:3333/mcp", { signal: AbortSignal.timeout(1500) });
    return true;
  } catch {
    return false;
  }
}

const skillAdd = (repo, name) => `npx skills add ${repo} -g -a claude-code -s ${name} -y`;

// Tools: what can be installed with the user's consent.
const tools = [];
function addTool(id, ok, status, install, note) {
  tools.push({ id, ok, status, install: ok ? null : install, note: note ?? null });
}

for (const [id, cmd] of [
  ["shadcn", "claude mcp add --scope user shadcn -- npx shadcn@latest mcp"],
  ["hextaui", "claude mcp add --scope user --transport http hextaui https://hextaui.com/mcp"],
]) {
  const scope = mcpScope(id);
  addTool(`mcp:${id}`, Boolean(scope), scope ? `configured (${scope})` : "missing", cmd);
}
{
  const scope = mcpScope("watermelon");
  addTool(
    "mcp:watermelon",
    Boolean(scope),
    scope ? `configured (${scope})` : "no local configuration",
    "claude mcp add --scope user --transport http watermelon https://mcp.watermelon.sh/mcp",
    scope ? null : "May already be active as a claude.ai connector: check with ToolSearch before offering to install.",
  );
}
{
  const scope = mcpScope("brilliant");
  const app = existsSync("/Applications/Brilliant.app");
  const open = app ? await brilliantOpen() : false;
  const project = existsSync(join(home, "Brilliant", projectName));
  addTool(
    "mcp:brilliant",
    Boolean(scope) && app,
    [
      scope ? `configured (${scope})` : "MCP missing",
      app ? (open ? "app open" : "app closed") : "app not installed",
      project ? `~/Brilliant/${projectName} exists` : `no ~/Brilliant/${projectName} (check with list_projects)`,
    ].join("; "),
    scope ? null : "claude mcp add --scope user --transport http brilliant http://127.0.0.1:3333/mcp",
    app ? (open ? null : "Ask the user to open Brilliant before mocking up.") : "The app (macOS) is downloaded from https://brilliant.design; installing it is up to the user.",
  );
}
for (const [name, repo] of [
  ["impeccable", "pbakaus/impeccable"],
  ["emil-design-eng", "emilkowalski/skills"],
  ["make-interfaces-feel-better", "jakubkrehel/make-interfaces-feel-better"],
  ["better-ui", "jakubkrehel/skills"],
  ["transitions-dev", "Jakubantalik/transitions.dev"],
  ["transitions-polish", "Jakubantalik/transitions.dev"],
  ["ui-lab", "xevrion/ui-lab"],
  ["fluid-functionalism", "mickadesign/fluid-functionalism"],
  ["responsive-design", "wshobson/agents"],
  ["design-taste-frontend", "Leonxlnx/taste-skill"],
]) {
  const ok = skillInstalled(name);
  addTool(`skill:${name}`, ok, ok ? "installed" : "missing", skillAdd(repo, name));
}

// Design foundation: not installed; when missing, creating it is recommended (references/foundation.md).
const product = findPath(top, "PRODUCT.md");
const design = findPath(top, "DESIGN.md");
const designSystem = [
  "design-system",
  "tokens",
  "src/design-system",
  "src/tokens",
  "styles/tokens.css",
  "src/styles/tokens.css",
  ".impeccable/design.json",
].find((p) => existsSync(join(top, p)));
let designHasTokens = false;
if (design) {
  const text = readFileSync(join(top, design), "utf8");
  designHasTokens = /^---\n[\s\S]*?\n---/.test(text) || /--[a-z][\w-]*\s*:/.test(text);
}
const foundation = [
  { id: "foundation:product", ok: Boolean(product), status: product ?? "no PRODUCT.md" },
  { id: "foundation:design-md", ok: Boolean(design), status: design ? design + (designHasTokens ? " (with tokens)" : " (no tokens)") : "no DESIGN.md" },
  { id: "foundation:design-system", ok: Boolean(designSystem), status: designSystem ?? "no token folder or file found" },
];
const componentsJson = readJson(join(top, "components.json"));
const registries = componentsJson ? Object.keys(componentsJson.registries ?? {}) : null;

// Project UI profile: project-specific rules, kept inside the project.
const profile = ["UI-PROFILE.md", "docs/UI-PROFILE.md"].map((p) => findPath(top, p)).find(Boolean) ?? null;

// Per-repository state, outside Git and outside the skill folder (survives skill updates).
const stateDir = join(process.env.XDG_CONFIG_HOME || join(home, ".config"), "ornery-decent-webdesign", "state");
const stateFile = join(stateDir, `${mainRoot.replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "")}.json`);
const state = readJson(stateFile) ?? { project: mainRoot, setUpAt: null, dismissed: [] };

if (register) {
  state.setUpAt = new Date().toISOString();
  state.dismissed = [...new Set([...(state.dismissed ?? []), ...dismissNow])];
  mkdirSync(stateDir, { recursive: true });
  writeFileSync(stateFile, JSON.stringify(state, null, 2) + "\n");
}

const dismissed = new Set(state.dismissed ?? []);
const missing = tools.filter((i) => !i.ok && !dismissed.has(i.id)).map((i) => i.id);
const missingFoundation = foundation.filter((i) => !i.ok && !dismissed.has(i.id)).map((i) => i.id);
const report = {
  project: mainRoot,
  folder: top,
  profile,
  firstUse: !state.setUpAt,
  setUpAt: state.setUpAt,
  dismissed: [...dismissed],
  missing,
  foundationMissing: missingFoundation,
  tools,
  foundation,
  componentsJson: registries === null ? null : { registries },
  checkInSession: [
    "Watermelon as a claude.ai connector (ToolSearch: Watermelon)",
    "Skills from the design plugin (design:design-system, design:accessibility-review, design:ux-copy, design:design-critique) show up in the session's skill list",
    "Figma: a connector pending authorization does not respond",
  ],
};

if (asJson) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`Project: ${mainRoot}${top !== mainRoot ? ` (worktree ${top})` : ""}`);
  console.log(`UI profile: ${profile ?? "none (rules come from DESIGN.md and package.json)"}`);
  console.log(`First use: ${report.firstUse ? "yes" : `no (set up at ${state.setUpAt})`}`);
  if (register) console.log(`Recorded in ${stateFile}`);
  const mark = (i) => (i.ok ? "ok " : dismissed.has(i.id) ? "dis" : "-- ");
  console.log("\nTools");
  for (const i of tools) {
    console.log(`[${mark(i)}] ${i.id}: ${i.status}`);
    if (i.install && !dismissed.has(i.id)) console.log(`        install: ${i.install}`);
    if (i.note) console.log(`        note: ${i.note}`);
  }
  console.log("\nDesign foundation");
  for (const i of foundation) console.log(`[${mark(i)}] ${i.id}: ${i.status}`);
  console.log(
    `components.json: ${registries === null ? "missing (the shadcn MCP and CLI need `npx shadcn@latest init`)" : `present; registries: ${registries.join(", ") || "only @shadcn"}`}`,
  );
  console.log("");
  console.log(missing.length ? `Missing: ${missing.join(", ")}` : "Tools: nothing missing beyond what was dismissed.");
  console.log(missingFoundation.length ? `Foundation missing: ${missingFoundation.join(", ")}` : "Foundation: complete or dismissed.");
  console.log(`Check in session: ${report.checkInSession.join("; ")}.`);
}
