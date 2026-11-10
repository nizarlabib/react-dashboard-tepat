import { useState } from "react";
import { Download } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer } from "../../components/data-display/ChartContainer";
import { StatCard } from "../../components/data-display/StatCard";
import { Button } from "../../components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Select } from "../../components/ui/Select";
import { PageContainer } from "../../components/layout/PageContainer";
import { chartRangeOptions } from "../../constants/navigation";
import { chartAxisTick, chartGridStroke, chartTooltipStyle } from "../../lib/chart";
import { downloadCsv } from "../../lib/csv";
import { formatNumber } from "../../lib/utils";
import { useToast } from "../../contexts/toast";
import {
  analyticsStats,
  growthByRange,
  revenueByRange,
  trafficSources,
} from "../../mock/data";
import type { ChartRange } from "../../types";

export function AnalyticsPage() {
  const { toast } = useToast();
  const [range, setRange] = useState<ChartRange>("12m");

  const revenueData = revenueByRange[range];
  const growthData = growthByRange[range];
  const totalVisitors = trafficSources.reduce(
    (total, source) => total + source.visitors,
    0,
  );

  const exportData = () => {
    downloadCsv(
      `analytics-${range}.csv`,
      growthData.map((point) => ({
        Period: point.label,
        Users: point.users,
        Active: point.active,
      })),
    );

    toast({
      title: "Analytics exported",
      description: "User growth data has been downloaded as CSV.",
      variant: "success",
    });
  };

  return (
    <PageContainer
      title="Analytics"
      description="Track performance, growth, and acquisition trends."
      actions={
        <>
          <Select
            aria-label="Date range"
            options={chartRangeOptions}
            value={range}
            onChange={(event) => setRange(event.target.value as ChartRange)}
            containerClassName="w-40"
          />
          <Button
            variant="outline"
            leftIcon={<Download className="size-4" />}
            onClick={exportData}
          >
            Export
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <section
          aria-label="Performance statistics"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {analyticsStats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </section>

        <div className="grid gap-4 xl:grid-cols-2">
          <ChartContainer
            title="Revenue"
            description="Net revenue across the selected period"
          >
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueData}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="analyticsRevenueFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="var(--color-primary)"
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--color-primary)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    stroke={chartGridStroke}
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tick={chartAxisTick}
                    dy={8}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={chartAxisTick}
                    tickFormatter={(value) => `$${Number(value) / 1000}k`}
                    width={48}
                  />
                  <RechartsTooltip
                    contentStyle={chartTooltipStyle}
                    labelStyle={{ color: "var(--color-foreground)" }}
                    itemStyle={{ color: "var(--color-foreground)" }}
                    formatter={(value) =>
                      `$${Number(value).toLocaleString("en-US")}`
                    }
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    fill="url(#analyticsRevenueFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartContainer>

          <ChartContainer
            title="User growth"
            description="New signups compared with active users"
          >
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={growthData}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    vertical={false}
                    stroke={chartGridStroke}
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tick={chartAxisTick}
                    dy={8}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={chartAxisTick}
                    tickFormatter={(value) => formatNumber(Number(value))}
                    width={48}
                  />
                  <RechartsTooltip
                    contentStyle={chartTooltipStyle}
                    labelStyle={{ color: "var(--color-foreground)" }}
                    itemStyle={{ color: "var(--color-foreground)" }}
                    formatter={(value) => formatNumber(Number(value))}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    name="New users"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="active"
                    name="Active users"
                    stroke="var(--color-muted-foreground)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartContainer>
        </div>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Traffic sources</CardTitle>
              <CardDescription>
                Where your {formatNumber(totalVisitors)} visitors came from
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {trafficSources.map((source) => (
                <li key={source.source}>
                  <div className="flex items-center justify-between gap-4 text-xs">
                    <span className="font-medium text-foreground">
                      {source.source}
                    </span>
                    <span className="text-muted-foreground">
                      {formatNumber(source.visitors)} visitors ·{" "}
                      {source.share}%
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-subtle">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${source.share}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
