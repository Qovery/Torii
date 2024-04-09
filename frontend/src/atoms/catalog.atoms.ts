import { API_URL } from "@/config";
import { atomWithSwr } from "@/lib/atom-with-swr";
import { makeQueryAtoms } from "@/lib/make-query-atoms";
import { Catalog, Service } from "@/types/catalog.type";
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

export const selectedServiceAtom = atom<Service | null>((get) => {
  const selectedServiceSlug = get(selectedServiceSlugAtom);
  const selectedCatalogSlug = get(selectedCatalogSlugAtom);
  const catalogs = get(catalogsSwrAtom) as any;

  if (
    !selectedServiceSlug ||
    !selectedCatalogSlug ||
    catalogs.status !== "success"
  ) {
    return null;
  }

  const catalog = catalogs.data.find(
    (catalog: Catalog) => catalog.slug === selectedCatalogSlug
  );

  if (!catalog) {
    return null;
  }

  return (
    catalog.services.find(
      (service: Service) => service.slug === selectedServiceSlug
    ) || null
  );
});
