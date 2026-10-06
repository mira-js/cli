<div align="center">

# `@mira/cli`

**One command from question to answer.**

```
mira research "<query>"
```

[![npm](https://img.shields.io/npm/v/@mira/cli?style=flat-square&color=818cf8&labelColor=0e1320)](https://www.npmjs.com/package/@mira/cli)
[![license](https://img.shields.io/badge/license-AGPL--3.0-818cf8?style=flat-square&labelColor=0e1320)](./LICENSE)

</div>

<br>

Posts a research job to a running [`@mira/api-core`](https://github.com/mira-js/api) server, waits for it to finish and prints the result as JSON.

## Install

```sh
npm install -g @mira/cli
```

Needs a running Mira API. Point at it with `MIRA_API_URL` (defaults to `http://localhost:3000`).

## Run

```console
$ mira research "invoicing software" --depth quick --sources reddit,hackernews
Queuing research: "invoicing software" (depth: quick)
Job queued: 1
Waiting.....

--- Result ---
{
  "query": "invoicing software",
  "summary": "...",
  "painPoints": [ ... ],
  "competitorWeaknesses": [ ... ],
  "emergingGaps": [ ... ],
  "rawItems": [ ... ]
}
```

| Option | |
|:--|:--|
| `--depth quick\|deep` | Research depth. Anything else falls back to `quick`. |
| `--sources a,b` | Comma-separated source slugs. Omit for the server default. |
| `--help`, `-h` | Print usage. |

> [!TIP]
> Progress lines print before the result, so the full output isn't plain JSON. Everything after `--- Result ---` is.

## Exit codes

| | |
|:--|:--|
| `0` | Job completed, or usage printed |
| `1` | Job failed, timed out, or an HTTP error occurred |

## Where it sits

```mermaid
flowchart LR
  cli["cli"] -- HTTP --> api["api-core"]
  cli -. types .-> shared["shared-core"]
  api --> services["core-services"]
  api --> collectors["core-collectors"]
  services --> shared
  collectors --> shared
  classDef here fill:#818cf8,stroke:#a5b4fc,color:#0a0d1a
  classDef pkg fill:#0e1320,stroke:#2a3250,color:#c7cbe0
  class cli here
  class api,services,shared,collectors pkg
```

The CLI talks to the API over HTTP only, and uses `shared-core` for types.

<details>
<summary><b>Build from source</b></summary>

<br>

Clone next to `shared` in a pnpm workspace, then:

```sh
pnpm install
pnpm --filter @mira/cli build
```

The `mira` binary lands in `dist/index.js`.

</details>

<br>

<div align="center">
<sub>
Part of <a href="https://github.com/mira-js">Mira's open core</a> ·
<a href="./LICENSE">AGPL-3.0-only</a> ·
<a href="https://github.com/mira-js/.github/blob/main/CONTRIBUTING.md">Contributing</a> (<a href="https://github.com/mira-js/.github/blob/main/CLA.md">CLA</a>) ·
<a href="https://github.com/mira-js/cli/security/advisories/new">Report a vulnerability</a>
<br>
Copyright (C) 2026 Fernando Nieto Pallares
</sub>
</div>
