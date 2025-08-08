// // hooks/useLedgerBalance.ts
// import { useEffect, useMemo, useState } from "react";
// import { type Parents } from "@/components/tables/styles-dinamics";

// type AccountData = Record<string, Record<string, number>>;
// type UtilityData = Record<string, number>;

// type Section = {
//   label: string;
//   rows: {
//     account: string;
//     amount: number;
//     accumulated: number;
//     isUtility?: boolean;
//     currency?: string;
//   }[];
//   total: number;
// };

// type UseLedgerBalanceProps = {
//   data: AccountData;
//   utility: UtilityData;
//   currency?: string;
//   parentsAccounts: Parents;
//   ignoreKeys?: string[];
// };

// export function useLedgerBalance({
//   data,
//   utility,
//   currency = "USD",
//   parentsAccounts,
//   ignoreKeys = ["Income", "Expenses"],
// }: UseLedgerBalanceProps) {
//   const [sections, setSections] = useState<Record<string, Section>>({});
//   const [totals, setTotals] = useState<{
//     totalAssets: number;
//     totalLiabilitiesAndEquity: number;
//   }>({
//     totalAssets: 0,
//     totalLiabilitiesAndEquity: 0,
//   });

//   useEffect(() => {
//     const tempSections: Record<string, Section> = {};
//     const ignoreSet = new Set(ignoreKeys);

//     for (const [key, label] of Object.entries(parentsAccounts)) {
//       if (!ignoreSet.has(key)) {
//         tempSections[label] = {
//           label,
//           rows: [],
//           total: 0,
//         };
//       }
//     }

//     const utilityRows: Section["rows"] = [];

//     for (const [account, balances] of Object.entries(data)) {
//       const mainPrefix = account.split(":")[0];
//       const parentKey = Object.entries(parentsAccounts).find(
//         ([, label]) => label === mainPrefix
//       )?.[0];

//       if (!parentKey || ignoreSet.has(parentKey)) continue;

//       const sectionLabel = parentsAccounts[parentKey];
//       const section = tempSections[sectionLabel];
//       const amount = Object.values(balances).reduce((acc, v) => acc + v, 0);

//       if (section) {
//         section.total += amount;
//         section.rows.push({
//           account,
//           amount,
//           accumulated: section.total,
//         });
//       }
//     }

//     // Procesar utilidad al capital
//     const equityLabel = parentsAccounts["Equity"];
//     let totalEquityUtility = 0;

//     for (const [cur, amount] of Object.entries(utility)) {
//       const val = -amount;
//       utilityRows.push({
//         account: `Utilidad del Ejercicio en ${cur}`,
//         amount,
//         accumulated: 0, // se asigna luego
//         isUtility: true,
//         currency: cur,
//       });

//       if (tempSections[equityLabel]) {
//         tempSections[equityLabel].total += val;
//         totalEquityUtility += val;
//       }
//     }

//     if (tempSections[equityLabel]) {
//       let acc = tempSections[equityLabel].total - totalEquityUtility;
//       for (const row of utilityRows) {
//         acc += -row.amount;
//         row.accumulated = acc;
//         tempSections[equityLabel].rows.push(row);
//       }
//     }

//     setSections(tempSections);

//     // Totales
//     const totalAssets = tempSections[parentsAccounts["Assets"]]?.total ?? 0;
//     const totalLiabilities =
//       tempSections[parentsAccounts["Liabilities"]]?.total ?? 0;
//     const totalEquity = tempSections[parentsAccounts["Equity"]]?.total ?? 0;

//     setTotals({
//       totalAssets,
//       totalLiabilitiesAndEquity: totalLiabilities + totalEquity,
//     });
//   }, [data, utility, parentsAccounts, ignoreKeys]);

//   return {
//     sections,
//     totals,
//   };
// }
