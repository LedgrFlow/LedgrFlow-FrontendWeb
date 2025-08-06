import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency } from "@/utils/format";
import clsx from "clsx";
import { useMemo, type JSX } from "react";
import { returnBadgeColorByParent, type Parents } from "./styles-dinamics";

type AccountNode = {
  balances: Record<string, number>;
  sub_accounts: Record<string, AccountNode>;
};

type AccountTree = Record<string, AccountNode>;

type Props = {
  data: AccountTree;
  style?: "default" | "complete"; // nuevo parámetro
  parents?: Parents | undefined;
};

export function TableBalanceByDetail({
  data,
  style = "default",
  parents = {
    Assets: "Assets",
    Liabilities: "Liabilities",
    Equity: "Equity",
    Income: "Income",
    Expenses: "Expenses",
  },
}: Props) {
  let index = 0;

  const renderRows = (
    node: AccountNode,
    name: string,
    depth: number,
    rootParent: string,
    path: string[] = []
  ): JSX.Element[] => {
    const rows: JSX.Element[] = [];

    const fullPath = [...path, name];
    const displayName = style === "complete" ? fullPath.join(" > ") : name;

    index++;

    rows.push(
      <TableRow key={`${fullPath.join("-")}-${index}`}>
        <TableCell className="text-center">{index}</TableCell>
        <TableCell>
          <div
            style={
              style === "default" ? { paddingLeft: `${depth * 1.5}rem` } : {}
            }
          >
            <span
              className={clsx(returnBadgeColorByParent(rootParent, parents))}
            >
              {displayName}
            </span>
          </div>
        </TableCell>
        <TableCell className="text-right space-y-1 flex items-center gap-4">
          {Object.entries(node.balances).map(([currency, amount]) => (
            <div key={currency}>{formatCurrency(amount, currency)}</div>
          ))}
        </TableCell>
      </TableRow>
    );

    for (const [childName, childNode] of Object.entries(node.sub_accounts)) {
      rows.push(
        ...renderRows(childNode, childName, depth + 1, rootParent, fullPath)
      );
    }

    return rows;
  };

  const rows = useMemo(() => {
    const allRows: JSX.Element[] = [];
    for (const [rootAccountName, node] of Object.entries(data)) {
      allRows.push(
        ...renderRows(node, rootAccountName, 0, rootAccountName, [])
      );
    }
    return allRows;
  }, [data, style]);

  return (
    <div className="space-y-4">
      <ScrollArea className="rounded-md border w-full">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead className="text-center">Nº</TableHead>
              <TableHead className="w-full">Concepto</TableHead>
              <TableHead className="text-right">Saldo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{rows}</TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
