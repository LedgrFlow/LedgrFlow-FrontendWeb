import { CreditCard, Settings, Smile, User, File } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { FileItem } from "@/types/backend/files-back.types";
import { RoutesConfig } from "@/config/routes.config";
import { Link } from "react-router-dom";
const { rootPaths } = RoutesConfig;

interface SearchFilesProps {
  onChange?: (value: string) => void;
  files?: FileItem[];
  onSelect?: (value: string) => void;
}

export function SearchFiles({ onChange, files, onSelect }: SearchFilesProps) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selected, setSelected] = useState<string | undefined>();

  const handleSelect = (value: string) => {
    setInputValue(value);
    onChange?.(value);
  };

  const handleSelectItem = (value: string) => {
    setSelected(value);
    onSelect?.(value);
  };

  const showSuggestions = isFocused || inputValue.length > 0;

  return (
    <div className="relative w-full">
      <Command className="rounded-lg border shadow-md w-full">
        <CommandInput
          placeholder="Type a command or search..."
          onValueChange={handleSelect}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            // Pequeño retraso para permitir clics en los items antes de ocultar
            setTimeout(() => setIsFocused(false), 100);
          }}
        />

        <CommandList
          className={cn(
            "absolute z-50 mt-12 w-full rounded-md border bg-neutral-50 dark:bg-neutral-900 shadow-lg transition-all duration-200",
            showSuggestions
              ? "opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-95 pointer-events-none"
          )}
        >
          {!files || files.length === 0 ? (
            <CommandEmpty>No files found.</CommandEmpty>
          ) : (
            <>
              <CommandGroup heading="Suggestions">
                {files.map((file) => (
                  <CommandItem
                    value={file.id}
                    className="cursor-pointer"
                    onSelect={(value) => handleSelectItem(value)}
                    key={file.id}
                  >
                    <File className="mr-2 h-4 w-4" />
                    <span>{file.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Settings">
                <Link to={rootPaths?.index.profile.href}>
                  <CommandItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>{rootPaths?.index.profile.label}</span>
                    <CommandShortcut>⌘P</CommandShortcut>
                  </CommandItem>
                </Link>
                <Link to={rootPaths?.general.Settings.href}>
                  <CommandItem>
                    {rootPaths?.general.Settings.icon}
                    <span>{rootPaths?.general.Settings.label}</span>
                    <CommandShortcut>⌘P</CommandShortcut>
                  </CommandItem>
                </Link>
              </CommandGroup>
            </>
          )}
        </CommandList>
      </Command>
    </div>
  );
}
