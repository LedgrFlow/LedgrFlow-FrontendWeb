import { useFiles } from "@/contexts/FilesContext";
import { useLedger } from "@/contexts/LedgerContext";
import { DashboardNotFile } from "./dashboard/darhboard-not-file";
import { Dashboard } from "./dashboard/dashboard";
import { useEffect } from "react";
import { LoadingCircle } from "@/components/skeletons/loading-circle";

function ViewDashboard() {
  const { analysis, isErrorAnalysis, updateAll, isLoadingAnalysis } =
    useLedger();
  const { idSelected, currentFile } = useFiles();

  useEffect(() => {
    if (idSelected) updateAll(idSelected);
  }, [idSelected]);

  if (isLoadingAnalysis)
    return (
      <DashboardNotFile title="" message="">
        <LoadingCircle label="Cargando análisis..." />
      </DashboardNotFile>
    );

  if (!idSelected) return <DashboardNotFile />;

  if (isErrorAnalysis && !analysis) {
    return (
      <DashboardNotFile
        title="Upps! Error al procesar el archivo"
        message="Verifica que el archivo no esté corrupto y que tenga un formato soportado."
      >
        <div className="flex flex-col items-center justify-center gap-4 w-full text-center rounded-xl p-3">
          <p className="text-md font-semibold dark:text-white/80">
            El archivo{" "}
            <span className="font-bold text-pink-500">{currentFile?.name}</span>{" "}
            no se puede procesar.
          </p>

          <span className="text-base font-medium dark:text-neutral-300">
            ¿Qué puedo hacer?
          </span>

          <div className="flex flex-col sm:flex-row gap-2 items-center text-sm text-muted-foreground">
            <span>
              Sube otro archivo compatible O selecciona uno de los que ya has
              cargado.
            </span>
          </div>
        </div>
      </DashboardNotFile>
    );
  }

  return <Dashboard />;
}

export default ViewDashboard;
