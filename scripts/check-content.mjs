import { comarkContent } from 'comark-content'
import json from 'comark-content/plugins/json'
import fs from 'comark-content/sources/fs'

const content = comarkContent({
  source: fs('./content'),
  plugins: [json({ onError: 'throw' })],
  onError: 'throw',
})

const requiredFields = new Map([
  ['/answer-videos', ['title', 'description', 'videoUrl', 'videoPathname', 'uploadedAt']],
  ['/capabilities', ['id', 'name', 'group_name', 'friction', 'functionality', 'outcome', 'roles', 'position']],
  ['/competitor-analysis', ['question', 'priority', 'segment', 'vendors']],
  ['/content-blocks', ['block_key', 'title', 'body', 'status', 'updated_at']],
  ['/demo-environment', ['id', 'label', 'value', 'url', 'status', 'notes', 'position', 'details']],
  ['/documents', ['id', 'doc_type', 'name', 'description', 'status', 'position', 'versions']],
  ['/poc-steps', ['id', 'track', 'step_key', 'title', 'summary', 'status', 'detail', 'position']],
  ['/poc-users', ['id', 'name', 'email', 'role', 'team', 'status', 'notes', 'position']],
  [
    '/pricing-bands',
    [
      'id',
      'band_key',
      'label',
      'max_seats',
      'platform_fee',
      'per_seat_monthly',
      'list_equivalent',
      'support_standard_pct',
      'is_custom',
      'discount_pct',
      'position',
    ],
  ],
  ['/recordings', ['id', 'title', 'description', 'url', 'recorded_at', 'duration', 'position']],
  [
    '/requirements',
    [
      'id',
      'category',
      'name',
      'need',
      'coverage',
      'vercel_answer',
      'suggestion',
      'description',
      'poc_scope',
      'owner',
      'result',
      'scored',
      'poc_status',
      'position',
      'videos',
    ],
  ],
  ['/saved-offers', ['id', 'name', 'snapshot', 'total', 'notes', 'created_at']],
  ['/security-items', ['id', 'category', 'title', 'description', 'link', 'position']],
])

function assertRecord(value, location) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${location} must be an object.`)
  }
}

function assertFields(value, fields, location) {
  assertRecord(value, location)
  for (const field of fields) {
    if (!(field in value)) throw new Error(`${location} is missing ${field}.`)
  }
}

function assertNestedItems(item, path, location) {
  if (path === '/competitor-analysis') {
    const segments = new Set(['Build', 'Share', 'Deploy', 'Authenticate', 'Govern', 'Maintain'])
    const verdicts = new Set(['Yes', 'Partial', 'No'])

    if (!segments.has(item.segment)) throw new Error(`${location}.segment is invalid.`)
    assertRecord(item.vendors, `${location}.vendors`)
    if (Object.keys(item.vendors).length === 0) throw new Error(`${location}.vendors must not be empty.`)

    for (const [vendorName, assessment] of Object.entries(item.vendors)) {
      const assessmentLocation = `${location}.vendors.${vendorName}`
      assertFields(assessment, ['answer', 'justification', 'sources', 'needs_review'], assessmentLocation)
      if (!verdicts.has(assessment.answer)) {
        throw new Error(`${assessmentLocation}.answer must be Yes, Partial, or No.`)
      }
      if (!Array.isArray(assessment.sources)) {
        throw new Error(`${assessmentLocation}.sources must be an array.`)
      }
      if (typeof assessment.needs_review !== 'boolean') {
        throw new Error(`${assessmentLocation}.needs_review must be a boolean.`)
      }

      for (const [sourceIndex, source] of assessment.sources.entries()) {
        const sourceLocation = `${assessmentLocation}.sources[${sourceIndex}]`
        if (typeof source !== 'string') throw new Error(`${sourceLocation} must be a string.`)
        try {
          const url = new URL(source.replace(/\s+\(internal\)\s*$/i, ''))
          if (url.protocol !== 'https:') throw new Error('Source URL must use HTTPS.')
        } catch {
          throw new Error(`${sourceLocation} must be a valid HTTPS URL.`)
        }
      }
    }
  }

  if (path === '/demo-environment') {
    if (!Array.isArray(item.details)) throw new Error(`${location}.details must be an array.`)
    for (const [index, detail] of item.details.entries()) {
      assertFields(
        detail,
        ['id', 'item_id', 'label', 'value', 'notes', 'position'],
        `${location}.details[${index}]`,
      )
    }
  }

  if (path === '/documents') {
    if (!Array.isArray(item.versions)) throw new Error(`${location}.versions must be an array.`)
    for (const [versionIndex, version] of item.versions.entries()) {
      const versionLocation = `${location}.versions[${versionIndex}]`
      assertFields(
        version,
        [
          'id',
          'document_id',
          'version_label',
          'version_date',
          'whats_new',
          'status',
          'file_url',
          'file_name',
          'position',
          'created_at',
          'changes',
        ],
        versionLocation,
      )
      if (!Array.isArray(version.changes)) throw new Error(`${versionLocation}.changes must be an array.`)
      for (const [changeIndex, change] of version.changes.entries()) {
        assertFields(
          change,
          ['id', 'version_id', 'section', 'change_type', 'description', 'position'],
          `${versionLocation}.changes[${changeIndex}]`,
        )
      }
    }
  }

  if (path === '/requirements') {
    const coverageValues = new Set(['native', 'configurable', 'discuss'])
    const statusValues = new Set(['not_started', 'in_progress', 'met'])

    if (!coverageValues.has(item.coverage)) throw new Error(`${location}.coverage is invalid.`)
    if (!statusValues.has(item.poc_status)) throw new Error(`${location}.poc_status is invalid.`)
    if (typeof item.scored !== 'boolean') throw new Error(`${location}.scored must be a boolean.`)

    for (const field of ['name', 'need', 'poc_scope', 'owner', 'result']) {
      if (typeof item[field] !== 'string' || item[field].trim() === '') {
        throw new Error(`${location}.${field} must not be empty.`)
      }
    }

    if (!Array.isArray(item.videos)) throw new Error(`${location}.videos must be an array.`)
    for (const [index, video] of item.videos.entries()) {
      assertFields(
        video,
        ['id', 'requirement_id', 'title', 'url', 'position'],
        `${location}.videos[${index}]`,
      )
    }
  }
}

for (const [path, fields] of requiredFields) {
  const document = await content.get(path)
  if (!document) throw new Error(`Missing content document ${path}.`)
  if (!Array.isArray(document.data.items)) throw new Error(`${path}.items must be an array.`)

  for (const [index, item] of document.data.items.entries()) {
    const location = `${path}.items[${index}]`
    assertFields(item, fields, location)
    assertNestedItems(item, path, location)
  }

  if (path === '/competitor-analysis') {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(document.data.updated_at)) {
      throw new Error(`${path}.updated_at must use YYYY-MM-DD.`)
    }

    const questions = new Set()
    const expectedVendors = Object.keys(document.data.items[0]?.vendors ?? {}).sort().join('|')
    for (const [index, item] of document.data.items.entries()) {
      if (questions.has(item.question)) throw new Error(`${path}.items[${index}].question must be unique.`)
      questions.add(item.question)

      const vendors = Object.keys(item.vendors).sort().join('|')
      if (vendors !== expectedVendors) {
        throw new Error(`${path}.items[${index}].vendors must match the first item.`)
      }
    }
  }
}

console.log(`Validated ${requiredFields.size} filesystem content documents.`)
