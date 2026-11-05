import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "../ui/Card";
import { cn } from "../../lib/utils";
import type { Stat } from "../../types";

export function StatCard({ stat }: { stat: Stat }) {
  const Icon = stat.icon;
  const isUp = stat.trend === "up";

  return (
    <Card>
      <CardContent>
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-medium text-muted-foreground">
            {stat.label}
          </p>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="size-4" aria-hidden="true" />
          </span>
        </div>
        <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
          {stat.value}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 font-medium",
              isUp ? "text-success" : "text-danger",
            )}
          >
            {isUp ? (
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            ) : (
              <ArrowDownRight className="size-3.5" aria-hidden="true" />
            )}
            {stat.change > 0 ? "+" : ""}
            {stat.change}%
          </span>
          <span className="text-muted-foreground">{stat.period}</span>
        </div>
      </CardContent>
    </Card>
  );
}
