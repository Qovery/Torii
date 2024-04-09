import { pageTitleAtom } from "@/atoms/navigation.atoms";
import { useAtomValue } from "jotai";

export function Subheader() {
  const pageTitle = useAtomValue(pageTitleAtom);

  return (
    <header>
      <div className="px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
          {pageTitle}
        </h1>
      </div>
    </header>
  );
}

export default Subheader;
