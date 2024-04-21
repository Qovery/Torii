import { Provider } from "jotai";
import { Suspense } from "react";
import CatalogList from "./catalog-list/catalog-list";
import ServicesRunsSidebar from "./services-runs-sidebar/services-runs-sidebar";
import Subheader from "@/components/Subheader";

export function SelfService() {
  return (
    <Provider>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex">
          <div className="relative flex size-full max-w-full flex-col overflow-y-auto px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-6">
              <Subheader pageTitle={"Self Service"} />
            </div>
            <CatalogList />
          </div>
          <ServicesRunsSidebar />
        </div>
      </Suspense>
    </Provider>
  );
}

export default SelfService;
