import { createFileRoute } from "@tanstack/react-router";
import { Clock3, CalendarDays, Users, UserRoundCheck } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { hrAttendance, hrWeekTrend } from "@/data/hr";

export const Route = createFileRoute("/hr/attendance")({
  component: AttendancePage,
});

function AttendancePage() {
  const present = hrAttendance.filter((row) => row.status === "Present").length;
  const late = hrAttendance.filter((row) => row.status === "Late").length;
  const halfDay = hrAttendance.filter((row) => row.status === "Half day").length;
  const absent = hrAttendance.filter((row) => row.status === "Absent").length;

  return (
    <div>
      <PageHeader
        title="Attendance"
        description="Mock attendance register with daily punch data and a weekly workforce trend."
        crumbs={[{ label: "HR", to: "/hr" }, { label: "Attendance" }]}
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="Present" value={present} icon={UserRoundCheck} tone="success" />
        <StatCard label="Late" value={late} icon={Clock3} tone="warning" />
        <StatCard label="Half day" value={halfDay} icon={CalendarDays} tone="info" />
        <StatCard label="Absent" value={absent} icon={Users} tone="danger" />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <CardHeader>
            <CardTitle>Weekly trend</CardTitle>
            <CardDescription>Presence snapshot over the last 6 days.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {hrWeekTrend.map((day) => (
              <div key={day.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium">{day.label}</span>
                  <span className="text-muted-foreground">{day.present}% present</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-emerald-500" style={{ width: `${day.present}%` }} />
                </div>
                <div className="mt-2 flex gap-2 text-[11px] text-muted-foreground">
                  <span>Late {day.late}%</span>
                  <span>Leave {day.leave}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily punch register</CardTitle>
            <CardDescription>Mock in-time and out-time records.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {hrAttendance.map((row) => (
              <div key={row.id} className="rounded-xl border p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">{row.employee}</div>
                    <div className="text-xs text-muted-foreground">
                      {row.department} - {row.site}
                    </div>
                  </div>
                  <Badge
                    variant={
                      row.status === "Present"
                        ? "default"
                        : row.status === "Late"
                          ? "secondary"
                          : row.status === "Half day"
                            ? "outline"
                            : "destructive"
                    }
                  >
                    {row.status}
                  </Badge>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                  <div>
                    <div>In</div>
                    <div className="font-medium text-foreground">{row.inTime}</div>
                  </div>
                  <div>
                    <div>Out</div>
                    <div className="font-medium text-foreground">{row.outTime}</div>
                  </div>
                  <div>
                    <div>Hours</div>
                    <div className="font-medium text-foreground">{row.hours}</div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
