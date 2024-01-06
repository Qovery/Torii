import EmptyState from "@/components/common/EmptyState.tsx";

interface Props {
  catalogSlug: string
}

export default function SelfServiceTabRun({catalogSlug}: Props) {
  console.log(catalogSlug);

  return <>
    <div className="my-5">
      <EmptyState text="No Runs" subText="This catalog has no runs"/>
    </div>
  </>
}
