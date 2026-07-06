import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, ChevronDown, Layers, Plus, CheckCircle2, Circle, Clock } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDemo } from "@/store/DemoStore";
import { towers, floors, units, workPackages } from "@/data/seed";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/matrix")({
  component: Matrix,
});

const projTowers = towers.slice(0, 3);
const projFloors = floors;
const projUnits = units;

// deterministic pseudo status per scope key
const scopeStatus = (key: string) => {
  const h = key.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const pct = h % 100;
  return { pct, state: pct >= 90 ? "Completed" : pct >= 25 ? "In Progress" : "Not Started" };
};

function Matrix() {
  const { projects, tasks } = useDemo();
  const [project, setProject] = useState(projects[0].id);
  const [openTower, setOpenTower] = useState<string | null>(projTowers[0]);
  const [openFloor, setOpenFloor] = useState<string | null>("Floor 2");
  const [selected, setSelected] = useState({ tower: projTowers[0], floor: "Floor 2", unit: "Unit 201" });

  const scopeKey = `${project}-${selected.tower}-${selected.floor}-${selected.unit}`;
  const linkedTasks = tasks.filter((t) => t.projectId === project && t.tower === selected.tower);
  const detail = scopeStatus(scopeKey);
  const proj = projects.find((p) => p.id === project)!;

  return (
    <div>
      <PageHeader
        title="Project Matrix"
        description="Scope broken down into Tower → Floor → Unit / Area → Work Package → Task, with location-level progress."
        crumbs={[{ label: "Home", to: "/dashboard" }, { label: "Project Matrix" }]}
        actions={
          <Select value={project} onValueChange={(v) => setProject(v)}>
            <SelectTrigger className="w-[240px] bg-card"><SelectValue /></SelectTrigger>
            <SelectContent className="max-h-80">{projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
          </Select>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        {/* Scope tree */}
        <Card className="p-0 lg:sticky lg:top-20 lg:self-start">
          <CardHeader className="border-b py-3"><CardTitle className="flex items-center gap-2 text-sm"><Layers className="h-4 w-4" /> Scope Tree</CardTitle></CardHeader>
          <CardContent className="max-h-[70vh] overflow-y-auto p-2 text-sm">
            {projTowers.map((tw) => (
              <div key={tw}>
                <button onClick={() => setOpenTower(openTower === tw ? null : tw)} className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 font-medium hover:bg-accent">
                  {openTower === tw ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}{tw}
                </button>
                {openTower === tw && (
                  <div className="ml-4 border-l pl-2">
                    {projFloors.map((fl) => (
                      <div key={fl}>
                        <button onClick={() => setOpenFloor(openFloor === fl ? null : fl)} className="flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-muted-foreground hover:bg-accent hover:text-foreground">
                          {openFloor === fl ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}{fl}
                        </button>
                        {openFloor === fl && (
                          <div className="ml-4 border-l pl-2">
                            {projUnits.map((un) => {
                              const active = selected.tower === tw && selected.floor === fl && selected.unit === un;
                              const st = scopeStatus(`${project}-${tw}-${fl}-${un}`);
                              return (
                                <button key={un} onClick={() => setSelected({ tower: tw, floor: fl, unit: un })}
                                  className={cn("flex w-full items-center gap-2 rounded-md px-2 py-1 text-left", active ? "bg-primary/10 font-medium text-primary" : "hover:bg-accent")}>
                                  {st.state === "Completed" ? <CheckCircle2 className="h-3.5 w-3.5 text-success" /> : st.state === "In Progress" ? <Clock className="h-3.5 w-3.5 text-info" /> : <Circle className="h-3.5 w-3.5 text-muted-foreground" />}
                                  <span className="flex-1 truncate">{un}</span>
                                  <span className="text-[10px] tabular-nums text-muted-foreground">{st.pct}%</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Details + tasks */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex-row items-start justify-between">
              <div>
                <CardTitle>{selected.tower} / {selected.floor} / {selected.unit}</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">{proj.name}</p>
              </div>
              <StatusBadge status={detail.state} />
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-1 flex justify-between text-sm"><span className="text-muted-foreground">Scope Progress</span><span className="font-medium tabular-nums">{detail.pct}%</span></div>
                <Progress value={detail.pct} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <ScopeStat label="Planned Qty" value="1,240 sq.ft" />
                <ScopeStat label="Completed Qty" value={`${Math.round(1240 * detail.pct / 100)} sq.ft`} />
                <ScopeStat label="Work Packages" value={String(workPackages.length)} />
                <ScopeStat label="Linked Tasks" value={String(linkedTasks.length)} />
              </div>
              <div>
                <div className="mb-2 text-sm font-medium">Work Packages at this location</div>
                <div className="flex flex-wrap gap-2">
                  {workPackages.map((wp) => {
                    const st = scopeStatus(`${scopeKey}-${wp}`);
                    const dot = st.state === "Completed" ? "bg-success" : st.state === "In Progress" ? "bg-info" : "bg-muted-foreground/40";
                    return (
                      <span key={wp} className="inline-flex items-center gap-1.5 rounded-md border bg-muted/40 px-2.5 py-1 text-xs font-medium">
                        <span className={cn("h-1.5 w-1.5 rounded-full", dot)} />
                        {wp}
                      </span>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="p-0 overflow-hidden">
            <CardHeader className="flex-row items-center justify-between border-b py-3">
              <CardTitle className="text-sm">Tasks linked to selected scope</CardTitle>
              <CreateTaskDialog scope={`${selected.tower} / ${selected.floor} / ${selected.unit}`} project={proj.name} />
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-2.5 font-medium">Task</th><th className="px-3 py-2.5 font-medium">Category</th><th className="px-3 py-2.5 font-medium">Progress</th><th className="px-3 py-2.5 font-medium">Status</th>
                  </tr></thead>
                  <tbody>
                    {linkedTasks.map((t) => (
                      <tr key={t.id} className="border-b last:border-0 hover:bg-accent/40">
                        <td className="px-5 py-2.5 font-medium">{t.name.split(" — ")[0]}</td>
                        <td className="px-3 py-2.5 text-muted-foreground">{t.category}</td>
                        <td className="px-3 py-2.5"><div className="flex items-center gap-2"><Progress value={t.progress} className="h-1.5 w-16" /><span className="text-xs tabular-nums">{t.progress}%</span></div></td>
                        <td className="px-3 py-2.5"><StatusBadge status={t.status} /></td>
                      </tr>
                    ))}
                    {linkedTasks.length === 0 && <tr><td colSpan={4} className="px-5 py-8 text-center text-muted-foreground">No tasks yet for this scope. Create one to get started.</td></tr>}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ScopeStat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border bg-muted/30 p-3"><div className="text-xs text-muted-foreground">{label}</div><div className="mt-0.5 text-sm font-semibold">{value}</div></div>;
}

function CreateTaskDialog({ scope, project }: { scope: string; project: string }) {
  const [wp, setWp] = useState(workPackages[0]);
  return (
    <Dialog>
      <DialogTrigger asChild><Button size="sm"><Plus className="mr-1 h-4 w-4" /> Create Task</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Create Task from Scope</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Project</Label><Input value={project} disabled className="mt-1" /></div>
          <div><Label>Scope Location</Label><Input value={scope} disabled className="mt-1" /></div>
          <div><Label>Work Package</Label>
            <Select value={wp} onValueChange={setWp}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>{workPackages.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent></Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Planned Qty</Label><Input type="number" placeholder="0" className="mt-1" /></div>
            <div><Label>Unit</Label><Input placeholder="sq.ft" className="mt-1" /></div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
          <DialogClose asChild><Button onClick={() => toast.success("Task created", { description: `${wp} task added to ${scope}` })}>Create Task</Button></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
