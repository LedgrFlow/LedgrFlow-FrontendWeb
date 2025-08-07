import { useAuth } from "@/contexts/AuthContext";
import { useFiles } from "@/contexts/FilesContext";
import { useLedger } from "@/contexts/LedgerContext";
import { useEffect, useMemo, useState } from "react";
import type { BalanceItem } from "../types/editor_monaco.types";

export function useEditorMonaco() {
  const {
    contentFile,
    idSelected,
    onChangeFile,
    currentFile,
    updateContentFileWithDB,
  } = useFiles();
  const { parser, updateParser, totals } = useLedger();
  const { settings } = useAuth();

  const [search, setSearch] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [currentContent, setCurrentContent] = useState("");

  const isUnbalanced = totals.debit !== totals.credit;

  // 🧠 Balance filtrado con useMemo
  const filteredBalances: BalanceItem[] = useMemo(() => {
    const rawBalances = parser?.balances ?? {};
    const formattedBalances: BalanceItem[] = Object.entries(rawBalances).map(
      ([name, value]) => ({
        name,
        amount: Object.values(value), // e.g., { "$": 1000 } → [1000]
      })
    );

    if (!search.trim()) return formattedBalances;

    return formattedBalances.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [parser, search]);

  // ⚙️ Actualiza parser y contenido del archivo seleccionado
  useEffect(() => {
    if (!idSelected) return;

    (async () => {
      try {
        await updateContentFileWithDB();
        await updateParser(idSelected);
      } catch (err) {
        console.error("Error loading file or parser:", err);
      }
    })();
  }, [idSelected]);

  // 💾 Guardar archivo y actualizar parser
  async function saveFile(value?: string) {
    if (!idSelected || !value) return;

    try {
      await onChangeFile(idSelected, value);
      await updateParser(idSelected);
    } catch (err) {
      console.error("Error saving file:", err);
    }
  }

  return {
    currentFile,
    contentFile,
    parser,
    totals,
    isUnbalanced,
    search,
    filteredBalances,
    isTyping,
    isDirty,
    currentContent,
    saveFile,
    setSearch,
    setIsTyping,
    setIsDirty,
    setCurrentContent,
    settings,
  };
}
