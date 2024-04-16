import { withPageTitle } from "@/hoc/with-page-title";
import { Provider } from "jotai";
import { Suspense } from "react";
import CatalogList from "./catalog-list/catalog-list";
import ServicesRunsSidebar from "./services-runs-sidebar/services-runs-sidebar";

export function SelfService() {
  return (
    <Provider>
      <Suspense fallback={<div>Loading...</div>}>
        <CatalogList />
        <ServicesRunsSidebar />
      </Suspense>
    </Provider>
  );
}

const SelfServiceWithTitle = withPageTitle(SelfService, "Self Service");

export default SelfServiceWithTitle;
