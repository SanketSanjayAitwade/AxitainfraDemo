import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, UserCheck, HardHat, Building, Gauge, AlertTriangle, ClipboardList } from "lucide-react";
import { StatCard } from "@/components/common/StatCard";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CompareBar, TrendLine } from "@/components/charts/Charts";
import { useDemo } from "@/store/DemoStore";
import { workPackages } from "@/data/seed";

export const Route = createFileRoute("/_app/labour/")({
  component: LabourOverview,
});

function LabourOverview() {
  const { attendance, contractors } = useDemo();
  const skilled = attendance.reduce((s, a) => s + a.skilled, 0);
  const unskilled = attendance.reduce((s, a) => s + a.unskilled, 0);
  const total = skilled + unskilled;
  const activeContractors = contractors.filter((c) => c.status === "Active").length;

  const deployment = workPackages.slice(0, 8).map((wp, i) => ({ label: wp, Workers: 40 + (i * 23) % 160 }));
  const trend = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((label, i) => ({ label, Skilled: 800 + i * 40, Unskilled: 1200 + i * 60 }));

  return (
    <div>
      <PageHeader title="Labour" description="Workforce attendance, contractor performance and productivity across all sites." crumbs={[{ label: "Home", to: "/dashboard" }, { label: "Labour" }]}
        actions={<Button asChild><Link to="/labour/attendance">Add Attendance</Link></Button>} />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Present Today" value={total.toLocaleString("en-IN")} icon={Users} tone="primary" trend={3} />
        <StatCard label="Skilled Labour" value={skilled.toLocaleString("en-IN")} icon={UserCheck} tone="success" />
        <StatCard label="Unskilled Labour" value={unskilled.toLocaleString("en-IN")} icon={HardHat} tone="info" />
        <StatCard label="Active Contractors" value={activeContractors} icon={Building} tone="primary" to="/labour/contractors" />
        <StatCard label="Avg Productivity" value="74%" icon={Gauge} tone="success" to="/labour/productivity" />
        <StatCard label="Shortage Alerts" value={3} icon={AlertTriangle} tone="danger" />
        <StatCard label="Attendance Pending" value={4} icon={ClipboardList} tone="warning" to="/labour/attendance" />
        <StatCard label="Overtime Hrs" value={186} icon={Gauge} tone="warning" />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card><CardHeader><CardTitle>Work Package Deployment</CardTitle><CardDescription>Workers by trade</CardDescription></CardHeader><CardContent><CompareBar data={deployment} keys={[{ key: "Workers", name: "Workers", color: "var(--chart-1)" }]} /></CardContent></Card>
        <Card><CardHeader><CardTitle>Weekly Labour Trend</CardTitle><CardDescription>Skilled vs unskilled</CardDescription></CardHeader><CardContent><TrendLine data={trend} keys={[{ key: "Skilled", name: "Skilled" }, { key: "Unskilled", name: "Unskilled", color: "var(--chart-3)" }]} /></CardContent></Card>
      </div>
    </div>
  );
}
