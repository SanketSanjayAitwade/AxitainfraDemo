import { createFileRoute } from "@tanstack/react-router";
import { FileText, FileSpreadsheet, Eye } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/reports")({
  component: Reports,
});

const reports = [
  { name: "Project Health Report", desc: "Schedule, cost, material and labour health across 21 projects.", date: "2026-07-03" },
  { name: "DPR Report", desc: "Daily progress submissions, compliance and pending reports.", date: "2026-07-04" },
  { name: "Material Consumption Report", desc: "Consumption by project, scope and work package.", date: "2026-07-02" },
  { name: "Stock Movement Report", desc: "Inflow, outflow and closing balances per site store.", date: "2026-07-03" },
  { name: "Labour Attendance Report", desc: "Contractor-wise skilled/unskilled attendance summary.", date: "2026-07-04" },
  { name: "Contractor Productivity Report", desc: "Output per worker benchmarked across contractors.", date: "2026-07-01" },
  { name: "Delay Report", desc: "Delayed tasks and projects with root-cause tagging.", date: "2026-07-03" },
  { name: "Pending Approvals Report", desc: "Ageing analysis of all pending approvals by type.", date: "2026-07-04" },
  { name: "Cost / Progress Summary", desc: "Project-wise budget utilization vs physical progress.", date: "2026-07-02" },
];

function Reports() {
  return (
    <div>
      <PageHeader title="Reports" description="Management reporting suite for boardroom-ready construction visibility." crumbs={[{ label: "Home", to: "/dashboard" }, { label: "Reports" }]} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {reports.map((r) => (
          <Card key={r.name} className="gap-0 p-0">
            <CardContent className="flex-1 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><FileText className="h-5 w-5" /></div>
              <h3 className="mt-3 font-semibold">{r.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
              <p className="mt-3 text-xs text-muted-foreground">Last generated: {r.date}</p>
            </CardContent>
            <div className="flex gap-2 border-t p-3">
              <Button size="sm" variant="secondary" className="flex-1" onClick={() => toast.info(`Opening ${r.name}`)}><Eye className="mr-1 h-4 w-4" /> View</Button>
              <Button size="sm" variant="ghost" onClick={() => toast.success("Demo export generated successfully", { description: `${r.name} · PDF` })}><FileText className="h-4 w-4" /></Button>
              <Button size="sm" variant="ghost" onClick={() => toast.success("Demo export generated successfully", { description: `${r.name} · Excel` })}><FileSpreadsheet className="h-4 w-4" /></Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
