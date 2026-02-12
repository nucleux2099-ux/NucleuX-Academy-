"use client";

import { addBackstageEvent, normalizeSubject } from "./store";

export function subjectFromTopicId(topicId?: string) {
  const subject = (topicId || "").split("/")[0] || "unknown";
  return normalizeSubject(subject);
}

export function logDeckView(args: { deckId: string; deckTitle: string; topicId?: string }) {
  return addBackstageEvent({
    type: "deck_view",
    subject: subjectFromTopicId(args.topicId),
    topicId: args.topicId,
    note: `Deck viewed: ${args.deckTitle} (${args.deckId})`,
  });
}

export function logSlideView(args: {
  deckId: string;
  deckTitle: string;
  slideOrder: number;
  slideHeading: string;
  topicId?: string;
}) {
  return addBackstageEvent({
    type: "slide_view",
    subject: subjectFromTopicId(args.topicId),
    topicId: args.topicId,
    note: `Slide ${args.slideOrder}: ${args.slideHeading} (deck: ${args.deckTitle})`,
  });
}

export function logTemplateInsert(args: {
  deckId: string;
  deckTitle: string;
  templateId: string;
  templateTitle: string;
  topicId?: string;
}) {
  return addBackstageEvent({
    type: "template_insert",
    subject: subjectFromTopicId(args.topicId),
    topicId: args.topicId,
    note: `Template inserted: ${args.templateTitle} (${args.templateId}) into ${args.deckTitle} (${args.deckId})`,
  });
}
