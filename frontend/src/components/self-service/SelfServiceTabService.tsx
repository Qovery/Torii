import {useState} from "react";
import EmptyState from "@/components/common/EmptyState.tsx";
import SelfServiceCard from "@/components/self-service/SelfServiceCard.tsx";
import {Transition} from "@headlessui/react";
import SelfServiceSlideOver from "@/components/self-service/SelfServiceSlideOver.tsx";

interface Props {
  catalogSlug: string
  services: any[]
}

export default function SelfServiceTabService({catalogSlug, services}: Props) {
  const [showSideOver, setShowSideOver] = useState({show: false, service: {}}) // pass service

  if (services.length === 0) {
    return <div className="my-5">
      <EmptyState text="No Services" subText="This catalog has no services."/>
    </div>
  }

  return <>
    <div className="my-5 divide-y divide-gray-200 overflow-hidden rounded-lg bg-gray-200 shadow sm:grid sm:grid-cols-3 sm:gap-px sm:divide-y-0">
      {
        services.map((service, idx) => {
          return <SelfServiceCard
            key={service.name}
            title={service.name}
            description={service.description}
            icon={service.icon}
            iconColor={service.icon_color}
            index={idx}
            totalCards={services.length}
            onClick={() => {
              setShowSideOver({show: true, service: service})
            }}/>
        })
      }
    </div>
    <Transition show={showSideOver.show}>
      <SelfServiceSlideOver service={showSideOver.service} onClose={() => setShowSideOver({
        show: false,
        service: showSideOver.service
      })} catalogSlug={catalogSlug}/>
    </Transition>
  </>
}
