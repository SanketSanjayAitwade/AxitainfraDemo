import { Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, ChevronRight, Menu, Search, Shield, Sparkles } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { hrNavItems, type HrNavItem } from "./hr-nav";

function HrNavLink({
  item,
  pathname,
  onNavigate,
}: {
  item: HrNavItem;
  pathname: string;
  onNavigate?: () => void;
}) {
  const active =
    item.to === "/hr"
      ? pathname === item.to
      : pathname === item.to || pathname.startsWith(`${item.to}/`);
  const Icon = item.icon;

  return (
    <Link
      to={item.to}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-emerald-400/15 text-white ring-1 ring-emerald-300/30"
          : "text-slate-300 hover:bg-white/5 hover:text-white",
      )}
    >
      <Icon className="h-4.5 w-4.5 shrink-0" />
      <span>{item.label}</span>
    </Link>
  );
}

function HrSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex h-full flex-col bg-slate-950 text-slate-100">
      <div className="border-b border-white/10 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-300/25">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">BuildFlow HR</div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
              People Operations
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-slate-300">
          <div className="flex items-center gap-2 text-emerald-300">
            <Sparkles className="h-3.5 w-3.5" />
            Mock workspace
          </div>
          <p className="mt-2 leading-relaxed">
            Employee tracking, payroll, leave, onboarding, and recruitment in one separate top-level
            area.
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {hrNavItems.map((item) => (
          <HrNavLink key={item.to} item={item} pathname={pathname} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="rounded-2xl bg-white/5 p-3">
          <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Demo snapshot</div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
            <div>
              <div className="text-slate-400">Employees</div>
              <div className="font-semibold text-white">12</div>
            </div>
            <div>
              <div className="text-slate-400">Active sites</div>
              <div className="font-semibold text-white">6</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HrShell() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const section =
    hrNavItems.find((item) =>
      item.to === "/hr" ? pathname === item.to : pathname.startsWith(`${item.to}/`),
    )?.label ?? "Overview";

  return (
    <div
      className="min-h-screen text-slate-950"
      style={{
        backgroundImage:
          "radial-gradient(circle at top left, rgba(16,185,129,0.14), transparent 30%), radial-gradient(circle at 90% 10%, rgba(245,158,11,0.10), transparent 26%), linear-gradient(180deg, #f8fafc 0%, #eefdf7 100%)",
      }}
    >
      <aside className="hidden w-72 shrink-0 lg:fixed lg:inset-y-0 lg:left-0 lg:block lg:border-r lg:border-slate-200/80">
        <div className="h-full">
          <HrSidebar />
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-3 px-4 lg:px-6">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button className="rounded-lg p-2 hover:bg-slate-100 lg:hidden">
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 [&>button]:text-white">
                <SheetTitle className="sr-only">HR navigation</SheetTitle>
                <HrSidebar onNavigate={() => setOpen(false)} />
              </SheetContent>
            </Sheet>

            <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800 sm:flex">
              <Building2 className="h-3.5 w-3.5" />
              Separate HR area
            </div>

            <div className="relative hidden flex-1 max-w-lg md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder={`Search employees, leave, payroll...`}
                className="border-slate-200 bg-slate-50 pl-9"
              />
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/dashboard">
                  Main ERP
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="sm" onClick={() => navigate({ to: "/hr/tracking" })}>
                Open tracking
              </Button>
            </div>
          </div>
          <div className="border-t border-slate-200/80 px-4 py-3 lg:px-6">
            <div className="text-sm font-medium text-slate-900">{section}</div>
            <div className="text-xs text-slate-500">
              HR module with mock people-ops data and live-style tracking surfaces.
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1600px] px-4 py-6 lg:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
