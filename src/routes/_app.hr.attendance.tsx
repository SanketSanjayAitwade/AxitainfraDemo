import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ScanFace,
  MapPin,
  Lock,
  Download,
  AlertTriangle,
  Smartphone,
  CheckCircle2,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { StatCard } from "@/components/common/StatCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { useHr } from "@/store/HrStore";
import { attendanceInsights } from "@/data/hr";
import { UserCheck, UserX, Clock } from "lucide-react";

export const Route = createFileRoute("/_app/hr/attendance")({
  component: AttendancePage,
});

function AttendancePage() {
  const { attendanceLogs, attendanceLocked, lockAttendance, employees, summary } = useHr();
  const [statusFilter, setStatusFilter] = useState("all");
  const [siteFilter, setSiteFilter] = useState("all");
  const [q, setQ] = useState("");
  const [clockOpen, setClockOpen] = useState(false);
  const [clockEmp, setClockEmp] = useState(employees[0].id);

  const sites = useMemo(
    () => Array.from(new Set(attendanceLogs.map((a) => a.location))).filter((s) => s !== "-"),
    [attendanceLogs],
  );

  const rows = attendanceLogs.filter(
    (a) =>
      (statusFilter === "all" || a.status === statusFilter) &&
      (siteFilter === "all" || a.location === siteFilter) &&
      (q === "" || a.employee.toLowerCase().includes(q.toLowerCase())),
  );

  const emp = employees.find((e) => e.id === clockEmp)!;

  const doClock = () => {
    toast.success("Attendance marked", {
      description: `${emp.name} clocked in · Face verified · GPS: ${emp.site} · ${new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`,
    });
    setClockOpen(false);
  };

  const lock = () => {
    lockAttendance();
    toast.success("Attendance locked for payroll", {
      description: "July 2026 attendance is now frozen for salary processing.",
    });
  };

  return (
    <div>
      <PageHeader
        title="Attendance"
        description="Employees mark attendance from mobile with face verification and GPS. HR reviews late, absent, overtime and missed punches."
        crumbs={[{ label: "HR & Employee Tracking", to: "/hr" }, { label: "Attendance" }]}
        actions={
          <>
            <Button
              variant="outline"
              onClick={() =>
                toast.success("Attendance exported", {
                  description: "attendance-2026-07-07.csv downloaded",
                })
              }
            >
              <Download className="mr-1 h-4 w-4" /> Export
            </Button>
            <Button
              variant={attendanceLocked ? "secondary" : "outline"}
              disabled={attendanceLocked}
              onClick={lock}
            >
              <Lock className="mr-1 h-4 w-4" /> {attendanceLocked ? "Locked" : "Lock for Payroll"}
            </Button>
            <Dialog open={clockOpen} onOpenChange={setClockOpen}>
              <DialogTrigger asChild>
                <Button>
                  <ScanFace className="mr-1 h-4 w-4" /> Clock In / Out
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Mobile Clock In / Out</DialogTitle>
                  <DialogDescription>
                    Face verification + GPS timestamp, exactly as captured on the employee mobile
                    app.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  <div>
                    <Label>Employee</Label>
                    <Select value={clockEmp} onValueChange={setClockEmp}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {employees.map((e) => (
                          <SelectItem key={e.id} value={e.id}>
                            {e.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-center rounded-xl border-2 border-dashed bg-muted/40 py-8">
                    <div className="text-center">
                      <ScanFace className="mx-auto h-12 w-12 text-primary" />
                      <div className="mt-2 text-sm font-medium">Face verification</div>
                      <div className="text-xs text-muted-foreground">
                        Look at the camera to verify identity
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1.5 rounded-lg bg-muted/50 px-3 py-2">
                      <MapPin className="h-3.5 w-3.5 text-success" /> GPS: {emp.site}
                    </div>
                    <div className="flex items-center gap-1.5 rounded-lg bg-muted/50 px-3 py-2">
                      <Smartphone className="h-3.5 w-3.5 text-info" /> Device: AX-MOB-{emp.code}
                    </div>
                    <div className="flex items-center gap-1.5 rounded-lg bg-muted/50 px-3 py-2">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" /> Shift: {emp.shift}
                    </div>
                    <div className="flex items-center gap-1.5 rounded-lg bg-muted/50 px-3 py-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-success" /> Inside geo-fence
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="ghost">Cancel</Button>
                  </DialogClose>
                  <Button onClick={doClock}>
                    <ScanFace className="mr-1 h-4 w-4" /> Verify & Mark
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          label="Present Today"
          value={summary.presentToday}
          icon={UserCheck}
          tone="success"
        />
        <StatCard label="Absent Today" value={summary.absentToday} icon={UserX} tone="danger" />
        <StatCard label="Late Check-ins" value={summary.lateToday} icon={Clock} tone="warning" />
        <StatCard
          label="Not Checked In"
          value={summary.notCheckedIn}
          icon={MapPin}
          tone="neutral"
        />
      </div>

      <Card className="mt-4 border-warning/30 bg-warning-soft/40 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-warning-foreground">
          <AlertTriangle className="h-4 w-4" /> Attendance Insights
        </div>
        <ul className="mt-2 grid gap-1.5 md:grid-cols-2">
          {attendanceInsights.map((t, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
              {t}
            </li>
          ))}
        </ul>
      </Card>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Input
          placeholder="Search employee..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-56"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {["Present", "Late", "Absent", "Half Day", "On Leave", "Overtime", "Missed Punch"].map(
              (s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
        <Select value={siteFilter} onValueChange={setSiteFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Site" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sites</SelectItem>
            {sites.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input type="date" defaultValue="2026-07-07" className="w-44" />
      </div>

      <Card className="mt-3 overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">Employee</th>
                <th className="px-3 py-3 font-medium">Shift</th>
                <th className="px-3 py-3 font-medium">Clock In</th>
                <th className="px-3 py-3 font-medium">Clock Out</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Location</th>
                <th className="px-3 py-3 font-medium">Work Hours</th>
                <th className="px-3 py-3 font-medium">Face</th>
                <th className="px-3 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id} className="border-b last:border-0 hover:bg-accent/40">
                  <td className="px-5 py-3 font-medium">{a.employee}</td>
                  <td className="px-3 py-3 text-muted-foreground">{a.shift}</td>
                  <td className="px-3 py-3 tabular-nums">{a.clockIn ?? "-"}</td>
                  <td className="px-3 py-3 tabular-nums">{a.clockOut ?? "-"}</td>
                  <td className="px-3 py-3">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="px-3 py-3">
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      {a.location !== "-" && (
                        <MapPin
                          className={`h-3.5 w-3.5 ${a.insideGeofence ? "text-success" : "text-danger"}`}
                        />
                      )}
                      {a.location}
                    </span>
                  </td>
                  <td className="px-3 py-3 tabular-nums">{a.workHours}</td>
                  <td className="px-3 py-3">
                    {a.faceVerified ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-right">
                    {a.status === "Missed Punch" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          toast.success("Missed punch approved", {
                            description: `Checkout corrected for ${a.employee}`,
                          })
                        }
                      >
                        Approve punch
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          toast.success("Attendance corrected", {
                            description: `${a.employee} record updated`,
                          })
                        }
                      >
                        Correct
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
