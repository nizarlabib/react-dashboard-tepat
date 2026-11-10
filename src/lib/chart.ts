import type { CSSProperties } from "react";

export const chartTooltipStyle: CSSProperties = {
  backgroundColor: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: 10,
  fontSize: 12,
  boxShadow: "0 8px 20px rgba(15, 23, 42, 0.08)",
};

export const chartAxisTick = {
  fill: "var(--color-muted-foreground)",
  fontSize: 11,
};

export const chartGridStroke = "var(--color-border)";
