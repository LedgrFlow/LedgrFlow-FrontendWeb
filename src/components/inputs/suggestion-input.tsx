import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface SuggestionItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface SuggestionInputProps {
  placeholder?: string;
  suggestions: SuggestionItem[];
  onSelect?: (item: SuggestionItem) => void;
  value?: string;
  label?: string;
}

export function SuggestionInput({
  placeholder = "Search...",
  suggestions,
  onSelect,
  value: controlledValue,
  label,
}: SuggestionInputProps) {
  const [inputValue, setInputValue] = useState(controlledValue ?? "");
  const [open, setOpen] = useState(false);
  const [filtered, setFiltered] = useState<SuggestionItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Soporte controlado/ no controlado
  useEffect(() => {
    if (controlledValue !== undefined) {
      setInputValue(controlledValue);
    }
  }, [controlledValue]);

  // Filtrar sugerencias o mostrar todas si input vacío y menú abierto
  useEffect(() => {
    if (!open) {
      setFiltered([]);
      return;
    }
    if (inputValue.trim() === "") {
      // Mostrar todas las sugerencias si input está vacío y menú abierto
      setFiltered(suggestions);
      return;
    }
    // Filtrar normalmente
    const filteredSuggestions = suggestions.filter((item) =>
      item.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFiltered(filteredSuggestions);
  }, [inputValue, suggestions, open]);

  // Cerrar menú si clic fuera
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleSelect(item: SuggestionItem) {
    setInputValue(item.label);
    setOpen(false);
    onSelect?.(item);
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      <Input
        aria-label={label}
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={() => setOpen(true)}
        autoComplete="off"
      />
      {open && (
        <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <li
                key={item.value}
                className="flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-gray-100 text-[12px]"
                onClick={() => handleSelect(item)}
              >
                {item.icon && (
                  <span className="flex-shrink-0">{item.icon}</span>
                )}
                <span>{item.label}</span>
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-gray-500">No suggestions found</li>
          )}
        </ul>
      )}
    </div>
  );
}
