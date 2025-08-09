import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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

export interface ChartAreaGradientProps {
  data: Array<Record<string, string | number>>;
  config: ChartConfig;
  xKey: string;
  title?: string;
  description?: string;
  descriptions?: string[];
  percentage?: number;
  footerText?: string;
}

export function ChartAreaGradient({
  data,
  config,
  xKey,
  title = "Area Chart - Gradient",
  description = "Showing data overview",
  footerText = "January - June 2024",
  descriptions = [],
  percentage = 0,
}: ChartAreaGradientProps) {
  const newDescription =
    percentage > 0
      ? descriptions[0]
      : percentage < 0
      ? descriptions[1]
      : descriptions[2];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={xKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                new DateFormatter().formatDayMonthShort(value)
              }
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              {Object.entries(config).map(([key, { color }]) => (
                <linearGradient
                  key={key}
                  id={`fill${key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                </linearGradient>
              ))}
            </defs>
            {Object.keys(config).map((key) => (
              <Area
                key={key}
                dataKey={key}
                type="natural"
                fill={`url(#fill${key})`}
                fillOpacity={0.4}
                stroke={config[key].color}
                stackId="a"
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              {newDescription}
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              {footerText}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
