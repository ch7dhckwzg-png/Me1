# Project skills

These skills load automatically in any Claude Code session on this repo, including the web and mobile apps. They need no plugin install.

| Skill | Source | Licence |
| --- | --- | --- |
| `frontend-design` | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/frontend-design) | Apache 2.0 |
| `design-critique`, `accessibility-review`, `ux-copy` | [anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins/tree/main/design) (Design plugin) | Apache 2.0 |
| `apple-design` | [emilkowalski/skills](https://github.com/emilkowalski/skills/tree/main/skills/apple-design) (Emil Kowalski) | MIT |
| `transitions-dev` | [Jakubantalik/transitions.dev](https://github.com/Jakubantalik/transitions.dev/tree/main/skills/transitions-dev) | Transitions.dev licence (free use, no redistribution as a library) |
| `web-design-guidelines` | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines) | MIT |
| `impeccable` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) (impeccable.style), without the optional design hook | Apache 2.0 |
| `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-react`, `gsap-plugins`, `gsap-utils`, `gsap-performance`, `gsap-frameworks` | [greensock/gsap-skills](https://github.com/greensock/gsap-skills) (official) | MIT |
| `threejs-*` (13 skills) | [CloudAI-X/threejs-skills](https://github.com/CloudAI-X/threejs-skills) (community, not official three.js) | MIT |
| `shadcn` | [shadcn-ui/ui](https://github.com/shadcn-ui/ui/tree/main/skills/shadcn) (official; evals and Codex config left out) | MIT |
| `ponytail`, `ponytail-review`, `ponytail-audit`, `ponytail-debt`, `ponytail-gain`, `ponytail-help` | [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) (skills only; its hooks and status line are left out). Say "stop ponytail" or "normal mode" to turn it off for a session | MIT |
| `skill-inspector` | [NVIDIA/SkillSpector](https://github.com/NVIDIA/SkillSpector). Checks a skill is safe before installing it. Needs the `skillspector` CLI: `uv tool install --python 3.13 git+https://github.com/NVIDIA/skillspector.git` | Apache 2.0 |
| `playwright-cli` | Written by `playwright-cli install --skills` ([microsoft/playwright-cli](https://github.com/microsoft/playwright-cli)) | Apache 2.0 |
| `design-taste-frontend` (Taste) | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | See repo |
| `img2threejs` | [img2threejs/img2threejs](https://github.com/img2threejs/img2threejs) | Apache 2.0 |
| `remotion-*` (13 skills, router: `remotion-best-practices`) | [remotion-dev/skills](https://github.com/remotion-dev/skills), installed with `npx skills add remotion-dev/skills --agent claude-code`. Taste and img2threejs were added the same way (`npx skills add <repo> --agent claude-code`) | See [Remotion licence](https://www.remotion.dev/license) |

All are copied unchanged. Each folder has its licence. `../CONNECTORS.md` comes from the same Design plugin, and the skills link to it.

`playwright-cli` needs the CLI itself. It is a dev dependency (`@playwright/cli`), so after `npm install` run it as `npx playwright-cli`, or install it globally with `npm install -g @playwright/cli`. To update the skill, run `playwright-cli install --skills` again.

`impeccable` runs a helper (`scripts/impeccable`) that downloads its engine from the project's GitHub releases on first use and checks it against `scripts/engine-checksums.txt`.

**Figma:** Figma's skills aren't copied here (they're under Figma's developer terms). Instead `../settings.json` enables Figma's official plugin, `figma@claude-plugins-official`, which brings its skills and the Figma MCP server. Connect your Figma account with `/mcp` the first time.

Versions of all CLI-installed skills are pinned in `/skills-lock.json`; refresh them with `npx skills update -p`.

Awesome Design (VoltAgent/awesome-design-md) is a library of `DESIGN.md` references rather than a skill; it lives in `design/references/`.
