import { createFileRoute } from "@tanstack/react-router";
import {
  Users,
  UserCheck,
  UserX,
  CalendarOff,
  Clock,
  Wallet,
  MapPin,
  ArrowRight,
  Navigation,
} from "lucide-react";
import { StatCard } from "@/components/common/StatCard";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DonutChart } from "@/components/charts/Charts";
import { useHr } from "@/store/HrStore";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/_app/hr/")({
  component: HrDashboard,
});

function Row({ label, value, tone }: { label: string; value: string | number; tone?: string }) {
  return (
    <div className="flex items-center justify-between py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-semibold tabular-nums ${tone ?? ""}`}>{value}</span>
    </div>
  );
}

function HrDashboard() {
  const { summary: s, leaveRequests, locations } = useHr();

  const attendanceDonut = [
    { name: "Present", value: s.presentToday, color: "var(--chart-2)" },
    { name: "Late", value: s.lateToday, color: "oklch(0.7 0.13 55)" },
    { name: "On Leave", value: s.onLeaveToday, color: "var(--chart-1)" },
    { name: "Absent", value: s.absentToday, color: "var(--chart-4)" },
    { name: "Not Checked In", value: s.notCheckedIn, color: "var(--chart-5)" },
  ];

  const upcomingLeaves = leaveRequests.filter((l) => l.status === "Approved").slice(0, 4);
  const attentionLoc = locations
    .filter((l) =>
      ["Outside Geo-fence", "Offline", "Battery Low", "No Location Permission"].includes(l.status),
    )
    .slice(0, 4);

  return (
    <div>
      <PageHeader
        title="HR Dashboard"
        description="Today's attendance, leave, payroll status and live employee activity in one screen."
        crumbs={[{ label: "HR & Employee Tracking" }, { label: "Dashboard" }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        <StatCard
          label="Employees"
          value={s.totalEmployees}
          icon={Users}
          tone="primary"
          sub="active employees"
        />
        <StatCard
          label="Present Today"
          value={s.presentToday}
          icon={UserCheck}
          tone="success"
          trend={3}
          sub="clocked in"
          to="/hr/attendance"
        />
        <StatCard
          label="Absent Today"
          value={s.absentToday}
          icon={UserX}
          tone="danger"
          sub="not present"
          to="/hr/attendance"
        />
        <StatCard
          label="On Leave"
          value={s.onLeaveToday}
          icon={CalendarOff}
          tone="info"
          sub="approved today"
          to="/hr/leave"
        />
        <StatCard
          label="Late Check-ins"
          value={s.lateToday}
          icon={Clock}
          tone="warning"
          sub="after shift time"
          to="/hr/attendance"
        />
        <StatCard
          label="Payroll Pending"
          value={s.payrollPending}
          icon={Wallet}
          tone="warning"
          sub="to finalize"
          to="/hr/payroll"
        />
        <StatCard
          label="Live Tracking Active"
          value={s.trackingActive}
          icon={Navigation}
          tone="info"
          sub="trackable now"
          to="/hr/tracking"
        />
        <StatCard
          label="Not Checked In"
          value={s.notCheckedIn}
          icon={MapPin}
          tone="neutral"
          sub="no punch yet"
          to="/hr/attendance"
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Today's Attendance Summary</CardTitle>
            <CardDescription>Live headcount by status</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart data={attendanceDonut} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Live Employee Map Summary</CardTitle>
              <CardDescription>Field staff visibility</CardDescription>
            </div>
            <a href="/hr/tracking" className="text-sm font-medium text-primary hover:underline">
              Open
            </a>
          </CardHeader>
          <CardContent>
            <Row label="Employees on site" value={s.onSite} tone="text-success" />
            <Row label="Travelling" value={s.travelling} tone="text-info" />
            <Row label="Outside assigned location" value={s.outsideZone} tone="text-danger" />
            <Row
              label="Tracking inactive"
              value={s.trackingInactive}
              tone="text-muted-foreground"
            />
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> Last location update {s.lastLocationUpdate} ·
              updates every 15 min
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Payroll Snapshot</CardTitle>
              <CardDescription>{s.payrollMonth}</CardDescription>
            </div>
            <StatusBadge status={s.payrollStatus} />
          </CardHeader>
          <CardContent>
            <Row
              label="Processed employees"
              value={`${s.payrollProcessed} / ${s.totalEmployees}`}
              tone="text-success"
            />
            <Row
              label="Pending employees"
              value={s.payrollPending}
              tone="text-warning-foreground"
            />
            <Row label="Deductions" value={inr(s.payrollDeductions)} tone="text-danger" />
            <Row label="Net payable" value={inr(s.payrollNet)} tone="text-foreground" />
            <div className="mt-2">
              <Progress
                value={Math.round((s.payrollProcessed / s.totalEmployees) * 100)}
                className="h-2 [&>div]:bg-success"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Needs Attention — Live Tracking</CardTitle>
              <CardDescription>Employees outside zone or with tracking issues</CardDescription>
            </div>
            <a href="/hr/tracking" className="text-sm font-medium text-primary hover:underline">
              View all
            </a>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-y bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-2.5 font-medium">Employee</th>
                    <th className="px-3 py-2.5 font-medium">Status</th>
                    <th className="px-3 py-2.5 font-medium">Last update</th>
                    <th className="px-3 py-2.5 font-medium">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {attentionLoc.map((l) => (
                    <tr key={l.employeeId} className="border-b last:border-0 hover:bg-accent/40">
                      <td className="px-5 py-3 font-medium">{l.employee}</td>
                      <td className="px-3 py-3">
                        <StatusBadge status={l.status} />
                      </td>
                      <td className="px-3 py-3 text-muted-foreground">{l.lastUpdate}</td>
                      <td className="px-3 py-3 text-muted-foreground">{l.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leave Snapshot</CardTitle>
            <CardDescription>This week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border p-3">
                <div className="text-2xl font-bold tabular-nums text-warning-foreground">
                  {s.leavePending}
                </div>
                <div className="text-xs text-muted-foreground">Pending requests</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-2xl font-bold tabular-nums text-success">
                  {s.leaveApprovedWeek}
                </div>
                <div className="text-xs text-muted-foreground">Approved this week</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-2xl font-bold tabular-nums text-danger">{s.leaveRejected}</div>
                <div className="text-xs text-muted-foreground">Rejected</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-2xl font-bold tabular-nums text-info">{s.leaveUpcoming}</div>
                <div className="text-xs text-muted-foreground">Upcoming leaves</div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Upcoming approved
              </div>
              {upcomingLeaves.map((l) => (
                <div key={l.id} className="flex items-center justify-between text-sm">
                  <span>{l.employee}</span>
                  <span className="text-xs text-muted-foreground">
                    {l.from} · {l.type}
                  </span>
                </div>
              ))}
            </div>
            <a
              href="/hr/leave"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Manage leave <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
