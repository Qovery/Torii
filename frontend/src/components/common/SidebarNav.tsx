import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import NavigationItem, { RouteItem } from "./NavigationItem";
import { Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react";
import { useAtom } from "jotai";
import { sidebarNavOpenAtom } from "@/atoms/navigation.atoms";

export interface SidebarNavProps {
  routes: RouteItem[];
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

export function MobileSidebarNav({
  routes,
  isOpen,
  setIsOpen,
}: SidebarNavProps) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50 lg:hidden" onClose={() => null}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/80" />
        </Transition.Child>

        <div className="fixed inset-0 flex">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button
                    type="button"
                    className="-m-2.5 p-2.5"
                    onClick={() => setIsOpen && setIsOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </Transition.Child>
              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                <div className="flex h-16 shrink-0 items-center">
                  {/*<img*/}
                  {/*  className="h-8 w-auto"*/}
                  {/*  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"*/}
                  {/*  alt="Your Company"*/}
                  {/*/>*/}
                  <h1 className="text-2xl font-semibold text-gray-900">
                    Torii ⛩️
                  </h1>
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {routes.map((route) => (
                          <NavigationItem key={route.name} item={route} />
                        ))}
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export function SidebarNav({ routes }: SidebarNavProps) {
  const [sidebarNavOpen, setSidebarNavOpen] = useAtom(sidebarNavOpenAtom);

  return (
    <>
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
          <div className="flex h-16 shrink-0 items-center">
            {/*<img*/}
            {/*  className="h-8 w-auto"*/}
            {/*  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"*/}
            {/*  alt="Your Company"*/}
            {/*/>*/}
            <h1 className="text-2xl font-semibold text-gray-900">Torii ⛩️</h1>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {routes.map((item) => (
                    <NavigationItem key={item.name} item={item} />
                  ))}
                </ul>
              </li>
              {/*<li className="-mx-6 mt-auto">*/}
              {/*  <a*/}
              {/*    href="#"*/}
              {/*    className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"*/}
              {/*  >*/}
              {/*    <img*/}
              {/*      className="h-8 w-8 rounded-full bg-gray-50"*/}
              {/*      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"*/}
              {/*      alt=""*/}
              {/*    />*/}
              {/*    <span className="sr-only">Your profile</span>*/}
              {/*    <span aria-hidden="true">Tom Cook</span>*/}
              {/*  </a>*/}
              {/*</li>*/}
            </ul>
          </nav>
        </div>
      </div>

      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          onClick={() => setSidebarNavOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
          {/* {currentTabTitle} */}
          Tab title here
        </div>
        {/*<a href="#">*/}
        {/*  <span className="sr-only">Your profile</span>*/}
        {/*  <img*/}
        {/*    className="h-8 w-8 rounded-full bg-gray-50"*/}
        {/*    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"*/}
        {/*    alt=""*/}
        {/*  />*/}
        {/*</a>*/}
      </div>

      <MobileSidebarNav
        routes={routes}
        isOpen={sidebarNavOpen}
        setIsOpen={setSidebarNavOpen}
      />
    </>
  );
}
