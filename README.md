# @mia/cli

[![npm](https://img.shields.io/npm/v/@mia/cli)](https://www.npmjs.com/package/@mia/cli)
[![License: AGPL-3.0](https://img.shields.io/badge/license-AGPL--3.0-blue.svg)](https://github.com/mira-js/mia-core/blob/main/LICENSE)

Zero-install CLI for the MIA research API. Enqueues a research job, polls until it completes, and prints the result.

---

## Usage

No install needed:

```bash
npx @mia/cli research "<query>"
```

Or install globally:

```bash
npm install -g @mia/cli
mia research "<query>"
```

---

## Commands

### `research`

```
mia research "<query>" [options]

Options:
  --depth   quick | deep     Research depth (default: quick)
  --sources <csv>            Comma-separated source list (default: all)
  --help                     Show help

Examples:
  mia research "CRM pain points for small teams"
  mia research "Notion alternatives" --depth deep
  mia research "invoicing frustrations" --sources reddit,hackernews
  mia research "B2B SaaS pricing anxiety" --depth deep --sources reddit
```

**What it does:**
1. `POST /api/v1/research` — enqueues the job and prints the job ID
2. Polls `GET /api/v1/research/:jobId` every 2 seconds (dots printed to show progress)
3. Prints the full `ResearchResult` JSON when the job completes (or exits 1 on failure)
4. Times out after 5 minutes

**Sample session:**

```
$ mia research "indie founders switching from Stripe" --depth quick

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
MIA_API_URL=https://your-mia-instance.example.com mia research "..."
```

Or export it in your shell profile:

```bash
export MIA_API_URL=https://your-mia-instance.example.com
```

### Depth

| `--depth` | What changes |
|-----------|-------------|
| `quick` (default) | 25 Reddit posts/subreddit, 20 HN stories |
| `deep` | 50 Reddit posts/subreddit, 40 HN stories |

### Sources

Comma-separated list of source slugs. Built-in sources: `reddit`, `hackernews`, `news`.

```bash
mia research "query" --sources reddit
mia research "query" --sources hackernews,news
```

---

## Requirements

The CLI requires a running MIA API. Spin one up locally in under 2 minutes:

```bash
git clone https://github.com/mira-js/mia-core.git
cd mia-core && cp .env.example .env
# set OPENAI_API_KEY in .env
docker compose up
```

Then use the CLI from anywhere.

---

## Part of mia-core

This package is part of the [mia-core](https://github.com/mira-js/mia-core) monorepo — a self-hostable market intelligence engine.
