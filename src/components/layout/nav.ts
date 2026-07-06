import {
  LayoutDashboard, Building2, Grid3x3, ListChecks, Package, HardHat,
  CheckCircle2, BarChart3, ShieldCheck, Users, Settings, type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  children?: { label: string; to: string }[];
}

export const navItems: NavItem[] = [
  { label: "Executive Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", to: "/projects", icon: Building2 },
  { label: "Project Matrix", to: "/matrix", icon: Grid3x3 },
  {
    label: "Tasks & DPR", to: "/tasks", icon: ListChecks,
    children: [
      { label: "All Tasks", to: "/tasks" },
      { label: "Daily DPR", to: "/dpr" },
    ],
  },
  {
    label: "Materials", to: "/materials", icon: Package,
    children: [
      { label: "Overview", to: "/materials" },
      { label: "Requests", to: "/materials/requests" },
      { label: "Inventory", to: "/materials/inventory" },
      { label: "Purchase Orders", to: "/materials/purchase-orders" },
      { label: "GRN", to: "/materials/grn" },
    ],
  },
  {
    label: "Labour", to: "/labour", icon: HardHat,
    children: [
      { label: "Overview", to: "/labour" },
      { label: "Attendance", to: "/labour/attendance" },
      { label: "Contractors", to: "/labour/contractors" },
      { label: "Productivity", to: "/labour/productivity" },
    ],
  },
  { label: "Approvals", to: "/approvals", icon: CheckCircle2 },
  { label: "Reports", to: "/reports", icon: BarChart3 },
  { label: "Role Builder", to: "/roles", icon: ShieldCheck },
  { label: "Users", to: "/users", icon: Users },
  { label: "Settings", to: "/settings", icon: Settings },
];
