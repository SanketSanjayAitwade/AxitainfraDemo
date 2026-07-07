import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { FileText, Download, CalendarCheck, Wallet, MapPin, Clock } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/_app/hr/reports")({
  component: ReportsPage,
});

const groups: Array<{ title: string; icon: LucideIcon; tone: string; reports: string[] }> = [
  {
    title: "Attendance Reports",
    icon: Clock,
    tone: "text-info",
    reports: [
      "Daily attendance",
      "Monthly attendance",
      "Late check-in report",
      "Absent report",
      "Missed punch report",
      "Overtime report",
    ],
  },
  {
    title: "Leave Reports",
    icon: CalendarCheck,
    tone: "text-success",
    reports: [
      "Leave balance",
      "Pending leave",
      "Approved leave",
      "Leave by employee",
      "Monthly leave summary",
    ],
  },
  {
    title: "Payroll Reports",
    icon: Wallet,
    tone: "text-primary",
    reports: [
      "Monthly payroll summary",
      "Employee salary report",
      "Deduction report",
      "Payslip report",
      "LOP report",
    ],
  },
  {
    title: "Tracking Reports",
    icon: MapPin,
    tone: "text-danger",
    reports: [
      "Employee location history",
      "Outside geo-fence report",
      "Tracking inactive report",
      "Field visit summary",
    ],
  },
];

function ReportsPage() {
  const gen = (name: string) =>
    toast.success("Report generated", { description: `${name} · exported as PDF` });

  return (
    <div>
      <PageHeader
        title="HR Reports"
        description="Attendance, leave, payroll and field-tracking reports — ready to export for management review."
        crumbs={[{ label: "HR & Employee Tracking", to: "/hr" }, { label: "Reports" }]}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {groups.map((g) => {
          const Icon = g.icon;
          return (
            <Card key={g.title}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Icon className={`h-4.5 w-4.5 ${g.tone}`} />
                  <CardTitle>{g.title}</CardTitle>
                </div>
                <CardDescription>{g.reports.length} available reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-1.5">
                {g.reports.map((r) => (
                  <div
                    key={r}
                    className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm hover:bg-accent/40"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5 text-muted-foreground" /> {r}
                    </span>
                    <Button size="sm" variant="ghost" className="h-7" onClick={() => gen(r)}>
                      <Download className="mr-1 h-3.5 w-3.5" /> Generate
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
