#!/usr/bin/env node
import type { ResearchJobInput, JobStatus } from '@mira/shared-core'

const API_BASE = process.env.MIRA_API_URL ?? 'http://localhost:3000'
const POLL_INTERVAL_MS = 2000
const POLL_TIMEOUT_MS = 5 * 60 * 1000

function parseArgs(argv: string[]): ResearchJobInput & { help?: boolean } {
  const args = argv.slice(2)

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    return { query: '', help: true }
  }

  const query = args[0]
  let depth: 'quick' | 'deep' = 'quick'
  let sources: ResearchJobInput['sources']

  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--depth' && args[i + 1]) {
      const d = args[i + 1]
      if (d === 'quick' || d === 'deep') depth = d
      i++
    } else if (args[i] === '--sources' && args[i + 1]) {
      const raw = args[i + 1].split(',').map((s) => s.trim())
      // Import Source enum values at runtime — keep CLI dep-free of enum import
      sources = raw as ResearchJobInput['sources']
      i++
    }
  }

  return { query, depth, sources }
}

async function enqueue(input: ResearchJobInput): Promise<string> {
  const res = await fetch(`${API_BASE}/api/v1/research`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Enqueue failed (${res.status}): ${body}`)
  }
  const data = (await res.json()) as { jobId: string }
  return data.jobId
}

interface JobResponse {
  jobId: string
  status: JobStatus
  result?: unknown
}

async function pollJob(jobId: string): Promise<JobResponse> {
  const deadline = Date.now() + POLL_TIMEOUT_MS
  while (Date.now() < deadline) {
    const res = await fetch(`${API_BASE}/api/v1/research/${jobId}`)
    if (!res.ok) throw new Error(`Poll failed (${res.status})`)
    const job = (await res.json()) as JobResponse
    if (job.status === 'completed' || job.status === 'failed') return job
    process.stdout.write('.')
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))
  }
  throw new Error(`Timed out waiting for job ${jobId}`)
}

function printUsage(): void {
  console.log(`
Usage: mira research "<query>" [options]

Options:
  --depth quick|deep          Research depth (default: quick)
  --sources reddit,hackernews,news  Comma-separated sources (default: all)
  --help                      Show this help

Examples:
  mira research "CRM pain points"
  mira research "Notion alternatives" --depth deep
  mira research "project management" --sources reddit,hackernews
`.trim())
}

async function main(): Promise<void> {
  const input = parseArgs(process.argv)

  if (input.help || !input.query) {
    printUsage()
    process.exit(input.help ? 0 : 1)
  }

  console.log(`Queuing research: "${input.query}" (depth: ${input.depth ?? 'quick'})`)

  const jobId = await enqueue(input)
  console.log(`Job queued: ${jobId}`)
  process.stdout.write('Waiting')

  const job = await pollJob(jobId)
  process.stdout.write('\n')

  if (job.status === 'failed') {
    console.error('Job failed.')
    process.exit(1)
  }

  console.log('\n--- Result ---')
  console.log(JSON.stringify(job.result, null, 2))
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
})
