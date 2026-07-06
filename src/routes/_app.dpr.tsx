import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ChevronLeft, ChevronRight, FileCheck2, Plus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useDemo } from "@/store/DemoStore";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/dpr")({
  component: DprPage,
});

const steps = ["Project & Task", "Work Progress", "Labour", "Materials", "Photos & Remarks", "Review"];

function DprPage() {
  const { projects, tasks, dprs, addDpr } = useDemo();
  const [open, setOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title="Daily Progress Report (DPR)"
        description="Capture daily site progress against scope-linked tasks — quantities, labour, materials and photos."
        crumbs={[{ label: "Home", to: "/dashboard" }, { label: "Tasks", to: "/tasks" }, { label: "DPR" }]}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-1 h-4 w-4" /> New DPR</Button></DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader><DialogTitle>Submit Daily Progress Report</DialogTitle></DialogHeader>
              <DprWizard projects={projects} tasks={tasks} onSubmit={(d) => { addDpr(d); setOpen(false); }} />
            </DialogContent>
          </Dialog>
        }
      />

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3 font-medium">DPR / Date</th><th className="px-3 py-3 font-medium">Project</th><th className="px-3 py-3 font-medium">Task</th>
              <th className="px-3 py-3 font-medium">Engineer</th><th className="px-3 py-3 font-medium">Qty</th><th className="px-3 py-3 font-medium">Labour</th>
              <th className="px-3 py-3 font-medium">Material</th><th className="px-3 py-3 font-medium">Pending with</th><th className="px-3 py-3 font-medium">Status</th>
            </tr></thead>
            <tbody>
              {dprs.map((d) => (
                <tr key={d.id} className="border-b last:border-0 hover:bg-accent/40">
                  <td className="px-5 py-3"><div className="font-medium">{d.id}</div><div className="text-xs text-muted-foreground">{d.date}</div></td>
                  <td className="px-3 py-3 text-muted-foreground">{projects.find((p) => p.id === d.projectId)?.name.split(" ").slice(0, 2).join(" ")}</td>
                  <td className="px-3 py-3">{d.taskName.split(" — ")[0]}</td>
                  <td className="px-3 py-3 text-muted-foreground">{d.engineer}</td>
                  <td className="px-3 py-3 tabular-nums">{d.qtyCompleted} {d.uom}</td>
                  <td className="px-3 py-3 tabular-nums">{d.labourCount}</td>
                  <td className="px-3 py-3 text-muted-foreground">{d.materialConsumed}</td>
                  <td className="px-3 py-3 text-muted-foreground">{d.status === "Submitted" ? d.pendingWith : "—"}</td>
                  <td className="px-3 py-3"><StatusBadge status={d.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function DprWizard({ projects, tasks, onSubmit }: {
  projects: ReturnType<typeof useDemo>["projects"];
  tasks: ReturnType<typeof useDemo>["tasks"];
  onSubmit: (d: Parameters<ReturnType<typeof useDemo>["addDpr"]>[0]) => void;
}) {
  const [step, setStep] = useState(0);
  const [projectId, setProjectId] = useState(projects[0].id);
  const [taskId, setTaskId] = useState("");
  const [qty, setQty] = useState("");
  const [skilled, setSkilled] = useState("");
  const [unskilled, setUnskilled] = useState("");
  const [material, setMaterial] = useState("");
  const [remarks, setRemarks] = useState("");

  const projTasks = tasks.filter((t) => t.projectId === projectId);
  const task = tasks.find((t) => t.id === taskId) ?? projTasks[0];

  const canNext = step === 0 ? !!(projectId && (taskId || projTasks[0])) : true;

  const submit = () => {
    const t = task;
    onSubmit({
      date: "2026-07-04", projectId, taskId: t.id, taskName: t.name,
      engineer: "Arjun Menon", qtyCompleted: Number(qty) || 60, uom: t.uom,
      labourCount: (Number(skilled) || 0) + (Number(unskilled) || 8),
      materialConsumed: material || "12 bags Cement", remarks: remarks || "Work progressing as planned",
      status: "Submitted", pendingWith: "Rajesh Kumar",
    });
    toast.success("DPR submitted successfully", { description: `${qty || 60} ${t.uom} logged for ${t.name.split(" — ")[0]}` });
  };

  return (
    <div>
      {/* stepper */}
      <div className="mb-5 flex items-center">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div className={cn("flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold", i < step ? "bg-success text-success-foreground" : i === step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={cn("hidden text-[10px] sm:block", i === step ? "font-medium text-foreground" : "text-muted-foreground")}>{s}</span>
            </div>
            {i < steps.length - 1 && <div className={cn("mx-1 h-0.5 flex-1", i < step ? "bg-success" : "bg-border")} />}
          </div>
        ))}
      </div>

      <div className="min-h-[220px] space-y-3">
        {step === 0 && <>
          <div><Label>Project</Label><Select value={projectId} onValueChange={(v) => { setProjectId(v); setTaskId(""); }}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent className="max-h-60">{projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Task</Label><Select value={taskId || projTasks[0]?.id} onValueChange={setTaskId}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent className="max-h-60">{projTasks.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Scope Location</Label><Input className="mt-1" value={task?.scope ?? ""} disabled /></div>
        </>}
        {step === 1 && <>
          <div className="rounded-lg bg-muted/40 p-3 text-sm"><span className="text-muted-foreground">Planned:</span> {task?.plannedQty} {task?.uom} · <span className="text-muted-foreground">Done so far:</span> {task?.completedQty} {task?.uom}</div>
          <div><Label>Completed quantity today ({task?.uom})</Label><Input className="mt-1" type="number" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="e.g. 120" /></div>
        </>}
        {step === 2 && <div className="grid grid-cols-2 gap-3">
          <div><Label>Skilled labour</Label><Input className="mt-1" type="number" value={skilled} onChange={(e) => setSkilled(e.target.value)} placeholder="0" /></div>
          <div><Label>Unskilled labour</Label><Input className="mt-1" type="number" value={unskilled} onChange={(e) => setUnskilled(e.target.value)} placeholder="0" /></div>
        </div>}
        {step === 3 && <div><Label>Material consumed</Label><Input className="mt-1" value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="e.g. 12 bags Cement OPC 53" /><p className="mt-2 text-xs text-muted-foreground">Consumption is auto-deducted from site inventory for the linked scope.</p></div>}
        {step === 4 && <>
          <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">📷 Drag photos here or click to upload<br /><span className="text-xs">(placeholder — demo only)</span></div>
          <div><Label>Remarks</Label><Textarea className="mt-1" value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Site remarks…" /></div>
        </>}
        {step === 5 && <div className="space-y-2 text-sm">
          <Row k="Project" v={projects.find((p) => p.id === projectId)?.name ?? ""} />
          <Row k="Task" v={task?.name ?? ""} />
          <Row k="Completed qty" v={`${qty || 60} ${task?.uom}`} />
          <Row k="Labour" v={`${(Number(skilled) || 0) + (Number(unskilled) || 8)} workers`} />
          <Row k="Material" v={material || "12 bags Cement"} />
          <Row k="Remarks" v={remarks || "Work progressing as planned"} />
        </div>}
      </div>

      <div className="mt-5 flex justify-between">
        <Button variant="ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}><ChevronLeft className="mr-1 h-4 w-4" /> Back</Button>
        {step < steps.length - 1
          ? <Button disabled={!canNext} onClick={() => setStep((s) => s + 1)}>Next <ChevronRight className="ml-1 h-4 w-4" /></Button>
          : <Button onClick={submit}><FileCheck2 className="mr-1 h-4 w-4" /> Submit DPR</Button>}
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between border-b py-2 last:border-0"><span className="text-muted-foreground">{k}</span><span className="font-medium text-right">{v}</span></div>;
}
