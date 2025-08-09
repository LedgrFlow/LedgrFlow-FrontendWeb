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
    <div className="w-full">
      <div
        className="w-full min-h-[200px] rounded-xl bg-cover bg-center bg=no-repeat relative"
        style={{
          backgroundImage: `url(https://images.pexels.com/photos/236111/pexels-photo-236111.jpeg)`,
        }}
      >
        <div className="absolute -bottom-[27%] left-20">
          <span className="text-[78px]">💰</span>
        </div>
      </div>

      <div className="w-full p-4 pl-20 mt-[50px]">
        <h1 className="text-3xl font-extrabold">
          {currentFile?.name?.replaceAll(".ledger", "")}
        </h1>
      </div>

      <div className="w-full min-h-screen mt-[100px]">
        <NotionLikeEditor
          blocks={parser?.ledger_document || []}
          renderComponents={ComponentsNotion}
        />
      </div>
    </div>
  );
}
