import { Provider } from "jotai";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import ServicesRunsSidebar from "./services-runs-sidebar/services-runs-sidebar";
import { SidebarNav } from "./sidebar-nav/sidebar-nav";

export function SelfService() {
  return (
    <Provider>
      <div className="flex">
        <SidebarNav />
        <div className="relative flex size-full max-w-full flex-col overflow-y-auto px-4 py-10 sm:px-6 lg:px-8">
          <Outlet />
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <ServicesRunsSidebar />
        </Suspense>
      </div>
    </Provider>
  );
}

export default SelfService;
