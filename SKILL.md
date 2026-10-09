---
name: ornery-decent-webdesign
description: Web UI workflow — sets up the project (installs MCPs and skills with consent), starts from DESIGN.md and a design system, asks whether to mock up in Brilliant first, and teaches the component MCPs (shadcn, HextaUI, Watermelon, Brilliant), design and motion skills, and component library sites (animate-ui, uselayouts, ui lab, uiarc, EasyUI, Fluid Functionalism). Use before building or changing UI, when looking for a ready-made component, animation or pattern, or when the user asks to design in Brilliant, search the component libraries, or names one of them.
---

# Ornery decent webdesign

New UI starts with **scouting**: find a pattern someone already solved in the libraries, read its code and adapt it to the product, instead of writing it from scratch or installing the component as it ships. The design foundation (`DESIGN.md` and a design system) is the ruler for that adaptation, so it comes first.

## 1. Setup

From the repository folder, run this skill's script (`<skill dir>` is the base directory shown when the skill loads):

```bash
node <skill dir>/scripts/check.mjs
```

The script only reads configuration. It reports whether this is the first use in the project, which MCPs and skills are missing, the state of the design foundation, and whether the project has a UI profile. If it says `First use: yes` or lists anything under `Missing`, follow [references/setup.md](references/setup.md): ask the user what to install, install only what they pick, and record the answer. Done when the script says `First use: no` and `Missing` is empty (dismissed items are not offered again).

If the report finds a UI profile (`UI-PROFILE.md` or `docs/UI-PROFILE.md`), read it now: its project rules take precedence over this file. [references/ui-profile.md](references/ui-profile.md) says what a profile holds, for when the user wants one.

## 2. Design foundation

- **Present** (`PRODUCT.md`, `DESIGN.md`, design system): read all three before scouting. If the task introduces something durable (a color, a component type, a new motion timing), ask whether to update `DESIGN.md` and the tokens first, recommending yes.
- **Something missing** (`Foundation missing` in the report): recommend starting with it and ask, in the brief round below, between "Create DESIGN.md and design system first (Recommended)", "Only DESIGN.md for now" and "Continue without". How to create them: [references/foundation.md](references/foundation.md).

Done when the foundation was read, created, or dismissed by the user.

## 3. Task brief

Before looking for components, build the brief:

| Field | Source |
| --- | --- |
| Screen or area, and what changes | Request, code |
| Problem or goal | Request |
| Who uses it | Request, route, `PRODUCT.md` |
| Priority widths: desktop, mobile or both | Request |
| Desired reference (link, library, "something like…") | Request |
| Mock up in Brilliant first? | **Always asked**, unless the request already says |
| New dependencies allowed? | Default: no |

Fill in what the request and the code already answer. If the essentials are missing (what changes and why), ask in plain text. Everything else, plus the foundation question when it applies, goes in a single AskUserQuestion call with up to 4 questions, always including this one:

- **"Do you want me to mock up the proposal in Brilliant before touching the code?"**
  - "Yes, one proposal (Recommended)": a canvas in the product's Brilliant project; code starts after approval.
  - "Yes, 2 or 3 variations": pick one before coding.
  - "No, straight to code": visual checking happens in the local preview.

If Brilliant isn't installed or open (setup report), say so in the description of the mockup options. Done when every field is answered and the brief was played back to the user in 3 to 5 lines.

## 4. Change flow

1. **Scouting.** Search in this order: the project itself → registries in `components.json` through the `shadcn` MCP → HextaUI → Watermelon → sites without an MCP (ui lab, uiarc, EasyUI, Fluid). How to use each: [references/catalogs.md](references/catalogs.md). Done when there are 2 to 4 candidates, each with a demo link, dependencies and license, or a finding that nothing fits.
2. **Mockup**, if the brief says yes: [references/brilliant.md](references/brilliant.md). Done when the exported PNG was shown and the user approved the direction.
3. **Inspect without installing.** Read the candidate's code and run `npx shadcn@latest add <item> --dry-run`. Done when you know which files would be created or overwritten, which dependencies would be added and how many CSS variables would land in the global CSS.
4. **Adapt.** Bring the pattern into the project following the adoption rules below. Done when no rule is broken and the license is recorded.
5. **Verify.** Polish and audit with the skills ([references/skills.md](references/skills.md)); local preview with keyboard, mouse, reduced motion and mobile width. Done when a preview screenshot was shown and, if the project keeps an inventory of UI resources, it records what was adopted or rejected.

MCPs are deferred tools: load their schemas with ToolSearch (`select:` with all the names at once). Watermelon (tools `search`, `get_inspiration`, `get_component`, `compose_page`) arrives either as a `watermelon` server (`mcp__watermelon__search` and so on) or as a claude.ai connector whose prefix is a UUID. Try `select:` with the `watermelon` server names first; if they don't exist, search for `Watermelon` and confirm by the description, because keyword search mixes in tools from other connectors.

## What to use for each need

| I need | Use |
| --- | --- |
| An accessible component with the shadcn API (dialog, menu, field) | The project's `components/ui/` first; then the `shadcn` MCP (`@shadcn`) and the `hextaui` MCP |
| An animated micro-interaction (undo, save, counter, picker) | Watermelon `animated-components`, `@animate-ui`, the `ui-lab` skill, uiarc |
| A block or multi-section page, a dashboard | Watermelon `get_inspiration` and `compose_page` (`blocks`, `dashboards`) |
| A CSS transition for one element (tabs, dropdown, toast, accordion) | the `transitions-dev` skill |
| DESIGN.md or a design system | the `impeccable` skill (`init`, `document`, `extract`, `shape`) and `design:design-system` |
| A mockup before code | the `brilliant` MCP |
| To see a demo working | a browser tool (in the desktop app, `preview_start` with the demo `url`) |
| To review, polish or audit the result | the `impeccable` skill and the detail skills in [references/skills.md](references/skills.md) |
| A design from a Figma link | the Figma connector, which needs authorization |

## Adoption rules

- **Dry-run before any `shadcn add`.** Registry items often ship `lib/utils.ts`, base components with common names and theme variables, which the CLI overwrites. Install through the CLI only when the dry-run shows nothing but `create`, no new dependencies and no CSS variables; otherwise read the files with `--view` and adapt by hand.
- **Motion library, icons and primitives:** whatever the project already uses (`package.json` and neighboring components). Swap the outside component's choices for the project's equivalents.
- **Colors, radii, shadows and timings:** always from the tokens in `DESIGN.md` and the design system; the original component's hard-coded values go.
- **Reduced motion and keyboard:** every new motion has a reduced-motion branch, and keyboard actions never wait for an animation.
- **New dependencies** only when the user allows it (brief field).
- **Tone:** whatever `DESIGN.md` and `PRODUCT.md` rule out stays out, however good it looks in the demo.
- **License:** MIT or equivalent, with the text recorded in the project (for example `licenses/<library>.txt`). "Pro" or paid items are reference only.
