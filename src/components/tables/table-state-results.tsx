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
};

const stylesBadges = {
  income:
    "w-fit border border-green-300/70 px-3 py-1 rounded-xl text-xs text-green-200 bg-green-400/10",
  expense:
    "w-fit border border-pink-300/70 px-3 py-1 rounded-xl text-xs text-pink-200 bg-pink-400/10",
  result:
    "w-fit border border-yellow-300/70 px-3 py-1 rounded-xl text-xs text-yellow-200 bg-yellow-400/10",
};

export function IncomeStatement({
  income_details,
  expenses_details,
  utility_by_currency,
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
      const currency = value.currency;
      sum += amount;

      index++;

      return (
        <TableRow key={`${type}-${i}`}>
          <TableCell className="w-[fit-content] text-center">{index}</TableCell>
          <TableCell>
            <span className={clsx(stylesBadges[type])}>
              {key.replaceAll(":", " > ")}
            </span>
          </TableCell>
          <TableCell className="text-right">{formatCurrency(amount)}</TableCell>
          <TableCell className="text-right">
            {formatCurrency(sum, currency)}
          </TableCell>
        </TableRow>
      );
    });

    return (
      <>
        <TableRow className="font-semibold">
          <TableCell></TableCell>
          <TableCell colSpan={3}>
            {type === "income" ? "Ingresos" : "Egresos"}
          </TableCell>
        </TableRow>
        {rows}
        <TableRow className="">
          <TableCell></TableCell>
          <TableCell className="font-semibold">Total</TableCell>
          <TableCell className="text-right font-bold" colSpan={2}>
            {formatCurrency(sum, currencyExternal)}
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
            <TableRow className="bg-muted">
              <TableHead className="text-center">Nº</TableHead>
              <TableHead className="w-full">Concepto</TableHead>
              <TableHead className="text-right">Saldo</TableHead>
              <TableHead className="text-right">Suma acumulada</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Ingresos */}
            {renderSection(income_details, "income")}

            {/* Egresos */}
            {renderSection(expenses_details, "expense")}

            {/* Resultado */}
            <TableRow className="bg-muted font-bold">
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
