import { RegistersNotFileView } from "./registers-not-file.view";
import { useLedger } from "@/contexts/LedgerContext";
import { useFiles } from "@/contexts/FilesContext";
import { useEffect } from "react";
import { LoadingCircle } from "@/components/skeletons/loading-circle";

export function RegisterViewBase({ children }: { children: React.ReactNode }) {
  const { idSelected } = useFiles();
  const { updateParser, isLoadingParser } = useLedger();

  useEffect(() => {
    if (idSelected) {
      updateParser(idSelected);
    }
  }, [idSelected]);

  if (isLoadingParser)
    return (
      <RegistersNotFileView>
        <LoadingCircle label="Cargando registros..." />
      </RegistersNotFileView>
    );

  if (!idSelected) return <RegistersNotFileView />;

  return <>{children}</>;
}
