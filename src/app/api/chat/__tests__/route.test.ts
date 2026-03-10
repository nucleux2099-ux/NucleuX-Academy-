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

test('continue route style message still resolves retrieval query to previous user topic', () => {
  const messages: IncomingMessage[] = [
    { role: 'user', content: 'Differentiate Crohn disease vs ulcerative colitis on pathology' },
    { role: 'assistant', content: 'Crohn has transmural inflammation...' },
    {
      role: 'user',
      content: 'Continue exactly from where the last answer stopped about: Differentiate Crohn disease vs ulcerative colitis on pathology. Stay on same topic and format.',
    },
  ]

  const { query, continueLike } = resolveQueryForRetrieval(messages)

  assert.equal(continueLike, true)
  assert.equal(query, 'Differentiate Crohn disease vs ulcerative colitis on pathology')
})
