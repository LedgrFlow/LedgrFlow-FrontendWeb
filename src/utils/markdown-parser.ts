import { v4 as uuidv4 } from "uuid";
import type {
  InlineContent,
  DefaultInlineContentSchema,
  DefaultStyleSchema,
  PartialBlock,
} from "@blocknote/core";

const defaultStyles = {
  bold: false,
  italic: false,
  underline: false,
  strikethrough: false,
  textColor: "default",
  backgroundColor: "default",
};

type DefaultInline = InlineContent<DefaultInlineContentSchema, DefaultStyleSchema>;


function mkText(text: string): DefaultInline {
  return { type: "text", text, styles: defaultStyles };
}

export function myMarkdownToCustomBlocks(markdown: string): PartialBlock[] {
  const lines = markdown.split(/\r?\n/);
  const blocks: PartialBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const raw = lines[i];
    const trimmed = raw.trim();

    if (trimmed === "---") {
      blocks.push({
        id: uuidv4(),
        type: "paragraph",
        props: {},
        content: [mkText("")],
        children: [],
      });
      i++;
      continue;
    }

    const hdr = trimmed.match(/^(#{1,6})\s+(.*)/);
    if (hdr) {
      blocks.push({
        id: uuidv4(),
        type: "heading",
        props: {
          level: Math.min(Math.max(hdr[1].length, 1), 6) as
            | 1
            | 2
            | 3
            | 4
            | 5
            | 6,
        },
        content: [mkText(hdr[2])],
        children: [],
      });
      i++;
      continue;
    }

    if (trimmed.startsWith(">")) {
      const text = trimmed.slice(1).trim();
      blocks.push({
        id: uuidv4(),
        type: "quote",
        props: {},
        content: [mkText(text)],
        children: [],
      });
      i++;
      continue;
    }

    const listMatch = trimmed.match(/^([*-]|\d+\.)\s+(.*)/);
    if (listMatch) {
      const isNum = /\d+\./.test(listMatch[1]);
      blocks.push({
        id: uuidv4(),
        type: isNum ? "numberedListItem" : "bulletListItem",
        props: {},
        content: [mkText(listMatch[2])],
        children: [],
      });
      i++;
      continue;
    }

    const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)/);
    if (imgMatch) {
      blocks.push({
        id: uuidv4(),
        type: "image",
        props: { url: imgMatch[2], caption: imgMatch[1] },
        content: undefined,
        children: [],
      });
      i++;
      continue;
    }

    if (trimmed.length > 0) {
      let text = trimmed;
      while (
        i + 1 < lines.length &&
        lines[i + 1].trim().length > 0 &&
        !lines[i + 1].trim().match(/^(#{1,6})\s/) &&
        !lines[i + 1].trim().startsWith(">") &&
        !lines[i + 1].trim().match(/^([*-]|\d+\.)\s/)
      ) {
        i++;
        text += " " + lines[i].trim();
      }
      blocks.push({
        id: uuidv4(),
        type: "paragraph",
        props: {},
        content: [mkText(text)],
        children: [],
      });
      i++;
      continue;
    }

    i++;
  }

  return blocks;
}
