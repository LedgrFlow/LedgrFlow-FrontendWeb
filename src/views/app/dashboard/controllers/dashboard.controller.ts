import { useFiles } from "@/contexts/FilesContext";
import { useLedger } from "@/contexts/LedgerContext";
import { useEffect, useMemo, useState } from "react";
import type { Cashflow } from "../types/darhboard.types";
import { DateFormatter } from "@/utils/date";

const formatter = new DateFormatter();

export function useDashboard() {
  const { currentFile } = useFiles();
  const { listMonths, analysis, parser } = useLedger();

  const [currentMonth, setCurrentMonth] = useState<string>("");
  const [cashflows, setCashflows] = useState<Cashflow | null>(null);

  const isAllMonths = !currentMonth || currentMonth === "all";

  const buildMonths = (labelAll: string = "Último") => [
    { value: "all", label: labelAll },
    ...listMonths.map((month) => ({
      value: month,
      label: capitalize(formatter.getMonthName(month)),
    })),
  ];

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const getLatest = <T>(arr?: T[]): T | undefined => arr?.[arr.length - 1];

  const getByMonth = <T extends { month: string }>(data?: T[]): T | undefined =>
    isAllMonths
      ? getLatest(data)
      : data?.find((item) => item.month === currentMonth);

  const filterByDateMonth = <T extends { date: string }>(data?: T[]) =>
    isAllMonths
      ? data ?? []
      : (data ?? []).filter((item) =>
          formatter.isInMonth(item.date, currentMonth)
        );

  const filterCashflowsByMonth = () => getByMonth(analysis?.cashflow_by_month);

  const filterGrowthRateByMonth = () =>
    getByMonth(analysis?.monthly_growth_rates);

  const filterExpenseRatioByMonth = () =>
    getByMonth(analysis?.monthly_expense_ratio);

  const filterDailyIncomesExpensesByMonth = () =>
    filterByDateMonth(analysis?.daily_incomes_expenses);

  const filterBalanceByMonth = () =>
    filterByDateMonth(
      analysis?.balance_by_day.map((item) => ({
        date: item.date,
        value: item.balance,
      }))
    );

  const dailyData = useMemo(
    () => filterDailyIncomesExpensesByMonth(),
    [analysis, currentMonth]
  );

  const balanceByDay = useMemo(
    () => filterBalanceByMonth(),
    [analysis, currentMonth]
  );

  const selectMonth = (month: string) => setCurrentMonth(month);

  const transformToPieChartData = (
    raw: { account: string; amount: number }[],
    palette: string[] = []
  ) =>
    raw.map((item, index) => {
      const fallbackIndex = index % palette.length;
      const shadeFactor = 100 + Math.floor(index / palette.length) * 10;
      const color = palette[index] ?? `${palette[fallbackIndex]}${shadeFactor}`;

      return {
        name: item.account.replace(/^[^:]*:/, ""),
        visitors: item.amount,
        fill: color,
      };
    });

  useEffect(() => {
    if (!analysis) return setCashflows(null);

    const cashflow = filterCashflowsByMonth();
    const growth = filterGrowthRateByMonth();
    const ratio = filterExpenseRatioByMonth();

    setCashflows({
      net: {
        value: cashflow?.net ?? 0,
        growth: growth?.net_growth ?? 0,
      },
      in: {
        value: cashflow?.in ?? 0,
        growth: growth?.in_growth ?? 0,
      },
      out: {
        value: cashflow?.out ?? 0,
        growth: growth?.out_growth ?? 0,
      },
      ratio: {
        value: ratio?.expense_ratio ?? 0,
      },
    });
  }, [analysis, currentMonth]);

  return {
    currentFile,
    parser,
    analysis,
    currentMonth,
    cashflows,
    dailyData,
    balanceByDay,
    selectMonth,
    buildMonths,
    filterCashflowsByMonth,
    filterGrowthRateByMonth,
    filterExpenseRatioByMonth,
    filterDailyIncomesExpensesByMonth,
    filterBalanceByMonth,
    transformToPieChartData,
  };
}
