import { Badge } from "@/components/ui/badge";
import type { HrEmployee } from "@/data/hr";
import { cn } from "@/lib/utils";

const statusTone: Record<HrEmployee["status"], string> = {
  "At office": "bg-emerald-500",
  "On site": "bg-sky-500",
  "In transit": "bg-amber-500",
  "On leave": "bg-violet-500",
  Offline: "bg-slate-500",
};

export function HrTrackingMap({ employees }: { employees: HrEmployee[] }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800/70 bg-slate-950 text-slate-100 shadow-2xl">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.12) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.18),transparent_0_28%),radial-gradient(circle_at_80%_15%,rgba(59,130,246,0.12),transparent_0_24%),radial-gradient(circle_at_50%_90%,rgba(245,158,11,0.12),transparent_0_22%)]" />

      <div className="relative aspect-[16/9] min-h-[420px]">
        <div className="absolute left-[14%] top-[18%] rounded-2xl border border-white/10 bg-white/6 px-3 py-2 text-xs text-slate-200 backdrop-blur">
          Bengaluru hub
        </div>
        <div className="absolute left-[58%] top-[40%] rounded-2xl border border-white/10 bg-white/6 px-3 py-2 text-xs text-slate-200 backdrop-blur">
          Mumbai cluster
        </div>
        <div className="absolute left-[34%] top-[68%] rounded-2xl border border-white/10 bg-white/6 px-3 py-2 text-xs text-slate-200 backdrop-blur">
          Hyderabad zone
        </div>
        <div className="absolute right-[12%] top-[22%] rounded-2xl border border-white/10 bg-white/6 px-3 py-2 text-xs text-slate-200 backdrop-blur">
          Noida office
        </div>

        {employees.map((employee) => (
          <div
            key={employee.id}
            className="group absolute"
            style={{ left: `${employee.x}%`, top: `${employee.y}%` }}
          >
            <div className="relative">
              <span
                className={cn(
                  "absolute inset-0 -z-10 rounded-full blur-md opacity-60",
                  statusTone[employee.status],
                )}
              />
              <button
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/90 text-[10px] font-bold text-white shadow-lg transition-transform group-hover:scale-110",
                  statusTone[employee.status],
                )}
                title={`${employee.name} - ${employee.status}`}
              >
                {employee.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </button>
              <div className="absolute left-1/2 top-12 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[11px] text-slate-100 backdrop-blur">
                {employee.name}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative border-t border-white/10 bg-slate-950/90 px-4 py-3">
        <div className="flex flex-wrap gap-2">
          {(["At office", "On site", "In transit", "On leave", "Offline"] as const).map(
            (status) => (
              <Badge
                key={status}
                variant="outline"
                className="border-white/10 bg-white/5 text-slate-100"
              >
                <span className={cn("mr-2 h-2 w-2 rounded-full", statusTone[status])} />
                {status}
              </Badge>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
