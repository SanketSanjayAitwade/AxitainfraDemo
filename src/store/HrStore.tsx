import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import * as hr from "../data/hr";
import type {
  AttendanceLog,
  LeaveRequest,
  PayrollItem,
  EmployeeLocation,
  LeaveStatus,
  PayrollStatus,
} from "../data/hr";

interface HrState {
  employees: typeof hr.employees;
  shifts: typeof hr.shifts;
  attendanceLogs: AttendanceLog[];
  attendanceLocked: boolean;
  leaveRequests: LeaveRequest[];
  leaveBalances: typeof hr.leaveBalances;
  payrollItems: PayrollItem[];
  payrollStatus: PayrollStatus;
  locations: EmployeeLocation[];
  geoFences: typeof hr.geoFences;
  summary: typeof hr.hrSummary;
  setLeaveStatus: (id: string, status: LeaveStatus) => void;
  lockAttendance: () => void;
  setPayrollStatus: (s: PayrollStatus) => void;
  markPayItem: (id: string, status: PayrollItem["status"]) => void;
}

const Ctx = createContext<HrState | null>(null);

export function HrProvider({ children }: { children: ReactNode }) {
  const [attendanceLogs] = useState<AttendanceLog[]>(hr.attendanceLogs);
  const [attendanceLocked, setAttendanceLocked] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(hr.leaveRequests);
  const [payrollItems, setPayrollItems] = useState<PayrollItem[]>(hr.payrollItems);
  const [payrollStatus, setPayrollStatus] = useState<PayrollStatus>(hr.hrSummary.payrollStatus);
  const [locations] = useState<EmployeeLocation[]>(hr.employeeLocations);

  const value = useMemo<HrState>(
    () => ({
      employees: hr.employees,
      shifts: hr.shifts,
      attendanceLogs,
      attendanceLocked,
      leaveRequests,
      leaveBalances: hr.leaveBalances,
      payrollItems,
      payrollStatus,
      locations,
      geoFences: hr.geoFences,
      summary: hr.hrSummary,
      setLeaveStatus: (id, status) =>
        setLeaveRequests((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l))),
      lockAttendance: () => setAttendanceLocked(true),
      setPayrollStatus,
      markPayItem: (id, status) =>
        setPayrollItems((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p))),
    }),
    [attendanceLogs, attendanceLocked, leaveRequests, payrollItems, payrollStatus, locations],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useHr() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useHr must be used within HrProvider");
  return ctx;
}
