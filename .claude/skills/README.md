# Project skills

These skills load automatically in any Claude Code session on this repo, including the web and mobile apps. They need no plugin install.

| Skill | Source | Licence |
| --- | --- | --- |
| `frontend-design` | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/frontend-design) | Apache 2.0 |
| `design-critique`, `accessibility-review`, `ux-copy` | [anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins/tree/main/design) (Design plugin) | Apache 2.0 |
| `design-taste-frontend` (Taste) | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | See repo |
| `impeccable` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | See repo |
| `playwright-cli` | [microsoft/playwright-cli](https://github.com/microsoft/playwright-cli) (the CLI itself is the `@playwright/cli` dev dependency: `npx playwright-cli …`) | Apache 2.0 |
| `img2threejs` | [img2threejs/img2threejs](https://github.com/img2threejs/img2threejs) | Apache 2.0 |
| `remotion-*` (13 skills, router: `remotion-best-practices`) | [remotion-dev/skills](https://github.com/remotion-dev/skills), installed with `npx skills add remotion-dev/skills --agent claude-code`. The four above were added the same way (`npx skills add <repo> --agent claude-code`) | See [Remotion licence](https://www.remotion.dev/license) |

All are copied unchanged. Each folder has its licence. Versions of all CLI-installed skills are pinned in `/skills-lock.json`; refresh them with `npx skills update -p`. `../CONNECTORS.md` comes from the same Design plugin, and the skills link to it.

Awesome Design (VoltAgent/awesome-design-md) is a library of `DESIGN.md` references rather than a skill; it lives in `design/references/`.
