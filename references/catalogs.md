# Catalogs: component MCPs and sites

Behavior checked on 2026-10-09. If a tool answers differently from what's written here, trust the answer and fix this file.

## Recipe shared by every shadcn registry

Every library below publishes a registry in the shadcn format:

- **Index:** `…/r/registry.json`, with `name`, `title`, `description` and sometimes `categories`. Download and filter instead of guessing names:
  `curl -s <index> | python3 -c "import json,sys;[print(i['name'],'—',i.get('description','')) for i in json.load(sys.stdin)['items']]" | grep -i <term>`
- **Item:** `…/r/<name>.json`, with `dependencies`, `registryDependencies` and `files[].content` (the full source). Readable without installing anything.
- **Through the CLI, without writing:** `npx shadcn@latest add <item> --dry-run` (files, dependencies, CSS variables), `--view <path>` (a file's content) and `--diff <path>` (difference against the project's file). `<item>` can be `@registry/name`, a `…/r/<name>.json` URL or a GitHub `owner/repo/name`.
- **`lib/utils.ts`:** current shadcn ships it as `export { cn } from "cn"` (shadcn's own `cn` package, a drop-in for clsx + tailwind-merge). In projects set up with an older shadcn (`clsx` + `twMerge` inside the file), every item that depends on `utils` shows it as an overwrite: the behavior is the same, but it adds the `cn` dependency.
- **Demo:** open the page in a browser tool and read it (text or screenshot) before proposing the component. In the desktop app: `preview_start` with the `url`, then `get_page_text` or a screenshot.

## `shadcn` MCP

Searches `@shadcn` and the registries in the project's `components.json` (without `components.json` the MCP doesn't work: `npx shadcn@latest init`). A library outside `components.json` can be read through its item URL or registered with `npx shadcn@latest registry add @name`, which changes a committed file.

- `search_items_in_registries` is fuzzy and noisy: multi-word queries return unrelated items ("undo toast" brought back `gravity-stars` and icons). Use one keyword, narrow `registries` and `types`, and page with `offset`.
- The "Add command" line in search results comes back as `[object Promise]`. Ask `get_add_command_for_items` for the command.
- `view_items_in_registries` shows the full files; `get_item_examples_from_registries` finds demos (`<item>-demo`).
- `get_audit_checklist` when you finish adapting components.

### @animate-ui (`https://animate-ui.com`)

580 items. Names carry the path: `components-radix-*`, `components-base-*`, `components-community-*`, `primitives-radix-*`, `primitives-base-*`, `primitives-effects-*`, `primitives-animate-*`, `hooks-*`, `icons-*` (about 260 animated icons) and `demo-*`. Docs follow the file path: `registry/primitives/effects/auto-height` becomes `https://animate-ui.com/docs/primitives/effects/auto-height`. Items depend on each other through `registryDependencies` (for example `primitives-animate-slot`); follow that chain when reading the code. Register with `"@animate-ui": "https://animate-ui.com/r/{name}.json"`.

### @uselayouts (`https://uselayouts.com`)

64 components. Demo at `https://uselayouts.com/docs/components/<name>`. Several bring `@hugeicons/react`: swap for the project's icon library. Register with `"@uselayouts": "https://uselayouts.com/r/{name}.json"`.

### @mcpcn and @emailcn

`@mcpcn` (`https://www.mcpcn.dev`, 33 form and card blocks). `@emailcn` (`https://emailcn.vercel.app/r/<name>.json`) has no public index; it's for email templates.

## `hextaui` MCP — `https://hextaui.com`

65 components and 9 hooks, MIT. Base UI, Tailwind 4, `@tabler/icons-react` and the `cn` package.

- `search_docs` requires every word to match; with no match it returns "closest matches". Use 1 to 3 words.
- `get_component` gives purpose, usage, keyboard, accessibility and API; read it before proposing, because props differ from shadcn's (its `Button` has a `feedback` flow, for example). Source with `get_component_source`, examples with `get_examples`.
- `get_install_command` returns `npx shadcn@latest add https://hextaui.com/r/<name>.json`. That command brings HextaUI's theme tokens and the components the item depends on, replacing the project's own (`alert-dialog` alone replaces `button`, `sheet`, `spinner` and `alert-dialog` and adds 70 CSS variables): check the dry-run.
- Site: `https://hextaui.com/docs/<name>`; summary at `https://hextaui.com/llms.txt`.

## Watermelon UI (`watermelon` MCP or claude.ai connector) — `https://ui.watermelon.sh`

849 items: 516 `components`, 131 `animated-components`, 189 `blocks`, 12 `dashboards`, 1 `templates`. Public MCP endpoint, no key: `https://mcp.watermelon.sh/mcp`.

- `search` (free text, `kinds` filter) already returns `previewUrl`, `registryUrl`, `installCommand` and `dependencies`: drop there whatever brings a new dependency (`react-icons` and `react-use-measure` are common).
- `get_inspiration` gives 3 to 6 visual options for a goal; `compose_page` builds a page plan section by section; `list_categories` lists the categories.
- `get_component` (`slug` and `kind`) returns the source.
- Items install into `components/watermelon/`.
- Demo at `https://ui.watermelon.sh/<kind>/<slug>`; item at `https://registry.watermelon.sh/r/<slug>.json`; summary at `https://ui.watermelon.sh/llms.txt`. The dashboards (`*-dashboard`) bring their own layout and fonts.

## Sites without an MCP

| Library | Index | Demo | Notes |
| --- | --- | --- | --- |
| ui lab (Xevrion) | `https://lab.xevrion.dev/r/registry.json` | `https://lab.xevrion.dev/lab/<name>` | Has the `ui-lab` skill. MIT. One file per experiment, with `motion` and a reduced-motion branch. Summary at `/llms.txt` |
| uiarc (ArcUI) | `https://uiarc.dev/r/registry.json` | `https://uiarc.dev/components/<name>` | `…/components/<name>/markdown` gives the docs as Markdown, the best read for an agent. Imports standalone `@radix-ui/react-*` packages; projects on the unified `radix-ui` package swap the imports. "Pro" items don't install. Summary at `/llms.txt` |
| EasyUI | `https://raw.githubusercontent.com/Surajmaurya1/easyui/main/registry.json` | `https://www.easyui.site/components/<name>` | Installs as `Surajmaurya1/easyui/<name>`. Imports from `framer-motion` (the old name of `motion`), brings `lib/motion-tokens.ts` and a `lib/utils.ts` with extra helpers; many items have hard-coded dark-theme colors and no reduced-motion branch. Best as reference |
| Fluid Functionalism | `https://www.fluidfunctionalism.com/r/registry.json` | `https://www.fluidfunctionalism.com` | Has the `fluid-functionalism` skill. Radix at `/r/<name>.json`, Base UI at `/r/base/<name>.json`. Uses `framer-motion` and replaces same-name components in `components/ui/` |

## Figma

The Figma connectors need authorization (claude.ai connector settings or `/mcp`); without it the tools don't answer. Use them when the user sends a `figma.com` link; when the project uses Brilliant, the designs live there.

## Browser

- Library demo: open the `url` and read the text or take a screenshot.
- Product: the project's preview server (in the desktop app, `preview_start` with a `.claude/launch.json` entry; the UI profile says which).
- A hidden browser pane doesn't paint frames and freezes transitions. To measure an animation, sample `getComputedStyle` on every `requestAnimationFrame` with the pane visible, or use headless Chrome through the DevTools protocol against the local preview.
