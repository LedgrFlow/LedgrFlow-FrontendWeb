import Editor, { type OnMount } from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor";
import { linterLedger } from "@/lib/editor/linter";
import { EDITOR_THEMES as Themes } from "@/themes/index";
import { validateLedger } from "@/lib/editor/rules";
import {
  getAccountsCompletions,
  getCurrencyCompletions,
  getMathCompletions,
  getSnippetsCompletions,
} from "@/lib/editor/completetions/completetions.index";

interface EditorViewProps {
  defaultValue?: string;
  onChange?: (value: string) => void;
  accountsExternal?: string[];
  language?: string;
  onTypingChange?: (typing: boolean) => void;
  onDirtyChange?: (dirty: boolean) => void;
  theme?: string;
}

const markers: monaco.editor.IMarkerData[] = [
  {
    severity: monaco.MarkerSeverity.Error, // Error | Warning | Info | Hint
    message: "Mensaje descriptivo del problema",
    startLineNumber: 1,
    startColumn: 1,
    endLineNumber: 1,
    endColumn: 10,
  },
  {
    severity: monaco.MarkerSeverity.Warning,
    message: "Esto es una advertencia",
    startLineNumber: 3,
    startColumn: 5,
    endLineNumber: 3,
    endColumn: 15,
  },
];

let isLedgerCompletionRegistered = false;

export function EditorView({
  defaultValue = "",
  onChange,
  accountsExternal = [],
  language = "ledger",
  onDirtyChange = () => {},
  onTypingChange = () => {},
  theme = "vs-dark",
}: EditorViewProps) {
  // const [isTyping, setIsTyping] = useState(false);
  // const [isDirty, setIsDirty] = useState(false);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  const handleEditorChange = (newValue: string | undefined) => {
    onTypingChange?.(true);
    onDirtyChange?.(true);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      onChange?.(newValue || "");
      onTypingChange?.(false);
      onDirtyChange?.(false);
    }, 500);
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    if (!isLedgerCompletionRegistered) {
      monaco.languages.register({ id: "ledger" });
      monaco.languages.setMonarchTokensProvider("ledger", linterLedger);

      const model = editor.getModel();
      if (model && model.getLanguageId() === "ledger") {
        model.onDidChangeContent(() => validateLedger(model));
        validateLedger(model); // validar al abrir
      }

      monaco.languages.registerCompletionItemProvider("ledger", {
        triggerCharacters: [
          "*",
          "+",
          "-",
          "/",
          "(",
          ")",
          "$",
          "=",
          " ",
          "\t",
          " ",
        ], // detecta al escribir now o now ±n
        provideCompletionItems: (model, position) => {
          const line = model.getLineContent(position.lineNumber);

          const suggestions = [
            ...getMathCompletions(monaco, line, position),
            ...getAccountsCompletions(
              monaco,
              model,
              position,
              accountsExternal
            ),
            ...getCurrencyCompletions(monaco, model, position),
            ...getSnippetsCompletions(monaco, model, position),
          ];

          return { suggestions };
        },
      });

      // // 🔹 Detectar "now" y forzar menú
      // editor.onDidChangeModelContent(() => {
      //   const pos = editor.getPosition();
      //   const model = editor.getModel();
      //   if (!pos || !model) return;

      //   const text = model.getValueInRange({
      //     startLineNumber: pos.lineNumber,
      //     startColumn: 1,
      //     endLineNumber: pos.lineNumber,
      //     endColumn: pos.column,
      //   });

      //   // Si coincide con "now" o "now +n" o "now -n"
      //   if (/now\s*([+-]\s*\d+)?$/.test(text.trim())) {
      //     editor.trigger("keyboard", "editor.action.triggerSuggest", {});
      //   }
      // });
    }

    try {
      const selectTheme = Themes.find((t) => t.id === theme);
      monaco.editor.defineTheme(
        selectTheme?.id || "vs-dark",
        selectTheme?.theme
      );
      monaco.editor.setTheme(selectTheme?.id || "vs-dark");
    } catch (error) {
      console.error("Error definiendo el tema de Monaco:", error);
      monaco.editor.setTheme("vs-dark");
    }

    isLedgerCompletionRegistered = true;
  };

  return (
    <div style={{ height: "110vh", width: "100%" }} key={theme}>
      <Editor
        className="h-full w-full"
        defaultLanguage={language}
        value={defaultValue}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: true },
          wordWrap: "on",
          fontSize: 14,
          automaticLayout: true,
        }}
        onChange={(val) => handleEditorChange?.(val || "")}
      />
    </div>
  );
}
