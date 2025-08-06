import { CardGradient } from "@/components/cards/card-gradient";
import { ChartLineMultiple } from "@/components/charts/chart-two-lines";
import { SelectBase } from "@/components/select/select";
import { i18n } from "@/lang/i18n";
import { DateFormatter } from "@/utils/date";
import { useFiles } from "@/contexts/FilesContext";
import { useEffect, useMemo, useState } from "react";
import { useLedger } from "@/contexts/LedgerContext";
import { ChartPieLabel } from "@/components/charts/chart-pie-label";
import { ChartAreaGradient } from "@/components/charts/chart-line-gradient";

interface Cashflow {
  net: {
    value: number;
    growth: number;
  };
  in: {
    value: number;
    growth: number;
  };
  out: {
    value: number;
    growth: number;
  };
  ratio: {
    value: number;
    // growth: number;
  };
}

export function Dashboard() {
  const { currentFile } = useFiles();
  const { listMonths, analysis, parser } = useLedger();

  const [currentMonth, setCurrentMonth] = useState<string>("");
  const [cashflows, setCashflows] = useState<Cashflow | null>(null);

  const dailyData = useMemo(
    () => filterDailyIncomesExpensesByMonth(),
    [analysis, currentMonth]
  );
  const balanceByDay = useMemo(
    () => filterBalanceByMonth(),
    [analysis, currentMonth]
  );

  function buildMonths() {
    const months = listMonths.map((month) => {
      const str = new DateFormatter().getMonthName(month);
      const strCapitalized = str.charAt(0).toUpperCase() + str.slice(1);
      return {
        value: month,
        label: strCapitalized,
      };
    });
    months.unshift({ value: "all", label: "Ultimo" });
    return months;
  }

  function filterCashflowsByMonth() {
    if (currentMonth === "" || !currentMonth || currentMonth === "all")
      return analysis?.cashflow_by_month[
        analysis?.cashflow_by_month.length - 1
      ];

    const cashflows = analysis?.cashflow_by_month ?? [];
    return cashflows.filter((cashflow) => {
      return cashflow.month === currentMonth;
    })[0];
  }

  function filterGrowthRateByMonth() {
    if (currentMonth === "" || !currentMonth || currentMonth === "all")
      return analysis?.monthly_growth_rates[
        analysis?.monthly_growth_rates.length - 1
      ];

    const rates = analysis?.monthly_growth_rates ?? [];
    return rates.filter((rate) => {
      return rate.month === currentMonth;
    })[0];
  }

  function filterExpenseRatioByMonth() {
    if (currentMonth === "" || !currentMonth || currentMonth === "all")
      return analysis?.monthly_expense_ratio[
        analysis?.monthly_expense_ratio.length - 1
      ];

    const ratios = analysis?.monthly_expense_ratio ?? [];
    return ratios.filter((ratio) => {
      return ratio.month === currentMonth;
    })[0];
  }

  function filterDailyIncomesExpensesByMonth() {
    if (currentMonth === "" || !currentMonth || currentMonth === "all")
      return analysis?.daily_incomes_expenses;

    const data = analysis?.daily_incomes_expenses ?? [];

    return data.filter((item) => {
      return new DateFormatter().isInMonth(item.date, currentMonth);
    });
  }

  function selectMonth(month: string) {
    setCurrentMonth(month);
  }

  function filterBalanceByMonth() {
    const balanceByDay =
      analysis?.balance_by_day.map((item) => {
        return {
          date: item.date,
          value: item.balance,
        };
      }) || [];

    if (currentMonth === "" || !currentMonth || currentMonth === "all")
      return balanceByDay;

    return balanceByDay.filter((item) => {
      return new DateFormatter().isInMonth(item.date, currentMonth);
    });
  }

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

  useEffect(() => {
    if (analysis) {
      const cashflowsByMonth = filterCashflowsByMonth();
      const growthRatesByMonth = filterGrowthRateByMonth();
      const expenseRatioByMonth = filterExpenseRatioByMonth();

      setCashflows({
        net: {
          value: cashflowsByMonth?.net ?? 0,
          growth: growthRatesByMonth?.net_growth ?? 0,
        },
        in: {
          value: cashflowsByMonth?.in ?? 0,
          growth: growthRatesByMonth?.in_growth ?? 0,
        },
        out: {
          value: cashflowsByMonth?.out ?? 0,
          growth: growthRatesByMonth?.out_growth ?? 0,
        },
        ratio: {
          value: expenseRatioByMonth?.expense_ratio ?? 0,
        },
      });
    } else {
      setCashflows(null);
    }
  }, [currentMonth, analysis]);

  return (
    <div className="px-7 py-9 space-y-8 text-black">
      <div className="w-full flex justify-between">
        <div>
          <h1 className="max-w-lg text-3xl font-semibold leading-loose text-gray-900 dark:text-white">
            {i18n.dashboard.main.title}
          </h1>
          <p className="text-left rtl:text-right text-gray-500 dark:text-gray-400">
            {i18n.dashboard.main.description.replace(
              "{{fileName}}",
              currentFile?.name ?? "Archivo"
            )}
          </p>
        </div>
        <div>
          <SelectBase
            onChange={(value: string) => selectMonth(value)}
            // defaultValue={buildMonths().at(-1)?.value}
            label="Meses disponibles"
            labelOptions="Meses"
            options={buildMonths()}
          />
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <CardGradient
          value={cashflows?.net.value ?? 0}
          percentage={cashflows?.net.growth ?? 0}
          usePercentage
          title="Balance actual"
          descriptions={[
            i18n.dashboard.cards.balance.up.description(
              cashflows?.net.growth ?? 0
            ),
            i18n.dashboard.cards.balance.down.description(
              cashflows?.net.growth ?? 0
            ),
            i18n.dashboard.cards.balance.same.description(),
          ]}
          subs={[
            i18n.dashboard.cards.balance.up.sub,
            i18n.dashboard.cards.balance.down.sub,
            i18n.dashboard.cards.balance.same.sub,
          ]}
        />
        <CardGradient
          value={cashflows?.in.value ?? 0}
          isNeutral
          percentage={cashflows?.in.growth ?? 0}
          usePercentage
          title="Ingresos actuales"
          descriptions={[
            i18n.dashboard.cards.incomes.up.description(
              cashflows?.in.growth ?? 0
            ),
            i18n.dashboard.cards.incomes.down.description(
              cashflows?.in.growth ?? 0
            ),
            i18n.dashboard.cards.incomes.same.description(),
          ]}
          subs={[
            i18n.dashboard.cards.incomes.up.sub,
            i18n.dashboard.cards.incomes.down.sub,
            i18n.dashboard.cards.incomes.same.sub,
          ]}
        />
        <CardGradient
          value={cashflows?.out.value ?? 0}
          isNeutral
          percentage={cashflows?.out.growth ?? 0}
          usePercentage
          title="Egresos actuales"
          descriptions={[
            i18n.dashboard.cards.expenses.up.description(
              cashflows?.out.growth ?? 0
            ),
            i18n.dashboard.cards.expenses.down.description(
              cashflows?.out.growth ?? 0
            ),
            i18n.dashboard.cards.expenses.same.description(),
          ]}
          subs={[
            i18n.dashboard.cards.expenses.up.sub,
            i18n.dashboard.cards.expenses.down.sub,
            i18n.dashboard.cards.expenses.same.sub,
          ]}
        />
        <CardGradient
          value={cashflows?.ratio.value ?? 0}
          isNeutral
          percentage={cashflows?.ratio.value ?? 0}
          useStylePercentage
          // usePercentage
          title="Porcentaje de ingresos gastados"
          descriptions={[
            i18n.dashboard.cards.spendingRate.up.description(
              cashflows?.ratio.value ?? 0
            ),
            i18n.dashboard.cards.spendingRate.down.description(
              cashflows?.ratio.value ?? 0
            ),
            i18n.dashboard.cards.spendingRate.same.description(
              cashflows?.ratio.value ?? 0
            ),
          ]}
          subs={[
            i18n.dashboard.cards.spendingRate.up.sub,
            i18n.dashboard.cards.spendingRate.down.sub,
            i18n.dashboard.cards.spendingRate.same.sub,
          ]}
        />
      </section>

      {/* Las gráficas las dejamos iguales ya que no dependen del mes seleccionado directamente */}

      <section className="w-full">
        <ChartLineMultiple
          title={i18n.dashboard.linechart.title}
          trendMessages={{
            up: i18n.dashboard.linechart.trendMessages.up.replace(
              "{{percentage}}",
              `${Math.abs(cashflows?.net.growth ?? 0).toFixed(1)}%`
            ),
            down: i18n.dashboard.linechart.trendMessages.down.replace(
              "{{percentage}}",
              `${Math.abs(cashflows?.net.growth ?? 0).toFixed(1)}%`
            ),
            same: i18n.dashboard.linechart.trendMessages.same,
          }}
          trend={cashflows?.net.growth ?? 0}
          timeSleep={i18n.dashboard.linechart.time.replace(
            "{{timeSleep}}",
            new DateFormatter().toRelativeClean(parser?.period[0] ?? "")
          )}
          labelDate={`${new DateFormatter().toReadable(
            parser?.period[0] ?? ""
          )} - ${new DateFormatter().toReadable(parser?.period[1] ?? "")}`}
          axis="date"
          data={dailyData}
          config={{
            incoming: {
              label: "Ingresos",
              color: "var(--income-graph-0)",
            },
            expenses: {
              label: "Gastos",
              color: "var(--expense-graph-0)",
            },
          }}
        />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ChartPieLabel
          title={i18n.dashboard.piechart.incoming.title}
          percentage={cashflows?.in.growth ?? 0}
          descriptions={[
            i18n.dashboard.piechart.incoming.trendMessages.up.replace(
              "{{percentage}}",
              `${Math.abs(cashflows?.in.growth ?? 0).toFixed(1)}%`
            ),
            i18n.dashboard.piechart.incoming.trendMessages.down.replace(
              "{{percentage}}",
              `${Math.abs(cashflows?.in.growth ?? 0).toFixed(1)}%`
            ),
            i18n.dashboard.piechart.incoming.trendMessages.same,
          ]}
          sub={i18n.dashboard.piechart.incoming.sub.replace(
            "{{timeRange}}",
            `${new DateFormatter().toReadable(
              parser?.period[0] ?? ""
            )} - ${new DateFormatter().toReadable(parser?.period[1] ?? "")}`
          )}
          time={`${new DateFormatter().toReadable(
            parser?.period[0] ?? ""
          )} - ${new DateFormatter().toReadable(parser?.period[1] ?? "")}`}
          data={transformToPieChartData(analysis?.incomes_pie ?? [], [
            "var(--income-pie-0)",
            "var(--income-pie-1)",
            "var(--income-pie-2)",
            "var(--income-pie-3)",
            "var(--income-pie-4)",
            "var(--income-pie-5)",
            "var(--income-pie-6)",
            "var(--income-pie-7)",
            "var(--income-pie-8)",
            "var(--income-pie-9)",
            "var(--income-pie-10)",
            "var(--income-pie-11)",
            "var(--income-pie-12)",
            "var(--income-pie-13)",
            "var(--income-pie-14)",
          ])}
          config={{ visitors: { label: "Ingresos" } }}
        />
        <ChartPieLabel
          title={i18n.dashboard.piechart.expenses.title}
          percentage={cashflows?.out.growth ?? 0}
          descriptions={[
            i18n.dashboard.piechart.expenses.trendMessages.up.replace(
              "{{percentage}}",
              `${Math.abs(cashflows?.out.growth ?? 0).toFixed(1)}%`
            ),
            i18n.dashboard.piechart.expenses.trendMessages.down.replace(
              "{{percentage}}",
              `${Math.abs(cashflows?.out.growth ?? 0).toFixed(1)}%`
            ),
            i18n.dashboard.piechart.expenses.trendMessages.same,
          ]}
          sub={i18n.dashboard.piechart.expenses.sub.replace(
            "{{timeRange}}",
            `${new DateFormatter().toReadable(
              parser?.period[0] ?? ""
            )} - ${new DateFormatter().toReadable(parser?.period[1] ?? "")}`
          )}
          time={`${new DateFormatter().toReadable(
            parser?.period[0] ?? ""
          )} - ${new DateFormatter().toReadable(parser?.period[1] ?? "")}`}
          data={transformToPieChartData(analysis?.expenses_pie ?? [], [
            "var(--expense-pie-0)",
            "var(--expense-pie-1)",
            "var(--expense-pie-2)",
            "var(--expense-pie-3)",
            "var(--expense-pie-4)",
            "var(--expense-pie-5)",
            "var(--expense-pie-6)",
            "var(--expense-pie-7)",
            "var(--expense-pie-8)",
            "var(--expense-pie-9)",
            "var(--expense-pie-10)",
            "var(--expense-pie-11)",
            "var(--expense-pie-12)",
            "var(--expense-pie-13)",
            "var(--expense-pie-14)",
          ])}
          config={{ visitors: { label: "Gastos" } }}
        />

        {/* Grafica gradiente */}
        <ChartAreaGradient
          data={balanceByDay}
          config={{
            value: {
              label: "Balance",
              color: "var(--balance-graph-0)",
            },
          }}
          xKey="date"
          title="Visitas por dispositivo"
          description="Resumen de visitas en los últimos 6 meses"
          footerText="Enero - Junio 2024"
        />
      </section>
    </div>
  );
}
