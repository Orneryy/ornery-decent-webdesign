# Setup: install what's missing, with consent

Follow this file when `scripts/check.mjs` says `First use: yes` or lists anything under `Missing`. Nothing is installed unless the user picks it. `foundation:*` items are not installed: they belong to the foundation step ([foundation.md](foundation.md)).

## 1. Check what the script can't see

- **Watermelon:** before offering `mcp:watermelon`, search with ToolSearch (`Watermelon`). If a claude.ai connector answers, the item is covered: dismiss it when recording.
- **Skills from the `design` plugin** (`design:design-system`, `design:accessibility-review`, `design:ux-copy`, `design:design-critique`): they show up in the session's skill list. If missing, the plugin is enabled on claude.ai; tell the user, without trying to install it.
- **Figma:** only matters if the user works from Figma links; authorizing it is up to them (claude.ai connectors or `/mcp`).

Done when every missing item is confirmed as missing or covered.

## 2. Ask

One AskUserQuestion call with `multiSelect: true`, one option per missing item, each saying in one sentence what it adds to UI work. With more than 4 items, group them by type ("All missing skills", "Missing MCPs") and list the names in the description. On the first use in a project, say beforehand, in one line, that declined items won't be offered again.

What each item adds:

| Item | Adds |
| --- | --- |
| `mcp:shadcn` | Search and read the registries in `components.json`. A project-scope `.mcp.json` that isn't committed won't reach worktrees; user scope covers every folder |
| `mcp:hextaui` | Docs, API and source for HextaUI's 65 components |
| `mcp:reui` | Search and API docs for ReUI's data grid, kanban, filters and other components, examples and blocks. Needs a free ReUI account (sign-in through `/mcp`) |
| `skill:reui` | ReUI's tool reference and design rules; its installer also adds the `reui` MCP for Claude Code, Codex, Cursor, Gemini CLI and OpenCode |
| `mcp:watermelon` | Search across Watermelon's ~850 items, inspiration and page plans |
| `mcp:brilliant` | Mock up screens before code. Needs the macOS app, which the user installs from https://brilliant.design |
| `skill:impeccable` | Direction, critique, audit and polish of UI; creates `PRODUCT.md` and `DESIGN.md` |
| `skill:emil-design-eng`, `skill:make-interfaces-feel-better`, `skill:better-ui` | Motion and finishing criteria |
| `skill:transitions-dev`, `skill:transitions-polish` | CSS transition recipes and their review |
| `skill:ui-lab`, `skill:fluid-functionalism` | Guided access to those two libraries |
| `skill:responsive-design` | Layout across widths |
| `skill:design-taste-frontend` | Landing and marketing pages |

Done when the user has answered.

## 3. Install what was picked

- Run exactly the `install` command the script printed for each picked item, one at a time, and check the output.
- A new MCP only shows up in a new session (or after reconnecting the servers). Tell the user and continue through the library sites meanwhile.
- A new skill appears in the skill list after installing; if it doesn't, ask for a new session.

Done when every command ran without errors, or the error was reported to the user.

## 4. Record

```bash
node <skill dir>/scripts/check.mjs --register --dismiss <comma-separated ids that were declined or are covered>
```

The record lives in `~/.config/ornery-decent-webdesign/state/` (or under `$XDG_CONFIG_HOME`), one file per repository, valid for all of its worktrees and kept when the skill is updated. Done when the script says `First use: no` and nothing is left under `Missing`.

If the project has no `components.json` and uses React with Tailwind, the `shadcn` MCP and CLI need `npx shadcn@latest init`, which creates committed files: offer it together with the foundation, never on your own.
