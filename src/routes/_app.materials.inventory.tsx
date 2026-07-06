import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useDemo } from "@/store/DemoStore";
import { inr } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Material } from "@/data/types";

export const Route = createFileRoute("/_app/materials/inventory")({
  component: Inventory,
});

function Inventory() {
  const { materials } = useDemo();
  const [sel, setSel] = useState<Material | null>(null);

  const movements = (m: Material) => [
    { date: "2026-07-03", type: "GRN", ref: "GRN-2044", in: 180, out: 0 },
    { date: "2026-07-02", type: "Issue", ref: "MR-1204 · Tower A/Floor 2", in: 0, out: 40 },
    { date: "2026-07-01", type: "Consumption", ref: "DPR-1052 · Plastering", in: 0, out: 25 },
    { date: "2026-06-30", type: "GRN", ref: "GRN-2041", in: 220, out: 0 },
  ];

  return (
    <div>
      <PageHeader title="Inventory / Stock" description="Site-wise stock ledger with opening, received, issued, consumed and closing balances." crumbs={[{ label: "Materials", to: "/materials" }, { label: "Inventory" }]} />
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3 font-medium">Material</th><th className="px-3 py-3 font-medium">Category</th><th className="px-3 py-3 font-medium">Opening</th>
              <th className="px-3 py-3 font-medium">Received</th><th className="px-3 py-3 font-medium">Issued</th><th className="px-3 py-3 font-medium">Consumed</th>
              <th className="px-3 py-3 font-medium">Closing</th><th className="px-3 py-3 font-medium">Min</th><th className="px-3 py-3 font-medium">Value</th><th className="px-3 py-3 font-medium">Status</th>
            </tr></thead>
            <tbody>
              {materials.map((m) => {
                const low = m.stock < m.minStock;
                const received = Math.round(m.stock * 0.4), issued = Math.round(m.stock * 0.15), consumed = Math.round(m.stock * 0.1);
                return (
                  <tr key={m.id} onClick={() => setSel(m)} className={cn("cursor-pointer border-b last:border-0 hover:bg-accent/40", low && "bg-danger-soft/40")}>
                    <td className="px-5 py-3 font-medium">{m.name}</td>
                    <td className="px-3 py-3 text-muted-foreground">{m.category}</td>
                    <td className="px-3 py-3 tabular-nums">{m.stock - received + issued + consumed}</td>
                    <td className="px-3 py-3 tabular-nums text-success">+{received}</td>
                    <td className="px-3 py-3 tabular-nums text-warning-foreground">-{issued}</td>
                    <td className="px-3 py-3 tabular-nums text-danger">-{consumed}</td>
                    <td className="px-3 py-3 font-semibold tabular-nums">{m.stock} {m.uom}</td>
                    <td className="px-3 py-3 tabular-nums text-muted-foreground">{m.minStock}</td>
                    <td className="px-3 py-3 tabular-nums">{inr(m.stock * m.rate)}</td>
                    <td className="px-3 py-3"><StatusBadge status={low ? "Critical" : m.stock < m.minStock * 1.5 ? "At Risk" : "Good"} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Sheet open={!!sel} onOpenChange={(o) => !o && setSel(null)}>
        <SheetContent className="w-full sm:max-w-md p-6">
          {sel && <>
            <SheetHeader className="p-0"><SheetTitle>{sel.name}</SheetTitle><SheetDescription>Stock movement ledger · {sel.category}</SheetDescription></SheetHeader>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg border bg-muted/30 p-3"><div className="text-xs text-muted-foreground">Current stock</div><div className="text-lg font-bold">{sel.stock} {sel.uom}</div></div>
              <div className="rounded-lg border bg-muted/30 p-3"><div className="text-xs text-muted-foreground">Stock value</div><div className="text-lg font-bold">{inr(sel.stock * sel.rate)}</div></div>
            </div>
            <div className="mt-5 space-y-2">
              <div className="text-sm font-medium">Recent movements</div>
              {movements(sel).map((mv, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                  <div><div className="font-medium">{mv.type}</div><div className="text-xs text-muted-foreground">{mv.ref} · {mv.date}</div></div>
                  <div className="text-right tabular-nums">{mv.in > 0 ? <span className="text-success">+{mv.in}</span> : <span className="text-danger">-{mv.out}</span>}</div>
                </div>
              ))}
            </div>
          </>}
        </SheetContent>
      </Sheet>
    </div>
  );
}
