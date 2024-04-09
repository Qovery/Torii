import { withPageTitle } from "@/hoc/with-page-title";
import { Provider } from "jotai";
import { Suspense } from "react";
import SelfServiceCatalog from "./SelfServiceCatalog";

export function SelfService() {
  return (
    <Provider>
      <Suspense fallback={<div>Loading...</div>}>
        <SelfServiceCatalog />
      </Suspense>
    </Provider>
  );
}

const SelfServiceWithTitle = withPageTitle(SelfService, "Self Service");

export default SelfServiceWithTitle;
