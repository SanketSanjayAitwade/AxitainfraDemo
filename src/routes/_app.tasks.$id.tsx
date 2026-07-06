import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { FileCheck2, Package, Users, MessageSquare } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/store/DemoStore";

export const Route = createFileRoute("/_app/tasks/$id")({
  component: TaskDetail,
  notFoundComponent: () => <div className="p-8 text-center text-muted-foreground">Task not found.</div>,
});

function TaskDetail() {
  const { id } = Route.useParams();
  const { tasks, projects, dprs } = useDemo();
  const t = tasks.find((x) => x.id === id);
  if (!t) throw notFound();
  const proj = projects.find((p) => p.id === t.projectId);
  const remaining = t.plannedQty - t.completedQty;
  const logs = dprs.filter((d) => d.taskId === t.id);

  const dailyLogs = [
    { date: "2026-07-03", qty: 120, labour: 12, note: "Good productivity" },
    { date: "2026-07-02", qty: 95, labour: 10, note: "Material arrived late" },
    { date: "2026-07-01", qty: 140, labour: 14, note: "On schedule" },
  ];

  return (
    <div>
      <PageHeader
        title={t.name.split(" — ")[0]}
        crumbs={[{ label: "Home", to: "/dashboard" }, { label: "Tasks", to: "/tasks" }, { label: t.id }]}
        actions={<Button asChild><Link to="/dpr"><FileCheck2 className="mr-1 h-4 w-4" /> Update DPR</Link></Button>}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-start justify-between">
            <div><CardTitle>Task Overview</CardTitle><p className="mt-1 text-sm text-muted-foreground">{proj?.name} · {t.scope}</p></div>
            <div className="flex gap-2"><StatusBadge status={t.priority} /><StatusBadge status={t.status} /></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-sm"><span className="text-muted-foreground">Progress</span><span className="font-medium tabular-nums">{t.progress}%</span></div>
              <Progress value={t.progress} className="h-2.5" />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label="Planned" value={`${t.plannedQty} ${t.uom}`} />
              <Stat label="Completed" value={`${t.completedQty} ${t.uom}`} />
              <Stat label="Remaining" value={`${remaining} ${t.uom}`} />
              <Stat label="Category" value={t.category} />
              <Stat label="Engineer" value={t.engineer} />
              <Stat label="Contractor" value={t.contractor} />
              <Stat label="Start" value={t.startDate} />
              <Stat label="Due" value={t.dueDate} />
            </div>
            {t.delayReason && <div className="rounded-lg border border-danger/30 bg-danger-soft p-3 text-sm text-danger"><strong>Delay reason:</strong> {t.delayReason}</div>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Resource Summary</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-lg bg-muted/40 p-3"><span className="flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" /> Labour used (cum.)</span><span className="font-semibold">312</span></div>
            <div className="flex items-center justify-between rounded-lg bg-muted/40 p-3"><span className="flex items-center gap-2"><Package className="h-4 w-4 text-muted-foreground" /> Material consumed</span><span className="font-semibold">₹4.2 L</span></div>
            <div className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">📷 Site photos placeholder<br />6 photos uploaded</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card><CardHeader><CardTitle className="text-base">Daily Progress Logs</CardTitle></CardHeader><CardContent className="space-y-2">
          {dailyLogs.map((l, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border p-3 text-sm">
              <div><div className="font-medium">{l.date}</div><div className="text-xs text-muted-foreground">{l.note}</div></div>
              <div className="text-right"><div className="font-semibold tabular-nums">{l.qty} {t.uom}</div><div className="text-xs text-muted-foreground">{l.labour} labour</div></div>
            </div>
          ))}
        </CardContent></Card>

        <Card><CardHeader><CardTitle className="text-base">DPR History</CardTitle></CardHeader><CardContent className="space-y-2">
          {(logs.length ? logs : dprs.slice(0, 3)).map((d) => (
            <div key={d.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
              <div><div className="font-medium">{d.id} · {d.date}</div><div className="text-xs text-muted-foreground">{d.engineer}</div></div>
              <StatusBadge status={d.status} />
            </div>
          ))}
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-muted/40 p-3 text-sm text-muted-foreground"><MessageSquare className="h-4 w-4" /> 4 comments on this task</div>
        </CardContent></Card>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border bg-muted/30 p-3"><div className="text-xs text-muted-foreground">{label}</div><div className="mt-0.5 text-sm font-semibold">{value}</div></div>;
}
