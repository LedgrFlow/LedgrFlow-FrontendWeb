import { TrendingDown, TrendingUp } from "lucide-react";
import { Pie, PieChart, Sector } from "recharts";

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { PieSectorDataItem } from "recharts/types/polar/Pie";

export const description = "A pie chart with a label";

const defaultChartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
];

const defaultChartConfig: ChartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Edge",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
};

interface ChartPieLabelProps {
  data?: any;
  config?: ChartConfig;
  title?: string;
  time?: string;
  descriptions?: string[];
  sub?: string;
  percentage?: number;
}

export function ChartPieLabel({
  data = defaultChartData,
  config = defaultChartConfig,
  title = "Browsers",
  time = "Last month",
  descriptions = [],
  sub = "",
  percentage = 0,
}: ChartPieLabelProps) {
  const description =
    percentage > 0 ? (
      <>
        {descriptions[0]} <TrendingUp className="h-4 w-4" />
      </>
    ) : percentage < 0 ? (
      <>
        {descriptions[1]} <TrendingDown className="h-4 w-4" />
      </>
    ) : (
      descriptions[2]
    );

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{time}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={config}
          className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
         

            <Pie
              data={data}
              dataKey="visitors"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={0}
              // activeShape={({
              //   outerRadius = 0,
              //   ...props
              // }: PieSectorDataItem) => (
              //   <Sector {...props} outerRadius={outerRadius + 10} />
              // )}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {description}
        </div>
        <div className="text-muted-foreground leading-none">{sub}</div>
      </CardFooter>
    </Card>
  );
}
