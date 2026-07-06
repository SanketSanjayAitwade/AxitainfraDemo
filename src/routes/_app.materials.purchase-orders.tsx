import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { useDemo } from "@/store/DemoStore";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/_app/materials/purchase-orders")({
  component: POs,
});

const vendors = ["UltraTech Supplies", "JSW Steel Depot", "Asian Paints Dealer", "Kajaria Tiles Hub", "Finolex Pipes", "Havells Distributors"];

function POs() {
  const { purchaseOrders, projects, materials, addPurchaseOrder } = useDemo();
  const [open, setOpen] = useState(false);
  const [vendor, setVendor] = useState(vendors[0]);
  const [projectId, setProjectId] = useState(projects[0].id);
  const [lines, setLines] = useState([{ materialName: materials[0].name, qty: 100, rate: materials[0].rate }]);

  const amount = lines.reduce((s, l) => s + l.qty * l.rate, 0);
  const pName = (id: string) => projects.find((p) => p.id === id)?.name.split(" ").slice(0, 2).join(" ") ?? "";

  const create = () => {
    addPurchaseOrder({
      vendor, projectId, items: lines.map((l) => ({ ...l, uom: materials.find((m) => m.name === l.materialName)?.uom ?? "Nos" })),
      amount, deliveryDate: "2026-07-25", status: "Sent to Vendor", createdDate: "2026-07-04",
    });
    toast.success("Purchase order created", { description: `${vendor} · ${inr(amount)}` });
    setOpen(false); setLines([{ materialName: materials[0].name, qty: 100, rate: materials[0].rate }]);
  };

  return (
    <div>
      <PageHeader title="Purchase Orders" description="Procurement pipeline from draft to vendor to receipt." crumbs={[{ label: "Materials", to: "/materials" }, { label: "Purchase Orders" }]}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-1 h-4 w-4" /> Create PO</Button></DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader><DialogTitle>Create Purchase Order</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Vendor</Label><Select value={vendor} onValueChange={setVendor}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>{vendors.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent></Select></div>
                  <div><Label>Project</Label><Select value={projectId} onValueChange={setProjectId}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent className="max-h-60">{projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent></Select></div>
                </div>
                <div>
                  <Label>Line items</Label>
                  <div className="mt-1 space-y-2">
                    {lines.map((l, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Select value={l.materialName} onValueChange={(v) => setLines((p) => p.map((x, j) => j === i ? { ...x, materialName: v, rate: materials.find((m) => m.name === v)?.rate ?? x.rate } : x))}>
                          <SelectTrigger className="flex-1"><SelectValue /></SelectTrigger><SelectContent className="max-h-60">{materials.map((m) => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}</SelectContent>
                        </Select>
                        <Input className="w-20" type="number" value={l.qty} onChange={(e) => setLines((p) => p.map((x, j) => j === i ? { ...x, qty: Number(e.target.value) } : x))} />
                        <Input className="w-24" type="number" value={l.rate} onChange={(e) => setLines((p) => p.map((x, j) => j === i ? { ...x, rate: Number(e.target.value) } : x))} />
                        <button className="text-danger" onClick={() => setLines((p) => p.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4" /></button>
                      </div>
                    ))}
                    <Button size="sm" variant="secondary" onClick={() => setLines((p) => [...p, { materialName: materials[0].name, qty: 50, rate: materials[0].rate }])}><Plus className="mr-1 h-3 w-3" /> Add line</Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Delivery date</Label><Input className="mt-1" type="date" defaultValue="2026-07-25" /></div>
                  <div><Label>Terms</Label><Input className="mt-1" placeholder="Net 30, incl. GST" /></div>
                </div>
                <div className="flex justify-between rounded-lg bg-muted/40 p-3 text-sm font-medium">Total (incl. tax est.) <span>{inr(Math.round(amount * 1.18))}</span></div>
              </div>
              <DialogFooter><DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose><Button onClick={create}>Save PO</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead><tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-5 py-3 font-medium">PO Number</th><th className="px-3 py-3 font-medium">Vendor</th><th className="px-3 py-3 font-medium">Project</th>
            <th className="px-3 py-3 font-medium">Items</th><th className="px-3 py-3 font-medium">Amount</th><th className="px-3 py-3 font-medium">Delivery</th><th className="px-3 py-3 font-medium">Status</th>
          </tr></thead>
          <tbody>{purchaseOrders.map((po) => (
            <tr key={po.id} className="border-b last:border-0 hover:bg-accent/40">
              <td className="px-5 py-3 font-medium">{po.id}</td><td className="px-3 py-3">{po.vendor}</td><td className="px-3 py-3 text-muted-foreground">{pName(po.projectId)}</td>
              <td className="px-3 py-3 text-muted-foreground">{po.items.length} items · {po.items.reduce((s, i) => s + i.qty, 0)} units</td>
              <td className="px-3 py-3 font-medium tabular-nums">{inr(po.amount)}</td><td className="px-3 py-3 text-muted-foreground">{po.deliveryDate}</td><td className="px-3 py-3"><StatusBadge status={po.status} /></td>
            </tr>
          ))}</tbody>
        </table></div>
      </Card>
    </div>
  );
}
