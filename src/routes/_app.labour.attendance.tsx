import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { useDemo } from "@/store/DemoStore";
import { workPackages, towers, floors } from "@/data/seed";

export const Route = createFileRoute("/_app/labour/attendance")({
  component: AttendancePage,
});

function AttendancePage() {
  const { attendance, projects, contractors, addAttendance } = useDemo();
  const [open, setOpen] = useState(false);
  const [projectId, setProjectId] = useState(projects[0].id);
  const [contractor, setContractor] = useState(contractors[0].name);
  const [wp, setWp] = useState(workPackages[0]);
  const [skilled, setSkilled] = useState("");
  const [unskilled, setUnskilled] = useState("");
  const [ot, setOt] = useState("");

  const pName = (id: string) => projects.find((p) => p.id === id)?.name.split(" ").slice(0, 2).join(" ") ?? "";

  const save = () => {
    const c = contractors.find((x) => x.name === contractor)!;
    addAttendance({
      date: "2026-07-04", projectId, contractor, trade: c.trade, workPackage: wp,
      scope: `${towers[0]} / ${floors[2]}`, skilled: Number(skilled) || 8, unskilled: Number(unskilled) || 12,
      halfDay: 0, overtime: Number(ot) || 0, submittedBy: "Arjun Menon",
    });
    toast.success("Labour attendance submitted", { description: `${(Number(skilled) || 8) + (Number(unskilled) || 12)} workers logged for ${contractor}` });
    setOpen(false); setSkilled(""); setUnskilled(""); setOt("");
  };

  return (
    <div>
      <PageHeader title="Labour Attendance" description="Daily labour headcount by contractor, trade and work location." crumbs={[{ label: "Labour", to: "/labour" }, { label: "Attendance" }]}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-1 h-4 w-4" /> Add Attendance</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Labour Attendance</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Project</Label><Select value={projectId} onValueChange={setProjectId}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent className="max-h-60">{projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent></Select></div>
                  <div><Label>Contractor</Label><Select value={contractor} onValueChange={setContractor}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>{contractors.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent></Select></div>
                </div>
                <div><Label>Work package</Label><Select value={wp} onValueChange={setWp}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>{workPackages.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent></Select></div>
                <div className="grid grid-cols-3 gap-3">
                  <div><Label>Skilled</Label><Input className="mt-1" type="number" value={skilled} onChange={(e) => setSkilled(e.target.value)} placeholder="0" /></div>
                  <div><Label>Unskilled</Label><Input className="mt-1" type="number" value={unskilled} onChange={(e) => setUnskilled(e.target.value)} placeholder="0" /></div>
                  <div><Label>OT hrs</Label><Input className="mt-1" type="number" value={ot} onChange={(e) => setOt(e.target.value)} placeholder="0" /></div>
                </div>
              </div>
              <DialogFooter><DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose><Button onClick={save}>Save Attendance</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead><tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-5 py-3 font-medium">Date</th><th className="px-3 py-3 font-medium">Project</th><th className="px-3 py-3 font-medium">Contractor</th><th className="px-3 py-3 font-medium">Trade</th>
            <th className="px-3 py-3 font-medium">Skilled</th><th className="px-3 py-3 font-medium">Unskilled</th><th className="px-3 py-3 font-medium">Total</th><th className="px-3 py-3 font-medium">Location</th><th className="px-3 py-3 font-medium">Submitted by</th>
          </tr></thead>
          <tbody>{attendance.map((a) => (
            <tr key={a.id} className="border-b last:border-0 hover:bg-accent/40">
              <td className="px-5 py-3">{a.date}</td><td className="px-3 py-3 text-muted-foreground">{pName(a.projectId)}</td><td className="px-3 py-3 font-medium">{a.contractor}</td><td className="px-3 py-3 text-muted-foreground">{a.trade}</td>
              <td className="px-3 py-3 tabular-nums">{a.skilled}</td><td className="px-3 py-3 tabular-nums">{a.unskilled}</td><td className="px-3 py-3 font-semibold tabular-nums">{a.skilled + a.unskilled}</td><td className="px-3 py-3 text-muted-foreground">{a.scope}</td><td className="px-3 py-3 text-muted-foreground">{a.submittedBy}</td>
            </tr>
          ))}</tbody>
        </table></div>
      </Card>
    </div>
  );
}
