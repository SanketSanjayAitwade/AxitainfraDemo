// ============================================================================
// HR & Employee Tracking — demo data (DigiSME-style employee operations)
// Scope: attendance, leave, payroll, live tracking. Not a full HRMS.
// ============================================================================

export type AttendanceStatus =
  | "Present"
  | "Absent"
  | "Late"
  | "Half Day"
  | "On Leave"
  | "Weekly Off"
  | "Holiday"
  | "Overtime"
  | "Missed Punch";

export type LeaveType =
  "Casual Leave" | "Sick Leave" | "Paid Leave" | "Unpaid Leave" | "Emergency Leave" | "Comp Off";

export type LeaveStatus = "Pending" | "Approved" | "Rejected" | "Cancelled";

export type TrackStatus =
  | "Online"
  | "Offline"
  | "On Site"
  | "Travelling"
  | "Outside Geo-fence"
  | "Tracking Disabled"
  | "Battery Low"
  | "No Location Permission";

export type PayrollStatus = "Draft" | "Under Review" | "Approved" | "Paid";
export type PayItemStatus = "Draft" | "Review" | "Approved" | "Paid";

export interface Shift {
  id: string;
  name: string;
  start: string;
  end: string;
  grace: number;
  weeklyOff: string;
  status: "Active" | "Inactive";
}

export interface Employee {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  department: string;
  designation: string;
  manager: string;
  site: string;
  shift: string;
  monthlySalary: number;
  leavePolicy: string;
  trackingEnabled: boolean;
  status: "Active" | "Inactive";
}

export interface AttendanceLog {
  id: string;
  employeeId: string;
  employee: string;
  date: string;
  shift: string;
  clockIn: string | null;
  clockOut: string | null;
  status: AttendanceStatus;
  location: string;
  workHours: string;
  faceVerified: boolean;
  insideGeofence: boolean;
  overtime: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employee: string;
  type: LeaveType;
  from: string;
  to: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  approver: string;
  appliedOn: string;
}

export interface LeaveBalanceRow {
  type: LeaveType;
  total: number;
  used: number;
  balance: number;
}

export interface PayrollItem {
  id: string;
  employeeId: string;
  employee: string;
  code: string;
  presentDays: number;
  paidLeave: number;
  lop: number;
  overtimeHrs: number;
  gross: number;
  deductions: number;
  net: number;
  status: PayItemStatus;
}

export interface EmployeeLocation {
  employeeId: string;
  employee: string;
  status: TrackStatus;
  lastUpdate: string;
  location: string;
  battery: number;
  network: string;
  assignedSite: string;
  distanceFromSite: string;
  clockInLocation: string;
  x: number;
  y: number;
  lat: number;
  lng: number;
}

export interface LocationEvent {
  time: string;
  location: string;
  event: string;
}

export interface GeoFence {
  id: string;
  name: string;
  site: string;
  radius: number;
  status: "Active" | "Inactive";
  employees: number;
}

export const shifts: Shift[] = [
  {
    id: "SH-01",
    name: "General Shift",
    start: "09:00",
    end: "18:00",
    grace: 10,
    weeklyOff: "Sunday",
    status: "Active",
  },
  {
    id: "SH-02",
    name: "Morning Shift",
    start: "07:00",
    end: "16:00",
    grace: 10,
    weeklyOff: "Sunday",
    status: "Active",
  },
  {
    id: "SH-03",
    name: "Field Shift",
    start: "08:30",
    end: "17:30",
    grace: 15,
    weeklyOff: "Sunday",
    status: "Active",
  },
  {
    id: "SH-04",
    name: "Night Shift",
    start: "20:00",
    end: "05:00",
    grace: 15,
    weeklyOff: "Monday",
    status: "Inactive",
  },
];

