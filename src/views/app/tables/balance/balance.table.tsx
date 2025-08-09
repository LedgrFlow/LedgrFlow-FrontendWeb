import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import clsx from "clsx";
import { formatCurrency } from "@/utils/format";
import type { JSX } from "react";
import {
  returnBadgeColorByParent,
  type Parents,
} from "@/views/app/tables/utils/styles";

type AccountData = Record<string, Record<string, number>>;
type UtilityData = Record<string, number>;

type Props = {
  data: AccountData;
  utility: UtilityData;
  currency?: string;
  parentsAccounts?: Parents;
  ignoreAccounts?: string[]; // cuentas padre a ignorar (e.g. Income, Expenses)
  callback?: (data: {
    totalAssets: number;
    totalLiabilitiesAndEquity: number;
  }) => void;
};

const stylesBadges = {
  Assets:
    "w-fit border border-purple-300/70 px-3 py-1 rounded-xl text-xs text-purple-200 bg-purple-400/10",
  Liabilities:
    "w-fit border border-blue-300/70 px-3 py-1 rounded-xl text-xs text-blue-200 bg-blue-400/10",
  Equity:
    "w-fit border border-yellow-300/70 px-3 py-1 rounded-xl text-xs text-yellow-200 bg-yellow-400/10",
  Utility:
    "w-fit border border-green-300/70 px-3 py-1 rounded-xl text-xs dark:text-green-200 bg-green-400/10 text-green-600",
  Other:
    "w-fit border border-gray-300/70 px-3 py-1 rounded-xl text-xs text-gray-200 bg-gray-400/10",
};

export function getBalanceTotals(
  data: AccountData,
  utility: UtilityData,
  parentsAccounts: Parents = {
    Assets: "Assets",
    Liabilities: "Liabilities",
    Equity: "Equity",
    Income: "Income",
    Expenses: "Expenses",
  }
): {
  totalAssets: number;
  totalLiabilitiesAndEquity: number;
} {
  let totalAssets = 0;
  let totalLiabilities = 0;
  let totalEquity = 0;

  const ignoreKeys = ["Income", "Expenses"];

  for (const [account, balances] of Object.entries(data)) {
    const mainPrefix = account.split(":")[0];

    const parentKey = Object.entries(parentsAccounts).find(
      ([_, label]) => label === mainPrefix
    )?.[0];

    if (!parentKey || ignoreKeys.includes(parentKey)) continue;

    const sum = Object.values(balances).reduce((acc, val) => acc + val, 0);

    switch (parentKey) {
      case "Assets":
        totalAssets += sum;
        break;
      case "Liabilities":
        totalLiabilities += sum;
        break;
      case "Equity":
        totalEquity += sum;
        break;
    }
  }

  // Sumar utilidad/pérdida del ejercicio al capital
  const utilidadTotal = Object.values(utility).reduce(
    (acc, val) => acc - val,
    0
  ); // signo negativo porque así lo usas en el render

  const totalLiabilitiesAndEquity =
    totalLiabilities + totalEquity + utilidadTotal;

  return {
    totalAssets,
    totalLiabilitiesAndEquity,
  };
}

