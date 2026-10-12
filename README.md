# ornery-decent-webdesign

A Claude Code skill for building web UI the decent way: start from a design foundation, look for a pattern someone already solved, mock it up if you want, and adapt it to your product instead of pasting components in as they ship.

## What it does

1. **Setup on first use.** A read-only script (`scripts/check.mjs`) checks which component MCPs and design skills you have. The skill asks which missing ones to install, installs only what you pick, and remembers what you declined.
2. **Design foundation.** Reads `PRODUCT.md`, `DESIGN.md` and your design system. If they're missing, it recommends creating them first and asks.
3. **Task brief.** Fills in what it can from your request and code, asks for the rest in one round, and always asks whether to mock up in [Brilliant](https://brilliant.design) before writing code.
4. **Scout, inspect, adapt, verify.** Searches the component catalogs, previews installs with `shadcn add --dry-run`, adapts the code to your tokens, icons and motion library, and checks the result in the local preview.

It knows how to use:

- **MCPs:** [shadcn](https://ui.shadcn.com), [HextaUI](https://hextaui.com), [ReUI](https://reui.io), [Watermelon UI](https://ui.watermelon.sh), Brilliant.
- **Sites without an MCP:** [animate-ui](https://animate-ui.com), [uselayouts](https://uselayouts.com), [ui lab](https://lab.xevrion.dev), [uiarc](https://uiarc.dev), [EasyUI](https://www.easyui.site), [Fluid Functionalism](https://www.fluidfunctionalism.com).
- **Skills:** impeccable, emil-design-eng, make-interfaces-feel-better, better-ui, transitions-dev, transitions-polish, ui-lab, fluid-functionalism, reui, responsive-design, design-taste-frontend.

None of these are required up front: the skill offers to install what's missing and works with whatever you have.

## Install

```bash
npx skills add Orneryy/ornery-decent-webdesign
```

The installer asks where to install it (globally or just in the current project) and for which agents: pick Claude Code, since the skill relies on its question prompts and MCP loading. Then ask Claude Code for a UI change, or run `/ornery-decent-webdesign`.

Requirements: Node 18 or later and git. Brilliant is optional and macOS only.

## Project UI profile

Rules that only apply to one project (its motion library, icons, components not to overwrite, preview command) go in a `UI-PROFILE.md` at the project root or in `docs/`. The skill reads it and lets it override the generic rules. See [references/ui-profile.md](references/ui-profile.md).

## Where it keeps state

Setup answers are saved per repository in `~/.config/ornery-decent-webdesign/state/` (or `$XDG_CONFIG_HOME`). Nothing is written to your project unless you approve a change.

## License

MIT
