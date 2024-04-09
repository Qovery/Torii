import { API_URL } from "@/config";
import { atomWithSwr } from "@/lib/atom-with-swr";
import { makeQueryAtoms } from "@/lib/make-query-atoms";
import { Catalog } from "@/types/catalog.type";
import { atom } from "jotai";

export const selectedServiceSlugAtom = atom<string | null>(null);

export const selectedCatalogSlugAtom = atom<string | null>(null);

export const [catalogsAtom, catalogsStatusAtom] = makeQueryAtoms<
  string,
  Catalog[]
>(
  "catalogs",
  () => `${API_URL}/catalogs`,
  (params) => () => {
    return fetch(params)
      .then((res) => res.json())
      .then((data) => data.results);
  }
);

export const catalogsSwrAtom = atomWithSwr(catalogsAtom);