export function BalanceGeneral({
  data,
  utility,
  currency = "USD",
  parentsAccounts = {
    Assets: "Activos",
    Liabilities: "Pasivos",
    Equity: "Capital",
    Income: "Ingresos",
    Expenses: "Gastos",
  },
  callback,
}: Props) {
  const ignoreKeys = ["Income", "Expenses"];

  let index = 0;

  // Crear secciones solo para las claves que no están ignoradas
  const sections: Record<string, { rows: JSX.Element[]; total: number }> = {};
  for (const [key, label] of Object.entries(parentsAccounts)) {
    if (ignoreKeys.includes(key)) continue;
    // if (label.includes("Unknown")) continue;
    sections[label] = { rows: [], total: 0 };
  }

  // Procesar cuentas
  for (const [account, balances] of Object.entries(data)) {
    const mainPrefix = account.split(":")[0];
    const parentKey = Object.entries(parentsAccounts).find(
      ([_, val]) => val === mainPrefix
    )?.[0];

    // Si no hay coincidencia o es una clave ignorada, saltar
    if (!parentKey || ignoreKeys.includes(parentKey)) continue;

    const sectionLabel = parentsAccounts[parentKey as keyof Parents];
    const sum = Object.values(balances).reduce((acc, val) => acc + val, 0);
    const badge = returnBadgeColorByParent(mainPrefix, parentsAccounts);
    const sec = sections[sectionLabel];
    if (!sec) continue;

    sec.total += sum;
    index++;

    sec.rows.push(
      <TableRow
        key={account}
        className="bg-blue-200/30 dark:bg-blue-950/20 border-none hover:bg-blue-500/15 dark:hover:bg-muted"
      >
        <TableCell className="w-[fit-content] text-center">{index}</TableCell>
        <TableCell>
          <span className={clsx(badge)}>{account.replaceAll(":", " > ")}</span>
        </TableCell>
        <TableCell className="text-right">
          {formatCurrency(Math.abs(sum), currency)}
        </TableCell>
        <TableCell className="text-right">
          {formatCurrency(Math.abs(sec.total), currency)}
        </TableCell>
      </TableRow>
    );
  }

  // Agregar utilidad/pérdida al capital
  const utilidadRows: JSX.Element[] = [];
  const equityLabel = parentsAccounts["Equity"];
  if (equityLabel && sections[equityLabel]) {
    for (const [currency, amount] of Object.entries(utility)) {
      const absMonth = -amount;
      const label = `Utilidad del Ejercicio en ${currency}`;
      sections[equityLabel].total += absMonth;
      index++;

      utilidadRows.push(
        <TableRow
          key={`utility-${currency}`}
          className="bg-blue-200/40 dark:bg-background/40 border-none hover:bg-blue-500/15 dark:hover:bg-muted"
        >
          <TableCell className="w-[fit-content] text-center">{index}</TableCell>
          <TableCell>
            <span className={clsx(stylesBadges.Utility)}>{label}</span>
          </TableCell>
          <TableCell className="text-right">
            {formatCurrency(Math.abs(amount), currency)}
          </TableCell>
          <TableCell className="text-right">
            {formatCurrency(Math.abs(sections[equityLabel].total), currency)}
          </TableCell>
        </TableRow>
      );
    }
  }

  useEffect(() => {
    const { totalAssets, totalLiabilitiesAndEquity } = getBalanceTotals(
      data,
      utility,
      parentsAccounts
    );

    callback?.({
      totalAssets,
      totalLiabilitiesAndEquity,
    });
  }, [data, utility, parentsAccounts]);

  return (
    <div className="space-y-4">
      <ScrollArea className="rounded-md border w-full">
        <Table>
          <TableHeader>
            <TableRow className="bg-background">
              <TableHead className="text-center px-3">Nº</TableHead>
              <TableHead className="w-full">Concepto</TableHead>
              <TableHead className="text-right">Saldo</TableHead>
              <TableHead className="text-right">Suma acumulada</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Renderizamos las secciones filtradas */}
            {Object.entries(parentsAccounts).map(([key, label]) => {
              if (ignoreKeys.includes(key)) return null;
              if (!sections[label]) return null;

              label = label.replaceAll("Unknown-", "");
              return (
                <React.Fragment key={key}>
                  <TableRow className="font-semibold bg-background/40 dark:bg-background-950 border-none hover:bg-blue-500/15 dark:hover:bg-muted">
                    <TableCell></TableCell>
                    <TableCell colSpan={3}>{label}</TableCell>
                  </TableRow>
                  {sections[label]?.rows}
                  <TableRow className="font-bold bg-background/40 dark:bg-background-950 border-none hover:bg-blue-500/15 dark:hover:bg-muted">
                    <TableCell></TableCell>
                    <TableCell>{`Total ${label}`}</TableCell>
                    <TableCell className="text-right" colSpan={2}>
                      {formatCurrency(
                        Math.abs(sections[label]?.total ?? 0),
                        currency
                      )}
                    </TableCell>
                  </TableRow>
                  {key === "Equity" && utilidadRows}
                </React.Fragment>
              );
            })}

            {"Liabilities" in parentsAccounts &&
              "Equity" in parentsAccounts &&
              sections[parentsAccounts["Liabilities"]] &&
              sections[parentsAccounts["Equity"]] && (
                <TableRow className="bg-background font-extrabold hover:bg-blue-500/15 dark:hover:bg-muted">
                  <TableCell></TableCell>
                  <TableCell>Pasivo + Capital</TableCell>
                  <TableCell className="text-right" colSpan={2}>
                    {formatCurrency(
                      Math.abs(
                        sections[parentsAccounts["Liabilities"]].total +
                          sections[parentsAccounts["Equity"]].total
                      ),
                      currency
                    )}
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
