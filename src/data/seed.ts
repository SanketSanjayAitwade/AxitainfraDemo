import type {
  Project, Task, Dpr, Material, MaterialRequest, PurchaseOrder, Grn,
  Contractor, Attendance, User, Role, Approval, Activity, Notification,
} from "./types";

const projectSeed: Array<[string, string, string, string, string]> = [
  ["Skyline Heights Phase 1", "Bengaluru", "Karnataka", "Prestige Estates", "Rajesh Kumar"],
  ["Green Valley Villas", "Pune", "Maharashtra", "Kolte Patil Developers", "Anita Deshmukh"],
  ["Metro Square Commercial", "Mumbai", "Maharashtra", "Lodha Group", "Faisal Shaikh"],
  ["Urban Nest Apartments", "Hyderabad", "Telangana", "My Home Constructions", "Sridhar Reddy"],
  ["Lakeview Residency", "Bengaluru", "Karnataka", "Brigade Group", "Meera Nair"],
  ["Prestige Trade Centre", "Chennai", "Tamil Nadu", "Casagrand Builder", "Karthik Raja"],
  ["Northline Warehousing Park", "Nagpur", "Maharashtra", "IndoSpace Logistics", "Vikram Patil"],
  ["Elite County Towers", "Noida", "Uttar Pradesh", "ATS Infrastructure", "Amit Sharma"],
  ["Palm Grove Villas", "Goa", "Goa", "Provident Housing", "Sunita Fernandes"],
  ["Sapphire Business Hub", "Ahmedabad", "Gujarat", "Adani Realty", "Nirav Mehta"],
  ["Orchid Enclave", "Mysuru", "Karnataka", "Sobha Limited", "Deepa Rao"],
  ["Silverstone Heights", "Kochi", "Kerala", "Skyline Builders", "Thomas Varghese"],
  ["Central Avenue Mall", "Jaipur", "Rajasthan", "Mahima Group", "Rohit Agarwal"],
  ["Hillcrest Residency", "Dehradun", "Uttarakhand", "Pacific Group", "Neha Bisht"],
  ["Riverfront Towers", "Surat", "Gujarat", "Happy Home Group", "Jignesh Patel"],
  ["Prime Logistics Yard", "Hosur", "Tamil Nadu", "Renaissance Logistics", "Bala Murugan"],
  ["Eastgate Tech Park", "Kolkata", "West Bengal", "PS Group", "Arindam Ghosh"],
  ["Horizon County", "Gurgaon", "Haryana", "DLF Limited", "Pooja Malik"],
  ["Lotus Lake Homes", "Bhopal", "Madhya Pradesh", "Sagar Group", "Manish Jain"],
  ["Crescent Commercial Plaza", "Indore", "Madhya Pradesh", "Sanghvi Group", "Alok Verma"],
  ["Royal Orchid Towers", "Mangalore", "Karnataka", "Land Trades", "Ganesh Shetty"],
];

const statuses = ["On Track", "On Track", "Delayed", "At Risk", "On Track", "Delayed", "On Track", "Critical", "At Risk", "On Track", "Completed", "Delayed", "At Risk", "On Track", "Critical", "On Track", "Delayed", "On Track", "At Risk", "Delayed", "Completed"] as const;

const health = (n: number) => (n >= 80 ? "Good" : n >= 65 ? "Fair" : n >= 50 ? "At Risk" : "Critical") as Project["budgetHealth"];

