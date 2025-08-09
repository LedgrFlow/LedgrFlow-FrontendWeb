import type * as monaco from "monaco-editor";

export function getCurrencyCompletions(
  monaco: typeof import("monaco-editor"),
  model: monaco.editor.ITextModel,
  position: monaco.Position
) {
  const value = model.getValue();
  const monedasSet = new Set<string>();
  const currencyConfig = value.match(/currencys\s+(.+)/i);

  if (currencyConfig) {
    currencyConfig[1]
      .split(/[, ]+/)
      .map((m) => m.trim())
      .filter(Boolean)
      .forEach((m) => monedasSet.add(m));
  }

  value.split("\n").forEach((l) => {
    const match = l.match(/\$\d+(?:\.\d+)?\s+([A-Z]{3})\b/);
    if (match) monedasSet.add(match[1]);
  });

  return Array.from(monedasSet).map((moneda) => ({
    label: moneda,
    kind: monaco.languages.CompletionItemKind.Constant,
    insertText: moneda,
    detail: "Moneda detectada",
    documentation: `Configurada o inferida`,
    range: new monaco.Range(
      position.lineNumber,
      position.column - 1,
      position.lineNumber,
      position.column
    ),
  }));
}
