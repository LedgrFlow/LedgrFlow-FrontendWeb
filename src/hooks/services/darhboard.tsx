import { useEffect, useState } from "react";
import { FileStorage } from "@/utils/bd-local";
import { LedgerApi } from "@/services/backend/ledger";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Pallets from "@/constants/pallets";
import "dayjs/locale/es";

dayjs.extend(relativeTime);
dayjs.locale("es");

interface Cashflow {
  month: string;
  in: number;
  out: number;
  net: number;
}

const defaultCashflow: Cashflow = {
  month: "Enero",
  in: 0,
  out: 0,
  net: 0,
};

function capitalizeFirstLetter(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function useLedgerDashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [dailySummary, setDailySummary] = useState<any[]>([]);
  const [range, setRange] = useState<{ start: string; end: string }>();
  const [lastBalance, setLastBalance] = useState<any[]>([]);
  const [timeSleep, setTimeSleep] = useState<string>("");
  const [incomesPie, setIncomesPie] = useState<any[]>([]);
  const [expensesPie, setExpensesPie] = useState<any[]>([]);
  const [cashflow, setCashflow] = useState<Cashflow>(defaultCashflow);
  const [cashflows, setCashflows] = useState<Cashflow[]>([defaultCashflow]);
  const [months, setMonths] = useState<{ value: string; label: string }[]>([]); // <--- modificado aquí

  const transformToPieChartData = (
    raw: { account: string; amount: number }[],
    palette: string[] = []
  ) => {
    return raw.map((item, index) => {
      let color = palette[index];
      if (!color) {
        const fallbackIndex = index % palette.length;
        const shadeFactor = 100 + Math.floor(index / palette.length) * 10;
        color = `${palette[fallbackIndex]}${shadeFactor}`;
      }

      return {
        name: item.account.replace(/^[^:]*:/, ""),
        visitors: item.amount,
        fill: color,
      };
    });
  };

  const adaptDataForBarChart = (
    raw: Record<string, Record<string, number>>
  ) => {
    return Object.entries(raw).map(([category, valuesByCurrency]) => {
      const currency = Object.keys(valuesByCurrency)[0];
      const value = Math.abs(valuesByCurrency[currency]) ?? 0;
      return { category, value };
    });
  };

  useEffect(() => {
    FileStorage.getFile("user-ledger")
      .then((loadedFile) => {
        if (loadedFile) {
          setFile(loadedFile);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!file) return;

    LedgerApi.dailySummary(file)
      .then((data) => {
        const enriched = data.map((item: any) => ({
          ...item,
          fullDate: dayjs(item.date).format("dddd, D [de] MMMM [de] YYYY"),
        }));
        setDailySummary(enriched);
      })
      .catch(console.error);

    LedgerApi.dateRange(file)
      .then((data) => {
        setTimeSleep(dayjs(data.end).from(dayjs(data.start), true));
        setRange({
          start: dayjs(data.start).format("D [de] MMMM [de] YYYY"),
          end: dayjs(data.end).format("D [de] MMMM [de] YYYY"),
        });
      })
      .catch(console.error);

    LedgerApi.cashflow(file)
      .then((data) => {
        setCashflow(data?.[data.length - 1]);
        setCashflows(data);

        const availableMonths = data.map((item: any) => {
          const date = dayjs(item.month, "YYYY-MM");
          return {
            value: item.month,
            label: capitalizeFirstLetter(date.format("MMMM YYYY")), // ejemplo: "Enero 2025"
          };
        });
        setMonths(availableMonths);
      })
      .catch(console.error);

    LedgerApi.incomesPie(file)
      .then((data) => {
        setIncomesPie(
          transformToPieChartData(data, Pallets.PalletChartPie.income)
        );
      })
      .catch(console.error);

    LedgerApi.expensesPie(file)
      .then((data) => {
        setExpensesPie(
          transformToPieChartData(data, Pallets.PalletChartPie.expense)
        );
      })
      .catch(console.error);

    LedgerApi.balancesByParents(file)
      .then((data) => {
        setLastBalance(adaptDataForBarChart(data));
      })
      .catch(console.error);

    LedgerApi.unusualExpenses(file)
      .then((data) => {
        console.log("Unusual Expenses", data);
      })
      .catch(console.error);
  }, [file]);

  useEffect(() => {
    console.log("Dayly Summary", dailySummary);
    console.log("Range", range);
    console.log("Last Balance", lastBalance);
    console.log("Incomes Pie", incomesPie);
    console.log("Expenses Pie", expensesPie);
    console.log("Cashflow", cashflow);
    console.log("Cashflows", cashflows);
    console.log("Time Sleep", timeSleep);
    console.log("Months", months);
  }, [
    dailySummary,
    range,
    lastBalance,
    incomesPie,
    expensesPie,
    cashflow,
    cashflows,
    timeSleep,
    months,
  ]);

  return {
    file,
    dailySummary,
    range,
    lastBalance,
    incomesPie,
    expensesPie,
    cashflow,
    cashflows,
    timeSleep,
    months,
  };
}
