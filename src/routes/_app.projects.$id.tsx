import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  MapPin, Building2, CalendarDays, User, ArrowRight, Package, Users, FileClock,
  AlertTriangle, Boxes, TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { HealthCard } from "@/components/common/HealthCard";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CompareBar, AreaTrend } from "@/components/charts/Charts";
import { useDemo } from "@/store/DemoStore";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/_app/projects/$id")({
  component: ProjectDetail,
  notFoundComponent: () => <div className="p-8 text-center text-muted-foreground">Project not found.</div>,
});

function ProjectDetail() {
  const { id } = Route.useParams();
  const { projects, tasks, dprs, attendance, activities } = useDemo();
  const p = projects.find((x) => x.id === id);
  if (!p) throw notFound();

  const projectTasks = tasks.filter((t) => t.projectId === id);
  const projectDprs = dprs.filter((d) => d.projectId === id);
  const projectAtt = attendance.filter((a) => a.projectId === id);
  const feed = activities.filter((a) => a.projectId === id);

  const timeline = ["Q1", "Q2", "Q3", "Q4"].map((q, i) => ({ label: q, Planned: 25 * (i + 1), Actual: Math.min(p.progress, Math.round(p.progress * (i + 1) / 4)) }));
  const movement = ["W1", "W2", "W3", "W4"].map((w, i) => ({ label: w, value: 200 + i * 90 }));

  const health = [
    { title: "Schedule Health", score: p.scheduleScore, trend: p.status === "On Track" ? 3 : -6, explanation: `Actual progress is ${Math.abs(p.planned - p.progress)}% ${p.progress >= p.planned ? "ahead of" : "behind"} planned progress${p.progress < p.planned ? " due to delayed waterproofing and material shortage" : ""}.` },
    { title: "Cost Health", score: p.costScore, trend: -2, explanation: `${inr(p.budgetSpent)} spent against ${inr(p.budgetTotal)} budget. Cost variance is ${((p.budgetSpent / p.budgetTotal) * 100 - p.progress).toFixed(0)}% at current progress.` },
    { title: "Material Health", score: p.scheduleScore - 4, trend: 1, explanation: `${p.materialShortages} material shortage${p.materialShortages === 1 ? "" : "s"} flagged. Procurement cycle running within lead time.` },
    { title: "Labour Productivity", score: p.productivityScore, trend: 2, explanation: `${p.labourStrength} workers deployed today across active work packages, productivity index steady.` },
    { title: "DPR Compliance", score: p.dprScore, trend: p.dprSubmitted ? 4 : -8, explanation: `${projectDprs.length} DPRs logged. Daily reporting discipline ${p.dprScore > 80 ? "strong" : "needs improvement"}.` },
    { title: "Safety / Issues", score: p.safetyScore, trend: 1, explanation: `${p.openIssues} open site issues. No major safety incidents reported this week.` },
  ];

  return (
    <div>
      <PageHeader
        title={p.name}
        crumbs={[{ label: "Home", to: "/dashboard" }, { label: "Projects", to: "/projects" }, { label: p.name }]}
        actions={<Button asChild><Link to="/matrix">Open Scope Matrix</Link></Button>}
      />

      {/* Overview header */}
      <Card className="mb-5">
        <CardContent className="grid gap-4 py-5 sm:grid-cols-2 lg:grid-cols-4">
          <Info icon={MapPin} label="Location" value={p.location} />
          <Info icon={Building2} label="Client" value={p.client} />
          <Info icon={User} label="Project Manager" value={p.manager} />
          <Info icon={CalendarDays} label="Timeline" value={`${p.startDate} → ${p.targetDate}`} />
          <div className="sm:col-span-2 lg:col-span-4">
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium">Overall Progress</span>
              <span className="tabular-nums">{p.progress}% actual · {p.planned}% planned · <StatusBadge status={p.status} className="ml-1" /></span>
            </div>
            <Progress value={p.progress} className="h-2.5" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4 flex-wrap h-auto">
          {["overview", "matrix", "tasks", "dpr", "materials", "labour", "reports", "activity"].map((t) => (
            <TabsTrigger key={t} value={t} className="capitalize">{t === "matrix" ? "Scope Matrix" : t}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="space-y-5">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            <MiniStat label="Active Tasks" value={p.activeTasks} icon={FileClock} />
            <MiniStat label="Labour Today" value={p.labourStrength} icon={Users} />
            <MiniStat label="Open Issues" value={p.openIssues} icon={AlertTriangle} />
            <MiniStat label="Shortages" value={p.materialShortages} icon={Package} />
            <MiniStat label="Approvals" value={p.pendingApprovals} icon={Boxes} />
            <MiniStat label="Delay" value={`${p.delayDays}d`} icon={TrendingUp} />
          </div>
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {health.map((h) => <HealthCard key={h.title} {...h} />)}
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card><CardHeader><CardTitle>Progress vs Planned</CardTitle><CardDescription>Quarter-wise S-curve</CardDescription></CardHeader><CardContent><CompareBar height={240} data={timeline} keys={[{ key: "Planned", name: "Planned", color: "var(--chart-3)" }, { key: "Actual", name: "Actual", color: "var(--chart-1)" }]} /></CardContent></Card>
            <Card><CardHeader><CardTitle>Material Movement</CardTitle><CardDescription>Weekly consumption value (₹'000)</CardDescription></CardHeader><CardContent><AreaTrend height={240} data={movement} dataKey="value" name="₹'000" color="var(--chart-2)" /></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="matrix">
          <Card><CardContent className="py-10 text-center">
            <p className="text-muted-foreground">Scope matrix breaks this project into Tower → Floor → Unit → Work Package → Task.</p>
            <Button asChild className="mt-4"><Link to="/matrix">Open Project Matrix <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="tasks">
          <SimpleTable head={["Task", "Scope", "Progress", "Status"]}>
            {projectTasks.map((t) => (
              <tr key={t.id} className="border-b last:border-0 hover:bg-accent/40">
                <td className="px-5 py-3"><Link to="/tasks/$id" params={{ id: t.id }} className="font-medium hover:text-primary">{t.name.split(" — ")[0]}</Link></td>
                <td className="px-3 py-3 text-muted-foreground">{t.scope}</td>
                <td className="px-3 py-3"><div className="flex items-center gap-2"><Progress value={t.progress} className="h-1.5 w-20" /><span className="text-xs tabular-nums">{t.progress}%</span></div></td>
                <td className="px-3 py-3"><StatusBadge status={t.status} /></td>
              </tr>
            ))}
          </SimpleTable>
        </TabsContent>

        <TabsContent value="dpr">
          <SimpleTable head={["DPR", "Task", "Qty", "Labour", "Status"]}>
            {projectDprs.map((d) => (
              <tr key={d.id} className="border-b last:border-0 hover:bg-accent/40">
                <td className="px-5 py-3 font-medium">{d.id}</td>
                <td className="px-3 py-3 text-muted-foreground">{d.taskName.split(" — ")[0]}</td>
                <td className="px-3 py-3 tabular-nums">{d.qtyCompleted} {d.uom}</td>
                <td className="px-3 py-3 tabular-nums">{d.labourCount}</td>
                <td className="px-3 py-3"><StatusBadge status={d.status} /></td>
              </tr>
            ))}
          </SimpleTable>
        </TabsContent>

        <TabsContent value="materials">
          <Card><CardContent className="py-10 text-center"><p className="text-muted-foreground">Material request → PO → GRN → inventory → consumption is managed centrally.</p><Button asChild className="mt-4"><Link to="/materials">Open Materials <ArrowRight className="ml-1 h-4 w-4" /></Link></Button></CardContent></Card>
        </TabsContent>

        <TabsContent value="labour">
          <SimpleTable head={["Date", "Contractor", "Trade", "Skilled", "Unskilled", "Location"]}>
            {projectAtt.map((a) => (
              <tr key={a.id} className="border-b last:border-0 hover:bg-accent/40">
                <td className="px-5 py-3">{a.date}</td>
                <td className="px-3 py-3 font-medium">{a.contractor}</td>
                <td className="px-3 py-3 text-muted-foreground">{a.trade}</td>
                <td className="px-3 py-3 tabular-nums">{a.skilled}</td>
                <td className="px-3 py-3 tabular-nums">{a.unskilled}</td>
                <td className="px-3 py-3 text-muted-foreground">{a.scope}</td>
              </tr>
            ))}
          </SimpleTable>
        </TabsContent>

        <TabsContent value="reports">
          <Card><CardContent className="py-10 text-center"><p className="text-muted-foreground">Generate project health, DPR, material and labour reports.</p><Button asChild className="mt-4"><Link to="/reports">Open Reports <ArrowRight className="ml-1 h-4 w-4" /></Link></Button></CardContent></Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card><CardContent className="space-y-3 py-5">
            {(feed.length ? feed : activities.slice(0, 6)).map((a) => (
              <div key={a.id} className="flex gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" /><div><p className="text-sm">{a.text}</p><p className="text-xs text-muted-foreground">{a.time}</p></div></div>
            ))}
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Info({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div><div className="text-xs text-muted-foreground">{label}</div><div className="text-sm font-medium">{value}</div></div>
    </div>
  );
}

function MiniStat({ label, value, icon: Icon }: { label: string; value: string | number; icon: typeof MapPin }) {
  return (
    <Card className="gap-1 p-4">
      <div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">{label}</span><Icon className="h-3.5 w-3.5 text-muted-foreground" /></div>
      <div className="text-2xl font-bold tabular-nums">{value}</div>
    </Card>
  );
}

function SimpleTable({ head, children }: { head: string[]; children: React.ReactNode }) {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">{head.map((h, i) => <th key={i} className={i === 0 ? "px-5 py-3 font-medium" : "px-3 py-3 font-medium"}>{h}</th>)}</tr></thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </Card>
  );
}
