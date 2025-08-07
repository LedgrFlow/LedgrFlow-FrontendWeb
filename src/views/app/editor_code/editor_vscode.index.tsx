import { EditorView } from "@/components/editor/vscode-editor";
import { formatCurrency } from "@/utils/format";
import clsx from "clsx";
import { ShortcutCtrlS } from "@/components/common/keyword";
import { useEditorMonaco } from "./controllers/editor_monaco.controller";
import { useUI } from "@/contexts/UIContext";

export default function Editor() {
  const {glassMode} = useUI();
  const {
    contentFile,
    currentFile,
    isTyping,
    isDirty,
    currentContent,
    settings,
    setIsTyping,
    setIsDirty,
    setSearch,
    filteredBalances,
    isUnbalanced,
    search,
    totals,
    saveFile,
    setCurrentContent,
  } = useEditorMonaco();

  return (
    <div className="w-full h-full min-h-screen space-y-4 flex justify-between gap-2 overflow-hidden">
      <div
        className="flex-1 h-full bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden"
        id="editor"
      >
        {/* Editor */}
        <div className="w-full">
          <div className={clsx("w-full overflow-hidden mb-3 flex justify-between", glassMode ? "glass-card" : "bg-neutral-900")}>
            <div className="flex items-center">
              <div className="p-2 bg-neutral-200 dark:bg-neutral-800 w-[fit-content] border-b border-neutral-600 flex items-center h-full">
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
                isUnbalanced ? "bg-pink-500" : "bg-neutral-300 dark:bg-neutral-800"
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
            theme={settings?.editor_theme || "vs-dark"}
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
      <div className={clsx("w-full max-w-[400px] max-h-[110vh] min-w-[200px] rounded-xl p-4 overflow-hidden", glassMode ? "glass-card" : "bg-neutral-900")}>
        {/* 🔍 Buscador */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar cuenta..."
            className={clsx("w-full px-3 py-2 rounded-md bg-white dark:bg-neutral-800 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500" )}
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
