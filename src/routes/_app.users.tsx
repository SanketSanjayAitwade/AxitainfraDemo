import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
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
import { initials } from "@/lib/format";

export const Route = createFileRoute("/_app/users")({
  component: Users,
});

function Users() {
  const { users, roles, addUser } = useDemo();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dept, setDept] = useState("Site");
  const [role, setRole] = useState(roles[3].name);

  const create = () => {
    addUser({ name: name || "New User", email: email || "new.user@buildmatrix.in", phone: phone || "+91 90000 00000", role, projects: 3, department: dept, status: "Active", lastLogin: "Just now" });
    toast.success("User added", { description: `${name || "New User"} · ${role}` });
    setOpen(false); setName(""); setEmail(""); setPhone("");
  };

  return (
    <div>
      <PageHeader title="Users" description="Manage users, roles and project access." crumbs={[{ label: "Home", to: "/dashboard" }, { label: "Users" }]}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-1 h-4 w-4" /> Add User</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add User</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3"><div><Label>Name</Label><Input className="mt-1" value={name} onChange={(e) => setName(e.target.value)} /></div><div><Label>Mobile</Label><Input className="mt-1" value={phone} onChange={(e) => setPhone(e.target.value)} /></div></div>
                <div><Label>Email</Label><Input className="mt-1" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Department</Label><Select value={dept} onValueChange={setDept}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>{["Management", "Operations", "Projects", "Site", "Planning", "Stores", "Procurement", "HR", "Finance"].map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select></div>
                  <div><Label>Role</Label><Select value={role} onValueChange={setRole}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent className="max-h-60">{roles.map((r) => <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>)}</SelectContent></Select></div>
                </div>
                <div><Label>Project access</Label><Input className="mt-1" placeholder="All 21 projects" disabled /></div>
              </div>
              <DialogFooter><DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose><Button onClick={create}>Add User</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead><tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-5 py-3 font-medium">User</th><th className="px-3 py-3 font-medium">Contact</th><th className="px-3 py-3 font-medium">Role</th><th className="px-3 py-3 font-medium">Department</th>
            <th className="px-3 py-3 font-medium">Projects</th><th className="px-3 py-3 font-medium">Last login</th><th className="px-3 py-3 font-medium">Status</th><th className="px-3 py-3 font-medium">Actions</th>
          </tr></thead>
          <tbody>{users.map((u) => (
            <tr key={u.id} className="border-b last:border-0 hover:bg-accent/40">
              <td className="px-5 py-3"><div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{initials(u.name)}</span><span className="font-medium">{u.name}</span></div></td>
              <td className="px-3 py-3 text-muted-foreground"><div>{u.email}</div><div className="text-xs">{u.phone}</div></td>
              <td className="px-3 py-3">{u.role}</td><td className="px-3 py-3 text-muted-foreground">{u.department}</td><td className="px-3 py-3 tabular-nums">{u.projects}</td>
              <td className="px-3 py-3 text-muted-foreground">{u.lastLogin}</td><td className="px-3 py-3"><StatusBadge status={u.status} /></td>
              <td className="px-3 py-3"><Button size="sm" variant="ghost" onClick={() => toast.success(`${u.status === "Active" ? "Deactivated" : "Activated"} ${u.name}`)}>{u.status === "Active" ? "Deactivate" : "Activate"}</Button></td>
            </tr>
          ))}</tbody>
        </table></div>
      </Card>
    </div>
  );
}
