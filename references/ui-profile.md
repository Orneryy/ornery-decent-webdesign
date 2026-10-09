# Project UI profile

A UI profile is a short file inside the project, `UI-PROFILE.md` at the root or `docs/UI-PROFILE.md`, with the rules that only make sense for that project. The skill reads it after setup, and its rules take precedence over the generic ones. It lives in the project's repository, so everyone working on the project (people and agents) shares it.

Offer to create one when the user repeats a project rule twice, or at the end of the first task in a project that has none. Write it in the project's language. Typical sections:

| Section | Example |
| --- | --- |
| Where to read first | Inventory of adopted and rejected components, `DESIGN.md`, token file, motion helpers |
| Visual sources | Which files or pages show the real look, and which ones are outdated |
| Adoption rules | Motion package and import path, icon library, primitives, what not to overwrite, dry-run findings |
| Reuse before bringing in | Existing components that already solve common patterns |
| Reference only | Libraries evaluated and not installed, with the reason |
| Tools in this repository | How the preview runs, test accounts, quirks of the local setup |
| Brilliant | Project name, existing canvases, assets |

Keep secrets, private URLs and personal data out of it: it's a committed file.