const empSeed: Array<[string, string, string, string, string, string, number]> = [
  [
    "Ramesh Kumar",
    "Site Operations",
    "Site Supervisor",
    "Vijay Menon",
    "Site A",
    "General Shift",
    35000,
  ],
  [
    "Priya Sharma",
    "Projects",
    "Project Engineer",
    "Anjali Gupta",
    "Office",
    "General Shift",
    42000,
  ],
  [
    "Ajay Singh",
    "Field Service",
    "Field Technician",
    "Vijay Menon",
    "Site B",
    "Field Shift",
    30000,
  ],
  ["Kiran Rao", "Admin", "Admin Executive", "Anjali Gupta", "Office", "General Shift", 28000],
  ["Suresh Patel", "Site Operations", "Foreman", "Ramesh Kumar", "Site A", "Morning Shift", 32000],
  [
    "Manoj Verma",
    "Field Service",
    "Field Technician",
    "Vijay Menon",
    "Site C",
    "Field Shift",
    29000,
  ],
  ["Deepak Nair", "Site Operations", "Surveyor", "Ramesh Kumar", "Site B", "General Shift", 34000],
  [
    "Sunita Reddy",
    "Finance",
    "Accounts Executive",
    "Anjali Gupta",
    "Office",
    "General Shift",
    38000,
  ],
  ["Vijay Menon", "Projects", "Project Manager", "Sanjay Pillai", "Office", "General Shift", 65000],
  ["Anjali Gupta", "Admin", "HR Manager", "Sanjay Pillai", "Office", "General Shift", 58000],
  [
    "Rahul Joshi",
    "Field Service",
    "Field Technician",
    "Vijay Menon",
    "Site A",
    "Field Shift",
    27000,
  ],
  ["Neha Iyer", "Projects", "Site Engineer", "Vijay Menon", "Site C", "General Shift", 40000],
  [
    "Sanjay Pillai",
    "Projects",
    "Operations Head",
    "Sanjay Pillai",
    "Office",
    "General Shift",
    90000,
  ],
  ["Pooja Desai", "Finance", "Payroll Officer", "Anjali Gupta", "Office", "General Shift", 36000],
  [
    "Arjun Shetty",
    "Site Operations",
    "Site Supervisor",
    "Ramesh Kumar",
    "Site B",
    "Morning Shift",
    33000,
  ],
  [
    "Kavya Nair",
    "Field Service",
    "Field Technician",
    "Vijay Menon",
    "Site A",
    "Field Shift",
    26000,
  ],
];

export const employees: Employee[] = empSeed.map((e, i) => ({
  id: `E-${String(i + 1).padStart(3, "0")}`,
  code: `AX${String(1001 + i)}`,
  name: e[0],
  phone: `+91 9${String(820000000 + i * 111133).slice(0, 9)}`,
  email: `${e[0].toLowerCase().replace(/ /g, ".")}@axita.in`,
  department: e[1],
  designation: e[2],
  manager: e[3],
  site: e[4],
  shift: e[5],
  monthlySalary: e[6],
  leavePolicy: "Standard 2026",
  trackingEnabled: i % 7 !== 3,
  status: "Active",
}));

export const hrSummary = {
  totalEmployees: 63,
  presentToday: 42,
  absentToday: 6,
  lateToday: 8,
  onLeaveToday: 4,
  notCheckedIn: 3,
  payrollPending: 21,
  trackingActive: 38,
  onSite: 27,
  travelling: 9,
  outsideZone: 2,
  trackingInactive: 25,
  lastLocationUpdate: "2 min ago",
  payrollMonth: "July 2026",
  payrollProcessed: 42,
  payrollGross: 2380000,
  payrollDeductions: 148500,
  payrollNet: 2231500,
  payslipsGenerated: 42,
  payrollStatus: "Under Review" as PayrollStatus,
  leavePending: 5,
  leaveApprovedWeek: 11,
  leaveRejected: 2,
  leaveUpcoming: 7,
};

const attSeed: Array<
  [AttendanceStatus, string | null, string | null, string, string, boolean, boolean, number]
> = [
  ["Late", "09:12", "18:20", "Site A", "9h 08m", true, true, 0],
  ["Present", "08:58", "18:04", "Office", "9h 06m", true, true, 0],
  ["Present", "08:30", "17:36", "Site B", "9h 06m", true, true, 1],
  ["Present", "09:02", "18:10", "Office", "9h 08m", true, true, 0],
  ["Overtime", "07:01", "19:20", "Site A", "12h 19m", true, true, 3],
  ["Absent", null, null, "-", "0h", false, false, 0],
  ["Present", "08:55", "18:02", "Site B", "9h 07m", true, true, 0],
  ["Present", "09:05", "18:15", "Office", "9h 10m", true, true, 0],
  ["Present", "08:48", "18:00", "Office", "9h 12m", true, true, 0],
  ["Present", "08:40", "17:50", "Office", "9h 10m", true, true, 0],
  ["Missed Punch", "08:35", null, "Site A", "-", true, true, 0],
  ["Late", "09:24", "18:30", "Site C", "9h 06m", true, false, 0],
  ["Present", "08:50", "18:05", "Office", "9h 15m", true, true, 0],
  ["On Leave", null, null, "-", "0h", false, false, 0],
  ["Half Day", "09:00", "13:30", "Site B", "4h 30m", true, true, 0],
  ["Absent", null, null, "-", "0h", false, false, 0],
];

