# Brilliant: mock up before code

Brilliant is a macOS design app (`/Applications/Brilliant.app`), similar to Figma. The `brilliant` MCP (user scope, `http://127.0.0.1:3333/mcp`) only answers while the app is open. Each product has a project in `~/Brilliant/<Project>`. `.bl` files are changed only through the MCP tools.

## Session

1. `list_projects` shows the projects and which one is on screen.
2. `init` with `project: "<Project>"` and a short `agentName`. Without `project`, the session binds to whatever project is on screen, which may be a different product. If the product has no project yet, ask the user whether to create one.
3. Pass the returned `sessionId` on every `edit` and `read` call.

Done when `init` answers with the right project's `repoRoot`.

## Canvas

- One canvas per task, named after the task or branch: a fence's `file("<name>")` creates the canvas when it doesn't exist.
- Canvases from other tasks can be read (`read`) to reuse elements; the new proposal goes on the current task's canvas.
- The project's UI profile lists known canvases and `Assets/`.

## Writing

- **`html` fence** is the default path: HTML with inline CSS, no knowledge loading. Use the `DESIGN.md` values directly in the CSS.
- The HTML converter wants `div`s with px sizes: `span` loses its padding and % heights vanish. Give the outermost element a px width and height.
- **`bl` fence** (Blueprint) is for editing what exists, components, effects and vectors. Before using it, load knowledge with `get_knowledge` (`init` lists the keys; `design/foundations`, `design/colors`, `design/typography` and the relevant `design/blocks/*` are the minimum).
- The `edit` tool's `designSystem` argument accepts `default`, `new`, `none` or a brand written in the same session. The product's tokens live in `Styles/<brand>.ds`: read it to consult them, without rewriting the file just to select it. Creating the brand from scratch is part of the foundation ([foundation.md](foundation.md)).
- Brilliant's icons are Phosphor (`<i data-icon="name">`). If the product uses another icon library, pick the closest drawing to the icon that will go into the code.

## Variations

When the brief asked for variations, draw 2 to 3 side by side on the same canvas, each with a short label ("A: compact list", "B: cards"), changing one decision at a time.

## Showing

`export` the frame (or the variations' frames) as `png` and show the image to the user (in the desktop app with `SendUserFile`; in the terminal, by file path). Done when they approved the direction or asked for changes; changes go back through `edit` with a `bl` fence on the same elements.
