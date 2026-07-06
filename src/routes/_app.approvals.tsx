import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { StatCard } from "@/components/common/StatCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useDemo } from "@/store/DemoStore";
import { ShieldAlert, Clock, CheckCircle2, XCircle } from "lucide-react";

export const Route = createFileRoute("/_app/approvals")({
  component: Approvals,
});

const types = ["All", "DPR", "Material Request", "Purchase Order", "GRN", "Labour Attendance", "Stock Adjustment", "Task Closure"];

function Approvals() {
  const { approvals, projects, resolveApproval } = useDemo();
  const [type, setType] = useState("All");
  const [dialog, setDialog] = useState<{ id: string; decision: "Approved" | "Rejected" } | null>(null);
  const [remarks, setRemarks] = useState("");

  const pName = (id: string) => projects.find((p) => p.id === id)?.name.split(" ").slice(0, 2).join(" ") ?? "—";
  const filtered = approvals.filter((a) => type === "All" || a.type === type);
  const pending = approvals.filter((a) => a.status === "Pending").length;
  const approved = approvals.filter((a) => a.status === "Approved").length;
  const rejected = approvals.filter((a) => a.status === "Rejected").length;

  const confirm = () => {
    if (!dialog) return;
    resolveApproval(dialog.id, dialog.decision);
    toast[dialog.decision === "Approved" ? "success" : "error"](`${dialog.id} ${dialog.decision.toLowerCase()}`, { description: remarks || undefined });
    setDialog(null); setRemarks("");
  };

  return (
    <div>
      <PageHeader title="Approvals" description="Central approval queue across DPR, materials, POs, GRN, labour and task closures." crumbs={[{ label: "Home", to: "/dashboard" }, { label: "Approvals" }]} />
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Pending" value={pending} icon={Clock} tone="warning" />
        <StatCard label="Approved" value={approved} icon={CheckCircle2} tone="success" />
        <StatCard label="Rejected" value={rejected} icon={XCircle} tone="danger" />
        <StatCard label="Total Requests" value={approvals.length} icon={ShieldAlert} tone="primary" />
      </div>
      <div className="mb-4">
        <Select value={type} onValueChange={setType}><SelectTrigger className="w-[200px] bg-card"><SelectValue /></SelectTrigger><SelectContent>{types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
      </div>
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead><tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-5 py-3 font-medium">ID</th><th className="px-3 py-3 font-medium">Type</th><th className="px-3 py-3 font-medium">Project</th><th className="px-3 py-3 font-medium">Detail</th>
            <th className="px-3 py-3 font-medium">Value</th><th className="px-3 py-3 font-medium">Requested by</th><th className="px-3 py-3 font-medium">Pending with</th><th className="px-3 py-3 font-medium">Age</th>
            <th className="px-3 py-3 font-medium">Priority</th><th className="px-3 py-3 font-medium">Status</th><th className="px-3 py-3 font-medium">Actions</th>
          </tr></thead>
          <tbody>{filtered.map((a) => (
            <tr key={a.id} className="border-b last:border-0 hover:bg-accent/40">
              <td className="px-5 py-3 font-medium">{a.id}</td><td className="px-3 py-3">{a.type}</td><td className="px-3 py-3 text-muted-foreground">{pName(a.projectId)}</td><td className="px-3 py-3">{a.detail}</td>
              <td className="px-3 py-3 tabular-nums">{a.value}</td><td className="px-3 py-3 text-muted-foreground">{a.requestedBy}</td><td className="px-3 py-3 text-muted-foreground">{a.pendingWith}</td><td className="px-3 py-3">{a.ageDays}d</td>
              <td className="px-3 py-3"><StatusBadge status={a.priority} /></td><td className="px-3 py-3"><StatusBadge status={a.status} /></td>
              <td className="px-3 py-3">{a.status === "Pending" ? (
                <div className="flex gap-1">
                  <button title="Approve" onClick={() => setDialog({ id: a.id, decision: "Approved" })} className="rounded-md p-1.5 text-success hover:bg-success-soft"><Check className="h-4 w-4" /></button>
                  <button title="Reject" onClick={() => setDialog({ id: a.id, decision: "Rejected" })} className="rounded-md p-1.5 text-danger hover:bg-danger-soft"><X className="h-4 w-4" /></button>
                </div>
              ) : <span className="text-xs text-muted-foreground">Resolved</span>}</td>
            </tr>
          ))}</tbody>
        </table></div>
      </Card>

      <Dialog open={!!dialog} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{dialog?.decision === "Approved" ? "Approve" : "Reject"} request {dialog?.id}</DialogTitle></DialogHeader>
          <div><Label>Remarks {dialog?.decision === "Rejected" && <span className="text-danger">*</span>}</Label><Textarea className="mt-1" value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Add approval remarks…" /></div>
          <DialogFooter><DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
            <Button variant={dialog?.decision === "Rejected" ? "destructive" : "default"} onClick={confirm}>Confirm {dialog?.decision}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
