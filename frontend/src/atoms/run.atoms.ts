import { API_URL } from "@/config";
import { makeQueryAtoms } from "@/lib/make-query-atoms";
import { selectedCatalogSlugAtom } from "./catalog.atoms";

export const [runsAtom, runsStatusAtom] = makeQueryAtoms<string, any[]>(
  `catalogs-${1}-runs`,
  (get) => {
    const selectedCatalogSlug = get(selectedCatalogSlugAtom);

    return `${API_URL}/runs/${selectedCatalogSlug}/runs`;
  },
  (params) => () => {
    return fetch(params as string)
      .then((res) => res.json())
      .then((data) => data.results);
  }
);
