import { TrendingDown, TrendingUp } from "lucide-react";
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
import type { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import dayjs from "dayjs";
import type { DailyInOut } from "@/types/backend/ledger-back.types";

export const description = "A multiple line chart";

const defaultChartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const defaultChartConfig: ChartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
};

interface ChartLineData {
  date: string;
  income: number;
  expenses: number;
}

interface ChartLineMultipleProps {
  data?: ChartLineData[] | typeof defaultChartData | DailyInOut[];
  config?: ChartConfig;
  axis?: string;
  labelDate?: string;
  trend?: number;
  title?: string;
  trendMessages?: {
    up: string;
    down: string;
    same: string;
  };

  timeSleep?: string;
}

export function ChartLineMultiple({
  data = defaultChartData,
  config = defaultChartConfig,
  trend = 0,
  axis = "month",
  labelDate = "January - June 2024",
  title = "Line Chart - Multiple",
  trendMessages = {
    up: "Trending up by 5.2% this month",
    down: "Trending down by 5.2% this month",
    same: "No significant changes this month",
  },
  timeSleep = "Showing total visitors for the last 6 months",
}: ChartLineMultipleProps) {
  const trendMessage =
    trend > 0 ? (
      <>
        {trendMessages.up}
        <TrendingUp className="h-4 w-4" />
      </>
    ) : trend < 0 ? (
      <>
        {trendMessages.down} <TrendingDown className="h-4 w-4" />
      </>
    ) : (
      <>{trendMessages.same}</>
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{labelDate}</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ChartContainer config={config}>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey={axis}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => dayjs(value).format("DD-MM-YYYY")}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                {Object.keys(config).map((key) => (
                  <Line
                    key={key}
                    dataKey={key}
                    type="monotone"
                    stroke={config[key].color}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              {trendMessage}
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              {timeSleep}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