export const projects: Project[] = projectSeed.map((p, i) => {
  const status = statuses[i];
  const planned = 30 + ((i * 7 + 20) % 65);
  let progress =
    status === "Completed" ? 100
    : status === "Critical" ? planned - (18 + (i % 6))
    : status === "At Risk" ? planned - (8 + (i % 4))
    : status === "Delayed" ? planned - (5 + (i % 3))
    : planned + (2 + (i % 5));
  progress = Math.max(6, Math.min(100, progress));
  const delayDays = status === "Completed" || status === "On Track" ? 0 : (planned - progress) * 3 + (i % 5);
  const budgetTotal = (40 + ((i * 13) % 260)) * 10000000;
  const budgetSpent = Math.round(budgetTotal * (progress / 100) * (status === "Critical" ? 1.18 : status === "At Risk" ? 1.08 : 0.96));
  const schedule = Math.max(28, Math.min(98, 100 - (planned - progress) * 3));
  const cost = status === "Critical" ? 42 : status === "At Risk" ? 61 : status === "Delayed" ? 68 : 84 - (i % 8);
  const prod = status === "Critical" ? 55 : status === "At Risk" ? 66 : 78 + (i % 10);
  const dprScore = status === "Critical" ? 48 : status === "Delayed" ? 70 : 88 - (i % 9);
  const safety = 74 + (i % 22);
  return {
    id: `P-${String(i + 1).padStart(3, "0")}`,
    name: p[0], city: p[1], location: `${p[1]}, ${p[2]}`, client: p[3], manager: p[4],
    startDate: `2024-${String(((i % 11) + 1)).padStart(2, "0")}-${String(((i * 3) % 27) + 1).padStart(2, "0")}`,
    targetDate: `2026-${String(((i % 12) + 1)).padStart(2, "0")}-${String(((i * 5) % 27) + 1).padStart(2, "0")}`,
    progress, planned, status, delayDays,
    budgetHealth: health(cost), materialHealth: health(schedule - 4), labourHealth: health(prod),
    dprSubmitted: i % 3 !== 0,
    activeTasks: 8 + ((i * 5) % 34), openIssues: (i * 3) % 12,
    pendingApprovals: (i * 2) % 9, labourStrength: 40 + ((i * 17) % 260),
    materialShortages: status === "Critical" ? 4 + (i % 3) : status === "At Risk" ? 2 : i % 2,
    risk: status === "Critical" ? "Critical" : status === "At Risk" ? "High" : status === "Delayed" ? "Medium" : "Low",
    budgetTotal, budgetSpent,
    scheduleScore: schedule, costScore: cost, productivityScore: prod, dprScore, safetyScore: safety,
  };
});

export const engineers = ["Arjun Menon", "Priya Nair", "Sameer Khan", "Divya Iyer", "Rahul Joshi", "Kavya Reddy", "Imran Ali", "Sneha Pillai"];
export const workPackages = ["Civil", "Blockwork", "Plastering", "Waterproofing", "Painting", "Tiling", "Electrical", "Plumbing", "Flooring", "Finishing"];
export const towers = ["Tower A", "Tower B", "Tower C", "Tower D"];
export const floors = ["Basement", "Ground Floor", "Floor 1", "Floor 2", "Floor 3", "Floor 4", "Floor 5"];
export const units = ["Lobby", "Corridor", "Unit 101", "Unit 102", "Unit 201", "Staircase", "Lift Lobby", "Terrace", "Parking Zone"];

const contractorSeed: Array<[string, string]> = [
  ["Shree Sai Civil Works", "Civil"],
  ["A1 Painting Contractors", "Painting"],
  ["Metro Electricals", "Electrical"],
  ["Prime Plumbing Services", "Plumbing"],
  ["Bharat Waterproofing", "Waterproofing"],
  ["Elite Tile Fixers", "Tiling"],
  ["Ganesh Labour Supply", "General"],
];

export const contractors: Contractor[] = contractorSeed.map((c, i) => ({
  id: `C-${String(i + 1).padStart(3, "0")}`,
  name: c[0], trade: c[1],
  projects: 2 + (i % 5), presentToday: 14 + ((i * 11) % 60),
  productivity: 62 + ((i * 9) % 34), pendingBills: (i + 1) * 145000 + i * 32000,
  contact: engineers[i % engineers.length], phone: `+91 9${String(800000000 + i * 111111).slice(0, 9)}`,
  status: i === 6 ? "Inactive" : "Active",
}));

const taskDefs: Array<[string, string, string, string]> = [
  ["Internal plastering", "Plastering", "sq.ft", "Sqft"],
  ["Bathroom waterproofing", "Waterproofing", "sq.ft", "Sqft"],
  ["Corridor painting", "Painting", "sq.ft", "Sqft"],
  ["Tile fixing", "Tiling", "sq.ft", "Sqft"],
  ["Electrical conduit work", "Electrical", "points", "Pts"],
  ["Blockwork masonry", "Blockwork", "cu.m", "Cum"],
  ["Ceiling plaster", "Plastering", "sq.ft", "Sqft"],
  ["External painting", "Painting", "sq.ft", "Sqft"],
  ["Plumbing rough-in", "Plumbing", "points", "Pts"],
  ["Vitrified flooring", "Flooring", "sq.ft", "Sqft"],
  ["RCC slab casting", "Civil", "cu.m", "Cum"],
  ["Door frame fixing", "Finishing", "nos", "Nos"],
];

