import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopHeader } from "@/components/layout/TopHeader";
import { useDemo } from "@/store/DemoStore";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const { currentUser, login } = useDemo();
  const navigate = useNavigate();

  // Demo convenience: if someone deep-links without "logging in", auto sign-in as Super Admin.
  useEffect(() => {
    if (!currentUser) login("Super Admin", "Vikram Rao");
  }, [currentUser, login]);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopHeader />
        <main className="flex-1 px-4 py-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
