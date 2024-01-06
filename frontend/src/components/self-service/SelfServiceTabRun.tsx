import EmptyState from "@/components/common/EmptyState.tsx";
import {useQuery} from "@tanstack/react-query";
import {API_URL} from "@/config.ts";
import {useEffect, useState} from "react";
import SelfServiceRunTable from "@/components/self-service/SelfServiceRunTable.tsx";

interface Props {
  catalogSlug: string
}

export default function SelfServiceTabRun({catalogSlug}: Props) {
  const [runs, setRuns] = useState([])

  const {status, data} = useQuery({
    queryKey: [`catalogs-${catalogSlug}-runs`],
    queryFn: () =>
      fetch(`${API_URL}/catalogs/${catalogSlug}/runs`).then(
        (res) => res.json(),
      ),
  })

  useEffect(() => {
    if (status === 'success') {
      setRuns(data.results)
    }
  }, [status, data]);

  if (runs.length === 0) {
    return <div className="my-5">
      <EmptyState text="No Runs" subText="This catalog has no runs"/>
    </div>
  }

  return <SelfServiceRunTable runs={runs}/>
}
