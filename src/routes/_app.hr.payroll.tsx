import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Users,
  IndianRupee,
  MinusCircle,
  Wallet,
  FileText,
  Download,
  CheckCircle2,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { StatCard } from "@/components/common/StatCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/dialog";
import { useHr } from "@/store/HrStore";
import type { PayrollItem } from "@/data/hr";

export const Route = createFileRoute("/_app/hr/payroll")({
  component: PayrollPage,
});

const rupee = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function PayrollPage() {
  const { payrollItems, payrollStatus, setPayrollStatus, employees } = useHr();
  const [month, setMonth] = useState("2026-07");
  const [payslip, setPayslip] = useState<PayrollItem | null>(null);

  const gross = payrollItems.reduce((s, p) => s + p.gross, 0);
  const deductions = payrollItems.reduce((s, p) => s + p.deductions, 0);
  const net = payrollItems.reduce((s, p) => s + p.net, 0);
  const pending = payrollItems.filter((p) => p.status !== "Approved" && p.status !== "Paid").length;
  const generated = payrollItems.filter(
    (p) => p.status === "Approved" || p.status === "Paid",
  ).length;

  const nextStatus =
    payrollStatus === "Draft"
      ? "Under Review"
      : payrollStatus === "Under Review"
        ? "Approved"
        : "Paid";
  const advance = () => {
    setPayrollStatus(nextStatus);
    toast.success(`Payroll moved to ${nextStatus}`, {
      description: `July 2026 payroll is now ${nextStatus.toLowerCase()}.`,
    });
  };

  const emp = payslip ? employees.find((e) => e.id === payslip.employeeId) : null;

  return (
    <div>
      <PageHeader
        title="Payroll"
        description="Payroll is calculated from attendance and leave data — reducing manual salary mistakes."
        crumbs={[{ label: "HR & Employee Tracking", to: "/hr" }, { label: "Payroll" }]}
        actions={
          <>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2026-07">July 2026 Payroll</SelectItem>
                <SelectItem value="2026-06">June 2026 Payroll</SelectItem>
                <SelectItem value="2026-05">May 2026 Payroll</SelectItem>
              </SelectContent>
            </Select>
            {payrollStatus !== "Paid" && (
              <Button onClick={advance}>
                <CheckCircle2 className="mr-1 h-4 w-4" /> Move to {nextStatus}
              </Button>
            )}
          </>
        }
      />

      <div className="mb-4 flex items-center gap-2 rounded-lg border bg-muted/40 px-4 py-2.5 text-sm">
        <span className="font-medium">Payroll status:</span>
        <StatusBadge status={payrollStatus} />
        <span className="ml-auto text-xs text-muted-foreground">
          Flow: Attendance locked → Leave adjusted → Salary calculated → Review → Approved → Paid
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatCard
          label="Employees in Payroll"
          value={payrollItems.length}
          icon={Users}
          tone="primary"
        />
        <StatCard label="Gross Salary" value={rupee(gross)} icon={IndianRupee} tone="info" />
        <StatCard label="Deductions" value={rupee(deductions)} icon={MinusCircle} tone="danger" />
        <StatCard label="Net Payable" value={rupee(net)} icon={Wallet} tone="success" />
        <StatCard label="Payroll Pending" value={pending} icon={FileText} tone="warning" />
        <StatCard label="Payslips Generated" value={generated} icon={CheckCircle2} tone="success" />
      </div>

      <Card className="mt-4 overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">Employee</th>
                <th className="px-3 py-3 font-medium text-right">Present</th>
                <th className="px-3 py-3 font-medium text-right">Leave</th>
                <th className="px-3 py-3 font-medium text-right">LOP</th>
                <th className="px-3 py-3 font-medium text-right">Gross</th>
                <th className="px-3 py-3 font-medium text-right">Deduction</th>
                <th className="px-3 py-3 font-medium text-right">Net Pay</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium text-right">Payslip</th>
              </tr>
            </thead>
            <tbody>
              {payrollItems.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-accent/40">
                  <td className="px-5 py-3">
                    <div className="font-medium">{p.employee}</div>
                    <div className="text-xs text-muted-foreground">{p.code}</div>
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums">{p.presentDays}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{p.paidLeave}</td>
                  <td className="px-3 py-3 text-right tabular-nums text-danger">{p.lop}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{rupee(p.gross)}</td>
                  <td className="px-3 py-3 text-right tabular-nums text-danger">
                    {rupee(p.deductions)}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums font-semibold">
                    {rupee(p.net)}
                  </td>
                  <td className="px-3 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-3 py-3 text-right">
                    <Button size="sm" variant="ghost" onClick={() => setPayslip(p)}>
                      <FileText className="mr-1 h-3.5 w-3.5" /> View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={!!payslip} onOpenChange={(o) => !o && setPayslip(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Payslip — {payslip?.employee}</DialogTitle>
          </DialogHeader>
          {payslip && emp && (
            <div className="rounded-xl border">
              <div className="flex items-center justify-between border-b bg-muted/40 px-5 py-3">
                <div>
                  <div className="font-bold">Axita Constructions</div>
                  <div className="text-xs text-muted-foreground">Payslip · July 2026</div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <div>{emp.code}</div>
                  <div>{emp.designation}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 px-5 py-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Employee</span>
                  <span className="font-medium">{payslip.employee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Department</span>
                  <span>{emp.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Present days</span>
                  <span className="tabular-nums">{payslip.presentDays}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paid leave</span>
                  <span className="tabular-nums">{payslip.paidLeave}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">LOP days</span>
                  <span className="tabular-nums text-danger">{payslip.lop}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Overtime</span>
                  <span className="tabular-nums">{payslip.overtimeHrs} hrs</span>
                </div>
              </div>
              <div className="border-t px-5 py-3 text-sm">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Earnings
                </div>
                <div className="flex justify-between">
                  <span>Gross salary</span>
                  <span className="tabular-nums">{rupee(payslip.gross)}</span>
                </div>
                <div className="mb-1 mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Deductions
                </div>
                <div className="flex justify-between text-danger">
                  <span>Total deductions (LOP, late)</span>
                  <span className="tabular-nums">- {rupee(payslip.deductions)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between border-t bg-success-soft/40 px-5 py-3">
                <span className="font-semibold">Net Salary</span>
                <span className="text-lg font-bold tabular-nums text-success">
                  {rupee(payslip.net)}
                </span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPayslip(null)}>
              Close
            </Button>
            <Button
              onClick={() => {
                toast.success("Payslip downloaded", {
                  description: `${payslip?.employee} — July 2026 payslip (PDF)`,
                });
              }}
            >
              <Download className="mr-1 h-4 w-4" /> Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
