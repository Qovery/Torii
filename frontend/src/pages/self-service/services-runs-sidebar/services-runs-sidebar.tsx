import EmptyState from "@/components/EmptyState";
import { useAtom } from "jotai";
import ServiceRunsTable from "./service-runs-table";
import { runsAtom } from "./atoms";

export default function ServicesRunsSidebar() {
  const [{ data }] = useAtom(runsAtom);

  if (data.length === 0) {
    return (
      <div className="my-5">
        <EmptyState text="No Runs" subText="This catalog has no runs" />
      </div>
    );
  }

  return <ServiceRunsTable runs={data} />;
}
