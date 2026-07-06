import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Eye, Check, X, ShoppingCart, Truck } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { useDemo } from "@/store/DemoStore";

export const Route = createFileRoute("/_app/materials/requests")({
  component: Requests,
});

function Requests() {
  const { materialRequests, projects, materials, tasks, addMaterialRequest, setRequestStatus } = useDemo();
  const [open, setOpen] = useState(false);
  const [projectId, setProjectId] = useState(projects[0].id);
  const [materialId, setMaterialId] = useState(materials[0].id);
  const [qty, setQty] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [reason, setReason] = useState("");

  const pName = (id: string) => projects.find((p) => p.id === id)?.name.split(" ").slice(0, 2).join(" ") ?? "";

  const create = () => {
    const m = materials.find((x) => x.id === materialId)!;
    addMaterialRequest({
      projectId, scope: "Tower A / Floor 2", taskName: "Site work",
      materialId, materialName: m.name, qty: Number(qty) || 100, uom: m.uom,
      requiredDate: "2026-07-15", requestedBy: "Arjun Menon",
      priority: priority as never, reason: reason || "Required for ongoing site work", status: "Submitted",
    });
    toast.success("Material request submitted", { description: "Sent for approval to Purchase Manager" });
    setOpen(false); setQty(""); setReason("");
  };

  return (
    <div>
      <PageHeader
        title="Material Requests"
        description="Raise and track material indents against project scope and tasks."
        crumbs={[{ label: "Materials", to: "/materials" }, { label: "Requests" }]}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-1 h-4 w-4" /> New Request</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Material Request</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>Project</Label><Select value={projectId} onValueChange={setProjectId}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent className="max-h-60">{projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent></Select></div>
                <div><Label>Material</Label><Select value={materialId} onValueChange={setMaterialId}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent className="max-h-60">{materials.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}</SelectContent></Select></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Quantity</Label><Input className="mt-1" type="number" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="0" /></div>
                  <div><Label>Priority</Label><Select value={priority} onValueChange={setPriority}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>{["Low", "Medium", "High", "Critical"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div>
                </div>
                <div><Label>Reason / Remarks</Label><Textarea className="mt-1" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for request…" /></div>
              </div>
              <DialogFooter><DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose><Button onClick={create}>Submit Request</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3 font-medium">Request ID</th><th className="px-3 py-3 font-medium">Project</th><th className="px-3 py-3 font-medium">Material</th>
              <th className="px-3 py-3 font-medium">Qty</th><th className="px-3 py-3 font-medium">Requested by</th><th className="px-3 py-3 font-medium">Required</th>
              <th className="px-3 py-3 font-medium">Priority</th><th className="px-3 py-3 font-medium">Status</th><th className="px-3 py-3 font-medium">Actions</th>
            </tr></thead>
            <tbody>
              {materialRequests.map((r) => (
                <tr key={r.id} className="border-b last:border-0 hover:bg-accent/40">
                  <td className="px-5 py-3 font-medium">{r.id}</td>
                  <td className="px-3 py-3 text-muted-foreground">{pName(r.projectId)}</td>
                  <td className="px-3 py-3">{r.materialName}</td>
                  <td className="px-3 py-3 tabular-nums">{r.qty} {r.uom}</td>
                  <td className="px-3 py-3 text-muted-foreground">{r.requestedBy}</td>
                  <td className="px-3 py-3 text-muted-foreground">{r.requiredDate}</td>
                  <td className="px-3 py-3"><StatusBadge status={r.priority} /></td>
                  <td className="px-3 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1">
                      <IconBtn title="View" onClick={() => toast.info(`${r.id}`, { description: `${r.materialName} · ${r.qty} ${r.uom} · ${r.reason}` })}><Eye className="h-4 w-4" /></IconBtn>
                      {r.status === "Submitted" && <>
                        <IconBtn title="Approve" tone="success" onClick={() => { setRequestStatus(r.id, "Approved"); toast.success(`${r.id} approved`); }}><Check className="h-4 w-4" /></IconBtn>
                        <IconBtn title="Reject" tone="danger" onClick={() => { setRequestStatus(r.id, "Rejected"); toast.error(`${r.id} rejected`); }}><X className="h-4 w-4" /></IconBtn>
                      </>}
                      {r.status === "Approved" && <IconBtn title="Convert to PO" tone="info" onClick={() => { setRequestStatus(r.id, "Converted to PO"); toast.success(`${r.id} converted to PO`, { description: "New purchase order drafted" }); }}><ShoppingCart className="h-4 w-4" /></IconBtn>}
                      {r.status === "Converted to PO" && <IconBtn title="Issue Material" tone="success" onClick={() => { setRequestStatus(r.id, "Issued"); toast.success(`Material issued for ${r.id}`); }}><Truck className="h-4 w-4" /></IconBtn>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function IconBtn({ children, title, onClick, tone }: { children: React.ReactNode; title: string; onClick: () => void; tone?: string }) {
  const c = tone === "success" ? "text-success hover:bg-success-soft" : tone === "danger" ? "text-danger hover:bg-danger-soft" : tone === "info" ? "text-info hover:bg-info-soft" : "text-muted-foreground hover:bg-accent";
  return <button title={title} onClick={onClick} className={`rounded-md p-1.5 ${c}`}>{children}</button>;
}
