import React, { useState } from "react";
import { Input } from "@/components/ui/input";

function formatNumber(value: string) {
  // Eliminar todo excepto dígitos y punto decimal
  const cleanValue = value.replace(/[^\d.]/g, "");

  // Separar parte entera y decimal
  const [integerPart, decimalPart] = cleanValue.split(".");

  // Formatear parte entera con comas
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Reconstruir con decimal si existe
  return decimalPart !== undefined
    ? `${formattedInteger}.${decimalPart}`
    : formattedInteger;
}

export function InputAmount() {
  const [value, setValue] = useState("");

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

  return (
    <div className="flex items-center w-full max-w-[150px] gap-2">
      <Input
        className="w-full"
        type="text"
        placeholder="0.00"
        value={value}
        onChange={handleChange}
        inputMode="decimal" // para que el teclado móvil muestre números y punto
      />
      <span className="text-lg font-normal text-foreground/70 px-1">$</span>
    </div>
  );
}
