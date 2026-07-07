export type HrEmployeeStatus = "On site" | "In transit" | "At office" | "On leave" | "Offline";

export interface HrEmployee {
  id: string;
  name: string;
  role: string;
  department: string;
  site: string;
  city: string;
  status: HrEmployeeStatus;
  shift: string;
  lastCheckIn: string;
  phone: string;
  email: string;
  attendanceRate: number;
  points: number;
  x: number;
  y: number;
  currentTask: string;
}

export interface HrLeaveRequest {
  id: string;
  employee: string;
  department: string;
  type: string;
  from: string;
  to: string;
  days: number;
  status: "Pending" | "Approved" | "Rejected";
  reason: string;
}

export interface HrPayrollRecord {
  id: string;
  employee: string;
  department: string;
  month: string;
  gross: number;
  deductions: number;
  net: number;
  status: "Ready" | "Paid" | "Processing";
}

export interface HrRecruitmentRole {
  id: string;
  title: string;
  department: string;
  location: string;
  applicants: number;
  shortlists: number;
  stage: "Sourcing" | "Screening" | "Interview" | "Offer";
  openings: number;
}

export interface HrOnboardingTask {
  id: string;
  title: string;
  owner: string;
  due: string;
  status: "Pending" | "In progress" | "Completed";
}

export interface HrAttendanceRow {
  id: string;
  employee: string;
  department: string;
  site: string;
  inTime: string;
  outTime: string;
  hours: number;
  status: "Present" | "Late" | "Half day" | "Absent";
}

export const hrEmployees: HrEmployee[] = [
  {
    id: "HR-001",
    name: "Aarav Mehta",
    role: "HR Manager",
    department: "Human Resources",
    site: "Head Office",
    city: "Bengaluru",
    status: "At office",
    shift: "09:30 - 18:00",
    lastCheckIn: "08:58 AM",
    phone: "+91 98765 12001",
    email: "aarav.mehta@buildflow.in",
    attendanceRate: 98,
    points: 84,
    x: 53,
    y: 28,
    currentTask: "Reviewing attendance exceptions",
  },
  {
    id: "HR-002",
    name: "Neha Kapoor",
    role: "Recruiter",
    department: "Talent",
    site: "Bengaluru Site Office",
    city: "Bengaluru",
    status: "On site",
    shift: "10:00 - 18:30",
    lastCheckIn: "09:41 AM",
    phone: "+91 98765 12002",
    email: "neha.kapoor@buildflow.in",
    attendanceRate: 95,
    points: 71,
    x: 62,
    y: 31,
    currentTask: "Interviewing field engineers",
  },
  {
    id: "HR-003",
    name: "Ravi Iyer",
    role: "Payroll Executive",
    department: "Payroll",
    site: "Finance Desk",
    city: "Pune",
    status: "At office",
    shift: "09:30 - 18:00",
    lastCheckIn: "09:17 AM",
    phone: "+91 98765 12003",
    email: "ravi.iyer@buildflow.in",
    attendanceRate: 97,
    points: 66,
    x: 41,
    y: 24,
    currentTask: "Closing July payroll batch",
  },
  {
    id: "HR-004",
    name: "Shweta Kulkarni",
    role: "Attendance Lead",
    department: "Operations",
    site: "Nagpur Project",
    city: "Nagpur",
    status: "In transit",
    shift: "08:00 - 17:00",
    lastCheckIn: "08:12 AM",
    phone: "+91 98765 12004",
    email: "shweta.kulkarni@buildflow.in",
    attendanceRate: 93,
    points: 88,
    x: 71,
    y: 54,
    currentTask: "Verifying site punch-in points",
  },
  {
    id: "HR-005",
    name: "Imran Shaikh",
    role: "Field Coordinator",
    department: "Employee Tracking",
    site: "Mumbai North Zone",
    city: "Mumbai",
    status: "On site",
    shift: "07:30 - 16:30",
    lastCheckIn: "07:46 AM",
    phone: "+91 98765 12005",
    email: "imran.shaikh@buildflow.in",
    attendanceRate: 91,
    points: 53,
    x: 79,
    y: 39,
    currentTask: "Syncing worker location markers",
  },
  {
    id: "HR-006",
    name: "Pooja Nair",
    role: "Onboarding Specialist",
    department: "Onboarding",
    site: "Head Office",
    city: "Bengaluru",
    status: "At office",
    shift: "10:30 - 19:00",
    lastCheckIn: "10:01 AM",
    phone: "+91 98765 12006",
    email: "pooja.nair@buildflow.in",
    attendanceRate: 94,
    points: 61,
    x: 48,
    y: 35,
    currentTask: "Preparing new joiner kits",
  },
  {
    id: "HR-007",
    name: "Karan Joshi",
    role: "HR Coordinator",
    department: "Human Resources",
    site: "Chennai Project",
    city: "Chennai",
    status: "On site",
    shift: "09:00 - 18:00",
    lastCheckIn: "09:06 AM",
    phone: "+91 98765 12007",
    email: "karan.joshi@buildflow.in",
    attendanceRate: 92,
    points: 77,
    x: 64,
    y: 69,
    currentTask: "Updating leave approvals",
  },
  {
    id: "HR-008",
    name: "Mira Fernandes",
    role: "HR Analyst",
    department: "Reports",
    site: "Remote",
    city: "Goa",
    status: "In transit",
    shift: "Flexible",
    lastCheckIn: "11:14 AM",
    phone: "+91 98765 12008",
    email: "mira.fernandes@buildflow.in",
    attendanceRate: 89,
    points: 58,
    x: 21,
    y: 63,
    currentTask: "Compiling workforce metrics",
  },
  {
    id: "HR-009",
    name: "Sahil Verma",
    role: "Recruitment Associate",
    department: "Talent",
    site: "Noida Zone",
    city: "Noida",
    status: "On site",
    shift: "10:00 - 19:00",
    lastCheckIn: "10:22 AM",
    phone: "+91 98765 12009",
    email: "sahil.verma@buildflow.in",
    attendanceRate: 87,
    points: 49,
    x: 84,
    y: 47,
    currentTask: "Shortlisting site supervisor profiles",
  },
  {
    id: "HR-010",
    name: "Tanya Rao",
    role: "Benefits Specialist",
    department: "Payroll",
    site: "Pune Office",
    city: "Pune",
    status: "On leave",
    shift: "09:30 - 18:00",
    lastCheckIn: "Yesterday",
    phone: "+91 98765 12010",
    email: "tanya.rao@buildflow.in",
    attendanceRate: 96,
    points: 44,
    x: 33,
    y: 47,
    currentTask: "Annual benefit reconciliation",
  },
  {
    id: "HR-011",
    name: "Arjun Bhat",
    role: "Site HR Partner",
    department: "Employee Tracking",
    site: "Hyderabad Project",
    city: "Hyderabad",
    status: "On site",
    shift: "08:00 - 17:30",
    lastCheckIn: "08:05 AM",
    phone: "+91 98765 12011",
    email: "arjun.bhat@buildflow.in",
    attendanceRate: 90,
    points: 92,
    x: 58,
    y: 74,
    currentTask: "Capturing worker geo-check-ins",
  },
  {
    id: "HR-012",
    name: "Sana Ali",
    role: "Leave Coordinator",
    department: "Human Resources",
    site: "Remote",
    city: "Kochi",
    status: "Offline",
    shift: "Flexible",
    lastCheckIn: "Today, 12:30 PM",
    phone: "+91 98765 12012",
    email: "sana.ali@buildflow.in",
    attendanceRate: 88,
    points: 35,
    x: 17,
    y: 42,
    currentTask: "Clearing leave balance queries",
  },
];

