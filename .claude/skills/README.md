# Project skills

These skills load automatically in any Claude Code session on this repo, including the web and mobile apps. They need no plugin install.

| Skill | Source | Licence |
| --- | --- | --- |
| `frontend-design` | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/frontend-design) | Apache 2.0 |
| `design-critique`, `accessibility-review`, `ux-copy` | [anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins/tree/main/design) (Design plugin) | Apache 2.0 |
| `apple-design` | [emilkowalski/skills](https://github.com/emilkowalski/skills/tree/main/skills/apple-design) (Emil Kowalski) | MIT |
| `transitions-dev` | [Jakubantalik/transitions.dev](https://github.com/Jakubantalik/transitions.dev/tree/main/skills/transitions-dev) | Transitions.dev licence (free use, no redistribution as a library) |
| `playwright-cli` | Written by `playwright-cli install --skills` ([microsoft/playwright-cli](https://github.com/microsoft/playwright-cli)) | Apache 2.0 |

All are copied unchanged. Each folder has its licence. `../CONNECTORS.md` comes from the same Design plugin, and the skills link to it.

`playwright-cli` needs the CLI itself. It is a dev dependency (`@playwright/cli`), so after `npm install` run it as `npx playwright-cli`, or install it globally with `npm install -g @playwright/cli`. To update the skill, run `playwright-cli install --skills` again.
