import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { FileService } from "../services/backend/backFiles";
import type {
  FileItem,
  FileListResponse,
} from "@/types/backend/files-back.types";
import { getToken } from "@/config/axios";
import { BackendActivity } from "@/services/backend/backActivity";

interface FilesContextProps {
  dataFiles: FileItem[];
  idSelected?: string;
  handleSelect: (value: string) => void;
  currentFile?: FileItem;
  formFiles?: FileList;
  handleUploadFiles: (files: FileList) => void;
  contentFile?: string;
  onChangeFile: (
    fileId: string,
    contentFile: string
  ) => Promise<{
    file: FileItem;
    message: string;
  }>;
  updateContentFileWithDB: () => Promise<void>;
}

const FilesContext = createContext<FilesContextProps | undefined>(undefined);

export const useFiles = () => {
  const context = useContext(FilesContext);

  if (context === undefined) {
    throw new Error("useFiles must be used within an FilesProvider");
  }
  return context;
};

interface FilesProviderProps {
  children: ReactNode;
}

export const FilesProvider: React.FC<FilesProviderProps> = ({ children }) => {
  const [dataFiles, setDataFiles] = useState<FileItem[]>([]);
  const [formFiles, setFormFiles] = useState<FileList>();
  const [idSelected, setIdSelected] = useState<string | undefined>();
  const [currentFileData, setCurrentFile] = useState<FileItem | undefined>();
  const [contentFile, setContentFile] = useState<string | undefined>();

  const handleSelect = (value: string) => {
    setIdSelected(value);
  };

  const handleUploadFiles = (files: FileList) => {
    setFormFiles(files);
  };

  const updateContentFileWithDB = async () => {
    if (idSelected) {
      FileService.getFile(idSelected).then((res) => {
        setContentFile(res.file.file_content);
      });
    }
  };

  const onChangeFile = async (fileId: string, contentFile: string) => {
    const res = await FileService.updateFile(fileId, {
      file_content: contentFile,
      name: currentFileData?.name,
    });

    BackendActivity.createActivity({
      event: "file_update",
      file_id: fileId,
    });

    return res;
  };

  const updateListFiles = async () => {
    FileService.getFiles().then((res: FileListResponse) => {
      setDataFiles(res.files);
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const current = getToken();

      if (typeof current === "string" && current.trim() !== "") {
        updateListFiles();
        clearInterval(interval);
      }
    }, 1000); // revisar cada 1s (puedes ajustar)

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (idSelected && dataFiles) {
      const file = dataFiles.find((file) => file.id === idSelected);
      setCurrentFile(file);
    }
  }, [idSelected, dataFiles]);

  useEffect(() => {
    if (idSelected) updateContentFileWithDB();
  }, [idSelected]);

  useEffect(() => {
    if (formFiles && formFiles.length > 0) {
      Array.from(formFiles).forEach((file) => {
        FileService.createFileFromUpload(file).then((res) => {
          if (res.file) {
            setDataFiles((prev) => [...prev, res.file]);
            BackendActivity.createActivity({
              event: "file_upload",
              file_id: res.file.id,
            }).then((res) => {
              console.log(res);
            });
          }
        });
      });
    }
  }, [formFiles]);

  // 📌 Debug
  if (import.meta.env.MODE === "development") {
    useEffect(() => {
      console.groupCollapsed("📦 FilesContext Debug");
      console.log("DATA FILES =>", dataFiles);
      console.log("CURRENT FILE =>", currentFileData);
      console.log("FORM FILES =>", formFiles);
      console.log("CONTENT FILE =>", contentFile);
      console.log("ID SELECTED =>", idSelected);
      console.groupEnd();
    }, [dataFiles, currentFileData, formFiles, contentFile, idSelected]);
  }

  const value: FilesContextProps = {
    dataFiles,
    idSelected,
    handleSelect,
    currentFile: currentFileData,
    formFiles,
    handleUploadFiles,
    contentFile,
    onChangeFile,
    updateContentFileWithDB,
  };

  return (
    <FilesContext.Provider value={value}>{children}</FilesContext.Provider>
  );
};
