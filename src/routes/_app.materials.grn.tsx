import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { useDemo } from "@/store/DemoStore";

export const Route = createFileRoute("/_app/materials/grn")({
  component: GRNPage,
});

function GRNPage() {
  const { grns, purchaseOrders, projects, addGrn } = useDemo();
  const [open, setOpen] = useState(false);
  const [poId, setPoId] = useState(purchaseOrders[0]?.id ?? "");
  const [received, setReceived] = useState("");
  const [accepted, setAccepted] = useState("");
  const [remarks, setRemarks] = useState("");

  const po = purchaseOrders.find((p) => p.id === poId);
  const pName = (id: string) => projects.find((p) => p.id === id)?.name.split(" ").slice(0, 2).join(" ") ?? "";

  const create = () => {
    if (!po) return;
    const rec = Number(received) || po.items[0].qty;
    const acc = Number(accepted) || rec;
    addGrn({
      poId: po.id, vendor: po.vendor, projectId: po.projectId, receivedDate: "2026-07-04",
      materialName: po.items[0].materialName, orderedQty: po.items[0].qty, receivedQty: rec,
      acceptedQty: acc, rejectedQty: rec - acc, remarks: remarks || "Quality OK", store: `${pName(po.projectId)} Site Store`,
    });
    toast.success("GRN created and stock updated", { description: `+${acc} ${po.items[0].materialName} added to inventory` });
    setOpen(false); setReceived(""); setAccepted(""); setRemarks("");
  };

  return (
    <div>
      <PageHeader title="Goods Received Notes (GRN)" description="Record material receipts against POs — accepted quantity updates live inventory." crumbs={[{ label: "Materials", to: "/materials" }, { label: "GRN" }]}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-1 h-4 w-4" /> Create GRN</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Goods Received Note</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>Purchase Order</Label><Select value={poId} onValueChange={setPoId}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent className="max-h-60">{purchaseOrders.map((p) => <SelectItem key={p.id} value={p.id}>{p.id} · {p.vendor}</SelectItem>)}</SelectContent></Select></div>
                {po && <div className="rounded-lg bg-muted/40 p-3 text-sm"><span className="text-muted-foreground">Material:</span> {po.items[0].materialName} · <span className="text-muted-foreground">Ordered:</span> {po.items[0].qty} {po.items[0].uom}</div>}
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Received qty</Label><Input className="mt-1" type="number" value={received} onChange={(e) => setReceived(e.target.value)} placeholder={String(po?.items[0].qty ?? 0)} /></div>
                  <div><Label>Accepted qty</Label><Input className="mt-1" type="number" value={accepted} onChange={(e) => setAccepted(e.target.value)} placeholder={String(po?.items[0].qty ?? 0)} /></div>
                </div>
                <div><Label>Quality remarks</Label><Textarea className="mt-1" value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Quality inspection notes…" /></div>
              </div>
              <DialogFooter><DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose><Button onClick={create}>Create GRN</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead><tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-5 py-3 font-medium">GRN</th><th className="px-3 py-3 font-medium">PO</th><th className="px-3 py-3 font-medium">Vendor</th><th className="px-3 py-3 font-medium">Material</th>
            <th className="px-3 py-3 font-medium">Ordered</th><th className="px-3 py-3 font-medium">Received</th><th className="px-3 py-3 font-medium">Accepted</th><th className="px-3 py-3 font-medium">Rejected</th><th className="px-3 py-3 font-medium">Store</th>
          </tr></thead>
          <tbody>{grns.map((g) => (
            <tr key={g.id} className="border-b last:border-0 hover:bg-accent/40">
              <td className="px-5 py-3 font-medium">{g.id}</td><td className="px-3 py-3 text-muted-foreground">{g.poId}</td><td className="px-3 py-3">{g.vendor}</td><td className="px-3 py-3">{g.materialName}</td>
              <td className="px-3 py-3 tabular-nums">{g.orderedQty}</td><td className="px-3 py-3 tabular-nums">{g.receivedQty}</td><td className="px-3 py-3 tabular-nums text-success">{g.acceptedQty}</td>
              <td className="px-3 py-3 tabular-nums text-danger">{g.rejectedQty}</td><td className="px-3 py-3 text-muted-foreground">{g.store}</td>
            </tr>
          ))}</tbody>
        </table></div>
      </Card>
    </div>
  );
}
