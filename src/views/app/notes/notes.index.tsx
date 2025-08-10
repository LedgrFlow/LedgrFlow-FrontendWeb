import { useLedger } from "@/contexts/LedgerContext";
import { NotionLikeEditor } from "./notes.editor";
import { useEffect } from "react";
import { useFiles } from "@/contexts/FilesContext";
import ComponentsNotion from "./components/index.notes";

export default function NotesView() {
  const { idSelected, currentFile } = useFiles();
  const { parser, updateParser } = useLedger();

  useEffect(() => {
    if (idSelected) {
      updateParser(idSelected);
    }
  }, [idSelected]);

  return (
    <div className="w-full pb-[300px]">
      <div
        className="w-full min-h-[300px] rounded-xl bg-cover bg-center bg=no-repeat relative"
        style={{
          backgroundImage: `url(https://images.pexels.com/photos/1766604/pexels-photo-1766604.jpeg)`,
        }}
      >
        <div className="absolute -bottom-[18%] left-20">
          <span className="text-[78px]">💰</span>
        </div>
      </div>

      <div className="w-full p-4 pl-20 mt-[50px]">
        <h1
          contentEditable
          suppressContentEditableWarning
          className="text-3xl font-extrabold outline-none"
        >
          {currentFile?.name?.replaceAll(".ledger", "")}
        </h1>
      </div>

      <div className="w-full min-h-screen mt-[70px]">
        <NotionLikeEditor
          blocks={parser?.ledger_document || []}
          renderComponents={ComponentsNotion}
          suggestions={{
            accounts:
              parser?.accounts?.map((acc) => ({
                label: acc,
                value: acc,
                icon: "📦",
              })) || [],
            taxes: Object.entries(parser?.metadata?.taxes || {}).map(
              ([key, value]) => ({
                label: `${key} (${value})`,
                value: key,
                icon: "📦",
              })
            ),
          }}
          defaults={{
            currency: parser?.metadata?.currency || "",
          }}
        />
      </div>
    </div>
  );
}
