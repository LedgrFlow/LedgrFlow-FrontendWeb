"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A bar chart";

// Valores por defecto
const defaultChartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

const defaultChartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type Props = {
  data?: typeof defaultChartData;
  config?: ChartConfig;
  title?: string;
  descriptions?: string[];
  axis?: string;
  range?: string;
  sub?: string;
  percentage?: number;
};

export function ChartBarDefault({
  data = defaultChartData,
  config = defaultChartConfig,
  title = "Bar Chart",
  range = "Last 6 months",
  descriptions = [],
  sub = "",
  percentage = 0,
  axis = "month",
}: Props) {
  const description =
    percentage > 0 ? (
      <>
        {descriptions[0]} <TrendingUp className="h-4 w-4" />
      </>
    ) : percentage < 0 ? (
      <>
        {descriptions[1]} <TrendingUp className="h-4 w-4" />
      </>
    ) : (
      descriptions[2]
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{range}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={axis}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.toString()}
            />
            {/* <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            /> */}
            <Bar dataKey="value" fill={config?.value?.color} radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">{description}</div>
        <div className="text-muted-foreground leading-none">{sub}</div>
      </CardFooter>
    </Card>
  );
}
