import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

function formatNumber(value: string) {
  // Detectar si es negativo
  const isNegative = value.trim().startsWith("-");

  // Eliminar todo excepto dígitos y punto decimal
  const cleanValue = value.replace(/[^\d.]/g, "");

  // Separar parte entera y decimal
  const [integerPart, decimalPart] = cleanValue.split(".");

  // Formatear parte entera con comas
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Reconstruir con decimal si existe y con signo si es negativo
  return (
    (isNegative ? "-" : "") +
    (decimalPart !== undefined
      ? `${formattedInteger}.${decimalPart}`
      : formattedInteger)
  );
}

function parseNumber(formattedValue: string): number {
  // Eliminar comas y convertir a número
  // El signo negativo se mantiene porque no lo eliminamos
  const cleanValue = formattedValue.replace(/,/g, "");
  const num = Number(cleanValue);
  return isNaN(num) ? 0 : num;
}

interface InputAmountProps {
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export function InputAmount({ defaultValue, onChange }: InputAmountProps) {
  const [value, setValue] = useState(defaultValue?.toString() || "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    // Permitir solo dígitos y un solo punto decimal
    const regex = /^\d{0,}(\.\d{0,2})?$/; // máximo 2 decimales opcional

    // Quitar comas para validar
    const numericValue = input.replace(/,/g, "");

    if (numericValue === "" || regex.test(numericValue)) {
      const formatted = formatNumber(input);
      setValue(formatted);
    }
  };

  useEffect(() => {
    if (onChange && value) {
      const valueString = parseNumber(value).toString();
      onChange(valueString);
    }
  }, [value]);

  return (
    <div className="flex items-center w-full max-w-[150px] gap-2">
      <Input
        className="w-full"
        type="text"
        placeholder="0.00"
        value={formatNumber(value)}
        onChange={handleChange}
        inputMode="decimal" // para que el teclado móvil muestre números y punto
      />
      <span className="text-lg font-normal text-foreground/70 px-1">$</span>
    </div>
  );
}
