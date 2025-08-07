import { CardGradient } from "@/components/cards/card-gradient";
import { ChartLineMultiple } from "@/components/charts/chart-two-lines";
import { SelectBase } from "@/components/select/select";
import { DateFormatter } from "@/utils/date";
import { ChartPieLabel } from "@/components/charts/chart-pie-label";
import { ChartAreaGradient } from "@/components/charts/chart-line-gradient";
import { useDashboard } from "./controllers/dashboard.controller";
import { useTranslation } from "react-i18next";

export function Dashboard() {
  const { t } = useTranslation("dashboard");
  const {
    currentFile,
    parser,
    cashflows,
    dailyData,
    balanceByDay,
    analysis,
    buildMonths,
    selectMonth,
    transformToPieChartData,
  } = useDashboard();

  return (
    <div className="px-7 py-9 space-y-8 text-black">
      <div className="w-full flex justify-between">
        <div>
          <h1 className="max-w-lg text-3xl font-semibold leading-loose text-gray-900 dark:text-white">
            {t("main.title")}
          </h1>
          <p className="text-left rtl:text-right text-gray-500 dark:text-gray-400">
            {t("main.description").replace(
              "{{fileName}}",
              currentFile?.name ?? "Archivo"
            )}
          </p>
        </div>
        <div>
          <SelectBase
            onChange={(value: string) => selectMonth(value)}
            label={t("selects.months.label")}
            labelOptions={t("selects.months.placeholder")}
            options={buildMonths(t("selects.months.all"))}
          />
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <CardGradient
          value={cashflows?.net.value ?? 0}
          percentage={cashflows?.net.growth ?? 0}
          usePercentage
          title={t("cards.balance.title")}
          descriptions={[
            t("cards.balance.up.description", {
              value: cashflows?.net.growth,
            }),
            t("cards.balance.down.description", {
              value: cashflows?.net.growth,
            }),
            t("cards.balance.same.description"),
          ]}
          subs={[
            t("cards.balance.up.sub"),
            t("cards.balance.down.sub"),
            t("cards.balance.same.sub"),
          ]}
        />
        <CardGradient
          value={cashflows?.in.value ?? 0}
          isNeutral
          useBackground={false}
          percentage={cashflows?.in.growth ?? 0}
          usePercentage
          title={t("cards.incomes.title")}
          descriptions={[
            t("cards.incomes.up.description", {
              value: cashflows?.in.growth,
            }),
            t("cards.incomes.down.description", {
              value: cashflows?.in.growth,
            }),
            t("cards.incomes.same.description"),
          ]}
          subs={[
            t("cards.incomes.up.sub"),
            t("cards.incomes.down.sub"),
            t("cards.incomes.same.sub"),
          ]}
        />
        <CardGradient
          value={cashflows?.out.value ?? 0}
          isNeutral
          useBackground={false}
          percentage={cashflows?.out.growth ?? 0}
          usePercentage
          title="Egresos actuales"
          descriptions={[
            t("cards.expenses.up.description", {
              value: cashflows?.out.growth,
            }),
            t("cards.expenses.down.description", {
              value: cashflows?.out.growth,
            }),
            t("cards.expenses.same.description"),
          ]}
          subs={[
            t("cards.expenses.up.sub"),
            t("cards.expenses.down.sub"),
            t("cards.expenses.same.sub"),
          ]}
        />
        <CardGradient
          value={cashflows?.ratio.value ?? 0}
          isNeutral
          useBackground={false}
          percentage={cashflows?.ratio.value ?? 0}
          useStylePercentage
          // usePercentage
          title={t("cards.spendingRate.title")}
          descriptions={[
            t("cards.spendingRate.up.description", {
              value: cashflows?.ratio.value,
            }),
            t("cards.spendingRate.down.description", {
              value: cashflows?.ratio.value,
            }),
            t("cards.spendingRate.same.description", {
              value: cashflows?.ratio.value,
            }),
          ]}
          subs={[
            t("cards.spendingRate.up.sub"),
            t("cards.spendingRate.down.sub"),
            t("cards.spendingRate.same.sub"),
          ]}
        />
      </section>

      {/* Las gráficas las dejamos iguales ya que no dependen del mes seleccionado directamente */}

      <section className="w-full">
        <ChartLineMultiple
          title={t("linechart.title")}
          trendMessages={{
            up: t("linechart.trendMessages.up", {
              percentage: Math.abs(cashflows?.net.growth ?? 0).toFixed(1),
            }),
            down: t("linechart.trendMessages.down", {
              percentage: Math.abs(cashflows?.net.growth ?? 0).toFixed(1),
            }),
            same: t("linechart.trendMessages.same"),
          }}
          trend={cashflows?.net.growth ?? 0}
          timeSleep={t("linechart.time", {
            timeSleep: new DateFormatter().toRelativeClean(
              parser?.period[0] ?? ""
            ),
          })}
          labelDate={`${new DateFormatter().toReadable(
            parser?.period[0] ?? ""
          )} - ${new DateFormatter().toReadable(parser?.period[1] ?? "")}`}
          axis="date"
          data={dailyData}
          config={{
            incoming: {
              label: t("linechart.labels.incomes"),
              color: "var(--income-graph-0)",
            },
            expenses: {
              label: t("linechart.labels.expenses"),
              color: "var(--expense-graph-0)",
            },
          }}
        />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ChartPieLabel
          title={t("piechart.incoming.title")}
          percentage={cashflows?.in.growth ?? 0}
          descriptions={[
            t("piechart.incoming.trendMessages.up", {
              percentage: Math.abs(cashflows?.in.growth ?? 0).toFixed(1),
            }),
            t("piechart.incoming.trendMessages.down", {
              percentage: Math.abs(cashflows?.in.growth ?? 0).toFixed(1),
            }),
            t("piechart.incoming.trendMessages.same"),
          ]}
          sub={t("piechart.incoming.sub", {
            timeRange: new DateFormatter().toReadable(parser?.period[0] ?? ""),
          })}
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
          title={t("piechart.expenses.title")}
          percentage={cashflows?.out.growth ?? 0}
          descriptions={[
            t("piechart.expenses.trendMessages.up", {
              percentage: Math.abs(cashflows?.out.growth ?? 0).toFixed(1),
            }),
            t("piechart.expenses.trendMessages.down", {
              percentage: Math.abs(cashflows?.out.growth ?? 0).toFixed(1),
            }),
            t("piechart.expenses.trendMessages.same"),
          ]}
          sub={t("piechart.expenses.sub", {
            timeRange: new DateFormatter().toReadable(parser?.period[0] ?? ""),
          })}
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
          title={t("balance_line.title")}
          description={t("balance_line.sub")}
          footerText={t("balance_line.time", {
            timeRange: new DateFormatter().toReadable(parser?.period[0] ?? ""),
          })}
        />
      </section>
    </div>
  );
}
