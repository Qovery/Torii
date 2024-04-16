import { pageTitleAtom } from "@/pages/atoms";
import { useSetAtom } from "jotai";
import React, { useEffect } from "react";

export function withPageTitle<T extends JSX.IntrinsicAttributes>(
  WrappedComponent: React.ComponentType<T>,
  title: string,
) {
  return function WithPageTitle(props: T) {
    const setPageTitle = useSetAtom(pageTitleAtom);

    useEffect(() => {
      setPageTitle(title);
    }, [setPageTitle]);

    return <WrappedComponent {...props} />;
  };
}