export const attendanceLogs: AttendanceLog[] = employees.map((emp, i) => {
  const a = attSeed[i];
  return {
    id: `ATL-${4000 + i}`,
    employeeId: emp.id,
    employee: emp.name,
    date: "2026-07-07",
    shift: emp.shift,
    clockIn: a[1],
    clockOut: a[2],
    status: a[0],
    location: a[3],
    workHours: a[4],
    faceVerified: a[5],
    insideGeofence: a[6],
    overtime: a[7],
  };
});

export const attendanceInsights: string[] = [
  "8 employees checked in late today.",
  "3 employees missed checkout yesterday.",
  "2 employees marked attendance outside assigned location.",
  "Attendance for July payroll is not locked yet.",
];

const leaveSeed: Array<[string, LeaveType, string, string, number, LeaveStatus, string]> = [
  ["Suresh Patel", "Sick Leave", "2026-07-08", "2026-07-09", 2, "Pending", "Manager"],
  ["Priya Sharma", "Casual Leave", "2026-07-10", "2026-07-10", 1, "Approved", "HR"],
  ["Manoj Verma", "Unpaid Leave", "2026-07-12", "2026-07-13", 2, "Rejected", "Manager"],
  ["Kiran Rao", "Paid Leave", "2026-07-14", "2026-07-16", 3, "Pending", "HR"],
  ["Rahul Joshi", "Emergency Leave", "2026-07-07", "2026-07-07", 1, "Approved", "Manager"],
  ["Neha Iyer", "Casual Leave", "2026-07-18", "2026-07-19", 2, "Pending", "Manager"],
  ["Deepak Nair", "Comp Off", "2026-07-11", "2026-07-11", 1, "Approved", "HR"],
  ["Arjun Shetty", "Sick Leave", "2026-07-09", "2026-07-09", 1, "Pending", "Manager"],
  ["Kavya Nair", "Casual Leave", "2026-07-21", "2026-07-22", 2, "Approved", "HR"],
];

export const leaveRequests: LeaveRequest[] = leaveSeed.map((l, i) => {
  const emp = employees.find((e) => e.name === l[0])!;
  return {
    id: `LR-${6000 + i}`,
    employeeId: emp?.id ?? "E-001",
    employee: l[0],
    type: l[1],
    from: l[2],
    to: l[3],
    days: l[4],
    reason: [
      "Fever and rest advised",
      "Personal work",
      "Out of station",
      "Family function",
      "Medical emergency at home",
      "Personal errand",
      "Worked last Sunday",
      "Not feeling well",
      "Family event",
    ][i],
    status: l[5],
    approver: l[6],
    appliedOn: "2026-07-05",
  };
});

export const leaveBalances: LeaveBalanceRow[] = [
  { type: "Casual Leave", total: 12, used: 4, balance: 8 },
  { type: "Sick Leave", total: 8, used: 2, balance: 6 },
  { type: "Paid Leave", total: 15, used: 5, balance: 10 },
  { type: "Comp Off", total: 5, used: 1, balance: 4 },
];

export const payrollItems: PayrollItem[] = employees.map((emp, i) => {
  const present = [24, 26, 21, 25, 24, 22, 26, 25, 26, 26, 23, 24, 26, 25, 23, 21][i];
  const paidLeave = [2, 1, 2, 1, 2, 3, 0, 1, 0, 0, 2, 2, 0, 1, 2, 3][i];
  const lop = [1, 0, 3, 0, 0, 2, 0, 0, 0, 0, 1, 0, 0, 0, 1, 2][i];
  const gross = emp.monthlySalary;
  const perDay = Math.round(gross / 26);
  const lateDed = i % 5 === 0 ? 500 : 0;
  const deductions = lop * perDay + lateDed;
  const net = gross - deductions;
  const status: PayItemStatus = i < 4 ? "Approved" : i < 8 ? "Review" : "Draft";
  return {
    id: `PI-${7000 + i}`,
    employeeId: emp.id,
    employee: emp.name,
    code: emp.code,
    presentDays: present,
    paidLeave,
    lop,
    overtimeHrs: (i % 4) * 2,
    gross,
    deductions,
    net,
    status,
  };
});

const trackSeed: Array<
  [TrackStatus, string, string, number, string, number, number, number, number, number]
