import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency } from "@/utils/format";
import clsx from "clsx";

type DetailEntry = Record<
  string,
  {
    amount: number;
    currency: string;
  }
>;

type Props = {
  income_details: DetailEntry[];
  expenses_details: DetailEntry[];
  utility_by_currency: Record<string, number>;
  currency?: string;
};

const stylesBadges = {
  income:
    "w-fit border border-green-300/70 px-3 py-1 rounded-xl text-xs dark:text-green-200 bg-green-400/10 text-green-600",
  expense:
    "w-fit border border-pink-300/70 px-3 py-1 rounded-xl text-xs dark:text-pink-200 bg-pink-400/10 text-pink-600",
  result:
    "w-fit border border-yellow-300/70 px-3 py-1 rounded-xl text-xs dark:text-yellow-200 bg-yellow-400/10 text-yellow-600",
};

export function IncomeStatement({
  income_details,
  expenses_details,
  utility_by_currency,
  currency = "USD",
}: Props) {
  let index = 0;

  const renderSection = (
    data: DetailEntry[],
    type: "income" | "expense",
    currencyExternal: string | undefined = "USD"
  ) => {
    let sum = 0;

    const rows = data.map((entry, i) => {
      const [key, value] = Object.entries(entry)[0];
      const amount = value.amount;
      const newCurrency =
        !value.currency || ["$", "N/A"].includes(value.currency)
          ? currencyExternal
          : value.currency;

      console.log(newCurrency);
      sum += amount;

      index++;

      return (
        <TableRow
          key={`${type}-${i}`}
          className="bg-blue-200/30 dark:bg-blue-950/20 border-none hover:bg-blue-500/15 dark:hover:bg-muted"
        >
          <TableCell className="w-[fit-content] text-center">{index}</TableCell>
          <TableCell>
            <span className={clsx(stylesBadges[type])}>
              {key.replaceAll(":", " > ")}
            </span>
          </TableCell>
          <TableCell className="text-right">
            {formatCurrency(amount, newCurrency)}
          </TableCell>
          <TableCell className="text-right">
            {formatCurrency(sum, newCurrency)}
          </TableCell>
        </TableRow>
      );
    });

    return (
      <>
        <TableRow className="font-semibold bg-background hover:bg-blue-500/15 dark:hover:bg-muted">
          <TableCell></TableCell>
          <TableCell colSpan={3}>
            {type === "income" ? "Ingresos" : "Egresos"}
          </TableCell>
        </TableRow>
        {rows}
        <TableRow className="bg-background hover:bg-blue-500/15 dark:hover:bg-muted">
          <TableCell></TableCell>
          <TableCell className="font-semibold">Total</TableCell>
          <TableCell className="text-right font-bold" colSpan={2}>
            {formatCurrency(sum)}
          </TableCell>
        </TableRow>
      </>
    );
  };

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
            {/* Ingresos */}
            {renderSection(income_details, "income", currency)}

            {/* Egresos */}
            {renderSection(expenses_details, "expense", currency)}

            {/* Resultado */}
            <TableRow className="bg-background font-bold hover:bg-blue-500/15 dark:hover:bg-muted">
              <TableCell></TableCell>
              <TableCell>
                <span className={clsx(stylesBadges.result)}>
                  Resultado del ejercicio
                </span>
              </TableCell>
              <TableCell className="text-right" colSpan={2}>
                {Object.entries(utility_by_currency).map(
                  ([currency, amount]) => (
                    <div key={currency}>{formatCurrency(amount, currency)}</div>
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
