export type ProjectStatus = "On Track" | "Delayed" | "At Risk" | "Critical" | "Completed";
export type HealthLevel = "Good" | "Fair" | "At Risk" | "Critical";
export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export interface Project {
  id: string;
  name: string;
  location: string;
  city: string;
  client: string;
  manager: string;
  startDate: string;
  targetDate: string;
  progress: number;
  planned: number;
  status: ProjectStatus;
  delayDays: number;
  budgetHealth: HealthLevel;
  materialHealth: HealthLevel;
  labourHealth: HealthLevel;
  dprSubmitted: boolean;
  activeTasks: number;
  openIssues: number;
  pendingApprovals: number;
  labourStrength: number;
  materialShortages: number;
  risk: RiskLevel;
  budgetTotal: number;
  budgetSpent: number;
  scheduleScore: number;
  costScore: number;
  productivityScore: number;
  dprScore: number;
  safetyScore: number;
}

export type TaskStatus = "Not Started" | "In Progress" | "Completed" | "Delayed" | "On Hold";
export type Priority = "Low" | "Medium" | "High" | "Critical";

export interface Task {
  id: string;
  name: string;
  projectId: string;
  scope: string;
  tower: string;
  floor: string;
  unit: string;
  category: string;
  plannedQty: number;
  completedQty: number;
  uom: string;
  progress: number;
  engineer: string;
  contractor: string;
  startDate: string;
  dueDate: string;
  status: TaskStatus;
  priority: Priority;
  dprToday: boolean;
  delayReason?: string;
}

export type DprStatus = "Draft" | "Submitted" | "Approved" | "Rejected";
export interface Dpr {
  id: string;
  date: string;
  projectId: string;
  taskId: string;
  taskName: string;
  engineer: string;
  qtyCompleted: number;
  uom: string;
  labourCount: number;
  materialConsumed: string;
  remarks: string;
  status: DprStatus;
  pendingWith: string;
}

export interface Material {
  id: string;
  name: string;
  category: string;
  uom: string;
  stock: number;
  minStock: number;
  rate: number;
}

export type ReqStatus =
  | "Draft" | "Submitted" | "Approved" | "Rejected" | "Converted to PO" | "Issued" | "Partially Issued";
export interface MaterialRequest {
  id: string;
  projectId: string;
  scope: string;
  taskName: string;
  materialId: string;
  materialName: string;
  qty: number;
  uom: string;
  requiredDate: string;
  requestedBy: string;
  priority: Priority;
  reason: string;
  status: ReqStatus;
}

export type PoStatus = "Draft" | "Sent to Vendor" | "Partially Received" | "Received" | "Closed";
export interface PoItem { materialName: string; qty: number; rate: number; uom: string }
export interface PurchaseOrder {
  id: string;
  vendor: string;
  projectId: string;
  items: PoItem[];
  amount: number;
  deliveryDate: string;
  status: PoStatus;
  createdDate: string;
}

export interface Grn {
  id: string;
  poId: string;
  vendor: string;
  projectId: string;
  receivedDate: string;
  materialName: string;
  orderedQty: number;
  receivedQty: number;
  acceptedQty: number;
  rejectedQty: number;
  remarks: string;
  store: string;
}

export interface Contractor {
  id: string;
  name: string;
  trade: string;
  projects: number;
  presentToday: number;
  productivity: number;
  pendingBills: number;
  contact: string;
  phone: string;
  status: "Active" | "Inactive";
}

export interface Attendance {
  id: string;
  date: string;
  projectId: string;
  contractor: string;
  trade: string;
  workPackage: string;
  scope: string;
  skilled: number;
  unskilled: number;
  halfDay: number;
  overtime: number;
  submittedBy: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  projects: number;
  department: string;
  status: "Active" | "Inactive";
  lastLogin: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  users: number;
  system: boolean;
  permissions: string[];
}

export type ApprovalType =
  | "DPR" | "Material Request" | "Purchase Order" | "GRN" | "Labour Attendance" | "Stock Adjustment" | "Task Closure";
export interface Approval {
  id: string;
  type: ApprovalType;
  projectId: string;
  requestedBy: string;
  detail: string;
  value: string;
  pendingWith: string;
  ageDays: number;
  priority: Priority;
  status: "Pending" | "Approved" | "Rejected";
}

export interface Activity {
  id: string;
  text: string;
  time: string;
  projectId?: string;
  type: string;
}

export interface Notification {
  id: string;
  title: string;
  detail: string;
  time: string;
  kind: "dpr" | "stock" | "labour" | "task" | "po";
}
