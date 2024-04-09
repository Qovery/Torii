import { ThemeColors } from "@/enums/theme-colors.enum";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Fragment, ReactNode } from "react";
import { Button } from "../common/Button";

export interface SelfServiceCardProps {
  slug: string;
  title: string;
  description: string;
  serviceCount: number;
  icon: ReactNode;
  onCreateClicked: (slug: string) => void;
  onEditClicked: (slug: string) => void;
}

export default function SelfServiceCard({
  slug,
  title,
  description,
  serviceCount,
  icon,
  onCreateClicked,
  onEditClicked,
}: SelfServiceCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 cursor-pointer">
      <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
        <div className="h-12 w-12 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10">
          {icon}
        </div>
        <div className="text-sm font-medium leading-6 text-gray-900">
          {title}
        </div>
        <Menu as="div" className="relative ml-auto">
          <Menu.Button
            className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500"
            onClick={() => onEditClicked(slug)}
          >
            <span className="sr-only">Open options</span>
            <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={clsx(
                      active ? "bg-gray-50" : "",
                      "block px-3 py-1 text-sm leading-6 text-gray-900"
                    )}
                  >
                    View<span className="sr-only">, {title}</span>
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={clsx(
                      active ? "bg-gray-50" : "",
                      "block px-3 py-1 text-sm leading-6 text-gray-900"
                    )}
                  >
                    Edit<span className="sr-only">, {title}</span>
                  </a>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
      <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">Services</dt>
          <dd className="text-gray-700">{serviceCount || "---"}</dd>
        </div>
      </dl>
      <div className="flex py-3 px-6">
        <p className="text-gray-700">{description}</p>
      </div>
      <div className="flex justify-end py-4 px-6">
        <Button
          type="button"
          color={ThemeColors.PRIMARY}
          onClick={() => onCreateClicked(slug)}
        >
          Create
        </Button>
      </div>
    </div>
  );
}
