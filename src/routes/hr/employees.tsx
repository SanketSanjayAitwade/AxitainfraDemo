import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Mail, MapPinned, Phone, Users } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { hrEmployees } from "@/data/hr";

export const Route = createFileRoute("/hr/employees")({
  component: EmployeesPage,
});

function EmployeesPage() {
  const active = hrEmployees.filter((employee) => employee.status !== "Offline").length;
  const onLeave = hrEmployees.filter((employee) => employee.status === "On leave").length;
  const avgPoints = Math.round(
    hrEmployees.reduce((sum, employee) => sum + employee.points, 0) / hrEmployees.length,
  );
  const fieldCount = hrEmployees.filter(
    (employee) => employee.status === "On site" || employee.status === "In transit",
  ).length;

  return (
    <div>
      <PageHeader
        title="Employees"
        description="Mock employee directory with role, department, attendance, and tracking information."
        crumbs={[{ label: "HR", to: "/hr" }, { label: "Employees" }]}
        actions={
          <Button asChild>
            <Link to="/hr/tracking">View tracking map</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="Total employees" value={hrEmployees.length} icon={Users} tone="primary" />
        <StatCard label="Active today" value={active} icon={Building2} tone="success" />
        <StatCard label="Field staff" value={fieldCount} icon={MapPinned} tone="info" />
        <StatCard label="On leave" value={onLeave} icon={Phone} tone="warning" />
        <StatCard label="Avg track points" value={avgPoints} icon={MapPinned} tone="primary" />
        <StatCard
          label="Office"
          value={hrEmployees.length - fieldCount}
          icon={Building2}
          tone="neutral"
        />
        <StatCard
          label="Attendance avg"
          value={`${Math.round(hrEmployees.reduce((sum, employee) => sum + employee.attendanceRate, 0) / hrEmployees.length)}%`}
          icon={Users}
          tone="success"
        />
        <StatCard label="Tracking enabled" value="Yes" icon={MapPinned} tone="info" />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.5fr_0.75fr]">
        <Card>
          <CardHeader>
            <CardTitle>Employee directory</CardTitle>
            <CardDescription>Mock roster with contact and site context.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-y bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-2.5 font-medium">Employee</th>
                    <th className="px-3 py-2.5 font-medium">Department</th>
                    <th className="px-3 py-2.5 font-medium">Site</th>
                    <th className="px-3 py-2.5 font-medium">Status</th>
                    <th className="px-3 py-2.5 font-medium">Attendance</th>
                    <th className="px-3 py-2.5 font-medium">Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {hrEmployees.map((employee) => (
                    <tr key={employee.id} className="border-b last:border-0 hover:bg-accent/40">
                      <td className="px-5 py-3">
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-xs text-muted-foreground">{employee.role}</div>
                      </td>
                      <td className="px-3 py-3">{employee.department}</td>
                      <td className="px-3 py-3">
                        <div>{employee.site}</div>
                        <div className="text-xs text-muted-foreground">{employee.city}</div>
                      </td>
                      <td className="px-3 py-3">
                        <Badge
                          variant={
                            employee.status === "On leave"
                              ? "outline"
                              : employee.status === "Offline"
                                ? "secondary"
                                : "default"
                          }
                        >
                          {employee.status}
                        </Badge>
                      </td>
                      <td className="px-3 py-3 tabular-nums">{employee.attendanceRate}%</td>
                      <td className="px-3 py-3">
                        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5" />
                            {employee.phone}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5" />
                            {employee.email}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top track points</CardTitle>
              <CardDescription>Employees with the highest live activity score.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[...hrEmployees]
                .sort((a, b) => b.points - a.points)
                .slice(0, 5)
                .map((employee) => (
                  <div key={employee.id} className="rounded-xl border p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold">{employee.name}</div>
                        <div className="text-xs text-muted-foreground">{employee.currentTask}</div>
                      </div>
                      <span className="text-sm font-semibold tabular-nums">{employee.points}</span>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Department mix</CardTitle>
              <CardDescription>Roster split across HR functions.</CardDescription>
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
              ].map((dept) => {
                const count = hrEmployees.filter((employee) => employee.department === dept).length;
                return (
                  <div key={dept}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span>{dept}</span>
                      <span className="text-muted-foreground">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-emerald-500"
                        style={{ width: `${Math.max(12, count * 18)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
