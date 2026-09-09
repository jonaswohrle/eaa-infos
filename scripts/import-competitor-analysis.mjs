import { readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'

const inputPath = process.argv.slice(2).find((argument) => argument !== '--')

if (!inputPath) {
  throw new Error('Usage: pnpm content:competitors:import -- /absolute/path/to/notion-export.json')
}

const resolvedInputPath = path.resolve(inputPath)
const outputPath = path.resolve('content/competitor-analysis.json')
const source = JSON.parse(await readFile(resolvedInputPath, 'utf8'))

if (!Array.isArray(source)) {
  throw new Error('The competitor analysis source must be a JSON array.')
}

function normalizeAnswer(answer, location) {
  if (typeof answer !== 'string') throw new Error(`${location}.answer must be a string.`)

  const beforeEmDash = answer.split(/\s+[—–]\s+/u)[0]
  const withoutEmoji = beforeEmDash.replace(/[\p{Extended_Pictographic}\uFE0F]/gu, '').trim()
  const match = withoutEmoji.match(/\b(yes|partial|no)\b/i)

  if (!match) {
    throw new Error(`${location}.answer must begin with Yes, Partial, or No.`)
  }

  return `${match[1][0].toUpperCase()}${match[1].slice(1).toLowerCase()}`
}

const items = source.map((row, rowIndex) => {
  if (!row || typeof row !== 'object' || Array.isArray(row)) {
    throw new Error(`items[${rowIndex}] must be an object.`)
  }
  if (!row.vendors || typeof row.vendors !== 'object' || Array.isArray(row.vendors)) {
    throw new Error(`items[${rowIndex}].vendors must be an object.`)
  }

  return {
    ...row,
    vendors: Object.fromEntries(
      Object.entries(row.vendors).map(([vendorName, assessment]) => {
        if (!assessment || typeof assessment !== 'object' || Array.isArray(assessment)) {
          throw new Error(`items[${rowIndex}].vendors.${vendorName} must be an object.`)
        }

        return [
          vendorName,
          {
            ...assessment,
            answer: normalizeAnswer(assessment.answer, `items[${rowIndex}].vendors.${vendorName}`),
          },
        ]
      }),
    ),
  }
})

const sourceStats = await stat(resolvedInputPath)
const document = {
  updated_at: sourceStats.mtime.toISOString().slice(0, 10),
  items,
}

await writeFile(outputPath, `${JSON.stringify(document, null, 2)}\n`)
console.log(`Imported ${items.length} competitor capabilities into ${outputPath}.`)
