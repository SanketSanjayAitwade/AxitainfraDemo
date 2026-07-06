import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, ShieldCheck, Lock } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useDemo } from "@/store/DemoStore";
import { permissionGroups } from "@/data/seed";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/roles")({
  component: RoleBuilder,
});

function RoleBuilder() {
  const { roles, saveRole } = useDemo();
  const [selectedId, setSelectedId] = useState(roles[0].id);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [perms, setPerms] = useState<string[]>([]);

  const role = roles.find((r) => r.id === selectedId);
  const activePerms = creating ? perms : role?.permissions ?? [];

  const toggle = (p: string) => {
    if (!creating) return;
    setPerms((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);
  };

  const startCreate = () => { setCreating(true); setName(""); setDesc(""); setPerms(["View executive dashboard", "View projects"]); };
  const save = () => {
    if (creating) {
      saveRole({ name: name || "Custom Role", description: desc || "Custom role", users: 0, system: false, permissions: perms });
      toast.success("Custom role saved successfully", { description: `${name || "Custom Role"} · ${perms.length} permissions` });
      setCreating(false);
    } else {
      toast.success("Role permissions updated", { description: role?.name });
    }
  };

  return (
    <div>
      <PageHeader title="Role Builder" description="Create custom roles with granular module and action-level permissions per user." crumbs={[{ label: "Home", to: "/dashboard" }, { label: "Role Builder" }]}
        actions={<Button onClick={startCreate}><Plus className="mr-1 h-4 w-4" /> Create Custom Role</Button>} />

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <Card className="p-0 lg:sticky lg:top-20 lg:self-start">
          <CardHeader className="border-b py-3"><CardTitle className="text-sm">Roles</CardTitle></CardHeader>
          <CardContent className="max-h-[70vh] space-y-1 overflow-y-auto p-2">
            {roles.map((r) => (
              <button key={r.id} onClick={() => { setSelectedId(r.id); setCreating(false); }}
                className={cn("flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm", selectedId === r.id && !creating ? "bg-primary/10 text-primary" : "hover:bg-accent")}>
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <div className="min-w-0 flex-1"><div className="truncate font-medium">{r.name}</div><div className="text-xs text-muted-foreground">{r.users} users · {r.permissions.length} perms</div></div>
                {r.system && <Lock className="h-3 w-3 text-muted-foreground" />}
              </button>
            ))}
            {creating && <div className="rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary">New Custom Role</div>}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card><CardContent className="grid gap-3 py-5 sm:grid-cols-2">
            <div><Label>Role name</Label><Input className="mt-1" value={creating ? name : role?.name ?? ""} onChange={(e) => setName(e.target.value)} disabled={!creating} /></div>
            <div><Label>Description</Label><Input className="mt-1" value={creating ? desc : role?.description ?? ""} onChange={(e) => setDesc(e.target.value)} disabled={!creating} /></div>
            <div className="sm:col-span-2 flex items-center gap-2 text-sm text-muted-foreground"><Badge variant="secondary">Project access: All 21 projects</Badge>{role?.system && !creating && <Badge variant="outline">System role (read-only)</Badge>}</div>
          </CardContent></Card>

          <Card><CardHeader><CardTitle className="text-base">Module Permissions</CardTitle></CardHeader><CardContent className="grid gap-5 sm:grid-cols-2">
            {permissionGroups.map((g) => (
              <div key={g.group}>
                <div className="mb-2 text-sm font-semibold">{g.group}</div>
                <div className="space-y-2">
                  {g.perms.map((p) => (
                    <div key={p} className="flex items-center justify-between gap-2">
                      <span className="text-sm text-muted-foreground">{p}</span>
                      <Switch checked={activePerms.includes(p)} onCheckedChange={() => toggle(p)} disabled={!creating} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent></Card>

          <div className="flex justify-end gap-2">
            {creating && <Button variant="ghost" onClick={() => setCreating(false)}>Cancel</Button>}
            <Button onClick={save}>{creating ? "Save Role" : "Update Permissions"}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
