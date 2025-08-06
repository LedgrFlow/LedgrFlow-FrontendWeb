"use client";

import { TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DateFormatter } from "@/utils/date";

export const description = "A line chart with step";

interface ChartLineStepProps {
  title?: string;
  description?: string;
  data: any[];
  config: ChartConfig;
  dataKey?: string; // opcional, por si solo hay una línea
  height?: number | string; // permite personalizar la altura
}

export function ChartLineStep({
  title = "Line Chart - Step",
  description = "Chart Description",
  data,
  config,
  dataKey,
  height = 300,
}: ChartLineStepProps) {
  // Si no se especifica dataKey, intenta obtenerlo del primer key de config
  const resolvedKey = dataKey || (config ? Object.keys(config)[0] : undefined);
  const resolvedColor =
    resolvedKey && config?.[resolvedKey]?.color
      ? config[resolvedKey].color
      : "var(--chart-1)";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[150px] w-full">
          <ResponsiveContainer width="100%" height={height}>
            <LineChart
              accessibilityLayer
              data={data}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={8}
                tickFormatter={(value) =>
                  new DateFormatter().formatDayMonthShort(value)
                }
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              {resolvedKey && (
                <Line
                  dataKey={resolvedKey}
                  type="step"
                  stroke={resolvedColor}
                  strokeWidth={2}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
