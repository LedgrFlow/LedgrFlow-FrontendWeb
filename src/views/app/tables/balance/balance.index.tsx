import { CardGradient } from "@/components/cards/card-gradient";
import { BalanceGeneral } from "@/views/app/tables/balance/balance.table";
import { useLedger } from "@/contexts/LedgerContext";
import { useMemo, useState } from "react";
import { RegisterViewBase } from "../layouts/register-base";

export default function BalanceView() {
  const { parser, totals, currency } = useLedger();
  const [sums, setSums] = useState({
    totalAssets: 0,
    totalLiabilitiesAndEquity: 0,
  });

  const evaluateTotals = useMemo(
    () =>
      sums?.totalAssets && sums?.totalLiabilitiesAndEquity
        ? sums?.totalAssets == sums.totalLiabilitiesAndEquity
        : false,
    [totals]
  );

  return (
    <RegisterViewBase>
      <div className="w-full h-full py-5">
        <div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <CardGradient
              value={Math.abs(sums.totalAssets ?? 0)}
              isNeutral
              currency={currency}
              title="Saldo credito"
              percentage={evaluateTotals ? -1 : 1}
              useBackground={false}
              descriptions={["Saldo del último periodo"]}
              subs={["El balance esta cuadrado", "El balance esta descuadrado"]}
            />
            <CardGradient
              value={Math.abs(sums.totalLiabilitiesAndEquity ?? 0)}
              isNeutral
              currency={currency}
              useBackground={false}
              percentage={evaluateTotals ? -1 : 1}
              descriptions={[
                "Saldo del último periodo",
                "Saldo del último periodo",
              ]}
              subs={["El balance esta cuadrado", "El balance esta descuadrado"]}
              title="Saldo debito"
            />
            <CardGradient
              value={parser?.transactions.length ?? 0}
              isNeutral
              currency={currency}
              useBackground={false}
              useStyleNeutral
              title="Transacciones"
              percentage={1}
              descriptions={["Transacciones del último periodo"]}
            />
          </div>
        </div>

        <div className="w-full  m-auto">
          <BalanceGeneral
            callback={(data) => {
              if (data) setSums(data);
            }}
            utility={parser?.state_results?.utility_by_currency ?? {}}
            data={parser?.balances ?? {}}
            parentsAccounts={parser?.parents}
            currency={currency}
          />
        </div>
      </div>
    </RegisterViewBase>
  );
}
