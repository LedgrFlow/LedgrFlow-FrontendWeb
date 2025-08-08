import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import clsx from "clsx";
import { formatCurrency } from "@/utils/format";
import { useIncomeStatement } from "./IncomeStatement.controller";

const stylesBadges = {
  income:
    "w-fit border border-green-300/70 px-3 py-1 rounded-xl text-xs dark:text-green-200 bg-green-400/10 text-green-600",
  expense:
    "w-fit border border-pink-300/70 px-3 py-1 rounded-xl text-xs dark:text-pink-200 bg-pink-400/10 text-pink-600",
  result:
    "w-fit border border-yellow-300/70 px-3 py-1 rounded-xl text-xs dark:text-yellow-200 bg-yellow-400/10 text-yellow-600",
};

export function IncomeStatementTable() {
  const { incomeSection, expenseSection, utilityByCurrency } =
    useIncomeStatement();

  const renderSection = (
    type: "income" | "expense",
    rows: typeof incomeSection.rows,
    total: number
  ) => (
    <>
      <TableRow className="font-semibold bg-background hover:bg-blue-500/15 dark:hover:bg-muted">
        <TableCell />
        <TableCell colSpan={3}>
          {type === "income" ? "Ingresos" : "Egresos"}
        </TableCell>
      </TableRow>
      {rows.map((row) => (
        <TableRow
          key={`${type}-${row.index}`}
          className="bg-blue-200/30 dark:bg-blue-950/20 border-none hover:bg-blue-500/15 dark:hover:bg-muted"
        >
          <TableCell className="w-[fit-content] text-center">
            {row.index}
          </TableCell>
          <TableCell>
            <span className={clsx(stylesBadges[type])}>{row.concept}</span>
          </TableCell>
          <TableCell className="text-right">{row.amount}</TableCell>
          <TableCell className="text-right">{row.accumulated}</TableCell>
        </TableRow>
      ))}
      <TableRow className="bg-background hover:bg-blue-500/15 dark:hover:bg-muted">
        <TableCell />
        <TableCell className="font-semibold">Total</TableCell>
        <TableCell className="text-right font-bold" colSpan={2}>
          {formatCurrency(total, rows[0]?.currency ?? "USD")}
        </TableCell>
      </TableRow>
    </>
  );

  return (
    <div className="space-y-4">
      <ScrollArea className="rounded-md border w-full">
        <Table>
          <TableHeader>
            <TableRow className="bg-background hover:bg-blue-500/15 dark:hover:bg-muted">
              <TableHead className="text-center">Nº</TableHead>
              <TableHead className="w-full">Concepto</TableHead>
              <TableHead className="text-right">Saldo</TableHead>
              <TableHead className="text-right">Suma acumulada</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {renderSection("income", incomeSection.rows, incomeSection.total)}
            {renderSection(
              "expense",
              expenseSection.rows,
              expenseSection.total
            )}
            <TableRow className="bg-background font-bold hover:bg-blue-500/15 dark:hover:bg-muted">
              <TableCell />
              <TableCell>
                <span className={clsx(stylesBadges.result)}>
                  Resultado del ejercicio
                </span>
              </TableCell>
              <TableCell className="text-right" colSpan={2}>
                {Object.entries(utilityByCurrency).map(
                  ([currencyKey, amount]) => (
                    <div key={currencyKey}>
                      {formatCurrency(amount, currencyKey)}
                    </div>
                  )
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
