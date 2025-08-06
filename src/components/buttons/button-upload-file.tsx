import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";

interface ButtonUploadFileProps {
  onChange?: (value: FileList | null | undefined) => void;
}

export function ButtonUploadFile({onChange}: ButtonUploadFileProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileList>();

  const handleSendFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) setFiles(files);
  };

  useEffect(() => {
    onChange?.(files);
  }, [files]);

  return (
    <div className="flex items-center justify-center">
      <Button onClick={() => inputRef.current?.click()}>Subir archivos</Button>
      <input
        type="file"
        className="hidden"
        ref={inputRef}
        id="file-upload"
        accept=".ledger,.md,.txt"
        multiple
        onChange={handleSendFiles}
      />
    </div>
  );
}
