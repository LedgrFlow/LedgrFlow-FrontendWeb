import type * as monaco from "monaco-editor";
import { evaluate } from "mathjs";

export function getMathCompletions(
  monaco: typeof import("monaco-editor"),
  line: string,
  position: monaco.Position
): monaco.languages.CompletionItem[] {
  const suggestions: monaco.languages.CompletionItem[] = [];
  const exprRegexes = [/(?:\$)?([()\d\s\.\+\-\*/]+)$/];

  for (const regex of exprRegexes) {
    const match = line.match(regex);

    if (match) {
      const expr = match[1].replace(/\$/g, "").replace(/\s+/g, "");
      try {
        const result = evaluate(expr);
        const insertText = `$${parseFloat(result.toFixed(2))}`;
        const matchIndex = line.lastIndexOf(match[0]);
        const startColumn = matchIndex + 1;

        suggestions.push({
          label: `${match[0].trim()} = ${insertText}`,
          kind: monaco.languages.CompletionItemKind.Function,
          insertText,
          detail: "Cálculo",
          documentation: `Resultado: ${insertText}`,
          range: new monaco.Range(
            position.lineNumber,
            startColumn,
            position.lineNumber,
            position.column
          ),
        });
      } catch {}
    }
  }

  return suggestions;
}
