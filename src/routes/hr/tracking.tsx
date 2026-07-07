import { createFileRoute } from "@tanstack/react-router";
import { LocateFixed, MapPinned, Navigation, Users } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HrTrackingMap } from "@/components/hr/HrTrackingMap";
import { hrEmployees } from "@/data/hr";

export const Route = createFileRoute("/hr/tracking")({
  component: TrackingPage,
});

function TrackingPage() {
  const onSite = hrEmployees.filter((employee) => employee.status === "On site").length;
  const inTransit = hrEmployees.filter((employee) => employee.status === "In transit").length;
  const office = hrEmployees.filter((employee) => employee.status === "At office").length;
  const offline = hrEmployees.filter((employee) => employee.status === "Offline").length;

  return (
    <div>
      <PageHeader
        title="Employee Tracking"
        description="Mock live points on a map-style surface, with site status and quick inspection of workforce presence."
        crumbs={[{ label: "HR", to: "/hr" }, { label: "Employee Tracking" }]}
        actions={
          <Badge variant="outline" className="gap-1.5">
            <LocateFixed className="h-3.5 w-3.5" /> Live demo mode
          </Badge>
        }
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="On site" value={onSite} icon={MapPinned} tone="success" />
        <StatCard label="In transit" value={inTransit} icon={Navigation} tone="warning" />
        <StatCard label="At office" value={office} icon={Users} tone="primary" />
        <StatCard label="Offline" value={offline} icon={LocateFixed} tone="neutral" />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.45fr_0.75fr]">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Live presence map</CardTitle>
            <CardDescription>
              Each point is a mock employee marker placed by site zone.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <HrTrackingMap employees={hrEmployees} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employee focus list</CardTitle>
            <CardDescription>Who is currently active and what they are doing.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[...hrEmployees]
              .sort((a, b) => b.points - a.points)
              .slice(0, 8)
              .map((employee) => (
                <div key={employee.id} className="rounded-xl border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold">{employee.name}</div>
                      <div className="text-xs text-muted-foreground">{employee.site}</div>
                    </div>
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
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">{employee.currentTask}</div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
