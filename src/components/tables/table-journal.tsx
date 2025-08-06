import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/format";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Input } from "@/components/ui/input";

import clsx from "clsx";
import { Badge } from "../ui/badge";
import { BadgeStyles } from "../ui/badge-styles";

dayjs.locale("es");

type Account = {
  account: string;
  subAccounts: string[];
  unit: string;
  amount: number;
};

type Transaction = {
  date: string;
  time: string | null;
  verified: boolean;
  description: string;
  accounts: Account[];
};

type Props = {
  transactions: Transaction[];
};

function EditableCell({
  value,
  onChange,
}: {
  value: string | number;
  onChange: (val: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value.toString());

  return editing ? (
    <textarea
      className="w-full h-full resize-none bg-white rounded-lg p-4"
      value={localValue}
      autoFocus
      onBlur={() => {
        setEditing(false);
        onChange(localValue);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          setEditing(false);
          onChange(localValue);
        }
      }}
      onChange={(e) => setLocalValue(e.target.value)}
    />
  ) : (
    <div onDoubleClick={() => setEditing(true)}>{value}</div>
  );
}

function SortableRow({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tbody ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </tbody>
  );
}

const Identifys = {
  Assets: ["Assets", "Activos", "Activo"],
  Liabilities: ["Liabilities", "Pasivos", "Pasivo"],
  Equity: ["Equity", "Capital"],
  Income: ["Income", "Ingresos", "Ingreso"],
  Expenses: ["Expenses", "Egresos", "Egreso"],
};

const colores: Record<keyof typeof Identifys, string> = {
  Assets: "orange",
  Liabilities: "blue",
  Equity: "purple",
  Income: "green",
  Expenses: "red",
};

function obtenerColorPorTexto(texto: string): string | undefined {
  const lowerTexto = texto.toLowerCase();

  for (const [clave, palabras] of Object.entries(Identifys)) {
    if (
      palabras.some((palabra) => lowerTexto.includes(palabra.toLowerCase()))
    ) {
      return colores[clave as keyof typeof colores];
    }
  }

  return undefined; // No se encontró ninguna palabra
}

export function LedgerTable({ transactions }: Props) {

  const [ordered, setOrdered] = useState(
    transactions.map((_, i) => i.toString())
  );
  const [data, setData] = useState(transactions);

  const totals = useMemo(() => {
    return data.reduce(
      (acc, tx) => {
        tx.accounts.forEach((accnt) => {
          if (accnt.amount > 0) acc.debit += accnt.amount;
          else acc.credit += Math.abs(accnt.amount);
        });
        return acc;
      },
      { debit: 0, credit: 0 }
    );
  }, [data]);

  useEffect(() => {
    console.log("Transactions ordered:", ordered);
    console.log("Data:", data);
  }, [ordered, data]);

  useEffect(() => {
    if (transactions) {
      setData(transactions);
      setOrdered(transactions.map((_, i) => i.toString()));
    }
  }, [transactions]);

  return (
    <div className="w-full overflow-auto text-black dark:bg-neutral-800 border-none">
      <Table>
        <TableCaption>Transacciones del archivo</TableCaption>
        <TableHeader className="bg-white dark:bg-neutral-900">
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Cuenta</TableHead>
            <TableHead className="text-center">Debe</TableHead>
            <TableHead className="text-center">Haber</TableHead>
          </TableRow>
        </TableHeader>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={(event) => {
            const { active, over } = event;
            if (active.id !== over?.id) {
              const oldIndex = ordered.indexOf(active.id.toString());
              const newIndex = ordered.indexOf(over?.id.toString() || "0");
              const newOrdered = arrayMove(ordered, oldIndex, newIndex);
              setOrdered(newOrdered);
              setData(newOrdered.map((i) => data[parseInt(i)]));
            }
          }}
        >
          <SortableContext
            items={ordered}
            strategy={verticalListSortingStrategy}
          >
            {ordered.map((idStr, idx) => {
              const tx = data[parseInt(idStr)];
              const groupColor =
                idx % 2 === 0 ? "bg-white dark:bg-black" : "bg-neutral-800/30";

              return (
                <SortableRow key={idStr} id={idStr}>
                  {tx.accounts.map((acc, i) => (
                    <TableRow
                      key={i}
                      className={clsx(groupColor, "border-none")}
                    >
                      {i === 0 ? (
                        <>
                          <TableCell
                            rowSpan={tx.accounts.length}
                            className="text-justify text-gray-500 dark:text-gray-300 px-5"
                          >
                            {idx + 1}
                          </TableCell>
                          <TableCell rowSpan={tx.accounts.length}>
                            <span className="text-justify text-gray-500 dark:text-gray-300">
                              {dayjs(tx.date).format("dd, D [de] MMM YYYY")}
                              {/* {tx.time ? ` ${tx.time}` : ""} */}
                            </span>
                          </TableCell>
                          <TableCell
                            className="w-full"
                            rowSpan={tx.accounts.length}
                          >
                            <span className="text-justify text-gray-500 dark:text-gray-300">
                              {tx.description || "Sin descripción"}
                            </span>
                          </TableCell>
                        </>
                      ) : null}
                      <TableCell>
                        <BadgeStyles.NeonBadge
                          className="text-[12px]"
                          color={
                            obtenerColorPorTexto(acc.account.split(":")[0]) as
                              | "orange"
                              | "blue"
                              | "green"
                              | "red"
                              | "purple"
                              | "pink"
                              | undefined
                          }
                        >
                          {acc.account.replaceAll(":", " > ")}
                        </BadgeStyles.NeonBadge>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="ms-3 text-md font-medium text-gray-900 dark:text-white px-5">
                          {formatCurrency(acc.amount > 0 ? acc.amount : "")}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="ms-3 text-md font-medium text-gray-900 dark:text-white px-5">
                          {formatCurrency(
                            acc.amount < 0 ? Math.abs(acc.amount) : ""
                          )}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </SortableRow>
              );
            })}
          </SortableContext>
        </DndContext>
        <TableBody>
          <TableRow className="font-medium border-t border-black dark:text-white">
            <TableCell colSpan={4} className="text-right">
              Total
            </TableCell>
            <TableCell className="text-right">
              {formatCurrency(totals.debit)}
            </TableCell>
            <TableCell className="text-right">
              {formatCurrency(totals.credit)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
