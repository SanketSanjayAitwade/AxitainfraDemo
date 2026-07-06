import { cn } from "@/lib/utils";

const map: Record<string, string> = {
  "On Track": "bg-success-soft text-success border-success/30",
  Completed: "bg-info-soft text-info border-info/30",
  Delayed: "bg-warning-soft text-warning-foreground border-warning/40",
  "At Risk": "bg-warning-soft text-warning-foreground border-warning/40",
  Critical: "bg-danger-soft text-danger border-danger/30",
  Good: "bg-success-soft text-success border-success/30",
  Fair: "bg-info-soft text-info border-info/30",
  // task
  "In Progress": "bg-info-soft text-info border-info/30",
  "Not Started": "bg-neutral-soft text-muted-foreground border-border",
  "On Hold": "bg-warning-soft text-warning-foreground border-warning/40",
  // dpr / req / po
  Submitted: "bg-info-soft text-info border-info/30",
  Approved: "bg-success-soft text-success border-success/30",
  Rejected: "bg-danger-soft text-danger border-danger/30",
  Draft: "bg-neutral-soft text-muted-foreground border-border",
  Issued: "bg-success-soft text-success border-success/30",
  "Partially Issued": "bg-warning-soft text-warning-foreground border-warning/40",
  "Converted to PO": "bg-info-soft text-info border-info/30",
  "Sent to Vendor": "bg-info-soft text-info border-info/30",
  "Partially Received": "bg-warning-soft text-warning-foreground border-warning/40",
  Received: "bg-success-soft text-success border-success/30",
  Closed: "bg-neutral-soft text-muted-foreground border-border",
  Pending: "bg-warning-soft text-warning-foreground border-warning/40",
  Active: "bg-success-soft text-success border-success/30",
  Inactive: "bg-neutral-soft text-muted-foreground border-border",
  // risk / priority
  Low: "bg-success-soft text-success border-success/30",
  Medium: "bg-info-soft text-info border-info/30",
  High: "bg-warning-soft text-warning-foreground border-warning/40",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        map[status] ?? "bg-neutral-soft text-muted-foreground border-border",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}
