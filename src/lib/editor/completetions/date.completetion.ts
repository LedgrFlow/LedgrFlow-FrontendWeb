import type * as monaco from "monaco-editor";

export function getDateSuggestions(
  monaco: typeof import("monaco-editor"),
  model: monaco.editor.ITextModel,
  position: monaco.Position
) {
  const textUntilPos = model
    .getValueInRange({
      startLineNumber: position.lineNumber,
      startColumn: 1,
      endLineNumber: position.lineNumber,
      endColumn: position.column,
    })
    .trim();

  const match = textUntilPos.match(/now\s*([+-]\s*\d+)?$/);

  const today = new Date();
  let daysOffset = 0;

  if (match[1]) {
    const sign = match[1].includes("-") ? -1 : 1;
    const num = parseInt(match[1].replace(/[^0-9]/g, ""), 10);
    daysOffset = sign * num;
  }

  today.setDate(today.getDate() + daysOffset);

  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  const formattedDate = `${yyyy}-${mm}-${dd}`;

  console.log([
    {
      label: formattedDate,
      kind: monaco.languages.CompletionItemKind.Value,
      insertText: formattedDate,
      detail:
        daysOffset === 0
          ? "Fecha de hoy"
          : `Fecha de hoy ${daysOffset > 0 ? "+" : ""}${daysOffset} días`,
      range: new monaco.Range(
        position.lineNumber,
        position.column - (match[0]?.length || 0),
        position.lineNumber,
        position.column
      ),
    },
  ]);

  return [
    {
      label: formattedDate,
      kind: monaco.languages.CompletionItemKind.Function,
      insertText: formattedDate,
      detail:
        daysOffset === 0
          ? "Fecha de hoy"
          : `Fecha de hoy ${daysOffset > 0 ? "+" : ""}${daysOffset} días`,
      range: new monaco.Range(
        position.lineNumber,
        position.column - (match[0]?.length || 0),
        position.lineNumber,
        position.column
      ),
    },
  ];
}
