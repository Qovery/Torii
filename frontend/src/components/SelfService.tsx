import EmptyState from "@/components/EmptyState.tsx";
import SelfServiceCard from "@/components/SelfServiceCard.tsx";
import {TargetIcon} from "lucide-react";
import SelfServiceSlideOver from "@/components/SelfServiceSlideOver.tsx";
import {useState} from "react";
import {Transition} from "@headlessui/react";
import {TrashIcon} from "@heroicons/react/24/outline";

interface Props {
  catalogSlug: string
  services: any[]
}

function getIcon(icon?: string): JSX.Element {
  switch (icon?.toLowerCase()) {
    case 'target':
      return <TargetIcon className="h-6 w-6" aria-hidden="true"/>
    case 'trash':
      return <TrashIcon className="h-6 w-6" aria-hidden="true"/>
    default:
      return <TargetIcon className="h-6 w-6" aria-hidden="true"/>
  }
}

export default function SelfService({catalogSlug, services}: Props) {
  const [showSideOver, setShowSideOver] = useState({show: false, service: {}}) // pass service

  if (services.length === 0) {
    return <EmptyState text="No Services" subText="This catalog has no services."/>
  }

  return <>
    <div className="min-w-0 flex-1 my-5">
      <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
        {catalogSlug}
      </h2>
    </div>
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-gray-200 shadow sm:grid sm:grid-cols-3 sm:gap-px sm:divide-y-0">
      {
        services.map((service, idx) => {
          return <SelfServiceCard
            key={service.name}
            title={service.name}
            description={service.description}
            icon={getIcon(service.icon)}
            index={idx}
            totalCards={services.length}
            onClick={() => {
              setShowSideOver({show: true, service: service})
            }}/>
        })
      }
    </div>
    <Transition show={showSideOver.show}>
      <SelfServiceSlideOver service={showSideOver.service} onClose={() => setShowSideOver({show: false, service: showSideOver.service})}/>
    </Transition>
  </>
}
