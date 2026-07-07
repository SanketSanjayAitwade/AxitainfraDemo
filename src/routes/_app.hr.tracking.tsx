import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  MapPin,
  Battery,
  Wifi,
  Navigation,
  AlertTriangle,
  Clock,
  Shield,
  Radio,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { StatCard } from "@/components/common/StatCard";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useHr } from "@/store/HrStore";
import { cn } from "@/lib/utils";
import { locationHistory, trackingAlerts } from "@/data/hr";
import { GoogleMap, type MapMarker } from "@/components/common/GoogleMap";

export const Route = createFileRoute("/_app/hr/tracking")({
  component: TrackingPage,
});

const pinColor = (status: string) =>
  status === "Outside Geo-fence"
    ? "bg-danger"
    : status === "Travelling"
      ? "bg-info"
      : status === "On Site" || status === "Online"
        ? "bg-success"
        : status === "Battery Low"
          ? "bg-warning"
          : "bg-muted-foreground";

const pinHex = (status: string) =>
  status === "Outside Geo-fence"
    ? "#ef4444"
    : status === "Travelling"
      ? "#3b82f6"
      : status === "On Site" || status === "Online"
        ? "#22c55e"
        : status === "Battery Low"
          ? "#f59e0b"
          : "#6b7280";

function TrackingPage() {
  const { locations, summary, employees } = useHr();
  const [selectedId, setSelectedId] = useState(locations[0].employeeId);
  const sel = locations.find((l) => l.employeeId === selectedId)!;
  const selEmp = employees.find((e) => e.id === selectedId);

  const mapPins = locations.filter(
    (l) => l.status !== "Tracking Disabled" && l.status !== "No Location Permission",
  );

  const mapMarkers: MapMarker[] = mapPins.map((l) => ({
    id: l.employeeId,
    lat: l.lat,
    lng: l.lng,
    label: l.employee,
    sublabel: `${l.status} · ${l.location}`,
    color: pinHex(l.status),
    selected: selectedId === l.employeeId,
  }));

  return (
    <div>
      <PageHeader
        title="Live Tracking"
        description="Transparent work-hour tracking — live location, last update, route history and geo-fence status for field staff. Location updates every 15 minutes."
        crumbs={[{ label: "HR & Employee Tracking", to: "/hr" }, { label: "Live Tracking" }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="On Site" value={summary.onSite} icon={MapPin} tone="success" />
        <StatCard label="Travelling" value={summary.travelling} icon={Navigation} tone="info" />
        <StatCard
          label="Outside Zone"
          value={summary.outsideZone}
          icon={AlertTriangle}
          tone="danger"
        />
        <StatCard
          label="Tracking Inactive"
          value={summary.trackingInactive}
          icon={Radio}
          tone="neutral"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="overflow-hidden p-0">
          <div className="border-b p-4">
            <CardTitle className="text-base">Field Employees</CardTitle>
            <CardDescription className="mt-0.5">Tap to view location details</CardDescription>
          </div>
          <div className="max-h-[560px] overflow-y-auto">
            {locations.map((l) => (
              <button
                key={l.employeeId}
                onClick={() => setSelectedId(l.employeeId)}
                className={cn(
                  "flex w-full items-center gap-3 border-b px-4 py-3 text-left transition-colors last:border-0 hover:bg-accent/40",
                  selectedId === l.employeeId && "bg-primary/5",
                )}
              >
                <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", pinColor(l.status))} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{l.employee}</div>
                  <div className="truncate text-xs text-muted-foreground">{l.location}</div>
                </div>
                <div className="text-right">
                  <StatusBadge status={l.status} className="text-[10px]" />
                  <div className="mt-0.5 text-[10px] text-muted-foreground">{l.lastUpdate}</div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          <Card className="overflow-hidden p-0">
            <div className="relative h-[360px] w-full overflow-hidden">
              <GoogleMap
                className="h-full w-full"
                center={{ lat: 12.9716, lng: 77.5946 }}
                zoom={11}
                markers={mapMarkers}
                onMarkerClick={setSelectedId}
                geofences={[
                  { lat: 13.0358, lng: 77.597, radius: 260, color: "#22c55e" },
                  { lat: 12.9698, lng: 77.7499, radius: 320, color: "#22c55e" },
                  { lat: 12.8452, lng: 77.6602, radius: 220, color: "#22c55e" },
                ]}
              />
              <div className="pointer-events-none absolute bottom-2 right-2 flex items-center gap-1.5 rounded-md bg-background/90 px-2 py-1 text-[10px] text-muted-foreground shadow">
                <Clock className="h-3 w-3" /> Bengaluru · Updated {summary.lastLocationUpdate}
              </div>
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">{sel.employee}</CardTitle>
                  <CardDescription>{selEmp?.designation}</CardDescription>
                </div>
                <StatusBadge status={sel.status} />
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> Current
                  </span>
                  <span className="font-medium">{sel.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" /> Last update
                  </span>
                  <span>{sel.lastUpdate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Battery className="h-3.5 w-3.5" /> Battery
                  </span>
                  <span className={cn(sel.battery < 20 ? "text-danger" : "")}>{sel.battery}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Wifi className="h-3.5 w-3.5" /> Network
                  </span>
                  <span>{sel.network}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Shield className="h-3.5 w-3.5" /> Assigned site
                  </span>
                  <span>{sel.assignedSite}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Distance from site</span>
                  <span
                    className={cn(
                      sel.distanceFromSite !== "Inside zone"
                        ? "text-danger font-medium"
                        : "text-success",
                    )}
                  >
                    {sel.distanceFromSite}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Clock-in location</span>
                  <span>{sel.clockInLocation}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Location History</CardTitle>
                <CardDescription>Today's route timeline</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative space-y-4 pl-4">
                  <div className="absolute bottom-1 left-[5px] top-1 w-px bg-border" />
                  {locationHistory.map((e, i) => (
                    <div key={i} className="relative">
                      <span className="absolute -left-4 top-1 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background" />
                      <div className="text-sm font-medium">{e.event}</div>
                      <div className="text-xs text-muted-foreground">
                        {e.time} · {e.location}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Card className="mt-4 border-danger/30 bg-danger-soft/30 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-danger">
          <AlertTriangle className="h-4 w-4" /> Geo-fence & Tracking Alerts
        </div>
        <ul className="mt-2 grid gap-1.5 md:grid-cols-2">
          {trackingAlerts.map((t, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-danger" />
              {t}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
