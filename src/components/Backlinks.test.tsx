import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import { renderHighlightedContext } from "./Backlinks";

test("renderHighlightedContext highlights topic titles with regex-special characters", () => {
  const topicTitle = "C++ (Basics)?";
  const context = "Start C++ (Basics)? then revisit c++ (BASICS)? before moving on.";

  const html = renderToStaticMarkup(<>{renderHighlightedContext(context, topicTitle)}</>);

  assert.match(html, /<mark[^>]*>C\+\+ \(Basics\)\?<\/mark>/);
  assert.match(html, /<mark[^>]*>c\+\+ \(BASICS\)\?<\/mark>/);
  assert.equal((html.match(/<mark/g) ?? []).length, 2);
});
