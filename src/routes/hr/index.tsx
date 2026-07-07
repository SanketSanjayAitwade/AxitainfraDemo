import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarRange,
  Clock3,
  Users,
  Wallet,
  MapPinned,
  BriefcaseBusiness,
  DoorOpen,
  ChartColumnBig,
  UserRound,
  LocateFixed,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { HrTrackingMap } from "@/components/hr/HrTrackingMap";
import { hrEmployees, hrLeaves, hrPayroll, hrRecruitment, hrOnboarding } from "@/data/hr";

export const Route = createFileRoute("/hr/")({
  component: HrOverview,
});

function HrOverview() {
  const total = hrEmployees.length;
  const onSite = hrEmployees.filter((e) => e.status === "On site").length;
  const atOffice = hrEmployees.filter((e) => e.status === "At office").length;
  const inTransit = hrEmployees.filter((e) => e.status === "In transit").length;
  const onLeave = hrEmployees.filter((e) => e.status === "On leave").length;
  const avgAttendance = Math.round(
    hrEmployees.reduce((sum, e) => sum + e.attendanceRate, 0) / hrEmployees.length,
  );
  const pendingLeaves = hrLeaves.filter((leave) => leave.status === "Pending").length;
  const payrollReady = hrPayroll.filter((row) => row.status !== "Paid").length;
  const activeRoles = hrRecruitment.reduce((sum, role) => sum + role.openings, 0);
  const onboardingDone = hrOnboarding.filter((task) => task.status === "Completed").length;

  return (
    <div>
      <PageHeader
        title="HR Overview"
        description="Mock people operations workspace with employee tracking, attendance, leave, payroll, recruitment, onboarding, and reporting."
        crumbs={[{ label: "HR" }]}
        actions={
          <Button asChild>
            <Link to="/hr/tracking">
              Open tracking
              <LocateFixed className="h-4 w-4" />
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="Employees" value={total} icon={Users} tone="primary" to="/hr/employees" />
        <StatCard
          label="On site"
          value={onSite}
          icon={MapPinned}
          tone="success"
          sub="real-time points"
          to="/hr/tracking"
        />
        <StatCard
          label="Attendance"
          value={`${avgAttendance}%`}
          icon={Clock3}
          tone="info"
          sub="weekly average"
          to="/hr/attendance"
        />
        <StatCard
          label="Leave Pending"
          value={pendingLeaves}
          icon={CalendarRange}
          tone="warning"
          to="/hr/leave"
        />
        <StatCard
          label="Payroll Open"
          value={payrollReady}
          icon={Wallet}
          tone="primary"
          to="/hr/payroll"
        />
        <StatCard
          label="Open Roles"
          value={activeRoles}
          icon={BriefcaseBusiness}
          tone="success"
          to="/hr/recruitment"
        />
        <StatCard
          label="Onboarding"
          value={onboardingDone}
          icon={DoorOpen}
          tone="info"
          to="/hr/onboarding"
        />
        <StatCard
          label="Reports"
          value="Live"
          icon={ChartColumnBig}
          tone="neutral"
          to="/hr/reports"
        />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.5fr_0.85fr]">
        <Card className="overflow-hidden">
          <CardHeader className="space-y-1">
            <CardTitle>Employee Tracking Map</CardTitle>
            <CardDescription>
              Mock location points for field and office employees across active sites.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <HrTrackingMap employees={hrEmployees.slice(0, 8)} />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today snapshot</CardTitle>
              <CardDescription>Attendance and work-state summary.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "At office", value: atOffice, total: total, tone: "bg-emerald-500" },
                { label: "On site", value: onSite, total: total, tone: "bg-sky-500" },
                { label: "In transit", value: inTransit, total: total, tone: "bg-amber-500" },
                { label: "On leave", value: onLeave, total: total, tone: "bg-violet-500" },
              ].map((row) => (
                <div key={row.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium">
                      <span className={`h-2.5 w-2.5 rounded-full ${row.tone}`} />
                      {row.label}
                    </span>
                    <span className="text-muted-foreground">
                      {row.value}/{row.total}
                    </span>
                  </div>
                  <Progress
                    value={Math.round((row.value / row.total) * 100)}
                    className="mt-2 h-2"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent HR actions</CardTitle>
              <CardDescription>Mock activities from the last few days.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {hrLeaves.slice(0, 3).map((leave) => (
                <div key={leave.id} className="rounded-xl border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold">{leave.employee}</div>
                      <div className="text-xs text-muted-foreground">
                        {leave.type} - {leave.days} day(s)
                      </div>
                    </div>
                    <Badge
                      variant={
                        leave.status === "Pending"
                          ? "outline"
                          : leave.status === "Approved"
                            ? "default"
                            : "destructive"
                      }
                    >
                      {leave.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Employees by department</CardTitle>
            <CardDescription>Mock roster distribution.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              "Human Resources",
              "Talent",
              "Payroll",
              "Operations",
              "Onboarding",
              "Reports",
              "Employee Tracking",
            ].map((dept, i) => {
              const count = hrEmployees.filter((e) => e.department === dept).length;
              return (
                <div key={dept}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span>{dept}</span>
                    <span className="tabular-nums text-muted-foreground">{count}</span>
                  </div>
                  <Progress value={Math.max(8, count * 18 + i * 2)} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payroll status</CardTitle>
            <CardDescription>Mock monthly batch summary.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {hrPayroll.slice(0, 4).map((row) => (
              <div key={row.id} className="flex items-center justify-between rounded-xl border p-3">
                <div>
                  <div className="text-sm font-semibold">{row.employee}</div>
                  <div className="text-xs text-muted-foreground">{row.department}</div>
                </div>
                <Badge
                  variant={
                    row.status === "Paid"
                      ? "default"
                      : row.status === "Ready"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {row.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recruitment pipeline</CardTitle>
            <CardDescription>Open roles and next steps.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {hrRecruitment.slice(0, 4).map((role) => (
              <div key={role.id} className="rounded-xl border p-3">
                <div className="text-sm font-semibold">{role.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {role.location} - {role.openings} opening(s)
                </div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span>{role.applicants} applicants</span>
                  <span>{role.shortlists} shortlists</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
