import { BeakerIcon, HomeIcon } from "@heroicons/react/24/outline";
import { Outlet } from "react-router-dom";
import { Header } from "@/components/Header";
import { RouteItem } from "@/components/NavigationItem";
import Subheader from "@/components/Subheader";
import { pageTitleAtom } from "./atoms";
import { useAtomValue } from "jotai";

export default function AppShell() {
  const pageTitle = useAtomValue(pageTitleAtom);

  const routes = [
    new RouteItem("Dashboard", "/dashboard", HomeIcon, false, false),
    new RouteItem("Self Service", "/self-service", BeakerIcon, true, false),
  ];

  return (
    <>
      <div className="min-h-full">
        <Header routes={routes} userMenu={routes} />
        <div className="py-10">
          <div className="mb-6">
            <Subheader pageTitle={pageTitle} />
          </div>
          <main>
            <div className="sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
