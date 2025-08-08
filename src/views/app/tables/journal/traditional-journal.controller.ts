import { useLedger } from "@/contexts/LedgerContext";
import { useMemo, useState } from "react";

export type AccountEntry = {
  account: string;
  amount: number;
  subAccounts: string[];
  unit: string;
};

export type JournalEntry = {
  date: string;
  accounts: AccountEntry[];
  description: string;
};

export type Parents = {
  Assets: string;
  Liabilities: string;
  Equity: string;
  Income: string;
  Expenses: string;
};

export function useTraditionalJournal(
  dataOverride?: JournalEntry[],
  currencyOverride?: string,
  parentsOverride?: Parents
) {
  const { parser, currency: contextCurrency } = useLedger();

  const data =
    dataOverride ?? parser?.transactions_resolved ?? parser?.transactions ?? [];

  const currency = currencyOverride ?? contextCurrency ?? "USD";

  const parentsAccounts: Parents = parentsOverride ??
    parser?.parents ?? {
      Assets: "Assets",
      Liabilities: "Liabilities",
      Equity: "Equity",
      Income: "Income",
      Expenses: "Expenses",
    };

  const [search, setSearch] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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

  return {
    filteredData,
    currency,
    parentsAccounts,
    search,
    setSearch,
    minAmount,
    setMinAmount,
    maxAmount,
    setMaxAmount,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  };
}
