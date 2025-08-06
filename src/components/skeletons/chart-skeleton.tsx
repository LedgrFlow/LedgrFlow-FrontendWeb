import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface GenericLineChartProps {
  data: Array<Record<string, any>>;
  dataKey: string; // la propiedad numérica que queremos graficar
  title?: string;
  description?: string;
  colorVar?: string; // variable CSS para color, ej: "chart-1"
}

export function GenericLineChart({
  data,
  dataKey,
  title = "Loading Chart",
  description = "Please wait or perform an action",
  colorVar = "chart-1",
}: GenericLineChartProps) {
  return (
    <Card className="py-4 sm:py-0">
      <CardHeader className="border-b !p-0">
        <div className="flex flex-col justify-center gap-1 px-6 py-3">
          <CardTitle>{title}</CardTitle>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer  config={{}} className="aspect-auto h-[250px] w-full">
          <LineChart data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey={dataKey}
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }
                />
              }
            />
            <Line
              dataKey={dataKey}
              type="monotone"
              stroke={`var(--${colorVar})`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
