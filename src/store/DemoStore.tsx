import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import * as seed from "../data/seed";
import type {
  Dpr, MaterialRequest, PurchaseOrder, Grn, Attendance, User, Role, Approval,
  Activity, Notification, Material, ReqStatus,
} from "../data/types";

export interface CurrentUser { name: string; role: string; initials: string }

interface DemoState {
  currentUser: CurrentUser | null;
  selectedProjectId: string; // "all" or a project id
  projects: typeof seed.projects;
  tasks: typeof seed.tasks;
  materials: Material[];
  dprs: Dpr[];
  materialRequests: MaterialRequest[];
  purchaseOrders: PurchaseOrder[];
  grns: Grn[];
  attendance: Attendance[];
  users: User[];
  roles: Role[];
  approvals: Approval[];
  activities: Activity[];
  notifications: Notification[];
  contractors: typeof seed.contractors;

  login: (role: string, name: string) => void;
  logout: () => void;
  setSelectedProject: (id: string) => void;

  addDpr: (d: Omit<Dpr, "id">) => void;
  addMaterialRequest: (m: Omit<MaterialRequest, "id">) => void;
  setRequestStatus: (id: string, status: ReqStatus) => void;
  addPurchaseOrder: (p: Omit<PurchaseOrder, "id">) => void;
  addGrn: (g: Omit<Grn, "id">) => void;
  addAttendance: (a: Omit<Attendance, "id">) => void;
  addUser: (u: Omit<User, "id">) => void;
  saveRole: (r: Omit<Role, "id"> & { id?: string }) => void;
  resolveApproval: (id: string, decision: "Approved" | "Rejected") => void;
  logActivity: (text: string, type: string, projectId?: string) => void;
}

const Ctx = createContext<DemoState | null>(null);

let counter = 9000;
const nextId = (prefix: string) => `${prefix}-${++counter}`;

export function DemoProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState("all");
  const [materials, setMaterials] = useState<Material[]>(seed.materials);
  const [dprs, setDprs] = useState<Dpr[]>(seed.dprs);
  const [materialRequests, setMaterialRequests] = useState<MaterialRequest[]>(seed.materialRequests);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(seed.purchaseOrders);
  const [grns, setGrns] = useState<Grn[]>(seed.grns);
  const [attendance, setAttendance] = useState<Attendance[]>(seed.attendance);
  const [users, setUsers] = useState<User[]>(seed.users);
  const [roles, setRoles] = useState<Role[]>(seed.roles);
  const [approvals, setApprovals] = useState<Approval[]>(seed.approvals);
  const [activities, setActivities] = useState<Activity[]>(seed.activities);
  const [notifications] = useState<Notification[]>(seed.notifications);

  const logActivity = (text: string, type: string, projectId?: string) =>
    setActivities((prev) => [{ id: nextId("act"), text, time: "Just now", type, projectId }, ...prev]);

  const value = useMemo<DemoState>(() => ({
    currentUser, selectedProjectId,
    projects: seed.projects, tasks: seed.tasks, contractors: seed.contractors,
    materials, dprs, materialRequests, purchaseOrders, grns, attendance, users, roles, approvals, activities, notifications,

    login: (role, name) =>
      setCurrentUser({ role, name, initials: name.split(" ").map((n) => n[0]).slice(0, 2).join("") }),
    logout: () => setCurrentUser(null),
    setSelectedProject: setSelectedProjectId,

    addDpr: (d) => {
      const dpr = { ...d, id: nextId("DPR") };
      setDprs((p) => [dpr, ...p]);
      logActivity(`DPR submitted for ${d.taskName}`, "dpr", d.projectId);
    },
    addMaterialRequest: (m) => {
      const req = { ...m, id: nextId("MR") };
      setMaterialRequests((p) => [req, ...p]);
      logActivity(`Material request raised for ${m.qty} ${m.uom} ${m.materialName}`, "material", m.projectId);
    },
    setRequestStatus: (id, status) => {
      setMaterialRequests((p) => p.map((r) => (r.id === id ? { ...r, status } : r)));
      logActivity(`Material request ${id} marked ${status}`, "material");
    },
    addPurchaseOrder: (po) => {
      const order = { ...po, id: nextId("PO") };
      setPurchaseOrders((p) => [order, ...p]);
      logActivity(`Purchase order ${order.id} created for ${po.vendor}`, "material", po.projectId);
    },
    addGrn: (g) => {
      const grn = { ...g, id: nextId("GRN") };
      setGrns((p) => [grn, ...p]);
      setMaterials((prev) =>
        prev.map((m) => (m.name === g.materialName ? { ...m, stock: m.stock + g.acceptedQty } : m)));
      logActivity(`GRN ${grn.id} created — stock updated (+${g.acceptedQty} ${g.materialName})`, "material", g.projectId);
    },
    addAttendance: (a) => {
      const att = { ...a, id: nextId("AT") };
      setAttendance((p) => [att, ...p]);
      logActivity(`Labour attendance submitted for ${a.contractor} (${a.skilled + a.unskilled} workers)`, "labour", a.projectId);
    },
    addUser: (u) => {
      setUsers((p) => [{ ...u, id: nextId("U") }, ...p]);
      logActivity(`User ${u.name} added as ${u.role}`, "user");
    },
    saveRole: (r) => {
      if (r.id) {
        setRoles((p) => p.map((role) => (role.id === r.id ? { ...role, ...r } as Role : role)));
        logActivity(`Role permissions updated for ${r.name}`, "role");
      } else {
        setRoles((p) => [...p, { ...r, id: nextId("R"), system: false } as Role]);
        logActivity(`Custom role "${r.name}" created`, "role");
      }
    },
    resolveApproval: (id, decision) => {
      setApprovals((p) => p.map((a) => (a.id === id ? { ...a, status: decision } : a)));
      logActivity(`Approval ${id} ${decision.toLowerCase()}`, "approval");
    },
    logActivity,
  }), [currentUser, selectedProjectId, materials, dprs, materialRequests, purchaseOrders, grns, attendance, users, roles, approvals, activities, notifications]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDemo() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDemo must be used within DemoProvider");
  return ctx;
}
