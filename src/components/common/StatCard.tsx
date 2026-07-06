import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "primary" | "success" | "warning" | "danger" | "info" | "neutral";
  sub?: string;
  trend?: number;
  to?: string;
  search?: Record<string, string>;
  onClick?: () => void;
}

const tones: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning-foreground",
  danger: "bg-danger-soft text-danger",
  info: "bg-info-soft text-info",
  neutral: "bg-neutral-soft text-muted-foreground",
};

export function StatCard({ label, value, icon: Icon, tone = "neutral", sub, trend, to, search, onClick }: StatCardProps) {
  const body = (
    <Card
      className={cn(
        "group h-full gap-0 p-5 transition-all",
        (to || onClick) && "cursor-pointer hover:-translate-y-0.5 hover:shadow-md hover:border-primary/30",
      )}
    >
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg", tones[tone])}>
          <Icon className="h-4.5 w-4.5" strokeWidth={2} />
        </span>
      </div>
      <div className="mt-3 text-3xl font-bold tracking-tight tabular-nums">{value}</div>
      {(sub || trend !== undefined) && (
        <div className="mt-1.5 flex items-center gap-1.5 text-xs">
          {trend !== undefined && (
            <span className={cn("inline-flex items-center gap-0.5 font-medium", trend >= 0 ? "text-success" : "text-danger")}>
              {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(trend)}%
            </span>
          )}
          {sub && <span className="text-muted-foreground">{sub}</span>}
        </div>
      )}
    </Card>
  );
  if (to) return <Link to={to} search={search as never}>{body}</Link>;
  if (onClick) return <button onClick={onClick} className="text-left w-full">{body}</button>;
  return body;
}
