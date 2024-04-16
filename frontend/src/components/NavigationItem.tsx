import clsx from "clsx";
import { ElementType } from "react";

export class RouteItem {
  name: string;
  href: string;
  icon: ElementType;
  current: boolean;
  disabled: boolean;
  children?: ChildRouteItem[];

  constructor(
    name: string,
    href: string,
    icon: ElementType,
    current: boolean,
    disabled: boolean,
    children?: ChildRouteItem[],
  ) {
    this.name = name;
    this.href = href;
    this.icon = icon;
    this.current = current;
    this.disabled = disabled;
    this.children = children;
  }
}

export class ChildRouteItem {
  name: string;
  href: string;
  current: boolean;
  children: JSX.Element;

  constructor(
    name: string,
    href: string,
    current: boolean,
    children: JSX.Element,
  ) {
    this.name = name;
    this.href = href;
    this.current = current;
    this.children = children;
  }
}

export interface NavigationItemProps {
  item: RouteItem;
}

export function NavigationItem({ item }: NavigationItemProps): JSX.Element {
  return (
    <a
      key={item.name}
      href={item.href}
      className={clsx(
        item.current
          ? "border-indigo-500 text-gray-900"
          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
        "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium",
      )}
      aria-current={item.current ? "page" : undefined}
    >
      {item.name}
    </a>
  );
}

export default NavigationItem;
