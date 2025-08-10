import { LedgerParser } from "@/lib/parser/ledger-parser";
import type { Block } from "@/types/backend/ledger-back.types";
import React, { useState, useRef, useEffect } from "react";
import { LayoutBaseNotes } from "./layout-base.notes";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarSelect } from "@/components/inputs/date";
import {
  SuggestionInput,
  type SuggestionItem,
} from "@/components/inputs/suggestion-input";
import { currencies } from "@/config/global/suggestions";
import { InputAmount } from "@/components/inputs/input-amount";

export interface SuggestionBlock {
  accounts: SuggestionItem[];
  taxes: SuggestionItem[];
}

export interface DefaultsBlock {
  currency: string;
}
interface TransactionProps {
  block: Block;
  index: number;
  indexBlock: number | number[];
  suggestions?: SuggestionBlock;
  defaults?: DefaultsBlock;
  onKeyDown: (
    e: React.KeyboardEvent<HTMLDivElement>,
    block: Block,
    idx: number
  ) => void;
  draggableProvided: any;
  draggableSnapshot: any;
  onUpdateBlock?: (index: number, updatedBlock: Block) => void;
}

export const ComponentTransaction: React.FC<TransactionProps> = (
  props: any
) => {
  const {
    block,
    index,
    indexBlock,
    onKeyDown,
    draggableProvided,
    draggableSnapshot,
    onUpdateBlock,
    defaults,
    suggestions,
  } = props;
  const parsed = LedgerParser.parse(block.lines.join("\n"));
  const detailsTransaction = parsed?.[0];

  const isValidTransaction =
    detailsTransaction &&
    detailsTransaction.date &&
    Array.isArray(detailsTransaction.accounts);

  // Extraemos las cuentas reales del parser
  const parsedAccounts = isValidTransaction ? detailsTransaction.accounts : [];

  // Ajustamos el tamaño de accounts según block.index
  const accountsFromIndex = block.index.slice(1).map((_, idx) => {
    // Si existe una cuenta en esa posición, la usamos
    return (
      parsedAccounts[idx] || {
        account: "",
        subAccounts: [],
        unit: "N/A",
        amount: 0,
        tax: "",
      }
    );
  });

  const [date, setDate] = useState(detailsTransaction?.date || "");
  const [verified, setVerified] = useState(
    detailsTransaction?.verified || false
  );
  const [description, setDescription] = useState(
    detailsTransaction?.description || ""
  );
  const [accounts, setAccounts] = useState(
    isValidTransaction ? accountsFromIndex : []
  );

  const accountRefs = useRef<(HTMLDivElement | null)[]>([]);
  const taxRefs = useRef<(HTMLInputElement | null)[]>([]);
  const focusIndex = useRef<number | null>(null);

  const handleDateChange = (value: string) => {
    setDate(value);
  };

  const handleVerifiedChange = (value: boolean) => {
    setVerified(value);
  };

  const handleDescriptionChange = (e: React.InputEvent<HTMLDivElement>) => {
    const text = e.currentTarget.value || "";
    setDescription(text);
  };

  const handleAccountsChange = (newAccounts: typeof accounts) => {
    setAccounts(newAccounts); // Solo actualiza localmente
  };

  const handleAddAccount = () => {
    const newAccounts = [
      ...accounts,
      { account: "", subAccounts: [], unit: "N/A", amount: 0, tax: "" },
    ];
    setAccounts(newAccounts); // <- Esto hace que se renderice la nueva fila
    focusIndex.current = newAccounts.length - 1; // Enfocar el nuevo
    block.index = Array.isArray(block.index)
      ? [...block.index, block.index[block.index.length - 1] + 1]
      : [1];
  };

  const handleRemoveAccount = (idx: number) => {
    setAccounts((prev) => {
      const newAccounts = prev.filter((_, i) => i !== idx);
      focusIndex.current = Math.max(0, idx - 1); // Guardar el nuevo índice a enfocar
      return newAccounts;
    });
  };

  const handleTaxKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (idx === accounts.length - 1) {
        handleAddAccount();
      }
    }
  };

  const handleAccountKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    idx: number
  ) => {
    if (e.key === "Backspace") {
      const text = accountRefs.current[idx]?.innerText.trim() || "";
      if (text === "") {
        e.preventDefault();
        handleRemoveAccount(idx);
      }
    }
  };

  function transactionToString(obj) {
    // Línea 1: fecha + (si verified true, agregar '*') + descripción
    const firstLine = `${obj.date} ${obj.verified ? "*" : ""} ${
      obj.description
    }`
      .replace(/\s+/g, " ")
      .trim();

    // Las demás líneas, que corresponden a las cuentas, generadas desde obj.accounts
    // Si amount es 0 o null, solo el account sin monto, si no, mostrar monto.
    const accountLines = obj.accounts.map((acc) => {
      // Si el monto es 0 o no definido, solo la cuenta sin monto
      if (acc.amount === 0 || acc.amount == null) {
        return `    ${acc.account}`;
      } else {
        return `    ${acc.account}  ${acc.amount}`;
      }
    });

    // Finalmente juntamos todo en un string con saltos de línea
    return [firstLine, ...accountLines].join("\n");
  }

  useEffect(() => {
    if (focusIndex.current !== null) {
      const idx = focusIndex.current;
      if (accounts[idx]) {
        // Intentamos enfocar tax si es nuevo, sino account
        taxRefs.current[idx]?.focus() || accountRefs.current[idx]?.focus();
      }
      focusIndex.current = null;
    }
  }, [accounts]);

  function deepEqual(obj1, obj2) {
    if (obj1 === obj2) return true;

    if (
      typeof obj1 !== "object" ||
      obj1 === null ||
      typeof obj2 !== "object" ||
      obj2 === null
    ) {
      return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
      if (!keys2.includes(key)) return false;

      if (!deepEqual(obj1[key], obj2[key])) return false;
    }

    return true;
  }

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!onUpdateBlock) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      const updateTransaction = {
        ...block,
        date,
        verified,
        description,
        accounts,
      };
      const stringTransaction = transactionToString(updateTransaction);
      const updatedBlock = {
        ...block,
        lines: stringTransaction.split("\n"),
      };

      if (!deepEqual(block, updatedBlock)) {
        onUpdateBlock(index, updatedBlock);
      }
    }, 200); // espera 200ms tras la última tecla
  }, [date, verified, description, accounts]);

  return (
    <LayoutBaseNotes {...props}>
      {isValidTransaction ? (
        <>
          <div className="flex w-full items-center gap-2 work-sans-400 mb-3">
            {/* Fecha */}
            <CalendarSelect
              defaultValue={detailsTransaction.date}
              onChange={handleDateChange}
            />
            <Checkbox
              checked={detailsTransaction.verified}
              onCheckedChange={handleVerifiedChange}
            />
            {/* <input
              type="date"
              defaultValue={detailsTransaction.date}
              onChange={handleDateChange}
              style={{ marginBottom: 4 }}
            /> */}

            {/* Checkbox verified */}
            {/* <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
             
              <input
                type="checkbox"
                defaultChecked={detailsTransaction.verified}
                checked={verified}
                onChange={handleVerifiedChange}
              />
              Verificada
            </label> */}

            {/* Descripción */}
            <input
              type="text"
              defaultValue={detailsTransaction.description}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full outline-none"
            />
          </div>

          {/* Lista de cuentas */}
          {accounts.map((acc, i) => (
            <div
              key={i}
              style={{
                // display: "grid",
                // gridTemplateColumns: "2fr 1fr 1fr 1fr",
                // gap: 4,
                // alignItems: "center",
                marginBottom: 4,
              }}
              className="w-full flex justify-between items-center gap-2 mb-2"
            >
              {/* Cuenta ahora con input */}
              <SuggestionInput
                suggestions={suggestions?.accounts || []}
                onSelect={(item) => {
                  const value = item.value;
                  const newAccounts = [...accounts];
                  newAccounts[i] = {
                    ...newAccounts[i],
                    account: value,
                  };
                  handleAccountsChange(newAccounts);
                }}
                value={acc.account}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && e.currentTarget.value === "") {
                    e.preventDefault();
                    handleRemoveAccount(i);
                  }
                }}
                ref={(el) => (accountRefs.current[i] = el)}
              />
              {/* <input
                type="text"
                defaultValue={acc.account}
                // value={accounts[i].account}
                onChange={(e) => {
                  const newAccounts = [...accounts];
                  newAccounts[i] = {
                    ...newAccounts[i],
                    account: e.target.value,
                  };
                  handleAccountsChange(newAccounts);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && e.currentTarget.value === "") {
                    e.preventDefault();
                    handleRemoveAccount(i);
                  }
                }}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 4,
                  padding: 4,
                  minHeight: "28px",
                  width: "100%",
                }}
                ref={(el) => (accountRefs.current[i] = el)}
              /> */}

              {/* <input
                type="number"
                value={acc.amount}
                onChange={(e) => {
                  const value = e.target.value;
                  const newAccounts = [...accounts];
                  newAccounts[i] = {
                    ...newAccounts[i],
                    amount: value === "" ? 0 : Number(value),
                  };
                  handleAccountsChange(newAccounts);
                }}
                style={{ width: "100%" }}
              /> */}

              {/* Unidad */}
              {/* <input
                type="text"
                value={acc.unit}
                placeholder="Unidad"
                onChange={(e) => {
                  const value = e.target.value;
                  const newAccounts = [...accounts];
                  newAccounts[i] = {
                    ...newAccounts[i],
                    unit: value,
                  };
                  handleAccountsChange(newAccounts);
                }}
              /> */}

              <div className="w-[50%] flex items-center gap-2">
                {/* Monto */}
                <InputAmount
                  defaultValue={acc?.amount}
                  onChange={(value) => {
                    const newAccounts = [...accounts];
                    newAccounts[i] = {
                      ...newAccounts[i],
                      amount: value,
                    };
                    handleAccountsChange(newAccounts);
                  }}
                />
                <SuggestionInput
                  placeholder="Choose a currency..."
                  value={defaults?.currency ?? ""}
                  suggestions={currencies}
                  onSelect={(item) => {
                    const value = item.value;
                    const newAccounts = [...accounts];
                    newAccounts[i] = {
                      ...newAccounts[i],
                      unit: value,
                    };
                    handleAccountsChange(newAccounts);
                  }}
                />
                <SuggestionInput
                  suggestions={suggestions?.taxes || []}
                  placeholder="Choose a tax..."
                  value={acc?.tax || ""}
                  onSelect={(item) => {
                    const value = item.value;
                    const newAccounts = [...accounts];
                    newAccounts[i] = {
                      ...newAccounts[i],
                      tax: value,
                    };
                    handleAccountsChange(newAccounts);
                  }}
                  onKeyDown={(e) => {
                    handleTaxKeyDown(e, i);
                  }}
                />
              </div>

              {/* Impuesto */}
              {/* <input
                type="text"
                value={acc.tax || ""}
                placeholder="Impuesto"
                ref={(el) => (taxRefs.current[i] = el)}
                onChange={(e) => {
                  const value = e.target.value;
                  const newAccounts = [...accounts];
                  newAccounts[i] = {
                    ...newAccounts[i],
                    tax: value,
                  };
                  handleAccountsChange(newAccounts);
                }}
                onKeyDown={(e) => handleTaxKeyDown(e, i)}
              /> */}
            </div>
          ))}
        </>
      ) : (
        // Fallback (podrías hacer lo mismo aquí: reemplazar div contentEditable por textarea o input multilineal)
        <textarea
          style={{ flex: 1, cursor: "text", width: "100%" }}
          onKeyDown={(e) => onKeyDown(e, block, index)}
          defaultValue={block.lines.join("\n")}
        />
      )}
    </LayoutBaseNotes>
  );
};
