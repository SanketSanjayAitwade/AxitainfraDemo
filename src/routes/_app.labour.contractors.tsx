import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useDemo } from "@/store/DemoStore";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/_app/labour/contractors")({
  component: Contractors,
});

function Contractors() {
  const { contractors } = useDemo();
  return (
    <div>
      <PageHeader title="Contractors" description="Contractor roster with deployment, productivity and pending bills." crumbs={[{ label: "Labour", to: "/labour" }, { label: "Contractors" }]} />
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead><tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-5 py-3 font-medium">Contractor</th><th className="px-3 py-3 font-medium">Trade</th><th className="px-3 py-3 font-medium">Projects</th><th className="px-3 py-3 font-medium">Present Today</th>
            <th className="px-3 py-3 font-medium min-w-[140px]">Productivity</th><th className="px-3 py-3 font-medium">Pending Bills</th><th className="px-3 py-3 font-medium">Contact</th><th className="px-3 py-3 font-medium">Status</th>
          </tr></thead>
          <tbody>{contractors.map((c) => (
            <tr key={c.id} className="border-b last:border-0 hover:bg-accent/40">
              <td className="px-5 py-3 font-medium">{c.name}</td><td className="px-3 py-3">{c.trade}</td><td className="px-3 py-3 tabular-nums">{c.projects}</td><td className="px-3 py-3 tabular-nums">{c.presentToday}</td>
              <td className="px-3 py-3"><div className="flex items-center gap-2"><Progress value={c.productivity} className="h-1.5 w-20" /><span className="text-xs tabular-nums">{c.productivity}%</span></div></td>
              <td className="px-3 py-3 font-medium tabular-nums">{inr(c.pendingBills)}</td><td className="px-3 py-3 text-muted-foreground"><div>{c.contact}</div><div className="text-xs">{c.phone}</div></td><td className="px-3 py-3"><StatusBadge status={c.status} /></td>
            </tr>
          ))}</tbody>
        </table></div>
      </Card>
    </div>
  );
}
