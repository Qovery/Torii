import { Header } from "@/components/Header";
import { RouteItem } from "@/components/NavigationItem";
import { BeakerIcon, HomeIcon } from "@heroicons/react/24/outline";
import { Outlet } from "react-router-dom";

export default function AppShell() {
  const routes = [
    new RouteItem("Dashboard", "/dashboard", HomeIcon, false, false),
    new RouteItem("Self Service", "/self-service", BeakerIcon, true, false),
  ];

  return (
    <div className="min-h-full">
      <Header routes={routes} userMenu={routes} />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