export const hrLeaves: HrLeaveRequest[] = [
  {
    id: "LV-101",
    employee: "Tanya Rao",
    department: "Payroll",
    type: "Annual Leave",
    from: "08 Jul",
    to: "12 Jul",
    days: 5,
    status: "Approved",
    reason: "Personal travel",
  },
  {
    id: "LV-102",
    employee: "Sana Ali",
    department: "Human Resources",
    type: "Sick Leave",
    from: "09 Jul",
    to: "10 Jul",
    days: 2,
    status: "Pending",
    reason: "Medical rest",
  },
  {
    id: "LV-103",
    employee: "Imran Shaikh",
    department: "Employee Tracking",
    type: "Comp Off",
    from: "11 Jul",
    to: "11 Jul",
    days: 1,
    status: "Approved",
    reason: "Weekend site audit",
  },
  {
    id: "LV-104",
    employee: "Ravi Iyer",
    department: "Payroll",
    type: "Work From Home",
    from: "12 Jul",
    to: "12 Jul",
    days: 1,
    status: "Pending",
    reason: "Payroll closure",
  },
  {
    id: "LV-105",
    employee: "Neha Kapoor",
    department: "Talent",
    type: "Casual Leave",
    from: "15 Jul",
    to: "16 Jul",
    days: 2,
    status: "Pending",
    reason: "Interview travel",
  },
  {
    id: "LV-106",
    employee: "Karan Joshi",
    department: "Human Resources",
    type: "Emergency Leave",
    from: "03 Jul",
    to: "04 Jul",
    days: 2,
    status: "Rejected",
    reason: "Coverage required on site",
  },
];