const taskStatuses = ["In Progress", "In Progress", "Completed", "Delayed", "Not Started", "In Progress", "On Hold"] as const;

export const tasks: Task[] = [];
projects.forEach((proj, pi) => {
  const count = 3 + (pi % 3);
  for (let t = 0; t < count; t++) {
    const def = taskDefs[(pi + t) % taskDefs.length];
    const tw = towers[t % 3];
    const fl = floors[(pi + t) % floors.length];
    const un = units[(pi + t * 2) % units.length];
    const status = taskStatuses[(pi + t) % taskStatuses.length];
    const plannedQty = 400 + ((pi * 37 + t * 90) % 2200);
    const pct = status === "Completed" ? 100 : status === "Not Started" ? 0 : status === "Delayed" ? 30 + (t * 7) % 40 : 45 + ((pi + t) * 6) % 45;
    const completedQty = Math.round((plannedQty * pct) / 100);
    tasks.push({
      id: `T-${String(tasks.length + 1).padStart(4, "0")}`,
      name: `${def[0]} — ${tw} / ${fl} / ${un}`,
      projectId: proj.id, scope: `${tw} / ${fl} / ${un}`, tower: tw, floor: fl, unit: un,
      category: def[1], plannedQty, completedQty, uom: def[2], progress: pct,
      engineer: engineers[(pi + t) % engineers.length],
      contractor: contractors[(pi + t) % contractors.length].name,
      startDate: `2025-0${((pi + t) % 9) + 1}-1${t % 9}`,
      dueDate: `2025-1${(pi + t) % 3}-2${t % 8}`,
      status, priority: (["Low", "Medium", "High", "Critical"] as const)[(pi + t) % 4],
      dprToday: (pi + t) % 3 === 0,
      delayReason: status === "Delayed" ? "Material shortage and delayed contractor mobilisation" : undefined,
    });
  }
});

export const dprs: Dpr[] = tasks.slice(0, 14).map((t, i) => ({
  id: `DPR-${String(1050 + i)}`,
  date: `2026-07-0${(i % 4) + 1}`,
  projectId: t.projectId, taskId: t.id, taskName: t.name,
  engineer: t.engineer, qtyCompleted: 40 + (i * 23) % 300, uom: t.uom,
  labourCount: 6 + (i % 18),
  materialConsumed: ["12 bags Cement", "40 sq.ft Tiles", "8 L Waterproofing", "80 Kg Steel", "25 L Paint"][i % 5],
  remarks: ["Work progressing as planned", "Slow due to rain", "Good productivity today", "Awaiting material"][i % 4],
  status: (["Submitted", "Approved", "Submitted", "Draft", "Rejected"] as const)[i % 5],
  pendingWith: engineers[(i + 2) % engineers.length],
}));

const materialSeed: Array<[string, string, string, number]> = [
  ["Cement OPC 53 Grade", "Cement", "Bags", 380],
  ["TMT Steel 12mm", "Steel", "Kg", 68],
  ["River Sand", "Aggregate", "CFT", 55],
  ["M-Sand", "Aggregate", "CFT", 42],
  ["Concrete Blocks", "Masonry", "Nos", 48],
  ["Tiles 600x600", "Finishing", "Boxes", 640],
  ["Paint Primer", "Paint", "Litres", 185],
  ["Exterior Paint", "Paint", "Litres", 320],
  ["Waterproofing Chemical", "Chemical", "Litres", 410],
  ["PVC Pipe 25mm", "Plumbing", "Meters", 90],
  ["Electrical Conduit", "Electrical", "Meters", 46],
  ["Copper Wire", "Electrical", "Rolls", 2850],
];

export const materials: Material[] = materialSeed.map((m, i) => {
  const min = [200, 500, 400, 400, 1500, 60, 120, 100, 150, 500, 800, 30][i];
  const stock = [1450, 320, 1800, 210, 940, 42, 480, 260, 90, 2100, 460, 55][i];
  return {
    id: `M-${String(i + 1).padStart(3, "0")}`,
    name: m[0], category: m[1], uom: m[2], rate: m[3], stock, minStock: min,
  };
});

