# Project skills

These skills load automatically in any Claude Code session on this repo, including the web and mobile apps. They need no plugin install.

| Skill | Source | Licence |
| --- | --- | --- |
| `frontend-design` | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/frontend-design) | Apache 2.0 |
| `design-critique`, `accessibility-review`, `ux-copy` | [anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins/tree/main/design) (Design plugin) | Apache 2.0 |
| `remotion-*` (13 skills, router: `remotion-best-practices`) | [remotion-dev/skills](https://github.com/remotion-dev/skills), installed with `npx skills add remotion-dev/skills --agent claude-code` | See [Remotion licence](https://www.remotion.dev/license) |

All are copied unchanged. Each folder has its licence. Remotion skill versions are pinned in `/skills-lock.json`; refresh them with `npx skills update -p`. `../CONNECTORS.md` comes from the same Design plugin, and the skills link to it.
