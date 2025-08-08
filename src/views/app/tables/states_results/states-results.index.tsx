import { CardGradient } from "@/components/cards/card-gradient";
// import { IncomeStatement } from "@/components/tables/table-state-results";
import { useLedger } from "@/contexts/LedgerContext";
import { formatCurrency } from "@/utils/format";
import { useMemo } from "react";
import { RegisterViewBase } from "../layouts/register-base";
import { IncomeStatementTable } from "./incomeStatement.table";

export default function StatesResultsView() {
  const { parser, currency } = useLedger();

  const getNewStates = useMemo(() => {
    if (parser?.state_results) {
      return Object.entries(
        parser?.state_results?.utility_by_currency ?? {}
      ).map(([key, value]) => {
        console.log(key, value);
        return { unit: key, amount: value };
      });
    }

    return [];
  }, [parser]);

  return (
    <RegisterViewBase>
      <div className="w-full h-full py-5">
        <div className="">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {getNewStates.map((item, i) => {
              return (
                <CardGradient
                  key={i}
                  isNeutral
                  currency={
                    item.unit == "$" || item.unit === "N/A"
                      ? currency
                      : item.unit
                  }
                  value={item.amount}
                  title={"Resultado del Ejercicio"}
                  percentage={item.amount}
                  useBackground={false}
                  descriptions={[
                    "Ganancias del último periodo",
                    "Perdidas del último periodo",
                  ]}
                  subs={[
                    `Ganancias del último periodo: ${formatCurrency(
                      item.amount,
                      item.unit
                    )}`,
                    `Perdidas del último periodo: ${formatCurrency(
                      item.amount,
                      item.unit
                    )}`,
                  ]}
                />
              );
            })}
          </div>
        </div>

        <div className="w-full  m-auto">
          <IncomeStatementTable />
        </div>
      </div>
    </RegisterViewBase>
  );
}