> = [
  ["On Site", "2 min ago", "Site A · Hebbal", 82, "4G", 0, 22, 38, 13.0358, 77.597],
  ["Travelling", "8 min ago", "Near Hebbal Flyover", 64, "4G", 0, 55, 24, 13.045, 77.591],
  [
    "Offline",
    "42 min ago",
    "Last seen MG Road Office",
    12,
    "No signal",
    0,
    40,
    70,
    12.9756,
    77.605,
  ],
  ["On Site", "3 min ago", "MG Road Office", 91, "WiFi", 0, 48, 55, 12.975, 77.6045],
  ["On Site", "1 min ago", "Site A · Hebbal", 77, "4G", 0, 26, 42, 13.0372, 77.5988],
  ["Outside Geo-fence", "5 min ago", "1.8 km from Site A", 58, "4G", 1.8, 78, 30, 13.021, 77.612],
  ["On Site", "4 min ago", "Site B · Whitefield", 69, "4G", 0, 62, 60, 12.9698, 77.7499],
  ["Online", "2 min ago", "MG Road Office", 88, "WiFi", 0, 45, 50, 12.9762, 77.6058],
  ["Online", "1 min ago", "MG Road Office", 95, "WiFi", 0, 50, 46, 12.9748, 77.6062],
  ["Tracking Disabled", "-", "Tracking off", 0, "-", 0, 30, 20, 12.9352, 77.6245],
  ["Travelling", "6 min ago", "Near Whitefield", 47, "4G", 0, 70, 68, 12.985, 77.73],
  ["On Site", "3 min ago", "Site C · Electronic City", 73, "4G", 0, 84, 40, 12.8452, 77.6602],
  ["Online", "2 min ago", "MG Road Office", 80, "WiFi", 0, 44, 52, 12.977, 77.604],
  ["On Site", "5 min ago", "Koramangala Office", 66, "WiFi", 0, 52, 58, 12.9352, 77.6245],
  ["Battery Low", "12 min ago", "Site B · Whitefield", 8, "4G", 0, 60, 66, 12.972, 77.746],
  ["No Location Permission", "-", "Permission denied", 54, "4G", 0, 34, 74, 12.9141, 77.61],
];

export const employeeLocations: EmployeeLocation[] = employees.map((emp, i) => {
  const t = trackSeed[i];
  return {
    employeeId: emp.id,
    employee: emp.name,
    status: t[0],
    lastUpdate: t[1],
    location: t[2],
    battery: t[3],
    network: t[4],
    assignedSite: emp.site,
    distanceFromSite: t[5] === 0 ? "Inside zone" : `${t[5]} km away`,
    clockInLocation: emp.site,
    x: t[6],
    y: t[7],
    lat: t[8],
    lng: t[9],
  };
});

export const locationHistory: LocationEvent[] = [
  { time: "09:05 AM", location: "Office", event: "Clocked in" },
  { time: "10:20 AM", location: "Site A", event: "Reached site" },
  { time: "01:30 PM", location: "Site A", event: "Active on site" },
  { time: "04:10 PM", location: "Site B", event: "Moved to another site" },
  { time: "06:05 PM", location: "Site B", event: "Clocked out" },
];

export const geoFences: GeoFence[] = [
  {
    id: "GF-01",
    name: "Site A Boundary",
    site: "Site A",
    radius: 250,
    status: "Active",
    employees: 18,
  },
  {
    id: "GF-02",
    name: "Site B Boundary",
    site: "Site B",
    radius: 300,
    status: "Active",
    employees: 12,
  },
  {
    id: "GF-03",
    name: "Site C Boundary",
    site: "Site C",
    radius: 200,
    status: "Active",
    employees: 9,
  },
  {
    id: "GF-04",
    name: "Head Office",
    site: "Office",
    radius: 120,
    status: "Active",
    employees: 24,
  },
];

export const trackingAlerts: string[] = [
  "Manoj Verma clocked in outside assigned site (1.8 km away).",
  "Ajay Singh location not updated for 42 minutes.",
  "Kavya Nair denied location permission.",
  "Arjun Shetty battery low - tracking may drop.",
];

export const leaveTypesConfig: Array<{
  type: LeaveType;
  annual: number;
  carryForward: boolean;
  paid: boolean;
}> = [
  { type: "Casual Leave", annual: 12, carryForward: false, paid: true },
  { type: "Sick Leave", annual: 8, carryForward: false, paid: true },
  { type: "Paid Leave", annual: 15, carryForward: true, paid: true },
  { type: "Unpaid Leave", annual: 0, carryForward: false, paid: false },
  { type: "Emergency Leave", annual: 3, carryForward: false, paid: true },
  { type: "Comp Off", annual: 5, carryForward: true, paid: true },
];
