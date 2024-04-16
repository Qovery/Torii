import EmptyState from "@/components/EmptyState";
import { useAtom, useSetAtom } from "jotai";
import { CreateServiceDialog } from "../create-service-dialog/create-service-dialog";
import { DialogIds } from "@/enums/dialog-ids.enum";
import { dialogOpenedAtomFamily } from "@/pages/atoms";
import {
  catalogsAtom,
  selectedCatalogSlugAtom,
  selectedServiceSlugAtom,
} from "./atoms";
import ServiceCard from "./service-card";

export default function CatalogList() {
  const [{ data }] = useAtom(catalogsAtom);
  const setSelectedCatalogSlug = useSetAtom(selectedCatalogSlugAtom);
  const setSelectedServiceSlug = useSetAtom(selectedServiceSlugAtom);

  const [createDialogOpened, setCreateDialogOpened] = useAtom(
    dialogOpenedAtomFamily(DialogIds.CreateService),
  );

  if (data.length === 0) {
    return (
      <div className="my-5">
        <EmptyState
          text="No Services"
          subText="This catalog has no services."
        />
      </div>
    );
  }

  const handleOnCreateClicked = (serviceSlug: string, catalogSlug: string) => {
    setCreateDialogOpened(true);
    setSelectedCatalogSlug(catalogSlug);
    setSelectedServiceSlug(serviceSlug);
  };

  return (
    <>
      <ul role="list" className="space-y-6">
        {data.map((catalog) => (
          <li key={catalog.slug}>
            <h2 className="mb-4 text-xl font-bold">{catalog.name}</h2>
            <ul
              role="list"
              className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8"
            >
              {catalog.actions.map((service) => (
                <li key={service.slug}>
                  <ServiceCard
                    service={service}
                    onCreateClicked={() =>
                      handleOnCreateClicked(service.slug, catalog.slug)
                    }
                    onViewRunsClicked={() => {}}
                  />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      {createDialogOpened && <CreateServiceDialog />}
    </>
  );
}
