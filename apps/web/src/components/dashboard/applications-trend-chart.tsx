"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface TrendPoint {
  day: string;
  count: number;
}

interface ApplicationsTrendChartProps {
  data: TrendPoint[];
}

const chartConfig = {
  count: {
    label: "Applications",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig;

function buildSeries(data: TrendPoint[]): TrendPoint[] {
  const map = new Map(data.map((d) => [d.day, d.count]));
  const series: TrendPoint[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const day = d.toISOString().slice(0, 10);
    series.push({ day, count: map.get(day) ?? 0 });
  }
  return series;
}

function formatDay(day: string) {
  const d = new Date(`${day}T00:00:00`);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function ApplicationsTrendChart({ data }: ApplicationsTrendChartProps) {
  const series = buildSeries(data);

  return (
    <ChartContainer config={chartConfig} className="h-40 w-full">
      <LineChart data={series} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tickFormatter={(v, i) => (i % 6 === 0 ? formatDay(v) : "")}
          tick={{ fontSize: 10, fontFamily: "var(--font-mono)", fill: "var(--color-muted-foreground)" }}
          interval={0}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
          tick={{ fontSize: 10, fontFamily: "var(--font-mono)", fill: "var(--color-muted-foreground)" }}
          width={28}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(v) => formatDay(v as string)}
            />
          }
        />
        <Line
          type="monotone"
          dataKey="count"
          stroke="var(--color-primary)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 3 }}
        />
      </LineChart>
    </ChartContainer>
  );
}
