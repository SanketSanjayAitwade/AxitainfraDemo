import {
  LayoutDashboard,
  Users,
  MapPinned,
  Clock3,
  CalendarRange,
  Wallet,
  BriefcaseBusiness,
  DoorOpen,
  ChartColumnBig,
  type LucideIcon,
} from "lucide-react";

export interface HrNavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

export const hrNavItems: HrNavItem[] = [
  { label: "Overview", to: "/hr", icon: LayoutDashboard },
  { label: "Employees", to: "/hr/employees", icon: Users },
  { label: "Employee Tracking", to: "/hr/tracking", icon: MapPinned },
  { label: "Attendance", to: "/hr/attendance", icon: Clock3 },
  { label: "Leave", to: "/hr/leave", icon: CalendarRange },
  { label: "Payroll", to: "/hr/payroll", icon: Wallet },
  { label: "Recruitment", to: "/hr/recruitment", icon: BriefcaseBusiness },
  { label: "Onboarding", to: "/hr/onboarding", icon: DoorOpen },
  { label: "Reports", to: "/hr/reports", icon: ChartColumnBig },
];
