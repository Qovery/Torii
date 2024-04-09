import { ThemeColors } from "@/enums/theme-colors.enum";
import { Service } from "@/types/catalog.type";
import { Menu, Transition } from "@headlessui/react";
import {
  EllipsisHorizontalIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Fragment, useCallback } from "react";
import { Button } from "../common/Button";

export interface SelfServiceCardProps {
  service: Service;
  onCreateClicked: (slug: string) => void;
  onEditClicked: (slug: string) => void;
}

export default function SelfServiceCard({
  service,
  onCreateClicked,
  onEditClicked,
}: SelfServiceCardProps) {
  const getIcon = useCallback((icon: string) => {
    switch (icon?.toLowerCase()) {
      case "target":
        return <PlusIcon className="h-6 w-6" aria-hidden="true" />;
      case "trash":
        return <TrashIcon className="h-6 w-6" aria-hidden="true" />;
      default:
        return <PlusIcon className="h-6 w-6" aria-hidden="true" />;
    }
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
        <div className="h-12 w-12 flex rounded-lg bg-white object-cover justify-center items-center ring-1 ring-gray-900/10">
          {getIcon(service.icon)}
        </div>
        <div className="text-sm font-medium leading-6 text-gray-900">
          {service.name}
        </div>
        <Menu as="div" className="relative ml-auto">
          <Menu.Button
            className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500"
            onClick={() => onEditClicked(service.slug)}
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
                    View<span className="sr-only">, {service.name}</span>
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
                    Edit<span className="sr-only">, {service.name}</span>
                  </a>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
      <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">Fields</dt>
          <dd className="text-gray-700">{service.fields.length || "---"}</dd>
        </div>
      </dl>
      <div className="flex py-3 px-6">
        <p className="text-gray-700">{service.description}</p>
      </div>
      <div className="flex justify-end py-4 px-6">
        <Button
          type="button"
          color={ThemeColors.PRIMARY}
          onClick={() => onCreateClicked(service.slug)}
        >
          Create
        </Button>
      </div>
    </div>
  );
}
