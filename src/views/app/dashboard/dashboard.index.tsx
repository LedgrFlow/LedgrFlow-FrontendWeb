import { useFiles } from "@/contexts/FilesContext";
import { useLedger } from "@/contexts/LedgerContext";
import { DashboardNotFile } from "./dashboard.not_file";
import { Dashboard } from "./dashboard.graphics";
import { useEffect } from "react";
import { LoadingCircle } from "@/components/skeletons/loading-circle";
import { useTranslation } from "react-i18next";

function ViewDashboard() {
  const { t } = useTranslation("dashboard");
  const { analysis, isErrorAnalysis, updateAll, isLoadingAnalysis } =
    useLedger();
  const { idSelected, currentFile } = useFiles();

  useEffect(() => {
    if (idSelected) updateAll(idSelected);
  }, [idSelected]);

  if (isLoadingAnalysis)
    return (
      <DashboardNotFile title="" message="">
        <LoadingCircle label={t("load.title")} />
      </DashboardNotFile>
    );

  if (!idSelected)
    return (
      <DashboardNotFile
        title={t("emptyState.noFile.title")}
        message={t("emptyState.noFile.sub")}
      />
    );

  if (isErrorAnalysis && !analysis) {
    return (
      <DashboardNotFile
        title={t("emptyState.errorFile.title")}
        message={t("emptyState.errorFile.sub")}
      ></DashboardNotFile>
    );
  }

  return <Dashboard />;
}

export default ViewDashboard;
