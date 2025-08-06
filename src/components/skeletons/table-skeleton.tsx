// LoadingTable.tsx
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import clsx from "clsx";

export function LoadingTable({ rows = 20 }: { rows?: number }) {
  const widths = ["w-16", "w-20", "w-24", "w-28", "w-32", "w-40", "w-48"];

  const getRandomWidth = () => {
    const index = Math.floor(Math.random() * widths.length);
    return widths[index];
  };

  return (
    <div className="p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Skeleton className="h-4 w-24 rounded" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-4 w-20 rounded" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-4 w-28 rounded" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-4 w-16 rounded" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(rows)].map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className={clsx("h-4 rounded", getRandomWidth())} />
              </TableCell>
              <TableCell>
                <Skeleton className={clsx("h-4 rounded", getRandomWidth())} />
              </TableCell>
              <TableCell>
                <Skeleton className={clsx("h-4 rounded", getRandomWidth())} />
              </TableCell>
              <TableCell>
                <Skeleton className={clsx("h-4 rounded", getRandomWidth())} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
