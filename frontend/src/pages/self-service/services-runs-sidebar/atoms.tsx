import { API_URL } from "@/config";
import { makeQueryAtoms } from "@/lib/make-query-atoms";
import { selectedCatalogSlugAtom } from "../catalog-list/atoms";
import { SELF_SERVICE } from "../atoms";
import { atomWithSwr } from "@/lib/atom-with-swr";

export const [runsAtom, runsStatusAtom] = makeQueryAtoms<string, any[]>(
  `catalogs-runs`,
  () => `${API_URL}/${SELF_SERVICE}/runs`,
  (params) => () => {
    return fetch(params as string)
      .then((res) => res.json())
      .then((data) => data.results);
  },
);

export const runsSwrAtom = atomWithSwr(runsAtom);

export const [catalogRunsAtom, catalogRunsStatusAtom] = makeQueryAtoms<
  string,
  any[]
>(
  `catalogs-${1}-runs`,
  (get) => {
    const selectedCatalogSlug = get(selectedCatalogSlugAtom);

    return `${API_URL}/${SELF_SERVICE}/${selectedCatalogSlug}/runs`;
  },
  (params) => () => {
    return fetch(params as string)
      .then((res) => res.json())
      .then((data) => data.results);
  },
);
