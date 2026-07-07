import { createFileRoute } from "@tanstack/react-router";
import { BriefcaseBusiness, Users, UserRoundSearch, CircleCheckBig } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { hrRecruitment } from "@/data/hr";

export const Route = createFileRoute("/hr/recruitment")({
  component: RecruitmentPage,
});

function RecruitmentPage() {
  const applicants = hrRecruitment.reduce((sum, role) => sum + role.applicants, 0);
  const shortlists = hrRecruitment.reduce((sum, role) => sum + role.shortlists, 0);
  const openings = hrRecruitment.reduce((sum, role) => sum + role.openings, 0);

  return (
    <div>
      <PageHeader
        title="Recruitment"
        description="Mock hiring funnel with applicant volume, shortlists, and role openings."
        crumbs={[{ label: "HR", to: "/hr" }, { label: "Recruitment" }]}
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="Open roles" value={openings} icon={BriefcaseBusiness} tone="primary" />
        <StatCard label="Applicants" value={applicants} icon={Users} tone="info" />
        <StatCard label="Shortlisted" value={shortlists} icon={UserRoundSearch} tone="success" />
        <StatCard
          label="Offers"
          value={hrRecruitment.filter((role) => role.stage === "Offer").length}
          icon={CircleCheckBig}
          tone="warning"
        />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-4">
        {(["Sourcing", "Screening", "Interview", "Offer"] as const).map((stage) => {
          const items = hrRecruitment.filter((role) => role.stage === stage);
          return (
            <Card key={stage} className="min-h-[320px]">
              <CardHeader>
                <CardTitle>{stage}</CardTitle>
                <CardDescription>{items.length} role(s)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {items.map((role) => (
                  <div key={role.id} className="rounded-xl border p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-sm font-semibold">{role.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {role.department} - {role.location}
                        </div>
                      </div>
                      <Badge variant="outline">{role.openings} open</Badge>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div>{role.applicants} applicants</div>
                      <div>{role.shortlists} shortlists</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
