import {Fragment, useEffect, useState} from 'react'
import {Dialog, Disclosure, Transition} from '@headlessui/react'
import {Bars3Icon, BeakerIcon, ChevronRightIcon, ClipboardIcon, HomeIcon, ShieldCheckIcon, XMarkIcon,} from '@heroicons/react/24/outline'
import {classNames} from "@/lib/utils.ts";
import {useQuery} from "@tanstack/react-query";
import {API_URL} from "@/config.ts";
import SelfService from "@/components/self-service/SelfService.tsx";

class NavigationItem {
  name: string
  href: string
  icon: any
  current: boolean
  disabled: boolean
  children?: NavigationChildrenItem[]

  constructor(name: string, href: string, icon: any, current: boolean, disabled: boolean, children?: NavigationChildrenItem[]) {
    this.name = name
    this.href = href
    this.icon = icon
    this.current = current
    this.disabled = disabled
    this.children = children
  }
}

class NavigationChildrenItem {
  name: string
  href: string
  current: boolean
  children: JSX.Element

  constructor(name: string, href: string, current: boolean, children: JSX.Element) {
    this.name = name
    this.href = href
    this.current = current
    this.children = children
  }

}

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentTabTitle, setCurrentTabTitle] = useState('Dashboard')
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([])
  const [content, setContent] = useState<JSX.Element | undefined>(undefined)

  function setCurrentTabHelper(navItem: NavigationItem, subItem?: NavigationChildrenItem) {
    if (subItem) {
      setCurrentTabTitle(`${navItem.name} > ${subItem.name}`)
    } else {
      setCurrentTabTitle(navItem.name)
    }

    setContent(subItem?.children)
  }

  const {status, data} = useQuery({
    queryKey: ['catalogs'],
    queryFn: () =>
      fetch(`${API_URL}/catalogs`).then(
        (res) => res.json(),
      ),
  })

  useEffect(() => {
    if (status === 'success') {
      const ni = [
        new NavigationItem('Dashboard', '#', HomeIcon, false, true),
        new NavigationItem('Self Service', '#', BeakerIcon, true, false, data.results.map((catalog: any): NavigationChildrenItem => {
          // populate catalogs in navigation
          return new NavigationChildrenItem(catalog.name, `/catalogs/${catalog.slug}/services`, false,
            <SelfService catalogSlug={catalog.slug} services={catalog.services}/>);
        })),
        new NavigationItem('Scorecard', '#', ClipboardIcon, false, true),
        new NavigationItem('Audit', '#', ShieldCheckIcon, false, true),
      ]

      setCurrentTabTitle(ni.find((item) => item.current)?.name || 'Dashboard')
      setNavigationItems(ni)
    }
  }, [status, data]);

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80"/>
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
                      <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true"/>
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
                      <h1 className="text-2xl font-semibold text-gray-900">Torii ⛩️</h1>
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigationItems.map((item) => getNavigationJsx(item, setCurrentTabHelper))}
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

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
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
                    {navigationItems.map((item) => getNavigationJsx(item, setCurrentTabHelper))}
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
          <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true"/>
          </button>
          <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">{currentTabTitle}</div>
          {/*<a href="#">*/}
          {/*  <span className="sr-only">Your profile</span>*/}
          {/*  <img*/}
          {/*    className="h-8 w-8 rounded-full bg-gray-50"*/}
          {/*    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"*/}
          {/*    alt=""*/}
          {/*  />*/}
          {/*</a>*/}
        </div>

        <main className="py-10 lg:pl-72">
          <div className="px-4 sm:px-6 lg:px-8">{content}</div>
        </main>
      </div>
    </>
  )
}

function getNavigationJsx(
  item: NavigationItem,
  onItemClicked: (item: NavigationItem, subItem?: NavigationChildrenItem) => void,
): JSX.Element {
  return <li key={item.name}>
    {!item.children ? (
      <a
        href={item.href}
        className={classNames(
          item.current ? 'bg-gray-50' : 'hover:bg-gray-50',
          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700',
          item.disabled && 'cursor-not-allowed opacity-50'
        )}
        onClick={() => onItemClicked(item, undefined)}
      >
        <item.icon className="h-6 w-6 shrink-0 text-gray-400" aria-hidden="true"/>
        {item.name}
      </a>
    ) : (
      <Disclosure as="div">
        {({open}) => (
          <>
            <Disclosure.Button
              className={classNames(
                item.current ? 'bg-gray-50' : 'hover:bg-gray-50',
                'flex items-center w-full text-left rounded-md p-2 gap-x-3 text-sm leading-6 font-semibold text-gray-700',
                item.disabled && 'cursor-not-allowed opacity-50'
              )}
            >
              <item.icon className="h-6 w-6 shrink-0 text-gray-400" aria-hidden="true"/>
              {item.name}
              <ChevronRightIcon
                className={classNames(
                  open ? 'rotate-90 text-gray-500' : 'text-gray-400',
                  'ml-auto h-5 w-5 shrink-0'
                )}
                aria-hidden="true"
              />
            </Disclosure.Button>
            <Disclosure.Panel as="ul" className="mt-1 px-2">
              {item.children?.map((subItem) => (
                <li key={subItem.name}>
                  {/* 44px */}
                  <Disclosure.Button
                    as="a"
                    href="#"
                    // href={subItem.href}
                    className={classNames(
                      subItem.current ? 'bg-gray-50' : 'hover:bg-gray-50',
                      'block rounded-md py-2 pr-2 pl-9 text-sm leading-6 text-gray-700'
                    )}
                    onClick={() => onItemClicked(item, subItem)}
                  >
                    {subItem.name}
                  </Disclosure.Button>
                </li>
              ))}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    )}
  </li>
}
