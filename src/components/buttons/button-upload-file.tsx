import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import { Upload } from "lucide-react";

interface ButtonUploadFileProps {
  onChange?: (value: FileList | null | undefined) => void;
  useIcon?: boolean;
}

export function ButtonUploadFile({
  onChange,
  useIcon = true,
}: ButtonUploadFileProps) {
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
      <Button className="flex items-center gap-2 justify-center" onClick={() => inputRef.current?.click()}>
        {useIcon ? <Upload className="w-6 h-6" /> : "Subir archivos"}
      </Button>
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
