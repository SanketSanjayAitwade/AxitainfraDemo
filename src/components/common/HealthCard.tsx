import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "./StatusBadge";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

const level = (s: number) => (s >= 80 ? "Good" : s >= 65 ? "Fair" : s >= 50 ? "At Risk" : "Critical");
const barColor = (s: number) =>
  s >= 80 ? "[&>div]:bg-success" : s >= 65 ? "[&>div]:bg-info" : s >= 50 ? "[&>div]:bg-warning" : "[&>div]:bg-danger";

export function HealthCard({ title, score, explanation, trend }: { title: string; score: number; explanation: string; trend: number }) {
  return (
    <Card className="gap-3 p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">{title}</span>
        <StatusBadge status={level(score)} />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold tabular-nums">{score}%</span>
        <span className={cn("inline-flex items-center gap-0.5 text-xs font-medium", trend >= 0 ? "text-success" : "text-danger")}>
          {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {Math.abs(trend)}% vs last week
        </span>
      </div>
      <Progress value={score} className={cn("h-2", barColor(score))} />
      <p className="text-xs leading-relaxed text-muted-foreground">{explanation}</p>
    </Card>
  );
}
