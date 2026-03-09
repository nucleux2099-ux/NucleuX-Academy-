/**
 * NucleuX Academy - ATOM v2: Shared Streaming Utilities
 *
 * Helpers used by both the ATOMWidgetV2 (floating widget) and
 * the full-page /chat Studio to deduplicate assistant messages
 * during SSE streaming.
 *
 * Extracted to avoid coupling the chat page to any specific
 * widget component.
 */

import type { ATOMMessage } from '@/lib/types/atom';

/**
 * During streaming, each `content_delta` SSE event dispatches an
 * ADD_MESSAGE with the accumulated text so far. This creates a
 * run of trailing assistant messages that differ only in length.
 *
 * This helper collapses that trailing run into a single message
 * (the latest one, which has the most content) while preserving
 * all prior messages unchanged.
 */
export function deduplicateStreamingMessages(
  messages: ATOMMessage[],
  isStreaming: boolean
): ATOMMessage[] {
  if (!isStreaming || messages.length === 0) return messages;

  const result: ATOMMessage[] = [];
  let trailingAssistantStart = messages.length;

  // Walk backwards to find where the trailing assistant run begins
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'assistant') {
      trailingAssistantStart = i;
    } else {
      break;
    }
  }

  // Keep everything before the trailing run
  for (let i = 0; i < trailingAssistantStart; i++) {
    result.push(messages[i]);
  }

  // Keep only the last (most complete) assistant message from the run
  if (trailingAssistantStart < messages.length) {
    result.push(messages[messages.length - 1]);
  }

  return result;
}

/**
 * Returns true when the last message in the array is NOT from the
 * assistant — meaning the streaming accumulator hasn't produced
 * any visible content yet (used to show the typing indicator).
 */
export function accumulatorIsEmpty(messages: ATOMMessage[]): boolean {
  if (!messages.length) return true;
  return messages[messages.length - 1].role !== 'assistant';
}
