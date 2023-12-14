import EmptyState from "@/components/EmptyState.tsx";
import SelfServiceCard from "@/components/SelfServiceCard.tsx";
import {TargetIcon} from "lucide-react";

interface Props {
  catalogSlug: string
  services: any[]
}

export default function SelfService({catalogSlug, services}: Props) {

  if (services.length === 0) {
    return <EmptyState text="No Services" subText="This catalog has no services."/>
  }

  function getIcon(): JSX.Element {
    return <TargetIcon className="h-6 w-6" aria-hidden="true"/>
  }

  return <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-gray-200 shadow sm:grid sm:grid-cols-3 sm:gap-px sm:divide-y-0">
    {
      services.map((service, idx) => {
        return <SelfServiceCard
          key={service.name}
          title={service.name}
          description={service.description}
          icon={getIcon()}
          index={idx}
          totalCards={services.length}
          onClick={() => {
            // TODO - navigate to service page
          }}/>
      })
    }
  </div>
}
