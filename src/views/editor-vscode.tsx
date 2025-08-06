import { EditorView } from "@/components/editor/vscode-editor";
import { formatCurrency } from "@/utils/format";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { useLedger } from "@/contexts/LedgerContext";
import { useFiles } from "@/contexts/FilesContext";
import { useAuth } from "@/contexts/AuthContext";
import { Command, Option } from "lucide-react";
import { ShortcutCtrlS } from "@/components/common/keyword";

type BalanceItem = {
  name: string;
  amount: number[];
};

export default function Editor() {
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
  const [filteredBalances, setFilteredBalances] = useState<BalanceItem[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [currentContent, setCurrentContent] = useState("");

  const isUnbalanced = totals.debit !== totals.credit;

  useEffect(() => {
    if (idSelected) {
      updateContentFileWithDB().then(() => {
        updateParser(idSelected);
      });
    }
  }, []);

  // 🧠 Transforma y filtra balances
  function getFilteredBalances() {
    const rawBalances = parser?.balances ?? {};
    const formattedBalances = Object.entries(rawBalances).map(
      ([name, value]) => ({
        name,
        amount: Object.values(value), // convierte { "$": 1000 } en [1000]
      })
    );

    if (!search.trim()) return formattedBalances;

    return formattedBalances.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  function saveFile(value: string | undefined) {
    if (idSelected && value) {
      onChangeFile(idSelected, value)
        .then(() => {
          updateParser(idSelected);
        })
        .catch((err) => console.error(err));
    }
  }

  // 🪝 Recalcular balances cuando cambia el parser o la búsqueda
  useEffect(() => {
    setFilteredBalances(getFilteredBalances());
  }, [parser, search]);

  // ⚙️ Cargar el parser cuando cambia el archivo seleccionado
  useEffect(() => {
    if (idSelected) updateParser(idSelected);
  }, [idSelected]);

  return (
    <div className="w-full h-full min-h-screen space-y-4 bg-black flex justify-between gap-2 overflow-hidden">
      <div
        className="flex-1 h-full bg-neutral-900 rounded-2xl overflow-hidden"
        id="editor"
      >
        {/* Editor */}
        <div className="w-full">
          <div className="w-full bg-neutral-900 overflow-hidden mb-3 flex justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-neutral-800 w-[fit-content] border-b border-neutral-600 flex items-center h-full">
                <span className="text-sm pl-2">
                  {currentFile?.name ?? "Ningun archivo"}
                </span>
                <span
                  className={clsx(
                    "w-1 h-1 rounded-full inline-block ml-2 transition-all duration-200 ease-in-out",
                    isTyping && isDirty
                      ? "bg-blue-500 opacity-100"
                      : "bg-transparent opacity-0"
                  )}
                ></span>
              </div>

              {settings?.auto_save_file ? (
                <></>
              ) : (
                <div
                  onClick={() => {
                    saveFile(currentContent);
                  }}
                  className="w-[fit-content] cursor-pointer px-3 h-full bg-green-500/30 border-b border-green-500 hover:bg-green-500/70 transition duration-150 flex gap-2 items-center justify-between"
                >
                  <span>Guardar</span>
                  <ShortcutCtrlS />
                </div>
              )}
            </div>

            <div
              className={clsx(
                "h-full flex items-center min-h-full w-[fit-content] p-2 px-4 transition duration-300 ease-in-out",
                isUnbalanced ? "bg-pink-500" : "bg-neutral-800"
              )}
            >
              <div className="flex items-center justify-between h-full gap-4">
                <div className="flex items-center gap-2 h-full">
                  <span className="text-sm font-normal">
                    {formatCurrency(totals.debit || 0) || "0.00"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-normal">
                    {formatCurrency(totals.credit || 0) || "0.00"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <EditorView
            theme={settings?.editor_theme}
            defaultValue={contentFile}
            language="ledger"
            onChange={(value) => {
              //  Guardado del archivo
              setCurrentContent(value);
              if (settings?.auto_save_file) {
                saveFile(value);
              }
            }}
            onDirtyChange={(dirty) => {
              console.log("Dirty: ", dirty);
              setIsDirty(dirty);
            }}
            onTypingChange={(typing) => {
              console.log("Typing: ", typing);
              setIsTyping(typing);
            }}
          />
        </div>
      </div>

      {/* Sidebar derecho con cuentas */}
      <div className="w-full max-w-[400px] max-h-[110vh] min-w-[200px] bg-neutral-900 rounded-xl p-4 overflow-hidden">
        {/* 🔍 Buscador */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar cuenta..."
            className="w-full px-3 py-2 rounded-md bg-neutral-800 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* 📃 Lista filtrada */}
        <ul
          className={clsx(
            "h-full w-full overflow-y-auto divide-y divide-muted-foreground/20 px-2 py-2 space-y-1 pb-10",
            "scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-thumb-rounded"
          )}
        >
          {filteredBalances.map((item, idx) => (
            <li key={idx} className="py-2">
              <div className="flex flex-col gap-0.5">
                <p className="font-medium text-foreground transition-colors">
                  {item.name}
                </p>
                <p className="text-sm text-muted-foreground transition-colors">
                  {item.amount.map((a) => formatCurrency(a)).join(" | ")}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
