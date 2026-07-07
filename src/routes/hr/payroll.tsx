import { createFileRoute } from "@tanstack/react-router";
import { IndianRupee, Wallet, CheckCircle2, Clock3 } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { hrPayroll } from "@/data/hr";

const inr = (value: number) => `₹${value.toLocaleString("en-IN")}`;

export const Route = createFileRoute("/hr/payroll")({
  component: PayrollPage,
});

function PayrollPage() {
  const gross = hrPayroll.reduce((sum, row) => sum + row.gross, 0);
  const net = hrPayroll.reduce((sum, row) => sum + row.net, 0);
  const paid = hrPayroll.filter((row) => row.status === "Paid").length;
  const processing = hrPayroll.filter((row) => row.status === "Processing").length;

  return (
    <div>
      <PageHeader
        title="Payroll"
        description="Mock payroll batches, deductions, and payout readiness."
        crumbs={[{ label: "HR", to: "/hr" }, { label: "Payroll" }]}
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="Gross pay" value={inr(gross)} icon={IndianRupee} tone="primary" />
        <StatCard label="Net pay" value={inr(net)} icon={Wallet} tone="success" />
        <StatCard label="Paid" value={paid} icon={CheckCircle2} tone="success" />
        <StatCard label="Processing" value={processing} icon={Clock3} tone="warning" />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <CardHeader>
            <CardTitle>Payroll register</CardTitle>
            <CardDescription>Current month mock salary sheet.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-y bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-2.5 font-medium">Employee</th>
                    <th className="px-3 py-2.5 font-medium">Department</th>
                    <th className="px-3 py-2.5 font-medium">Gross</th>
                    <th className="px-3 py-2.5 font-medium">Deductions</th>
                    <th className="px-3 py-2.5 font-medium">Net</th>
                    <th className="px-3 py-2.5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {hrPayroll.map((row) => (
                    <tr key={row.id} className="border-b last:border-0">
                      <td className="px-5 py-3 font-medium">{row.employee}</td>
                      <td className="px-3 py-3">{row.department}</td>
                      <td className="px-3 py-3 tabular-nums">{inr(row.gross)}</td>
                      <td className="px-3 py-3 tabular-nums">{inr(row.deductions)}</td>
                      <td className="px-3 py-3 tabular-nums">{inr(row.net)}</td>
                      <td className="px-3 py-3">
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payout summary</CardTitle>
            <CardDescription>Mock monthly close checkpoints.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Attendance sync", state: "Complete", tone: "bg-emerald-500" },
              { label: "Overtime validation", state: "In review", tone: "bg-amber-500" },
              { label: "Deduction approval", state: "Waiting", tone: "bg-sky-500" },
              { label: "Bank upload", state: "Queued", tone: "bg-violet-500" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium">{item.label}</div>
                  <span className={`h-2.5 w-2.5 rounded-full ${item.tone}`} />
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{item.state}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
