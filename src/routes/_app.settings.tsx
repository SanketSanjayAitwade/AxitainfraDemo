import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/_app/settings")({
  component: Settings,
});

function Settings() {
  return (
    <div>
      <PageHeader title="Settings" description="Company configuration, master data and workflow preferences." crumbs={[{ label: "Home", to: "/dashboard" }, { label: "Settings" }]} />
      <Tabs defaultValue="company">
        <TabsList className="mb-4 flex-wrap h-auto">
          {["company", "master data", "workflows", "notifications", "backup"].map((t) => <TabsTrigger key={t} value={t} className="capitalize">{t}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="company">
          <Card><CardHeader><CardTitle>Company Details</CardTitle><CardDescription>Branding and organisation profile</CardDescription></CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <div><Label>Company name</Label><Input className="mt-1" defaultValue="Axita Infrastructure Pvt Ltd" /></div>
              <div><Label>GSTIN</Label><Input className="mt-1" defaultValue="29ABCDE1234F1Z5" /></div>
              <div><Label>Head office</Label><Input className="mt-1" defaultValue="Bengaluru, Karnataka" /></div>
              <div><Label>Contact email</Label><Input className="mt-1" defaultValue="ops@axitainfra.in" /></div>
              <div className="sm:col-span-2 rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">🏗️ Company logo / branding placeholder</div>
              <div className="sm:col-span-2"><Button onClick={() => toast.success("Company settings saved")}>Save Changes</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="master data" className="space-y-4">
          <MasterCard title="Project Categories" items={["Residential", "Commercial", "Warehousing", "Mixed Use", "Infrastructure"]} />
          <MasterCard title="Material Categories" items={["Cement", "Steel", "Aggregate", "Masonry", "Finishing", "Paint", "Chemical", "Plumbing", "Electrical"]} />
          <MasterCard title="Labour Trades" items={["Civil", "Blockwork", "Plastering", "Waterproofing", "Painting", "Tiling", "Electrical", "Plumbing", "Flooring", "Finishing"]} />
        </TabsContent>

        <TabsContent value="workflows">
          <Card><CardHeader><CardTitle>Approval Workflows</CardTitle><CardDescription>Multi-level approval routing</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              {["DPR → Project Manager → Project Director", "Material Request → Purchase Manager → Project Director", "Purchase Order → Project Director → Super Admin", "Stock Adjustment → Store Manager → Super Admin"].map((w) => (
                <div key={w} className="flex items-center justify-between rounded-lg border p-3 text-sm"><span>{w}</span><Badge variant="secondary">Active</Badge></div>
              ))}
              <Button onClick={() => toast.success("Workflow settings saved")}>Save Workflows</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card><CardHeader><CardTitle>Notification Settings</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {["Pending DPR approvals", "Low stock alerts", "Labour shortage alerts", "Delayed task alerts", "PO delivery reminders"].map((n) => (
                <div key={n} className="flex items-center justify-between rounded-lg border p-3 text-sm"><span>{n}</span><Switch defaultChecked /></div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup">
          <Card><CardHeader><CardTitle>Data Backup</CardTitle><CardDescription>Automated backups & retention</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3 text-sm"><span>Daily automated backup</span><Switch defaultChecked /></div>
              <div className="flex items-center justify-between rounded-lg border p-3 text-sm"><span>Retention period</span><Badge variant="secondary">90 days</Badge></div>
              <Button variant="secondary" onClick={() => toast.success("Backup triggered", { description: "Demo export generated successfully" })}>Run Backup Now</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MasterCard({ title, items }: { title: string; items: string[] }) {
  return (
    <Card><CardHeader><CardTitle className="text-base">{title}</CardTitle></CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {items.map((i) => <Badge key={i} variant="secondary" className="text-sm">{i}</Badge>)}
        <Badge variant="outline" className="cursor-pointer text-sm" onClick={() => toast.info("Add new item")}>+ Add</Badge>
      </CardContent>
    </Card>
  );
}
