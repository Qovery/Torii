import { runsAtom } from "@/atoms/run.atoms";
import EmptyState from "@/components/common/EmptyState.tsx";
import SelfServiceRunTable from "@/components/self-service/SelfServiceRunTable.tsx";
import { useAtom } from "jotai";

export default function SelfServiceRunSidebar() {
  const [{ data, status, error }] = useAtom(runsAtom);

  if (data.length === 0) {
    return (
      <div className="my-5">
        <EmptyState text="No Runs" subText="This catalog has no runs" />
      </div>
    );
  }

  return <SelfServiceRunTable runs={data} />;
}
