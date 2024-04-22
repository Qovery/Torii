import { BoltIcon, QueueListIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Link, useLocation } from "react-router-dom";

interface SidebarNavItem {
  path: string;
  name: string;
  icon: React.ElementType;
}

interface SidebarNavItemProps {
  item: SidebarNavItem;
}

const SidebarNavItem = ({ item }: SidebarNavItemProps) => {
  const { pathname } = useLocation();
  const splitted = pathname.split("/");

  return (
    <Link
      to={item.path}
      className={clsx(
        "group flex items-center gap-x-3 rounded-md p-2 px-3 text-sm leading-6 text-gray-900 hover:bg-gray-50 hover:text-indigo-600",
        item.path.includes(splitted[splitted.length - 1]) && "text-indigo-600",
      )}
    >
      <item.icon className="size-5"></item.icon>
      {item.name}
    </Link>
  );
};

export const SidebarNav = () => {
  const routes = [
    {
      name: "Self service",
      path: "/self-service",
      icon: BoltIcon,
    },
    {
      name: "Run history",
      path: "./run-history",
      icon: QueueListIcon,
    },
  ];

  return (
    <aside className="min-h-[calc(100vh-65px)] min-w-[240px] overflow-y-auto border-r border-solid border-gray-200 px-6 py-4">
      <ul className="-mx-2 space-y-1">
        {routes.map((route, index) => (
          <li key={index}>
            <SidebarNavItem item={route} />
          </li>
        ))}
      </ul>
    </aside>
  );
};
