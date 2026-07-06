import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { CompareBar } from "@/components/charts/Charts";
import { useDemo } from "@/store/DemoStore";

export const Route = createFileRoute("/_app/labour/productivity")({
  component: Productivity,
});

function Productivity() {
  const { tasks, projects, contractors } = useDemo();
  const rows = tasks.filter((t) => t.status === "In Progress" || t.status === "Completed").slice(0, 14).map((t, i) => {
    const labour = 8 + (i * 3) % 20;
    const ratio = +(t.completedQty / labour / 10).toFixed(1);
    const status = ratio > 8 ? "Good" : ratio > 4 ? "Fair" : "At Risk";
    return { t, labour, ratio, status };
  });
  const chart = contractors.map((c) => ({ label: c.name.split(" ")[0], Productivity: c.productivity }));

  return (
    <div>
      <PageHeader title="Labour Productivity" description="Output per worker by project, contractor, work package and task." crumbs={[{ label: "Labour", to: "/labour" }, { label: "Productivity" }]} />
      <Card className="mb-4"><CardHeader><CardTitle>Contractor Productivity Index</CardTitle><CardDescription>Higher is better</CardDescription></CardHeader><CardContent><CompareBar data={chart} keys={[{ key: "Productivity", name: "Productivity %", color: "var(--chart-2)" }]} /></CardContent></Card>
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead><tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-5 py-3 font-medium">Task</th><th className="px-3 py-3 font-medium">Project</th><th className="px-3 py-3 font-medium">Work Package</th>
            <th className="px-3 py-3 font-medium">Labour</th><th className="px-3 py-3 font-medium">Completed</th><th className="px-3 py-3 font-medium">Productivity</th><th className="px-3 py-3 font-medium">Status</th>
          </tr></thead>
          <tbody>{rows.map(({ t, labour, ratio, status }) => (
            <tr key={t.id} className="border-b last:border-0 hover:bg-accent/40">
              <td className="px-5 py-3 font-medium">{t.name.split(" — ")[0]}</td>
              <td className="px-3 py-3 text-muted-foreground">{projects.find((p) => p.id === t.projectId)?.name.split(" ").slice(0, 2).join(" ")}</td>
              <td className="px-3 py-3">{t.category}</td><td className="px-3 py-3 tabular-nums">{labour}</td><td className="px-3 py-3 tabular-nums">{t.completedQty} {t.uom}</td>
              <td className="px-3 py-3 font-medium tabular-nums">{ratio} {t.uom}/labour/day</td><td className="px-3 py-3"><StatusBadge status={status} /></td>
            </tr>
          ))}</tbody>
        </table></div>
      </Card>
    </div>
  );
}
