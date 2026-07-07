import { createFileRoute } from "@tanstack/react-router";
import { ChartColumnBig, TrendingUp, Users, CalendarRange, Wallet } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { hrAttendance, hrEmployees, hrLeaves, hrPayroll, hrWeekTrend } from "@/data/hr";

export const Route = createFileRoute("/hr/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  const averageAttendance = Math.round(
    hrEmployees.reduce((sum, employee) => sum + employee.attendanceRate, 0) / hrEmployees.length,
  );
  const leaveDays = hrLeaves.reduce((sum, leave) => sum + leave.days, 0);
  const payrollNet = hrPayroll.reduce((sum, row) => sum + row.net, 0);
  const presentToday = hrAttendance.filter((row) => row.status === "Present").length;

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Mock HR analytics and operational snapshots for workforce, leave, attendance, and payroll."
        crumbs={[{ label: "HR", to: "/hr" }, { label: "Reports" }]}
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          label="Avg attendance"
          value={`${averageAttendance}%`}
          icon={TrendingUp}
          tone="success"
        />
        <StatCard label="Present today" value={presentToday} icon={Users} tone="primary" />
        <StatCard label="Leave days" value={leaveDays} icon={CalendarRange} tone="warning" />
        <StatCard
          label="Net payroll"
          value={`₹${payrollNet.toLocaleString("en-IN")}`}
          icon={Wallet}
          tone="info"
        />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <CardHeader>
            <CardTitle>Workforce trend</CardTitle>
            <CardDescription>Weekly attendance percentages.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {hrWeekTrend.map((day) => (
              <div key={day.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium">{day.label}</span>
                  <span className="text-muted-foreground">{day.present}% present</span>
                </div>
                <div className="h-2.5 rounded-full bg-muted">
                  <div
                    className="h-2.5 rounded-full bg-emerald-500"
                    style={{ width: `${day.present}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Insight cards</CardTitle>
            <CardDescription>Quick readout for the HR dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              "Employee tracking is active across 6 mock sites.",
              "Leave queue contains 2 pending requests.",
              "Payroll has 2 records ready for payout.",
              "Recruitment pipeline has 8 total openings.",
              "Onboarding checklist is 67% complete.",
            ].map((item) => (
              <div key={item} className="rounded-xl border p-3 text-sm text-muted-foreground">
                {item}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Report pack</CardTitle>
          <CardDescription>Mock exports and modules included in the HR suite.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {["Attendance report", "Leave summary", "Payroll register", "Tracking digest"].map(
            (item) => (
              <div key={item} className="rounded-xl border p-3">
                <div className="text-sm font-semibold">{item}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Ready for export in the demo.
                </div>
              </div>
            ),
          )}
        </CardContent>
      </Card>
    </div>
  );
}
