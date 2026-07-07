import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { HardHat, ArrowRight, ShieldCheck, Package, HardHat as Hat, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useDemo } from "@/store/DemoStore";

export const Route = createFileRoute("/")({
  component: Login,
});

const logins: Array<{ role: string; name: string; desc: string }> = [
  { role: "Super Admin", name: "Vikram Rao", desc: "Full platform control & configuration" },
  { role: "Project Manager", name: "Rajesh Kumar", desc: "Projects, tasks, DPR & approvals" },
  { role: "Site Engineer", name: "Arjun Menon", desc: "Site execution, DPR & requests" },
  { role: "Store Manager", name: "Sameer Khan", desc: "Inventory, GRN & material issue" },
];

const highlights = [
  { icon: ShieldCheck, text: "Custom role-based access" },
  { icon: Package, text: "Material request → PO → GRN → stock" },
  { icon: Hat, text: "Labour attendance & productivity" },
  { icon: BarChart3, text: "Real-time project health analytics" },
];

function Login() {
  const { login } = useDemo();
  const navigate = useNavigate();
  const signIn = (role: string, name: string) => {
    login(role, name);
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-sidebar p-12 text-sidebar-foreground lg:flex">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
            <HardHat className="h-6 w-6" />
          </div>
          <div>
            <div className="text-lg font-bold text-white">Axita Infrastructure</div>
            <div className="text-xs text-sidebar-foreground/60">
              Enterprise Construction Platform
            </div>
          </div>
        </div>
        <div className="relative max-w-md">
          <h1 className="text-4xl font-bold leading-tight text-white">
            Project control, material flow, labour tracking, and real-time construction visibility.
          </h1>
          <p className="mt-4 text-sidebar-foreground/70">
            Enterprise construction management platform for project control, materials, labour, DPR,
            approvals, and analytics — across 21 live projects.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {highlights.map((h) => (
              <div
                key={h.text}
                className="flex items-center gap-2.5 rounded-lg bg-sidebar-accent/40 px-3 py-2.5"
              >
                <h.icon className="h-4 w-4 text-sidebar-primary shrink-0" />
                <span className="text-xs text-sidebar-foreground/90">{h.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative text-xs text-sidebar-foreground/40">
          © 2026 Axita Infrastructure Pvt Ltd · Interactive product demo
        </div>
      </div>

      {/* Login panel */}
      <div className="flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <HardHat className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold">Axita Infrastructure</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Sign in to continue</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a role to explore the demo with tailored permissions.
          </p>
          <div className="mt-6 space-y-3">
            {logins.map((l) => (
              <button
                key={l.role}
                onClick={() => signIn(l.role, l.name)}
                className="w-full text-left"
              >
                <Card className="group flex-row items-center justify-between gap-3 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {l.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                    <div>
                      <div className="text-sm font-semibold">Login as {l.role}</div>
                      <div className="text-xs text-muted-foreground">{l.desc}</div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </Card>
              </button>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            This is a front-end demo. All data is simulated for presentation purposes.
          </p>
        </div>
      </div>
    </div>
  );
}
