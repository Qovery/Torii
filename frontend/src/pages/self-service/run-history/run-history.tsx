import Subheader from "@/components/Subheader";
import { useAtomValue } from "jotai";
import { Suspense } from "react";
import { runsStatusAtom, runsSwrAtom } from "../services-runs-sidebar/atoms";
import ServiceRunsTable from "./service-runs-table";

const ServiceRunsResults = () => {
  const runs = useAtomValue(runsSwrAtom);
  const status = useAtomValue(runsStatusAtom);

  return (
    <ServiceRunsTable
      rows={runs.data}
      isLoading={status && status.fetchStatus === "fetching"}
      error={null}
    />
  );
};

export const RunHistory = () => {
  return (
    <>
      <div className="mb-6">
        <Subheader pageTitle="Run history" />
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <ServiceRunsResults />
      </Suspense>
    </>
  );
};
