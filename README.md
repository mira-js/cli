# @mira/cli

[![npm](https://img.shields.io/npm/v/@mira/cli)](https://www.npmjs.com/package/@mira/cli)
[![License: AGPL-3.0](https://img.shields.io/badge/license-AGPL--3.0-blue.svg)](./LICENSE)

Zero-install CLI for the MIRA research API. Enqueues a research job, polls until it completes, and prints the result.

---

## Usage

No install needed:

```bash
npx @mira/cli research "<query>"
```

Or install globally:

```bash
npm install -g @mira/cli
mira research "<query>"
```

---

## Commands

### `research`

```
mira research "<query>" [options]

Options:
  --depth   quick | deep     Research depth (default: quick)
  --sources <csv>            Comma-separated source list (default: all)
  --help                     Show help

Examples:
  mira research "CRM pain points for small teams"
  mira research "Notion alternatives" --depth deep
  mira research "invoicing frustrations" --sources reddit,hackernews
  mira research "B2B SaaS pricing anxiety" --depth deep --sources reddit
```

**What it does:**
1. `POST /api/v1/research` — enqueues the job and prints the job ID
2. Polls `GET /api/v1/research/:jobId` every 2 seconds (dots printed to show progress)
3. Prints the full `ResearchResult` JSON when the job completes (or exits 1 on failure)
4. Times out after 5 minutes

**Sample session:**

```
$ mira research "indie founders switching from Stripe" --depth quick

Queuing research: "indie founders switching from Stripe" (depth: quick)
Job queued: clxyz123abc
Waiting..........

--- Result ---
{
  "query": "indie founders switching from Stripe",
  "summary": "Founders cite dispute resolution and webhook reliability as...",
  "painPoints": [...],
  ...
}
```

---

## Configuration

### API endpoint

By default the CLI talks to `http://localhost:3000`. Override with:

```bash
MIRA_API_URL=https://your-mira-instance.example.com mira research "..."
```

Or export it in your shell profile:

```bash
export MIRA_API_URL=https://your-mira-instance.example.com
```

### Depth

| `--depth` | What changes |
|-----------|-------------|
| `quick` (default) | 25 Reddit posts/subreddit, 20 HN stories |
| `deep` | 50 Reddit posts/subreddit, 40 HN stories |

### Sources

Comma-separated list of source slugs. Built-in sources: `reddit`, `hackernews`, `news`.

```bash
mira research "query" --sources reddit
mira research "query" --sources hackernews,news
```

---

## Requirements

The CLI requires a running MIRA API (see [github.com/mira-js/api](https://github.com/mira-js/api)). Point the CLI at it with `MIRA_API_URL`.

---

## License

AGPL-3.0-only — see [LICENSE](./LICENSE).
Contributions require signing the [CLA](https://github.com/mira-js/.github/blob/main/CLA.md) — see [CONTRIBUTING.md](https://github.com/mira-js/.github/blob/main/CONTRIBUTING.md).

Copyright (C) 2026 Fernando Nieto Pallares
