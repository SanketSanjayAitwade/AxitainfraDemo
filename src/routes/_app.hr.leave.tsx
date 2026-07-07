import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Check, X, CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { StatCard } from "@/components/common/StatCard";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
} from "@/components/ui/dialog";
import { useHr } from "@/store/HrStore";
import { cn } from "@/lib/utils";
import { CalendarOff, CalendarCheck, CalendarX, CalendarClock } from "lucide-react";

export const Route = createFileRoute("/_app/hr/leave")({
  component: LeavePage,
});

const leaveDays: Record<number, { name: string; status: "Approved" | "Pending" }[]> = {
  7: [{ name: "Rahul J.", status: "Approved" }],
  8: [{ name: "Suresh P.", status: "Pending" }],
  9: [
    { name: "Suresh P.", status: "Pending" },
    { name: "Arjun S.", status: "Pending" },
  ],
  10: [{ name: "Priya S.", status: "Approved" }],
  11: [{ name: "Deepak N.", status: "Approved" }],
  14: [{ name: "Kiran R.", status: "Pending" }],
  15: [{ name: "Kiran R.", status: "Pending" }],
  16: [{ name: "Kiran R.", status: "Pending" }],
  18: [{ name: "Neha I.", status: "Pending" }],
  21: [{ name: "Kavya N.", status: "Approved" }],
};

function LeavePage() {
  const { leaveRequests, leaveBalances, setLeaveStatus, employees, summary } = useHr();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("Casual Leave");
  const [emp, setEmp] = useState(employees[0].id);

  const decide = (id: string, name: string, status: "Approved" | "Rejected") => {
    setLeaveStatus(id, status);
    toast.success(`Leave ${status.toLowerCase()}`, {
      description: `${name}'s request has been ${status.toLowerCase()}.${status === "Approved" ? " Reflected in payroll." : ""}`,
    });
  };

  const apply = () => {
    toast.success("Leave applied", {
      description: `${employees.find((e) => e.id === emp)?.name} applied for ${type}. Sent to manager for approval.`,
    });
    setOpen(false);
  };

  const daysInMonth = 31;
  const firstDay = 2;

  return (
    <div>
      <PageHeader
        title="Leave Management"
        description="Employees apply leave from mobile. Managers approve or reject. Approved leave reflects directly in payroll."
        crumbs={[{ label: "HR & Employee Tracking", to: "/hr" }, { label: "Leave" }]}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-1 h-4 w-4" /> Apply Leave
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Apply for Leave</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Employee</Label>
                    <Select value={emp} onValueChange={setEmp}>
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
                  <div>
                    <Label>Leave type</Label>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "Casual Leave",
                          "Sick Leave",
                          "Paid Leave",
                          "Unpaid Leave",
                          "Emergency Leave",
                          "Comp Off",
                        ].map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>From</Label>
                    <Input type="date" className="mt-1" defaultValue="2026-07-08" />
                  </div>
                  <div>
                    <Label>To</Label>
                    <Input type="date" className="mt-1" defaultValue="2026-07-09" />
                  </div>
                </div>
                <div>
                  <Label>Reason</Label>
                  <Textarea className="mt-1" placeholder="Reason for leave..." />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost">Cancel</Button>
                </DialogClose>
                <Button onClick={apply}>Submit Request</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          label="Pending Requests"
          value={summary.leavePending}
          icon={CalendarClock}
          tone="warning"
        />
        <StatCard
          label="Approved This Week"
          value={summary.leaveApprovedWeek}
          icon={CalendarCheck}
          tone="success"
        />
        <StatCard label="Rejected" value={summary.leaveRejected} icon={CalendarX} tone="danger" />
        <StatCard
          label="Upcoming Leaves"
          value={summary.leaveUpcoming}
          icon={CalendarOff}
          tone="info"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="overflow-hidden p-0 lg:col-span-2">
          <div className="border-b p-4">
            <CardTitle className="text-base">Leave Requests</CardTitle>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Employee</th>
                  <th className="px-3 py-3 font-medium">Type</th>
                  <th className="px-3 py-3 font-medium">From</th>
                  <th className="px-3 py-3 font-medium">To</th>
                  <th className="px-3 py-3 font-medium">Days</th>
                  <th className="px-3 py-3 font-medium">Approver</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-3 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map((l) => (
                  <tr key={l.id} className="border-b last:border-0 hover:bg-accent/40">
                    <td className="px-5 py-3 font-medium">{l.employee}</td>
                    <td className="px-3 py-3 text-muted-foreground">{l.type}</td>
                    <td className="px-3 py-3 tabular-nums">{l.from}</td>
                    <td className="px-3 py-3 tabular-nums">{l.to}</td>
                    <td className="px-3 py-3 tabular-nums">{l.days}</td>
                    <td className="px-3 py-3 text-muted-foreground">{l.approver}</td>
                    <td className="px-3 py-3">
                      <StatusBadge status={l.status} />
                    </td>
                    <td className="px-3 py-3 text-right">
                      {l.status === "Pending" ? (
                        <div className="flex justify-end gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2"
                            onClick={() => decide(l.id, l.employee, "Approved")}
                          >
                            <Check className="h-3.5 w-3.5 text-success" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2"
                            onClick={() => decide(l.id, l.employee, "Rejected")}
                          >
                            <X className="h-3.5 w-3.5 text-danger" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leave Balance</CardTitle>
            <CardDescription>Ramesh Kumar · 2026</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-2.5 font-medium">Type</th>
                  <th className="px-3 py-2.5 font-medium text-right">Avail</th>
                  <th className="px-3 py-2.5 font-medium text-right">Used</th>
                  <th className="px-3 py-2.5 font-medium text-right">Bal</th>
                </tr>
              </thead>
              <tbody>
                {leaveBalances.map((b) => (
                  <tr key={b.type} className="border-b last:border-0">
                    <td className="px-5 py-2.5">{b.type}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums">{b.total}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-muted-foreground">
                      {b.used}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums font-semibold text-success">
                      {b.balance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            <CardTitle>Leave Calendar — July 2026</CardTitle>
          </div>
          <CardDescription>
            Approved and pending leaves. Days with multiple entries indicate leave conflicts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-medium text-muted-foreground">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1.5">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`e${i}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const items = leaveDays[day] ?? [];
              const conflict = items.length > 1;
              const isToday = day === 7;
              return (
                <div
                  key={day}
                  className={cn(
                    "min-h-[68px] rounded-lg border p-1.5 text-left",
                    isToday && "border-primary bg-primary/5",
                    conflict && "border-danger/40 bg-danger-soft/30",
                  )}
                >
                  <div className={cn("text-xs font-semibold", isToday && "text-primary")}>
                    {day}
                  </div>
                  <div className="mt-1 space-y-0.5">
                    {items.slice(0, 2).map((it, k) => (
                      <div
                        key={k}
                        className={cn(
                          "truncate rounded px-1 py-0.5 text-[10px] font-medium",
                          it.status === "Approved"
                            ? "bg-success-soft text-success"
                            : "bg-warning-soft text-warning-foreground",
                        )}
                      >
                        {it.name}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded bg-success" /> Approved
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded bg-warning" /> Pending
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded border border-danger/40 bg-danger-soft" />{" "}
              Conflict
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
