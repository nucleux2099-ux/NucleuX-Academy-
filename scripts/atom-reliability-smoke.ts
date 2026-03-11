#!/usr/bin/env tsx

import assert from 'node:assert/strict'
import { buildChatSystemPrompt, resolveQueryForRetrieval, type IncomingMessage } from '../src/app/api/chat/route'

function checkContinueContinuity() {
  const messages: IncomingMessage[] = [
    { role: 'user', content: 'Explain post-pancreaticoduodenectomy hemorrhage classification.' },
    { role: 'assistant', content: 'Classification discussion...' },
    { role: 'user', content: 'continue' },
  ]

  const out = resolveQueryForRetrieval(messages)
  assert.equal(out.continueLike, true, 'continue-like follow-up was not detected')
  assert.match(
    out.query.toLowerCase(),
    /post-pancreaticoduodenectomy hemorrhage|classification/,
    `follow-up query lost previous topic context: ${out.query}`,
  )
}

function checkSelectedBookInsufficiencyLanguage() {
  const prompt = buildChatSystemPrompt({
    strictSourceGrounding: true,
    deskSources: ['Shackelford 9e', 'Blumgart 7e'],
    sourceKeywords: ['shackelford', 'blumgart'],
    sourceBiased: true,
    relevantContent: '',
    continueLike: false,
  })

  assert.match(
    prompt,
    /No relevant content found in the selected sources[\s\S]*insufficiency response/i,
    'strict selected-source insufficiency instruction is missing',
  )
}

try {
  console.log('[atom-reliability] running continue continuity check...')
  checkContinueContinuity()
  console.log('[atom-reliability] PASS continue continuity')

  console.log('[atom-reliability] running selected-book insufficiency check...')
  checkSelectedBookInsufficiencyLanguage()
  console.log('[atom-reliability] PASS strict source insufficiency language')

  console.log('[atom-reliability] all checks passed')
} catch (error) {
  console.error('[atom-reliability] FAIL', error)
  process.exit(1)
}
