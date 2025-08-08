import Editor, { type OnMount } from "@monaco-editor/react";
import { evaluate } from "mathjs";
import { useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor";
import { linterLedger } from "@/lib/editor/linter";
import { EDITOR_THEMES as Themes } from "@/themes/index";

interface EditorViewProps {
  defaultValue?: string;
  onChange?: (value: string) => void;
  accountsExternal?: string[];
  language?: string;
  onTypingChange?: (typing: boolean) => void;
  onDirtyChange?: (dirty: boolean) => void;
  theme?: string;
}

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

  // 📌 Parser simple para INI
  function parseINIBlock(iniText: string): Record<string, any> {
    const result: Record<string, any> = {};
    let currentSection: string | null = null;
    let currentKey: string | null = null;

    iniText.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith(";"))
        return;

      const sectionMatch = trimmed.match(/^\[(.+?)\]$/);
      if (sectionMatch) {
        currentSection = sectionMatch[1];
        if (!result[currentSection]) result[currentSection] = {};
        currentKey = null;
      } else if (currentSection) {
        const keyValueMatch = trimmed.match(/^(\w+)\s*=\s*(.*)$/);
        if (keyValueMatch) {
          const [, key, value] = keyValueMatch;
          currentKey = key.trim();
          result[currentSection][currentKey] = value;
        } else if (currentKey) {
          // Continuación de la línea anterior (multilínea)
          result[currentSection][currentKey] += `\n${trimmed}`;
        }
      }
    });

    return result;
  }

  function extractMetadata(content: string): Record<string, any> {
    const lines = content
      .split("\n")
      .filter((l) => l.trim().startsWith(";;;"))
      .map((l) => l.replace(/^;;; ?/, ""));

    const iniBlock = lines.join("\n");
    try {
      return parseINIBlock(iniBlock);
    } catch (err) {
      console.warn("❌ Error parsing INI metadata:", err);
      return {};
    }
  }

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    if (!isLedgerCompletionRegistered) {
      monaco.languages.register({ id: "ledger" });
      monaco.languages.setMonarchTokensProvider("ledger", linterLedger);

      monaco.languages.registerCompletionItemProvider("ledger", {
        triggerCharacters: ["*", "+", "-", "/", "(", ")", "$", "=", " ", "\t"],
        provideCompletionItems: (model, position) => {
          const value = model.getValue();
          const line = model.getLineContent(position.lineNumber);
          const suggestions: monaco.languages.CompletionItem[] = [];

          // 🧮 Cálculo matemático
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

          // 💼 Cuentas contables
          const cuentasSet = new Set<string>();
          if (accountsExternal.length) {
            accountsExternal.forEach((acc) => cuentasSet.add(acc));
          } else {
            value.split("\n").forEach((l) => {
              const match = l.match(/^\s+([A-Z][\w:\-]+)/);
              if (match) cuentasSet.add(match[1]);
            });
          }

          cuentasSet.forEach((account) => {
            suggestions.push({
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
            });
          });

          // 💱 Monedas
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

          monedasSet.forEach((moneda) => {
            suggestions.push({
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
            });
          });

          // 📋 Snippets desde metadatos .ini
          const metadata = extractMetadata(value);
          const snippets: { name: string; value: string }[] = [];

          Object.entries(metadata).forEach(([section, values]) => {
            if (section.startsWith("snippet:")) {
              const name = section.split(":")[1];
              if (typeof values === "object" && "value" in values) {
                snippets.push({ name, value: values["value"] });
              }
            }
          });

          // Insertar snippets como sugerencias
          snippets.forEach((tpl) => {
            console.log(tpl);
            suggestions.push({
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
            });
          });

          return { suggestions };
        },
      });
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
