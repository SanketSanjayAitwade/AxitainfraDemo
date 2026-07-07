import { createFileRoute } from "@tanstack/react-router";
import { DoorOpen, CheckCircle2, Clock3, ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { hrOnboarding, hrEmployees } from "@/data/hr";

export const Route = createFileRoute("/hr/onboarding")({
  component: OnboardingPage,
});

function OnboardingPage() {
  const completed = hrOnboarding.filter((task) => task.status === "Completed").length;
  const progress = Math.round((completed / hrOnboarding.length) * 100);
  const pending = hrOnboarding.filter((task) => task.status === "Pending").length;

  return (
    <div>
      <PageHeader
        title="Onboarding"
        description="Mock new-joiner workflow from documents to site access."
        crumbs={[{ label: "HR", to: "/hr" }, { label: "Onboarding" }]}
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="Completed" value={completed} icon={CheckCircle2} tone="success" />
        <StatCard label="Pending" value={pending} icon={Clock3} tone="warning" />
        <StatCard label="Progress" value={`${progress}%`} icon={DoorOpen} tone="primary" />
        <StatCard
          label="New joiners"
          value={hrEmployees.filter((employee) => employee.points < 70).length}
          icon={ClipboardList}
          tone="info"
        />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <CardTitle>Onboarding checklist</CardTitle>
            <CardDescription>Mock operational tasks for new hires.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={progress} className="h-2.5" />
            {hrOnboarding.map((task) => (
              <div key={task.id} className="rounded-xl border p-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold">{task.title}</div>
                    <div className="text-xs text-muted-foreground">Owner: {task.owner}</div>
                  </div>
                  <Badge
                    variant={
                      task.status === "Completed"
                        ? "default"
                        : task.status === "In progress"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {task.status}
                  </Badge>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">Due: {task.due}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>New joiner pool</CardTitle>
            <CardDescription>
              Employees with lower tracking points, treated as new or recently moved staff in this
              mock.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[...hrEmployees]
              .sort((a, b) => a.points - b.points)
              .slice(0, 6)
              .map((employee) => (
                <div key={employee.id} className="rounded-xl border p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">{employee.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {employee.role} - {employee.site}
                      </div>
                    </div>
                    <span className="text-sm font-semibold tabular-nums">
                      {employee.points} pts
                    </span>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
