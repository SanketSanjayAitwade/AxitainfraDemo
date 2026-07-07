import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useHr } from "@/store/HrStore";
import { leaveTypesConfig } from "@/data/hr";

export const Route = createFileRoute("/_app/hr/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { shifts, geoFences } = useHr();
  const save = (what: string) =>
    toast.success("Settings saved", { description: `${what} updated.` });

  return (
    <div>
      <PageHeader
        title="HR Settings"
        description="Configure shifts, leave types, salary rules, geo-fences and attendance rules."
        crumbs={[{ label: "HR & Employee Tracking", to: "/hr" }, { label: "Settings" }]}
      />
      <Tabs defaultValue="shifts">
        <TabsList className="mb-4 flex-wrap">
          <TabsTrigger value="shifts">Shifts</TabsTrigger>
          <TabsTrigger value="leave">Leave Types</TabsTrigger>
          <TabsTrigger value="salary">Salary Rules</TabsTrigger>
          <TabsTrigger value="geo">Geo-fence Rules</TabsTrigger>
          <TabsTrigger value="attendance">Attendance Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="shifts">
          <Card className="overflow-hidden p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Shift</th>
                  <th className="px-3 py-3 font-medium">Start</th>
                  <th className="px-3 py-3 font-medium">End</th>
                  <th className="px-3 py-3 font-medium">Grace (min)</th>
                  <th className="px-3 py-3 font-medium">Weekly Off</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {shifts.map((s) => (
                  <tr key={s.id} className="border-b last:border-0 hover:bg-accent/40">
                    <td className="px-5 py-3 font-medium">{s.name}</td>
                    <td className="px-3 py-3 tabular-nums">{s.start}</td>
                    <td className="px-3 py-3 tabular-nums">{s.end}</td>
                    <td className="px-3 py-3 tabular-nums">{s.grace}</td>
                    <td className="px-3 py-3 text-muted-foreground">{s.weeklyOff}</td>
                    <td className="px-3 py-3">
                      <StatusBadge status={s.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="leave">
          <Card className="overflow-hidden p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Leave Type</th>
                  <th className="px-3 py-3 font-medium text-right">Annual Days</th>
                  <th className="px-3 py-3 font-medium">Carry Forward</th>
                  <th className="px-3 py-3 font-medium">Paid</th>
                </tr>
              </thead>
              <tbody>
                {leaveTypesConfig.map((l) => (
                  <tr key={l.type} className="border-b last:border-0 hover:bg-accent/40">
                    <td className="px-5 py-3 font-medium">{l.type}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{l.annual}</td>
                    <td className="px-3 py-3">
                      <StatusBadge status={l.carryForward ? "Active" : "Inactive"} />
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={l.paid ? "Approved" : "Rejected"} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="salary">
          <Card>
            <CardHeader>
              <CardTitle>Salary Rules</CardTitle>
              <CardDescription>How salary is calculated from attendance</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Working days per month</Label>
                <Input className="mt-1" defaultValue="26" />
              </div>
              <div>
                <Label>LOP calculation base</Label>
                <Input className="mt-1" defaultValue="Gross / 26" />
              </div>
              <div>
                <Label>Late deduction per instance (₹)</Label>
                <Input className="mt-1" defaultValue="500" />
              </div>
              <div>
                <Label>Overtime rate (₹ / hr)</Label>
                <Input className="mt-1" defaultValue="150" />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3 md:col-span-2">
                <div>
                  <div className="text-sm font-medium">Auto-deduct LOP for unpaid leave</div>
                  <div className="text-xs text-muted-foreground">
                    Unpaid & emergency-over-limit leaves reduce net pay
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="md:col-span-2">
                <Button onClick={() => save("Salary rules")}>Save Salary Rules</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geo">
          <Card className="overflow-hidden p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Geo-fence</th>
                  <th className="px-3 py-3 font-medium">Site</th>
                  <th className="px-3 py-3 font-medium text-right">Radius (m)</th>
                  <th className="px-3 py-3 font-medium text-right">Employees</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {geoFences.map((g) => (
                  <tr key={g.id} className="border-b last:border-0 hover:bg-accent/40">
                    <td className="px-5 py-3 font-medium">{g.name}</td>
                    <td className="px-3 py-3 text-muted-foreground">{g.site}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{g.radius}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{g.employees}</td>
                    <td className="px-3 py-3">
                      <StatusBadge status={g.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Rules</CardTitle>
              <CardDescription>Mobile clock-in policy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                [
                  "Require face verification",
                  "Employees must pass face recognition to clock in",
                  true,
                ],
                ["Require GPS location", "Capture GPS coordinates with every punch", true],
                [
                  "Enforce geo-fence on clock-in",
                  "Block clock-in outside the assigned site zone",
                  true,
                ],
                [
                  "Allow mobile clock-in only",
                  "Disable web-based attendance for field staff",
                  true,
                ],
                [
                  "Auto-mark absent if no punch by 11 AM",
                  "Flag employees who never clocked in",
                  false,
                ],
                [
                  "Track location every 15 minutes",
                  "Background location updates during work hours",
                  true,
                ],
              ].map(([t, d, on]) => (
                <div
                  key={t as string}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <div className="text-sm font-medium">{t}</div>
                    <div className="text-xs text-muted-foreground">{d}</div>
                  </div>
                  <Switch defaultChecked={on as boolean} />
                </div>
              ))}
              <Button onClick={() => save("Attendance rules")}>Save Attendance Rules</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