const reqStatuses = ["Submitted", "Approved", "Rejected", "Converted to PO", "Issued", "Partially Issued", "Draft"] as const;
export const materialRequests: MaterialRequest[] = Array.from({ length: 12 }, (_, i) => {
  const p = projects[i % projects.length];
  const m = materials[i % materials.length];
  const t = tasks[i % tasks.length];
  return {
    id: `MR-${1200 + i}`,
    projectId: p.id, scope: t.scope, taskName: t.name.split(" — ")[0],
    materialId: m.id, materialName: m.name, qty: 50 + (i * 45) % 500, uom: m.uom,
    requiredDate: `2026-07-1${i % 9}`, requestedBy: engineers[i % engineers.length],
    priority: (["Low", "Medium", "High", "Critical"] as const)[i % 4],
    reason: "Required for ongoing site work", status: reqStatuses[i % reqStatuses.length],
  };
});

const poStatuses = ["Sent to Vendor", "Partially Received", "Received", "Draft", "Closed"] as const;
const vendors = ["UltraTech Supplies", "JSW Steel Depot", "Asian Paints Dealer", "Kajaria Tiles Hub", "Finolex Pipes", "Havells Distributors"];
export const purchaseOrders: PurchaseOrder[] = Array.from({ length: 8 }, (_, i) => {
  const items = [
    { materialName: materials[i % materials.length].name, qty: 100 + (i * 40) % 400, rate: materials[i % materials.length].rate, uom: materials[i % materials.length].uom },
    { materialName: materials[(i + 3) % materials.length].name, qty: 50 + (i * 20) % 200, rate: materials[(i + 3) % materials.length].rate, uom: materials[(i + 3) % materials.length].uom },
  ];
  const amount = items.reduce((s, it) => s + it.qty * it.rate, 0);
  return {
    id: `PO-${1020 + i}`, vendor: vendors[i % vendors.length], projectId: projects[i % projects.length].id,
    items, amount, deliveryDate: `2026-07-2${i % 8}`, status: poStatuses[i % poStatuses.length],
    createdDate: `2026-06-1${i % 9}`,
  };
});

export const grns: Grn[] = Array.from({ length: 6 }, (_, i) => {
  const po = purchaseOrders[i % purchaseOrders.length];
  const ordered = po.items[0].qty;
  const received = Math.round(ordered * (0.85 + (i % 3) * 0.05));
  const rejected = Math.round(received * (i % 4 === 0 ? 0.05 : 0));
  return {
    id: `GRN-${2040 + i}`, poId: po.id, vendor: po.vendor, projectId: po.projectId,
    receivedDate: `2026-07-0${(i % 8) + 1}`, materialName: po.items[0].materialName,
    orderedQty: ordered, receivedQty: received, acceptedQty: received - rejected, rejectedQty: rejected,
    remarks: rejected > 0 ? "Minor damage in transit" : "Quality OK", store: `${projects[i % projects.length].city} Site Store`,
  };
});

export const attendance: Attendance[] = Array.from({ length: 14 }, (_, i) => {
  const c = contractors[i % contractors.length];
  const p = projects[i % projects.length];
  return {
    id: `AT-${3010 + i}`, date: `2026-07-0${(i % 4) + 1}`, projectId: p.id,
    contractor: c.name, trade: c.trade, workPackage: workPackages[i % workPackages.length],
    scope: `${towers[i % 3]} / ${floors[i % floors.length]}`,
    skilled: 6 + (i * 3) % 26, unskilled: 8 + (i * 5) % 40, halfDay: i % 4, overtime: (i % 5) * 2,
    submittedBy: engineers[i % engineers.length],
  };
});

