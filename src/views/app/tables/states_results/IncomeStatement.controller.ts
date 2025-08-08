import { useLedger } from "@/contexts/LedgerContext";
import { formatCurrency } from "@/utils/format";

type RowData = {
  index: number;
  concept: string;
  amount: string;
  accumulated: string;
  rawAmount: number;
  currency: string;
};

type SectionResult = {
  rows: RowData[];
  total: number;
};

export function useIncomeStatement() {
  const { parser, currency: defaultCurrency } = useLedger();

  const resolveCurrency = (entryCurrency: string | undefined): string => {
    if (!entryCurrency || entryCurrency === "$" || entryCurrency === "N/A") {
      return defaultCurrency;
    }
    return entryCurrency;
  };

  const buildSection = (
    data: Record<string, { amount: number; currency: string }>[],
    type: "income" | "expense"
  ): SectionResult => {
    let sum = 0;
    let index = 0;

    const rows: RowData[] = data.map((entry) => {
      const [key, value] = Object.entries(entry)[0];
      const resolvedCurrency = resolveCurrency(value.currency);
      index++;
      sum += value.amount;

      return {
        index,
        concept: key.replaceAll(":", " > "),
        amount: formatCurrency(value.amount, resolvedCurrency),
        accumulated: formatCurrency(sum, resolvedCurrency),
        rawAmount: value.amount,
        currency: resolvedCurrency,
      };
    });

    return { rows, total: sum };
  };

  const incomeSection = buildSection(
    parser?.state_results?.income_details ?? [],
    "income"
  );

  const expenseSection = buildSection(
    parser?.state_results?.expenses_details ?? [],
    "expense"
  );

  const utilityByCurrency = parser?.state_results?.utility_by_currency
    ? Object.entries(parser?.state_results?.utility_by_currency).reduce(
        (acc: Record<string, number>, [key, value]) => {
          const resolvedCurrency = resolveCurrency(key);
          acc[resolvedCurrency] = value;
          return acc;
        },
        {} as Record<string, number> // ← también aquí por inferencia correcta
      )
    : {};

  return {
    incomeSection,
    expenseSection,
    utilityByCurrency,
  };
}
