import React, { useState, useRef, useEffect, type RefObject } from "react";
import { Input } from "@/components/ui/input";

export interface SuggestionItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface SuggestionInputProps {
  placeholder?: string;
  suggestions: SuggestionItem[];
  // ahora puede recibir null cuando no hay selección asociada
  onSelect?: (item: SuggestionItem | null) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  ref?: RefObject<HTMLInputElement>;
  /** Este `value` representa el `value` de la suggestion (no el label visible) */
  value?: string;
  label?: string;
}

export function SuggestionInput({
  placeholder = "Search...",
  suggestions,
  onSelect,
  onKeyDown,
  ref,
  value: controlledValue,
  label,
}: SuggestionInputProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Si el parent pasa `value` (que es un suggestion.value), buscamos la suggestion asociada:
  const findByValue = (v?: string) =>
    v ? suggestions.find((s) => s.value === v) ?? null : null;

  const initialSelected = findByValue(controlledValue);
  const [selected, setSelected] = useState<SuggestionItem | null>(
    initialSelected
  );
  const [inputValue, setInputValue] = useState<string>(
    initialSelected ? initialSelected.label : ""
  );

  const [open, setOpen] = useState(false);
  const [filtered, setFiltered] = useState<SuggestionItem[]>([]);

  // Si el parent cambia el value (suggestion.value), actualizamos selected + label mostrado
  useEffect(() => {
    const found = findByValue(controlledValue);
    setSelected(found);
    setInputValue(found ? found.label : "");
  }, [controlledValue, suggestions]);

  // Filtrar sugerencias o mostrar todas si input vacío y menú abierto
  useEffect(() => {
    if (!open) {
      setFiltered([]);
      return;
    }
    if (inputValue.trim() === "") {
      setFiltered(suggestions);
      return;
    }
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

  // Click en una suggestion
  function handleSelect(item: SuggestionItem) {
    setSelected(item);
    setInputValue(item.label);
    setOpen(false);
    onSelect?.(item);
  }

  // Cambios en el input: si el texto coincide EXACTO con un label -> seleccionada esa suggestion
  // si no, no hay selección (selected = null) y avisamos con null
  function handleChangeInput(value: string) {
    setInputValue(value);
    setOpen(true);

    const matched =
      suggestions.find(
        (s) => s.label.toLowerCase().trim() === value.toLowerCase().trim()
      ) ?? null;

    setSelected(matched);
    onSelect?.(matched);
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      <Input
        aria-label={label}
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => handleChangeInput(e.target.value)}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        autoComplete="off"
        ref={ref}
      />
      {open && (
        <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <li
                key={item.value}
                className={`flex cursor-pointer items-center gap-2 px-3 py-2 text-[12px] hover:bg-gray-100 ${
                  selected?.value === item.value ? "bg-gray-100" : ""
                }`}
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
