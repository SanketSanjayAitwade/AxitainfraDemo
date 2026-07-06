import { createFileRoute, Link } from "@tanstack/react-router";
import { Boxes, PackageCheck, PackageX, FileClock, ShoppingCart, ClipboardCheck, TrendingDown, IndianRupee } from "lucide-react";
import { StatCard } from "@/components/common/StatCard";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AreaTrend, DonutChart } from "@/components/charts/Charts";
import { useDemo } from "@/store/DemoStore";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/_app/materials/")({
  component: MaterialsOverview,
});

function MaterialsOverview() {
  const { materials, materialRequests, purchaseOrders, grns } = useDemo();
  const stockValue = materials.reduce((s, m) => s + m.stock * m.rate, 0);
  const low = materials.filter((m) => m.stock < m.minStock);
  const reqPending = materialRequests.filter((m) => m.status === "Submitted").length;
  const poOpen = purchaseOrders.filter((p) => p.status !== "Closed" && p.status !== "Received").length;

  const byCat = Object.entries(materials.reduce<Record<string, number>>((acc, m) => {
    acc[m.category] = (acc[m.category] ?? 0) + m.stock * m.rate; return acc;
  }, {})).map(([name, value], i) => ({ name, value: Math.round(value / 100000), color: ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"][i % 5] }));

  const consumption = ["W1", "W2", "W3", "W4", "W5", "W6"].map((label, i) => ({ label, value: 12 + i * 3 + (i % 2) * 4 }));

  return (
    <div>
      <PageHeader
        title="Materials"
        description="End-to-end material flow — request → approval → PO → GRN → inventory → consumption."
        crumbs={[{ label: "Home", to: "/dashboard" }, { label: "Materials" }]}
        actions={<Button asChild><Link to="/materials/requests">New Material Request</Link></Button>}
      />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Total Materials" value={materials.length} icon={Boxes} tone="primary" to="/materials/inventory" />
        <StatCard label="Stock Available" value={`${materials.reduce((s, m) => s + m.stock, 0).toLocaleString("en-IN")}`} icon={PackageCheck} tone="success" sub="units in stores" to="/materials/inventory" />
        <StatCard label="Low Stock Items" value={low.length} icon={PackageX} tone="danger" to="/materials/inventory" />
        <StatCard label="Requests Pending" value={reqPending} icon={FileClock} tone="warning" to="/materials/requests" />
        <StatCard label="Open POs" value={poOpen} icon={ShoppingCart} tone="info" to="/materials/purchase-orders" />
        <StatCard label="GRNs Recorded" value={grns.length} icon={ClipboardCheck} tone="success" to="/materials/grn" />
        <StatCard label="Consumption Today" value="₹1.8 L" icon={TrendingDown} tone="warning" />
        <StatCard label="Stock Value" value={inr(stockValue)} icon={IndianRupee} tone="primary" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card><CardHeader><CardTitle>Stock Value by Category</CardTitle><CardDescription>₹ lakhs</CardDescription></CardHeader><CardContent><DonutChart data={byCat} /></CardContent></Card>
        <Card><CardHeader><CardTitle>Consumption Trend</CardTitle><CardDescription>Weekly value (₹ lakhs)</CardDescription></CardHeader><CardContent><AreaTrend data={consumption} dataKey="value" name="₹ lakhs" color="var(--chart-2)" /></CardContent></Card>
      </div>

      <Card className="mt-4">
        <CardHeader className="flex-row items-center justify-between"><div><CardTitle>Low Stock Alerts</CardTitle><CardDescription>Items below minimum level</CardDescription></div><Button asChild size="sm" variant="secondary"><Link to="/materials/inventory">Manage inventory</Link></Button></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead><tr className="border-y bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground"><th className="px-5 py-2.5 font-medium">Material</th><th className="px-3 py-2.5 font-medium">Current</th><th className="px-3 py-2.5 font-medium">Minimum</th><th className="px-3 py-2.5 font-medium">Status</th></tr></thead>
            <tbody>{low.map((m) => (<tr key={m.id} className="border-b last:border-0"><td className="px-5 py-2.5 font-medium">{m.name}</td><td className="px-3 py-2.5 tabular-nums text-danger">{m.stock} {m.uom}</td><td className="px-3 py-2.5 tabular-nums">{m.minStock} {m.uom}</td><td className="px-3 py-2.5"><StatusBadge status="Critical" /></td></tr>))}</tbody>
          </table></div>
        </CardContent>
      </Card>
    </div>
  );
}
