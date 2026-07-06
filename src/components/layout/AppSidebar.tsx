import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, HardHat } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems, type NavItem } from "./nav";

function NavRow({ item, pathname, onNavigate }: { item: NavItem; pathname: string; onNavigate?: () => void }) {
  const active = item.to === "/dashboard" ? pathname === item.to : pathname === item.to || pathname.startsWith(item.to + "/");
  const [open, setOpen] = useState(active);
  const Icon = item.icon;

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
          )}
        >
          <Icon className="h-4.5 w-4.5 shrink-0" strokeWidth={2} />
          <span className="flex-1 text-left">{item.label}</span>
          <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
        </button>
        {open && (
          <div className="mt-1 ml-4 space-y-0.5 border-l border-sidebar-border pl-3">
            {item.children.map((c) => {
              const cActive = pathname === c.to;
              return (
                <Link
                  key={c.to} to={c.to} onClick={onNavigate}
                  className={cn(
                    "block rounded-md px-3 py-1.5 text-sm transition-colors",
                    cActive ? "bg-sidebar-primary/15 text-sidebar-primary-foreground font-medium" : "text-sidebar-foreground/80 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/40",
                  )}
                >
                  {c.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={item.to} onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm" : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
      )}
    >
      <Icon className="h-4.5 w-4.5 shrink-0" strokeWidth={2} />
      {item.label}
    </Link>
  );
}

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2.5 px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <HardHat className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-bold text-white">Axita</div>
          <div className="text-[10px] font-medium uppercase tracking-wider text-sidebar-foreground/60">Infrastructure</div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {navItems.map((item) => (
          <NavRow key={item.to} item={item} pathname={pathname} onNavigate={onNavigate} />
        ))}
      </nav>
      <div className="border-t border-sidebar-border px-5 py-3 text-[11px] text-sidebar-foreground/50">
        v2.4.0 · 21 active projects
      </div>
    </div>
  );
}

export function AppSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-sidebar-border lg:block">
      <div className="fixed h-screen w-64">
        <SidebarContent />
      </div>
    </aside>
  );
}
