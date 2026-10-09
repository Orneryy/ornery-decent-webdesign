# Design foundation: PRODUCT.md, DESIGN.md and a design system

The foundation is what makes scouting safe: without it, every component brought in from outside arrives with its own colors, timings and icons, and the screens drift apart. That's why the recommendation is to start with it.

| Piece | Holds |
| --- | --- |
| `PRODUCT.md` | Audience, purpose, tone and principles of the product |
| `DESIGN.md` | Durable visual decisions: brand, colors, typography, spacing, motion, components. Follows the DESIGN.md format (YAML frontmatter with the tokens, then sections in a fixed order) |
| Design system | The tokens in code (CSS variables or a token file) and the base components that use them |

## When the foundation exists

Read `PRODUCT.md`, `DESIGN.md` and the tokens before scouting; the adoption rules come from them. If the task introduces something durable (a color, a component type, a new motion timing), ask whether to update `DESIGN.md` and the tokens before the code, recommending yes, and make that change on the same branch.

## When something is missing

Ask in the same AskUserQuestion round as the task brief:

- **"This project has no [what's missing]. I recommend creating it before the screens, so everything brought in from the libraries follows the same rules. How would you like to proceed?"**
  - "Create DESIGN.md and design system first (Recommended)"
  - "Only DESIGN.md for now; tokens later"
  - "Continue without: rules come from the existing code"

If the answer is to continue without, record the `foundation:*` items with `--dismiss` so the question doesn't come back on every task.

## How to create it

| Situation | Path |
| --- | --- |
| No `PRODUCT.md` | `/impeccable init`: a short interview that writes `PRODUCT.md` |
| The code already has UI | `/impeccable document`: writes `DESIGN.md` from the code; then `/impeccable extract` consolidates tokens and components into the design system (it asks where, if there's no place yet) |
| No UI yet | `/impeccable init`, then `/impeccable shape`, which picks the visual direction with the user and writes `DESIGN.md`; the tokens become CSS variables in a `design-system/` folder |
| A design system exists but is inconsistent | `design:design-system audit` points out hard-coded values and naming drift; `design:design-system document` documents variants and states |

When Brilliant is in use (the brief said yes), mirror the foundation there: a `design-system` canvas with the palette, type and base components, and the tokens in `Styles/<brand>.ds` (`edit` with `designSystem: "new"` and a `ds` fence). Done when `DESIGN.md` is at the root with the tokens in its frontmatter, the tokens exist in code and the user approved.
