import Editor from "@monaco-editor/react";
import { useEffect, useRef } from "react";
import { EDITOR_THEMES as Themes } from "@/themes/index";
import { linterLedger } from "@/lib/editor/linter";

const sampleLedger = `
---
currency: USD
snippets:
  dining: Expenses:Food:DiningOut
  groceries: Expenses:Food:Groceries
  rent: Expenses:Rent
  salary: Income:Salary
taxes:
  ISR: '0.30'
  IVA: '0.16'
---

; Activos
account Assets:Bank:Checking
  description: Money in your bank account
  alias: Bank Account
  type: asset

account Assets:Bank:Savings
  description: Money in your savings account
  alias: Savings Account
  type: asset

2025-01-15 * Paycheck 
  Assets:Bank:Checking              $7,500.00
  Income:Salary
  ;; #Salary #Paycheck
  ;; @monthly

2025-01-20 * Grocery Shopping
  Expenses:Food:Groceries           $250.00 +{IVA}
  Assets:Bank:Checking
  ;; #Groceries #Shopping
  ;; @weekly
  ;; UUID: f2c2a-3bd1
  ;; Ticket: [ticket](./tickets/compu-2025.jpg)
  ;; Responsable: Eduardo
`;

export function MiniEditorPreview({
  theme = "vs-dark",
  language = "ledger",
  fontSize = 14,
  height = 200,
  wordWrap = "on",
  minimap = false,
  numberline = "on",
}: {
  theme?: string;
  language?: string;
  fontSize?: number;
  height?: number;
  wordWrap?: "on" | "off" | "wordWrapColumn" | "bounded" | undefined;
  minimap?: boolean;
  numberline?: "on" | "off" | "relative" | undefined;
}) {
  const monacoRef = useRef<typeof import("monaco-editor") | null>(null);
  const editorRef = useRef<any>(null);

  // Define todos los temas antes de montar
  const handleEditorWillMount = (monaco: typeof import("monaco-editor")) => {
    Themes.forEach(({ theme, id }) => {
      // Ignorar temas por defecto para no sobreescribirlos
      if (!["vs", "vs-dark", "hc-black"].includes(id)) {
        try {
          monaco.editor.defineTheme(id, theme);
        } catch (e) {
          console.error(`Error definiendo tema ${id}:`, e);
        }
      }
    });

    monaco.languages.register({ id: "ledger" });
    monaco.languages.setMonarchTokensProvider("ledger", linterLedger);
  };

  // Guarda la instancia de monaco y editor
  const handleEditorDidMount = (
    editor: any,
    monaco: typeof import("monaco-editor")
  ) => {
    monacoRef.current = monaco;
    editorRef.current = editor;

    // Aplicar tema actual una vez montado el editor
    if (theme) {
      const selectedTheme = Themes.find((t) => t.id === theme);
      if (selectedTheme) {
        try {
          monaco.editor.setTheme(selectedTheme.id);
        } catch (error) {
          console.error("Error al aplicar el tema:", error);
          monaco.editor.setTheme("vs-dark");
        }
      }
    }
  };

  // Cada vez que cambie el prop theme, aplicamos el nuevo tema
  useEffect(() => {
    if (monacoRef.current) {
      const selectedTheme = Themes.find((t) => t.id === theme);
      if (selectedTheme) {
        try {
          monacoRef.current.editor.setTheme(selectedTheme.id);
        } catch (error) {
          console.error("Error al aplicar el tema:", error);
          monacoRef.current.editor.setTheme("vs-dark");
        }
      } else {
        monacoRef.current.editor.setTheme("vs-dark");
      }
    }
  }, [theme]);

  return (
    <div
      className="rounded border border-muted bg-background transition-opacity duration-300"
      style={{ height }}
    >
      <Editor
        key={theme}
        beforeMount={handleEditorWillMount}
        onMount={handleEditorDidMount}
        value={sampleLedger}
        defaultLanguage={language}
        // theme={theme} // Esto sigue necesario, pero el setTheme manual lo actualiza en runtime
        options={{
          readOnly: true,
          fontSize: fontSize,
          wordWrap: wordWrap,
          minimap: { enabled: minimap },
          lineNumbers: numberline,
          renderLineHighlight: "none",
          scrollBeyondLastLine: false,
          padding: { top: 8, bottom: 8 },
          overviewRulerLanes: 0,
        }}
      />
    </div>
  );
}
