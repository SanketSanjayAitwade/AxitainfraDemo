import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, FileCheck2, Plus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDemo } from "@/store/DemoStore";
import { workPackages } from "@/data/seed";

export const Route = createFileRoute("/_app/tasks/")({
  component: Tasks,
});

function Tasks() {
  const { tasks, projects } = useDemo();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [cat, setCat] = useState("All");

  const pName = (id: string) => projects.find((p) => p.id === id)?.name ?? "";
  const filtered = tasks.filter((t) =>
    (status === "All" || t.status === status) &&
    (cat === "All" || t.category === cat) &&
    t.name.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div>
      <PageHeader
        title="Tasks & DPR"
        description="Scope-based task tracking with planned vs completed quantities and daily progress reporting."
        crumbs={[{ label: "Home", to: "/dashboard" }, { label: "Tasks" }]}
        actions={<Button asChild><Link to="/dpr"><FileCheck2 className="mr-1 h-4 w-4" /> Submit DPR</Link></Button>}
      />
      <div className="mb-5 flex flex-wrap gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tasks…" className="pl-9 bg-card" />
        </div>
        <Select value={status} onValueChange={setStatus}><SelectTrigger className="w-[150px] bg-card"><SelectValue /></SelectTrigger><SelectContent>{["All", "Not Started", "In Progress", "Completed", "Delayed", "On Hold"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
        <Select value={cat} onValueChange={setCat}><SelectTrigger className="w-[150px] bg-card"><SelectValue placeholder="Category" /></SelectTrigger><SelectContent>{["All", ...workPackages].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3 font-medium">Task / Scope</th><th className="px-3 py-3 font-medium">Project</th><th className="px-3 py-3 font-medium">Category</th>
              <th className="px-3 py-3 font-medium">Qty (done/plan)</th><th className="px-3 py-3 font-medium min-w-[130px]">Progress</th>
              <th className="px-3 py-3 font-medium">Engineer</th><th className="px-3 py-3 font-medium">Due</th><th className="px-3 py-3 font-medium">DPR</th><th className="px-3 py-3 font-medium">Status</th>
            </tr></thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b last:border-0 hover:bg-accent/40">
                  <td className="px-5 py-3"><Link to="/tasks/$id" params={{ id: t.id }} className="font-medium hover:text-primary">{t.name.split(" — ")[0]}</Link><div className="text-xs text-muted-foreground">{t.scope}</div></td>
                  <td className="px-3 py-3 text-muted-foreground">{pName(t.projectId).split(" ").slice(0, 2).join(" ")}</td>
                  <td className="px-3 py-3">{t.category}</td>
                  <td className="px-3 py-3 tabular-nums">{t.completedQty}/{t.plannedQty} {t.uom}</td>
                  <td className="px-3 py-3"><div className="flex items-center gap-2"><Progress value={t.progress} className="h-1.5 w-16" /><span className="text-xs tabular-nums">{t.progress}%</span></div></td>
                  <td className="px-3 py-3 text-muted-foreground">{t.engineer}</td>
                  <td className="px-3 py-3 text-muted-foreground">{t.dueDate}</td>
                  <td className="px-3 py-3">{t.dprToday ? <span className="text-success">✓ Today</span> : <span className="text-muted-foreground">—</span>}</td>
                  <td className="px-3 py-3"><StatusBadge status={t.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
