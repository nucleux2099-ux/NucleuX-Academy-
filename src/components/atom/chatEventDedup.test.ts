import assert from "node:assert/strict";
import test from "node:test";

import { appendDedupedUserEvent, type ChatTimelineEvent } from "./chatEventDedup";

test("dedups continue-like repeated user event inside time window", () => {
  const baseTs = "2026-03-08T19:00:00.000Z";
  const first: ChatTimelineEvent = { id: "msg-1", label: "You", detail: "continue", ts: baseTs };
  const duplicateByWindow: ChatTimelineEvent = {
    id: "msg-2",
    label: "You",
    detail: "continue",
    ts: "2026-03-08T19:00:01.200Z",
  };

  const withFirst = appendDedupedUserEvent([], first);
  const withDuplicate = appendDedupedUserEvent(withFirst, duplicateByWindow);

  assert.equal(withDuplicate.length, 1);
  assert.equal(withDuplicate[0]?.id, "msg-1");
});

test("allows same text outside dedup window", () => {
  const first: ChatTimelineEvent = { id: "msg-1", label: "You", detail: "continue", ts: "2026-03-08T19:00:00.000Z" };
  const later: ChatTimelineEvent = { id: "msg-2", label: "You", detail: "continue", ts: "2026-03-08T19:00:05.500Z" };

  const out = appendDedupedUserEvent(appendDedupedUserEvent([], first), later);
  assert.equal(out.length, 2);
});
