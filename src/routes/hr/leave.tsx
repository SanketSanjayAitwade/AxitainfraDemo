import { createFileRoute } from "@tanstack/react-router";
import { CalendarRange, Clock3, CheckCircle2, XCircle } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { hrLeaves } from "@/data/hr";

export const Route = createFileRoute("/hr/leave")({
  component: LeavePage,
});

function LeavePage() {
  const pending = hrLeaves.filter((leave) => leave.status === "Pending").length;
  const approved = hrLeaves.filter((leave) => leave.status === "Approved").length;
  const rejected = hrLeaves.filter((leave) => leave.status === "Rejected").length;
  const totalDays = hrLeaves.reduce((sum, leave) => sum + leave.days, 0);

  return (
    <div>
      <PageHeader
        title="Leave"
        description="Mock leave requests, balance overview, and approval states."
        crumbs={[{ label: "HR", to: "/hr" }, { label: "Leave" }]}
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="Pending" value={pending} icon={Clock3} tone="warning" />
        <StatCard label="Approved" value={approved} icon={CheckCircle2} tone="success" />
        <StatCard label="Rejected" value={rejected} icon={XCircle} tone="danger" />
        <StatCard label="Total leave days" value={totalDays} icon={CalendarRange} tone="info" />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Leave balance by type</CardTitle>
            <CardDescription>Mock balances for the current cycle.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Annual leave", used: 12, total: 24 },
              { label: "Sick leave", used: 4, total: 12 },
              { label: "Casual leave", used: 6, total: 10 },
              { label: "Comp off", used: 2, total: 6 },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-muted-foreground">
                    {item.used}/{item.total}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-emerald-500"
                    style={{ width: `${Math.round((item.used / item.total) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leave requests</CardTitle>
            <CardDescription>All mock requests in the queue.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {hrLeaves.map((leave) => (
              <div key={leave.id} className="rounded-xl border p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">{leave.employee}</div>
                    <div className="text-xs text-muted-foreground">
                      {leave.department} - {leave.type}
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
                <div className="mt-2 text-xs text-muted-foreground">
                  {leave.from} to {leave.to} - {leave.days} day(s)
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{leave.reason}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
