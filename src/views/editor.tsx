import { BlockNoteEditorComponent } from "@/components/editor/blocknote-editor";
import { useFiles } from "@/contexts/FilesContext";
import { useLedger } from "@/contexts/LedgerContext";
import { useEffect, useState } from "react";

function Editor() {
  const { parser } = useLedger();
  const { contentFile } = useFiles();
  const [currentMarkdown, setCurrentMarkdown] = useState("");

  useEffect(() => {
    console.log(contentFile);
  }, [contentFile]);

  return (
    <div className="p-4 bg-white dark:bg-black h-full w-full min-h-screen  text-black dark:text-white">
      <h1 className="max-w-lg text-3xl font-semibold leading-loose text-gray-900 dark:text-white">
        Editor
      </h1>
      <p className="text-left rtl:text-right text-gray-500 dark:text-gray-400">
        Este editor te permite escribir en formato enriquecido para acompañar
        tus registros contables con notas detalladas.
      </p>
      <section className="w-full h-full dark:bg-[#1f1f1f] mt-4 py-5 pb-[600px] rounded-2xl">
        <BlockNoteEditorComponent
          cuentasContables={parser?.accounts ?? []}
          initialMarkdown={contentFile}
          onChange={(value) => {
            setCurrentMarkdown(value);
          }}
        />
      </section>
    </div>
  );
}
export default Editor;
