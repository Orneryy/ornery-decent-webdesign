# Design and motion skills

Load a skill by name with the Skill tool. Missing ones show up in the `scripts/check.mjs` report.

## For the product's UI

| Moment | Skill | Use |
| --- | --- | --- |
| Foundation | `impeccable` (`init`, `document`, `extract`, `shape`), `design:design-system` | See [foundation.md](foundation.md) |
| Direction, critique, audit, polish | `impeccable` | Entry point for UI work (`shape`, `critique`, `audit`, `polish`, `animate`, `harden`, `adapt` and more). Reads the project's `PRODUCT.md`, `DESIGN.md` and `.impeccable/` |
| Timing, easing and springs | `emil-design-eng` | Decide whether something should animate and how; final values come from the project's tokens |
| Finishing details | `make-interfaces-feel-better`, `better-ui` | Concentric radii, optical alignment, hit areas, shadows, tabular numbers |
| A ready CSS transition | `transitions-dev` | 32 recipes with a reduced-motion guard |
| Reviewing existing transitions | `transitions-polish` | After `transitions-dev`, or on older screens |
| ui lab components | `ui-lab` | Index, demo and source; installing follows the adoption rules |
| Fluid Functionalism patterns | `fluid-functionalism` | `scripts/stack.mjs` reads the project's stack without writing; `scripts/audit.mjs` measures a running route on the local preview |
| Layout across widths | `responsive-design` | Mobile, tablet and desktop |
| Accessibility | `design:accessibility-review` | WCAG, contrast, keyboard and screen readers |
| Interface copy | `design:ux-copy` | In the language and tone of `PRODUCT.md` |
| Critique of a Brilliant mockup | `design:design-critique` | With the exported PNG |
| Landing and marketing | `design-taste-frontend` | Public pages, not in-app screens |

## Not for the product's UI

- `gsap-*`: only if the project already uses GSAP; otherwise it's a new dependency.
- `hyperframes*`, `motion-graphics`, `product-launch-video`: launch and explainer videos, not the interface.
- `figma:*`: need the Figma connector authorized.
- `artifact-design`: pages published as Artifacts, not product screens.
