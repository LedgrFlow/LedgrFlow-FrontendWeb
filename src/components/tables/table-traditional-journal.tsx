import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DateFormatter } from "@/utils/date";
import { formatCurrency } from "@/utils/format";
import clsx from "clsx";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { returnBadgeColorByParent, type Parents } from "./styles-dinamics";

type AccountEntry = {
  account: string;
  amount: number;
  subAccounts: string[];
  unit: string;
};

type JournalEntry = {
  date: string;
  accounts: AccountEntry[];
  description: string;
};

type Props = {
  data: JournalEntry[];
  parentsAccounts?: Parents;
};

const formDate = new DateFormatter();

export function TradicionalJournal({
  data,
  parentsAccounts = {
    Assets: "Assets",
    Liabilities: "Liabilities",
    Equity: "Equity",
    Income: "Income",
    Expenses: "Expenses",
  },
}: Props) {
  const [search, setSearch] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  let indexCounter = 0;

  const filteredData = useMemo(() => {
    return data.filter((entry) => {
      const entryDate = new Date(entry.date);
      const entryMatchesText =
        entry.description.toLowerCase().includes(search.toLowerCase()) ||
        entry.accounts.some((a) =>
          a.account.toLowerCase().includes(search.toLowerCase())
        );

      const entryMatchesDate =
        (!startDate || entryDate >= new Date(startDate)) &&
        (!endDate || entryDate <= new Date(endDate));

      const entryMatchesAmount = entry.accounts.some((a) => {
        const amount = Math.abs(a.amount);
        const minOk = !minAmount || amount >= parseFloat(minAmount);
        const maxOk = !maxAmount || amount <= parseFloat(maxAmount);
        return minOk && maxOk;
      });

      return entryMatchesText && entryMatchesDate && entryMatchesAmount;
    });
  }, [data, search, minAmount, maxAmount, startDate, endDate]);

  let totalDebe = 0;
  let totalHaber = 0;

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-wrap gap-4 items-end w-full">
        <div className="bg-neutral-900 w-full rounded-md flex items-center justify-between max-w-[400px] ">
          <Search className="w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Busca transaccion"
            className="input input-sm px-3 py-1 border rounded-md text-sm w-full"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla */}
      <ScrollArea className="rounded-md border w-full">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead className="px-3">Nº</TableHead>
              <TableHead className="w-[100px] px-7">Fecha</TableHead>
              <TableHead className="w-full">Cuenta</TableHead>
              <TableHead className="text-center">Debe</TableHead>
              <TableHead className="text-center">Haber</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((entry, i) => {
              const positive = entry.accounts.filter((a) => a.amount > 0);
              const negative = entry.accounts.filter((a) => a.amount < 0);
              const allAccounts = [...positive, ...negative];

              return (
                <>
                  {allAccounts.map((acc, j) => {
                    const isDebe = acc.amount > 0;
                    const debe = isDebe ? acc.amount : "";
                    const haber = !isDebe ? Math.abs(acc.amount) : "";

                    if (isDebe) totalDebe += acc.amount;
                    else totalHaber += Math.abs(acc.amount);
                    indexCounter = j === 0 ? indexCounter + 1 : indexCounter;

                    return (
                      <TableRow key={`${i}-${j}`}>
                        <TableCell className="text-center">
                          {j === 0 ? indexCounter : ""}
                        </TableCell>
                        <TableCell className="font-mono">
                          {j === 0
                            ? formDate.formatDayMonthShortYearShort(entry.date)
                            : ""}
                        </TableCell>
                        <TableCell
                          className={clsx(
                            "font-medium",
                            acc.amount < 0 && "pl-8"
                          )}
                        >
                          <div
                            className={clsx(
                              returnBadgeColorByParent(
                                acc.subAccounts[0],
                                parentsAccounts
                              )
                            )}
                          >
                            {acc.account.replaceAll(":", " > ")}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {debe && formatCurrency(debe)}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {haber && formatCurrency(haber)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow>
                    <TableCell colSpan={4}>
                      <p className="italic text-muted-foreground text-sm mt-[-4px]">
                        {entry.description}
                      </p>
                    </TableCell>
                  </TableRow>
                </>
              );
            })}

            <TableRow className="bg-muted font-bold">
              <TableCell colSpan={2}>Totales</TableCell>
              <TableCell className="text-right"></TableCell>
              <TableCell className="text-right">
                {formatCurrency(totalDebe)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(totalHaber)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
