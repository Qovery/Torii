import { API_URL } from "@/config";
import { Catalog, Service } from "@/types/catalog.type";
import { atom } from "jotai";
import { MutationOptions, atomWithMutation } from "jotai-tanstack-query";

import { ExecuteServicePayload } from "./create-service-dialog";
import { SELF_SERVICE } from "../atoms";
import {
  selectedServiceSlugAtom,
  selectedCatalogSlugAtom,
  catalogsSwrAtom,
} from "../catalog-list/atoms";

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
    (catalog: Catalog) => catalog.slug === selectedCatalogSlug,
  );

  if (!catalog) {
    return null;
  }

  return (
    catalog.actions.find(
      (service: Service) => service.slug === selectedServiceSlug,
    ) || null
  );
});

export const executeServiceMutation = atomWithMutation((get) => {
  const selectedServiceSlug = get(selectedServiceSlugAtom);
  const selectedCatalogSlug = get(selectedCatalogSlugAtom);

  return {
    mutationKey: ["executeService"],
    mutationFn: async (payload: ExecuteServicePayload) => {
      return fetch(
        `${API_URL}/${SELF_SERVICE}/${selectedCatalogSlug}/actions/${selectedServiceSlug}/execute`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ payload }),
        },
      );
    },
  } as MutationOptions<any, unknown, ExecuteServicePayload, unknown>;
});
