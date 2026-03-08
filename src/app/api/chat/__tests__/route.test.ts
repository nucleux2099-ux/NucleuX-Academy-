import test from 'node:test'
import assert from 'node:assert/strict'

import { buildChatSystemPrompt, resolveQueryForRetrieval, type IncomingMessage } from '@/app/api/chat/route'

test('continue-like prompt reuses previous user topic for retrieval context', () => {
  const messages: IncomingMessage[] = [
    { role: 'user', content: 'Explain Starling forces in pulmonary edema' },
    { role: 'assistant', content: 'Starling forces determine net fluid movement across capillaries...' },
    { role: 'user', content: 'continue' },
  ]

  const { query, continueLike } = resolveQueryForRetrieval(messages)

  assert.equal(continueLike, true)
  assert.equal(query, 'Explain Starling forces in pulmonary edema')
})

test('strict source grounding with no relevant content injects insufficiency guidance', () => {
  const prompt = buildChatSystemPrompt({
    deskSources: ['Bailey & Love'],
    strictSourceGrounding: true,
    sourceKeywords: ['bailey'],
    sourceBiased: true,
    relevantContent: '',
    continueLike: false,
  })

  assert.match(prompt, /No relevant content found in the selected sources/i)
  assert.match(prompt, /selected books do not contain enough support/i)
  assert.match(prompt, /ask the learner to broaden source selection/i)
})
