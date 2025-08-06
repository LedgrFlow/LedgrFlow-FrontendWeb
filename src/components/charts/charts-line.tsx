"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Tipo de datos genéricos esperados
export interface GenericChartData {
  Axis: string;
  value1: number;
  value2: number;
}

// Configuración de las líneas del gráfico
const chartConfig = {
  value1: {
    label: "Value 1",
    color: "var(--chart-1)",
  },
  value2: {
    label: "Value 2",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface ChartLineInteractiveProps {
  data: GenericChartData[];
  axisLabel?: string;
  title?: string;
  description?: string;
}

export function ChartLineInteractive({
  data,
  axisLabel = "Axis",
  title = "Line Chart",
  description = "Comparing Value 1 and Value 2",
}: ChartLineInteractiveProps) {
  const total = React.useMemo(
    () => ({
      value1: data.reduce((acc, curr) => acc + curr.value1, 0),
      value2: data.reduce((acc, curr) => acc + curr.value2, 0),
    }),
    [data]
  );

  return (
    <Card className="py-4 sm:py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="flex">
          {["value1", "value2"].map((key) => (
            <div
              key={key}
              className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
            >
              <span className="text-muted-foreground text-xs">
                {chartConfig[key as keyof typeof chartConfig].label}
              </span>
              <span className="text-lg leading-none font-bold sm:text-3xl">
                {total[key as keyof typeof total].toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={data}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="Axis"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              label={{ value: axisLabel, position: "insideBottom", offset: -5 }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => value}
                />
              }
            />
            <Line
              dataKey="value1"
              type="monotone"
              stroke={chartConfig.value1.color}
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="value2"
              type="monotone"
              stroke={chartConfig.value2.color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