export const hrPayroll: HrPayrollRecord[] = [
  {
    id: "PR-001",
    employee: "Aarav Mehta",
    department: "Human Resources",
    month: "July 2026",
    gross: 124000,
    deductions: 15200,
    net: 108800,
    status: "Processing",
  },
  {
    id: "PR-002",
    employee: "Neha Kapoor",
    department: "Talent",
    month: "July 2026",
    gross: 86000,
    deductions: 9400,
    net: 76600,
    status: "Ready",
  },
  {
    id: "PR-003",
    employee: "Ravi Iyer",
    department: "Payroll",
    month: "July 2026",
    gross: 92000,
    deductions: 10800,
    net: 81200,
    status: "Paid",
  },
  {
    id: "PR-004",
    employee: "Pooja Nair",
    department: "Onboarding",
    month: "July 2026",
    gross: 78000,
    deductions: 9100,
    net: 68900,
    status: "Ready",
  },
  {
    id: "PR-005",
    employee: "Mira Fernandes",
    department: "Reports",
    month: "July 2026",
    gross: 84000,
    deductions: 9800,
    net: 74200,
    status: "Processing",
  },
  {
    id: "PR-006",
    employee: "Arjun Bhat",
    department: "Employee Tracking",
    month: "July 2026",
    gross: 88000,
    deductions: 10400,
    net: 77600,
    status: "Paid",
  },
];

export const hrRecruitment: HrRecruitmentRole[] = [
  {
    id: "RC-001",
    title: "Site HR Executive",
    department: "Employee Tracking",
    location: "Mumbai",
    applicants: 42,
    shortlists: 9,
    stage: "Interview",
    openings: 2,
  },
  {
    id: "RC-002",
    title: "Payroll Specialist",
    department: "Payroll",
    location: "Pune",
    applicants: 28,
    shortlists: 6,
    stage: "Screening",
    openings: 1,
  },
  {
    id: "RC-003",
    title: "Recruiter",
    department: "Talent",
    location: "Bengaluru",
    applicants: 57,
    shortlists: 14,
    stage: "Interview",
    openings: 3,
  },
  {
    id: "RC-004",
    title: "Onboarding Associate",
    department: "Onboarding",
    location: "Hyderabad",
    applicants: 19,
    shortlists: 5,
    stage: "Offer",
    openings: 1,
  },
  {
    id: "RC-005",
    title: "Leave Coordinator",
    department: "Human Resources",
    location: "Remote",
    applicants: 31,
    shortlists: 8,
    stage: "Sourcing",
    openings: 1,
  },
];

export const hrOnboarding: HrOnboardingTask[] = [
  {
    id: "OB-001",
    title: "Create employee code",
    owner: "HR Admin",
    due: "Today",
    status: "Completed",
  },
  {
    id: "OB-002",
    title: "Collect KYC documents",
    owner: "Onboarding",
    due: "Today",
    status: "In progress",
  },
  {
    id: "OB-003",
    title: "Assign site access badge",
    owner: "Security",
    due: "Tomorrow",
    status: "Pending",
  },
  {
    id: "OB-004",
    title: "Add payroll details",
    owner: "Payroll",
    due: "Tomorrow",
    status: "In progress",
  },
  { id: "OB-005", title: "Issue PPE kit", owner: "Stores", due: "Tomorrow", status: "Pending" },
  {
    id: "OB-006",
    title: "Schedule induction",
    owner: "HR Manager",
    due: "Day 2",
    status: "Completed",
  },
];

export const hrAttendance: HrAttendanceRow[] = [
  {
    id: "AT-901",
    employee: "Aarav Mehta",
    department: "Human Resources",
    site: "Head Office",
    inTime: "08:58 AM",
    outTime: "--",
    hours: 8.5,
    status: "Present",
  },
  {
    id: "AT-902",
    employee: "Neha Kapoor",
    department: "Talent",
    site: "Bengaluru Site Office",
    inTime: "09:41 AM",
    outTime: "--",
    hours: 7.9,
    status: "Late",
  },
  {
    id: "AT-903",
    employee: "Ravi Iyer",
    department: "Payroll",
    site: "Finance Desk",
    inTime: "09:17 AM",
    outTime: "--",
    hours: 8.2,
    status: "Present",
  },
  {
    id: "AT-904",
    employee: "Shweta Kulkarni",
    department: "Operations",
    site: "Nagpur Project",
    inTime: "08:12 AM",
    outTime: "--",
    hours: 8.8,
    status: "Present",
  },
  {
    id: "AT-905",
    employee: "Tanya Rao",
    department: "Payroll",
    site: "Pune Office",
    inTime: "--",
    outTime: "--",
    hours: 0,
    status: "Absent",
  },
  {
    id: "AT-906",
    employee: "Arjun Bhat",
    department: "Employee Tracking",
    site: "Hyderabad Project",
    inTime: "08:05 AM",
    outTime: "--",
    hours: 8.7,
    status: "Present",
  },
  {
    id: "AT-907",
    employee: "Sana Ali",
    department: "Human Resources",
    site: "Remote",
    inTime: "12:30 PM",
    outTime: "--",
    hours: 4.1,
    status: "Half day",
  },
];

export const hrWeekTrend = [
  { label: "Mon", present: 94, late: 4, leave: 2 },
  { label: "Tue", present: 96, late: 3, leave: 1 },
  { label: "Wed", present: 93, late: 5, leave: 2 },
  { label: "Thu", present: 95, late: 3, leave: 2 },
  { label: "Fri", present: 91, late: 6, leave: 3 },
  { label: "Sat", present: 88, late: 4, leave: 5 },
];
