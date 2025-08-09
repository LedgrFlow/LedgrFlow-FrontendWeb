import type * as monaco from "monaco-editor";
import * as yaml from "js-yaml";

function extractMetadata(value: string) {
  const match = value.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  try {
    return yaml.load(match[1]) as Record<string, any>;
  } catch (err) {
    console.error("Error parsing YAML metadata:", err);
    return {};
  }
}

export function getSnippetsCompletions(
  monaco: typeof import("monaco-editor"),
  model: monaco.editor.ITextModel,
  position: monaco.Position
) {
  const value = model.getValue();
  const metadata = extractMetadata(value);

  const snippets: { name: string; value: string }[] = [];

  if (metadata.snippets && typeof metadata.snippets === "object") {
    Object.entries(metadata.snippets).forEach(([name, snippet]) => {
      if (typeof snippet === "string") {
        snippets.push({ name, value: snippet });
      }
    });
  }

  return snippets.map((tpl) => ({
    label: tpl.name,
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: tpl.value
      .replaceAll("\n", "\n\t")
      .replace("$DATE", "${1:2025-07-29}")
      .replace("$AMOUNT", "${2:100.00}")
      .replace("$monto", "${2:100.00}"),
    insertTextRules:
      monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: tpl.name,
    detail: "Transacción común",
    range: new monaco.Range(
      position.lineNumber,
      position.column - 1,
      position.lineNumber,
      position.column
    ),
  }));
}
