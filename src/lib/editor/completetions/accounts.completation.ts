import type * as monaco from "monaco-editor";

export function getAccountsCompletions(
  monaco: typeof import("monaco-editor"),
  model: monaco.editor.ITextModel,
  position: monaco.Position,
  accountsExternal: string[]
) {
  const value = model.getValue();
  const cuentasSet = new Set<string>();

  if (accountsExternal.length) {
    accountsExternal.forEach((acc) => cuentasSet.add(acc));
  } else {
    value.split("\n").forEach((l) => {
      const match = l.match(/^\s+([A-Z][\w:\-]+)/);
      if (match) cuentasSet.add(match[1]);
    });
  }

  return Array.from(cuentasSet).map((account) => ({
    label: account,
    kind: monaco.languages.CompletionItemKind.Variable,
    insertText: account,
    detail: "Cuenta contable",
    documentation: `Cuenta sugerida: ${account}`,
    range: new monaco.Range(
      position.lineNumber,
      position.column - 1,
      position.lineNumber,
      position.column
    ),
  }));
}