const userSeed: Array<[string, string, string]> = [
  ["Vikram Rao", "Super Admin", "Management"],
  ["Anita Deshmukh", "Project Director", "Operations"],
  ["Rajesh Kumar", "Project Manager", "Projects"],
  ["Arjun Menon", "Site Engineer", "Site"],
  ["Priya Nair", "Planning Engineer", "Planning"],
  ["Sameer Khan", "Store Manager", "Stores"],
  ["Divya Iyer", "Purchase Manager", "Procurement"],
  ["Rahul Joshi", "Labour Manager", "HR"],
  ["Kavya Reddy", "Accountant", "Finance"],
  ["Imran Ali", "Site Engineer", "Site"],
  ["Sneha Pillai", "Viewer", "Management"],
  ["Meera Nair", "Project Manager", "Projects"],
];
export const users: User[] = userSeed.map((u, i) => ({
  id: `U-${String(i + 1).padStart(3, "0")}`,
  name: u[0], email: `${u[0].toLowerCase().replace(/ /g, ".")}@buildmatrix.in`,
  phone: `+91 98${String(100000 + i * 1234).slice(0, 6)}`, role: u[1],
  projects: 1 + (i % 8), department: u[2],
  status: i === 10 ? "Inactive" : "Active",
  lastLogin: ["2 mins ago", "1 hour ago", "Today, 9:14 AM", "Yesterday", "3 days ago"][i % 5],
}));

export const permissionGroups: Array<{ group: string; perms: string[] }> = [
  { group: "Dashboard", perms: ["View executive dashboard", "View project health", "Export dashboard"] },
  { group: "Projects", perms: ["View projects", "Create project", "Edit project", "Archive project"] },
  { group: "Project Matrix", perms: ["View matrix", "Create scope", "Edit scope", "Lock scope"] },
  { group: "Tasks", perms: ["View tasks", "Create task", "Edit task", "Assign task", "Close task"] },
  { group: "DPR", perms: ["Create DPR", "Edit own DPR", "Approve DPR", "Reject DPR", "View all DPR"] },
  { group: "Materials", perms: ["View inventory", "Create material request", "Approve material request", "Create PO", "Approve PO", "Create GRN", "Issue material", "Adjust stock"] },
  { group: "Labour", perms: ["View labour", "Add attendance", "Edit attendance", "View contractor rates", "Approve labour entries"] },
  { group: "Reports", perms: ["View reports", "Export reports", "Schedule reports"] },
  { group: "Users", perms: ["Add users", "Edit users", "Assign roles", "Deactivate users"] },
  { group: "Settings", perms: ["Manage company settings", "Manage approval workflows", "Manage master data"] },
];

const allPerms = permissionGroups.flatMap((g) => g.perms);

const roleDefs: Array<[string, string, number, (p: string) => boolean]> = [
  ["Super Admin", "Full access to every module and configuration", 1, () => true],
  ["Project Director", "Portfolio-level visibility with approval authority", 2, (p) => !p.startsWith("Manage company")],
  ["Project Manager", "Manages assigned projects, tasks, DPR and approvals", 4, (p) => !p.includes("company") && !p.includes("Add users")],
  ["Site Engineer", "Executes site work, creates DPR and material requests", 6, (p) => p.includes("View") || p.includes("Create DPR") || p.includes("material request") || p.includes("attendance")],
  ["Planning Engineer", "Owns scope matrix, task planning and schedule", 2, (p) => p.includes("matrix") || p.includes("scope") || p.includes("task") || p.includes("View")],
  ["Store Manager", "Manages inventory, GRN and material issue", 3, (p) => p.includes("inventory") || p.includes("GRN") || p.includes("Issue material") || p.includes("stock") || p.includes("View")],
  ["Purchase Manager", "Owns procurement, PO and vendor flow", 2, (p) => p.includes("PO") || p.includes("material request") || p.includes("View")],
  ["Labour Manager", "Manages labour attendance and contractors", 2, (p) => p.includes("labour") || p.includes("attendance") || p.includes("contractor") || p.includes("View")],
  ["Accountant", "Finance visibility and cost reports", 2, (p) => p.includes("View") || p.includes("Export")],
  ["Viewer", "Read-only visibility across dashboards and reports", 5, (p) => p.startsWith("View")],
];

export const roles: Role[] = roleDefs.map((r, i) => ({
  id: `R-${String(i + 1).padStart(3, "0")}`,
  name: r[0], description: r[1], users: r[2], system: true,
  permissions: allPerms.filter(r[3]),
}));

