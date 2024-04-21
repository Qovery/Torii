import { API_URL } from "@/config";
import { atomWithSwr } from "@/lib/atom-with-swr";
import { makeQueryAtoms } from "@/lib/make-query-atoms";
import { Catalog } from "@/types/catalog.type";
import { atom } from "jotai";
import { SELF_SERVICE } from "../atoms";

export const selectedServiceSlugAtom = atom<string | null>(null);

export const selectedCatalogSlugAtom = atom<string | null>(null);

export const [catalogsAtom, catalogsStatusAtom] = makeQueryAtoms<
  string,
  Catalog[]
>(
  "catalogs",
  () => `${API_URL}/${SELF_SERVICE}`,
  (params) => () => {
    return fetch(params)
      .then((res) => res.json())
      .then((data) => data.results);
  },
);

export const catalogsSwrAtom = atomWithSwr(catalogsAtom);

export const textSearchAtom = atom<string>("");

export const filteredCatalogsAtom = atom<Catalog[]>(async (get) => {
  const catalogs: Catalog[] = await get(catalogsSwrAtom)?.data;
  const textSearch = get(textSearchAtom);

  if (!textSearch) {
    return catalogs;
  }

  return catalogs.map((catalog) => {
    const services = catalog.actions.filter((action) =>
      action.name.toLowerCase().includes(textSearch.toLowerCase()),
    );

    return {
      ...catalog,
      actions: services,
    };
  });
});
