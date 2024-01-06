import EmptyState from "@/components/common/EmptyState.tsx";
import SelfServiceCard from "@/components/self-service/SelfServiceCard.tsx";
import {TargetIcon} from "lucide-react";
import SelfServiceSlideOver from "@/components/self-service/SelfServiceSlideOver.tsx";
import {useState} from "react";
import {Transition} from "@headlessui/react";
import {TrashIcon} from "@heroicons/react/24/outline";
import {classNames} from "@/lib/utils.ts";

const tabs = [
  {name: 'Services', href: '#', current: true},
  {name: 'Runs', href: '#', current: false},
]

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
  const [activeTab, setActiveTab] = useState(tabs[0])
  const [showSideOver, setShowSideOver] = useState({show: false, service: {}}) // pass service

  return <>
    <div className="border-b border-gray-200">
      <div className="sm:flex sm:items-baseline">
        <h3 className="text-base font-semibold leading-6 text-gray-900">{catalogSlug}</h3>
        <div className="mt-4 sm:ml-10 sm:mt-0">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <a
                key={tab.name}
                href={tab.href}
                onClick={() =>
                  setActiveTab(tab)
                }
                className={classNames(
                  tab.current === activeTab.current
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  'whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium'
                )}
                aria-current={tab.current ? 'page' : undefined}
              >
                {tab.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>

    {
      activeTab.name === 'Services' && services.length === 0 &&
      <div className="my-5">
        <EmptyState text="No Services" subText="This catalog has no services."/>
      </div>
    }

    {
      activeTab.name === 'Services' && services.length > 0 && <>
        <div className="my-5 divide-y divide-gray-200 overflow-hidden rounded-lg bg-gray-200 shadow sm:grid sm:grid-cols-3 sm:gap-px sm:divide-y-0">
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
          <SelfServiceSlideOver service={showSideOver.service} onClose={() => setShowSideOver({
            show: false,
            service: showSideOver.service
          })} catalogSlug={catalogSlug}/>
        </Transition>
      </>
    }

    {
      activeTab.name === 'Runs' && <>
        <div className="my-5">
          <EmptyState text="No Runs" subText="This catalog has no runs"/>
        </div>
      </>
    }

  </>
}
