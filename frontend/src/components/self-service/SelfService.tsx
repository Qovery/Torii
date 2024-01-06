import {useState} from "react";
import {classNames} from "@/lib/utils.ts";
import SelfServiceTabService from "@/components/self-service/SelfServiceTabService.tsx";
import SelfServiceTabRun from "@/components/self-service/SelfServiceTabRun.tsx";

const tabs = [
  {name: 'Services', href: '#', current: true},
  {name: 'Runs', href: '#', current: false},
]

interface Props {
  catalogSlug: string
  services: any[]
}


export default function SelfService({catalogSlug, services}: Props) {
  const [activeTab, setActiveTab] = useState(tabs[0])

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
      activeTab.name === 'Services' && <SelfServiceTabService catalogSlug={catalogSlug} services={services}/>
    }

    {
      activeTab.name === 'Runs' && <SelfServiceTabRun catalogSlug={catalogSlug}/>
    }

  </>
}
