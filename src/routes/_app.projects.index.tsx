import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, LayoutGrid, Table as TableIcon, ArrowRight, MapPin, Users, Package, FileClock, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDemo } from "@/store/DemoStore";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/projects/")({
  validateSearch: (s: Record<string, unknown>): { status?: string } => ({
    status: typeof s.status === "string" ? s.status : undefined,
  }),
  component: Projects,
});

const statusOptions = ["All", "On Track", "Delayed", "At Risk", "Critical", "Completed"];

function Projects() {
  const { projects } = useDemo();
  const search = Route.useSearch();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState(search.status ?? "All");
  const [city, setCity] = useState("All");
  const [manager, setManager] = useState("All");
  const [sort, setSort] = useState("progress");
  const [view, setView] = useState<"cards" | "table">("cards");

  const cities = ["All", ...Array.from(new Set(projects.map((p) => p.city)))];
  const managers = ["All", ...Array.from(new Set(projects.map((p) => p.manager)))];

  let filtered = projects.filter((p) =>
    (status === "All" || p.status === status) &&
    (city === "All" || p.city === city) &&
    (manager === "All" || p.manager === manager) &&
    (p.name.toLowerCase().includes(q.toLowerCase()) || p.location.toLowerCase().includes(q.toLowerCase())),
  );
  filtered = filtered.sort((a, b) => (sort === "progress" ? b.progress - a.progress : b.delayDays - a.delayDays));

  return (
    <div>
      <PageHeader
        title="Projects"
        description={`${filtered.length} of ${projects.length} projects · portfolio-wide execution overview`}
        crumbs={[{ label: "Home", to: "/dashboard" }, { label: "Projects" }]}
        actions={
          <div className="flex rounded-lg border bg-card p-0.5">
            <button onClick={() => setView("cards")} className={cn("flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm", view === "cards" ? "bg-primary text-primary-foreground" : "text-muted-foreground")}><LayoutGrid className="h-4 w-4" /></button>
            <button onClick={() => setView("table")} className={cn("flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm", view === "table" ? "bg-primary text-primary-foreground" : "text-muted-foreground")}><TableIcon className="h-4 w-4" /></button>
          </div>
        }
      />

      {/* Filters */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search projects…" className="pl-9 bg-card" />
        </div>
        <Select value={status} onValueChange={setStatus}><SelectTrigger className="w-[140px] bg-card"><SelectValue /></SelectTrigger><SelectContent>{statusOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
        <Select value={city} onValueChange={setCity}><SelectTrigger className="w-[140px] bg-card"><SelectValue placeholder="Location" /></SelectTrigger><SelectContent>{cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
        <Select value={manager} onValueChange={setManager}><SelectTrigger className="w-[160px] bg-card"><SelectValue placeholder="Manager" /></SelectTrigger><SelectContent>{managers.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent></Select>
        <Select value={sort} onValueChange={setSort}><SelectTrigger className="w-[150px] bg-card"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="progress">Sort: Progress</SelectItem><SelectItem value="delay">Sort: Delay risk</SelectItem></SelectContent></Select>
      </div>

      {view === "cards" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <Card key={p.id} className="gap-0 p-0 transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between gap-2 p-5 pb-3">
                <div className="min-w-0">
                  <h3 className="truncate font-semibold">{p.name}</h3>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{p.location}</p>
                </div>
                <StatusBadge status={p.status} />
              </div>
              <div className="px-5">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium tabular-nums">{p.progress}% <span className="text-muted-foreground">/ {p.planned}% planned</span></span>
                </div>
                <Progress value={p.progress} className="h-2" />
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2 border-t px-5 py-3 text-center">
                <Metric icon={Users} label="Labour" value={p.labourStrength} />
                <Metric icon={Package} label="Shortage" value={p.materialShortages} tone={p.materialShortages > 0 ? "danger" : "muted"} />
                <Metric icon={FileClock} label="DPR" value={p.dprSubmitted ? "✓" : "—"} />
                <Metric icon={AlertCircle} label="Issues" value={p.openIssues} tone={p.openIssues > 6 ? "warning" : "muted"} />
              </div>
              <div className="border-t p-3">
                <Button asChild variant="secondary" className="w-full"><Link to="/projects/$id" params={{ id: p.id }}>Open Project <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Project</th>
                  <th className="px-3 py-3 font-medium">Manager</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-3 py-3 font-medium min-w-[150px]">Progress</th>
                  <th className="px-3 py-3 font-medium">Labour</th>
                  <th className="px-3 py-3 font-medium">Approvals</th>
                  <th className="px-3 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-accent/40">
                    <td className="px-5 py-3"><div className="font-medium">{p.name}</div><div className="text-xs text-muted-foreground">{p.location}</div></td>
                    <td className="px-3 py-3 text-muted-foreground">{p.manager}</td>
                    <td className="px-3 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-3 py-3"><div className="flex items-center gap-2"><Progress value={p.progress} className="h-1.5 w-20" /><span className="text-xs tabular-nums">{p.progress}%</span></div></td>
                    <td className="px-3 py-3 tabular-nums">{p.labourStrength}</td>
                    <td className="px-3 py-3 tabular-nums">{p.pendingApprovals}</td>
                    <td className="px-3 py-3 text-right"><Button asChild size="sm" variant="ghost"><Link to="/projects/$id" params={{ id: p.id }}>Open</Link></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

function Metric({ icon: Icon, label, value, tone = "muted" }: { icon: typeof Users; label: string; value: string | number; tone?: string }) {
  return (
    <div>
      <div className={cn("text-sm font-semibold tabular-nums", tone === "danger" && "text-danger", tone === "warning" && "text-warning-foreground")}>{value}</div>
      <div className="mt-0.5 flex items-center justify-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground"><Icon className="h-3 w-3" />{label}</div>
    </div>
  );
}
