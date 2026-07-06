import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Building2, CheckCircle2, Clock, AlertTriangle, ListChecks, FileCheck,
  FileClock, Users, PackageX, ShieldAlert, IndianRupee, Boxes, ArrowRight,
} from "lucide-react";
import { StatCard } from "@/components/common/StatCard";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DonutChart, CompareBar, TrendLine, AreaTrend } from "@/components/charts/Charts";
import { useDemo } from "@/store/DemoStore";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/_app/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { projects, tasks, dprs, materials, materialRequests, approvals, activities } = useDemo();
  const navigate = useNavigate();

  const onTrack = projects.filter((p) => p.status === "On Track").length;
  const delayed = projects.filter((p) => p.status === "Delayed").length;
  const critical = projects.filter((p) => p.status === "Critical").length;
  const atRisk = projects.filter((p) => p.status === "At Risk").length;
  const completed = projects.filter((p) => p.status === "Completed").length;
  const activeTasks = tasks.filter((t) => t.status === "In Progress").length + 240;
  const dprToday = dprs.filter((d) => d.status !== "Draft").length + 5;
  const pendingDpr = dprs.filter((d) => d.status === "Submitted").length + projects.filter((p) => !p.dprSubmitted).length;
  const labourToday = projects.reduce((s, p) => s + p.labourStrength, 0);
  const reqPending = materialRequests.filter((m) => m.status === "Submitted").length;
  const shortages = materials.filter((m) => m.stock < m.minStock).length;
  const pendingApprovals = approvals.filter((a) => a.status === "Pending").length;
  const budgetTotal = projects.reduce((s, p) => s + p.budgetTotal, 0);
  const budgetSpent = projects.reduce((s, p) => s + p.budgetSpent, 0);
  const budgetUtil = Math.round((budgetSpent / budgetTotal) * 100);

  const healthData = [
    { name: "On Track", value: onTrack, color: "var(--chart-2)" },
    { name: "At Risk", value: atRisk, color: "var(--chart-3)" },
    { name: "Delayed", value: delayed, color: "oklch(0.7 0.13 55)" },
    { name: "Critical", value: critical, color: "var(--chart-4)" },
    { name: "Completed", value: completed, color: "var(--chart-1)" },
  ];

  const progressData = projects.slice(0, 8).map((p) => ({
    label: p.name.split(" ").slice(0, 2).join(" "), Planned: p.planned, Actual: p.progress,
  }));

  const labourTrend = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => ({
    label: d, Skilled: 1200 + i * 90 + (i % 2) * 60, Unskilled: 1800 + i * 120 - (i % 3) * 80,
  }));

  const consumption = ["W1", "W2", "W3", "W4", "W5", "W6"].map((d, i) => ({
    label: d, value: 1800 + i * 240 + (i % 2) * 300,
  }));

  const compliance = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => ({
    label: d, Submitted: 16 + (i % 4), Pending: 5 - (i % 3),
  }));

  const topDelayed = [...projects]
    .filter((p) => p.status !== "Completed")
    .sort((a, b) => b.delayDays - a.delayDays)
    .slice(0, 6);

  return (
    <div>
      <PageHeader
        title="Executive Dashboard"
        description="Real-time portfolio visibility across all 21 construction projects — schedule, cost, materials, labour and approvals."
      />

      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        <StatCard label="Total Projects" value={21} icon={Building2} tone="primary" sub="Across 14 cities" to="/projects" />
        <StatCard label="On Track" value={onTrack} icon={CheckCircle2} tone="success" trend={4} sub="of 21 projects" to="/projects" search={{ status: "On Track" }} />
        <StatCard label="Delayed" value={delayed} icon={Clock} tone="warning" trend={-2} sub="need attention" to="/projects" search={{ status: "Delayed" }} />
        <StatCard label="Critical" value={critical} icon={AlertTriangle} tone="danger" sub="escalated" to="/projects" search={{ status: "Critical" }} />
        <StatCard label="Active Tasks" value={activeTasks} icon={ListChecks} tone="info" sub="in progress" to="/tasks" />
        <StatCard label="DPR Submitted Today" value={dprToday} icon={FileCheck} tone="success" to="/dpr" />
        <StatCard label="Pending DPRs" value={pendingDpr} icon={FileClock} tone="warning" sub="awaiting submission" to="/dpr" />
        <StatCard label="Labour Present Today" value={labourToday.toLocaleString("en-IN")} icon={Users} tone="info" trend={3} to="/labour" />
        <StatCard label="Material Requests Pending" value={reqPending} icon={Boxes} tone="warning" to="/materials/requests" />
        <StatCard label="Stock Shortage Alerts" value={shortages} icon={PackageX} tone="danger" sub="below minimum" to="/materials/inventory" />
        <StatCard label="Pending Approvals" value={pendingApprovals} icon={ShieldAlert} tone="warning" to="/approvals" />
        <StatCard label="Budget Utilization" value={`${budgetUtil}%`} icon={IndianRupee} tone="primary" sub={`${inr(budgetSpent)} of ${inr(budgetTotal)}`} />
      </div>

      {/* Charts row 1 */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Project Health Distribution</CardTitle><CardDescription>21 projects by status</CardDescription></CardHeader>
          <CardContent><DonutChart data={healthData} /></CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Progress vs Planned</CardTitle><CardDescription>Actual completion against baseline schedule</CardDescription></CardHeader>
          <CardContent><CompareBar data={progressData} keys={[{ key: "Planned", name: "Planned %", color: "var(--chart-3)" }, { key: "Actual", name: "Actual %", color: "var(--chart-1)" }]} /></CardContent>
        </Card>
      </div>

      {/* Charts row 2 */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Labour Deployment Trend</CardTitle><CardDescription>Daily workforce this week</CardDescription></CardHeader>
          <CardContent><TrendLine data={labourTrend} keys={[{ key: "Skilled", name: "Skilled" }, { key: "Unskilled", name: "Unskilled", color: "var(--chart-3)" }]} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Material Consumption</CardTitle><CardDescription>Weekly value (₹ '000)</CardDescription></CardHeader>
          <CardContent><AreaTrend data={consumption} dataKey="value" name="Consumption ₹'000" /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>DPR Compliance</CardTitle><CardDescription>Submitted vs pending</CardDescription></CardHeader>
          <CardContent><CompareBar height={260} data={compliance} keys={[{ key: "Submitted", name: "Submitted", color: "var(--chart-2)" }, { key: "Pending", name: "Pending", color: "var(--chart-4)" }]} /></CardContent>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <div><CardTitle>Top Delayed Projects</CardTitle><CardDescription>Sorted by schedule slippage</CardDescription></div>
            <Link to="/projects" search={{ status: "Delayed" }} className="text-sm font-medium text-primary hover:underline">View all</Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-y bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-2.5 font-medium">Project</th>
                    <th className="px-3 py-2.5 font-medium">Status</th>
                    <th className="px-3 py-2.5 font-medium">Delay</th>
                    <th className="px-3 py-2.5 font-medium min-w-[140px]">Progress</th>
                    <th className="px-3 py-2.5 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {topDelayed.map((p) => (
                    <tr key={p.id} className="border-b last:border-0 hover:bg-accent/40 cursor-pointer" onClick={() => navigate({ to: "/projects/$id", params: { id: p.id } })}>
                      <td className="px-5 py-3">
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-muted-foreground">{p.location}</div>
                      </td>
                      <td className="px-3 py-3"><StatusBadge status={p.status} /></td>
                      <td className="px-3 py-3 font-medium text-danger">{p.delayDays}d</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <Progress value={p.progress} className="h-1.5 w-24" />
                          <span className="text-xs tabular-nums text-muted-foreground">{p.progress}%</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right"><ArrowRight className="h-4 w-4 text-muted-foreground" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recent Activity</CardTitle><CardDescription>Live operations feed</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            {activities.slice(0, 7).map((a) => (
              <div key={a.id} className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <div className="min-w-0">
                  <p className="text-sm leading-snug">{a.text}</p>
                  <p className="text-xs text-muted-foreground">{a.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