export const approvals: Approval[] = [
  ...dprs.filter((d) => d.status === "Submitted").map((d, i) => ({
    id: `AP-${5000 + i}`, type: "DPR" as const, projectId: d.projectId, requestedBy: d.engineer,
    detail: d.taskName.split(" — ")[0], value: `${d.qtyCompleted} ${d.uom}`, pendingWith: d.pendingWith,
    ageDays: i + 1, priority: (["Medium", "High", "Critical"] as const)[i % 3], status: "Pending" as const,
  })),
  ...materialRequests.filter((m) => m.status === "Submitted").map((m, i) => ({
    id: `AP-${5100 + i}`, type: "Material Request" as const, projectId: m.projectId, requestedBy: m.requestedBy,
    detail: m.materialName, value: `${m.qty} ${m.uom}`, pendingWith: "Divya Iyer",
    ageDays: i + 1, priority: m.priority, status: "Pending" as const,
  })),
  ...purchaseOrders.filter((p) => p.status === "Draft").map((p, i) => ({
    id: `AP-${5200 + i}`, type: "Purchase Order" as const, projectId: p.projectId, requestedBy: "Divya Iyer",
    detail: `${p.id} — ${p.vendor}`, value: `₹${(p.amount / 100000).toFixed(1)}L`, pendingWith: "Anita Deshmukh",
    ageDays: i + 2, priority: "High" as const, status: "Pending" as const,
  })),
  { id: "AP-5300", type: "GRN", projectId: "P-003", requestedBy: "Sameer Khan", detail: "GRN-2044 receipt", value: "180 Bags", pendingWith: "Vikram Rao", ageDays: 1, priority: "Medium", status: "Pending" },
  { id: "AP-5301", type: "Labour Attendance", projectId: "P-008", requestedBy: "Imran Ali", detail: "Tower B attendance", value: "42 workers", pendingWith: "Rahul Joshi", ageDays: 2, priority: "Low", status: "Pending" },
  { id: "AP-5302", type: "Stock Adjustment", projectId: "P-005", requestedBy: "Sameer Khan", detail: "Cement variance", value: "-14 Bags", pendingWith: "Vikram Rao", ageDays: 3, priority: "High", status: "Pending" },
  { id: "AP-5303", type: "Task Closure", projectId: "P-011", requestedBy: "Arjun Menon", detail: "Corridor painting", value: "100% done", pendingWith: "Meera Nair", ageDays: 1, priority: "Medium", status: "Pending" },
];

export const activities: Activity[] = [
  { id: "a1", text: "DPR submitted for Tower A / Floor 2 — Internal plastering", time: "8 mins ago", projectId: "P-001", type: "dpr" },
  { id: "a2", text: "Material request approved for 500 bags Cement OPC 53", time: "34 mins ago", projectId: "P-003", type: "material" },
  { id: "a3", text: "GRN created for PO-1024 — stock updated", time: "1 hour ago", projectId: "P-002", type: "material" },
  { id: "a4", text: "Labour attendance submitted by Site Engineer for Tower B", time: "2 hours ago", projectId: "P-008", type: "labour" },
  { id: "a5", text: "Task delayed — Bathroom waterproofing due to material shortage", time: "3 hours ago", projectId: "P-006", type: "task" },
  { id: "a6", text: "Role permissions updated for Store Manager", time: "5 hours ago", type: "role" },
  { id: "a7", text: "Purchase order PO-1021 sent to JSW Steel Depot", time: "Yesterday", projectId: "P-004", type: "material" },
  { id: "a8", text: "Project risk raised to Critical — Elite County Towers", time: "Yesterday", projectId: "P-008", type: "task" },
];

export const notifications: Notification[] = [
  { id: "n1", title: "3 DPRs pending your approval", detail: "Skyline Heights, Metro Square, Lakeview", time: "10 mins ago", kind: "dpr" },
  { id: "n2", title: "Low stock alert: PVC Pipe 25mm", detail: "90 m left · below minimum 500 m", time: "40 mins ago", kind: "stock" },
  { id: "n3", title: "Labour shortage at Elite County Towers", detail: "Plastering crew 40% under plan", time: "1 hour ago", kind: "labour" },
  { id: "n4", title: "Task delayed: Bathroom waterproofing", detail: "Tower B / Floor 4 — 6 days behind", time: "2 hours ago", kind: "task" },
  { id: "n5", title: "PO delivery due tomorrow", detail: "PO-1022 · Kajaria Tiles Hub", time: "4 hours ago", kind: "po" },
];
