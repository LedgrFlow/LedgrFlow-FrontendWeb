import { CardGradient } from "@/components/cards/card-gradient";
import { BalanceGeneral } from "@/components/tables/table-balance-general";
import { useLedger } from "@/contexts/LedgerContext";
import { useMemo } from "react";
import { RegisterViewBase } from "./register-base";

export default function BalanceView() {
  const { parser, totals } = useLedger();

  const evaluateTotals = useMemo(
    () =>
      totals?.debit && totals?.credit ? totals?.debit == totals.credit : false,
    [totals]
  );

  return (
    <RegisterViewBase>
      <div className="w-full h-full py-5">
        <div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <CardGradient
              value={totals?.credit ?? 0}
              isNeutral
              title="Saldo credito"
              percentage={evaluateTotals ? 1 : -1}
              descriptions={["Saldo del último periodo"]}
              subs={["El balance esta cuadrado", "El balance esta descuadrado"]}
            />
            <CardGradient
              value={totals?.debit ?? 0}
              isNeutral
              percentage={evaluateTotals ? 1 : -1}
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
              useStyleNeutral
              title="Transacciones"
              percentage={1}
              descriptions={["Transacciones del último periodo"]}
            />
          </div>
        </div>

        <div className="w-full  m-auto">
          <BalanceGeneral
            utility={parser?.state_results?.utility_by_currency ?? {}}
            data={parser?.balances ?? {}}
            parentsAccounts={parser?.parents}
          />
        </div>
      </div>
    </RegisterViewBase>
  );
}
